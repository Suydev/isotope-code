#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  IsotopeAI — macOS Launcher
#  Double-click this file in Finder to start the app.
#  Your browser opens automatically.
# ─────────────────────────────────────────────────────────────

# Move to the folder where this script lives
cd "$(dirname "$0")"

echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │           IsotopeAI Launcher            │"
echo "  └─────────────────────────────────────────┘"
echo ""

# ── Check for Node.js ────────────────────────────────────────
if ! command -v node &>/dev/null; then
    echo "  [!] Node.js is not installed."
    echo ""
    # Show a nice macOS dialog
    osascript 2>/dev/null <<'APPLESCRIPT'
display alert "IsotopeAI — Setup Required" message "Node.js is needed to run IsotopeAI.

Clicking OK will open the Node.js download page.

Download and install Node.js LTS, then double-click Start IsotopeAI again." as informational buttons {"Open Download Page"} default button 1
open location "https://nodejs.org/en/download/"
APPLESCRIPT
    echo "  Opening nodejs.org — install Node.js LTS, then run this again."
    echo ""
    read -p "  Press Enter to close..." _
    exit 1
fi

NODE_VER=$(node --version 2>/dev/null)
echo "  [OK] Node.js $NODE_VER"
echo ""

# ── Check required files ─────────────────────────────────────
if [ ! -f "server.mjs" ]; then
    echo "  [!] server.mjs not found. Please re-extract the ZIP."
    read -p "  Press Enter to close..." _
    exit 1
fi

if [ ! -d "public/assets" ]; then
    echo "  [!] public/assets folder missing. Please re-download the ZIP."
    read -p "  Press Enter to close..." _
    exit 1
fi

# ── Open browser after 2 s ────────────────────────────────────
(sleep 2 && open "http://localhost:3000") &

# ── Start server ─────────────────────────────────────────────
echo "  [OK] Server starting..."
echo ""
echo "        ┌───────────────────────────────────────┐"
echo "        │  Open your browser to:                │"
echo "        │  http://localhost:3000                │"
echo "        │                                       │"
echo "        │  Close this window to stop the app.   │"
echo "        └───────────────────────────────────────┘"
echo ""

node server.mjs

echo ""
echo "  Server stopped."
read -p "  Press Enter to close..." _
