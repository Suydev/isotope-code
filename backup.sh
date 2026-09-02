#!/usr/bin/env bash
# IsotopeAI — full Supabase backup & reinstall-anywhere restore.
#
# This file and isotope-apk/backup.sh are the SAME program, kept byte-identical.
# They diverged once, and the divergence was dangerous rather than cosmetic: this
# copy let `restore` infer its target from .env, which is production. If you edit
# one, copy it to the other.
#
# For setting up a project you do not have yet, use ./supabase.sh — `restore`
# replays a tarball, and a tarball only exists if you already had a working
# backend.
#
# backup:
#   ./backup.sh backup [--out DIR] [--no-storage] [--keep N] [--no-verify]
#        [--supabase-url URL --anon-key K --service-key K --pat TOKEN]
#     Dumps schema (scripts/schema-dump.mjs) + all DB tables + auth users
#     + storage buckets (avatars, user-content, notes, group-icons,
#     study-material) into a timestamped tarball under backups/.
#     Keys: CLI args > env vars > .env (SUPABASE_URL / SUPABASE_ANON_KEY /
#     SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ACCESS_TOKEN).
#     Tarball integrity is checked (gzip -t + tar -tzf), a .sha256 sidecar is
#     written, and the tarball is auto-verified against the source project
#     (table existence, row counts, auth users, storage) unless --no-verify.
#
# restore (reinstall on ANY machine / new Supabase project):
#   ./backup.sh restore <backup.tar.gz> \
#       [--supabase-url URL] [--anon-key K] [--service-key K] [--pat TOKEN]
#       [--schema-only]
#     Apply schema + data + auth users + storage to the target project,
#     verify the restore against the target (aborts BEFORE scaffolding .env
#     if any count mismatches), then scaffold .env with the new keys and
#     (re)start the server.
#     --schema-only installs structure WITHOUT people: no auth users, no table
#     rows, no storage files. Use it to stand up a fresh project; omit it for
#     disaster recovery. Note that Google OAuth keys live in Supabase auth
#     config, never in the database, so they are never copied either way.
#     Keys fall back to env vars or existing .env; keep them out of history.
#
# verify:
#   ./backup.sh verify <backup.tar.gz> [keys…]
#     Cross-check the tarball against any project: table existence, row
#     counts, auth users count and storage buckets/files. Exit 1 on mismatch.
#
# info:
#   ./backup.sh info <backup.tar.gz>   — integrity + manifest summary
#
# ui / console:
#   ./backup.sh ui [--port N]
#     Web console on http://127.0.0.1:8000 (loopback only — the page takes a
#     Supabase PAT). Runs backup / verify / restore as DETACHED jobs, so closing
#     the tab or restarting the server does not stop or lose one.
#
# status / stop:
#   ./backup.sh status   — per-phase progress + ETA of the detached job
#   ./backup.sh stop     — kill it
#     Both work with no console running: job state lives on disk in
#     backups/.job.json, not in the server's memory.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$ROOT/backups"
TS="$(date +%Y%m%d-%H%M%S)"

say()  { printf '\033[1;32m[isotope]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[isotope]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[isotope]\033[0m ERROR: %s\n' "$*" >&2; exit 1; }

need_node() { command -v node >/dev/null 2>&1 || die "node.js required (run install.sh first)"; }

# work-dir housekeeping: any leftover work-*/*.tmp dirs are removed on exit
# so a failed run never leaks partial dumps (use KEEP_DIRS to retain one).
CLEANUP=()
KEEP_DIRS=()
trap 'for d in "${CLEANUP[@]:-}"; do
        case " ${KEEP_DIRS[*]:-} " in *" $d "*) continue ;; esac
        [[ -n "$d" && -e "$d" ]] && rm -rf -- "$d"
      done' EXIT

mktmpdir() {
  local tmp="${TMPDIR:-}"
  [[ -z "$tmp" || ! -d "$tmp" || ! -w "$tmp" ]] && tmp=/tmp
  [[ -d "$tmp" && -w "$tmp" ]] || tmp="$HOME"
  printf '%s' "$tmp"
}

