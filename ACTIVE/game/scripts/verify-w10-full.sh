#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "== CEHP standard verification =="
bash scripts/verify-cehp.sh

if [ "${CEHP_SKIP_AUTOPLAY:-0}" = "1" ]; then
  echo "== CEHP autoplay determinism =="
  echo "Skipping autoplay because CEHP_SKIP_AUTOPLAY=1"
  exit 0
fi

echo "== CEHP autoplay determinism: orientation =="
node scripts/autoplay.mjs --world orientation

echo "== CEHP autoplay determinism: benefits =="
node scripts/autoplay.mjs --world benefits

echo "== CEHP autoplay determinism: rasta =="
node scripts/autoplay.mjs --world rasta
