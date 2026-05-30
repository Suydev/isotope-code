#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

# Load .env if present
[ -f .env ] && export $(grep -v '^#' .env | xargs)

PORT=${PORT:-3000}
echo "🚀 Starting IsotopeAI on http://localhost:$PORT"

# Auto-open browser
(sleep 2 && open "http://localhost:$PORT") &

node server.mjs
