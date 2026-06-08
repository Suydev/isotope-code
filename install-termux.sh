#!/usr/bin/env bash
# IsotopeAI — Termux one-line installer
# ──────────────────────────────────────────────────────────────────────────────
# Run with:
#   bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
#
# Or download first:
#   curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh -o install-termux.sh
#   bash install-termux.sh [--yes] [--skip-upgrade] [--no-start] [--port=3000]
# ──────────────────────────────────────────────────────────────────────────────
set -u

REPO_URL="https://github.com/Suydev/isotope-code.git"
REPO_BRANCH="main"
INSTALL_DIR="$HOME/isotope-code"
ISO_HOME="$HOME/.isotope"
LOG_DIR="$ISO_HOME/logs"
LOG_FILE="$LOG_DIR/install.log"
PORT_VALUE=3000

YES=0
SKIP_UPGRADE=0
NO_START=0
for arg in "$@"; do
  case "$arg" in
    --yes|-y)       YES=1 ;;
    --skip-upgrade) SKIP_UPGRADE=1 ;;
    --no-start)     NO_START=1 ;;
    --port=*)       PORT_VALUE="${arg#--port=}" ;;
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

# ── Termux detection ──────────────────────────────────────────────────────────
step "Checking environment..."

if [ -z "${TERMUX_VERSION:-}" ] && ! printf '%s' "${PREFIX:-}" | grep -q 'com.termux'; then
  fail "Termux not detected. This script is for Android Termux only.
       Install Termux from F-Droid: https://f-droid.org/packages/com.termux/
       Then re-run this script inside Termux."
fi
ok "Termux detected (TERMUX_VERSION=${TERMUX_VERSION:-unknown})"

# ── Warn about Play Store Termux ──────────────────────────────────────────────
# The Play Store version stopped receiving updates in 2020 and has known bugs.
# pkg info shows the source; alternatively check if pkg itself is very old.
TERMUX_APK_SOURCE=""
if has dpkg; then
  TERMUX_APK_SOURCE="$(dpkg -l com.termux 2>/dev/null || true)"
fi
if [ -f "/data/data/com.termux/files/usr/etc/apt/sources.list" ]; then
  if grep -q 'packages-24.termux.net\|termux.net' "/data/data/com.termux/files/usr/etc/apt/sources.list" 2>/dev/null; then
    : # modern repo — fine
  fi
fi
# A simple heuristic: if the Termux version number is very old, warn.
TERMUX_VER_NUM="${TERMUX_VERSION:-0}"
case "$TERMUX_VER_NUM" in
  0.*)
    warn "Termux v${TERMUX_VER_NUM} appears to be very old (possibly Play Store version).
       The Play Store version stopped receiving updates in 2020 and may fail.
       Install Termux from F-Droid or GitHub instead:
         https://f-droid.org/packages/com.termux/
         https://github.com/termux/termux-app/releases
       Then reinstall Termux:Widget from the same source."
    if [ "$YES" -eq 0 ]; then
      printf '  Continue anyway? [y/N]: '
      IFS= read -r reply
      case "$reply" in y|Y|yes|YES) : ;; *) fail "Aborted. Please upgrade Termux first." ;; esac
    fi
    ;;
esac

# ── Wake lock (optional — prevents Termux from sleeping during long install) ──
WAKE_LOCKED=0
if has termux-wake-lock; then
  termux-wake-lock >/dev/null 2>&1 && WAKE_LOCKED=1 && log "Wake lock acquired"
fi

unlock_wake() {
  if [ "$WAKE_LOCKED" -eq 1 ] && has termux-wake-unlock; then
    termux-wake-unlock >/dev/null 2>&1 || true
    log "Wake lock released"
  fi
}
trap unlock_wake EXIT

# ── Internet check ────────────────────────────────────────────────────────────
step "Checking internet connectivity..."
INTERNET=0
if has curl; then
  curl -fsSL --connect-timeout 8 --max-time 10 https://github.com -o /dev/null 2>/dev/null && INTERNET=1
