<p align="center">
  <img src="./logo.svg" alt="IsotopeAI Logo" width="120" />
</p>

<h1 align="center">IsotopeAI</h1>

<p align="center">
  A self-hosted, local-first student productivity app with cloud sync via Supabase.
</p>

<p align="center">
  <a href="./CHANGELOG.md">
    <img alt="Version" src="https://img.shields.io/badge/version-3.2.0-8b5cf6?style=flat-square">
  </a>
  <a href="https://nodejs.org">
    <img alt="Node" src="https://img.shields.io/badge/node-18%2B-339933?style=flat-square&logo=node.js">
  </a>
  <a href="./setup.sh">
    <img alt="Platform" src="https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows%20%7C%20Android-lightgrey?style=flat-square">
  </a>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-commands">Commands</a> ·
  <a href="#-cloud-sync--backup">Cloud Sync</a> ·
  <a href="#-supabase-setup">Supabase Setup</a> ·
  <a href="#-termux-widget">Termux Widget</a> ·
  <a href="#-bug-fixes">Bug Fixes</a> ·
  <a href="#-troubleshooting">Troubleshooting</a>
</p>

---

## Overview

IsotopeAI is a downloadable, self-hosted local-server app.

You run the app on your own device, open it in a browser, and optionally connect it to Supabase for account sync, cloud backup, storage, community data, and realtime features.

Supabase is the backend/cloud layer only. It is not the public website host and it is not a VPS replacement.

```text
Browser / PWA
    ↓
127.0.0.1:3000
    ↓
Local Node.js server
    ↓
Supabase Auth + Database + Storage + Realtime
```

Normal users only need:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Admin/service-role keys are optional owner-only fields and must never be required for normal users.

---

## ✨ Features

| Area | Features |
|---|---|
| Study | Focus timer, session log, daily stats, streaks |
| Planner | Subjects, tasks, habits, exam calendar |
| Analytics | Study breakdowns, subject insights, progress views |
| Community | Groups, chat, challenges, leaderboard |
| AI | Study assistant, summaries, analysis cards |
| Cloud | Supabase-backed snapshot backup and restore |
| Offline | PWA shell works from cache when server is off |
| CLI | `isotope start`, `update`, `doctor`, `logs` |
| Android | Termux Widget shortcuts for start/update/open |

---

## ⚡ Quick Start

Requirements:

- Node.js 18+
- Git
- Supabase project
- Supabase URL + anon key

### Linux / macOS / Termux

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh
```

### Windows

```bat
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
setup.bat
```

### PowerShell

```powershell
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
.\install.ps1
```

Setup will:

1. Check Node, npm, and Git.
2. Create `.env` from `.env.example`.
3. Ask for your Supabase URL and anon key.
4. Run `npm install`.
5. Install the global `isotope` command.
6. Start the local server.

Open:

```text
http://127.0.0.1:3000
```

---

## 🔧 Commands

After setup, these work from any directory:

```bash
isotope start      # Start the local server
isotope stop       # Stop the server
isotope restart    # Restart the server
isotope update     # Pull latest + install deps + restart
isotope status     # Show server state
isotope doctor     # Check Node, Git, PATH, Supabase health
isotope open       # Health-check server, then open browser
isotope logs       # Tail server logs
```

State is stored in:

```text
~/.isotope/
```

| File | Purpose |
|---|---|
| `project-path` | Path to cloned repo |
| `isotope.pid` | Running server PID |
| `port` | Active server port |
| `logs/server.log` | Server output |
| `logs/update.log` | Update output |

### Manual start

```bash
PORT=3000 node server.mjs
```

---

## ☁️ Cloud Sync & Backup

Cloud sync is account-based and Supabase-backed.

The app must not treat browser cache, localStorage, IndexedDB, or Zustand persistence as cloud truth. Those are only local cache, offline queue, or last-known snapshots.

Real sync means:

```text
browser action
→ Supabase DB/storage change
→ browser cache cleared
→ login again
→ data restored from Supabase
```

### Backup flow

```text
Browser
  ↓