# ── .env / key handling ─────────────────────────────────────────────────────
# Load only the keys backup.sh needs from key files (never source the whole
# file — a malformed line must not kill the script). Only fills keys that are
# still empty, so CLI/--key=value args always win. File precedence:
# .backup_env (keeper project keys) > .env (app keys).
load_env_keys() {
  local f line k v
  for f in "$ROOT/.backup_env" "$ROOT/.env"; do
    [[ -f "$f" ]] || continue
    while IFS= read -r line; do
      [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]] || continue
      k="${BASH_REMATCH[1]}"; v="${BASH_REMATCH[2]}"
      case "$k" in
        SUPABASE_URL|SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ACCESS_TOKEN)
          v="${v%$'\r'}"
          [[ -n "${!k:-}" ]] || declare -g "$k=$v"
          ;;
      esac
    done < "$f"
  done
}

# A shell that sources .env (e.g. bashrc) leaks SUPABASE_* into the process
# environment, which would otherwise shadow .backup_env/.env. parse_keys marks
# CLI-provided keys (CLI_*) so reset_env_keys can drop everything else and
# re-apply only what actually came from the command line.
CLI_URL="" CLI_ANON="" CLI_SVC="" CLI_PAT=""
reset_env_keys() {
  local url="" anon="" svc="" pat=""
  [[ -n "${CLI_URL:-}" ]] && url="$SUPABASE_URL"
  [[ -n "${CLI_ANON:-}" ]] && anon="$SUPABASE_ANON_KEY"
  [[ -n "${CLI_SVC:-}" ]] && svc="$SUPABASE_SERVICE_ROLE_KEY"
  [[ -n "${CLI_PAT:-}" ]] && pat="$SUPABASE_ACCESS_TOKEN"
  unset SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY SUPABASE_ACCESS_TOKEN
  unset CLI_URL CLI_ANON CLI_SVC CLI_PAT
  [[ -n "$url" ]] && SUPABASE_URL="$url"
  [[ -n "$anon" ]] && SUPABASE_ANON_KEY="$anon"
  [[ -n "$svc" ]] && SUPABASE_SERVICE_ROLE_KEY="$svc"
  [[ -n "$pat" ]] && SUPABASE_ACCESS_TOKEN="$pat"
  return 0
}

# parse --key=value and --key value forms into env vars. Also accepts
# --no-storage. CLI values win over .env (parse_keys runs before load_env_keys).
parse_keys() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --supabase-url=*) SUPABASE_URL="${1#*=}"; CLI_URL=1; shift ;;
      --supabase-url)   SUPABASE_URL="$2"; CLI_URL=1; shift 2 ;;
      --anon-key=*)     SUPABASE_ANON_KEY="${1#*=}"; CLI_ANON=1; shift ;;
      --anon-key)       SUPABASE_ANON_KEY="$2"; CLI_ANON=1; shift 2 ;;
      --service-key=*)  SUPABASE_SERVICE_ROLE_KEY="${1#*=}"; CLI_SVC=1; shift ;;
      --service-key)    SUPABASE_SERVICE_ROLE_KEY="$2"; CLI_SVC=1; shift 2 ;;
      --pat=*)          SUPABASE_ACCESS_TOKEN="${1#*=}"; CLI_PAT=1; shift ;;
      --pat)            SUPABASE_ACCESS_TOKEN="$2"; CLI_PAT=1; shift 2 ;;
      --no-storage)     NO_STORAGE=1; shift ;;
      --schema-only)    SCHEMA_ONLY=1; shift ;;
      *) shift ;;
    esac
  done
}

