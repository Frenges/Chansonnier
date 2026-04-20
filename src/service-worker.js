// src/service-worker.js

const CACHE_NAME = "songbook-fullcache-v4";

// Fichiers essentiels
const CORE_FILES = [
  "/Chansonnier/",
  "/Chansonnier/index.html"
];

// Récupère toutes les routes dynamiques
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

// Récupère tous les fichiers _app/immutable/** automatiquement
async function getAllImmutableAssets() {
  try {
    const res = await fetch("/Chansonnier/");
    const html = await res.text();

    // On extrait tous les chemins /_app/immutable/... présents dans la page
    const regex = /\/Chansonnier\/_app\/immutable\/[^"']+/g;
    const matches = html.match(regex) || [];

    return matches;
  } catch {
    return [];
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1) Cache de base
      await cache.addAll(CORE_FILES);

      // 2) Pages dynamiques
      const dynamicRoutes = await getDynamicRoutes();
      await cache.addAll(dynamicRoutes);

      // 3) Tous les assets SvelteKit
      const immutableAssets = await getAllImmutableAssets();
      await cache.addAll(immutableAssets);
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Stratégie : réseau → fallback cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
