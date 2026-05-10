// service-worker.js (placer à la racine /static/service-worker.js ou servir à /service-worker.js)
const CACHE_NAME = 'songbook-v1';
const PRECACHE = [
  '/data/pages.json',
  '/',
  '/build/_app/start.Dhyw1SJM.js' // adapte si nécessaire
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Cache-first pour pages.json
  if (url.pathname === '/data/pages.json') {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const network = fetch(e.request).then((res) => {
          if (res && res.ok) caches.open(CACHE_NAME).then((c) => c.put(e.request, res.clone()));
          return res;
        }).catch(() => null);
        return cached || network;
      })
    );
    return;
  }

  // Runtime cache pour pages individuelles (GET)
  if (url.pathname.startsWith('/page/') && e.request.method === 'GET') {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const network = fetch(e.request).then((res) => {
          if (res && res.ok) caches.open(CACHE_NAME).then((c) => c.put(e.request, res.clone()));
          return res;
        }).catch(() => null);
        return cached || network;
      })
    );
    return;
  }

  // Default: network first, fallback cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
