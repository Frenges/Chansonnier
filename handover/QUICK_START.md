# Démarrage rapide

## Cloner et se positionner sur la version fonctionnelle
git clone git@github.com:Frenges/Chansonnier.git
cd Chansonnier
git fetch origin
git checkout -b stable/functional-YYYY-MM-DD   # ou git checkout tags/v1.0.0-functional

## Installer
npm ci

## Build
npm run build

## Vérifier les assets publics
curl -I "https://frenges.github.io/Chansonnier/_app/immutable/entry/start.*.js"
curl -I "https://frenges.github.io/Chansonnier/service-worker.js"

## Tester localement (preview)
npm run preview
# ouvre http://localhost:4173 et vérifier SW via DevTools

## Pousser une mise à jour (workflow courant)
# 1. créer une branche de travail
git checkout -b feat/ma-modif
# 2. faire les changements, build
npm run build
# 3. ajouter et committer
git add -A
git commit -m "feat: description courte"
# 4. rebase/pull remote puis push
git fetch origin
git rebase origin/main
git push origin HEAD

## Créer un repère fonctionnel (tag + branche)
git checkout -b stable/functional-$(Get-Date -Format yyyy-MM-dd)
git push origin HEAD
git tag -a v1.0.0-functional -m "Functional baseline: offline pages cached and SW active"
git push origin v1.0.0-functional

