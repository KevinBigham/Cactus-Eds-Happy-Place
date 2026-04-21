#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
VENV_DIR="${TMPDIR:-/tmp}/cehp-w6-video"

if [ ! -x "$VENV_DIR/bin/python3" ]; then
  python3 -m venv "$VENV_DIR"
fi

"$VENV_DIR/bin/pip" install --quiet pillow imageio imageio-ffmpeg
"$VENV_DIR/bin/python3" "$ROOT_DIR/game/scripts/package_launch_trailer.py"
