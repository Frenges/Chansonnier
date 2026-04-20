// src/service-worker.js

const CACHE_NAME = "songbook-dynamic-v1";

// Fichiers statiques essentiels
const STATIC_FILES = [
  "/Chansonnier/",
  "/Chansonnier/index.html",
  "/Chansonnier/index/alphabetique/index.html",
  "/Chansonnier/index/thematique/index.html",
  "/Chansonnier/data/pages.json"
];

// Fonction utilitaire : télécharge pages.json et génère les routes
async function getDynamicRoutes() {
  try {
    const res = await fetch("/Chansonnier/data/pages.json");
    const json = await res.json();

    // Chaque chanson devient une route HTML à précharger
    return json.pages.map(
      (p) => `/Chansonnier/page/${p.id}/index.html`
    );
  } catch (e) {
    console.error("Service Worker: impossible de charger pages.json", e);
    return [];
  }
}

// Installation : préchargement dynamique
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Précharge les fichiers statiques
      await cache.addAll(STATIC_FILES);

      // Précharge les pages dynamiques
      const dynamicRoutes = await getDynamicRoutes();
      await cache.addAll(dynamicRoutes);
    })()
  );

  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
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