POST /__auth/backup
  ↓
server.mjs verifies Supabase access token
  ↓
buildCloudSnapshot()
  ↓
Supabase Storage
  ↓
user-content/{user_id}/cloud-snapshot/latest.json
```

The browser sends the current Supabase access token:

```http
Authorization: Bearer <supabase_access_token>
```

The server verifies the token and uses a user-scoped Supabase client. Normal users do not need a service-role key.

### Snapshot path

Latest snapshot:

```text
user-content/{user_id}/cloud-snapshot/latest.json
```

History snapshots:

```text
user-content/{user_id}/cloud-snapshot/history/{timestamp}.json
```

### Snapshot may include

- profile data
- settings
- onboarding state
- product tour state
- study summary
- recent stats/session metadata
- sync metadata

### Snapshot must never include

- passwords
- auth tokens
- refresh tokens
- cookies
- service-role keys
- GitHub tokens
- `.env` secrets

### Success response

```json
{
  "success": true,
  "uploaded": true,
  "bucket": "user-content",
  "path": "{user_id}/cloud-snapshot/latest.json",
  "synced_at": "2026-06-06T00:00:00.000Z"
}
```

### Error responses

| Stage | HTTP | Meaning |
|---|---|---|
| `auth` | 401 | No valid Supabase session |
| `db_read` | 500 | User data read failed |
| `snapshot_build` | 500 | Snapshot build failed |
| `storage_upload` | 403/500 | Storage upload failed |
| `metadata_update` | 500 | Metadata write failed |

The UI may show **Synced** only after the Supabase upload succeeds.

---

## 🗄️ Supabase Setup

Run the SQL patch in Supabase SQL Editor:

```text
community-patch-v4.sql
```

The patch creates or repairs:

- `public.users`
- `user_profiles`
- `user_onboarding`
- `user_tours`
- `study_sessions_log`
- `daily_user_stats`
- `user_stats_summary`
- community/group tables
- RLS policies
- storage buckets
- storage policies
- auth bootstrap triggers
- realtime publication

Expected buckets:

| Bucket | Purpose |
|---|---|
| `avatars` | Profile images |
| `user-content` | Cloud snapshots and user files |
| `notes` | Notes/documents |

### Storage path rule

Authenticated users should only access their own folder:

```text
{user_id}/...
```

For example:

```text
avatars/{user_id}/avatar.png
user-content/{user_id}/cloud-snapshot/latest.json
notes/{user_id}/...
```

### Storage RLS policies

```sql
CREATE POLICY "private_content_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "private_content_owner_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "private_content_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "private_content_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

Avatar policies should allow authenticated users to upload/update their own avatar path. Public avatar reads are acceptable only if intentionally configured.

---

## 🔑 Environment Variables

Create `.env` from `.env.example`.

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

