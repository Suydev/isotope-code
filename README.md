<p align="center">
  <img src="https://raw.githubusercontent.com/Suydev/isotope-code/main/screenshots/icon-512.png" alt="IsotopeAI" width="100" />
</p>

<h1 align="center">IsotopeAI</h1>

<p align="center">
  <strong>Self-hosted AI study planner · Focus timer · Analytics · Community</strong><br/>
  For JEE, NEET, CUET, Boards & beyond. Running on your device in under 60 seconds.
</p>

<p align="center">
  <a href="https://github.com/Suydev/isotope-code/stargazers">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/Suydev/isotope-code?style=flat-square&color=8b5cf6&logo=github">
  </a>
  <a href="./CHANGELOG.md">
    <img alt="Version" src="https://img.shields.io/badge/version-3.3.3-8b5cf6?style=flat-square">
  </a>
  <a href="https://nodejs.org">
    <img alt="Node" src="https://img.shields.io/badge/node-18%2B-339933?style=flat-square&logo=node.js&logoColor=white">
  </a>
  <img alt="Platform" src="https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows%20%7C%20Android-lightgrey?style=flat-square">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
  <a href="https://isotopeai.in">
    <img alt="Website" src="https://img.shields.io/badge/website-isotopeai.in-8b5cf6?style=flat-square">
  </a>
</p>

<p align="center">
  <a href="#-quick-start">⚡ Quick Start</a> ·
  <a href="#-features">✨ Features</a> ·
  <a href="#-screenshots">📸 Screenshots</a> ·
  <a href="#%EF%B8%8F-supabase-setup">🗄️ Supabase Setup</a> ·
  <a href="#-contributing">🤝 Contributing</a> ·
  <a href="#-support--donate">❤️ Support</a>
</p>

<br/>

<p align="center">
  <img src="https://raw.githubusercontent.com/Suydev/isotope-code/main/screenshots/landingpage.png" alt="IsotopeAI App" width="100%" style="border-radius:12px"/>
</p>

---

## What is IsotopeAI?

IsotopeAI is a **fully self-hosted, local-first** student productivity platform. You clone it, run one setup command, and get a complete study app running on your own device — with optional Supabase cloud sync for backup, community, and cross-device access.

**No subscription. No SaaS lock-in. Your data stays yours.**

```text
Browser / PWA
    ↓  (localhost:3000)
Local Node.js server  ←  you own and run this
    ↓
Supabase (free tier works)  ←  you own this too
```

> Targeted at JEE / NEET / CUET / Board students who want a serious, distraction-free environment with real analytics — without giving their data to a third party.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Study Engine
- **Focus Timer** — Pomodoro + custom sessions
- **Session Logging** — every minute tracked
- **Daily Stats** — streaks, hours, leaderboard
- **Subject & Chapter Planner**
- **Task Manager** — priority, due dates, subtasks
- **Habit Tracker** — daily consistency scoring

</td>
<td width="50%">

### 📊 Analytics
- Hourly / daily / weekly time breakdowns
- Per-subject & per-chapter distribution
- Exam countdown & prep progress tracker
- Mock test analysis & mistake log
- AI weekly summary cards

</td>
</tr>
<tr>
<td width="50%">

### 👥 Community
- **Study groups** with real-time leaderboards
- **Group chat** — broadcast channel, zero latency
- **Challenges** — group & global goals
- **Invite links** — join any group in one click
- **Live presence** — see who's studying right now

</td>
<td width="50%">

### ☁️ Cloud & Offline
- **Supabase-backed** cloud snapshot & restore
- **PWA** — works offline from service worker cache
- **Local-first** — no internet needed to study
- **CLI** — `isotope start / stop / update / doctor`
- **Termux Widget** — Android home screen shortcuts

</td>
</tr>
</table>

---

## 📸 Screenshots

> The app is local-first — run it yourself to explore all views. Below is a preview of the main interface.

<p align="center">
  <img src="https://raw.githubusercontent.com/Suydev/isotope-code/main/screenshots/landingpage.png" alt="IsotopeAI Dashboard" width="90%"/>
</p>

| Route | What you see |
|---|---|
| `/dashboard` | Daily overview — streak, today's stats, quick-start timer |
| `/focus` | Full-screen Pomodoro with subject + task tracking |
| `/analytics` | Deep-dive charts: hours, subjects, habits, exams |
| `/community` | Groups, global leaderboard, challenges hub |
| `/community/group/:slug` | Group chat, member presence, group leaderboard |
| `/syllabus` | Chapter-by-chapter syllabus with progress bars |
| `/exams` | Exam calendar, mock test tracker, result analysis |
| `/settings` | Profile, cloud sync, preferences |

---

## ⚡ Quick Start

