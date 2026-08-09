# IsotopeAI Android — File Map

---

## isotope-apk repo (this repo)

### Core Capacitor Files
| File | Purpose |
|------|---------|
| `package.json` | npm dependencies: @capacitor/android 6.2.x, all plugins |
| `capacitor.config.json` | Capacitor config: appId=in.isotopeai.app, webDir=www |
| `android-bridge.js` | **CRITICAL** — fetch interceptor for /__auth/*, /__supa/*, /api/* |
| `AGENTS.md` | Agent handoff rules (read this first) |

### Native Android Files
| File | Purpose |
|------|---------|
| `android/app/src/main/java/in/isotopeai/app/MainActivity.java` | Capacitor activity plus `window.IsotopeAndroid` Focus PiP bridge |
| `android/app/src/main/AndroidManifest.xml` | Permissions, PiP/resizable activity, keyboard resize, native app metadata |
| `android/app/src/main/res/drawable/ic_notification.xml` | LocalNotifications small icon |
| `android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml` | Adaptive launcher foreground using isotope-code logo |
| `android/app/src/main/res/values/ic_launcher_background.xml` | Adaptive launcher background color |
| `android/app/src/main/res/mipmap-*/ic_launcher*.png` | Density launcher icons generated from isotope-code logo |

### Build Scripts
| File | Purpose |
|------|---------|
| `scripts/prepare-www.js` | Copies isotope-code/public/ → www/, injects bridge, noop sw.js |
| `scripts/apply-android-patches.js` | Patches JS bundles with Supabase constants and server-side patches |
| `scripts/agent-resume.sh` | New agent onboarding: checks git state, shows next task |
| `scripts/agent-handoff.sh` | End-of-session: updates state.json, reminds to update docs |
| `scripts/agent-status.mjs` | Prints current state summary |
| `scripts/push-to-github.js` | Pushes all files via GitHub Git Data API (used by main agent) |

### CI
| File | Purpose |
|------|---------|
| `.github/workflows/android.yml` | Builds debug APK on every push to main |

### Handoff Files (in .agent/)
| File | Purpose |
|------|---------|
| `.agent/README.md` | Quick reference |
| `.agent/BOOTSTRAP.md` | Setup commands (copy-paste) |
| `.agent/CURRENT_STATE.md` | What works, what's broken, next command |
| `.agent/NEXT_TASKS.md` | Ordered task queue with acceptance conditions |
| `.agent/DECISIONS.md` | Architecture decisions with rationale |
| `.agent/ARCHITECTURE.md` | System design, endpoint map, data flows |
| `.agent/TEST_STATUS.md` | Test results table |
| `.agent/KNOWN_ISSUES.md` | Unresolved problems with reproduction steps |
| `.agent/FILE_MAP.md` | This file |
| `.agent/SESSION_LOG.md` | Per-session log |
| `.agent/state.json` | Machine-readable current state |
| `.agent/last-test-output.txt` | Last test run output |

---

## isotope-code repo (source, READ ONLY from this project)

### ⚠️ CRITICAL WARNING
**`src/App.tsx` is a PLACEHOLDER** — it contains:
```
"Replit Agent is building..."
```
This is NOT the production IsotopeAI interface.
The REAL production UI is pre-compiled in `public/assets/`.

### Real Production UI Assets
| File | Purpose |
|------|---------|
| `public/assets/index-BPYJFSVW.js` | **ACTIVE entry point** (loads App bundle) |
| `public/assets/App-pJGjDiPw.js` | **ACTIVE main React app** (342KB, 211 chunks total) |
| `public/assets/AppAccessGate-B975UtK7.js` | Startup gate, IndexedDB migration, routing |
| `public/assets/index-CrO6t5EW.css` | Main styles (417KB) |
| `public/assets/useFocusStore-CX_Nyp1h.js` | Timer/focus store (Zustand) |
| `public/assets/sessionSync-mloIEnTd.js` | Focus session → Supabase sync |
| `public/assets/SettingsLayout-B4OgCkQ5.js` | Settings page (backup/import/export) |
| `public/assets/analyticsWorker-BnmTlfYB.js` | Analytics web worker |
| `public/assets/Dashboard-dypAV-0H.js` | Dashboard page |
| `public/assets/CommunityHub-gANxZssO.js` | Community features (Realtime) |

### ⚠️ Stale/Proxy Assets (DO NOT CONFUSE)
| File | Status |
|------|--------|
| `public/assets/index-qd2KF3Jd.js` | STALE — old entry point |
| `public/assets/App-Bcp_57Ks.js` | STALE PROXY → App-pJGjDiPw.js |
| `public/assets/vendor-supabase-CdzVlbop.js` | STALE PROXY |
| `public/assets/vendor-query-Dco3bNuU.js` | STALE PROXY |

### Runtime Glue (in public/)
| File | Purpose |
|------|---------|
| `public/auth-bridge.js` | Supabase auth client (login/signup/bootstrap) |
| `public/restore-and-launch.js` | App boot sequence — reads window.__ISO_SUPA_URL__ |
| `public/boot-recovery.js` | Clears caches on chunk load failure |
| `public/pwa-local.js` | Server-check (polls /api/version every 5min) |
| `public/sw.js` | Service worker (replaced with no-op for Android) |
| `public/sync/backup-normalizer.js` | Backup format + BLOCKED_EMPTY_OVERWRITE |
| `public/sync/local-data-adapter.js` | IndexedDB read/write adapter |

### Backend (NOT INCLUDED IN APK)
| File | Purpose |
|------|---------|
| `server.mjs` | Node.js server (~440KB, ~8600 lines) — NOT included |
| `server/backup-manager.mjs` | Backup building + findBestCloudBackup |

### Supabase Schema
| File | Purpose |
|------|---------|
| `isotope-complete.sql` | Full schema (20+ tables, RPCs, RLS, indexes) |
| `community-patch-v4.sql` | Community features schema |

### Audit Files (READ ONLY, for analysis)
| File | Purpose |
|------|---------|
| `audit/_meta/route-map.txt` | All server endpoints |
| `audit/_meta/database-object-map.txt` | All Supabase tables/RPCs |
| `audit/_meta/browser-storage-map.txt` | All localStorage/IndexedDB keys |
| `audit/_meta/asset-inventory.txt` | All asset files with sizes |
| `audit/_meta/large-file-agent-hazard-review.txt` | Large file warnings |

### Do NOT Edit Manually (Generated)
| File | Reason |
|------|--------|
| `public/assets/*.js` | Pre-compiled production bundles |
| `public/assets/*.css` | Pre-compiled CSS |
| `dist/` | Vite build output (not the production app) |
