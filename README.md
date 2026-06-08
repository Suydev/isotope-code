<p align="center">
  <img src="https://raw.githubusercontent.com/Suydev/isotope-code/main/screenshots/icon-512.png" alt="IsotopeAI" width="96" />
</p>

<h1 align="center">IsotopeAI</h1>

<p align="center">
  <strong>Local-first AI study planner · Focus timer · Analytics · Community</strong><br/>
  Runs on your own device in under 60 seconds. No subscription. No SaaS lock-in. Your data stays yours.
</p>

<p align="center">
  <a href="https://github.com/Suydev/isotope-code/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/Suydev/isotope-code?style=flat-square&color=8b5cf6&logo=github"></a>
  &nbsp;
  <a href="./CHANGELOG.md"><img alt="Version" src="https://img.shields.io/badge/version-3.3.8-8b5cf6?style=flat-square"></a>
  &nbsp;
  <a href="https://nodejs.org"><img alt="Node" src="https://img.shields.io/badge/node-18%2B-339933?style=flat-square&logo=node.js&logoColor=white"></a>
  &nbsp;
  <img alt="Platform" src="https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows%20%7C%20Android-lightgrey?style=flat-square">
  &nbsp;
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
  <br/>
  <a href="https://isotopeai.in"><img alt="Website" src="https://img.shields.io/badge/website-isotopeai.in-8b5cf6?style=flat-square"></a>
  &nbsp;
  <a href="https://suydev.github.io/isotope-code/"><img alt="Docs" src="https://img.shields.io/badge/docs-GitHub%20Pages-0f9d58?style=flat-square&logo=github"></a>
  &nbsp;
  <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/Suydev/isotope-code/ci.yml?branch=main&style=flat-square&label=CI">
</p>

<p align="center">
  <a href="#-android--termux-one-command">📱 Android</a> ·
  <a href="#-linux--macos">🐧 Linux / macOS</a> ·
  <a href="#-windows">🪟 Windows</a> ·
  <a href="#-supabase-setup">☁️ Supabase</a> ·
  <a href="#-cli-reference">⚡ CLI</a> ·
  <a href="https://suydev.github.io/isotope-code/">📖 Docs</a>
</p>

<br/>

<p align="center">
  <img src="https://raw.githubusercontent.com/Suydev/isotope-code/main/screenshots/landingpage.png" alt="IsotopeAI — local-first study app dashboard" width="100%" style="border-radius:12px"/>
</p>

---

## What is IsotopeAI?

IsotopeAI is a **fully self-hosted, local-first** student productivity platform built for JEE, NEET, CUET, and Board exam students.

You clone it, run one setup command, and a complete study app runs on **your own device** — with Supabase as an optional cloud backend for sync, community, and cross-device access.

```
Browser / PWA
    ↓  localhost:3000
Local Node.js server     ← you own and run this
    ↓
Supabase (free tier)     ← you own this too (optional for sync)
```

**No subscription. No SaaS vendor. No third-party tracking. Your study data stays on your device.**

---

## ⚡ Install

### 📱 Android / Termux — one command

