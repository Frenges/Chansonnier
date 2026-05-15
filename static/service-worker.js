@'
/* service-worker.js — version corrigée */
const CACHE_NAME = "songbook-v2";

async function getAssets() {
  try {
    const res = await fetch("/Chansonnier/asset-list.json");
    const json = await res.json();
    return json.assets.map(a => `/Chansonnier${a}`);
  } catch {
    return [];
  }
}

async function getDynamicRoutes() {
  try {
    const res = await fetch("/Chansonnier/data/pages.json");
    const json = await res.json();
    return json.pages.flatMap(p => [
      `/Chansonnier/page/${p.id}`,
      `/Chansonnier/page/${p.id}/index.html`
    ]);
  } catch {
    return [];
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const core = [
        "/Chansonnier/",
        "/Chansonnier/index.html"
      ];

      const assets = await getAssets();
      const routes = await getDynamicRoutes();

      const toCache = Array.from(new Set([...core, ...assets, ...routes])).filter(Boolean);

      await cache.addAll(toCache);
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })()
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const req = event.request;

      if (req.method !== 'GET') {
        try { return await fetch(req); }
        catch { return new Response(null, { status: 504, statusText: 'Gateway Timeout' }); }
      }

      try {
        const networkResponse = await fetch(req);
        if (networkResponse && networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            try { cache.put(req, clone); } catch (e) { /* ignore */ }
          });
        }
        return networkResponse;
      } catch (err) {
        const cached = await caches.match(req);
        if (cached) return cached;

        try {
          const url = new URL(req.url);
          if (url.pathname.startsWith('/Chansonnier/')) {
            const altPath = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname + '/index.html';
            const altCached = await caches.match(altPath);
            if (altCached) return altCached;
          }
        } catch (e) { /* ignore */ }

        const fallback = await caches.match('/Chansonnier/index.html');
        if (fallback) return fallback;

        return new Response('Offline', { status: 504, statusText: 'Offline' });
      }
    })()
  );
});
'@ | Set-Content -Encoding UTF8 static/service-worker.js
