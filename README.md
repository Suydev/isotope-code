<div align="center">

<img src="https://github.com/Suydev/isotope-code/blob/main/logo.svg" alt="IsotopeAI." width="80" height="80" />

# IsotopeAI — Self-Hosted

**A fully self-hosted, production-ready fork of [IsotopeAI](https://isotopeai.in)**

AI study planner · Focus timer · Realtime community · Analytics · Leaderboard · Gamification

[![Version](https://img.shields.io/badge/version-2.0.0-6366f1?style=flat-square)](https://github.com/Suydev/isotope-code/releases/tag/v1.0.0)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/supabase-postgresql-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/status-production--ready-brightgreen?style=flat-square)](https://github.com/Suydev/isotope-code/releases)

[Quick Start](#-quick-start) · [Architecture](#-architecture) · [Database](#-database-schema) · [Admin Panel](#%EF%B8%8F-admin-endpoints) · [Deploy](#-deploying) · [Changelog](CHANGELOG.md)

</div>

---

## ✨ What's Included

| Feature | Status | Details |
|---------|--------|---------|
| **Ranker plan** for every user | ✅ | DB trigger + client response normalization |
| **Community** — groups, chat, leaderboard | ✅ | 20+ tables · canonical RPCs · realtime |
| **Focus session sync** | ✅ | `finish_session_sync` RPC — writes to DB automatically |
| **Events system** | ✅ | RSVP, chat, reactions, threads, resources, analytics, presence, recordings, reminders, discovery |
| **Reward store** | ✅ | 10 items seeded · atomic purchase RPC |
| **Invite system** | ✅ | Token-based · `accept_invite` returns `{success:}` |
| **Notifications** | ✅ | Realtime · dedup constraints · auto-cleanup |
| **Presence system** | ✅ | online / studying / offline · auto-expire after 2 min |
| **Username auth** | ✅ | Rate-limited · normal mode uses anon/user auth |
| **AI assistant** | ✅ | Gemini + Groq — inject key via `.env` |
| **Storage** | ✅ | 4 buckets · RLS policies · signed URL support |
| **One-click schema apply** | ✅ | `/__admin/patch` via Supabase Management API |
| **Demo mode** | ✅ Disabled | Production routes use real Supabase data only |
| **Circuit breaker bug** | ✅ Fixed | No more 5-minute session lockouts |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (`node --version`)
- A **[Supabase](https://supabase.com)** project (free tier works)

### 1 — Clone & configure

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
cp .env.example .env
```

Edit `.env` with your Supabase credentials (find them at **Supabase → Project Settings → API**):

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=

# Optional owner/admin mode only. Leave blank for normal users.
ENABLE_ADMIN_MODE=false
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
ADMIN_EMAIL=
ADMIN_EMAILS=
SUPABASE_ACCESS_TOKEN=
GITHUB_PAT=
```

### 2 — Apply the database schema

**Option A — Manual (normal users):**

Open your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new), run `community-patch-v4.sql`, then run `events-expansion.sql`.

**Option B — One-click (owner/admin mode only):**

1. Start the server: `PORT=5000 node server.mjs`
2. Set `ENABLE_ADMIN_MODE=true`, `SUPABASE_SERVICE_ROLE_KEY`, and optionally `ADMIN_SECRET`, `ADMIN_EMAIL`/`ADMIN_EMAILS`, and `SUPABASE_ACCESS_TOKEN` in your private `.env`
3. Open `http://localhost:5000/__admin/patch`
4. Click **🚀 Apply All SQL Now**

### 3 — Start the server

```bash
PORT=5000 node server.mjs
# IsotopeAI running on http://localhost:5000
```

Sign up at `http://localhost:5000` with a username and password. All accounts get **Ranker** tier automatically.

---

## 🏗 Architecture

```
Browser
  └── restore-and-launch.js   ← DB-authoritative session + onboarding check
      └── React SPA (pre-built, 154 bundles in public/assets/)
              │
              ├── Direct → Supabase REST API  (anon key + user JWT)
              └── Via /__supa/* proxy         (anon/user JWT in normal mode)

server.mjs  (Node.js 18+, zero npm dependencies)
  ├── Bundle patches (in-memory, originals untouched on disk)
  │     ├── App-pJGjDiPw.js   — demo=off, plan=ranker, Supabase URL/anon placeholders
  │     ├── Focus-*.js        — circuit breaker=off, PiP polyfill
  │     ├── Auth-*.js         — removes unregistered Google OAuth button
  │     ├── useAIStore-*.js   — injects Gemini/Groq keys from env
  │     └── useInvites-*.js   — fixes invite token param name
  ├── Browser fetch interceptors (injected into every HTML page)
  │     ├── finish-session edge function → finish_session_sync RPC
  │     ├── get-leaderboard edge function → user_stats_summary REST
  │     └── plan_type/billing_status → always "ranker"/"active"
  ├── /__auth/signup + /__auth/login   (username-based, rate-limited)
  ├── /__auth/profile                  (deep-merge profile to Supabase)
  ├── /__supa/* reverse proxy          (service role only when admin mode is enabled)
  └── /__admin/* admin panel           (disabled unless ENABLE_ADMIN_MODE=true)
```

### Key design decisions

| Decision | Reason |
|---|---|
| Bundles patched in-memory | Originals never modified on disk; future updates are clean |
| service_role key remains server-side | Admin/proxy operations can use elevated access without exposing secrets to browsers |
| Missing edge functions intercepted in browser | Supabase Edge Functions not deployed; fetch intercept forwards to real RPCs |
| DB is the onboarding authority | `restore-and-launch.js` reads `user_onboarding`/`user_profiles` before routing; localStorage cannot bypass completion state |
| `_is_group_member()` SECURITY DEFINER helper | Breaks RLS infinite recursion on all 6 group tables |
| All creds via env vars; hard-fail startup | Server exits immediately if any required key is missing |

---

## 🗄 Database Schema

**38 tables · 20+ RPCs · RLS on every table · 40+ indexes · cascade delete constraints**

### Tables

| Table | Purpose |
|-------|---------|
| `users` | Primary record — username, plan_type, coins, gems |
| `user_profiles` | Onboarding JSONB (`isOnboarded`, academic info, preferences) |
| `user_points` | Gamification — current + lifetime points |
| `user_stats_summary` | Aggregate stats — hours, streaks, session count |
| `daily_user_stats` | Per-day study seconds for calendar heatmap |
| `study_sessions_log` | Individual session history |
| `store_items` | Cosmetic shop catalog (10 items seeded) |
| `user_inventory` | Items owned per user |
| `groups` | Community study groups with full-text search (`fts`) |
| `group_members` | Membership + roles (owner / admin / member) |
| `group_chat_messages` | Realtime group chat with threading + soft-delete |
| `group_challenges` | Timed study challenges within groups |
| `group_challenge_participants` | Per-user challenge progress |
| `group_announcements` | Pinned group announcements |
| `group_invites` | Invite link tokens — usage limits + expiry |
| `group_milestones` | Group achievement badges |
| `notifications` | In-app notification feed (realtime) |
| `user_presence` | Online status — online / studying / offline |
| `community_events` | Public events (16 seeded with future dates) |
| `community_event_attendees` | Event attendance |

### RPC Functions

| Function | Params | Description |
|----------|--------|-------------|
| `get_leaderboard` | `p_period, p_limit, p_offset` | Global rankings by period |
| `get_group_leaderboard` | `p_group_id, p_limit` | Per-group rankings |
| `get_invite_details` | `p_code` | Resolve invite token → group info |
| `accept_invite` | `p_code` | Join group via invite token (returns `{success:}`) |
| `is_premium_user` | `uid` | Always returns `true` (all users are premium) |
| `get_membership_snapshot` | `p_user_id` or `target_user_id` | Plan + billing status for a user |
| `get_group_analytics_from_snapshots` | `p_group_id, p_days` | Daily study totals for group |
| `finish_session_sync` | `p_session_id, p_duration_minutes, p_group_id, ...` | Write completed session + update stats |
| `join_community_event` | `p_event_id` | Idempotent RSVP; increments attendee_count |
| `leave_community_event` | `p_event_id` | Remove RSVP; decrements attendee_count |
| `create_community_event` | title, type, dates, … | Admin-only event creation |
| `update_community_event` | `p_id`, partial fields | COALESCE-style partial update |
| `delete_community_event` | `p_id` | Delete event + cascade attendees |
| `get_event_attendees` | `p_event_id` | Returns user_id, username, name, joined_at |
| `purchase_store_item` | `p_user_id, p_item_id` | Atomic purchase — checks coins, deducts, inserts inventory |
| `expire_stale_presence` | — | Marks users offline after 2-min inactivity |

### Realtime tables

`group_chat_messages`, `user_presence`, `notifications`, `community_events`, `community_event_attendees`, `event_messages`, `event_presence`, `groups`, `group_members`

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `SUPABASE_URL` | ✅ | `https://your-ref.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | Anon/public key from Supabase API settings |
| `ENABLE_ADMIN_MODE` | ☐ | Enables owner/admin tools when set to `true` |
| `SUPABASE_SERVICE_ROLE_KEY` | admin mode | Server-only service role key for owner/admin tools |
| `ADMIN_SECRET` | ☐ | Optional local admin unlock secret |
| `ADMIN_EMAIL` | ☐ | Optional Supabase admin email for browser unlock |
| `ADMIN_EMAILS` | ☐ | Optional comma-separated admin email allowlist |
| `ADMIN_PASSWORD` | ☐ | Optional admin account bootstrap |
| `PORT` | ☐ | Server port (default: `5000`) |
| `GEMINI_API_KEY` | ☐ | Google Gemini key for AI assistant |
| `GROQ_API_KEY` | ☐ | Groq key for AI assistant (faster inference) |
| `SUPABASE_ACCESS_TOKEN` | admin mode | Optional Supabase PAT for SQL apply through `/__admin/patch` |
| `GITHUB_PAT` | ☐ | Optional private GitHub automation token |
| `SESSION_SECRET` | ☐ | Session signing secret (generate: `openssl rand -hex 32`) |

Get your Supabase keys at: **[Supabase → Project Settings → API](https://supabase.com/dashboard/project/_/settings/api)**

---

## 🛠️ Admin Endpoints

All `/__admin/*` endpoints are disabled unless `ENABLE_ADMIN_MODE=true` and `SUPABASE_SERVICE_ROLE_KEY` are set. Unlock admin pages with `ADMIN_SECRET`, a configured Supabase admin email, or an active admin role in `user_roles`.

| Endpoint | Method | Description |
|----------|:------:|-------------|
| `/__admin/patch` | GET | One-click schema apply UI |
| `/__admin/patch.sql` | GET | Download `community-patch-v4.sql` |
| `/__admin/schema` | GET | Download base schema SQL |
| `/__admin/verify` | GET | 85-point diagnostic test suite |
| `/__admin/events` | GET | Community events management UI |
| `/__admin/events.json` | GET | JSON list of all events |
| `/__admin/events/create` | POST | Create event |
| `/__admin/events/update` | POST | Update event fields |
| `/__admin/events/delete` | POST | Delete event + cascade |
| `/__admin/events/publish` | POST | Toggle `is_active` |
| `/__admin/events/refresh-dates` | POST | Push past events to future |
| `/__admin/apply-sql` | POST | Run arbitrary SQL via Management API |
| `/__auth/signup` | POST | `{username, password}` → new account |
| `/__auth/login` | POST | `{username, password}` → session |
| `/__auth/profile` | POST/PATCH | Deep-merge profile to Supabase |
| `/__supa/*` | ANY | Supabase proxy (service_role remains server-side) |
| `/api/health` | GET | `{status, aiKeys, supabaseProxy}` |
| `/api/version` | GET | Deployed commit SHA |
| `/api/check-update` | GET | Compare deployed vs latest GitHub |

---

## 📦 Repository Structure

```
isotope-code/
├── server.mjs                  # Entire backend — patches, proxy, auth, admin
├── index.html                  # SPA entry point
├── community-patch-v4.sql      # Complete community schema (idempotent, v4–v7)
├── isotope-schema.sql          # Base DB schema
├── .env.example                # Environment variable template
├── README.md                   # This file
├── CHANGELOG.md                # Full version history
├── AUDIT.md                    # Detailed modification audit
├── AGENTS.md                   # AI agent reference (tables, RPCs, gotchas)
├── ADMIN.md                    # Admin panel operations reference
├── public/
│   ├── restore-and-launch.js   # Client bootstrap + DB-authoritative routing
│   └── assets/                 # Pre-built React bundles (154 files — do NOT rebuild)
└── docs/
    └── index.md                # GitHub Pages documentation
```

---

## 🚢 Deploying

### Self-hosted VPS / Linux

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
cp .env.example .env
# Edit .env with your credentials
PORT=5000 node server.mjs

# With PM2 (production process manager)
pm2 start server.mjs --name isotope -- --env production
pm2 save && pm2 startup
```

### Docker

```bash
docker build -t isotope .
docker run -p 5000:5000 --env-file .env isotope
```

### Post-deploy checklist
- [ ] Admin mode disabled for normal users, or protected with `ADMIN_SECRET`, allowed Supabase admin email, or `user_roles`
- [ ] `ADMIN_PASSWORD` changed from default
- [ ] Visit `/__admin/patch` and apply schema (one time)
- [ ] Visit `/__admin/verify` — all checks should pass
- [ ] Add your domain to Supabase Auth → URL Configuration

---

## 🔒 Security Notes

| Topic | Notes |
|-------|-------|
| **Secrets** | Never commit `.env`. All keys via env vars only. Server hard-fails if keys are missing. |
| **service_role key** | Server-side only. Never inject or commit this credential. |
| **Admin routes** | Disabled by default. Enable only with `ENABLE_ADMIN_MODE=true` and server-side service-role key; unlock with `ADMIN_SECRET`, allowed Supabase admin email, or `user_roles`. |
| **Anon key** | The anon key in source is intentionally public (also present in original app bundle). RLS policies protect the data. |
| **Auth** | JWT-based sessions. Passwords hashed by Supabase Auth. No plaintext storage. |

---

## 📄 License

MIT © [Suydev](https://github.com/Suydev)

---

<div align="center">
Built with Node.js · Supabase · React (pre-built) · Zero npm dependencies

<!-- Not affiliated with or sponsored by any hosting provider. Self-hosted by design. -->
</div>
