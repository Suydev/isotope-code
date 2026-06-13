#!/usr/bin/env bash
# IsotopeAI — cross-platform setup script
# ──────────────────────────────────────────────────────────────────────────────
# Usage: bash setup.sh [OPTIONS]
#
# Options:
#   --yes / -y          Non-interactive; accept all defaults
#   --no-start          Don't start the server after setup
#   --port=PORT         Port to use (default: 3000)
#   --termux            Force Termux mode even if auto-detection misses
#   --repair            Re-run dependency install + CLI reinstall (skip .env)
#   --install-widgets   Always install Termux Widget shortcuts (skip prompt)
#   --skip-upgrade      Skip pkg update/upgrade on Termux
#   --termux-ci         CI simulation mode (sets TERMUX_VERSION=ci-test)
# ──────────────────────────────────────────────────────────────────────────────
set -u

NODE_MIN=18
NO_START=0
YES=0
REPAIR=0
INSTALL_WIDGETS=0
SKIP_UPGRADE=0
PORT_VALUE="${PORT:-3000}"
FORCE_TERMUX=0
ENV_FILE="${ISOTOPE_ENV_FILE:-.env}"
LEGACY_ENV_FILE="yeh.env"

for arg in "$@"; do
  case "$arg" in
    --no-start)        NO_START=1 ;;
    --yes|-y)          YES=1 ;;
    --port=*)          PORT_VALUE="${arg#--port=}" ;;
    --termux)          FORCE_TERMUX=1 ;;
    --repair)          REPAIR=1; YES=1; NO_START=1 ;;
    --install-widgets) INSTALL_WIDGETS=1 ;;
    --skip-upgrade)    SKIP_UPGRADE=1 ;;
    --termux-ci)       TERMUX_VERSION="${TERMUX_VERSION:-ci-test}" ;;
  esac
done

# ── helpers ───────────────────────────────────────────────────────────────────
info() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
has()  { command -v "$1" >/dev/null 2>&1; }

ISO_HOME="${ISOTOPE_HOME:-$HOME/.isotope}"
LOG_DIR="$ISO_HOME/logs"
SETUP_LOG="$LOG_DIR/setup.log"
mkdir -p "$ISO_HOME" "$LOG_DIR"

ts() { date '+%Y-%m-%d %H:%M:%S' 2>/dev/null || printf 'now'; }

log_setup() {
  printf '[%s] %s\n' "$(ts)" "$*" >> "$SETUP_LOG" 2>/dev/null || true
}

info_log() { info "$*"; log_setup "$*"; }
warn_log() { warn "$*"; log_setup "WARN: $*"; }
fail_log() { log_setup "ERROR: $*"; fail "$*"; }

# ── platform detection ────────────────────────────────────────────────────────
platform() {
  [ "$FORCE_TERMUX" -eq 1 ] && echo termux && return
  if [ -n "${TERMUX_VERSION:-}" ] || printf '%s' "${PREFIX:-}" | grep -q 'com.termux'; then
    echo termux
    return
  fi
  case "$(uname -s 2>/dev/null || echo unknown)" in
    Darwin)           echo macos ;;
    Linux)            echo linux ;;
    MINGW*|MSYS*|CYGWIN*) echo windows-sh ;;
    *)                echo unknown ;;
  esac
}

OS="$(platform)"
log_setup "Platform: $OS | Node min: $NODE_MIN | Port: $PORT_VALUE | YES: $YES | NO_START: $NO_START | REPAIR: $REPAIR"

# ── Termux stale-source warning ───────────────────────────────────────────────
check_termux_source() {
  [ "$OS" = "termux" ] || return 0
  VER="${TERMUX_VERSION:-0}"
  case "$VER" in
    0.*)
      warn_log "Termux v$VER may be the outdated Play Store version (stopped updates in 2020).
       Recommend installing from F-Droid or GitHub release instead:
         https://f-droid.org/packages/com.termux/
         https://github.com/termux/termux-app/releases"
      ;;
  esac
}

# ── internet check ────────────────────────────────────────────────────────────
check_internet() {
  if has curl; then
    curl -fsSL --connect-timeout 8 --max-time 10 https://github.com -o /dev/null 2>/dev/null && return 0
  elif has wget; then
    wget -q --timeout=10 --tries=1 https://github.com -O /dev/null 2>/dev/null && return 0
  fi
  return 1
}

# ── wake lock (Termux only) ───────────────────────────────────────────────────
WAKE_LOCKED=0
acquire_wake_lock() {
  [ "$OS" = "termux" ] || return 0
  if has termux-wake-lock; then
    termux-wake-lock >/dev/null 2>&1 && WAKE_LOCKED=1 && log_setup "Wake lock acquired"
  fi
}
release_wake_lock() {
  [ "$WAKE_LOCKED" -eq 1 ] || return 0
  has termux-wake-unlock && termux-wake-unlock >/dev/null 2>&1 || true
  log_setup "Wake lock released"
}
trap release_wake_lock EXIT