# service-role key sanity: a missing/placeholder key silently skips storage.
# .env typos like "sukki =sb_secret_..." are detected here so storage is never
# silently dropped from a backup or a restore.
resolve_service_key() {
  local svc_key="${SUPABASE_SERVICE_ROLE_KEY:-}"
  local len="${#svc_key}"
  if [[ -z "$len" || "$len" -lt 20 ]]; then
    local f alt
    for f in "$ROOT/.backup_env" "$ROOT/.env"; do
      [[ -f "$f" ]] || continue
      alt="$(grep -oE '^(sukki|SERVICE_ROLE_KEY|SUPABASE_SERVICE_ROLE_KEY)[[:space:]]*=[[:space:]]*[^[:space:]]+' "$f" 2>/dev/null | tail -1 | cut -d= -f2- | tr -d ' ')" || true
      if [[ -n "$alt" && "${#alt}" -ge 20 ]]; then
        SUPABASE_SERVICE_ROLE_KEY="$alt"
        break
      fi
    done
    if [[ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
      [[ "${1:-warn}" == "warn" ]] && warn "service-role key found under a differently-spelled variable (fix the spelling!)"
    else
      [[ "${1:-warn}" == "warn" ]] && warn "no valid SUPABASE_SERVICE_ROLE_KEY — storage will NOT be included"
    fi
  fi
}

# ── backup ──────────────────────────────────────────────────────────────────
cmd_backup() {
  need_node
  local out="" no_storage="" keep="" no_verify="" keyargs=()
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --out) out="$2"; shift 2 ;;
      --out=*) out="${1#*=}"; shift ;;
      --no-storage) no_storage="--no-storage"; shift ;;
      --no-verify) no_verify="1"; shift ;;
      --keep) keep="$2"; shift 2 ;;
      --keep=*) keep="${1#*=}"; shift ;;
      --supabase-url|--anon-key|--service-key|--pat) keyargs+=( "$1" "${2:-}" ); shift 2 ;;
      --supabase-url=*|--anon-key=*|--service-key=*|--pat=*) keyargs+=( "$1" ); shift ;;
      *) die "unknown arg: $1" ;;
    esac
  done
  if [[ -n "$keep" && ! "$keep" =~ ^[0-9]+$ ]]; then die "--keep must be a number"; fi

  # load_env_keys() reads .backup_env FIRST (documented precedence, and what
  # scripts/schema-dump.mjs + supabase-backup.mjs also do), so requiring .env
  # specifically was wrong: a machine holding only .backup_env — the intended
  # setup for backing up a project you do not otherwise run — was rejected.
  # Accept either file, or keys passed entirely on the command line / env.
  if [[ ! -f "$ROOT/.backup_env" && ! -f "$ROOT/.env" && ${#keyargs[@]} -eq 0 && -z "${SUPABASE_URL:-}" ]]; then
    die "no credentials: create .backup_env or .env (SUPABASE_URL, SUPABASE_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY), or pass --supabase-url/--pat/--service-key"
  fi
  parse_keys "${keyargs[@]:-}"
  reset_env_keys
  load_env_keys
  [[ -n "${SUPABASE_URL:-}" ]] || die "SUPABASE_URL not set — add to .env or pass --supabase-url="
  [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]] || die "SUPABASE_ACCESS_TOKEN (PAT) not set — add to .env or pass --pat= (required for DB dump)"
  resolve_service_key
  # child scripts (schema-dump.mjs, supabase-backup.mjs) read keys from env
  # vars first, then fall back to .env — export so CLI keys win.
  export SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY SUPABASE_ACCESS_TOKEN

  mkdir -p "$BACKUP_DIR"
  # prune any leftover work dirs from aborted runs
  find "$BACKUP_DIR" -maxdepth 1 -type d -name 'work-*' -exec rm -rf {} + 2>/dev/null || true
  local work="$BACKUP_DIR/work-$TS"
  mkdir -p "$work/db"
  CLEANUP+=( "$work" )
  say "backup to $work"
  say "source: $SUPABASE_URL (service key len: ${#SUPABASE_SERVICE_ROLE_KEY})"

  say "step 1/4: schema dump (management API)…"
  node "$ROOT/scripts/schema-dump.mjs" 2>&1 | tail -5
  [[ -f "$ROOT/sql/isotope-schema-restore.sql" ]] || die "schema dump produced no output file"
  cp "$ROOT/sql/isotope-schema-restore.sql" "$work/schema.sql"
  say "schema ok ($(wc -c < "$work/schema.sql") bytes)"

  say "step 2/4: data + auth users + storage…"
  node "$ROOT/scripts/supabase-backup.mjs" backup --out "$work" $no_storage || die "backup failed"

  say "step 2.5/4: validating manifest…"
  local tables_in_manifest fk_order_count
  tables_in_manifest="$(node -e "console.log(JSON.parse(require('fs').readFileSync('$work/manifest.json','utf8')).tables.length)")"
  fk_order_count="$(node -e "console.log(JSON.parse(require('fs').readFileSync('$work/manifest.json','utf8')).fk_order.length)")"
  if [[ "$fk_order_count" -lt "$tables_in_manifest" ]]; then
    warn "manifest fk_order has $fk_order_count/$tables_in_manifest tables — restores would be incomplete. Run 'node scripts/supabase-backup.mjs backup' again after upgrading scripts."
  else
    say "manifest ok ($fk_order_count/$tables_in_manifest tables in fk_order)"
  fi

  say "step 3/4: packing tarball…"
  local tarball="$BACKUP_DIR/isotope-backup-$TS.tar.gz"
  tar -czf "$tarball" -C "$work" . || die "tar failed"
  gzip -t "$tarball" || die "gzip integrity check failed on $tarball"
  local sha
  sha="$(sha256sum "$tarball" | awk '{print $1}')"
  printf '%s  %s\n' "$sha" "$(basename "$tarball")" > "$tarball.sha256"
  say "sha256: $sha  (sidecar: $(basename "$tarball").sha256)"

  if [[ -z "$no_verify" ]]; then
    say "step 4/4: verifying tarball against source project…"
    local rc
    rc=0
    node "$ROOT/scripts/supabase-backup.mjs" verify --src "$work" \
      --supabase-url "$SUPABASE_URL" \
      --service-key "${SUPABASE_SERVICE_ROLE_KEY:-}" \
      --pat "$SUPABASE_ACCESS_TOKEN" $no_storage || rc=$?
    if [[ "$rc" -eq 0 ]]; then
      say "backup verified: all checks passed"
    else
      die "backup produced $tarball but verification FAILED — fix the cause and back up again (nothing was deleted)"
    fi
  else
    say "step 4/4: skipped (--no-verify)"
  fi

  rm -rf "$work"

  if [[ -n "$keep" ]]; then
    local old
    for old in $(ls -1t "$BACKUP_DIR"/isotope-backup-*.tar.gz 2>/dev/null | tail -n +$((keep + 1))); do
      rm -f "$old" "$old.sha256"
      warn "pruned $(basename "$old") (--keep $keep)"
    done
  fi

  say "DONE → $tarball"
  say "restore anywhere with:  ./backup.sh restore $tarball --supabase-url=<new-url> --anon-key=<key> --service-key=<key> --pat=<token>"
}

# ── restore ─────────────────────────────────────────────────────────────────
cmd_restore() {
  need_node
  [[ $# -ge 1 ]] || die "usage: restore <backup.tar.gz> --supabase-url=<target> [keys…]"
  local tarball="$1"; shift
  parse_keys "$@"

  # The restore TARGET must be stated explicitly. Previously this fell through
  # to load_env_keys, which reads .backup_env then .env — files that normally
  # hold PRODUCTION credentials. So `./backup.sh restore dump.tar.gz` with no
  # --supabase-url silently wrote 42 auth users and every table into live prod.
  # A restore is the one command that must never guess where it is pointing.
  [[ -n "${CLI_URL:-}" ]] || die "restore requires an explicit --supabase-url=<target project url>
       (refusing to infer the target from .backup_env/.env — that is production)"

  local target_url="$SUPABASE_URL"
  reset_env_keys

  [[ -f "$tarball" ]] || die "backup tarball not found: $tarball"

  # Remaining keys may come from .backup_env/.env, but the URL stays as given.
  load_env_keys
  SUPABASE_URL="$target_url"
  [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]] || die "missing --pat=<management api token>"
  resolve_service_key

  # Loud confirmation of where the data is about to land, and a warning if the
  # target happens to be the project this checkout normally talks to.
  #
  # Read with a plain while-read loop, not a grep|head|cut|tr pipeline: under
  # `set -o pipefail` the early-exiting `head -1` makes grep die on SIGPIPE, so
  # the whole pipeline returns non-zero and `set -e` aborts the restore before it
  # starts. That is exactly how this guard silently killed the command.
  say "RESTORE TARGET: $SUPABASE_URL"
  local local_url="" cfg line
  for cfg in "$ROOT/.backup_env" "$ROOT/.env"; do
    [[ -f "$cfg" ]] || continue
    while IFS= read -r line || [[ -n "$line" ]]; do
      if [[ "$line" == SUPABASE_URL=* ]]; then
        local_url="${line#SUPABASE_URL=}"
        local_url="${local_url%$'\r'}"
        local_url="${local_url//\"/}"
        local_url="${local_url//\'/}"
        break
      fi
    done < "$cfg"
    [[ -n "$local_url" ]] && break
  done
  if [[ -n "$local_url" && "$local_url" == "$SUPABASE_URL" ]]; then
    warn "target is the SAME project this checkout uses — restoring onto your own database"
  fi

  local work
  work="$(mktemp -d "$(mktmpdir)/isotope-restore.XXXXXX")"
  CLEANUP+=( "$work" )
  tar -xzf "$tarball" -C "$work" || die "extract failed"
  [[ -f "$work/manifest.json" ]] || die "tarball has no manifest.json — not an isotope backup"

  say "target: $SUPABASE_URL"
  if [[ -f "$work/schema.sql" ]]; then
    say "restoring schema ($(wc -c < "$work/schema.sql") bytes)…"
  else
    warn "no schema.sql in backup — target project must already have the schema"
  fi

  node "$ROOT/scripts/supabase-backup.mjs" restore --src "$work" \
    --supabase-url "$SUPABASE_URL" \
    --anon-key "${SUPABASE_ANON_KEY:-}" \
    --service-key "${SUPABASE_SERVICE_ROLE_KEY:-}" \
    --pat "$SUPABASE_ACCESS_TOKEN" \
    ${NO_STORAGE:+--no-storage} \
    ${SCHEMA_ONLY:+--schema-only} || die "restore failed"

  # verify the restore against the target BEFORE touching local config —
  # a mismatched restore must never overwrite .env or restart the server.
  say "verifying restore against target…"
  local rc=0 out
  out="$(node "$ROOT/scripts/supabase-backup.mjs" verify --src "$work" \
    --supabase-url "$SUPABASE_URL" \
    --service-key "${SUPABASE_SERVICE_ROLE_KEY:-}" \
    --pat "$SUPABASE_ACCESS_TOKEN" ${NO_STORAGE:+--no-storage} 2>&1)" || rc=$?
  printf '%s\n' "$out" | grep -E '^\s*(PASS|FAIL|WARN|--no-storage)' | sed 's/^/  /' || true
  if [[ "$rc" -ne 0 ]]; then
    KEEP_DIRS+=( "$work" )
    die "restore verification FAILED — keeping data at $work (remove it once inspected). Fix the target and re-run restore."
  fi
  say "restore verified: all counts match"
  rm -rf "$work"

  # scaffold .env with the new project keys (back up any existing one)
  local old_env=""
  if [[ -f "$ROOT/.env" ]]; then
    old_env="$ROOT/.env.pre-restore-$(date +%Y%m%d-%H%M%S)"
    cp "$ROOT/.env" "$old_env"
    warn "existing .env saved alongside (backup .env.* files contain real keys — keep them private)"
  fi
  local session_secret
  session_secret="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  cat > "$ROOT/.env" <<EOF
# IsotopeAI Self-Hosted — regenerated by backup.sh restore on $(date -Is)
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-}
PORT=3000
ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-}
ADMIN_SECRET=
ADMIN_EMAIL=
ADMIN_EMAILS=
BROWSER_PROOF_EMAIL=
SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN
GITHUB_PAT=
GEMINI_API_KEY=
GROQ_API_KEY=
YEPAPI_KEY=
SESSION_SECRET=$session_secret
EOF
  # preserve non-project keys (AI keys, admin secret, session secret) from the
  # previous .env when restoring into the SAME project — never wipe working config
  if [[ -n "$old_env" ]]; then
    local preserved=0 key
    for key in ADMIN_SECRET ADMIN_EMAIL ADMIN_EMAILS BROWSER_PROOF_EMAIL GITHUB_PAT GEMINI_API_KEY GROQ_API_KEY YEPAPI_KEY SESSION_SECRET SUPABASE_SERVICE_ROLE_KEY; do
      local newval
      newval="$(grep -E "^$key=" "$ROOT/.env" 2>/dev/null | head -1 | cut -d= -f2-)"
      if [[ -z "$newval" ]]; then
        local oldval
        oldval="$(grep -E "^$key=" "$old_env" 2>/dev/null | head -1 | cut -d= -f2-)"
        if [[ -n "$oldval" ]]; then
          echo "$key=$oldval" >> "$ROOT/.env"
          preserved=$((preserved + 1))
        fi
      fi
    done
    [[ "$preserved" -gt 0 ]] && say "preserved $preserved key(s) from previous .env (restore target looks like the same project)"
  fi
  say ".env scaffolded with new project keys"

  if [[ -f "$ROOT/bin/isotope" ]]; then
    say "restarting server…"
    bash "$ROOT/bin/isotope" restart >/dev/null 2>&1 || true
  fi
  say "DONE. Server: $(grep -E '^PORT' "$ROOT/.env" | cut -d= -f2)x — visit http://localhost:$(grep -E '^PORT' "$ROOT/.env" | cut -d= -f2)"
}

