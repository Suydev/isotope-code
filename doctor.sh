#!/usr/bin/env bash
# Run the IsotopeAI doctor diagnostic.
# Usage: bash doctor.sh
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ISOTOPE_PROJECT_DIR="$DIR"

if command -v isotope >/dev/null 2>&1; then
  exec isotope doctor
fi

if [ -x "$DIR/bin/isotope" ]; then
  exec "$DIR/bin/isotope" doctor
fi

printf 'ERROR: isotope command not installed. Run: bash setup.sh\n' >&2
exit 1
