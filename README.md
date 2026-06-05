# Isotope Local

Isotope is a downloadable local-server study app. Users run the Node server on their own device and open the app in a browser.

Supabase is used for backend/cloud sync only:

- Auth
- Database
- Storage
- Realtime
- Community/group sync
- Edge functions if a self-hosted owner chooses to add them

Supabase is not used as normal static frontend hosting, a central VPS replacement, or a global Node server host. Do not try to host the app at `https://<project-ref>.supabase.co/`; that URL is for Supabase APIs.

## Quick Start

Normal users only need:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Admin fields stay blank unless the owner explicitly enables private admin mode.

### Termux / Android, Linux, macOS

```bash
bash setup.sh
```

### Windows

Double-click `setup.bat`, or run:

```bat
setup.bat
```

### PowerShell

```powershell
.\install.ps1
```

Setup checks Node, npm, and Git, creates `.env` from `.env.example`, asks for the Supabase public config if needed, installs dependencies, installs the global `isotope` command, and starts the local server.

## Commands

After setup, these work from any directory:

```bash
isotope start
isotope stop
isotope restart
isotope update
isotope status
isotope doctor
isotope open
isotope logs
```

The command system stores state in `~/.isotope`:

- `~/.isotope/project-path`
- `~/.isotope/isotope.pid`
- `~/.isotope/port`
- `~/.isotope/logs/server.log`
- `~/.isotope/logs/update.log`

`isotope doctor` reports whether the global command is available in `PATH`.
`isotope open` warns if the local server is not responding before opening the browser, because a cached PWA shell may still appear while local APIs are offline.

## Run Manually

```bash
PORT=5000 node server.mjs
```

Open:

```text
http://127.0.0.1:5000
```

## Updating

Use:

```bash
isotope update
```

The updater preserves `.env`, stashes local uncommitted changes before pulling, uses `git fetch`, fast-forwards only when safe, runs `npm install` if package files changed, and restarts the managed server if it was already running.

The in-app update banner does not stop the server. It opens a dialog showing the command to run:

```bash
isotope update
```

Update checks prefer release/version comparison from GitHub commit metadata and only fall back to Git SHA comparison when no version is available. If the server confirms there is no update, stale dismissed-banner state is cleared.

## Offline / PWA Behavior

After the app is opened once while the local server is running, the browser installs a service worker and caches the app shell plus core assets.

When the server is off:

- Cached frontend shell pages may load.
- Local API routes do not work.
- Supabase auth, database, storage, realtime, and community sync do not work.
- The app shows a visible offline/local-server-unavailable indicator.

The app does not fake online/cloud features while offline.

Cache names include the local app version and Git SHA. After a real update, the service worker activates a new cache and removes old Isotope caches.

Service-worker activation reloads are guarded so one browser session can perform at most one automatic PWA refresh.

## Termux Widget

Android/Termux users can control Isotope from the home screen with Termux:Widget.

Run:

```bash
bash setup-termux-widget.sh
```

Widget shortcuts include start, stop, restart, update, open, doctor, status, and logs.

The shortcut installer embeds the absolute `isotope` command path when available, which makes home-screen widgets work even when Android does not provide the same `PATH` as an interactive Termux shell.

See [TERMUX_WIDGET.md](TERMUX_WIDGET.md).

## Admin Mode

Admin mode is optional and private. Normal users do not need it.

Private owner fields:

```env
ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
ADMIN_EMAIL=
ADMIN_EMAILS=
SUPABASE_ACCESS_TOKEN=
GITHUB_PAT=
```

Never commit service-role keys, admin secrets, Supabase management tokens, GitHub PATs, or private AI keys.

## Important Files

| File | Purpose |
|---|---|
| `server.mjs` | Local app server, API bridge, auth helpers, admin diagnostics |
| `public/` | Built frontend assets, service worker, manifest, offline page |
| `bin/isotope` | Linux/macOS/Termux global command wrapper |
| `bin/isotope.bat` | Windows command wrapper |
| `setup.sh`, `setup.bat`, `install.ps1` | Beginner setup scripts |
| `update.sh`, `update.bat` | Compatibility update entrypoints |
| `setup-termux-widget.sh` | Android Termux Widget shortcut installer |
| `community-patch-v4.sql` | Core Supabase schema/community patch plus removed Events/Store cleanup |
| `events-expansion.sql` | Cleanup patch for removed Events/Store objects |
| `.env.example` | Public Supabase config template with private admin fields blank |

## Troubleshooting

Run:

```bash
isotope doctor
isotope status
isotope logs
```

If the global command is missing, rerun setup:

```bash
bash setup.sh --no-start
```

Windows:

```bat
setup.bat --no-start
```
