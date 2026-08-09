#!/usr/bin/env bash
# IsotopeAI — Linux/macOS one-line installer
# ──────────────────────────────────────────────────────────────────────────────
# Run with:
#   bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install.sh)
#
# Or download first:
#   curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install.sh -o install.sh
#   bash install.sh [--yes] [--no-start] [--port=3000] [--dir=~/isotope-code]
#
# Installers per OS:
#   Android Termux : bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
#   Linux / macOS  : bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install.sh)
#   Windows        : irm https://raw.githubusercontent.com/Suydev/isotope-code/main/install.ps1 | iex
# ──────────────────────────────────────────────────────────────────────────────
set -u

REPO_URL="https://github.com/Suydev/isotope-code.git"
REPO_BRANCH="main"
INSTALL_DIR="${ISOTOPE_INSTALL_DIR:-$HOME/isotope-code}"
ISO_HOME="${ISOTOPE_HOME:-$HOME/.isotope}"
LOG_DIR="$ISO_HOME/logs"
LOG_FILE="$LOG_DIR/install.log"
PORT_VALUE=3000

YES=0
NO_START=0
for arg in "$@"; do
  case "$arg" in
    --yes|-y)       YES=1 ;;
    --no-start)     NO_START=1 ;;
    --port=*)       PORT_VALUE="${arg#--port=}" ;;
    --dir=*)        INSTALL_DIR="${arg#--dir=}" ;;
  esac
done

# ── helpers ───────────────────────────────────────────────────────────────────
has() { command -v "$1" >/dev/null 2>&1; }

ts()  { date '+%Y-%m-%d %H:%M:%S' 2>/dev/null || printf '%s' 'now'; }

mkdir -p "$ISO_HOME" "$LOG_DIR"

log() {
  local msg="[$(ts)] $*"
  printf '%s\n' "$msg"
  printf '%s\n' "$msg" >> "$LOG_FILE" 2>/dev/null || true
}

fail() {
  log "ERROR: $*"
  printf '\n  ❌  %s\n\n' "$*" >&2
  log "Install failed. Log: $LOG_FILE"
  exit 1
}

warn() {
  log "WARN: $*"
  printf '\n  ⚠️   %s\n' "$*"
}

step() {
  log "STEP: $*"
  printf '\n  ▶  %s\n' "$*"
}

ok() {
  log "OK:   $*"
  printf '  ✅  %s\n' "$*"
}

# ── platform detection ────────────────────────────────────────────────────────
case "$(uname -s 2>/dev/null || echo unknown)" in
  Darwin) OS=macos ;;
  Linux)  OS=linux ;;
  MINGW*|MSYS*|CYGWIN*) OS=windows-sh ;;
  *)      OS=unknown ;;
esac

if [ -n "${TERMUX_VERSION:-}" ] || printf '%s' "${PREFIX:-}" | grep -q 'com.termux'; then
  fail "Termux detected. Use the Termux installer instead:
       bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)"
fi

[ "$OS" != "unknown" ] || fail "Unsupported platform. Install Node.js 18+ and run setup.sh manually."

step "Checking environment..."
ok "Platform: $OS"

# ── internet check ────────────────────────────────────────────────────────────
step "Checking internet connectivity..."
INTERNET=0
if has curl; then
  curl -fsSL --connect-timeout 8 --max-time 10 https://github.com -o /dev/null 2>/dev/null && INTERNET=1
elif has wget; then
  wget -q --timeout=10 --tries=1 https://github.com -O /dev/null 2>/dev/null && INTERNET=1
fi
[ "$INTERNET" -eq 1 ] || fail "No internet access. Connect to the internet and retry."
ok "Internet OK"

# ── install dependencies (node + git) ─────────────────────────────────────────
step "Checking Node.js and Git..."

install_pkg() {
  pkg_name="$1"
  if has "$pkg_name"; then
    ok "$pkg_name already installed"
    return 0
  fi
  log "Installing $pkg_name..."
  for attempt in 1 2 3; do
    if "$@" >> "$LOG_FILE" 2>&1; then
      ok "$pkg_name installed"
      return 0
    fi
    warn "Install of $pkg_name failed (attempt $attempt/3). Retrying..."
    sleep 2
  done
  fail "Could not install $pkg_name after 3 attempts."
}

