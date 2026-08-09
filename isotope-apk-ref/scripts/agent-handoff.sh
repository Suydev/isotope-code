#!/usr/bin/env bash
# agent-handoff.sh
# Run before ending every session. Validates state and prepares handoff.
# Usage: npm run agent:handoff

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BOLD='\033[1m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
CYAN='\033[36m'
RESET='\033[0m'

ok()   { echo -e "${GREEN}✓${RESET} $*"; }
warn() { echo -e "${YELLOW}⚠${RESET} $*"; }
err()  { echo -e "${RED}✗${RESET} $*"; }
info() { echo -e "${CYAN}→${RESET} $*"; }
sep()  { echo -e "${BOLD}───────────────────────────────────────${RESET}"; }

BLOCKERS=0
WARNINGS=0

blocker() { err "$*"; BLOCKERS=$((BLOCKERS+1)); }
advisory() { warn "$*"; WARNINGS=$((WARNINGS+1)); }

echo ""
echo -e "${BOLD}╔═══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║  IsotopeAI Android — Session Handoff  ║${RESET}"
echo -e "${BOLD}╚═══════════════════════════════════════╝${RESET}"
echo ""

# ── 1. Check uncommitted changes ─────────────────────────────────────────────
sep
echo -e "${BOLD}1. Uncommitted changes${RESET}"

CHANGES=$(git --no-optional-locks status --porcelain 2>/dev/null || echo "")
if [[ -n "$CHANGES" ]]; then
  advisory "You have uncommitted changes:"
  echo "$CHANGES" | head -20
  echo ""
  echo -e "${YELLOW}Review and commit your work before pushing:${RESET}"
  echo -e "  ${CYAN}git add -A${RESET}"
  echo -e "  ${CYAN}git commit -m 'describe what you built'${RESET}"
fi

# ── 2. Check unpushed commits ─────────────────────────────────────────────────
sep
echo -e "${BOLD}2. Unpushed commits${RESET}"

AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "?")
if [[ "$AHEAD" == "?" ]]; then
  advisory "Cannot check ahead/behind (no remote tracking branch)"
elif [[ "$AHEAD" != "0" ]]; then
  advisory "$AHEAD commit(s) not pushed to remote"
  git log --oneline @{u}..HEAD 2>/dev/null | head -10 || true
else
  ok "All commits pushed"
fi

# ── 3. Check handoff files are updated ───────────────────────────────────────
sep
echo -e "${BOLD}3. Handoff file freshness${RESET}"

LAST_COMMIT_TIME=$(git log -1 --format=%ct 2>/dev/null || echo "0")
NOW=$(date +%s)

check_file_fresh() {
  local file="$1"
  local label="$2"
  if [[ ! -f "$ROOT/$file" ]]; then
    blocker "$label is MISSING — create it before handoff"
    return
  fi
  local file_time
  file_time=$(stat -c %Y "$ROOT/$file" 2>/dev/null || stat -f %m "$ROOT/$file" 2>/dev/null || echo "0")
  # Warn if file hasn't been touched in this session (>2 hours old)
  local age=$(( NOW - file_time ))
  if [[ "$age" -gt 7200 ]]; then
    advisory "$label not updated recently (${age}s ago) — update it now"
  else
    ok "$label (updated $((age/60))m ago)"
  fi
}

check_file_fresh ".agent/CURRENT_STATE.md" "CURRENT_STATE.md"
check_file_fresh ".agent/NEXT_TASKS.md" "NEXT_TASKS.md"
check_file_fresh ".agent/TEST_STATUS.md" "TEST_STATUS.md"
check_file_fresh ".agent/KNOWN_ISSUES.md" "KNOWN_ISSUES.md"
check_file_fresh ".agent/SESSION_LOG.md" "SESSION_LOG.md"
check_file_fresh ".agent/state.json" "state.json"

# ── 4. Check next task is defined ────────────────────────────────────────────
sep
echo -e "${BOLD}4. Next task definition${RESET}"

if [[ ! -f "$ROOT/.agent/NEXT_TASKS.md" ]]; then
  blocker "NEXT_TASKS.md missing — create it before handoff"