> **Requirements**: Node.js 18+, Git, a free [Supabase](https://supabase.com) project

### 🐧 Linux / macOS / Termux (Android)

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh
```

### 🪟 Windows (CMD)

```bat
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
setup.bat
```

### 🪟 Windows (PowerShell)

```powershell
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
.\install.ps1
```

Setup automatically:
1. Checks Node.js, npm, and Git
2. Creates `.env` and prompts for your Supabase URL + anon key
3. Installs dependencies
4. Installs the global `isotope` CLI
5. Starts the server → open `http://127.0.0.1:3000`

---

## 🔧 CLI Commands

After setup, these work from **any directory**:

```bash
isotope start      # Start the local server
isotope stop       # Stop it
isotope restart    # Restart
isotope update     # Pull latest + install + restart
isotope status     # Is the server running?
isotope doctor     # Check Node, Git, Supabase health
isotope open       # Health check then open browser
isotope logs       # Tail server logs
```

---

## 🔑 Environment Variables

```env
# Required — from your Supabase project dashboard
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional
PORT=3000
ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=    # admin only — never share
ADMIN_SECRET=                 # admin only
ADMIN_EMAIL=                  # admin only
```

> Normal users only need `SUPABASE_URL` and `SUPABASE_ANON_KEY`. **Never commit `.env`.**

---

## 🗄️ Supabase Setup

1. Create a **free** project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run **`isotope-complete.sql`**
3. Done — all 24 tables, RLS policies, triggers, storage buckets, and seed data applied in one shot

```
isotope-complete.sql  ←  single authoritative schema (idempotent, safe to re-run anytime)
```

**Expected storage buckets after setup:**

| Bucket | Purpose |
|---|---|
| `avatars` | Profile pictures |
| `user-content` | Cloud snapshots & backups |
| `notes` | Notes & documents |

---

## 📱 Android / Termux

Run IsotopeAI entirely on your Android phone:

```bash
# Install Termux from F-Droid, then:
pkg install nodejs git
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh

# Add home screen shortcuts
bash setup-termux-widget.sh
```

Creates widget shortcuts for: `start`, `stop`, `restart`, `update`, `open`, `doctor`, `status`, `logs`

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
│                   Supabase (your project)                    │
│   PostgreSQL · Auth · Storage · Realtime · Edge Functions    │
│   24 tables · RLS · Triggers · 3 buckets · 30+ functions    │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
isotope-code/
├── server.mjs              ← Main server (Express 5, ~7000 lines)
├── isotope-complete.sql    ← Master DB schema (run once on fresh Supabase)
├── community-patch-v4.sql  ← Incremental patch reference
├── public/
│   ├── assets/             ← Compiled React app (211 JS chunks)
│   ├── sw.js               ← Service worker (offline + caching)
│   ├── pwa-local.js        ← PWA local-server offline handler
│   └── update-checker.js   ← In-app update banner
├── bin/
│   ├── isotope             ← Linux / macOS / Termux CLI
│   └── isotope.bat         ← Windows CLI
├── setup.sh / setup.bat / install.ps1   ← First-time setup
├── update.sh / update.bat               ← One-command update
├── setup-termux-widget.sh               ← Android home screen shortcuts
├── screenshots/                         ← App screenshots
└── CHANGELOG.md
```

---

## 🔄 Updating

```bash
isotope update
```

Stashes local changes → pulls latest → runs `npm install` if needed → restarts server. Zero data loss.

---

## 🔒 Admin Mode (Optional)

For power users who want diagnostics, DB inspection, and repair tools:

```env
ENABLE_ADMIN_MODE=true
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SECRET=your-local-secret
ADMIN_EMAIL=your@email.com
```

Access: `http://127.0.0.1:3000/__admin/verify`

---

## 🛠️ Troubleshooting

```bash
isotope doctor     # Diagnoses most issues automatically
isotope status     # Is the server actually running?
isotope logs       # Real-time server output
```

| Problem | Fix |
|---|---|
| Global `isotope` command missing | `bash setup.sh --no-start` |
| Port already in use | `isotope stop` or `PORT=3001 isotope start` |
| Cloud sync "Authentication required" | Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env` |
| Storage permission denied | Re-run `isotope-complete.sql` in Supabase SQL Editor |
| App opens but server is down | `isotope start` then `http://127.0.0.1:3000` |
| Termux shortcuts broken | `bash setup-termux-widget.sh` |

---

## 🤝 Contributing

Contributions are welcome — bug fixes, new features, docs, translations, UI polish.

**Before contributing:**
1. Read [AGENTS.md](./AGENTS.md) — AI agent rules and code conventions
2. Do not commit `.env` or secrets
3. Do not weaken RLS policies
4. Update `isotope-complete.sql` if you change the DB schema
5. Prove sync works: browser action → Supabase row → clear cache → login → data restored

```bash
# Fork → clone → branch → PR
git checkout -b fix/your-description
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

---

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full history.

| Version | Highlights |
|---|---|
| **v3.3.3** | Admin role auth bug fix (`user_roles.is_active`), 8 undocumented DB functions added to master schema |
| **v3.3.2** | `user_tours` table, `/__admin/schema` endpoint fixed |
| **v3.3.1** | `isotope-complete.sql` master schema, 4 missing tables applied |
| **v3.3.0** | RLS policies hardened, GitHub Pages docs |
| **v3.2.0** | Leaderboard RLS, SQL index corrections |
| **v3.1.x** | RLS performance, PWA stability fixes, Termux CLI |

---

## ❤️ Support & Donate

IsotopeAI is free, open-source, and built by a student for students. If it helped your prep, consider supporting development.

**UPI (India): `9699393886@fam`**

<p align="center">
  <img src="https://raw.githubusercontent.com/Suydev/isotope-code/main/screenshots/upi-qr.png" alt="UPI Donation QR — 9699393886@fam" width="200" /><br/>
  <em>Scan with GPay · PhonePe · Paytm · BHIM · any UPI app</em>
</p>

Every ₹ goes directly into keeping this project alive and bug-free. 🙏

---

## ⭐ Star History

If IsotopeAI is useful, **please star this repo** — it helps other students discover it!

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
  <a href="https://github.com/Suydev/isotope-code/issues/new?template=bug_report.md">🐛 Report Bug</a>
  ·
  <a href="https://github.com/Suydev/isotope-code/issues/new?template=feature_request.md">💡 Request Feature</a>
</p>

<p align="center">
  <a href="https://github.com/Suydev/isotope-code/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/Suydev/isotope-code?style=social"></a>
  &nbsp;
  <a href="https://github.com/Suydev/isotope-code/fork"><img alt="Forks" src="https://img.shields.io/github/forks/Suydev/isotope-code?style=social"></a>
</p>
