#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  IsotopeAI — Linux Installer & Auto-Updater                             ║
# ║  Credits: Arnav Singh (owner) · Suyash Prabh (developer)               ║
# ║  Repo:    https://github.com/Suydev/isotope-code                        ║
# ╚══════════════════════════════════════════════════════════════════════════╝
set -euo pipefail

REPO="Suydev/isotope-code"
INSTALL_DIR="$HOME/.isotope"
VERSION_FILE="$INSTALL_DIR/.version"
API_URL="https://api.github.com/repos/$REPO/releases/latest"
CLONE_URL="https://github.com/$REPO.git"
SERVICE_NAME="isotopeai"
PORT="${PORT:-3000}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${CYAN}[IsotopeAI]${NC} $*"; }
ok()    { echo -e "${GREEN}[  OK  ]${NC} $*"; }
warn()  { echo -e "${YELLOW}[ WARN ]${NC} $*"; }
error() { echo -e "${RED}[ERROR ]${NC} $*" >&2; exit 1; }

# ── Check for newer GitHub release ─────────────────────────────────────────
check_update() {
  info "Checking for updates from GitHub..."
  LATEST=$(curl -fsSL "$API_URL" 2>/dev/null | grep '"tag_name"' | \
    sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' | sed 's/^v//')
  CURRENT=$(cat "$VERSION_FILE" 2>/dev/null | sed 's/^v//' || echo "0.0.0")

  if [ -z "$LATEST" ]; then
    warn "Could not reach GitHub — continuing with local version ($CURRENT)"
    return 1
  fi

  if [ "$LATEST" != "$CURRENT" ]; then
    info "Update available: v$CURRENT → v$LATEST"
    return 0  # update needed
  else
    ok "Already on latest version v$CURRENT"
    return 1
  fi
}

# ── Install Node.js (if missing) ────────────────────────────────────────────
install_node() {
  if command -v node &>/dev/null; then
    NODE_VER=$(node -v 2>/dev/null)
    ok "Node.js already installed ($NODE_VER)"
    return
  fi

  info "Installing Node.js..."
  if command -v apt-get &>/dev/null; then
    sudo apt-get update -qq
    sudo apt-get install -y ca-certificates curl gnupg
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif command -v dnf &>/dev/null; then
    sudo dnf install -y nodejs npm
  elif command -v pacman &>/dev/null; then
    sudo pacman -Sy --noconfirm nodejs npm
  elif command -v zypper &>/dev/null; then
    sudo zypper install -y nodejs20
  else
    warn "Unknown package manager. Installing via nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
  fi
  ok "Node.js $(node -v) installed"
}

# ── Install Git (if missing) ─────────────────────────────────────────────────
install_git() {
  if command -v git &>/dev/null; then return; fi
  info "Installing git..."
  if command -v apt-get &>/dev/null; then sudo apt-get install -y git
  elif command -v dnf &>/dev/null; then sudo dnf install -y git
  elif command -v pacman &>/dev/null; then sudo pacman -Sy --noconfirm git
  else error "Cannot install git — install it manually and re-run."; fi
  ok "git installed"
}

# ── Fresh install ────────────────────────────────────────────────────────────
fresh_install() {
  info "Cloning IsotopeAI into $INSTALL_DIR..."
  rm -rf "$INSTALL_DIR"
  git clone --depth 1 "$CLONE_URL" "$INSTALL_DIR"
  LATEST=$(curl -fsSL "$API_URL" 2>/dev/null | grep '"tag_name"' | \
    sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' | sed 's/^v//' || echo "2.0.0")
  echo "$LATEST" > "$VERSION_FILE"
  ok "Installed v$LATEST"
}

# ── Update in-place ──────────────────────────────────────────────────────────
do_update() {
  info "Pulling latest from GitHub..."
  cd "$INSTALL_DIR"
  git fetch --depth 1 origin main
  git reset --hard origin/main
  LATEST=$(curl -fsSL "$API_URL" 2>/dev/null | grep '"tag_name"' | \
    sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' | sed 's/^v//' || echo "2.0.0")
  echo "$LATEST" > "$VERSION_FILE"
  ok "Updated to v$LATEST"
}

# ── Create systemd service (optional) ───────────────────────────────────────
install_service() {
  if ! command -v systemctl &>/dev/null; then return; fi
  read -rp "$(echo -e "${CYAN}Install as systemd service so it starts on boot? [y/N]: ${NC}")" REPLY
  if [[ "$REPLY" =~ ^[Yy]$ ]]; then
    NODE_PATH=$(command -v node)
    sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null <<EOF
[Unit]
Description=IsotopeAI Study App
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$NODE_PATH $INSTALL_DIR/server.mjs
Restart=on-failure
Environment=PORT=$PORT
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
    sudo systemctl daemon-reload
    sudo systemctl enable "$SERVICE_NAME"
    sudo systemctl start "$SERVICE_NAME"
    ok "Service installed and started. Manage with: sudo systemctl {start|stop|status} $SERVICE_NAME"
  fi
}

# ── Create launcher script ───────────────────────────────────────────────────
create_launcher() {
  LAUNCHER="/usr/local/bin/isotopeai"
  sudo tee "$LAUNCHER" > /dev/null <<'EOF'
#!/usr/bin/env bash
INSTALL_DIR="$HOME/.isotope"
PORT="${PORT:-3000}"
echo "Starting IsotopeAI on http://localhost:$PORT"
PORT=$PORT node "$INSTALL_DIR/server.mjs"
EOF
  sudo chmod +x "$LAUNCHER"
  ok "Launcher created — run: isotopeai"
}

# ════════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    IsotopeAI — Linux Installer v2.0      ║${NC}"
echo -e "${CYAN}║  by Arnav Singh & Suyash Prabh           ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

install_git
install_node

if [ -d "$INSTALL_DIR/.git" ]; then
  if check_update; then
    do_update
  fi
else
  fresh_install
fi

create_launcher 2>/dev/null || true
install_service

echo ""
ok "IsotopeAI is ready!"
info "Run:  isotopeai"
info "Or:   PORT=8080 node $INSTALL_DIR/server.mjs"
info "Then open: http://localhost:${PORT}"
info "App works offline after first load (PWA + Service Worker)"
echo ""
