#!/data/data/com.termux/files/usr/bin/bash
# IsotopeAI — First-time Termux setup
# Run this ONCE to install everything

echo ""
echo "  ★ IsotopeAI Setup for Termux"
echo ""

# Step 1: Upgrade ALL packages (critical — fixes OpenSSL version mismatch)
echo "  [1/4] Upgrading Termux packages (fixes OpenSSL errors)..."
echo "        This may take 1-2 minutes..."
pkg update -y 2>/dev/null || true
pkg upgrade -y 2>/dev/null || true

# Step 2: Install OpenSSL explicitly
echo "  [2/4] Installing OpenSSL..."
pkg install openssl -y -q 2>/dev/null || true

# Step 3: Install Node.js
echo "  [3/4] Installing Node.js..."
pkg install nodejs -y -q

# Verify node actually runs (not just exists)
if node --version > /dev/null 2>&1; then
  echo "  ✓ Node.js $(node --version) working"
else
  echo ""
  echo "  ✗ Node.js installed but won't start (OpenSSL mismatch)."
  echo ""
  echo "  Fix: run this one command, then try setup again:"
  echo "    pkg upgrade -y && bash setup-termux.sh"
  echo ""
  exit 1
fi

# Step 4: Permissions
echo "  [4/4] Setting permissions..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chmod +x "$SCRIPT_DIR/start.sh"

echo ""
echo "  ✓ Setup complete!"
echo ""
echo "  To start IsotopeAI, run:"
echo "    bash start.sh"
echo ""
