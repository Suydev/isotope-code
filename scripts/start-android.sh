#!/data/data/com.termux/files/usr/bin/bash
# IsotopeAI for Android — requires Termux from F-Droid
set -e

echo "╔══════════════════════════════════════════╗"
echo "║  IsotopeAI — Termux (Android)            ║"
echo "╚══════════════════════════════════════════╝"

# Install deps if needed
if ! command -v node &>/dev/null; then
  echo "Installing Node.js..."
  pkg update -y && pkg install -y nodejs
fi

cd "$(dirname "$0")/.."
[ -f .env ] && export $(grep -v '^#' .env | xargs) 2>/dev/null || true
[ ! -d node_modules ] && npm install

PORT=${PORT:-3000}
echo "🚀 Open: http://localhost:$PORT (or use Termux:API to open browser)"
node server.mjs
