#!/bin/bash
# ─────────────────────────────────────────────────────────────
# studio-scan.sh — Read-only health scan for CEHP repository
# Reports signals only. Never modifies code.
#
# Usage: ./scripts/studio-scan.sh [trigger]
#   trigger: sprint-complete | pre-release | merge | task-change
#
# Output: scan-results.md in repo root (overwritten each run)
# ─────────────────────────────────────────────────────────────

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TRIGGER="${1:-manual}"
DATE="$(date +%Y-%m-%d)"
OUTPUT="$REPO_ROOT/scan-results.md"
INDEX="$REPO_ROOT/index.html"

count_grep() {
  local mode="$1"
  local pattern="$2"
  local file="$3"
  local count=""

  if [ "$mode" = "fixed" ]; then
    count="$(grep -cF -- "$pattern" "$file" 2>/dev/null || true)"
  else
    count="$(grep -cE -- "$pattern" "$file" 2>/dev/null || true)"
  fi

  count="$(printf '%s\n' "$count" | tail -n 1 | tr -d '[:space:]')"
  if [ -z "$count" ]; then
    count="0"
  fi
  printf '%s' "$count"
}

count_real_files() {
  local dir="$1"
  if [ ! -d "$dir" ]; then
    printf '0'
    return
  fi
  find "$dir" -type f ! -name '.gitkeep' 2>/dev/null | wc -l | awk '{print $1}'
}

count_test_files() {
  local dir="$1"
  if [ ! -d "$dir" ]; then
    printf '0'
    return
  fi
  find "$dir" -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.cjs' \) 2>/dev/null | wc -l | awk '{print $1}'
}

echo "# Scan Results — $DATE" > "$OUTPUT"
echo "" >> "$OUTPUT"
echo "**Trigger**: $TRIGGER" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ── CODE HEALTH ──
echo "## Code Health" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# TODO/FIXME count
TODO_COUNT="$(count_grep regex '(TODO|FIXME)' "$INDEX")"
echo "- TODO/FIXME comments: $TODO_COUNT" >> "$OUTPUT"

# File size
LINE_COUNT="$(wc -l < "$INDEX" 2>/dev/null | tr -d '[:space:]')"
if [ -z "$LINE_COUNT" ]; then
  LINE_COUNT="0"
fi
echo "- index.html lines: $LINE_COUNT" >> "$OUTPUT"
if [ "$LINE_COUNT" -gt 4000 ]; then
  echo "  - SIGNAL: exceeds 4,000-line threshold (Tier 3)" >> "$OUTPUT"
fi

# console.log outside debug gates
CONSOLE_COUNT="$(count_grep regex 'console\.log' "$INDEX")"
echo "- console.log statements: $CONSOLE_COUNT" >> "$OUTPUT"

# Duplicate semicolons
DUPSEMI_COUNT="$(count_grep fixed ';;' "$INDEX")"
echo "- Duplicate semicolons: $DUPSEMI_COUNT" >> "$OUTPUT"

# Trailing whitespace
TRAILING_COUNT="$(count_grep regex '[[:blank:]]+$' "$INDEX")"
echo "- Lines with trailing whitespace: $TRAILING_COUNT" >> "$OUTPUT"

echo "" >> "$OUTPUT"

# ── BUILD HEALTH ──
echo "## Build Health" >> "$OUTPUT"
echo "" >> "$OUTPUT"

if [ -f "$REPO_ROOT/scripts/verify-cehp.sh" ]; then
  echo "- verify-cehp.sh: present" >> "$OUTPUT"
else
  echo "- verify-cehp.sh: MISSING" >> "$OUTPUT"
fi

if [ -f "$REPO_ROOT/scripts/check_save_schema.js" ]; then
  echo "- check_save_schema.js: present" >> "$OUTPUT"
else
  echo "- check_save_schema.js: MISSING" >> "$OUTPUT"
fi

# Save contract key check
SAVE_KEY=$(grep -o "cactusEd_save_v[0-9]*" "$INDEX" 2>/dev/null | head -1 || echo "not found")
echo "- Save contract key: $SAVE_KEY" >> "$OUTPUT"

echo "" >> "$OUTPUT"