# ── verify ──────────────────────────────────────────────────────────────────
cmd_verify() {
  need_node
  [[ $# -ge 1 ]] || die "usage: verify <backup.tar.gz> [keys…]"
  local tarball="$1"; shift
  parse_keys "$@"
  reset_env_keys

  [[ -f "$tarball" ]] || die "backup tarball not found: $tarball"
  load_env_keys
  [[ -n "${SUPABASE_URL:-}" ]] || die "missing --supabase-url=<target project url>"
  [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]] || die "missing --pat=<management api token>"
  resolve_service_key

  local work
  work="$(mktemp -d "$(mktmpdir)/isotope-verify.XXXXXX")"
  CLEANUP+=( "$work" )
  tar -xzf "$tarball" -C "$work" || die "extract failed"
  [[ -f "$work/manifest.json" ]] || die "tarball has no manifest.json — not an isotope backup"

  local rc=0
  node "$ROOT/scripts/supabase-backup.mjs" verify --src "$work" \
    --supabase-url "$SUPABASE_URL" \
    --service-key "${SUPABASE_SERVICE_ROLE_KEY:-}" \
    --pat "$SUPABASE_ACCESS_TOKEN" ${NO_STORAGE:+--no-storage} || rc=$?
  rm -rf "$work"
  return "$rc"
}

# ── info ────────────────────────────────────────────────────────────────────
cmd_info() {
  [[ $# -ge 1 ]] || die "usage: info <backup.tar.gz>"
  local tarball="$1"
  [[ -f "$tarball" ]] || die "not found: $tarball"

  say "file: $tarball ($(du -h "$tarball" | cut -f1))"
  if [[ -f "$tarball.sha256" ]]; then
    local expect got
    expect="$(grep -oE '^[0-9a-f]{64}' "$tarball.sha256" || true)"
    got="$(sha256sum "$tarball" | awk '{print $1}')"
    if [[ -n "$expect" && "$expect" == "$got" ]]; then
      say "sha256: $got (sidecar match)"
    else
      warn "sha256 sidecar ($expect) does NOT match tarball ($got) — backup may be corrupted"
    fi
  else
    warn "no .sha256 sidecar (older backup)"
  fi
  if gzip -t "$tarball" 2>/dev/null; then say "gzip integrity: ok"; else warn "gzip integrity: FAILED"; fi

  local work
  work="$(mktemp -d "$(mktmpdir)/isotope-info.XXXXXX")"
  CLEANUP+=( "$work" )
  tar -xzf "$tarball" -C "$work" ./manifest.json ./db/auth.users.jsonl 2>/dev/null || true
  [[ -f "$work/manifest.json" ]] || die "tarball has no manifest.json — not an isotope backup"

  say "contents:"
  tar -tzf "$tarball" | sed -e 's|^\./||' -e '/^$/d' -e "s|^|  |"
  echo "---"
  node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('$work/manifest.json','utf8'));
const rows = (t) => fs.existsSync('$work/db/'+t) ? fs.readFileSync('$work/db/'+t,'utf8').split('\n').filter(Boolean).length : 'n/a';
console.log('created:', m.created_at);
console.log('source project:', m.source_project);
console.log('tables:', m.tables.length, '| rows:', m.tables.reduce((a,t)=>a+t.count,0));
console.log('auth users:', rows('auth.users.jsonl'));
console.log('storage:', m.storage_files.length, 'files /', (m.storage_files.reduce((a,f)=>a+f.size,0)/1048576).toFixed(2), 'MB',
  '(buckets: ' + m.buckets.map((b)=>b.id+(b.public?' (public)':'')).join(', ') + ')');
if (m.notes && m.notes.length) console.log('manifest notes:\\n  ' + m.notes.join('\\n  '));
" 2>/dev/null || warn "manifest summary failed (older/incompatible manifest)"
  rm -rf "$work"
}

# ── ui / status / stop ──────────────────────────────────────────────────────
# The console and the CLI are two front ends over the SAME on-disk job state
# (backups/.job.json, .progress.jsonl, .job.log), which is why `status` works
# with no server running and why closing the browser tab does not stop a job.
cmd_ui() {
  need_node
  local port=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --port) port="$2"; shift 2 ;;
      --port=*) port="${1#*=}"; shift ;;
      *) die "unknown arg: $1" ;;
    esac
  done
  if [[ -n "$port" && ! "$port" =~ ^[0-9]+$ ]]; then die "--port must be a number"; fi
  [[ -f "$ROOT/scripts/backup-ui.mjs" ]] || die "scripts/backup-ui.mjs missing"
  # Binds 127.0.0.1 only — the page accepts a management-API token, so exposing
  # it on 0.0.0.0 would hand anything on the network the ability to drive a
  # restore. Do not put it behind a tunnel.
  say "starting console on 127.0.0.1:${port:-8000} (loopback only — Ctrl-C to stop serving)"
  say "jobs are detached: closing the page or this process does NOT stop a running job"
  ISO_UI_PORT="${port:-8000}" exec node "$ROOT/scripts/backup-ui.mjs"
}

