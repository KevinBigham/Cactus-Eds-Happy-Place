#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

server_started=0
server_pid=""

cleanup() {
  if [ "$server_started" -eq 1 ] && [ -n "$server_pid" ]; then
    kill "$server_pid" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

run_component() {
  component="$1"
  shift
  echo "== CEHP launch: $component =="
  if ! "$@"; then
    echo "CEHP LAUNCH VERIFY: FAIL (component: $component)" >&2
    exit 1
  fi
}

ensure_server() {
  if curl -fsS http://127.0.0.1:4175/index.html >/dev/null 2>&1; then
    echo "Reusing existing server on http://127.0.0.1:4175"
    return 0
  fi

  echo "Starting temporary server on http://127.0.0.1:4175"
  python3 -m http.server 4175 --bind 127.0.0.1 >/tmp/cehp-launch-verify-server.log 2>&1 &
  server_pid="$!"
  server_started=1
  sleep 1
  curl -fsS http://127.0.0.1:4175/index.html >/dev/null 2>&1
}

check_bundle_bytes() {
  bytes="$(wc -c < index.html | tr -d ' ')"
  echo "Bundle bytes: $bytes / 372000"
  [ "$bytes" -lt 372000 ]
}

run_component build node build.js
run_component save_schema node scripts/check_save_schema.js
run_component process_manifest node scripts/check_process_manifest.mjs
run_component art_assets node scripts/verify_art_assets.mjs
run_component behavior_oracle node --test tests/rebuild_logic.test.mjs
run_component process_manifest_test node --test tests/process_manifest.test.mjs
run_component server ensure_server
run_component browser_smoke node tests/cehp_rebuild_smoke.mjs
run_component accessibility node tests/cehp_accessibility_settings.mjs
run_component case_runs node tests/cehp_rebuild_case_runs.mjs
run_component replay_corpus npm run test:replay
run_component bundle_byte_check check_bundle_bytes

echo "CEHP LAUNCH VERIFY: PASS"