# ── ARCHITECTURE DRIFT ──
echo "## Architecture Drift" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Scene count
SCENE_COUNT=$(grep -cE 'this\.scene\.start\(' "$INDEX" 2>/dev/null || echo "0")
echo "- Scene transitions: $SCENE_COUNT" >> "$OUTPUT"

# Global var declarations (rough estimate: var at top level)
GLOBAL_VARS=$(grep -cE '^var ' "$INDEX" 2>/dev/null || echo "0")
echo "- Top-level var declarations: $GLOBAL_VARS" >> "$OUTPUT"

# Query param usage
QPARAM_COUNT=$(grep -cE 'URLSearchParams|getParam|certAid' "$INDEX" 2>/dev/null || echo "0")
echo "- Query param references: $QPARAM_COUNT" >> "$OUTPUT"

echo "" >> "$OUTPUT"

# ── GAMEPLAY OPPORTUNITIES ──
echo "## Gameplay Opportunities" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Empty directories
for DIR in tests art audio; do
  FULL="$REPO_ROOT/$DIR"
  if [ -d "$FULL" ]; then
    FILE_COUNT="$(count_real_files "$FULL")"
    if [ "$FILE_COUNT" -eq 0 ]; then
      echo "- SIGNAL: $DIR/ directory is empty" >> "$OUTPUT"
    else
      echo "- $DIR/: $FILE_COUNT files" >> "$OUTPUT"
    fi
  else
    echo "- $DIR/: directory does not exist" >> "$OUTPUT"
  fi
done

# Auto-tasks in DISCOVERED
DISCOVERED_COUNT="$(find "$REPO_ROOT/auto_tasks/DISCOVERED" -name "AT-*.md" 2>/dev/null | wc -l | awk '{print $1}')"
echo "- Tasks in DISCOVERED: $DISCOVERED_COUNT" >> "$OUTPUT"

echo "" >> "$OUTPUT"

# ── HEALTH SCORE ──
echo "## Health Score Calculation" >> "$OUTPUT"
echo "" >> "$OUTPUT"

SCORE=100
DEDUCTIONS=""

if [ "$LINE_COUNT" -gt 16000 ]; then
  SCORE=$((SCORE - 10))
  DEDUCTIONS="$DEDUCTIONS\n- index.html >16K lines: -10"
elif [ "$LINE_COUNT" -gt 4000 ]; then
  SCORE=$((SCORE - 5))
  DEDUCTIONS="$DEDUCTIONS\n- index.html >4K lines: -5"
fi

# Check for test coverage
TESTS_DIR="$REPO_ROOT/tests"
if [ -d "$TESTS_DIR" ] && [ "$(count_test_files "$TESTS_DIR")" -eq 0 ]; then
  SCORE=$((SCORE - 8))
  DEDUCTIONS="$DEDUCTIONS\n- Zero test coverage: -8"
fi

if [ -d "$REPO_ROOT/audio" ] && [ "$(count_real_files "$REPO_ROOT/audio")" -eq 0 ]; then
  SCORE=$((SCORE - 3))
  DEDUCTIONS="$DEDUCTIONS\n- No audio assets: -3"
fi

if [ "$DISCOVERED_COUNT" -gt 5 ]; then
  SCORE=$((SCORE - 2))
  DEDUCTIONS="$DEDUCTIONS\n- >5 unprocessed auto-tasks: -2"
fi

if [ "$TODO_COUNT" -eq 0 ]; then
  SCORE=$((SCORE + 5))
  DEDUCTIONS="$DEDUCTIONS\n- Zero TODOs: +5"
fi

if [ "$CONSOLE_COUNT" -eq 0 ]; then
  SCORE=$((SCORE + 3))
  DEDUCTIONS="$DEDUCTIONS\n- Zero stray console.log: +3"
fi

echo "**Score: ${SCORE}%**" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo -e "Adjustments:$DEDUCTIONS" >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "---" >> "$OUTPUT"
echo "*Scan completed at $(date). This file is auto-generated and will be overwritten on next scan.*" >> "$OUTPUT"

echo "Scan complete. Results written to: $OUTPUT"
echo "Health score: ${SCORE}%"
