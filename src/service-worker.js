// src/service-worker.js

// Version du cache (change-la pour forcer une mise à jour)
const CACHE_NAME = "songbook-core-v2";

// Fichiers essentiels à précharger AVANT tout
// Ces fichiers doivent être disponibles même hors-ligne complet
const CORE_FILES = [
  "/Chansonnier/",
  "/Chansonnier/index.html",
  "/Chansonnier/data/pages.json"
];

// Fonction utilitaire : télécharge pages.json et génère les routes dynamiques
async function getDynamicRoutes() {
  try {
    // IMPORTANT : on récupère pages.json AVEC le service worker
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

// Installation : préchargement complet
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1) Précharge les fichiers essentiels
      await cache.addAll(CORE_FILES);

      // 2) Précharge les pages dynamiques
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
