#!/data/data/com.termux/files/usr/bin/bash
# IsotopeAI — Termux launcher
# Run this every time you want to start the app

PORT=3000
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  ★ IsotopeAI — Starting..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "  ✗ Node.js not found. Run setup-termux.sh first."
  exit 1
fi

echo "  ✓ Node.js $(node --version)"
echo "  ✓ Serving from: $SCRIPT_DIR"
echo ""
echo "  ➜ Open in your browser:"
echo "     http://localhost:$PORT"
echo ""
echo "  ➜ To install as an app:"
echo "     1. Open Chrome on Android"
echo "     2. Go to http://localhost:$PORT"
echo "     3. Tap  ⋮  → 'Add to Home Screen'"
echo "     4. It launches like a real APK"
echo ""
echo "  Press Ctrl+C to stop the server"
echo ""

cd "$SCRIPT_DIR"
PORT=$PORT node server.mjs
