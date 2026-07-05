# Déploiement (procédure concise)

1. npm ci
2. npm run build
3. git add -A
4. git commit -m "chore(release): build for deploy"
5. git fetch origin
6. git rebase origin/main
7. git push origin main

Notes : créer un tag annoté pour marquer la baseline fonctionnelle (voir QUICK_START.md). Ne pas inclure d’artefacts binaires dans le repo ; pointer vers la procédure de build.
