#!/usr/bin/env bash
set -euo pipefail

NODE_MIN=18
PORT_VALUE="${PORT:-5000}"
NO_START=0
[ "${1:-}" = "--no-start" ] && NO_START=1

info() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
has() { command -v "$1" >/dev/null 2>&1; }

platform() {
  if [ -n "${TERMUX_VERSION:-}" ] || printf '%s' "${PREFIX:-}" | grep -q 'com.termux'; then echo termux; return; fi
  case "$(uname -s 2>/dev/null || echo unknown)" in
    Darwin) echo macos ;;
    Linux) echo linux ;;
    MINGW*|MSYS*|CYGWIN*) echo windows-sh ;;
    *) echo unknown ;;
  esac
}

try_install_node_git() {
  os="$(platform)"
  info "Detected platform: $os"
  if has node && has git; then return; fi

  case "$os" in
    termux)
      has pkg && pkg update -y && pkg install -y nodejs git || true
      ;;
    macos)
      if has brew; then
        has node || brew install node
        has git || brew install git
      else
        warn "Homebrew is not installed. Install Node.js from https://nodejs.org and Git from https://git-scm.com."
      fi
      ;;
    linux)
      if has apt-get; then
        SUDO=""; [ "$(id -u)" -ne 0 ] && has sudo && SUDO=sudo
        $SUDO apt-get update || true
        $SUDO apt-get install -y nodejs npm git || true
      elif has dnf; then
        SUDO=""; [ "$(id -u)" -ne 0 ] && has sudo && SUDO=sudo
        $SUDO dnf install -y nodejs npm git || true
      elif has pacman; then
        SUDO=""; [ "$(id -u)" -ne 0 ] && has sudo && SUDO=sudo
        $SUDO pacman -Sy --noconfirm nodejs npm git || true
      fi
      ;;
    windows-sh)
      if has winget; then
        has node || winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements || true
        has git || winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements || true
      fi
      ;;
  esac
}

read_env() {
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

validate_node() {
  has node || fail "Node.js ${NODE_MIN}+ is required. Re-run after installing from https://nodejs.org."
  major="$(node -e "process.stdout.write(process.versions.node.split('.')[0])")"
  [ "$major" -ge "$NODE_MIN" ] || fail "Node.js ${NODE_MIN}+ is required; found $(node --version)."
  info "Node $(node --version) ready"
}

info ""
info "Isotope local app setup"
info "This installs a local server. Supabase provides shared cloud sync."
info "Working directory: $(pwd)"
info ""

try_install_node_git
validate_node

if has git; then info "Git ready"; else warn "Git not found. Setup can run, but update scripts need Git."; fi

if [ ! -f .env ]; then
  [ -f .env.example ] || fail ".env.example is missing."
  cp .env.example .env
  info "Created .env with the default Isotope cloud sync settings."
fi

url="$(read_env .env SUPABASE_URL)"
anon="$(read_env .env SUPABASE_ANON_KEY)"
[ -n "$url" ] || fail "SUPABASE_URL is blank in .env"
[ -n "$anon" ] || fail "SUPABASE_ANON_KEY is blank in .env"
case "$url" in https://*.supabase.co) : ;; *) fail "SUPABASE_URL must be a Supabase project URL." ;; esac
[ "$(printf '%s' "$anon" | awk -F. '{print NF}')" -ge 3 ] || fail "SUPABASE_ANON_KEY must be JWT-like."
info "Cloud sync config ready"

if [ -f package.json ] && has npm; then
  info "Installing runtime metadata with npm..."
  npm install
else
  warn "npm not found. The server has no external runtime dependency, but package metadata was not refreshed."
fi

node --check server.mjs >/dev/null
info "Server syntax check passed"

info ""
info "Setup complete."
info "Local URL: http://localhost:${PORT_VALUE}"
info "Stop the server with Ctrl+C."
info ""

if [ "$NO_START" -eq 0 ]; then
  PORT="$PORT_VALUE" node server.mjs
else
  info "Start later with: PORT=${PORT_VALUE} node server.mjs"
fi
