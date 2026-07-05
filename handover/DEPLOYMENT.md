# Déploiement et notes CI

## Déploiement manuel
1. S’assurer d’être sur la branche main ou sur la branche de release.
2. npm ci
3. npm run build
4. git add -A
5. git commit -m "chore(release): build for deploy"
6. git fetch origin
7. git rebase origin/main
8. git push origin main

## Release GitHub
- Créer un tag annoté (voir QUICK_START.md).  
- Créer une Release depuis le tag et joindre notes courtes (artifacts non inclus).

## CI recommandé
- Job build : `npm ci`, `npm run build`, `node scripts/generate-asset-list.js`.  
- Job deploy : push sur main déclenche GitHub Pages (ou action dédiée).  
- Tests : vérifier que `_app/immutable` est présent dans l’artefact build.

