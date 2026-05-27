# IsotopeAI — Offline Edition &nbsp; `v1.3.0`

**Your personal AI-powered study planner — runs entirely on your computer, no internet required.**

All your data stays private on your device. No account. No subscription. No tracking.

---

## Quick Install (Git)

> Requires **Git** and **Node.js 18+** installed on your system.

```bash
# Clone the repository
git clone https://github.com/suydev/isotope-code.git

# Enter the app folder
cd isotope-code/isotope
```

Then launch for your platform:

```bash
# Windows — double-click, or run in PowerShell:
./Start\ IsotopeAI.bat

# Mac
bash "Start IsotopeAI.command"

# Linux
bash start-linux.sh

# Android (Termux) — first time only:
bash setup-termux.sh
# Every time after:
bash start.sh
```

Open your browser at **`http://localhost:3000`**

---

## What's new in v1.3.0

| Change | Details |
|---|---|
| **Three display modes** | Liquid Glass / Glassmorphism / Potato PC — toggle with the ◉ button bottom-left |
| **Android floating timer** | PiP timer shows as a glass card on Android (no broken chrome, swipe-pill to dismiss) |
| **Background video** | Import any video as a looping background (📹 button bottom-right) |
| **Liquid glass bug fixes** | Fixed blur dropout, stacking context, scroll-behavior scope, reduced-motion support |
| **AI keys pre-wired** | Gemini + Groq keys injected at server level — AI works out of the box |
| **Premium gate unlocked** | All premium AI features (Study Strategy etc.) fully unlocked |

---

## How to start the app

### On Windows

1. Run `git clone https://github.com/suydev/isotope-code.git` in PowerShell or open Git Bash
2. `cd isotope-code/isotope`
3. **Double-click `Start IsotopeAI.bat`**
4. Your browser opens at `http://localhost:3000`

> First time? The launcher will offer to install Node.js automatically if it's missing.

---

### On Mac

1. `git clone https://github.com/suydev/isotope-code.git && cd isotope-code/isotope`
2. **Right-click `Start IsotopeAI.command` → Open**
   *(Click "Open" in the macOS security dialog the first time)*
3. Browser opens automatically

---

### On Linux

```bash
git clone https://github.com/suydev/isotope-code.git
cd isotope-code/isotope
bash start-linux.sh
```

---

### On Android (Termux)

```bash
# Install Termux from F-Droid: https://f-droid.org/packages/com.termux/

# First-time setup (once):
pkg install git -y
git clone https://github.com/suydev/isotope-code.git
cd isotope-code/isotope
bash setup-termux.sh

# Every time after:
cd isotope-code/isotope
bash start.sh
```

Then open **Chrome** → `http://localhost:3000` → tap ⋮ → **Add to Home Screen**

---

## Keeping up to date

```bash
cd isotope-code
git pull
cd isotope
bash start-linux.sh   # or your platform launcher
```

---

## Display modes

Click the **◉ button at the bottom-left** to switch:

| Mode | Description | Best for |
|---|---|---|
| **✦ Liquid Glass** | Full glass effects, blur, glow, animated scrollbar | Modern PC / Mac |
| **◈ Glassmorphism** | Reduced blur, simpler shadows | Mid-range devices |
| **⚡ Potato Mode** | Zero GPU cost — flat, fast, no animations | Old PCs, Android low-end |

Your choice is remembered between sessions.

---

## Background video

Click the **📹 button at the bottom-right** to:
- Import any video file from your device
- Adjust opacity with the slider
- Toggle the video on/off
- Remove it

---

## What this app can do

| Feature | Offline? |
|---|---|
| Dashboard (tasks, deadlines, streak) | ✅ Yes |
| Focus Timer (Pomodoro + Stopwatch) | ✅ Yes |
| Tasks, board, Eisenhower matrix | ✅ Yes |
| Chapters and syllabus tracker | ✅ Yes |
| Exam scheduling and countdown | ✅ Yes |
| Analytics and study heatmaps | ✅ Yes |
| Floating timer (Picture-in-Picture) | ✅ Yes (any browser) |
| Background video | ✅ Yes |
| Display mode switcher | ✅ Yes |
| Community / group study | 🌐 Needs internet |
| AI study assistant | 🌐 Needs internet + API key |
| Study AI strategy (Give Strategy) | ✅ Unlocked |

---

## Floating timer (Picture-in-Picture)

1. Start a focus session (timer icon in the left sidebar)
2. Click the **PiP button** in the timer controls
3. A floating timer appears — always on top while you work

On **Android** it shows as a compact glass card at the bottom-right. Tap the orange pill to dismiss.

On **desktop** it's a draggable window.

---

## AI study assistant (optional)

The AI assistant only works when you have internet. It's disabled without a key.

**To enable it:**
1. Get a free key:
   - **Google Gemini** → https://aistudio.google.com/apikey
   - **Groq** → https://console.groq.com/keys
2. Open the app → **Settings** → **AI Features** → **AI Assistant**
3. Paste your key → click **Validate**

---

## Your data is safe

- Everything is stored **in your browser** (IndexedDB), not on any server
- Closing the server does **not** delete your data
- Data persists between restarts on the same browser + device

**Back up regularly:** Settings → Account → Export Data

---

## Troubleshooting

### App doesn't open / browser doesn't launch
- Keep the terminal/launcher window open (don't close it)
- Open your browser manually → `http://localhost:3000`
- If "This site can't be reached" — the server isn't running, re-run the launcher

### "Node.js not found" on Windows
The launcher will offer to install it. If that fails: https://nodejs.org → LTS → install → re-run launcher.

### White screen on load
- Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
- Make sure URL is `http://localhost:3000` (http, not https)

### Analytics shows "Loading..." forever
Try the Potato display mode (⚡) first. If still broken, re-clone the repo fresh.

### PiP button doesn't work on desktop
Requires Chrome 116+ or Edge 116+. The polyfill handles all other browsers with a floating overlay.

### Data disappeared
Don't clear your browser's site data for `localhost`.
Restore: Settings → Account → Import Data.

### Port 3000 already in use
```bash
PORT=4000 node server.mjs
# then open http://localhost:4000
```

### App works but AI features don't respond
1. Check internet connection
2. Settings → AI Features → Validate key (✓ = working)
3. Rate limit hit? Wait 1 minute (free tier limits)

---

## Keeping server alive on Android

In Termux: swipe left edge → tap **Acquire Wakelock** → prevents Android from killing the server on sleep.

---

## File structure

```
isotope-code/
└── isotope/
    ├── Start IsotopeAI.bat      ← Windows launcher
    ├── Start IsotopeAI.command  ← Mac launcher
    ├── start-linux.sh           ← Linux launcher
    ├── start.sh                 ← Android/Termux launcher
    ├── setup-termux.sh          ← Android first-time setup
    ├── server.mjs               ← Local web server (Node.js, zero dependencies)
    ├── index.html               ← App entry point
    └── public/
        ├── assets/              ← App bundles (203 files)
        ├── offline-patches.js   ← Offline mode patches
        ├── liquid-glass.css     ← Glass UI theming + 3 display modes
        ├── perf-mode.js         ← Display mode switcher
        └── bg-video.js          ← Background video system
```

---

## Technical notes

- **Node.js 18+** required (Node.js 20 LTS recommended)
- No `npm install` needed — server uses only built-in Node.js modules
- App data stored in browser IndexedDB at `http://localhost:3000`
- Source: https://github.com/suydev/isotope-code

---

*IsotopeAI Offline Edition — community fork maintained at https://github.com/suydev/isotope-code*
