#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ISOTOPE_PROJECT_DIR="$PROJECT_DIR"

if command -v isotope >/dev/null 2>&1; then
  exec isotope update
fi

if [ -x "$PROJECT_DIR/bin/isotope" ]; then
  exec "$PROJECT_DIR/bin/isotope" update
fi

printf '%s\n' "ERROR: isotope command is not installed. Run: bash setup.sh --no-start" >&2
exit 1