# ── Termux: update + upgrade (with retry + clear failure) ─────────────────────
termux_preflight() {
  [ "$OS" = "termux" ] || return 0
  has pkg || return 0

  if [ "$SKIP_UPGRADE" -eq 1 ]; then
    warn_log "Skipping pkg update/upgrade (--skip-upgrade)"
    return 0
  fi

  info_log "Updating Termux package lists..."
  PKG_OK=0
  for attempt in 1 2 3; do
    if pkg update -y >> "$SETUP_LOG" 2>&1; then
      PKG_OK=1
      break
    fi
    warn_log "pkg update attempt $attempt/3 failed. Retrying in 3s..."
    sleep 3
  done

  if [ "$PKG_OK" -eq 0 ]; then
    warn_log "pkg update failed after 3 attempts.
       Fix Termux repos with:  termux-change-repo
       Then re-run setup.sh."
    if [ "$YES" -eq 0 ]; then
      printf 'Continue anyway? [y/N]: '
      IFS= read -r reply
      case "$reply" in y|Y|yes|YES) : ;; *) fail "Aborted. Fix pkg repos first: termux-change-repo" ;; esac
    fi
  else
    info_log "pkg update OK"
  fi

  info_log "Upgrading Termux packages..."
  pkg upgrade -y >> "$SETUP_LOG" 2>&1 || warn_log "pkg upgrade had non-fatal errors (continuing)"
  info_log "pkg upgrade OK"
}

# ── Termux: install a single package with retry (no silent || true) ───────────
termux_install_pkg() {
  pkg_name="$1"
  is_critical="${2:-critical}"
  if has "$pkg_name"; then
    info_log "$pkg_name already installed"
    return 0
  fi
  log_setup "Installing $pkg_name (critical=$is_critical)..."
  for attempt in 1 2 3; do
    if pkg install -y "$pkg_name" >> "$SETUP_LOG" 2>&1; then
      info_log "$pkg_name installed OK"
      return 0
    fi
    warn_log "pkg install $pkg_name attempt $attempt/3 failed. Retrying..."
    sleep 2
  done
  if [ "$is_critical" = "critical" ]; then
    fail_log "Could not install $pkg_name after 3 attempts.
     Try manually: pkg install $pkg_name
     Or repair: termux-change-repo"
  else
    warn_log "Could not install $pkg_name (optional — some features may not work)"
    return 0
  fi
}

# ── try_install_deps ──────────────────────────────────────────────────────────
try_install_deps() {
  info "Detected platform: $OS"
  if has node && has git; then return 0; fi

  case "$OS" in
    termux)
      termux_install_pkg nodejs critical
      termux_install_pkg git critical
      has curl  || termux_install_pkg curl optional
      has wget  || termux_install_pkg wget optional
      has unzip || termux_install_pkg unzip optional
      has zip   || termux_install_pkg zip optional
      ;;
    macos)
      if has brew; then
        has node || brew install node
        has git  || brew install git
      else
        warn "Install Node.js 18+ from https://nodejs.org and Git from https://git-scm.com, then re-run setup.sh."
      fi
      ;;
    linux)
      SUDO=""
      [ "$(id -u)" -ne 0 ] && has sudo && SUDO=sudo

      has git || {
        if has apt-get; then
          $SUDO apt-get update -q >> "$SETUP_LOG" 2>&1 || true
          $SUDO apt-get install -y git >> "$SETUP_LOG" 2>&1 || true
        elif has dnf;    then $SUDO dnf install -y git    >> "$SETUP_LOG" 2>&1 || true
        elif has pacman; then $SUDO pacman -Sy --noconfirm git >> "$SETUP_LOG" 2>&1 || true
        fi
      }

      _need_node=1
      if has node; then
        _nv="$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
        [ "$_nv" -ge "$NODE_MIN" ] 2>/dev/null && _need_node=0
      fi

      if [ "$_need_node" -eq 1 ]; then
        if has apt-get && has curl; then
          info "Installing Node.js 22 via NodeSource..."
          curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO bash - >> "$SETUP_LOG" 2>&1 || true
          $SUDO apt-get install -y nodejs >> "$SETUP_LOG" 2>&1 || true
        elif has apt-get && has wget; then
          wget -qO- https://deb.nodesource.com/setup_22.x | $SUDO bash - >> "$SETUP_LOG" 2>&1 || true
          $SUDO apt-get install -y nodejs >> "$SETUP_LOG" 2>&1 || true
        elif has dnf;    then $SUDO dnf install -y nodejs npm >> "$SETUP_LOG" 2>&1 || true
        elif has pacman; then $SUDO pacman -Sy --noconfirm nodejs npm >> "$SETUP_LOG" 2>&1 || true
        elif has curl; then
          info "Trying nvm to install Node.js 22..."
          curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash >> "$SETUP_LOG" 2>&1 || true
          export NVM_DIR="$HOME/.nvm"
          # shellcheck disable=SC1091
          [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || true
          has nvm && nvm install 22 && nvm use 22 >> "$SETUP_LOG" 2>&1 || true
        else
          warn "Could not install Node.js automatically. Install Node.js 18+ from https://nodejs.org and re-run."
        fi
      fi
      ;;
  esac
}

