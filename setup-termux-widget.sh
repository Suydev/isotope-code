#!/usr/bin/env bash
# IsotopeAI — Termux Widget shortcut installer
# Creates home-screen buttons in ~/.shortcuts/ and ~/.shortcuts/tasks/
# ──────────────────────────────────────────────────────────────────────────────
# Usage: bash setup-termux-widget.sh
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

info() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }

if [ -z "${TERMUX_VERSION:-}" ] && ! printf '%s' "${PREFIX:-}" | grep -q 'com.termux'; then
  warn "Termux not detected. This script is for Android Termux only."
  warn "Continuing anyway — run on Android Termux for full functionality."
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ISO_HOME="$HOME/.isotope"
LOG_DIR="$ISO_HOME/logs"
SHORTCUT_DIR="$HOME/.shortcuts"
TASKS_DIR="$HOME/.shortcuts/tasks"

mkdir -p "$ISO_HOME" "$LOG_DIR" "$SHORTCUT_DIR" "$TASKS_DIR"
printf '%s\n' "$PROJECT_DIR" > "$ISO_HOME/project-path"

# Resolve the isotope command at setup time and embed it in shortcuts.
# Widget launches don't always inherit the interactive PATH.
PREFIX_BIN_ISO="${PREFIX:-/data/data/com.termux/files/usr}/bin/isotope"
TERMUX_BIN_ISO="/data/data/com.termux/files/usr/bin/isotope"
if [ -x "$PREFIX_BIN_ISO" ]; then
  GLOBAL_ISO="$PREFIX_BIN_ISO"
elif [ -x "$TERMUX_BIN_ISO" ]; then
  GLOBAL_ISO="$TERMUX_BIN_ISO"
elif command -v isotope >/dev/null 2>&1 && [ -x "$(command -v isotope)" ]; then
  GLOBAL_ISO="$(command -v isotope)"
else
  GLOBAL_ISO=""
fi

# ── write a foreground shortcut (opens Termux terminal window) ─────────────────
make_shortcut() {
  local name="$1"
  local iso_cmd="$2"
  local file="$SHORTCUT_DIR/$name"

  cat > "$file" <<SHORTCUT
#!/usr/bin/env bash
# IsotopeAI widget: $name → isotope $iso_cmd
ISO_HOME="\$HOME/.isotope"
LOG_DIR="\$ISO_HOME/logs"
PROJECT_PATH_FILE="\$ISO_HOME/project-path"
PROJECT_DIR=""
[ -f "\$PROJECT_PATH_FILE" ] && PROJECT_DIR="\$(sed -n '1p' "\$PROJECT_PATH_FILE")"
mkdir -p "\$LOG_DIR"

run_isotope() {
  if [ -x "$TERMUX_BIN_ISO" ]; then
    "$TERMUX_BIN_ISO" $iso_cmd 2>&1 | tee -a "\$LOG_DIR/widget-$name.log"
    return \${PIPESTATUS[0]}
  fi
  if [ -n "$GLOBAL_ISO" ] && [ -x "$GLOBAL_ISO" ]; then
    "$GLOBAL_ISO" $iso_cmd 2>&1 | tee -a "\$LOG_DIR/widget-$name.log"
    return \${PIPESTATUS[0]}
  fi
  if [ -n "\$PROJECT_DIR" ] && [ -x "\$PROJECT_DIR/bin/isotope" ]; then
    ISOTOPE_PROJECT_DIR="\$PROJECT_DIR" "\$PROJECT_DIR/bin/isotope" $iso_cmd 2>&1 | tee -a "\$LOG_DIR/widget-$name.log"
    return \${PIPESTATUS[0]}
  fi
  printf '%s\n' "IsotopeAI command not found. Run: bash setup.sh"
  return 1
}

run_isotope
SHORTCUT
  chmod +x "$file"
}

