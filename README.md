# IsotopeAI Mod

  > A mod build of [IsotopeAI](https://isotopeai.in) that connects to the real isotopeai.in Supabase backend — with free Scholar access for all users, offline ambient sounds, and a Focus background importer.

  ---

  ## Quick Start

  ```bash
  git clone https://github.com/Suydev/isotope-code.git
  cd isotope-code
  node server.mjs
  ```

  Open **http://localhost:3000** in your browser and sign in with Google or email.

  ---

  ## Features

  | Feature | Details |
  |---|---|
  | 🔐 **Real authentication** | Google OAuth + email/password via isotopeai.in Supabase |
  | 🎓 **Free Scholar for all** | Every account gets Scholar plan — no paywall |
  | 🔊 **Offline ambient sounds** | Rain, Cricket, Wind bundled locally — works without internet |
  | 🖼️ **Focus background import** | Floating button (top-right on Focus tab) — import image/video from gallery or URL, persists across sessions |
  | 📱 **Picture-in-Picture** | Focus timer in a floating window; polyfill for browsers without native PiP |
  | ⚡ **AI features** | Pass optional API keys to enable Gemini / Groq AI |

  ---

  ## Environment Variables

  | Variable | Default | Description |
  |---|---|---|
  | `PORT` | `3000` | Port the server listens on |
  | `GEMINI_API_KEY` | — | Enables Gemini AI features |
  | `GROQ_API_KEY` | — | Enables Groq AI features |

  ```bash
  GEMINI_API_KEY=your-key node server.mjs
  ```

  ---

  ## OS Launchers

  | Platform | File |
  |---|---|
  | Windows | `setup.bat` |
  | macOS / iOS | `setup-ios.sh` |
  | Linux | `setup-linux.sh` |
  | Android (Termux) | `setup-termux.sh` |

  ---

  ## Project Structure

  ```
  isotope-code/
  ├── server.mjs                  Node.js static file server with runtime patches
  ├── index.html                  App entry point
  ├── public/
  │   ├── assets/                 Compiled React bundles (pre-built, do not edit)
  │   ├── sounds/                 Bundled ambient audio (rain.wav, crickets.wav, wind.wav)
  │   ├── fonts/                  Bundled web fonts
  │   ├── icons/                  App icons (PWA)
  │   ├── restore-and-launch.js   Startup: clears stale data, routes to login or dashboard
  │   ├── ux-setup.js             Skips redundant onboarding steps after login
  │   ├── focus-bg-import.js      Focus tab background image/video importer
  │   ├── boot-recovery.js        Handles stale asset cache errors on reload
  │   ├── sw.js                   Service worker: offline caching + ambient sound cache
  │   └── backup.json             Blank user profile template
  └── setup.bat / setup-*.sh      OS-specific launchers
  ```

  ---

  ## Notes on Google OAuth

  Google login requires the running domain to be registered in isotopeai.in's Supabase project.

  - **localhost:3000** is the standard dev URL and is likely already registered.
  - If Google login redirects you back to isotopeai.in instead of localhost, it means `http://localhost:3000` needs to be added to the Supabase OAuth redirect allowlist.
  - **Email + password signup always works** regardless of domain.

  ---

  ## License

  MIT
  