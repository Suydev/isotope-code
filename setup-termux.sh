#!/data/data/com.termux/files/usr/bin/bash
# IsotopeAI — First-time Termux setup
# Run this ONCE to install everything

echo ""
echo "  ★ IsotopeAI Setup for Termux"
echo ""

# Update package list
echo "  [1/3] Updating Termux packages..."
pkg update -y -q 2>/dev/null || true

# Install Node.js
echo "  [2/3] Installing Node.js..."
pkg install nodejs -y -q

# Check install
if command -v node &> /dev/null; then
  echo "  ✓ Node.js $(node --version) installed"
else
  echo "  ✗ Failed to install Node.js"
  echo "    Try manually: pkg install nodejs"
  exit 1
fi

# Make start.sh executable
echo "  [3/3] Setting permissions..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chmod +x "$SCRIPT_DIR/start.sh"

echo ""
echo "  ✓ Setup complete!"
echo ""
echo "  To start IsotopeAI, run:"
echo "    bash start.sh"
echo ""
