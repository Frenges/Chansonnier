# Architecture (synthèse)

- **Build** : SvelteKit -> output statique (`build/`) via `npm run build`.  
- **Assets runtime** : `_app/immutable/entry/*.js` et `chunks/*.js`.  
- **Service worker** : cache HTML + assets runtime ; stratégie network-first / cache-fallback.  
- **Déploiement** : push sur `main` → GitHub Pages sert `build/`.

Points de vigilance : mismatch de base path, hashes des assets (cache invalidation), SW qui met en cache HTML sans les assets correspondants.