> Install Termux from **[F-Droid](https://f-droid.org/packages/com.termux/)** or **[GitHub](https://github.com/termux/termux-app/releases)** — not the Play Store (unmaintained since 2020).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
```

That's it. One command installs Node.js, Git, IsotopeAI, and creates home-screen widget shortcuts. After first install, tap **isotope-start** on your home screen to launch.

### 🐧 Linux / macOS

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh
```

### 🪟 Windows

**CMD / PowerShell:**
```bat
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
setup.bat
```

**PowerShell (automated):**
```powershell
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
.\install.ps1
```

Setup does exactly this — no hidden steps:
1. Checks Node.js 18+, npm, and Git
2. Creates `.env` from `.env.example` and prompts for Supabase URL + anon key
3. Installs dependencies
4. Installs the global `isotope` CLI command
5. Starts the server → opens `http://127.0.0.1:3000`

> Need Supabase credentials? See [☁️ Supabase Setup](#️-supabase-setup) below — it takes about 5 minutes.

---

## ⚡ CLI Reference

After setup, these work from **any directory**:

```bash
isotope start              # Start the local server (background)
isotope stop               # Stop it
isotope restart            # Stop + start + open
isotope update             # Pull latest + reinstall deps + restart
isotope status             # Show PID, port, version, config
isotope doctor             # Full diagnostic — checks everything
isotope open               # Open in browser (after health check)
isotope logs               # Last 80 server log lines (secrets redacted)
isotope version            # Print installed version
isotope repair             # Re-install deps + reinstall CLI
isotope reinstall-widgets  # Refresh Android home-screen shortcuts
isotope setup              # Re-run setup.sh without starting
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Study Engine
- **Focus Timer** — Pomodoro, custom sessions, session tagging
- **Session Logging** — every minute tracked with subject/task
- **Daily Stats** — streaks, today's hours, subject breakdown
- **Habit Tracker** — daily consistency scoring
- **Task Manager** — priority, due dates, subtasks, filters

</td>
<td width="50%">

### 📊 Analytics
- Hourly / daily / weekly study time breakdowns
- Per-subject and per-chapter distribution charts
- Exam countdown and prep progress tracker
- Mock test result analysis and mistake log
- AI weekly summary cards

</td>
</tr>
<tr>
<td width="50%">

### 👥 Community
- **Study groups** with real-time leaderboards
- **Group chat** — broadcast channel, near-zero latency
- **Challenges** — group and global goal tracking
- **Invite links** — join any group in one click
- **Live presence** — see who's studying right now

</td>
<td width="50%">

### ☁️ Cloud & Offline
- **Supabase-backed** snapshot backup and restore
- **PWA** — works offline from service worker cache
- **Local-first** — study without internet
- **Termux Widget** — Android home screen shortcuts
- **CLI** — full control from terminal

</td>
</tr>
</table>

| Route | What you see |
|---|---|
| `/dashboard` | Daily overview — streak, today's stats, quick-start timer |
| `/focus` | Full-screen Pomodoro with subject + task tracking |
| `/analytics` | Deep-dive charts: hours, subjects, habits, exams |
| `/community` | Groups, global leaderboard, challenges hub |
| `/community/group/:slug` | Group chat, member presence, group leaderboard |
| `/syllabus` | Chapter-by-chapter syllabus with progress bars |
| `/exams` | Exam calendar, mock test tracker, result analysis |
| `/settings` | Profile, cloud sync status, preferences |

---

## 🗄️ Supabase Setup

You need a free Supabase project for auth and cloud sync. The app can run without it for local-only use, but login and community features require it.

**Steps (5 minutes):**

1. Create a **free** project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run **`isotope-complete.sql`** (entire file, one shot)
3. Copy your **Project URL** and **anon/public key** from Project Settings → API
4. Paste them into `.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional
PORT=3000
ENABLE_ADMIN_MODE=false
```

> ⚠️ Never share your `SUPABASE_SERVICE_ROLE_KEY`. Normal users only need the anon key.

**Storage buckets created by the SQL:**

| Bucket | Purpose |
|---|---|
| `avatars` | Profile pictures |
| `user-content` | Cloud snapshots and backups |
| `notes` | Notes and documents |

---

## 📱 Android / Termux — Beginner Guide

**Step 1 — Install Termux (from the right source)**

Install from [F-Droid](https://f-droid.org/packages/com.termux/) or [GitHub Releases](https://github.com/termux/termux-app/releases). The Play Store version is unmaintained and has bugs.

**Step 2 — Install Termux:Widget (same source as Termux)**

[F-Droid](https://f-droid.org/packages/com.termux.widget/) or [GitHub](https://github.com/termux/termux-widget/releases). Mixing sources causes install failures.

**Step 3 — Open Termux and paste this one command**

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
```

This installs everything: Node.js, Git, IsotopeAI, and home-screen widget buttons.

**Step 4 — Add home-screen buttons**

Long press home screen → Widgets → Termux Widget → drag to home screen → choose a shortcut:

| Shortcut | What it does |
|---|---|
| `isotope-start` | Start server + open in browser |
| `isotope-update` | Pull latest version |
| `isotope-open` | Open app in browser |
| `isotope-doctor` | Diagnose any issue |
| `isotope-repair` | Fix broken install |
| `isotope-stop` | Stop server |

See [TERMUX_WIDGET.md](./TERMUX_WIDGET.md) for the full shortcut reference.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   Your Browser / PWA                         │
│        React + Zustand + React Query + Service Worker        │
└───────────────────────┬──────────────────────────────────────┘
                        │ http://localhost:3000
┌───────────────────────▼──────────────────────────────────────┐
│                  Local Node.js Server                        │
│  server.mjs — Express 5 + JWT verification + Supabase proxy  │
│  Routes: /__auth/*  /__admin/*  /api/*  /__supa/*            │
└───────────────────────┬──────────────────────────────────────┘
                        │ REST / Realtime / Storage
┌───────────────────────▼──────────────────────────────────────┐
│           Supabase (your own free project)                   │
│   PostgreSQL · Auth · Storage · Realtime · Edge Functions    │
│   24 tables · RLS · Triggers · 3 buckets · 30+ functions    │
└──────────────────────────────────────────────────────────────┘
```

The Node.js server is the only process running on your device. It proxies auth and database requests to Supabase. There is no cloud server owned by anyone else.

---

## 📁 Project Structure

```
isotope-code/
├── server.mjs                   ← Main server (Express 5)
├── isotope-complete.sql         ← Full DB schema (run once on new Supabase project)
├── public/
│   ├── assets/                  ← Compiled React app (211 JS chunks)
│   ├── sw.js                    ← Service worker (offline + caching)
│   └── pwa-local.js             ← PWA offline handler
├── bin/
│   ├── isotope                  ← Linux / macOS / Termux CLI
│   └── isotope.bat              ← Windows CLI
├── scripts/
│   ├── capture-screenshots.mjs  ← Playwright screenshot capture
│   ├── seed-demo-data.mjs       ← Seed realistic demo data
│   └── validate-docs.mjs        ← Validate docs/README links + image paths
├── setup.sh / setup.bat / install.ps1   ← First-time setup
├── install-termux.sh                    ← One-line Android bootstrap
├── update.sh / update.bat               ← One-command update
├── start.sh / start.bat                 ← Start shortcut
├── doctor.sh / doctor.bat               ← Doctor shortcut
├── setup-termux-widget.sh               ← Android widget shortcuts
├── screenshots/                         ← App screenshots
└── docs/                                ← GitHub Pages source
```

---

## 🔄 Updating

```bash
isotope update
```

Stashes local changes → fetches latest → fast-forward merges → runs `npm install` if dependencies changed → restarts server → refreshes Termux widget shortcuts. Zero data loss.

---

## 🔒 Admin Mode (optional)

For owners who need diagnostics, DB inspection, and repair tools:

```env
ENABLE_ADMIN_MODE=true
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET=your-local-admin-secret
ADMIN_EMAIL=your@email.com
```

Access: `http://127.0.0.1:3000/__admin/verify`

---

## 🛠️ Troubleshooting

```bash
isotope doctor     # Diagnoses most issues automatically
isotope status     # Is the server actually running?
isotope logs       # Real-time server output (secrets redacted)
isotope repair     # Re-install deps + CLI + clear stale state
```

| Problem | Fix |
|---|---|
| `isotope` command not found | `bash setup.sh --no-start` |
| Port already in use | `isotope stop`, or set `PORT=3001` in `.env` |
| Cloud sync "Authentication required" | Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env` |
| Storage permission denied | Re-run `isotope-complete.sql` in Supabase SQL Editor |
| App opens but server is down | `isotope start` then refresh |
| Termux shortcuts broken | `isotope reinstall-widgets` or `bash setup-termux-widget.sh` |
| Termux pkg update fails | `termux-change-repo` then retry |
| Node.js not found on Linux | Re-run `bash setup.sh` — installs Node 22 via NodeSource |

---

## 🤝 Contributing

Contributions are welcome — bug fixes, features, docs, UI polish.

**Before contributing:**
1. Read [AGENTS.md](./AGENTS.md) — AI agent conventions
2. Never commit `.env` or secrets
3. Never weaken RLS policies
4. Update `isotope-complete.sql` for any DB schema changes
5. Prove sync works: browser action → Supabase row → clear cache → login → data restored

```bash
git checkout -b fix/your-description
# PR against main
```

---

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full history.

| Version | Highlights |
|---|---|
| **v3.3.8** | Hardened setup.sh, complete CLI overhaul (repair/version/reinstall-widgets), one-line Termux install, background widget shortcuts, CI rewrite |
| **v3.3.7** | Auth-gated sync state machine — infinite retry on auth failure fixed |
| **v3.3.6** | Cloud sync download on new device fixed · Storage cleanup |
| **v3.3.5** | Sync items table, metadata columns, Supabase schema migration |
| **v3.3.3** | Admin role auth bug fix, 8 undocumented DB functions added to master schema |
| **v3.3.0** | RLS policies hardened, GitHub Pages docs |

---

## ❤️ Support

IsotopeAI is free, open-source, and built by a student for students.

**UPI (India): `9699393886@fam`**

<p align="center">
  <img src="https://raw.githubusercontent.com/Suydev/isotope-code/main/screenshots/upi-qr.png" alt="UPI Donation QR — 9699393886@fam" width="180" /><br/>
  <em>Scan with GPay · PhonePe · Paytm · BHIM · any UPI app</em>
</p>

---

## ⭐ Star History

If IsotopeAI is useful, **star this repo** — it helps other students find it.

[![Star History Chart](https://api.star-history.com/svg?repos=Suydev/isotope-code&type=Date)](https://star-history.com/#Suydev/isotope-code&Date)

---

## 📄 License

[MIT](./LICENSE) — free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Suydev">Suydev</a>
  ·
  <a href="https://isotopeai.in">isotopeai.in</a>
  ·
  <a href="https://suydev.github.io/isotope-code/">📖 Docs</a>
  ·
  <a href="https://github.com/Suydev/isotope-code/issues/new?template=bug_report.md">🐛 Report Bug</a>
  ·
  <a href="https://github.com/Suydev/isotope-code/issues/new?template=feature_request.md">💡 Request Feature</a>
</p>

<p align="center">
  <a href="https://github.com/Suydev/isotope-code/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/Suydev/isotope-code?style=social"></a>
  &nbsp;
  <a href="https://github.com/Suydev/isotope-code/fork"><img alt="Forks" src="https://img.shields.io/github/forks/Suydev/isotope-code?style=social"></a>
</p>
