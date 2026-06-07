---
title: IsotopeAI — Self-Hosted Study App
description: A downloadable, local-first student productivity app with cloud sync via Supabase.
---

# IsotopeAI

**A self-hosted, local-first student productivity app with Supabase cloud sync.**

Run the app on your own device and open it in any browser. Supabase provides auth, database, storage, and realtime sync — no VPS required.

> 📖 **Documentation:** [suydev.github.io/isotope-code](https://suydev.github.io/isotope-code/)
> 💾 **Repository:** [github.com/Suydev/isotope-code](https://github.com/Suydev/isotope-code)

---

## Quick Start

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

Open the app at:

```
http://127.0.0.1:3000
```

Normal users only need:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## Features

| Area | Features |
|---|---|
| Study | Focus timer, session log, daily stats, streaks |
| Planner | Subjects, tasks, habits, exam calendar |
| Analytics | Study breakdowns, subject insights, progress views |
| Community | Groups, chat, challenges, leaderboard |
| AI | Study assistant, summaries, analysis cards |
| Cloud Sync | Supabase-backed snapshot backup and restore |
| Offline | PWA shell works from cache when server is off |
| CLI | `isotope start`, `update`, `doctor`, `logs` |
| Android | Termux Widget shortcuts for start/update/open |

---

## Commands

After setup, these work from any directory:

```bash
isotope start      # Start the local server
isotope stop       # Stop the server
isotope restart    # Restart the server
isotope update     # Pull latest + install deps + restart
isotope status     # Show server state
isotope doctor     # Check Node, Git, PATH, Supabase health
isotope open       # Open in browser (after health check)
isotope logs       # Tail server logs
```

---

## Cloud Sync

Cloud sync is Supabase-backed and requires a free Supabase project.

The sync chain is:

```
Browser action
  → Supabase DB / Storage change
  → Cache cleared
  → Login again
  → Data restored from Supabase
```

Run the SQL patches in the Supabase SQL Editor:

1. `community-patch-v4.sql` — full schema, RLS, storage buckets
2. `performance-patch.sql` — covering indexes and RLS performance hardening (§5 own-row + §6 leaderboard policies)

---

## Architecture

```
Browser / PWA
    ↓
127.0.0.1:3000
    ↓
Local Node.js server (server.mjs)
    ↓
Supabase Auth + Database + Storage + Realtime
```

Supabase is not the public website host. It is the cloud backend only.

---

## Supabase Setup

Expected buckets:

| Bucket | Purpose |
|---|---|
| `avatars` | Profile images |
| `user-content` | Cloud snapshots and user files |
| `notes` | Notes/documents |

---

## Changelog

### v3.3.0 — 2026-06-07

- **§5+§6 RLS policies applied to live DB** — Own-row RLS optimisation (§5) and leaderboard public-read policies (§6) from `performance-patch.sql` are now applied to the live Supabase project. Leaderboard queries work correctly for authenticated users.
- **GitHub Pages docs link** — A "📖 Docs" badge floats in the bottom-right corner of every app page (including the login screen) linking to this documentation site.
- **Improved login error messages** — Login failures now distinguish between invalid credentials, unconfirmed email, and other Supabase auth errors instead of showing a generic message.
- **README updated** — Logo links to GitHub Pages, version badge updated to 3.3.0, Docs badge and link added.

### v3.2.0 — 2026-06-07

- Leaderboard RLS fix — users now see real rankings
- SQL index column correction (`seconds_studied`)
- `_handleLeaderboard` passes user JWT for authenticated queries

### v3.1.3

- Supabase RLS performance hardening
- PWA polling fix
- `.env.example`, `update.bat`, professional release

### v3.1.2-patch

- Critical PWA stability fixes (cache SHA, timer leaks, update logic)

### v3.1.2

- Storage-backed backup restore and `/__auth/backup` auth hardening

### v3.1.1

- Real cloud backup pipeline

### v3.1.0

- Local server PWA command system and Termux CLI

---

## Links

- [GitHub Repository](https://github.com/Suydev/isotope-code)
- [README](https://github.com/Suydev/isotope-code/blob/main/README.md)
- [Changelog](https://github.com/Suydev/isotope-code/blob/main/CHANGELOG.md)
- [AGENTS.md](https://github.com/Suydev/isotope-code/blob/main/AGENTS.md)
- [TERMUX_WIDGET.md](https://github.com/Suydev/isotope-code/blob/main/TERMUX_WIDGET.md)

---

## License

MIT. See [LICENSE](https://github.com/Suydev/isotope-code/blob/main/LICENSE).

---

*Built by [Suydev](https://github.com/Suydev) — v3.3.0 — [📖 Docs](https://suydev.github.io/isotope-code/)*
