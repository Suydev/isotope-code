#!/usr/bin/env bash
set -euo pipefail

PORT_VALUE="${PORT:-5000}"
NO_START=0
[ "${1:-}" = "--start" ] && NO_START=0 || NO_START=1

info() { printf '%s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
has() { command -v "$1" >/dev/null 2>&1; }

info ""
info "Isotope update"
info "This preserves your private .env and updates the local app files."

[ -d .git ] || fail "This directory is not a Git repository. Download the latest ZIP from GitHub instead."
has git || fail "Git is required for updates."

stash_name=""
if ! git diff --quiet || ! git diff --cached --quiet; then
  stash_name="isotope-auto-stash-$(date +%Y%m%d%H%M%S)"
  info "Local changes detected. Saving them as a Git stash: $stash_name"
  git stash push -u -m "$stash_name" >/dev/null
fi

branch="$(git rev-parse --abbrev-ref HEAD)"
info "Current branch: $branch"
git fetch origin "$branch"
git merge --ff-only "origin/$branch" || {
  info "Fast-forward failed. Your saved local changes are safe in Git stash."
  fail "Update conflict. Run: git stash list"
}

if [ -f package.json ]; then
  if has npm; then npm install; else info "npm not found; skipping dependency refresh."; fi
fi

if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  info "Created .env from .env.example."
fi

node --check server.mjs >/dev/null
node -e "const cp=require('child_process'),fs=require('fs');const sha=cp.execSync('git rev-parse HEAD').toString().trim();const message=cp.execSync('git log -1 --pretty=%s').toString().trim();fs.writeFileSync('VERSION',JSON.stringify({sha,message,updated_at:new Date().toISOString()},null,2));"

info ""
info "Update complete."
[ -n "$stash_name" ] && info "Your previous local changes are saved in stash: $stash_name"
if [ "$NO_START" -eq 0 ]; then
  PORT="$PORT_VALUE" node server.mjs
else
  info "Restart with: PORT=${PORT_VALUE} node server.mjs"
fi
