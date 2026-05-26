# IsotopeAI — Offline / Termux Edition

Your full IsotopeAI app running locally on your Android device via Termux.  
**Zero internet required after setup. Zero npm install needed.**

---

## Quick Start (Termux)

### Step 1 — Install Termux
Download **Termux** from [F-Droid](https://f-droid.org/packages/com.termux/) (recommended, not Play Store).

### Step 2 — Run setup (first time only)
```bash
bash setup-termux.sh
```
This installs Node.js. Takes ~1 minute.

### Step 3 — Start the app
```bash
bash start.sh
```

### Step 4 — Open in Chrome
Open **Chrome** on your Android and go to:
```
http://localhost:3000
```

### Step 5 — Install as APK-like app (optional)
1. In Chrome, tap **⋮** (three dots, top right)
2. Tap **"Add to Home Screen"**
3. Tap **"Add"**
4. IsotopeAI now appears on your home screen and launches full-screen like a real APK

---

## What works offline

| Feature | Offline | Notes |
|---------|---------|-------|
| Dashboard | ✓ | Full stats, activity |
| Focus Timer | ✓ | Pomodoro & deep work |
| Tasks | ✓ | Full CRUD |
| Study / Syllabus | ✓ | Subjects & topics |
| Exams | ✓ | Countdown timers |
| AI Assistant | ✓* | Needs Gemini key for full AI |
| Community | ✓* | Needs internet for live community |

*AI still works offline with built-in smart responses. Add a free Gemini API key in Settings for full AI.

---

## Get a free Gemini API key (for full AI)

1. Go to [aistudio.google.com](https://aistudio.google.com) on any browser
2. Sign in with Google → click **"Get API Key"**
3. Copy the key
4. In the app → **Settings** → paste the key

It's free, no credit card needed.

---

## Run on PC / Mac / Linux

Same steps, just use your normal terminal:
```bash
node server.mjs
```
Then open `http://localhost:3000` in any browser.

---

## Shortcuts (run from anywhere)

Add this to your `~/.bashrc` in Termux:
```bash
alias isotope='cd ~/isotope-offline && bash start.sh'
```
Then just type `isotope` to launch.

---

## Troubleshooting

**Port already in use?**
```bash
PORT=3001 bash start.sh
```
Then open `http://localhost:3001`

**Node.js not found?**
```bash
pkg install nodejs
```

**App not loading?**
Make sure the terminal is still running (don't close Termux while using the app). You can use Termux's wake lock to keep it running.

---

## Keeping Termux alive while using the app

In Termux, swipe from the left edge to open the sidebar, tap **"Acquire Wakelock"** — this prevents Android from killing the server when the screen sleeps.
