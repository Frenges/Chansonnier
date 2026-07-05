# Runbook diagnostics et procédures rapides

## Vérifier l’enregistrement du service worker
# dans la console du navigateur
navigator.serviceWorker.getRegistrations().then(r => console.log(r));

## Lister les URLs en cache
caches.open('songbook-v3').then(c => c.keys().then(keys => console.log(keys.map(k => k.url))));

## Inspecter le HTML mis en cache pour une page
caches.open('songbook-v3').then(c => c.match('/Chansonnier/page/agaunia-1859-st-maurice').then(r => r && r.text().then(t => console.log(t.slice(0,2000)))));

## Forcer la mise à jour du SW (dev)
# unregister tous les SW puis reload
navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).then(() => location.reload());

## Commandes curl utiles (PowerShell)
curl.exe -I "https://frenges.github.io/Chansonnier/service-worker.js"
curl.exe -I "https://frenges.github.io/Chansonnier/asset-list.json"
curl.exe -I "https://frenges.github.io/Chansonnier/data/pages.json"
curl.exe -I "https://frenges.github.io/Chansonnier/_app/immutable/entry/start.*.js"

## Si la page est blanche hors ligne
1. Vérifier que la page HTML est dans le cache (voir commande listant les URLs).  
2. Vérifier que les fichiers `_app/immutable/...` référencés par ce HTML sont présents dans le cache.  
3. Si un import dynamique échoue, regarder la console pour `error loading dynamically imported module` et vérifier l’URL demandée.  
4. Pour dépannage temporaire, unregister SW, hard reload en ligne, vérifier que les assets runtime renvoient 200.

