#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  IsotopeAI — Linux Launcher
#  Run:  bash start-linux.sh
#  Or make executable and double-click in your file manager.
# ─────────────────────────────────────────────────────────────

cd "$(dirname "$0")"

echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │           IsotopeAI Launcher            │"
echo "  └─────────────────────────────────────────┘"
echo ""

# ── Check for Node.js ────────────────────────────────────────
if ! command -v node &>/dev/null; then
    MSG="Node.js is not installed.\n\nInstall it with one of these commands:\n\n  Ubuntu/Debian:\n    sudo apt install nodejs\n\n  Fedora/RHEL:\n    sudo dnf install nodejs\n\n  Arch:\n    sudo pacman -S nodejs\n\nOr download from nodejs.org"

    if command -v zenity &>/dev/null; then
        zenity --error --title="IsotopeAI — Setup Required" \
               --text="$MSG" --width=400 2>/dev/null
    elif command -v kdialog &>/dev/null; then
        kdialog --error "$MSG" --title "IsotopeAI — Setup Required"
    else
        echo "  [!] Node.js not found. Install it:"
        echo "      sudo apt install nodejs   (Ubuntu/Debian)"
        echo "      sudo dnf install nodejs   (Fedora)"
        echo "      sudo pacman -S nodejs     (Arch)"
        echo "      Or: https://nodejs.org/en/download/"
    fi

    xdg-open "https://nodejs.org/en/download/" 2>/dev/null &
    exit 1
fi

NODE_VER=$(node --version 2>/dev/null)
echo "  [OK] Node.js $NODE_VER"
echo ""

# ── Check required files ─────────────────────────────────────
if [ ! -f "server.mjs" ]; then
    echo "  [!] server.mjs not found. Please re-extract the ZIP."
    exit 1
fi

if [ ! -d "public/assets" ]; then
    echo "  [!] public/assets missing. Please re-download the ZIP."
    exit 1
fi

# ── Open browser after 2 s ────────────────────────────────────
(sleep 2 && (
    xdg-open "http://localhost:3000" 2>/dev/null ||
    sensible-browser "http://localhost:3000" 2>/dev/null ||
    google-chrome "http://localhost:3000" 2>/dev/null ||
    firefox "http://localhost:3000" 2>/dev/null
)) &

# ── Start server ─────────────────────────────────────────────
echo "  [OK] Server starting..."
echo ""
echo "        ┌───────────────────────────────────────┐"
echo "        │  Open your browser to:                │"
echo "        │  http://localhost:3000                │"
echo "        │                                       │"
echo "        │  Press Ctrl+C to stop the app.        │"
echo "        └───────────────────────────────────────┘"
echo ""

node server.mjs
