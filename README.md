# isotopeAIcode

A fully offline-capable self-hosted build of **IsotopeAI** — an AI-powered study planner for JEE / NEET / competitive exam students. All data lives locally in your browser (IndexedDB). No login, no cloud account, no subscription required.

> **This release fixes 60 missing JavaScript files** that caused violent page reloads and infinite loading on the Analytics tab in the original repo.

---

## Features

| Feature | Offline | Notes |
|---|---|---|
| Dashboard | ✅ | Tasks, deadlines, streak, analytics overview |
| Focus Timer | ✅ | Pomodoro + Stopwatch with session logging |
| Tasks | ✅ | Priority board, Eisenhower matrix, Zen view |
| Chapters / Syllabus | ✅ | Subject → Chapter → Topic progress |
| Exams | ✅ | Scheduling, countdown, result logging |
| Analytics | ✅ | Heat-maps, productivity scores, session breakdowns |
| Community | 🌐 | Needs internet for live group features |
| AI Assistant | 🌐 | Gemini / Groq (online only, free tiers available) |

---

## Quick Start

### Requirements
- **Node.js 18 or newer** — download from https://nodejs.org

### 1 — Download

Download **isotopeAIcode.zip** from the [Releases page](../../releases/latest) and extract it.

### 2 — Start the server

```bash
node server.mjs
```

Open **http://localhost:3000** in Chrome or Edge.

### 3 — Change port (optional)

```bash
PORT=8080 node server.mjs
```

### 4 — Install as an app (optional)

- **Android:** Chrome → ⋮ → Add to Home Screen
- **Desktop:** Chrome → address bar → Install icon

---

## Running on Android (Termux)

```bash
# First time only
pkg install nodejs

# Every time
cd isotopeAIcode
node server.mjs
```

Open Chrome → `http://localhost:3000`

Keep Termux alive: swipe left → **Acquire Wakelock**

---

## Configuring AI (Gemini & Groq)

AI features are **online-only by design** — they are automatically disabled when your device has no internet connection.

### Get free API keys

| Provider | Link | Free tier |
|---|---|---|
| Google Gemini | https://aistudio.google.com/apikey | ✅ Yes |
| Groq | https://console.groq.com/keys | ✅ Yes |

### Option A — Environment variable (recommended)

**Linux / macOS / Termux**
```bash
GEMINI_API_KEY=your_key GROQ_API_KEY=your_key node server.mjs
```

**Windows (Command Prompt)**
```cmd
set GEMINI_API_KEY=your_key
set GROQ_API_KEY=your_key
node server.mjs
```

**Windows (PowerShell)**
```powershell
$env:GEMINI_API_KEY="your_key"
$env:GROQ_API_KEY="your_key"
node server.mjs
```

The server startup log confirms success:
```
✓ Gemini API key configured
✓ Groq API key configured
```

### Option B — `.env` file (Node.js 20.6+ only, no extra install)

Create a file called `.env` next to `server.mjs`:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
```

Start with:
```bash
node --env-file=.env server.mjs
```

### Option C — In-app settings

Go to **Settings → AI Features → AI Assistant** and paste your key directly. Keys are encrypted and stored in your browser only.

---

## Troubleshooting

### ❌ Page reloads violently when clicking Analytics or Add Exam

A JavaScript chunk file was missing. This release includes all 148 required `.js` files — re-download from the [Releases page](../../releases/latest).

If the issue persists: open DevTools (F12) → Console → look for:
```
Failed to fetch dynamically imported module: .../assets/XYZ.js
```
Note the filename and open an issue.

---

### ❌ Analytics shows "Loading analytics..." forever

The analytics web worker is missing from `public/assets/`.

Verify it exists:
```bash
ls public/assets/analyticsWorker-BnmTlfYB.js
```

If missing, re-download the release zip — it includes this file.

---

### ❌ AI features not working

1. Check the server log for `✓ Gemini/Groq API key configured`
2. Make sure your device is **online** (AI is disabled offline by design)
3. Open DevTools → Network → look for requests to `generativelanguage.googleapis.com` or `api.groq.com`
   - `401` → wrong key
   - `429` → free-tier rate limit hit, wait a minute
4. Try **Settings → AI Features → Validate key**

---

### ❌ Blank white screen on load

- Hard-refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
- Make sure you are on `http://` not `https://`
- Check DevTools Console for red errors

---

### ❌ "Port already in use" error

```
Error: listen EADDRINUSE :::3000
```

Use a different port:
```bash
PORT=4000 node server.mjs
```
Then open `http://localhost:4000`

---

### ❌ Node.js version error

Check your version:
```bash
node --version
```

Must be **v18 or newer**. Download from https://nodejs.org (choose LTS).

---

### ❌ Data disappeared

Browser storage (IndexedDB) is tied to the exact origin (`http://localhost:3000`). Clearing browser data or changing the port will make the app appear empty.

**Prevention:** Export your data regularly — **Settings → Account → Export Data**

**Recovery:** If you have a backup file — **Settings → Account → Import Data**

---

## File Structure

```
isotopeAIcode/
├── server.mjs          ← Node.js server (no npm install needed)
├── index.html          ← App shell
├── README.md
├── start.sh            ← Quick-start script (Linux/Mac/Termux)
├── setup-termux.sh     ← First-time Termux setup
└── public/
    ├── assets/         ← 148 JS/CSS/font chunks (all required)
    ├── sw.js           ← Service worker (offline caching)
    ├── boot-recovery.js
    └── manifest.json
```

---

## What Was Fixed

The original repo was missing **60 JavaScript files** that the app lazy-loads when navigating:

| Problem | Root cause | Fix |
|---|---|---|
| Violent page reload on Analytics / Exams / Community | 59 missing JS chunk files triggered `boot-recovery.js` → `window.location.replace()` | Downloaded all 59 chunks from live site |
| Analytics tab stuck on "Loading analytics..." | Missing `analyticsWorker-BnmTlfYB.js` web worker | Downloaded and added the file |

**Server improvements added:**
- Gemini & Groq API key injection via environment variables (no code change needed)
- Online-only AI enforcement via JavaScript `Proxy`
- `/api/ai-config` health endpoint
- Proper SPA HTML injection for all routes

---

## Credits

IsotopeAI is built by the IsotopeAI team. This is a self-hosted build for personal / offline use.  
All original rights belong to IsotopeAI (https://isotopeai.in).
