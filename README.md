# IsotopeAI

> Your all-in-one AI-powered study ecosystem.

IsotopeAI is a Progressive Web App (PWA) for students — AI study planner, focus timer, syllabus tracker, spaced repetition, and analytics — with an Apple-inspired glassmorphism UI.

## Features

- **AI Assistant** — Gemini-powered (Groq fallback) study planning, Q&A, and smart suggestions
- **Focus Timer** — Pomodoro-style timer with ambient sounds (rain, crickets, wind) and Picture-in-Picture
- **Syllabus Tracker** — Subject-wise progress tracking with chapter completion
- **Spaced Repetition** — Flashcard review scheduling
- **Analytics** — Study streaks, daily/weekly breakdowns, productivity charts
- **Exam Countdown** — Multi-exam deadline tracking
- **Tasks & Habits** — Linked to study sessions
- **Glassmorphism UI** — Full Apple liquid glass UI with adjustable blur, opacity, tint, and background

## Quick Start

```bash
npm install
npm start
```

The server runs on `PORT` (default `3000`) and serves the PWA from `public/`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `GEMINI_API_KEY` | Google Gemini API key (AI features) |
| `GROQ_API_KEY` | Groq API key (AI fallback when Gemini is unavailable) |

Set these before starting the server. Both AI keys are optional; without them, AI features will prompt users to add their own keys in settings.

## Project Structure

```
├── server.mjs          Node.js static file server with runtime patches
├── package.json
├── public/
│   ├── assets/         Compiled React bundles (do not edit directly)
│   ├── sounds/         Local ambient sounds (thunder-rain, crickets, wind)
│   ├── bg.mp4          Default background video
│   ├── bg-video.js     Background manager (video/image/dark modes)
│   ├── glass-settings.js   Glassmorphism settings panel
│   ├── community-patch.js  Community page "Coming Soon" overlay
│   ├── liquid-glass.css    Full-app Apple liquid glass overrides
│   ├── restore-and-launch.js  First-install init & onboarding
│   ├── offline-patches.js  Service worker + offline error handling
│   ├── perf-mode.js    Performance mode selector
│   └── boot-recovery.js    App boot safety net
```

## Architecture

- **Pre-built PWA**: The React app is compiled and lives in `public/assets/`. Server-side runtime patches are applied without recompiling.
- **AI key injection**: `GEMINI_API_KEY` and `GROQ_API_KEY` are read server-side and injected via `window.__IK__`, then patched directly into the AI store bundle so the app picks them up automatically.
- **Ambient sounds**: All three ambient sounds (rain, crickets, wind) are bundled locally — no external fetches required.
- **Background system**: `bg-video.js` manages three background modes (video, image, dark). Default is the built-in `bg.mp4`. Users can upload a custom image or video via the glass settings panel (◈ button, bottom-left).
- **Onboarding**: Fresh installs run the app's built-in onboarding flow. No personal data is pre-loaded.

## Deployment

The server is a plain Node.js HTTP server — no framework required. Deploy anywhere Node.js runs (Railway, Render, Fly.io, a VPS, etc.).

```bash
GEMINI_API_KEY=your_key GROQ_API_KEY=your_key PORT=8080 node server.mjs
```
``` visit https://suydev.github.io/isotope-code/ for troubleshooting ```
## License

MIT