case "$OS" in
  macos)
    if has brew; then
      has node || brew install node
      has git  || brew install git
    else
      warn "Homebrew not found. Install Node.js 18+ from https://nodejs.org and Git from https://git-scm.com, then re-run."
    fi
    ;;
  linux)
    SUDO=""
    [ "$(id -u)" -ne 0 ] && has sudo && SUDO=sudo

    if ! has git; then
      if has apt-get; then
        $SUDO apt-get update -q >> "$LOG_FILE" 2>&1 || true
        $SUDO apt-get install -y git >> "$LOG_FILE" 2>&1 || true
      elif has dnf;    then $SUDO dnf install -y git >> "$LOG_FILE" 2>&1 || true
      elif has pacman; then $SUDO pacman -Sy --noconfirm git >> "$LOG_FILE" 2>&1 || true
      fi
    fi

    _need_node=1
    if has node; then
      _nv="$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
      [ "$_nv" -ge 18 ] 2>/dev/null && _need_node=0
    fi

    if [ "$_need_node" -eq 1 ]; then
      if has apt-get && has curl; then
        info_log() { :; }
        curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO bash - >> "$LOG_FILE" 2>&1 || true
        $SUDO apt-get install -y nodejs >> "$LOG_FILE" 2>&1 || true
      elif has apt-get && has wget; then
        wget -qO- https://deb.nodesource.com/setup_22.x | $SUDO bash - >> "$LOG_FILE" 2>&1 || true
        $SUDO apt-get install -y nodejs >> "$LOG_FILE" 2>&1 || true
      elif has dnf; then $SUDO dnf install -y nodejs npm >> "$LOG_FILE" 2>&1 || true
      elif has pacman; then $SUDO pacman -Sy --noconfirm nodejs npm >> "$LOG_FILE" 2>&1 || true
      elif has curl; then
        curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash >> "$LOG_FILE" 2>&1 || true
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || true
        has nvm && nvm install 22 && nvm use 22 >> "$LOG_FILE" 2>&1 || true
      else
        warn "Could not install Node.js automatically. Install Node.js 18+ from https://nodejs.org and re-run."
      fi
    fi
    ;;
esac

has node || fail "Node.js 18+ is required. Install it and re-run."
NODE_MAJOR="$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
[ "$NODE_MAJOR" -ge 18 ] 2>/dev/null || fail "Node.js 18+ is required; got $(node --version)."
ok "node $(node --version)"
has git || fail "Git is required. Install it and re-run (needed for isotope update)."
ok "git $(git --version | awk '{print $3}')"
has npm && ok "npm $(npm --version)" || warn "npm not found (the app has zero runtime npm deps — this is OK)"

# ── clone or update the repo ──────────────────────────────────────────────────
step "Setting up IsotopeAI project in: $INSTALL_DIR"

if [ -d "$INSTALL_DIR/.git" ]; then
  ok "Repository already exists — pulling latest changes..."
  cd "$INSTALL_DIR" || fail "Cannot cd into $INSTALL_DIR"
  git fetch origin "$REPO_BRANCH" >> "$LOG_FILE" 2>&1 || warn "git fetch failed — using existing code"
  LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || echo)"
  REMOTE_SHA="$(git rev-parse "origin/$REPO_BRANCH" 2>/dev/null || echo)"
  if [ -n "$REMOTE_SHA" ] && [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
    git merge --ff-only "origin/$REPO_BRANCH" >> "$LOG_FILE" 2>&1 || warn "Could not fast-forward — using existing code"
    ok "Updated to latest version"
  else
    ok "Already up to date"
  fi
elif [ -d "$INSTALL_DIR" ]; then
  warn "$INSTALL_DIR exists but is not a git repo. Moving it to ${INSTALL_DIR}.bak"
  mv "$INSTALL_DIR" "${INSTALL_DIR}.bak.$(date +%Y%m%d%H%M%S)" || fail "Could not move existing $INSTALL_DIR"
  git clone --branch "$REPO_BRANCH" --depth 20 "$REPO_URL" "$INSTALL_DIR" >> "$LOG_FILE" 2>&1 \
    || fail "git clone failed. Check internet and try again."
  ok "Repository cloned"
else
  step "Cloning IsotopeAI from GitHub..."
  git clone --branch "$REPO_BRANCH" --depth 20 "$REPO_URL" "$INSTALL_DIR" >> "$LOG_FILE" 2>&1 \
    || fail "git clone failed. Check internet and try again."
  ok "Repository cloned to $INSTALL_DIR"
fi

cd "$INSTALL_DIR" || fail "Cannot cd into $INSTALL_DIR"

# ── run the main setup ────────────────────────────────────────────────────────
step "Running setup..."
SETUP_FLAGS="--yes --no-start"
[ "$PORT_VALUE" != "3000" ] && SETUP_FLAGS="$SETUP_FLAGS --port=$PORT_VALUE"

# shellcheck disable=SC2086
PORT="$PORT_VALUE" bash setup.sh $SETUP_FLAGS \
  || fail "setup.sh failed. Check log: $LOG_FILE"

ok "Setup complete"

# ── done — show summary ───────────────────────────────────────────────────────
printf '\n'
printf '  ─────────────────────────────────────────\n'
printf '  ✅  IsotopeAI installed!\n'
printf '  ─────────────────────────────────────────\n'
printf '  Project:  %s\n' "$INSTALL_DIR"
printf '  Log:      %s\n' "$LOG_FILE"
printf '\n'
printf '  Commands:\n'
printf '    isotope start    — start the server\n'
printf '    isotope update   — pull latest version\n'
printf '    isotope doctor   — check everything\n'
printf '    isotope open     — open in browser\n'
printf '\n'

# ── start server if requested ─────────────────────────────────────────────────
if [ "$NO_START" -eq 0 ]; then
  step "Starting IsotopeAI..."
  if has isotope; then
    PORT="$PORT_VALUE" isotope start || warn "Could not auto-start. Run: isotope start"
  else
    PORT="$PORT_VALUE" "$INSTALL_DIR/bin/isotope" start || warn "Could not auto-start. Run: cd $INSTALL_DIR && isotope start"
  fi
fi

log "Installation complete"
printf '  ─────────────────────────────────────────\n'
printf '  🎉  IsotopeAI is ready. Happy studying!\n'
printf '  ─────────────────────────────────────────\n\n'
