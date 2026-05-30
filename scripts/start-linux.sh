#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

# Load .env if present
[ -f .env ] && export $(grep -v '^#' .env | xargs)

PORT=${PORT:-3000}
echo "🚀 Starting IsotopeAI on http://localhost:$PORT"
echo "   Press Ctrl+C to stop"
echo ""

node server.mjs
