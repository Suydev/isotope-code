# IsotopeAI — Termux Widget Guide

Control IsotopeAI from your Android home screen with Termux:Widget buttons.

---

## First-time install (one command)

Open Termux and paste:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
```

Or if curl is not yet installed:

```bash
pkg install curl && bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
```

This single command:
1. Updates Termux packages
2. Installs Node.js, Git, and all required tools
3. Clones the IsotopeAI repository
4. Runs setup and installs home-screen shortcuts
5. Starts the server and opens it in your browser

> **Important:** Install Termux from [F-Droid](https://f-droid.org/packages/com.termux/) or the [GitHub release](https://github.com/termux/termux-app/releases) — **not** the Play Store. The Play Store version stopped receiving updates in 2020 and has known bugs.

---

## Install Termux:Widget

Install from the **same source** as Termux:
- F-Droid: https://f-droid.org/packages/com.termux.widget/
- GitHub: https://github.com/termux/termux-widget/releases

Mixing sources (e.g. Termux from F-Droid + Widget from Play Store) causes failures.

---

## Add home-screen buttons

1. Long press the Android home screen
2. Tap **Widgets**
3. Find and expand **Termux Widget**
4. Drag a widget onto your home screen
5. Tap it and choose a shortcut from the list below

---

## Available shortcuts

### Foreground shortcuts (open a Termux window with output)

| Shortcut | What it does |
|---|---|
| `isotope-start` | Start the local server and open it in the browser |
| `isotope-stop` | Stop the managed local server |
| `isotope-restart` | Stop, restart, and open the app |
| `isotope-update` | Pull the latest version from GitHub and restart if running |
| `isotope-open` | Open `http://127.0.0.1:PORT` in the browser |
| `isotope-doctor` | Full diagnostic — checks all dependencies and health |
| `isotope-status` | Show PID, port, version, and configuration status |
| `isotope-logs` | Show the last 80 server log lines (secrets redacted) |
| `isotope-repair` | Re-install dependencies and refresh the global command |
| `isotope-reinstall-widgets` | Refresh all home-screen shortcuts |

### Background task shortcuts (no terminal window)

These run silently — useful for quick one-tap stop/restart without opening Termux:

| Shortcut | What it does |
|---|---|
| `isotope-stop-bg` | Stop the server silently in the background |
| `isotope-restart-bg` | Restart the server silently in the background |

Background shortcuts log to `~/.isotope/logs/widget-<name>.log`.

---

## Refresh shortcuts

If shortcuts stop working after an update, run from Termux:

```bash
bash setup-termux-widget.sh
```

Or use the CLI:

```bash
isotope reinstall-widgets
```

Or tap the **isotope-reinstall-widgets** home-screen button.

---

## Repair broken install

If something stops working (missing packages, stale process, permissions):

```bash
isotope repair
```

Or tap the **isotope-repair** home-screen button.

---

## How shortcuts work

During setup, the absolute path to the `isotope` command is resolved and embedded in each shortcut script. This avoids failures when Termux:Widget launches scripts without the interactive terminal `PATH`.

Shortcuts are stored in:
- `~/.shortcuts/` — foreground shortcuts (open Termux window)
- `~/.shortcuts/tasks/` — background task shortcuts (silent)

Each shortcut logs its output to `~/.isotope/logs/widget-<name>.log`.

The project path is remembered in `~/.isotope/project-path`.

---

## All CLI commands

```bash
isotope start               # start server in background
isotope stop                # stop server
isotope restart             # stop + start + open
isotope update              # pull latest version from GitHub
isotope status              # show project, port, version, config
isotope doctor              # full diagnostic check
isotope open                # open in browser
isotope logs                # show last 80 server log lines
isotope version             # print installed version
isotope repair              # fix deps + reinstall CLI
isotope reinstall-widgets   # refresh Termux shortcuts
isotope setup               # re-run setup without starting server
```

---

## Log locations

| Log | Path |
|---|---|
| Server output | `~/.isotope/logs/server.log` |
| Update output | `~/.isotope/logs/update.log` |
| Setup output | `~/.isotope/logs/setup.log` |
| Install output | `~/.isotope/logs/install.log` |
| Widget output | `~/.isotope/logs/widget-<name>.log` |

View recent server logs:
```bash
isotope logs
```

---

## Troubleshooting

**Widget button does nothing:**
Run `bash setup-termux-widget.sh` to refresh shortcuts with the current command path.

**"isotope command not found" in shortcut:**
Run `bash setup.sh` or `bash install-termux.sh` to reinstall the global command.

**Play Store Termux warning during install:**
Reinstall Termux from F-Droid or the GitHub release — the Play Store version is unmaintained.

**Server started but browser shows error:**
Your `.env` may be missing Supabase credentials. Run `isotope doctor` to check.

**Stale PID / server won't start:**
Run `isotope repair` — it clears stale process state and re-verifies dependencies.
