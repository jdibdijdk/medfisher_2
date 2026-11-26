#!/bin/bash
# Gera ../../tailwind.css a partir do index.html. Rode sempre que mexer em classes do Tailwind ou em entrada.css.
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --no-audit --no-fund
npx tailwindcss -c tailwind.config.js -i entrada.css -o ../../tailwind.css --minify
echo "tailwind.css gerado: $(wc -c < ../../tailwind.css) bytes"
