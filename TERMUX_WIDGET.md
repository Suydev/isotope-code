# Isotope Termux Widget Guide

Isotope can be controlled from the Android home screen with Termux:Widget.

## Install

1. Install Termux from F-Droid or the official GitHub-compatible source.
2. Install the Termux:Widget add-on.
3. Open Termux and go to the Isotope project folder.
4. Run:

```bash
bash setup.sh
```

5. Choose to install Termux Widget shortcuts when setup asks.

You can also install or refresh shortcuts later:

```bash
bash setup-termux-widget.sh
```

The installer stores the project path in `~/.isotope/project-path` and embeds the resolved absolute `isotope` command path in each shortcut when available. This avoids failures when Termux:Widget starts a script without the same `PATH` used by an interactive Termux shell.

## Add Home-Screen Buttons

1. Long press the Android home screen.
2. Add a Termux Widget.
3. Choose shortcuts such as:

- `isotope-start`
- `isotope-update`
- `isotope-open`
- `isotope-doctor`
- `isotope-status`
- `isotope-logs`

## Available Shortcuts

- `isotope-start` starts the local server in the background and opens the browser.
- `isotope-stop` stops the managed local server.
- `isotope-restart` stops, starts, and opens the app.
- `isotope-update` safely updates from GitHub and restarts if the server was running.
- `isotope-open` opens `http://127.0.0.1:<PORT>` and warns if the local server is not responding, because the cached PWA shell may still open while APIs are offline.
- `isotope-doctor` checks Node, npm, Git, `.env`, PWA files, and local health.
- `isotope-status` shows project path, PID, port, version, and config status.
- `isotope-logs` shows the last 80 server log lines.

The shortcuts work from any directory because setup stores the project path in:

```text
~/.isotope/project-path
```

Logs are written to:

```text
~/.isotope/logs/server.log
~/.isotope/logs/update.log
```

Secrets are not printed by status or doctor. Logs redact common token patterns before display.
