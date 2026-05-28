#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  IsotopeAI — GitHub Push & Release Script                               ║
# ║  Run this once (or via CI) to push all changes and create a release.    ║
# ╚══════════════════════════════════════════════════════════════════════════╝
set -euo pipefail

REPO_URL="${GITHUB_REPO_URL:-https://github.com/Suydev/isotope-code.git}"
PAT="${GITHUB_PAT:-}"
VERSION=$(grep '"version"' package.json | sed 's/.*"\([0-9.]*\)".*/\1/')
TAG="v$VERSION"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
info() { echo -e "${CYAN}[deploy]${NC} $*"; }
ok()   { echo -e "${GREEN}[  OK  ]${NC} $*"; }

if [ -z "$PAT" ]; then
  echo "Error: GITHUB_PAT env var not set."
  echo "Usage: GITHUB_PAT=ghp_xxx bash deploy.sh"
  exit 1
fi

AUTHED_URL="https://${PAT}@${REPO_URL#https://}"

cd "$(dirname "$0")"

info "Configuring git..."
git config user.email "isotope-deploy@users.noreply.github.com"
git config user.name  "IsotopeAI Deploy"

# Add or update the origin remote
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$AUTHED_URL"
else
  git remote add origin "$AUTHED_URL"
fi

info "Staging all changes..."
git add -A

if git diff --cached --quiet; then
  info "Nothing new to commit — checking tag..."
else
  git commit -m "chore: release v$VERSION — offline PWA, install scripts, GitHub Actions"
fi

info "Pushing to main..."
git push origin HEAD:main --force-with-lease 2>/dev/null || git push origin HEAD:main

# Tag this release if not already tagged
if git ls-remote --tags origin | grep -q "refs/tags/$TAG"; then
  info "Tag $TAG already exists on remote, skipping."
else
  info "Creating tag $TAG..."
  git tag -a "$TAG" -m "Release $TAG" 2>/dev/null || true
  git push origin "$TAG"
fi

ok "Pushed to GitHub: https://github.com/Suydev/isotope-code"
ok "GitHub Actions will now deploy to GitHub Pages automatically."
ok "Live in ~60s: https://suydev.github.io/isotope-code/"
