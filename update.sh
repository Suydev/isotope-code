#!/usr/bin/env bash
set -euo pipefail

info() { printf '%s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

info ""
info "IsotopeAI update"

if [ ! -d .git ]; then
  fail "This directory is not a Git repository."
fi

if ! command -v git >/dev/null 2>&1; then
  fail "Git is required for updates."
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  fail "Uncommitted changes detected. Commit or stash them before updating."
fi

branch="$(git rev-parse --abbrev-ref HEAD)"
info "Current branch: $branch"
git fetch origin "$branch"
git merge --ff-only "origin/$branch"

if [ -f package.json ]; then
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install
  elif command -v npm >/dev/null 2>&1; then
    npm install
  fi
fi

node -e "const cp=require('child_process'),fs=require('fs');const sha=cp.execSync('git rev-parse HEAD').toString().trim();const message=cp.execSync('git log -1 --pretty=%s').toString().trim();fs.writeFileSync('VERSION',JSON.stringify({sha,message,updated_at:new Date().toISOString()},null,2));"
node --check server.mjs >/dev/null

info "Update complete. Restart your process manager, or stop and start: node server.mjs"
