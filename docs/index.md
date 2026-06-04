---
layout: default
title: IsotopeAI Self-Hosted
description: Production-ready self-hosted fork of IsotopeAI — AI study planner with realtime community, Supabase backend, and full premium unlock.
---

# IsotopeAI Self-Hosted — Documentation

> **v1.0.0** — Production Release

A fully self-hosted, premium-unlocked fork of [IsotopeAI](https://isotopeai.in). Zero npm dependencies. Supabase backend. Complete community features.

---

## Quick Links

- [Quick Start Guide](https://github.com/Suydev/isotope-code#-quick-start)
- [Database Schema](https://github.com/Suydev/isotope-code#-database-schema)
- [Admin Panel](https://github.com/Suydev/isotope-code#%EF%B8%8F-admin-endpoints)
- [Changelog](https://github.com/Suydev/isotope-code/blob/main/CHANGELOG.md)
- [Full Audit](https://github.com/Suydev/isotope-code/blob/main/AUDIT.md)
- [Agent Reference](https://github.com/Suydev/isotope-code/blob/main/AGENTS.md)

---

## System Status — v1.0.0

| System | Status |
|---|---|
| 20 tables | ✅ All accessible |
| 16 RPC functions | ✅ All operational |
| 4 storage buckets | ✅ RLS policies applied |
| Realtime on 7 tables | ✅ Enabled |
| 18 performance indexes | ✅ Applied |
| Cascade FK constraints | ✅ Applied |
| No hardcoded secrets | ✅ Verified |
| No ENOTFOUND / dummy URLs | ✅ Confirmed |
| Onboarding loop | ✅ Fixed — DB authoritative |
| Auth rate limiting | ✅ 10 req/min/IP |

---

## Features

| Feature | Notes |
|---|---|
| **Ranker plan** for every user | DB trigger + client patches + RLS bypass |
| **Community** — groups, chat, leaderboard | 20 tables, 16 RPCs, realtime |
| **Focus session sync** | `finish_session_sync` RPC |
| **Events** | 16 seeded events, full CRUD admin |
| **Reward store** | 10 items, atomic purchase RPC |
| **Notifications** | Realtime, dedup, auto-cleanup |
| **Presence** | online/studying/offline, auto-expire |
| **Storage** | 4 buckets, RLS, signed URLs |
| **Username auth** | No email required, rate-limited |
| **AI assistant** | Gemini + Groq via env vars |
| **One-click schema** | `/__admin/patch` UI |

---

## Architecture

```
server.mjs (Node.js, zero npm deps)
  ├── In-memory bundle patches (demo=off, plan=ranker, keys)
  ├── Browser fetch interceptors (edge functions → RPCs)
  ├── /__auth/* username-based auth
  ├── /__supa/* reverse proxy (anon/user JWT in normal mode; service role only in admin mode)
  └── /__admin/* admin panel (ADMIN_SECRET protected when admin mode is enabled)
```

---

## Setup in 3 Steps

```bash
# 1. Clone
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code && cp .env.example .env
# Edit .env with your Supabase keys

# 2. Apply schema (one time)
PORT=5000 node server.mjs
# Open http://localhost:5000/__admin/patch → Apply All SQL Now

# 3. Run
PORT=5000 node server.mjs
```

---

## Environment Variables

| Variable | Required | Description |
|---|:---:|---|
| `SUPABASE_URL` | ✅ | `https://your-ref.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | Anon key from Supabase dashboard |
| `ENABLE_ADMIN_MODE` | ☐ | Set `true` only for owner/admin mode |
| `SUPABASE_SERVICE_ROLE_KEY` | admin mode | Server-only service role key |
| `ADMIN_SECRET` | admin mode | Protects `/__admin/*` routes |
| `ADMIN_EMAIL` | ☐ | Optional admin account check |
| `ADMIN_PASSWORD` | ☐ | Optional admin account bootstrap |
| `GEMINI_API_KEY` | ☐ | Google Gemini for AI assistant |
| `GROQ_API_KEY` | ☐ | Groq for AI assistant |
| `PORT` | ☐ | Default: 3000 |

---

*Built with Node.js · Supabase · React (pre-built) · Zero npm dependencies*

*[GitHub Repository](https://github.com/Suydev/isotope-code) · [Releases](https://github.com/Suydev/isotope-code/releases) · MIT License*