else
  if grep -q "Status:\*\* ACTIVE\|Status: ACTIVE" "$ROOT/.agent/NEXT_TASKS.md"; then
    ACTIVE_TASK=$(grep -A2 "Status.*ACTIVE" "$ROOT/.agent/NEXT_TASKS.md" | head -5)
    ok "Active task defined:"
    echo "  $ACTIVE_TASK" | head -3
  else
    advisory "No ACTIVE task in NEXT_TASKS.md — define the next task"
  fi
fi

# ── 5. Update state.json ──────────────────────────────────────────────────────
sep
echo -e "${BOLD}5. Updating state.json${RESET}"

SHA=$(git rev-parse HEAD 2>/dev/null | head -c12 || echo "")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
PUSHED="false"
if [[ "$AHEAD" == "0" ]] 2>/dev/null; then PUSHED="true"; fi
APK_PATH=""
if [[ -f "$ROOT/android/app/build/outputs/apk/debug/app-debug.apk" ]]; then
  APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
fi
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [[ -f "$ROOT/.agent/state.json" ]]; then
  # Update fields we know
  python3 - <<EOF 2>/dev/null || warn "Could not auto-update state.json (update manually)"
import json, sys
with open('.agent/state.json', 'r') as f:
    state = json.load(f)
state['commit'] = '$SHA'
state['branch'] = '$BRANCH'
state['pushed'] = $PUSHED
state['updatedAt'] = '$TIMESTAMP'
if '$APK_PATH':
    state['lastSuccessfulApk'] = '$APK_PATH'
with open('.agent/state.json', 'w') as f:
    json.dump(state, f, indent=2)
print('state.json updated')
EOF
  ok "state.json updated"
fi

# ── 6. Show changed files ─────────────────────────────────────────────────────
sep
echo -e "${BOLD}6. Files changed this session${RESET}"

git diff --name-only HEAD~1..HEAD 2>/dev/null | head -30 || \
  git --no-optional-locks status --short 2>/dev/null | head -30 || \
  echo "  (no previous commit to diff)"

# ── 7. Pre-flight checks ──────────────────────────────────────────────────────
sep
echo -e "${BOLD}7. Pre-flight checks${RESET}"

# Check that android-bridge.js exists
[[ -f android-bridge.js ]]       && ok "android-bridge.js present" || blocker "android-bridge.js missing"
[[ -f capacitor.config.json ]]   && ok "capacitor.config.json present" || blocker "capacitor.config.json missing"
[[ -f package.json ]]            && ok "package.json present" || blocker "package.json missing"
[[ -f .github/workflows/android.yml ]] && ok "android.yml CI present" || advisory "android.yml missing"

# ── 8. Handoff summary ────────────────────────────────────────────────────────
sep
echo -e "${BOLD}HANDOFF SUMMARY${RESET}"
echo ""

if [[ $BLOCKERS -gt 0 ]]; then
  echo -e "${RED}${BOLD}⛔ HANDOFF BLOCKED — $BLOCKERS issue(s) must be resolved:${RESET}"
  echo "  Fix the issues marked ✗ above before ending session."
elif [[ $WARNINGS -gt 0 ]]; then
  echo -e "${YELLOW}${BOLD}⚠ HANDOFF WITH WARNINGS — $WARNINGS advisory item(s):${RESET}"
  echo "  Address warnings above when possible."
else
  echo -e "${GREEN}${BOLD}✅ HANDOFF READY${RESET}"
fi

echo ""
echo -e "${BOLD}NEXT AGENT ONBOARDING PROMPT:${RESET}"
echo ""
echo -e "${CYAN}You are continuing the IsotopeAI Android APK project."
echo -e "Repository: https://github.com/Suydev/isotope-apk"
echo -e "Branch: $BRANCH | Last commit: $SHA"
echo -e ""
echo -e "FIRST: Read AGENTS.md"
echo -e "THEN:  Run: npm run agent:resume"
echo -e "THEN:  Read .agent/CURRENT_STATE.md and .agent/NEXT_TASKS.md"
echo -e "THEN:  Continue from ACTIVE task${RESET}"
echo ""

if [[ -n "$CHANGES" || "$AHEAD" != "0" ]]; then
  echo -e "${YELLOW}REMINDER: Commit and push before leaving!${RESET}"
  echo -e "  ${CYAN}git add -A${RESET}"
  echo -e "  ${CYAN}git commit -m 'handoff: describe what was built'${RESET}"
  echo -e "  ${CYAN}git push origin $BRANCH${RESET}"
fi
echo ""
