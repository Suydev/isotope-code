#!/data/data/com.termux/files/usr/bin/bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  IsotopeAI — Termux (Android) Installer & Auto-Updater                  ║
# ║  Credits: Arnav Singh (owner) · Suyash Prabh (developer)               ║
# ║  Repo:    https://github.com/Suydev/isotope-code                        ║
# ╚══════════════════════════════════════════════════════════════════════════╝

REPO="Suydev/isotope-code"
INSTALL_DIR="$HOME/isotope"
VERSION_FILE="$INSTALL_DIR/.version"
API_URL="https://api.github.com/repos/$REPO/releases/latest"
CLONE_URL="https://github.com/$REPO.git"
PORT="${PORT:-3000}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${CYAN}[IsotopeAI]${NC} $*"; }
ok()    { echo -e "${GREEN}[  OK  ]${NC} $*"; }
warn()  { echo -e "${YELLOW}[ WARN ]${NC} $*"; }

# ── Check for newer GitHub release ─────────────────────────────────────────
check_update() {
  info "Checking for updates..."
  LATEST=$(curl -fsSL "$API_URL" 2>/dev/null | grep '"tag_name"' | \
    sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' | sed 's/^v//')
  CURRENT=$(cat "$VERSION_FILE" 2>/dev/null | sed 's/^v//' || echo "0.0.0")

  if [ -z "$LATEST" ]; then
    warn "GitHub unreachable — using local version ($CURRENT)"
    return 1
  fi
  if [ "$LATEST" != "$CURRENT" ]; then
    info "Update: v$CURRENT → v$LATEST"
    return 0
  else
    ok "Already latest: v$CURRENT"
    return 1
  fi
}

# ── Install dependencies ─────────────────────────────────────────────────────
info "Updating Termux packages..."
pkg update -y 2>/dev/null || true
pkg upgrade -y 2>/dev/null || true

for PKG in nodejs git curl; do
  if ! command -v "$PKG" &>/dev/null; then
    info "Installing $PKG..."
    pkg install -y "$PKG"
  else
    ok "$PKG already installed"
  fi
done

# ── Install or update ────────────────────────────────────────────────────────
if [ -d "$INSTALL_DIR/.git" ]; then
  if check_update; then
    info "Pulling latest..."
    cd "$INSTALL_DIR"
    git fetch --depth 1 origin main
    git reset --hard origin/main
    LATEST=$(curl -fsSL "$API_URL" 2>/dev/null | grep '"tag_name"' | \
      sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' | sed 's/^v//' || echo "2.0.0")
    echo "$LATEST" > "$VERSION_FILE"
    ok "Updated to v$LATEST"
  fi
else
  info "Installing IsotopeAI into $INSTALL_DIR..."
  rm -rf "$INSTALL_DIR"
  git clone --depth 1 "$CLONE_URL" "$INSTALL_DIR"
  LATEST=$(curl -fsSL "$API_URL" 2>/dev/null | grep '"tag_name"' | \
    sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' | sed 's/^v//' || echo "2.0.0")
  echo "$LATEST" > "$VERSION_FILE"
  ok "Installed v$LATEST"
fi

# ── Create start alias ───────────────────────────────────────────────────────
SHELL_RC="$HOME/.bashrc"
ALIAS_LINE="alias isotopeai='PORT=$PORT node $INSTALL_DIR/server.mjs'"
if ! grep -q "isotopeai" "$SHELL_RC" 2>/dev/null; then
  echo "$ALIAS_LINE" >> "$SHELL_RC"
  ok "Alias 'isotopeai' added to ~/.bashrc"
fi

# ── Android Termux widget shortcut ──────────────────────────────────────────
WIDGET_DIR="$HOME/.shortcuts"
mkdir -p "$WIDGET_DIR"
cat > "$WIDGET_DIR/IsotopeAI" <<EOF
#!/data/data/com.termux/files/usr/bin/bash
PORT=$PORT node $INSTALL_DIR/server.mjs &
sleep 1
termux-open-url http://localhost:$PORT
EOF
chmod +x "$WIDGET_DIR/IsotopeAI"

# ── Start ────────────────────────────────────────────────────────────────────
echo ""
ok "IsotopeAI ready!"
info "Run: node $INSTALL_DIR/server.mjs"
info "Or reload shell and run: isotopeai"
info "Then open: http://localhost:${PORT}"
info "Works offline after first load via PWA Service Worker"
echo ""

read -rp "Start now? [Y/n]: " START
if [[ ! "$START" =~ ^[Nn]$ ]]; then
  info "Starting on port $PORT..."
  # Try to open browser if termux-api available
  (sleep 1 && termux-open-url "http://localhost:$PORT" 2>/dev/null) &
  PORT=$PORT node "$INSTALL_DIR/server.mjs"
fi