# ── write a background task shortcut (no terminal window) ─────────────────────
make_task() {
  local name="$1"
  local iso_cmd="$2"
  local file="$TASKS_DIR/$name"

  cat > "$file" <<TASK
#!/usr/bin/env bash
# IsotopeAI background task: $name → isotope $iso_cmd
ISO_HOME="\$HOME/.isotope"
LOG_DIR="\$ISO_HOME/logs"
PROJECT_PATH_FILE="\$ISO_HOME/project-path"
PROJECT_DIR=""
[ -f "\$PROJECT_PATH_FILE" ] && PROJECT_DIR="\$(sed -n '1p' "\$PROJECT_PATH_FILE")"
mkdir -p "\$LOG_DIR"

run_isotope() {
  if [ -x "$TERMUX_BIN_ISO" ]; then
    "$TERMUX_BIN_ISO" $iso_cmd >> "\$LOG_DIR/widget-$name.log" 2>&1
    return \$?
  fi
  if [ -n "$GLOBAL_ISO" ] && [ -x "$GLOBAL_ISO" ]; then
    "$GLOBAL_ISO" $iso_cmd >> "\$LOG_DIR/widget-$name.log" 2>&1
    return \$?
  fi
  if [ -n "\$PROJECT_DIR" ] && [ -x "\$PROJECT_DIR/bin/isotope" ]; then
    ISOTOPE_PROJECT_DIR="\$PROJECT_DIR" "\$PROJECT_DIR/bin/isotope" $iso_cmd >> "\$LOG_DIR/widget-$name.log" 2>&1
    return \$?
  fi
  printf '%s\n' "IsotopeAI command not found. Run: bash setup.sh" >> "\$LOG_DIR/widget-$name.log"
  return 1
}

run_isotope
TASK
  chmod +x "$file"
}

# ── create all shortcuts ───────────────────────────────────────────────────────
# Foreground shortcuts (open a Termux terminal window — user sees output)
make_shortcut isotope-start  start
make_shortcut isotope-stop   stop
make_shortcut isotope-restart restart
make_shortcut isotope-update update
make_shortcut isotope-open   open
make_shortcut isotope-doctor doctor
make_shortcut isotope-status status
make_shortcut isotope-logs   logs
make_shortcut isotope-repair repair
make_shortcut isotope-reinstall-widgets reinstall-widgets

# Background task shortcuts (no terminal window — silent background operation)
# Use these for actions that should run without opening Termux
make_task isotope-stop-bg    stop
make_task isotope-restart-bg restart

# ── report ────────────────────────────────────────────────────────────────────
info ""
info "Termux Widget shortcuts installed in: $SHORTCUT_DIR"
info ""
info "Foreground shortcuts (open terminal):"
for name in isotope-start isotope-stop isotope-restart isotope-update \
            isotope-open isotope-doctor isotope-status isotope-logs \
            isotope-repair isotope-reinstall-widgets; do
  if [ -x "$SHORTCUT_DIR/$name" ]; then
    info "  ✅  $name"
  else
    warn "  ❌  $name (failed to create)"
  fi
done

info ""
info "Background task shortcuts (silent, no terminal):"
for name in isotope-stop-bg isotope-restart-bg; do
  if [ -x "$TASKS_DIR/$name" ]; then
    info "  ✅  $name"
  else
    warn "  ❌  $name (failed to create)"
  fi
done

if [ -x "$TERMUX_BIN_ISO" ]; then
  info ""
  info "Global command: $TERMUX_BIN_ISO (embedded in shortcuts)"
elif [ -n "$GLOBAL_ISO" ]; then
  info ""
  info "Global command: $GLOBAL_ISO (embedded in shortcuts)"
else
  warn ""
  warn "Global isotope command not found."
  warn "Shortcuts will fall back to $PROJECT_DIR/bin/isotope"
  warn "Run bash setup.sh to install the global command."
fi

info ""
info "Add buttons to your Android home screen:"
info "  1. Install Termux:Widget from F-Droid or GitHub (same source as Termux)."
info "  2. Long press the Android home screen."
info "  3. Tap Widgets → scroll to Termux Widget."
info "  4. Tap the widget and choose a shortcut:"
info "     • isotope-start   — start server + open browser"
info "     • isotope-update  — pull latest version"
info "     • isotope-open    — open in browser"
info "     • isotope-doctor  — check everything"
info "     • isotope-repair  — fix dependencies"
