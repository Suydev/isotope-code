# IsotopeAI Local

IsotopeAI is a downloadable study app that runs on your own device. The local Node server serves the app, keeps offline-friendly screens usable, and connects online features to the shared Isotope Supabase cloud.

This is not a VPS deployment guide and it is not a central hosted website. Users download the project, run it locally, and open it in their browser.

## What You Get

- Local app server for Windows, macOS, Linux, and Android Termux
- Supabase cloud sync for auth, profiles, community, events, storage, leaderboard, and realtime
- Offline-tolerant local dashboard/focus/study flows when the network is unavailable
- Real community and events data from Supabase, not demo widgets
- Onboarding state saved per user in Supabase, with local fallback for slow/offline startup
- Per-user local workspace isolation so old subjects/tasks do not leak between logins
- Optional private owner admin mode for diagnostics, schema patching, and event management
- GitHub Pages docs deployed from `docs/`

## Install

### Windows

Double-click:

`setup.bat`

If Windows asks for missing Node.js or Git, the script tries to install them with `winget`. If that fails, install Node.js 18+ from https://nodejs.org, then run `setup.bat` again.

### macOS / Linux / Termux

```bash
chmod +x setup.sh
./setup.sh
```

The script detects the platform, checks Node.js and Git, creates `.env`, installs npm metadata, validates the server, and starts the local app.

### PowerShell

```powershell
./install.ps1
```

## Run

```bash
node server.mjs
```

Open:

```
http://localhost:3000
```

Use a custom port if needed:

```bash
PORT=5000 node server.mjs
```

## Cloud Sync

Normal installs use the shared Isotope Supabase project by default:

```env
SUPABASE_URL=https://vteqquoqvksshmfhuepu.supabase.co
SUPABASE_ANON_KEY=<public anon key already in .env.example>
```

The anon key is public by design. Service-role/admin keys are never required for normal users and must stay private.

Advanced users can point the software at their own Supabase project by editing `.env`.

## Offline Behavior

The app is local-first where practical:

- The server keeps running without internet.
- Local study pages, cached assets, focus tools, and local workspace state remain usable.
- Cloud features such as auth, community, events, storage, and realtime show real loading/offline states instead of crashing.
- Service worker caches are intentionally small so phones do not fill 40-50 MB with old sound/media caches.

## Admin Mode

Admin mode is optional and private. Normal users do not need it.

Enable owner tools in your private `.env`:

```env
ENABLE_ADMIN_MODE=true
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_EMAILS=
ADMIN_SECRET=
SUPABASE_ACCESS_TOKEN=
```

Unlock admin pages at:

```
http://localhost:3000/__admin/login
```

You can unlock with `ADMIN_SECRET`, a logged-in Supabase account listed in `ADMIN_EMAIL` / `ADMIN_EMAILS`, or an active `owner`, `admin`, or `super_admin` row in `user_roles`.

## Important Files

| File | Purpose |
|---|---|
| `server.mjs` | Local app server, API bridge, admin diagnostics, Supabase helpers |
| `public/` | Built frontend assets and service worker |
| `community-patch-v4.sql` | Core Supabase schema/community patch |
| `events-expansion.sql` | Events ecosystem schema |
| `setup.sh`, `setup.bat`, `install.ps1` | First-run installers |
| `update.sh`, `update.bat` | Safe updater scripts |
| `.env.example` | Default public cloud config plus blank private admin fields |
| `docs/` | GitHub Pages documentation |

## Updating

```bash
./update.sh
```

Windows:

```bat
update.bat
```

The updater preserves `.env`. If local files changed, it stashes them before updating.

## Troubleshooting

- Repeated onboarding: restart after this release and clear browser storage only if an older install already cached broken local state.
- Dummy subjects: local workspace data is now scoped per Supabase user; signing in as a different user clears stale global IndexedDB subjects/tasks.
- Community loading issue: `/api/community-events` now returns widget-safe event data and falls back to an empty list instead of invalid JSON shapes.
- Missing asset file: the local server tries upstream `/assets/<file>.js` recovery and caches the recovered bundle locally.

## Security

- Do not commit `.env`.
- Do not publish service-role keys, admin secrets, GitHub PATs, or Supabase management tokens.
- If a token was ever exposed in history or chat, revoke it and create a new one.
- The repository history was reset to a sanitized root commit for this release.
