# Runbook — diagnostics et commandes utiles (PowerShell)

## Vérifier l’enregistrement du service worker (Console navigateur)
navigator.serviceWorker.getRegistrations().then(r => console.log(r));

## Lister les URLs en cache (Console navigateur)
caches.open('songbook-v3').then(c => c.keys().then(keys => console.log(keys.map(k => k.url))));

## Inspecter le HTML mis en cache pour une page (Console navigateur)
caches.open('songbook-v3').then(c => c.match('/Chansonnier/page/agaunia-1859-st-maurice').then(r => r && r.text().then(t => console.log(t.slice(0,2000)))));

## Commandes PowerShell utiles (local)
# vérifier service-worker
curl.exe -I "https://frenges.github.io/Chansonnier/service-worker.js"
# vérifier asset-list et pages.json
curl.exe -I "https://frenges.github.io/Chansonnier/asset-list.json"
curl.exe -I "https://frenges.github.io/Chansonnier/data/pages.json"
# vérifier runtime assets (exemples)
curl.exe -I "https://frenges.github.io/Chansonnier/_app/immutable/entry/start.*.js"

## Procédure rapide si page blanche hors ligne
1. Unregister SW (Console navigateur) puis hard reload en ligne.  
2. Vérifier que `_app/immutable/...` renvoie 200.  
3. Vérifier cache `songbook-vX` contient la page HTML et les assets runtime.  
4. Si import dynamique échoue, noter l’URL en 404 et corriger la génération (paths.base).
