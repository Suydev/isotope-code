#!/usr/bin/env bash
# Start the IsotopeAI local server.
# Usage: bash start.sh [--port=3000]
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ISOTOPE_PROJECT_DIR="$DIR"

for arg in "$@"; do
  case "$arg" in
    --port=*) export PORT="${arg#--port=}" ;;
  esac
done

if command -v isotope >/dev/null 2>&1; then
  exec isotope start
fi

if [ -x "$DIR/bin/isotope" ]; then
  exec "$DIR/bin/isotope" start
fi

printf 'ERROR: isotope command not installed. Run: bash setup.sh\n' >&2
exit 1
