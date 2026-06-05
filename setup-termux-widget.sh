#!/usr/bin/env bash
set -euo pipefail

info() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }

if [ -z "${TERMUX_VERSION:-}" ] && ! printf '%s' "${PREFIX:-}" | grep -q 'com.termux'; then
  warn "Termux was not detected. This script is intended for Android Termux."
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ISO_HOME="$HOME/.isotope"
SHORTCUT_DIR="$HOME/.shortcuts"
LOG_DIR="$ISO_HOME/logs"

mkdir -p "$ISO_HOME" "$LOG_DIR" "$SHORTCUT_DIR"
printf '%s\n' "$PROJECT_DIR" > "$ISO_HOME/project-path"

make_shortcut() {
  name="$1"
  command="$2"
  file="$SHORTCUT_DIR/$name"
  cat > "$file" <<EOF
#!/usr/bin/env bash
set -u
ISO_HOME="\$HOME/.isotope"
PROJECT_PATH_FILE="\$ISO_HOME/project-path"
PROJECT_DIR=""
[ -f "\$PROJECT_PATH_FILE" ] && PROJECT_DIR="\$(sed -n '1p' "\$PROJECT_PATH_FILE")"
run_isotope() {
  if command -v isotope >/dev/null 2>&1; then
    isotope "$command"
    return \$?
  fi
  if [ -n "\$PROJECT_DIR" ] && [ -x "\$PROJECT_DIR/bin/isotope" ]; then
    ISOTOPE_PROJECT_DIR="\$PROJECT_DIR" "\$PROJECT_DIR/bin/isotope" "$command"
    return \$?
  fi
  printf '%s\n' "Isotope command not installed. Run bash setup.sh from the Isotope folder."
  return 1
}
run_isotope
EOF
  chmod +x "$file"
}

make_shortcut isotope-start start
make_shortcut isotope-stop stop
make_shortcut isotope-restart restart
make_shortcut isotope-update update
make_shortcut isotope-open open
make_shortcut isotope-doctor doctor
make_shortcut isotope-status status
make_shortcut isotope-logs logs

info ""
info "Termux Widget shortcuts installed:"
for f in isotope-start isotope-stop isotope-restart isotope-update isotope-open isotope-doctor isotope-status isotope-logs; do
  if [ -x "$SHORTCUT_DIR/$f" ]; then info "  $SHORTCUT_DIR/$f"; else warn "Missing executable: $SHORTCUT_DIR/$f"; fi
done

if command -v isotope >/dev/null 2>&1; then
  info "Global isotope command: configured"
else
  warn "Global isotope command not found in PATH. Shortcuts will fall back to $PROJECT_DIR/bin/isotope."
fi

info ""
info "Add buttons to your Android home screen:"
info "1. Install the Termux:Widget add-on."
info "2. Long press the Android home screen."
info "3. Add a Termux Widget."
info "4. Choose isotope-start, isotope-update, isotope-open, isotope-doctor, isotope-status, or isotope-logs."