PORT=3000

ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
ADMIN_EMAIL=
ADMIN_EMAILS=
SUPABASE_ACCESS_TOKEN=
GITHUB_PAT=
```

Normal users need only:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Never commit:

- `.env`
- service-role keys
- admin secrets
- GitHub PATs
- API keys
- auth tokens
- cookies

---

## 📱 Termux Widget

Android users can control IsotopeAI from the home screen using Termux:Widget.

```bash
bash setup-termux-widget.sh
```

This installs shortcuts for:

- start
- stop
- restart
- update
- open
- doctor
- status
- logs

Shortcut files are created in:

```text
~/.shortcuts/
```

They call the absolute Termux command path, so they do not depend on fragile shell aliases.

Example:

```bash
/data/data/com.termux/files/usr/bin/isotope start
```

See:

```text
TERMUX_WIDGET.md
```

---

## 🐛 Bug Fixes (v3.1.2-patch)

This branch includes critical bug fixes for PWA service worker, update checker, and offline mode stability:

### Fixed Issues

| Bug | File | Impact | Fix |
|---|---|---|---|
| **Cache SHA not truncated** | `public/sw.js` | Cache reuse failure on version updates | SHA truncated to 12 characters for consistent cache naming |
| **Update timer leak** | `public/update-checker.js` | Memory leak in long-running sessions | Timer cleared on `beforeunload` event |
| **Dismissal logic flaw** | `public/update-checker.js` | False positive update dismissals | Changed from prefix match to exact SHA comparison |
| **Silent update errors** | `public/update-checker.js` | No visibility into update check failures | Added console.warn logging for debugging |
| **Missing reload guard** | `public/pwa-local.js` | Multiple rapid reloads on SW activation | Added one-shot reload guard flag |
| **Client detach crash** | `public/sw.js` | Uncaught exception when clients detach | Wrapped client message send in try-catch |
| **HTML escaping issue** | `public/update-checker.js` | Potential HTML injection in banner | Fixed ternary conditional for safe HTML generation |

### Branch Information

- **Branch**: `fix/bug-fixes`
- **Commits**:
  1. `657a902` — Fix SW cache SHA truncation + client detach safety
  2. `a848d3a` — Fix update dismissal logic + error logging + timer cleanup
  3. `8b407ea` — Add SW reload guard + improve client message handling

### Testing Recommendations

```bash
# Test update dismissal
1. Trigger update check
2. Dismiss update
3. Verify same version doesn't show again

# Test offline behavior
1. Stop local server
2. Open app from cache
3. Verify no reload loop
4. Verify no forced onboarding
5. Restart server

# Test memory leaks
1. Open browser DevTools → Memory
2. Take heap snapshot before update checks
3. Tabs switching / page refreshes
4. Take heap snapshot after
5. Verify no growth in timer references

# Test cache consistency
1. Update app version
2. Check browser DevTools → Application → Cache
3. Verify cache name includes truncated SHA
4. No duplicate cache entries from old SHA format
```

---

## 🌐 Offline / PWA Behavior

After the app loads once with the local server running, the service worker caches the app shell.

When the local server is off:

- the cached app shell may still open
- local API routes fail
- Supabase cloud sync is unavailable
- update checks are suppressed
- onboarding must not be forced only because the server is offline
- the app must show offline/server-unavailable state

Offline cache is not proof that the local server is running.

Correct offline behavior:

```text
Server off
→ cached PWA opens
→ offline mode shown
→ no fake synced state
→ no update loop
→ no forced onboarding
```

---

## 🔒 Admin Mode

Admin mode is optional and private. Normal users do not need it.

Enable in `.env`:

```env
ENABLE_ADMIN_MODE=true
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET=your-local-secret
ADMIN_EMAIL=your@email.com
```

Admin diagnostics:

```text
http://127.0.0.1:3000/__admin/verify
```

Admin mode may run diagnostics and repair tasks. It must never be required for normal cloud sync.

---

## 📁 Project Structure

```text
isotope-code/
├── server.mjs
├── public/
│   ├── assets/
│   ├── sw.js
│   ├── pwa-local.js
│   ├── restore-and-launch.js
│   └── update-checker.js
├── bin/
│   ├── isotope
│   └── isotope.bat
├── community-patch-v4.sql
├── events-expansion.sql
├── isotope-schema.sql
├── setup.sh
├── setup.bat
├── install.ps1
├── setup-termux-widget.sh
├── update.sh
├── update.bat
├── CHANGELOG.md
├── AGENTS.md
├── TERMUX_WIDGET.md
└── logo.svg
```

---

## 🔄 Updating

```bash
isotope update
```

The updater:

1. Saves local uncommitted changes with a stash.
2. Fetches the latest GitHub state.
3. Updates the working tree safely.
4. Runs `npm install` when needed.
5. Restarts the managed server if it was running.
6. Writes logs to `~/.isotope/logs/update.log`.

The in-app update banner shows the update command. It does not stop the server directly.

---

## 🧪 Sync Proof Checklist

Cloud sync is not considered working until this matrix passes.

### Profile/settings

```text
edit profile/settings
→ user_profiles.profile_data changes
→ clear browser storage
→ login again
→ values restore from Supabase
```

### Avatar

```text
upload avatar
→ avatars bucket object exists
→ user_profiles stores avatar path/url
→ clear browser storage
→ login again
→ avatar restores from Supabase
```

### Onboarding

```text
complete onboarding
→ user_onboarding.completed = true
→ clear browser storage
→ login again
→ dashboard opens directly
```

### Backup snapshot

```text
run cloud backup
→ user-content/{user_id}/cloud-snapshot/latest.json exists
→ clear browser storage
→ login again
→ data restores from Supabase/snapshot
```

### Study stats

```text
complete focus session
→ study_sessions_log row exists
→ daily_user_stats updates
→ user_stats_summary updates
→ clear browser storage
→ login again
→ analytics/community restore same data
```

### Offline

```text
stop server
→ open cached app
→ no reload loop
→ no fake synced state
→ no forced onboarding
```

---

## 🛠️ Troubleshooting

```bash
isotope doctor
isotope status
isotope logs
```

### Global command missing

```bash
bash setup.sh --no-start
```

### Port already in use

```bash
isotope stop
PORT=3001 isotope start
```

### Setup says `.env.example` is missing

Create `.env` manually:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
```

