#!/usr/bin/env bash
# supabase.sh — set up a Supabase project for IsotopeAI from nothing.
#
# This is the FIRST-RUN tool. backup.sh is for a project you already have:
# `restore` replays a tarball, which only exists if you already had a working
# backend, so it is useless to someone setting up for the first time. This applies
# the committed schema to an empty project instead.
#
#   ./supabase.sh setup --pat TOKEN --ref abc123
#       Provision an existing empty project.
#
#   ./supabase.sh setup --pat TOKEN --create "my-isotope"
#       Create a free project, wait for it, then provision it.
#
#     On success it also WRITES .env pointing at the new project. An existing
#     .env is moved to .env.old first — never overwritten, since it holds the
#     service-role key. PORT, the AI keys, the admin settings, SESSION_SECRET and
#     any key the script does not recognise are carried across. Pass --no-env to
#     leave .env alone (managed secrets, or a checkout you are not running).
#
#   ./supabase.sh ui
#       Web console on http://127.0.0.1:8000 — pick or create a project, watch
#       progress live, and run setup, backup, verify or restore from the page.
#
#   ./supabase.sh check --pat TOKEN --ref abc123
#       Read-only. Reports what is present and what is missing. Changes nothing.
#
#   ./supabase.sh status | stop
#       Progress/ETA of the detached job, or kill it.
#
# What setup provisions, in dependency order:
#   1. schema   42 tables, 80 functions, 15 triggers, 153 policies, 66 indexes
#   2. storage  5 buckets + owner-scoped policies
#   3. auth     the signup trigger — without it every new account is broken
#   4. verify   asserts all of the above actually landed
#
# It writes NO rows: no users, no seed data, no files. The project is empty and
# ready for its owner's first signup.
#
# Two things it cannot do, because they do not live in the database:
#   * Google sign-in needs a Web-type OAuth client in the Supabase dashboard
#   * the redirect allow-list is auth config, not schema
# Both are printed at the end with the exact values to use.
#
# A personal access token is all you need: https://supabase.com/dashboard/account/tokens
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

say()  { printf '\033[1;32m[isotope]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[isotope]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[isotope]\033[0m ERROR: %s\n' "$*" >&2; exit 1; }

need_node() { command -v node >/dev/null 2>&1 || die "node.js required (run install.sh first)"; }

# Only read the keys this script needs, and never source the file — a malformed
# line must not kill the run. Fills only what is still empty, so CLI args win.
load_env_keys() {
  local f line k v
  for f in "$ROOT/.backup_env" "$ROOT/.env"; do
    [[ -f "$f" ]] || continue
    while IFS= read -r line || [[ -n "$line" ]]; do
      [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]] || continue
      k="${BASH_REMATCH[1]}"; v="${BASH_REMATCH[2]%$'\r'}"
      case "$k" in
        SUPABASE_ACCESS_TOKEN|SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY)
          [[ -n "${!k:-}" ]] || declare -g "$k=${v//\"/}" ;;
      esac
    done < "$f"
  done
}

cmd_setup() {
  need_node
  load_env_keys
  # Everything else is validated by the Node script, which owns the contract.
  # Passing through unchanged keeps one source of truth for the flags.
  exec node "$ROOT/scripts/supabase-setup.mjs" "$@"
}

# Read-only inspection. Deliberately a separate verb: someone pointing this at a
# project for the first time should be able to see the state before changing it.
cmd_check() {
  need_node
  load_env_keys
  local pat="" ref=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --pat) pat="$2"; shift 2 ;;
      --pat=*) pat="${1#*=}"; shift ;;
      --ref) ref="$2"; shift 2 ;;
      --ref=*) ref="${1#*=}"; shift ;;
      *) die "unknown arg: $1" ;;
    esac
  done
  pat="${pat:-${SUPABASE_ACCESS_TOKEN:-}}"
  [[ -n "$pat" ]] || die "--pat <token> required (or SUPABASE_ACCESS_TOKEN in .env)"
  if [[ -z "$ref" && -n "${SUPABASE_URL:-}" ]]; then
    ref="$(printf '%s' "$SUPABASE_URL" | sed -E 's#https?://([a-z0-9]+)\..*#\1#')"
    say "using project $ref from SUPABASE_URL"
  fi
  [[ -n "$ref" ]] || die "--ref <project-ref> required"
  SUPABASE_ACCESS_TOKEN="$pat" node "$ROOT/scripts/supabase-check.mjs" --ref "$ref"
}

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
  [[ -z "$port" || "$port" =~ ^[0-9]+$ ]] || die "--port must be a number"
  [[ -f "$ROOT/scripts/backup-ui.mjs" ]] || die "scripts/backup-ui.mjs missing"
  # Loopback only. The page takes a management-API token and can provision or
  # overwrite a project; on 0.0.0.0 anything on the network could drive it.
  say "console → http://127.0.0.1:${port:-8000}  (loopback only)"
  say "jobs run detached: closing the page does NOT stop one"
  ISO_UI_PORT="${port:-8000}" exec node "$ROOT/scripts/backup-ui.mjs"
}

cmd_status() { need_node; node "$ROOT/scripts/job-runner.mjs" status; }
cmd_stop()   { need_node; node "$ROOT/scripts/job-runner.mjs" stop; }

case "${1:-}" in
  setup)   shift; cmd_setup "$@" ;;
  check)   shift; cmd_check "$@" ;;
  ui|console) shift; cmd_ui "$@" ;;
  status)  shift; cmd_status "$@" ;;
  stop)    shift; cmd_stop "$@" ;;
  *) cat <<'USAGE'
usage: ./supabase.sh {setup|check|ui|status|stop} [args…]

  ./supabase.sh setup --pat TOKEN --ref <project-ref>
        Provision an existing EMPTY project: schema, storage, auth, verify.

  ./supabase.sh setup --pat TOKEN --create "my-isotope" [--org ID] [--region R]
        Create a free project, wait for the database, then provision it.
        Prints a generated DB password once — save it.

        Both forms write .env on success (existing one moved to .env.old).
        Add --no-env to skip that.

  ./supabase.sh check --pat TOKEN --ref <project-ref>
        Read-only report of what is present and what is missing.

  ./supabase.sh ui [--port N]
        Web console on 127.0.0.1:8000 (setup / backup / verify / restore).

  ./supabase.sh status          progress + ETA of the detached job
  ./supabase.sh stop            kill it

Get a token at https://supabase.com/dashboard/account/tokens
SUPABASE_ACCESS_TOKEN in .env or .backup_env is used when --pat is omitted.

Related: ./backup.sh  — backup / restore / verify for a project you ALREADY have.
USAGE
  ;;
esac
