#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

run() {
  echo "== $* ==" >&2
  "$@" >&2
}

on_error() {
  echo "CEHP Stop hook: FAIL" >&2
  exit 2
}
trap on_error ERR

run node ACTIVE/game/build.js
run node --test ACTIVE/game/tests/rebuild_logic.test.mjs

is_sim_path() {
  case "$1" in
    ACTIVE/game/src/04_fixed_step.js|\
    ACTIVE/game/src/05_input_buffer.js|\
    ACTIVE/game/src/06_cancel_matrix.js|\
    ACTIVE/game/src/07_ed_state.js|\
    ACTIVE/game/src/20_input.js|\
    ACTIVE/game/src/21_movement.js|\
    ACTIVE/game/src/22_collision.js|\
    ACTIVE/game/src/91_scenes.js|\
    ACTIVE/game/src/92_testroom.js|\
    ACTIVE/game/src/74_world_orientation_runtime.js|\
    ACTIVE/game/src/75_world_benefits_runtime.js|\
    ACTIVE/game/src/76_world_rasta_runtime.js)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

file_mtime() {
  stat -f %m "$1" 2>/dev/null || stat -c %Y "$1"
}

sim_changed=0
changed_files="$(git diff --name-only HEAD -- || true)"
for file in $changed_files; do
  if is_sim_path "$file"; then
    sim_changed=1
  fi
done

if [ "$sim_changed" -eq 0 ]; then
  for file in \
    ACTIVE/game/src/04_fixed_step.js \
    ACTIVE/game/src/05_input_buffer.js \
    ACTIVE/game/src/06_cancel_matrix.js \
    ACTIVE/game/src/07_ed_state.js \
    ACTIVE/game/src/20_input.js \
    ACTIVE/game/src/21_movement.js \
    ACTIVE/game/src/22_collision.js \
    ACTIVE/game/src/91_scenes.js \
    ACTIVE/game/src/92_testroom.js \
    ACTIVE/game/src/74_world_orientation_runtime.js \
    ACTIVE/game/src/75_world_benefits_runtime.js \
    ACTIVE/game/src/76_world_rasta_runtime.js
  do
    if [ -f "$file" ]; then
      last_commit_ts="$(git log -1 --format=%ct -- "$file" 2>/dev/null || echo 0)"
      if [ "$(file_mtime "$file")" -gt "$last_commit_ts" ]; then
        sim_changed=1
        break
      fi
    fi
  done
fi

if [ "$sim_changed" -eq 1 ]; then
  run npm --prefix ACTIVE/game run test:replay
else
  echo "== replay corpus skipped: no sim file changes ==" >&2
fi

echo "CEHP Stop hook: PASS" >&2
