# Démarrage rapide (PowerShell)

## Cloner et se positionner
git clone git@github.com:Frenges/Chansonnier.git
cd Chansonnier
git fetch origin
git checkout stable/functional-YYYY-MM-DD   # ou git checkout tags/v1.0.0-functional

## Installer et build
npm ci
npm run build

## Vérifier assets publics
curl.exe -I "https://frenges.github.io/Chansonnier/_app/immutable/entry/start.*.js"
curl.exe -I "https://frenges.github.io/Chansonnier/service-worker.js"

## Workflow courant pour pousser une mise à jour
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
# PowerShell date format
$tagDate = (Get-Date -Format yyyy-MM-dd)
git checkout -b stable/functional-$tagDate
git push origin HEAD
git tag -a v1.0.0-functional -m "Functional baseline: offline pages cached and SW active"
git push origin v1.0.0-functional
