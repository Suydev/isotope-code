#!/usr/bin/env bash
set -euo pipefail

NODE_MIN=18
PORT_VALUE="${PORT:-5000}"

info() { printf '%s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

parse_env() {
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
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out = v;
  }
} catch {}
process.stdout.write(out);
NODE
}

set_env_value() {
  node - "$1" "$2" "$3" <<'NODE'
const fs = require('fs');
const [file, key, value] = process.argv.slice(2);
const lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split(/\r?\n/) : [];
let seen = false;
const next = lines.map((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return line;
  const eq = line.indexOf('=');
  if (line.slice(0, eq).trim() !== key) return line;
  seen = true;
  return `${key}=${value}`;
});
if (!seen) next.push(`${key}=${value}`);
fs.writeFileSync(file, next.join('\n').replace(/\n*$/, '\n'));
NODE
}

prompt_if_blank() {
  key="$1"
  label="$2"
  current="$(parse_env .env "$key")"
  if [ -n "$current" ]; then
    return
  fi
  if [ ! -t 0 ]; then
    fail "$key is required in .env"
  fi
  printf '%s: ' "$label"
  IFS= read -r value
  [ -n "$value" ] || fail "$key cannot be blank"
  set_env_value .env "$key" "$value"
}

info ""
info "Isotope setup"
info "Working directory: $(pwd)"
info ""

command -v node >/dev/null 2>&1 || fail "Node.js ${NODE_MIN}+ is required. Install Node from https://nodejs.org or your platform package manager."
NODE_MAJOR="$(node -e "process.stdout.write(process.versions.node.split('.')[0])")"
[ "$NODE_MAJOR" -ge "$NODE_MIN" ] || fail "Node.js ${NODE_MIN}+ is required; found $(node --version)."
info "Node $(node --version) found"

if command -v git >/dev/null 2>&1; then
  info "Git found"
else
  info "Git not found. Updates from GitHub will not work until Git is installed."
fi

if [ -f package.json ]; then
  if command -v npm >/dev/null 2>&1; then
    info "Installing dependencies with npm..."
    npm install
  else
    info "npm not found; this package currently has no required external runtime dependencies."
  fi
fi

if [ ! -f .env ]; then
  [ -f .env.example ] || fail ".env.example is missing; create .env manually."
  cp .env.example .env
  info "Created .env from .env.example."
fi

info ""
info "Normal user mode needs only Supabase URL and anon key."
prompt_if_blank SUPABASE_URL "Supabase URL"
prompt_if_blank SUPABASE_ANON_KEY "Supabase anon key"

missing=""
for key in SUPABASE_URL SUPABASE_ANON_KEY; do
  value="$(parse_env .env "$key")"
  case "$value" in
    ""|*"..."*|*"your-project-ref"*|*"ChangeMe"*|*"generate-a-"*) missing="$missing $key" ;;
  esac
done
[ -z "$missing" ] || fail "Missing or placeholder values in .env:$missing"
info "Normal-mode environment values are present"

node --check server.mjs >/dev/null
info "server.mjs syntax check passed"

admin_enabled="$(parse_env .env ENABLE_ADMIN_MODE)"
admin_secret="$(parse_env .env ADMIN_SECRET)"
service_key="$(parse_env .env SUPABASE_SERVICE_ROLE_KEY)"
supabase_pat="$(parse_env .env SUPABASE_ACCESS_TOKEN)"
if printf '%s' "$admin_enabled" | grep -Eiq '^(1|true|yes)$' && [ -n "$admin_secret" ] && [ -n "$service_key" ] && [ -n "$supabase_pat" ] && command -v curl >/dev/null 2>&1; then
  info "Admin mode is configured; applying SQL through the protected local admin endpoint..."
  PORT="$PORT_VALUE" node server.mjs >/tmp/isotope-setup-server.log 2>&1 &
  srv_pid=$!
  cleanup() { kill "$srv_pid" >/dev/null 2>&1 || true; }
  trap cleanup EXIT
  sleep 3
  sql="$(node -e "const fs=require('fs');let s=fs.readFileSync('community-patch-v4.sql','utf8');if(fs.existsSync('events-expansion.sql'))s+='\\n\\n'+fs.readFileSync('events-expansion.sql','utf8');process.stdout.write(JSON.stringify(s));")"
  result="$(curl -fsS -X POST "http://127.0.0.1:${PORT_VALUE}/__admin/apply-sql" -H "Content-Type: application/json" -H "X-Admin-Secret: ${admin_secret}" -d "{\"pat\":\"${supabase_pat}\",\"sql\":${sql}}" || true)"
  if printf '%s' "$result" | grep -q '"ok":true'; then
    info "SQL applied successfully"
  else
    info "SQL was not applied automatically. Start the server and open /__admin/patch."
  fi
else
  info "Admin SQL apply skipped. This is expected for normal users."
fi

info ""
info "Setup checks complete."
info "Start the server with: PORT=${PORT_VALUE} node server.mjs"
info "Open: http://localhost:${PORT_VALUE}"
