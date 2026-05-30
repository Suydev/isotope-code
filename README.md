<div align="center">
  <img src="public/icons/icon.svg" width="80" alt="IsotopeAI Logo" />
  <h1>IsotopeAI — Self-Hosted</h1>
  <p><strong>AI-powered study planner, focus timer, analytics & community for students</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-20+-green?logo=node.js" />
    <img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase" />
    <img src="https://img.shields.io/badge/license-MIT-blue" />
    <img src="https://img.shields.io/badge/platform-Linux%20%7C%20Mac%20%7C%20Windows%20%7C%20Android-lightgrey" />
  </p>
</div>

---

## What is this?

This is a **fully self-hosted, premium-unlocked fork** of [IsotopeAI](https://isotopeai.in) — an AI-powered productivity app for students preparing for JEE, NEET, UPSC, SAT, boards, and more.

### What's unlocked vs the original:
| Feature | Original | This fork |
|---------|----------|-----------|
| Focus timer & analytics | ✅ | ✅ |
| AI study planner | ✅ Free tier | ✅ **Ranker tier (max)** |
| Community & study groups | ✅ Premium only | ✅ **Fully open** |
| Demo mode | Restricted | ✅ **Disabled** |
| Onboarding | All 6 steps | ✅ **Fixed — no skip bug** |
| Your own database | ❌ | ✅ **Optional — full control** |
| AI keys | Locked | ✅ **Bring your own (Gemini/Groq)** |

---

## Quick Start

### Prerequisites
- **Node.js v18+** — [nodejs.org](https://nodejs.org)
- A free **Supabase** account (optional but recommended) — [supabase.com](https://supabase.com)

### 1. Clone & install
```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
npm install
```

### 2. Configure (optional but recommended)
```bash
cp .env.example .env
# Edit .env with your keys — see Configuration section below
```

### 3. Start
```bash
# Linux / macOS
bash scripts/start-linux.sh

# OR directly
node server.mjs
```

Open **http://localhost:3000** in your browser.

---

## Platform-specific Launchers

| Platform | Script |
|----------|--------|
| Linux / Ubuntu | `bash scripts/start-linux.sh` |
| macOS | `bash scripts/start-mac.sh` (auto-opens browser) |
| Windows | `scripts\start-windows.bat` (double-click) |
| Android (Termux) | `bash scripts/start-android.sh` |
| Docker | `docker compose up` |

---

## Configuration

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=3000

# Your own Supabase project (recommended — you own the data)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Full RLS bypass for community features

# AI features (optional — free keys available)
GEMINI_API_KEY=       # https://aistudio.google.com/apikey
GROQ_API_KEY=         # https://console.groq.com/keys
```

### Getting your Supabase keys

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `isotope-schema.sql` in the **SQL Editor**
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

> Without a custom Supabase project, the app uses the original IsotopeAI database (read-only community features, limited RLS).

---

## Docker

```bash
# Build and run
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

The container runs on port `3000` by default (configurable via `PORT` in `.env`).

---

## Database Schema

`isotope-schema.sql` contains the complete PostgreSQL schema:

- 16 tables: users, profiles, study sessions, community groups, challenges, leaderboard, store
- 4 RPC functions: membership snapshot, premium check, invite system, group analytics
- Row-level security policies for all tables
- Auto-trigger: new users get **Scholar tier** automatically on your instance

---

## Architecture

```
isotope-code/
├── server.mjs              # Node.js HTTP server — all patches applied here
├── index.html              # App entry point (scripts injected server-side)
├── public/
│   ├── assets/             # All JS/CSS bundles (Vite-built)
│   │   ├── App-pJGjDiPw.js       # Main app bundle (patched at runtime)
│   │   ├── Onboarding-qvAqCBbb.js # Onboarding flow (patched directly)
│   │   ├── useAIStore-B2cv1FZz.js # AI store (AI key injection)
│   │   ├── Focus-BmgY-9vP.js     # Focus timer (PiP polyfill added)
│   │   └── ...
│   └── icons/              # App icons
├── scripts/                # Platform launchers
├── isotope-schema.sql      # Complete DB schema
├── Dockerfile              # Container image
├── docker-compose.yml      # Docker Compose config
└── .env.example            # Configuration template
```

### How the server patches work

`server.mjs` is a pure Node.js HTTP server that:
1. **Serves static files** from `public/` with correct MIME types
2. **Injects client-side scripts** into every HTML response (premium bypass, AI keys, OAuth origin fix)
3. **Patches JS bundles at runtime** (in-memory, original files unchanged):
   - Disables demo mode
   - Forces `planType: "ranker"` in all app state
   - Replaces hardcoded Supabase URL/key when custom project is configured
4. **Proxies Supabase requests** at `/__supa/*` — uses `service_role` key if set (full RLS bypass)
5. **Falls back to SPA** for all unknown routes

---

## Mods & Patches Applied

See [`AUDIT.md`](AUDIT.md) for the full technical audit of every modification.

### Summary:
- **Demo mode** — disabled (always returns `false`)
- **Plan tier** — `planType` forced to `"ranker"` throughout the app
- **Community RLS** — profile upgraded to `scholar` in Supabase DB via user JWT; service_role key gives full bypass
- **Onboarding** — fixed redirect bug that caused steps 3–6 to auto-skip when a returning user's Supabase profile loaded mid-flow
- **AI store** — patched to support `window.__IK__` injection for custom API keys
- **Focus timer** — PiP polyfill for Android + corrected blob/data URL handling
- **Service worker** — cache bypass headers to prevent stale bundles

---

## Self-Hosting vs Original

This fork connects to the **same Supabase auth backend** as IsotopeAI unless you configure your own. That means:
- Existing isotopeai.in accounts work on this instance
- Your account data (focus sessions, subjects, analytics) is shared
- For full isolation, set up your own Supabase project using `isotope-schema.sql`

---

## Credits

Original app: **IsotopeAI** by the IsotopeAI team — [isotopeai.in](https://isotopeai.in)  
This fork: Self-hosting + premium unlock modifications  
Database schema: Reverse-engineered from the original app bundles

---

## License

This repository contains modifications and configuration for self-hosting only. The original IsotopeAI application code and assets remain the property of the IsotopeAI team.
