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

if [ -f /tmp/codex-playwright-cert/smoke.js ]; then
  echo "== CEHP smoke =="
  node /tmp/codex-playwright-cert/smoke.js
else
  echo "== CEHP smoke =="
  echo "Skipping disposable smoke harness: /tmp/codex-playwright-cert/smoke.js not found"
  echo "Run manual browser sanity instead:"
  echo "  http://127.0.0.1:4175/index.html"
  echo "  http://127.0.0.1:4175/index.html?certAid=w2"
  echo "  http://127.0.0.1:4175/index.html?certAid=w3"
fi
