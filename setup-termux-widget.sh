#!/usr/bin/env bash
# IsotopeAI — Termux Widget shortcut installer
# Creates home-screen buttons in ~/.shortcuts/ and ~/.shortcuts/tasks/
# ──────────────────────────────────────────────────────────────────────────────
# Usage: bash setup-termux-widget.sh
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

info() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die()  { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# The Termux application package. Overridable for forks/repacks that ship under a
# different package name; every path below is derived from it rather than
# hardcoding com.termux.
TERMUX_PKG="${TERMUX_PKG:-com.termux}"

# Resolve the Termux prefix ($PREFIX). Order matters: when this script runs from
# inside Termux, $PREFIX is authoritative and nothing else should be probed.
resolve_termux_prefix() {
  if [ -n "${PREFIX:-}" ] && [ -d "${PREFIX:-}" ]; then printf '%s' "$PREFIX"; return 0; fi
  # /data/user/0 is the real path on modern Android; /data/data is the usual symlink.
  local d
  for d in "/data/data/$TERMUX_PKG/files/usr" "/data/user/0/$TERMUX_PKG/files/usr"; do
    if [ -d "$d" ]; then printf '%s' "$d"; return 0; fi
  done
  return 1
}

IN_TERMUX=0
if [ -n "${TERMUX_VERSION:-}" ] || printf '%s' "${PREFIX:-}" | grep -q "^/data/\(data\|user/0\)/$TERMUX_PKG"; then
  IN_TERMUX=1
fi

if [ "$IN_TERMUX" -eq 0 ]; then
  # This is the ADB / Shizuku case: `adb shell` is NOT Termux, so $HOME is not
  # Termux's home and ~/.shortcuts would be written to the wrong place — producing
  # widgets that silently cannot find anything. Refuse rather than half-install.
  die "Not running inside $TERMUX_PKG (found neither TERMUX_VERSION nor a matching PREFIX).
     Widget shortcuts MUST be created by Termux itself, or they land in the wrong
     \$HOME and the widget does nothing.

     With Shizuku/ADB, get into Termux first and run it there:
       adb shell am start -n $TERMUX_PKG/.app.MainActivity
       # then, inside Termux:
       bash setup-termux-widget.sh

     Not a Termux package? Set TERMUX_PKG to its package name, e.g.
       TERMUX_PKG=com.example.termux bash setup-termux-widget.sh"
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
TERMUX_PREFIX="$(resolve_termux_prefix)" || die "Could not locate the $TERMUX_PKG prefix."
PREFIX_BIN_ISO="$TERMUX_PREFIX/bin/isotope"
TERMUX_BIN_ISO="$TERMUX_PREFIX/bin/isotope"
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
