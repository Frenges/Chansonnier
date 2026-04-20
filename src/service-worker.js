// src/service-worker.js

const CACHE_NAME = "songbook-fullshell-v3";

// Fichiers essentiels à précharger AVANT tout
const CORE_FILES = [
  "/Chansonnier/",
  "/Chansonnier/index.html",
  "/Chansonnier/data/pages.json"
];

// Fonction utilitaire : télécharge pages.json et génère les routes dynamiques
async function getDynamicRoutes() {
  try {
    const res = await fetch("/Chansonnier/data/pages.json");
    const json = await res.json();

    return json.pages.map(
      (p) => `/Chansonnier/page/${p.id}/index.html`
    );
  } catch (e) {
    console.error("SW: impossible de charger pages.json", e);
    return [];
  }
}

// Fonction utilitaire : détecte tous les assets SvelteKit
async function getAppAssets() {
  try {
    const res = await fetch("/Chansonnier/");
    const text = await res.text();

    // On extrait tous les chemins /_app/... présents dans la page
    const regex = /\/Chansonnier\/_app\/[^"']+/g;
    const matches = text.match(regex) || [];

    return matches;
  } catch (e) {
    console.error("SW: impossible de détecter les assets SvelteKit", e);
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

      // 3) Précharge automatiquement tous les assets SvelteKit
      const assets = await getAppAssets();
      await cache.addAll(assets);
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