Then run:

```bash
bash setup.sh
```

### Cloud sync says "Authentication required"

Check:

- you are logged into the app
- `.env` has the correct `SUPABASE_URL`
- `.env` has the correct `SUPABASE_ANON_KEY`
- the frontend sends `Authorization: Bearer <access_token>` to `/__auth/backup`
- the local server verifies the token
- the `user-content` bucket policies are applied

### Cloud sync says "Storage permission denied"

Apply the latest SQL patch:

```text
community-patch-v4.sql
```

Then retry backup from:

```text
Settings → Data & Privacy → Cloud Sync
```

### Offline app opens but server is down

Run:

```bash
isotope start
```

Then open:

```text
http://127.0.0.1:3000
```

### Old Termux alias breaks command

Check:

```bash
grep -R "Isotope-Reload-Fix\|alias isotope\|start.sh" ~/.bashrc ~/.profile ~/.zshrc 2>/dev/null
```

Remove stale aliases, then reinstall:

```bash
bash setup.sh --no-start
bash setup-termux-widget.sh
```

---

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md).

Highlights:

- **v3.2.0** — Leaderboard RLS fix (users now see real rankings), SQL index column correction (`seconds_studied`)
- **v3.1.3** — Supabase RLS performance hardening, PWA polling fix, `.env.example`, `update.bat`, professional release
- **v3.1.2-patch** — Critical PWA stability fixes (cache SHA, timer leaks, update logic)
- **v3.1.2** — Storage-backed backup restore and `/__auth/backup` auth hardening
- **v3.1.1** — Real cloud backup pipeline
- **v3.1.0** — Local server PWA command system and Termux CLI
- **v2.9.0** — Local software distribution baseline

---

## 🤝 Contributing

Before contributing:

1. Read [AGENTS.md](./AGENTS.md).
2. Do not commit `.env` or secrets.
3. Do not weaken RLS policies to make UI pass.
4. Do not fake sync success.
5. Do not treat browser cache as cloud truth.
6. Update SQL files when schema or RLS changes.
7. Run `isotope doctor` after server changes.
8. Prove sync with browser action → Supabase row/storage → cache clear → login restore.

---

## 📄 License

MIT. Add a `LICENSE` file before final public release if it is not already present.

---

<p align="center">
  Built by <a href="https://github.com/Suydev">Suydev</a>
</p>
