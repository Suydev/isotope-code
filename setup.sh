#!/usr/bin/env bash
set -euo pipefail

NODE_MIN=18
NO_START=0
YES=0
PORT_VALUE="${PORT:-5000}"

for arg in "$@"; do
  case "$arg" in
    --no-start) NO_START=1 ;;
    --yes|-y) YES=1 ;;
    --port=*) PORT_VALUE="${arg#--port=}" ;;
  esac
done

info() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
has() { command -v "$1" >/dev/null 2>&1; }

warn_stale_aliases() {
  for file in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile" "$HOME/.bash_profile"; do
    [ -f "$file" ] || continue
    while IFS= read -r line; do
      case "$line" in
        *"alias isotope="*|*"alias isotopeai="*|*"function isotope"*|*"function isotopeai"*|*"isotope()"*|*"isotopeai()"*)
          case "$line" in
            *"/bin/isotope"*|*"/usr/bin/isotope"*) ;;
            *) warn "Stale isotope alias/function may hijack the real command in $file: $line" ;;
          esac
          ;;
      esac
    done < "$file"
  done
}

platform() {
  if [ -n "${TERMUX_VERSION:-}" ] || printf '%s' "${PREFIX:-}" | grep -q 'com.termux'; then echo termux; return; fi
  case "$(uname -s 2>/dev/null || echo unknown)" in
    Darwin) echo macos ;;
    Linux) echo linux ;;
    MINGW*|MSYS*|CYGWIN*) echo windows-sh ;;
    *) echo unknown ;;
  esac
}

try_install_deps() {
  os="$(platform)"
  info "Detected platform: $os"
  if has node && has npm && has git; then return; fi
  case "$os" in
    termux)
      if has pkg; then
        info "Installing Node.js, npm, and Git with pkg if needed..."
        pkg update -y || true
        has node || pkg install -y nodejs || true
        has git || pkg install -y git || true
      fi
      ;;
    macos)
      if has brew; then
        has node || brew install node
        has git || brew install git
      else
        warn "Install Node.js 18+ from https://nodejs.org and Git from https://git-scm.com, then re-run setup.sh."
      fi
      ;;
    linux)
      SUDO=""
      [ "$(id -u)" -ne 0 ] && has sudo && SUDO=sudo
      if has apt-get; then
        $SUDO apt-get update || true
        $SUDO apt-get install -y nodejs npm git || true
      elif has dnf; then
        $SUDO dnf install -y nodejs npm git || true
      elif has pacman; then
        $SUDO pacman -Sy --noconfirm nodejs npm git || true
      fi
      ;;
  esac
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
  if (left === key) {
    lines[i] = key + '=' + value;
    found = true;
  }
}
if (!found) lines.push(key + '=' + value);
fs.writeFileSync(file, lines.join('\n').replace(/\n*$/, '\n'));
NODE
}

prompt_env_value() {
  key="$1"
  label="$2"
  current="$(read_env_key .env "$key")"
  if [ "$YES" -eq 1 ] || [ ! -t 0 ]; then
    [ -n "$current" ] || fail "$key is missing in .env"
    return
  fi
  info ""
  info "$label"
  if [ -n "$current" ]; then
    info "Current value is configured. Press Enter to keep it."
  fi
  printf '%s: ' "$key"
  IFS= read -r value
  if [ -n "$value" ]; then write_env_key .env "$key" "$value"; fi
}

validate_node() {
  has node || fail "Node.js ${NODE_MIN}+ is required."
  major="$(node -e "process.stdout.write(process.versions.node.split('.')[0])")"
  [ "$major" -ge "$NODE_MIN" ] || fail "Node.js ${NODE_MIN}+ is required; found $(node --version)."
  info "Node $(node --version) ready"
}

validate_cloud_config() {
  url="$(read_env_key .env SUPABASE_URL)"
  anon="$(read_env_key .env SUPABASE_ANON_KEY)"
  case "$url" in https://*.supabase.co) : ;; *) fail "SUPABASE_URL must look like https://your-project-ref.supabase.co" ;; esac
  [ "$(printf '%s' "$anon" | awk -F. '{print NF}')" -ge 3 ] || fail "SUPABASE_ANON_KEY must be JWT-like."
  info "Supabase cloud sync config is present. Secrets were not printed."
}

install_global_command() {
  os="$(platform)"
  mkdir -p "$HOME/.isotope/logs"
  printf '%s\n' "$(pwd)" > "$HOME/.isotope/project-path"
  if [ "$os" = "termux" ]; then
    dest="${PREFIX:-$HOME/.local}/bin/isotope"
  else
    mkdir -p "$HOME/.local/bin"
    dest="$HOME/.local/bin/isotope"
  fi
  cp bin/isotope "$dest"
  chmod +x "$dest"
  info "Installed command: $dest"
  case ":$PATH:" in
    *":$(dirname "$dest"):"*) : ;;
    *) warn "$(dirname "$dest") is not in PATH. Add it, or run: $dest start" ;;
  esac
  ISOTOPE_COMMAND="$dest"
}

maybe_setup_termux_widget() {
  [ "$(platform)" = "termux" ] || return 0
  if [ "$YES" -eq 1 ] || [ ! -t 0 ]; then
    install_widgets="${INSTALL_TERMUX_WIDGETS:-yes}"
  else
    info ""
    printf 'Install Termux Widget home-screen shortcuts? [Y/n]: '
    IFS= read -r reply
    case "$reply" in n|N|no|NO) install_widgets=no ;; *) install_widgets=yes ;; esac
  fi
  if [ "$install_widgets" = "yes" ]; then
    bash setup-termux-widget.sh
  else
    info "Skipped Termux Widget shortcuts."
  fi
}

info ""
info "Isotope local-server setup"
info "This is a downloadable local app. Supabase is used only for cloud sync/backend services."
info "Working directory: $(pwd)"
info ""

[ -f server.mjs ] || fail "Run setup.sh from the Isotope project directory."
try_install_deps
validate_node
has npm && info "npm ready" || warn "npm not found. The app has no external runtime dependency, but npm install will be skipped."
has git && info "Git ready" || warn "Git not found. isotope update needs Git."

if [ ! -f .env ]; then
  [ -f .env.example ] || fail ".env.example is missing."
  cp .env.example .env
  info "Created .env from .env.example."
fi

prompt_env_value SUPABASE_URL "Enter the Supabase project URL for cloud sync."
prompt_env_value SUPABASE_ANON_KEY "Enter the Supabase anon key for browser auth/cloud sync."
write_env_key .env ENABLE_ADMIN_MODE "$(read_env_key .env ENABLE_ADMIN_MODE || true)"
validate_cloud_config

if has npm; then
  info "Installing package metadata with npm install..."
  npm install
fi

node --check server.mjs >/dev/null
info "Server syntax check passed"

install_global_command
warn_stale_aliases
maybe_setup_termux_widget

info ""
info "Setup complete."
info "Local URL: http://127.0.0.1:${PORT_VALUE}"
info "Commands you can now use from any directory:"
info "  isotope start"
info "  isotope update"
info "  isotope doctor"
info ""

if [ "$NO_START" -eq 0 ]; then
  PORT="$PORT_VALUE" "$ISOTOPE_COMMAND" start
else
  info "Start later with: isotope start"
fi
