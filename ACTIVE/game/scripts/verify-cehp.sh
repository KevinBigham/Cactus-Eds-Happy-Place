#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "== CEHP save contract =="
node scripts/check_save_schema.js

server_started=0
server_pid=""

cleanup() {
  if [ "$server_started" -eq 1 ] && [ -n "$server_pid" ]; then
    kill "$server_pid" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

if curl -fsS http://127.0.0.1:4175/index.html >/dev/null 2>&1; then
  echo "== CEHP server =="
  echo "Reusing existing server on http://127.0.0.1:4175"
else
  echo "== CEHP server =="
  echo "Starting temporary server on http://127.0.0.1:4175"
  python3 -m http.server 4175 --bind 127.0.0.1 >/tmp/cehp-verify-server.log 2>&1 &
  server_pid="$!"
  server_started=1
  sleep 1
fi

echo "== CEHP smoke =="
if [ ! -f package.json ]; then
  echo "Missing package.json in $(pwd); cannot run repo-owned smoke harness"
  exit 1
fi

if [ ! -d node_modules/playwright ]; then
  echo "Missing Playwright dependency. Run:"
  echo "  npm install"
  exit 1
fi

node tests/cehp_boot_smoke.mjs
