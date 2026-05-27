# isotopeAIcode

**Your personal AI-powered study planner — runs on your computer, no internet required.**

All your data stays private on your device. No account needed. No subscription. No tracking.

---

## How to start the app

### On Windows

1. **Extract** the ZIP file (right-click → Extract All)
2. Open the extracted folder
3. **Double-click `Start IsotopeAI.bat`**
4. Your browser opens automatically at `http://localhost:3000`

> First time? If Node.js isn't installed, the launcher will offer to install it automatically.

---

### On Mac

1. **Extract** the ZIP file (double-click it)
2. Open the extracted folder in Finder
3. **Right-click `Start IsotopeAI.command` → Open**
   *(You may need to click "Open" in the security dialog the first time)*
4. Your browser opens automatically

> **Mac note:** The first time you run it, macOS will show a security warning because the file was downloaded from the internet. Right-click → Open (instead of double-click) to bypass it.

---

### On Linux

1. **Extract** the ZIP
2. Open a terminal in the folder
3. Run: `bash start-linux.sh`
4. Your browser opens automatically

---

### On Android (Termux)

1. Install **Termux** from [F-Droid](https://f-droid.org/packages/com.termux/)
2. Run setup once:
   ```
   bash setup-termux.sh
   ```
3. Every time after that:
   ```
   bash start.sh
   ```
4. Open **Chrome** → `http://localhost:3000`
5. Tap ⋮ → **Add to Home Screen** to install as an app icon

---

## What can this app do?

| Feature | Works without internet? |
|---|---|
| Dashboard (tasks, deadlines, streak) | ✅ Yes |
| Focus Timer (Pomodoro + Stopwatch) | ✅ Yes |
| Tasks, board, Eisenhower matrix | ✅ Yes |
| Chapters and syllabus tracker | ✅ Yes |
| Exam scheduling and countdown | ✅ Yes |
| Analytics and study heatmaps | ✅ Yes |
| **Picture-in-Picture timer** | ✅ Yes (Chrome/Edge only) |
| Community / group study | 🌐 Needs internet |
| AI study assistant | 🌐 Needs internet + API key |

---

## Picture-in-Picture timer

The Focus timer has a **floating window mode** — you can keep the timer visible on top of other apps while you study.

**How to use it:**
1. Start a focus session (click the timer icon in the left sidebar)
2. Look for the **PiP button** (picture frame icon) in the timer controls
3. Click it — a small floating timer window appears, always on top

> Requires **Chrome 116+** or **Edge 116+**. Does not work in Firefox or Safari.

---

## AI study assistant (optional)

The AI assistant is **disabled by default** and only works when you have internet. It never runs without your permission.

**To enable it:**

1. Get a free API key:
   - **Google Gemini** → go to https://aistudio.google.com/apikey → sign in → click "Get API Key" → copy it
   - **Groq** → go to https://console.groq.com/keys → sign in → create a key → copy it

2. Open the app → go to **Settings** (gear icon) → **AI Features** → **AI Assistant**

3. Paste your key and click **Validate**

That's it — AI features activate immediately.

---

## Your data is safe

- Everything is stored **in your browser** (not on any server)
- Closing the server does **not** delete your data
- Data persists between restarts as long as you use the same browser on the same computer

**Important:** Don't clear your browser's site data for `localhost`. That would erase your study history.

**Back up your data regularly:**  
Go to **Settings → Account → Export Data** to download a backup file.

---

## Troubleshooting

### The app doesn't open / browser doesn't launch

- Make sure the terminal/launcher window is still open (don't close it)
- Try opening your browser manually and going to `http://localhost:3000`
- If you see "This site can't be reached", the server isn't running — re-run the launcher

### "Node.js not found" error on Windows

The launcher will offer to install Node.js automatically. Click **Yes** when prompted.  
If that fails, visit https://nodejs.org → download the **LTS** version → install it → run the launcher again.

### App loads but shows a white screen

- Do a hard refresh: **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac)
- Make sure you're visiting `http://localhost:3000` (with `http://`, not `https://`)

### Analytics shows "Loading..." forever

Your download may be incomplete. Re-download the ZIP from the [releases page](../../releases/latest) and extract it fresh.

### The timer PiP button doesn't work

Picture-in-Picture requires **Chrome 116 or newer** (or Edge 116+). Update your browser or switch to Chrome.

### Data disappeared

If you cleared your browser's cache or switched browsers, the data won't be there.  
Restore from a backup: **Settings → Account → Import Data**.

### Port 3000 already in use

**Windows:** Open `Start IsotopeAI.bat` in Notepad and change `3000` to `4000` in the last line.  
**Mac/Linux:** Run `PORT=4000 node server.mjs` and open `http://localhost:4000`.

### App works but AI features don't respond

1. Check you're connected to the internet
2. Go to **Settings → AI Features** and confirm your key is saved
3. Try clicking **Validate key** — a ✓ means it's working
4. If you see a rate-limit error, wait 1 minute (free tier has limits)

---

## Keeping the app running on Android

In Termux, swipe from the left edge → tap **Acquire Wakelock**. This prevents Android from killing the server when your screen sleeps.

---

## File structure (for curious users)

```
isotopeAIcode/
├── Start IsotopeAI.bat      ← Windows: double-click to start
├── Start IsotopeAI.command  ← Mac: double-click to start
├── start-linux.sh           ← Linux: run with bash
├── start.sh                 ← Android/Termux launcher
├── setup-termux.sh          ← Android/Termux first-time setup
├── server.mjs               ← The local web server (Node.js)
├── index.html               ← App entry point
└── public/
    └── assets/              ← All 148 app files (do not delete)
```

---

## Technical notes

- **Node.js 18+** required
- No `npm install` needed — server uses only Node.js built-in modules
- App data is stored in browser IndexedDB at `http://localhost:3000`
- Source: https://github.com/Suydev/isotope-code
