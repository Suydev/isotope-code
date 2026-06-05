# IsotopeAI Local — Agent Reference

Read this before changing the project.

## Architecture

Isotope is a downloadable local-server app. It is not one central SaaS/VPS deployment.

Users download the repository, run the local Node server on their own device, and open the browser app at `http://127.0.0.1:<PORT>`.

Supabase is used for backend/cloud sync only:

- Auth
- Database
- Storage
- Realtime
- Community/group sync
- Optional edge functions

Supabase is not static frontend hosting, a central VPS replacement, or the main website. Do not try to host the app at `https://<project-ref>.supabase.co/`; that URL is for Supabase APIs/services.

## Commands

After setup, these commands work from any directory:

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

- `project-path`
- `isotope.pid`
- `port`
- `logs/server.log`
- `logs/update.log`

Termux Widget shortcuts are installed by `setup-termux-widget.sh` into `~/.shortcuts/isotope-*`.

## What `server.mjs` Does

`server.mjs` is a zero-dependency Node.js server that serves the pre-built React SPA and local helper APIs.

It:

1. Serves `index.html` and `public/assets/*`
2. Patches selected compiled bundles in memory at serve time
3. Intercepts missing Supabase Edge Function calls in the browser
4. Proxies selected Supabase calls through `/__supa/*`
5. Provides username auth helpers under `/__auth/*`
6. Provides optional owner/admin tools under `/__admin/*`
7. Serves PWA/offline files and version endpoints

Do not rebuild or directly edit compiled files in `public/assets`. Use serve-time patches in `server.mjs`.

## Removed Product Surfaces

Events and Store have been removed from the product.

Current behavior:

- Events/Store navigation is removed by serve-time bundle patches.
- Store and Events chunks are served as empty modules.
- `/api/events*`, `/api/community-events`, and `/__admin/events*` return removed-feature 404 JSON.
- `community-patch-v4.sql` and `events-expansion.sql` include cleanup for removed Events/Store tables, functions, triggers, views, and storage bucket residue.

Do not add Events or Store routes, tables, RPCs, docs, or admin UI back unless the owner explicitly asks for a new implementation.

## File Map

| File | Role |
|---|---|
| `server.mjs` | Local app server, runtime bundle patches, auth helpers, Supabase proxy, admin diagnostics |
| `public/sw.js` | Local-server PWA service worker with app-shell/runtime caching |
| `public/pwa-local.js` | Service worker registration and honest offline/local-server status UI |
| `public/update-checker.js` | GitHub update checker that shows `isotope update` command dialog |
| `bin/isotope` | Bash global command wrapper for Linux/macOS/Termux |
| `bin/isotope.bat` | Windows global command wrapper |
| `setup.sh`, `setup.bat`, `install.ps1` | Beginner setup scripts |
| `update.sh`, `update.bat` | Compatibility update entrypoints that delegate to `isotope update` |
| `setup-termux-widget.sh` | Android Termux Widget shortcut installer |
| `TERMUX_WIDGET.md` | Android/Termux Widget guide |
| `community-patch-v4.sql` | Core Supabase schema/community patch plus removed Events/Store cleanup |
| `events-expansion.sql` | Cleanup patch for removed Events/Store objects |
| `.env.example` | Public Supabase config template plus blank private owner/admin fields |

## Environment

Normal users need only:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=
```

Private owner/admin fields remain blank unless explicitly configured:

```env
ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
ADMIN_EMAIL=
ADMIN_EMAILS=
SUPABASE_ACCESS_TOKEN=
GITHUB_PAT=
GEMINI_API_KEY=
GROQ_API_KEY=
```

Never print or commit service-role keys, admin secrets, Supabase management tokens, GitHub PATs, or private AI keys.

## PWA / Offline Rules

After first load with the local server running, the service worker caches the app shell and core same-origin assets.

When the local server is off:

- The cached frontend shell may load.
- Local API routes do not work.
- Supabase-backed features do not work.
- UI must show offline/local-server-unavailable state.

Do not fake online/cloud features.

Cache names include app version and Git SHA. `/api/version` reports the current package version and local Git SHA when available. `/api/check-update` compares the local Git SHA to GitHub `main`.

## Update Rules

The browser update banner must never kill the local server. It opens a dialog showing:

```bash
isotope update
```

The safe updater:

- Preserves `.env`
- Stashes local uncommitted changes before updating
- Uses `git fetch`
- Fast-forwards only when safe
- Runs `npm install` if package files changed
- Restarts only if the managed server was running before update
- Writes logs to `~/.isotope/logs/update.log`

## Supabase Schema Notes

Use `community-patch-v4.sql` as the canonical schema patch. `isotope-schema.sql` is older.

Important table/RPC facts still used by compiled JS:

- `daily_user_stats` uses `date` and `seconds_studied`
- `study_sessions_log` uses `duration_minutes` and `ended_at`
- `notifications` uses nullable `read_at`, not `is_read`
- `group_chat_messages` uses `user_id`, not `sender_id`
- `group_invites.token` is a writable text column
- `accept_invite` must return `{ success: boolean }`
- `get_membership_snapshot` must accept both `p_user_id` and `target_user_id`
- Group RLS membership checks must use `public._is_group_member(group_id, auth.uid())`

## Verification

Before finishing relevant changes, run focused checks such as:

```bash
node --check server.mjs
bash -n bin/isotope setup.sh update.sh setup-termux-widget.sh
isotope doctor
```

For browser/PWA work, start the server and verify `/sw.js`, `/manifest.webmanifest`, `/offline.html`, `/api/version`, and `/api/check-update`.
