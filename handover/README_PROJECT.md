# Chansonnier — Présentation rapide

**But**  
Application web statique affichant un recueil de chansons. PWA avec service worker pour accès hors‑ligne.

**Stack technique**  
- Frontend : SvelteKit + Vite  
- Build : `npm run build` (adapter-static)  
- Hébergement : GitHub Pages (répertoire `build` généré par l’adapter)  
- Service worker : fichier manuel dans `static/service-worker.js` (cache strategy custom)

**État marqué comme fonctionnel**  
- Branche stable recommandée : `stable/functional-YYYY-MM-DD`  
- Tag recommandé : `v1.0.0-functional` (annoté)  
Remplace les noms par ceux que tu choisis lors du taggage.

**Points critiques connus**  
- Les assets runtime sont sous `_app/immutable/...` ; mismatch de base path provoque 404.  
- SW doit mettre en cache les HTML et les assets runtime correspondants.  
- Voir `handover/RUNBOOK.md` pour diagnostics rapides.

