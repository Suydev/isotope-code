<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="96" height="96">
  <circle cx="12" cy="12" r="1" />
  <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
  <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
</svg>

# [![IsotopeAI](https://i.ibb.co/WSrcM6R/desktop-2.png)](https://suydev.github.io/isotope-code/)

**A self-hosted, local-first student productivity app with cloud sync via Supabase.**

[![Version](https://img.shields.io/badge/version-3.1.2-8b5cf6?style=flat-square)](./CHANGELOG.md)
[![Node](https://img.shields.io/badge/node-18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows%20%7C%20Android-lightgrey?style=flat-square)](./setup.sh)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)

[Quick Start](#-quick-start) · [Commands](#-commands) · [Cloud Sync](#-cloud-sync--backup) · [Admin Mode](#-admin-mode) · [Troubleshooting](#-troubleshooting) · [Changelog](./CHANGELOG.md)

</div>

---

## Overview

IsotopeAI runs entirely on your own device. You start a local Node.js server, open the app in any browser, and your data stays on your machine. Supabase provides auth, cloud backup, community features, and real-time sync — but only as a backend bridge, not a host.

```
Your Browser ──► localhost:3000 (Node server) ──► Supabase (auth + DB + storage)
```

No central server. No vendor lock-in. Full data portability via JSON export/import.

---

## ✨ Features

| Category | Capability |
|---|---|
| **Study** | Focus timer, sessions log, daily stats, streaks |
| **Planner** | Subjects, tasks, habits, exam calendar |
| **Analytics** | Weekly/monthly breakdowns, subject heatmaps, AI summaries |
| **Community** | Groups, group chat, challenges, leaderboard |
| **AI** | Study assistant, weekly summary, AI analysis cards |
| **Cloud** | Per-user cloud snapshot backup · restore across devices |
| **Offline** | Full PWA — works from cache when server is off |
| **CLI** | `isotope start/stop/restart/update/doctor/logs` from any directory |

---

## ⚡ Quick Start

> **Requirements:** Node.js 18+, Git, a Supabase project (free tier works).

### Linux / macOS / Termux (Android)

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
1. Check Node, npm, and Git
2. Create `.env` from `.env.example` (prompts for your Supabase URL + anon key)
3. Run `npm install`
4. Install the global `isotope` command
5. Start the server

Open **http://127.0.0.1:3000** in your browser.

---

## 🔧 Commands

After setup, these work from **any directory**:

```bash
isotope start      # Start the local server
isotope stop       # Stop the server
isotope restart    # Restart the server
isotope update     # Pull latest + npm install + restart
isotope status     # Show whether the server is running
isotope doctor     # Check Node, Git, PATH, Supabase health
isotope open       # Health-check server then open browser
isotope logs       # Tail the server log
```

State is stored in `~/.isotope/`:

| File | Purpose |
|---|---|
| `~/.isotope/project-path` | Path to the cloned repo |
| `~/.isotope/isotope.pid` | PID of the running server |
| `~/.isotope/port` | Port the server is listening on |
| `~/.isotope/logs/server.log` | Server output log |
| `~/.isotope/logs/update.log` | Update output log |

### Run manually

```bash
PORT=3000 node server.mjs
```

---

## ☁️ Cloud Sync & Backup

IsotopeAI v3.1 ships a full cloud backup pipeline backed by Supabase Storage.

### How it works

```
Browser ──► POST /__auth/backup ──► server.mjs
                                        │
                              verifySupabaseAccessToken()
                                        │
                              buildCloudSnapshot()
                                        │
                    Supabase Storage: user-content/{uid}/cloud-snapshot/latest.json
```

1. The app calls `POST /__auth/backup` with a `Bearer` token in the `Authorization` header.
2. The server verifies the token by calling Supabase `/auth/v1/user` — no service-role key needed.
3. A safe snapshot is built (profile, onboarding, settings, stats — **no passwords or tokens**).
4. The snapshot is uploaded to `user-content/{user_id}/cloud-snapshot/latest.json`.
5. An optional timestamped copy is saved under `history/`.

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
| `auth` | 401 | No session / expired token |
| `db_read` | 500 | Could not read user data |
| `snapshot_build` | 500 | Could not assemble snapshot |
| `storage_upload` | 403/500 | Storage permission denied or upload failed |
| `metadata_update` | 500 | Snapshot saved but metadata write failed |

### Storage RLS policies

The `user-content` bucket requires these Supabase Storage RLS policies (all included in `community-patch-v4.sql`):

```sql
-- SELECT (read own folder)
CREATE POLICY "private_content_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);

-- INSERT (upload to own folder)
CREATE POLICY "private_content_owner_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);

-- UPDATE (overwrite own files — needed for upsert)
CREATE POLICY "private_content_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);

-- DELETE (remove own files)
CREATE POLICY "private_content_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 🗄️ Supabase Setup

Apply the schema patches in this order:

```bash
# 1. Core schema + community tables + storage policies
#    Run in Supabase SQL Editor
community-patch-v4.sql

# 2. Event/store cleanup (if upgrading from v2.x)
events-expansion.sql
```

What the patches create:

- All public tables (`users`, `user_profiles`, `user_onboarding`, `user_tours`, `study_sessions_log`, `daily_user_stats`, `user_stats_summary`, `groups`, `group_members`, `group_chat_messages`, …)
- Row-Level Security policies for every table
- Storage buckets: `avatars`, `user-content`, `notes`
- Storage RLS for all three buckets
- Realtime publication for key tables
- Triggers (`handle_new_user`, backfill seeds)

---

## 🔑 Environment Variables

Create `.env` from `.env.example`:

```env
# Required — your Supabase project config (safe to commit if anon key)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional — port (default 3000)
PORT=3000

# Admin mode — leave blank for normal users
ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
ADMIN_EMAIL=
ADMIN_EMAILS=
SUPABASE_ACCESS_TOKEN=
GITHUB_PAT=
```

> **Never commit** service-role keys, admin secrets, GitHub PATs, or AI API keys.

---

## 📱 Termux Widget (Android)

Control IsotopeAI from your Android home screen:

```bash
bash setup-termux-widget.sh
```

Installs shortcuts for `start`, `stop`, `restart`, `update`, `open`, `doctor`, `status`, and `logs`. Shortcuts embed the absolute Termux binary path so they work from the home screen even when Android strips the interactive `PATH`.

See [TERMUX_WIDGET.md](TERMUX_WIDGET.md) for details.

---

## 🌐 Offline / PWA Behavior

After the app loads once with the server running, a service worker caches the shell and core assets.

**When the server is off:**
- The PWA shell may still open (from cache)
- All local API routes (`/__auth/*`, `/api/*`) will fail
- Supabase auth, DB, storage, and community sync do not work
- A visible offline/server-unavailable indicator is shown
- The app **does not fake** online or cloud features

**PWA reload guard:** Service worker `activated` events trigger at most **one** automatic page reload per browser session — preventing infinite refresh loops on cache transitions.

---

## 🔒 Admin Mode

Admin mode is private and optional. Normal users never need it.

Enable in `.env`:

```env
ENABLE_ADMIN_MODE=true
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET=your-local-secret
ADMIN_EMAIL=your@email.com
```

Admin panel: `http://localhost:3000/__admin/verify`

Admin capabilities: user role management, DML patches, Supabase diagnostics, force-patch compiled bundles.

---

## 📁 Project Structure

```
isotope-code/
├── server.mjs                 # Local app server — API bridge, auth, backup, admin
├── public/
│   ├── assets/                # Built React bundles (do not edit directly)
│   ├── sw.js                  # Service worker
│   ├── pwa-local.js           # PWA lifecycle manager
│   ├── restore-and-launch.js  # Session restore + bootstrap on load
│   └── update-checker.js      # In-app update banner logic
├── bin/
│   ├── isotope                # Linux/macOS/Termux global command
│   └── isotope.bat            # Windows global command
├── community-patch-v4.sql     # Full Supabase schema + community + storage policies
├── events-expansion.sql       # Cleanup patch for removed Events/Store objects
├── isotope-schema.sql         # Legacy v2 base schema (for reference)
├── setup.sh                   # Linux/macOS/Android setup
├── setup.bat                  # Windows setup
├── install.ps1                # PowerShell setup
├── setup-termux-widget.sh     # Android Termux Widget shortcut installer
├── update.sh / update.bat     # Compatibility update entrypoints
├── .env.example               # Config template (anon key only — safe to commit)
├── CHANGELOG.md               # Version history
└── AGENTS.md                  # Agent/AI contribution rules
```

---

## 🔄 Updating

```bash
isotope update
```

The updater:
1. Stashes any local uncommitted changes
2. `git fetch` + fast-forward merge (safe only)
3. Runs `npm install` if `package.json` changed
4. Restarts the managed server if it was running
5. Writes the new version to `~/.isotope/version`

The in-app update banner shows a command prompt — it does not stop the server automatically.

---

## 🛠️ Troubleshooting

```bash
isotope doctor    # Check Node version, Git, PATH, Supabase health, update status
isotope status    # Is the server running? What port?
isotope logs      # Tail the server log
```

**Global command missing after update?**

```bash
bash setup.sh --no-start    # Linux/macOS/Termux
setup.bat --no-start        # Windows
```

**Port already in use?**

```bash
isotope stop
PORT=3001 isotope start
```

**Cloud sync shows "Authentication required"?**

- Make sure you are logged in to the app (not just the Supabase dashboard)
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env` match your project
- Run `isotope doctor` — it checks Supabase REST, Auth, and Storage connectivity

**Storage upload blocked (403)?**

Apply the latest `community-patch-v4.sql` in your Supabase SQL Editor. This adds the required `INSERT`, `UPDATE`, and `DELETE` policies for the `user-content` bucket.

---

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

Highlights:
- **v3.1.2** — Storage-backed backup restore, `/__auth/backup` auth hardening
- **v3.1.1** — Real cloud backup pipeline (upload + download + import)
- **v3.1.0** — Local server PWA command system, Termux CLI, update checker
- **v2.9.0** — Local software distribution baseline

---

## 🤝 Contributing

Issues and pull requests are welcome. Before submitting:

1. Read [AGENTS.md](./AGENTS.md) — important rules for AI-assisted contributions
2. Do not edit compiled files in `public/assets/` directly — use serve-time patches in `server.mjs`
3. Do not modify Supabase schema, RLS policies, or auth architecture without updating the relevant `.sql` files
4. Run `isotope doctor` after any `server.mjs` change to confirm startup is clean

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">
Built by <a href="https://github.com/Suydev">Suydev</a>
</div>
