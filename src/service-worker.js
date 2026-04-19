// src/service-worker.js

// Nom du cache
const CACHE_NAME = "songbook-cache-v1";

// Fichiers à mettre en cache immédiatement
const OFFLINE_FILES = [
  "/",
  "/Chansonnier/",
  "/Chansonnier/index.html",
  "/Chansonnier/data/pages.json"
];

// Installation : on met en cache les fichiers essentiels
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_FILES);
    })
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

// Stratégie : Network falling back to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
