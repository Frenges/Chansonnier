// src/service-worker.js

const CACHE_NAME = "songbook-v1";

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
    return json.pages.map(
      (p) => `/Chansonnier/page/${p.id}/index.html`
    );
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

      await cache.addAll([...core, ...assets, ...routes]);
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
