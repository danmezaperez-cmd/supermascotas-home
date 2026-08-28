#!/usr/bin/env bash
# Publica la exportación estática en la rama gh-pages.
# Requiere `gh auth login` (o un remoto con credenciales) una sola vez.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/danmezaperez-cmd/supermascotas-home.git}"
BASE_PATH="${BASE_PATH:-/supermascotas-home}"

rm -rf out
NEXT_PUBLIC_BASE_PATH="$BASE_PATH" npx next build
touch out/.nojekyll

# Historia independiente para la rama publicada: no arrastra el código fuente
( cd out
  rm -rf .git
  git init -q
  git checkout -qb gh-pages
  git add -A
  git commit -q -m "Publicación estática del home de Supermascotas"
  git push -qf "$REPO_URL" gh-pages:gh-pages
  rm -rf .git )

echo "Publicado en https://danmezaperez-cmd.github.io${BASE_PATH}/"