# ── env helpers ───────────────────────────────────────────────────────────────
ensure_env_file() {
  if [ -n "${ISOTOPE_ENV_FILE:-}" ]; then
    [ -f "$ENV_FILE" ] || fail_log "ISOTOPE_ENV_FILE points to missing file: $ENV_FILE"
    if [ "$ENV_FILE" != ".env" ]; then
      cp "$ENV_FILE" .env
      info_log "Copied ISOTOPE_ENV_FILE to .env."
      ENV_FILE=".env"
    fi
    return 0
  fi

  if [ ! -f "$ENV_FILE" ] && [ -f "$LEGACY_ENV_FILE" ]; then
    cp "$LEGACY_ENV_FILE" "$ENV_FILE"
    info_log "Copied legacy yeh.env to .env."
    return 0
  fi

  if [ ! -f "$ENV_FILE" ]; then
    [ -f .env.example ] || fail ".env.example is missing."
    cp .env.example "$ENV_FILE"
    info_log "Created $ENV_FILE from .env.example."
  fi
}

read_env_key() {
  node - "$1" "$2" <<'NODE'
const fs = require('fs');
const [file, key] = process.argv.slice(2);
let out = '';
try {
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    if (line.slice(0, eq).trim() !== key) continue;
    out = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
  }
} catch {}
process.stdout.write(out);
NODE
}

write_env_key() {
  node - "$1" "$2" "$3" <<'NODE'
const fs = require('fs');
const [file, key, value] = process.argv.slice(2);
let text = '';
try { text = fs.readFileSync(file, 'utf8'); } catch {}
const lines = text ? text.split(/\r?\n/) : [];
let found = false;
for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
  const left = trimmed.slice(0, trimmed.indexOf('=')).trim();
  if (left === key) { lines[i] = key + '=' + value; found = true; }
}
if (!found) lines.push(key + '=' + value);
fs.writeFileSync(file, lines.join('\n').replace(/\n*$/, '\n'));
NODE
}

prompt_env_value() {
  key="$1"
  label="$2"
  current="$(read_env_key "$ENV_FILE" "$key")"
  if [ -n "$current" ]; then
    info_log "$key is already set in $ENV_FILE."
    return
  fi
  if [ "$YES" -eq 1 ] || [ ! -t 0 ]; then
    fail "$key is missing in $ENV_FILE. Add it and re-run."
    return
  fi
  info ""
  info "$label"
  printf '%s: ' "$key"
  IFS= read -r value
  [ -n "$value" ] && write_env_key "$ENV_FILE" "$key" "$value"
}

# ── stale alias check ─────────────────────────────────────────────────────────
warn_stale_aliases() {
  for file in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile" "$HOME/.bash_profile"; do
    [ -f "$file" ] || continue
    while IFS= read -r line; do
      case "$line" in
        *"alias isotope="*|*"alias isotopeai="*|*"function isotope"*|*"function isotopeai"*|*"isotope()"*|*"isotopeai()"*)
          case "$line" in
            *"/bin/isotope"*|*"/usr/bin/isotope"*) ;;
            *) warn "Stale isotope alias/function may hijack the command in $file: $line" ;;
          esac
          ;;
      esac
    done < "$file"
  done
}

# ── validate_node ─────────────────────────────────────────────────────────────
validate_node() {
  has node || fail_log "Node.js ${NODE_MIN}+ is required."
  major="$(node -e "process.stdout.write(process.versions.node.split('.')[0])")"
  [ "$major" -ge "$NODE_MIN" ] || fail_log "Node.js ${NODE_MIN}+ required; found $(node --version)."
  info_log "Node $(node --version) ready"
}

# ── validate_cloud_config ─────────────────────────────────────────────────────
validate_cloud_config() {
  url="$(read_env_key "$ENV_FILE" SUPABASE_URL)"
  anon="$(read_env_key "$ENV_FILE" SUPABASE_ANON_KEY)"
  case "$url" in
    https://*.supabase.co) : ;;
    *) fail_log "SUPABASE_URL must look like https://your-project-ref.supabase.co" ;;
  esac
  [ "$(printf '%s' "$anon" | awk -F. '{print NF}')" -ge 3 ] \
    || fail_log "SUPABASE_ANON_KEY must be JWT-like (3 dot-separated parts)."
  info_log "Supabase cloud sync config is present. Secrets were not printed."
}

