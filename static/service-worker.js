// static/service-worker.js
// Offline support for the app.
//
// This service worker caches the core application shell, the generated asset
// list, and the dynamic page routes produced from `/data/pages.json`.
//
// During `install`, we prefetch these resources so the app can work offline.
// During `fetch`, we try the network first and fall back to cached content,
// including HTML index pages for SPA-style navigation on GitHub Pages.
const CACHE_NAME = "songbook-v3"; // incrémente à chaque changement majeur

function joinPath(base, p) {
  return `${base.replace(/\/$/, '')}/${String(p).replace(/^\//, '')}`;
}

async function getAssets(base) {
  try {
    const res = await fetch(joinPath(base, 'asset-list.json'));
    const json = await res.json();
    return (json.assets || []).map(a => joinPath(base, a));
  } catch (e) {
    console.warn('[SW] getAssets failed', e);
    return [];
  }
}

async function getDynamicRoutes(base) {
  try {
    const res = await fetch(joinPath(base, 'data/pages.json'));
    const json = await res.json();
    return (json.pages || []).flatMap(p => [
      joinPath(base, `page/${p.id}`),
      joinPath(base, `page/${p.id}/index.html`)
    ]);
  } catch (e) {
    console.warn('[SW] getDynamicRoutes failed', e);
    return [];
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    console.log('[SW] install start');
    const cache = await caches.open(CACHE_NAME);
    // compute base path from service-worker location (works on GitHub Pages and dev)
    const BASE = location.pathname.replace(/\/?service-worker\.js$/, '/') ;

    const core = [
      BASE,
      joinPath(BASE, 'index.html')
    ];

    const assets = await getAssets(BASE);
    const routes = await getDynamicRoutes(BASE);

    const toCache = Array.from(new Set([...core, ...assets, ...routes])).filter(Boolean);

    // On fetch + cache.put manuellement pour tolérer les réponses HTML 404 (GitHub Pages SPA fallback)
    await Promise.all(toCache.map(async (url) => {
      try {
        const resp = await fetch(url, { credentials: 'same-origin' });
        // Si c'est du HTML (même si status !== 200), on le met en cache pour offline
        const contentType = resp.headers.get('content-type') || '';
        if (resp.ok || contentType.includes('text/html')) {
          try {
            await cache.put(url, resp.clone());
            console.log('[SW] cached', url, 'status', resp.status);
          } catch (e) {
            console.warn('[SW] cache.put failed for', url, e);
          }
        } else {
          console.warn('[SW] skipping non-HTML/non-ok resource', url, resp.status);
        }
      } catch (e) {
        console.warn('[SW] fetch failed for', url, e);
      }
    }));

    console.log('[SW] install finished');
  })());

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    console.log('[SW] activate: old caches cleared');
  })());
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    const req = event.request;

    if (req.method !== 'GET') {
      try { return await fetch(req); }
      catch { return new Response(null, { status: 504, statusText: 'Gateway Timeout' }); }
    }

    // Network-first for fresh content
    try {
      const networkResponse = await fetch(req);
      if (networkResponse && networkResponse.ok) {
        // cache in background
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          try { cache.put(req, clone); } catch (e) { /* ignore */ }
        });
      }
      return networkResponse;
    } catch (err) {
      // Network failed: try cache
      const cached = await caches.match(req);
      if (cached) return cached;

      // If navigation or under /Chansonnier/, try /path/index.html
      try {
          const url = new URL(req.url);
            if (req.mode === 'navigate' || url.pathname.startsWith(BASE)) {
              const altPath = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname + '/index.html';
              const altCached = await caches.match(altPath);
              if (altCached) return altCached;
            }
      } catch (e) {
        // ignore
      }

      // Global fallback: cached root index
      const fallback = await caches.match(joinPath(BASE, 'index.html'));
      if (fallback) return fallback;

      return new Response('Offline', { status: 504, statusText: 'Offline' });
    }
  })());
});