elif has wget; then
  wget -q --timeout=10 --tries=1 https://github.com -O /dev/null 2>/dev/null && INTERNET=1
fi
[ "$INTERNET" -eq 1 ] || fail "No internet access. Connect to the internet and retry."
ok "Internet OK"

# ── Termux repo update + upgrade ──────────────────────────────────────────────
if [ "$SKIP_UPGRADE" -eq 0 ]; then
  step "Updating Termux package lists..."
  PKG_UPDATE_OK=0
  for attempt in 1 2 3; do
    log "pkg update attempt $attempt"
    if pkg update -y >> "$LOG_FILE" 2>&1; then
      PKG_UPDATE_OK=1
      break
    fi
    warn "pkg update attempt $attempt failed (repo issue?). Retrying in 3s..."
    sleep 3
  done
  if [ "$PKG_UPDATE_OK" -eq 0 ]; then
    warn "pkg update failed after 3 attempts.
       Try running:  termux-change-repo
       Then re-run this script."
    if [ "$YES" -eq 0 ]; then
      printf '  Continue without update? [y/N]: '
      IFS= read -r reply
      case "$reply" in y|Y|yes|YES) : ;; *) fail "Aborted. Fix pkg repos first." ;; esac
    fi
  else
    ok "pkg update complete"
  fi

  step "Upgrading installed packages..."
  pkg upgrade -y >> "$LOG_FILE" 2>&1 || warn "pkg upgrade had non-fatal errors (continuing)"
  ok "pkg upgrade complete"
else
  log "Skipping pkg update/upgrade (--skip-upgrade)"
  warn "Skipped pkg update/upgrade. Packages may be outdated."
fi

# ── Install required dependencies ─────────────────────────────────────────────
step "Installing required packages (nodejs git curl wget unzip zip openssl termux-api)..."

install_pkg() {
  pkg_name="$1"
  is_critical="${2:-critical}"
  if has "$pkg_name"; then
    ok "$pkg_name already installed"
    return 0
  fi
  log "Installing $pkg_name..."
  for attempt in 1 2 3; do
    if pkg install -y "$pkg_name" >> "$LOG_FILE" 2>&1; then
      ok "$pkg_name installed"
      return 0
    fi
    warn "Install of $pkg_name failed (attempt $attempt/3). Retrying..."
    sleep 2
  done
  if [ "$is_critical" = "critical" ]; then
    fail "Could not install $pkg_name after 3 attempts.
         Try manually: pkg install $pkg_name
         Or repair repos: termux-change-repo"
  else
    warn "Could not install $pkg_name (optional — some features may not work)"
    return 0
  fi
}

# Node.js is provided by the 'nodejs' package in Termux
# Check if 'node' command exists; if not, try 'nodejs' package
if has node; then
  NODE_MAJOR="$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
  if [ "$NODE_MAJOR" -lt 18 ] 2>/dev/null; then
    warn "Node.js $(node --version) is too old (need 18+). Reinstalling..."
    pkg install -y nodejs >> "$LOG_FILE" 2>&1 || true
  else
    ok "node $(node --version) already installed"
  fi
else
  install_pkg nodejs critical
fi

install_pkg git critical
install_pkg curl optional
install_pkg wget optional
install_pkg unzip optional
install_pkg zip optional
install_pkg openssl optional
install_pkg termux-api optional

# ── Verify critical tools ─────────────────────────────────────────────────────
step "Verifying installations..."
has node  || fail "node is not available after install. Run: pkg install nodejs"
has git   || fail "git is not available after install. Run: pkg install git"
has curl || has wget || warn "Neither curl nor wget found. Some features may not work."

NODE_MAJOR="$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
[ "$NODE_MAJOR" -ge 18 ] 2>/dev/null || fail "Node.js 18+ is required; got $(node --version). Run: pkg install nodejs"