cmd_status() {
  need_node
  node "$ROOT/scripts/job-runner.mjs" status
}

cmd_stop() {
  need_node
  node "$ROOT/scripts/job-runner.mjs" stop
}

# ── main ────────────────────────────────────────────────────────────────────
case "${1:-}" in
  backup)  shift; cmd_backup "$@" ;;
  restore) shift; cmd_restore "$@" ;;
  verify)  shift; cmd_verify "$@" ;;
  info)    shift; cmd_info "$@" ;;
  ui|console) shift; cmd_ui "$@" ;;
  status)  shift; cmd_status "$@" ;;
  stop)    shift; cmd_stop "$@" ;;
  *) echo "usage: $0 {backup|restore|verify|info|ui|status|stop} [args…]
  $0 backup [--out DIR] [--no-storage] [--keep N] [--no-verify]
        [--supabase-url URL --anon-key K --service-key K --pat TOKEN]
  $0 restore <backup.tar.gz> [--supabase-url URL --anon-key K --service-key K --pat TOKEN]
        [--no-storage] [--schema-only]
  $0 verify <backup.tar.gz> [--supabase-url URL --service-key K --pat TOKEN]
  $0 info <backup.tar.gz>
  $0 ui [--port N]              web console on 127.0.0.1:8000
  $0 status                     progress + ETA of the detached job
  $0 stop                       kill the detached job
(keys: CLI args > env vars > .env)
(--schema-only restores structure only: no users, no rows, no storage files)" ;;
esac
