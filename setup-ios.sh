#!/bin/sh
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  IsotopeAI — iOS Installer (iSH / a-Shell)                              ║
# ║  Run this inside the iSH app (Alpine Linux) on your iPhone/iPad         ║
# ║  Credits: Arnav Singh (owner) · Suyash Prabh (developer)               ║
# ║  Repo:    https://github.com/Suydev/isotope-code                        ║
# ╚══════════════════════════════════════════════════════════════════════════╝

REPO="Suydev/isotope-code"
INSTALL_DIR="$HOME/isotope"
VERSION_FILE="$INSTALL_DIR/.version"
API_URL="https://api.github.com/repos/$REPO/releases/latest"
CLONE_URL="https://github.com/$REPO.git"
PORT="${PORT:-3000}"

info()  { echo "[IsotopeAI] $*"; }
ok()    { echo "[  OK  ] $*"; }
warn()  { echo "[ WARN ] $*"; }

echo ""
echo " =========================================="
echo "  IsotopeAI — iOS Installer (iSH / Alpine)"
echo "  by Arnav Singh & Suyash Prabh"
echo " =========================================="
echo ""

# ── Detect environment ────────────────────────────────────────────────────────
if [ -f /etc/alpine-release ]; then
  ENV="ish"
  info "Detected: iSH (Alpine Linux)"
elif command -v a-Shell >/dev/null 2>&1 || [ -d "$HOME/Library" ]; then
  ENV="ashell"
  info "Detected: a-Shell"
else
  ENV="unknown"
  warn "Unknown iOS environment. Assuming Alpine/iSH."
fi

# ── Install packages ──────────────────────────────────────────────────────────
if [ "$ENV" = "ish" ]; then
  info "Updating Alpine packages..."
  apk update 2>/dev/null || true

  command -v git >/dev/null 2>&1 || { info "Installing git..."; apk add --no-cache git; }
  command -v node >/dev/null 2>&1 || { info "Installing Node.js..."; apk add --no-cache nodejs npm; }
  command -v curl >/dev/null 2>&1 || { info "Installing curl..."; apk add --no-cache curl; }

  ok "All packages ready: Node.js $(node -v), git $(git --version | awk '{print $3}')"

elif [ "$ENV" = "ashell" ]; then
  # a-Shell has Python but limited Node. We use the web version instead.
  echo ""
  info "a-Shell detected. Node.js is not available in a-Shell."
  info "For iOS, we recommend one of these options:"
  echo ""
  echo "  1. Use iSH app (free on App Store) — supports Node.js natively"
  echo "  2. Open https://suydev.github.io/isotope-code/ in Safari"
  echo "     → Tap Share → Add to Home Screen (works fully offline as PWA)"
  echo ""
  echo "  The PWA version on GitHub Pages is the recommended iOS experience."
  echo "  No server or installation needed — installs directly to Home Screen."
  echo ""
  exit 0
fi

# ── Check for updates ─────────────────────────────────────────────────────────
check_update() {
  info "Checking GitHub for updates..."
  LATEST=$(curl -fsSL "$API_URL" 2>/dev/null | grep '"tag_name"' | \
    sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' | sed 's/^v//')
  CURRENT=$(cat "$VERSION_FILE" 2>/dev/null | sed 's/^v//' || echo "0.0.0")

  if [ -z "$LATEST" ]; then
    warn "Cannot reach GitHub. Using local version ($CURRENT)."
    return 1
  fi
  if [ "$LATEST" != "$CURRENT" ]; then
    info "Update available: v$CURRENT → v$LATEST"
    return 0
  else
    ok "Already on latest: v$CURRENT"
    return 1
  fi
}

# ── Install or update ─────────────────────────────────────────────────────────
if [ -d "$INSTALL_DIR/.git" ]; then
  if check_update; then
    info "Updating..."
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

# ── Create alias ──────────────────────────────────────────────────────────────
if ! grep -q "isotopeai" "$HOME/.profile" 2>/dev/null; then
  echo "alias isotopeai='PORT=$PORT node $INSTALL_DIR/server.mjs'" >> "$HOME/.profile"
  ok "Alias 'isotopeai' added"
fi

echo ""
ok "IsotopeAI ready!"
info "Run: node $INSTALL_DIR/server.mjs"
info "Then open Safari → http://localhost:${PORT}"
info "Tip: Tap Share → Add to Home Screen for a full PWA experience!"
echo ""

read -p "Start now? [Y/n]: " START
case "$START" in
  [Nn]*) exit 0 ;;
  *) PORT=$PORT node "$INSTALL_DIR/server.mjs" ;;
esac