ok "node $(node --version)"
ok "git $(git --version | awk '{print $3}')"
has npm && ok "npm $(npm --version)" || warn "npm not found (the app has zero runtime npm deps — this is OK)"

# ── Storage check ─────────────────────────────────────────────────────────────
step "Checking storage..."
HOME_FREE_KB="$(df -k "$HOME" 2>/dev/null | awk 'NR==2{print $4}' || echo 0)"
if [ "$HOME_FREE_KB" -lt 102400 ]; then
  warn "Low storage: ${HOME_FREE_KB}KB free in \$HOME (need ~100MB for app + logs)"
fi
ok "Storage OK (${HOME_FREE_KB}KB free in \$HOME)"

# ── Clone or update the repo ──────────────────────────────────────────────────
step "Setting up IsotopeAI project in: $INSTALL_DIR"

if [ -d "$INSTALL_DIR/.git" ]; then
  ok "Repository already exists — pulling latest changes..."
  cd "$INSTALL_DIR" || fail "Cannot cd into $INSTALL_DIR"
  CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
  git fetch origin "$CURRENT_BRANCH" >> "$LOG_FILE" 2>&1 || warn "git fetch failed — using existing code"
  LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || echo)"
  REMOTE_SHA="$(git rev-parse "origin/$CURRENT_BRANCH" 2>/dev/null || echo)"
  if [ -n "$REMOTE_SHA" ] && [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
    git merge --ff-only "origin/$CURRENT_BRANCH" >> "$LOG_FILE" 2>&1 || warn "Could not fast-forward — using existing code"
    ok "Updated to latest version"
  else
    ok "Already up to date"
  fi
elif [ -d "$INSTALL_DIR" ]; then
  warn "$INSTALL_DIR exists but is not a git repo. Moving it to ${INSTALL_DIR}.bak"
  mv "$INSTALL_DIR" "${INSTALL_DIR}.bak.$(date +%Y%m%d%H%M%S)" || fail "Could not move existing $INSTALL_DIR"
  log "Cloning fresh..."
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

# ── Run the main setup ────────────────────────────────────────────────────────
step "Running setup..."
SETUP_FLAGS="--yes --no-start --install-widgets"
[ "$PORT_VALUE" != "3000" ] && SETUP_FLAGS="$SETUP_FLAGS --port=$PORT_VALUE"
[ "$SKIP_UPGRADE" -eq 1 ] && SETUP_FLAGS="$SETUP_FLAGS --skip-upgrade"

# shellcheck disable=SC2086
PORT="$PORT_VALUE" bash setup.sh $SETUP_FLAGS \
  || fail "setup.sh failed. Check log: $LOG_FILE"

ok "Setup complete"

# ── Done — show summary ───────────────────────────────────────────────────────
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
printf '  Home screen widgets:\n'
printf '    Long press home → Add widget → Termux Widget\n'
printf '    Choose: isotope-start, isotope-update, isotope-open\n'
printf '\n'

# ── Start server if requested ─────────────────────────────────────────────────
if [ "$NO_START" -eq 0 ]; then
  step "Starting IsotopeAI..."
  if has isotope; then
    PORT="$PORT_VALUE" isotope start || warn "Could not auto-start. Run: isotope start"
  else
    PORT="$PORT_VALUE" "$INSTALL_DIR/bin/isotope" start || warn "Could not auto-start. Run: cd $INSTALL_DIR && isotope start"
  fi
fi

# ── Run doctor to confirm everything is healthy ───────────────────────────────
step "Running doctor check..."
if has isotope; then
  isotope doctor 2>&1 | head -30 || true
else
  "$INSTALL_DIR/bin/isotope" doctor 2>&1 | head -30 || true
fi

log "Installation complete"
printf '  ─────────────────────────────────────────\n'
printf '  🎉  IsotopeAI is ready. Happy studying!\n'
printf '  ─────────────────────────────────────────\n\n'
