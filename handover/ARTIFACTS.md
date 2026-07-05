# Inventaire des artefacts et emplacements

## Emplacements clés dans le repo
- `src/` : code source SvelteKit (routes, composants, stores).  
- `static/service-worker.js` : service worker manuel (cache strategy).  
- `scripts/generate-asset-list.js` : script qui génère `asset-list.json`.  
- `static/asset-list.json` : liste d’assets à mettre en cache (générée).  
- `data/pages.json` ou `static/data/pages.json` : données des pages/chansons.  
- `svelte.config.js` : configuration SvelteKit (paths.base important).  
- `build/` : output statique après `npm run build` (généré, ne pas committer).

## Fichiers critiques à vérifier en cas d’incident
- `_app/immutable/entry/*.js` et `chunks/*.js` (présents dans `build/` et servis par GitHub Pages).  
- `service-worker.js` (version et `CACHE_NAME`).  
- `asset-list.json` (doit contenir les assets runtime référencés par les HTML mis en cache).

