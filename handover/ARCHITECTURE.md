# Architecture et flux principaux

## Composants
- **SvelteKit** : génération des pages statiques et des entrées client (`_app/immutable`).  
- **Service Worker** : cache des pages HTML et des assets runtime pour offline.  
- **GitHub Pages** : héberge le contenu statique (dossier `build`).

## Flux de build et déploiement
1. `npm run build` → `build/` (output statique).  
2. `scripts/generate-asset-list.js` → `static/asset-list.json` (liste d’assets à cacher).  
3. Push sur `main` → GitHub Pages déploie `build/`.

## Stratégie de cache
- **Network first** pour les requêtes GET ; fallback vers cache.  
- Cache des pages HTML et des assets `_app/immutable` correspondant au HTML mis en cache.  
- Incrémenter `CACHE_NAME` à chaque changement majeur du SW.