# ── install_global_command ────────────────────────────────────────────────────
install_global_command() {
  mkdir -p "$ISO_HOME" "$LOG_DIR"
  printf '%s\n' "$(pwd)" > "$ISO_HOME/project-path"

  if [ "$OS" = "termux" ]; then
    dest="${PREFIX:-/data/data/com.termux/files/usr}/bin/isotope"
  else
    mkdir -p "$HOME/.local/bin"
    dest="$HOME/.local/bin/isotope"
  fi

  cp bin/isotope "$dest"
  chmod +x "$dest"
  info_log "Installed command: $dest"

  case ":${PATH}:" in
    *":$(dirname "$dest"):"*) : ;;
    *) warn "$(dirname "$dest") is not in PATH. Run: $dest start" ;;
  esac

  # Add to PATH in shell rc if not already present
  for rc in "$HOME/.bashrc" "$HOME/.bash_profile" "$HOME/.profile"; do
    [ -f "$rc" ] || continue
    DEST_DIR="$(dirname "$dest")"
    if ! grep -q "$DEST_DIR" "$rc" 2>/dev/null; then
      printf '\nexport PATH="%s:$PATH"\n' "$DEST_DIR" >> "$rc"
      info_log "Added $DEST_DIR to PATH in $rc"
    fi
  done

  ISOTOPE_COMMAND="$dest"
  export ISOTOPE_COMMAND
}

# ── maybe_setup_termux_widget ─────────────────────────────────────────────────
maybe_setup_termux_widget() {
  [ "$OS" = "termux" ] || return 0

  if [ "$INSTALL_WIDGETS" -eq 1 ] || [ "$YES" -eq 1 ] || [ ! -t 0 ]; then
    install_widgets="${INSTALL_TERMUX_WIDGETS:-yes}"
  else
    info ""
    printf 'Install Termux Widget home-screen shortcuts? [Y/n]: '
    IFS= read -r reply
    case "$reply" in n|N|no|NO) install_widgets=no ;; *) install_widgets=yes ;; esac
  fi

  if [ "$install_widgets" = "yes" ]; then
    bash setup-termux-widget.sh || warn "Widget install had errors. Run: bash setup-termux-widget.sh"
  else
    info "Skipped Termux Widget shortcuts. Run later: bash setup-termux-widget.sh"
  fi
}

# ── main ──────────────────────────────────────────────────────────────────────
info ""
info "IsotopeAI setup"
info "Working directory: $(pwd)"
info "Setup log: $SETUP_LOG"
info ""

[ -f server.mjs ] || fail "Run setup.sh from the IsotopeAI project directory."

check_termux_source
acquire_wake_lock
termux_preflight
try_install_deps
validate_node

has npm && info_log "npm $(npm --version) ready" \
  || warn_log "npm not found. The app has zero runtime npm dependencies — this is OK."
has git && info_log "git ready" \
  || warn_log "Git not found. isotope update needs Git."

if [ "$REPAIR" -eq 0 ]; then
  ensure_env_file
  prompt_env_value SUPABASE_URL "Enter your Supabase project URL for cloud sync."
  prompt_env_value SUPABASE_ANON_KEY "Enter your Supabase anon key."
  if [ -z "$(read_env_key "$ENV_FILE" ENABLE_ADMIN_MODE)" ]; then
    write_env_key "$ENV_FILE" ENABLE_ADMIN_MODE false
    info_log "ENABLE_ADMIN_MODE was missing; set to false."
  else
    info_log "ENABLE_ADMIN_MODE is already set in $ENV_FILE."
  fi
  validate_cloud_config
else
  info_log "Repair mode: skipping .env prompts (preserving existing .env)"
fi

if has npm && [ -f package.json ]; then
  info_log "Running npm install..."
  npm install >> "$SETUP_LOG" 2>&1 || warn_log "npm install had errors (continuing)"
fi

node --check server.mjs >/dev/null 2>&1 \
  || fail_log "server.mjs syntax check failed. The file may be corrupted."
info_log "Server syntax check passed"

install_global_command
warn_stale_aliases
maybe_setup_termux_widget

log_setup "Setup complete. Port=$PORT_VALUE"
info ""
info "Setup complete."
info "Local URL: http://127.0.0.1:${PORT_VALUE}"
info "Commands:"
info "  isotope start    — start the server"
info "  isotope update   — pull latest version"
info "  isotope doctor   — check everything"
info "  isotope stop     — stop the server"
info ""

if [ "$NO_START" -eq 0 ]; then
  PORT="$PORT_VALUE" "${ISOTOPE_COMMAND}" start
else
  info "Start later with: isotope start"
fi
