# Isotope Code — Problems (detailed, fix-ready)

Audit date: 2026-08-09 · Repo root: `/data/data/com.termux/files/home/isotope-code`
Served entry bundle: `public/assets/index-D1Y5F8Lk.js` (new build). Anchor strings in server.mjs were written against the PREVIOUS build — see H1.

Verification commands used (re-run before/after fixing):

```bash
# Anchor check (any anchor not matched exactly once in its target = broken patch)
node -e '
const fs=require("fs");
const srv=fs.readFileSync("server.mjs","utf8");
const getAnchor=(name)=>{const di=srv.indexOf("const "+name+" =");if(di<0)return null;
const eq=srv.indexOf("=",di);const c1=srv[eq+1];let q,qStart;
if(c1===" "){q=srv[eq+2];qStart=eq+3;}else{q=c1;qStart=eq+2;}
const end=srv.indexOf(q,qStart);let s=srv.slice(qStart,end),o="",i=0;
while(i<s.length){if(s[i]==="\\"&&i+1<s.length){const c=s[i+1];
if(c==="n")o+="\n";else if(c==="t")o+="\t";else if(c==="r")o+="\r";
else if(c==="u"){o+=s.slice(i,i+6);i+=5;}else if(c==="\\")o+="\\";
else if(c==="\x22")o+="\x22";else if(c==="\x27")o+="\x27";else if(c==="\x60")o+="\x60";
else o+=c;i+=2;}else{o+=s[i];i++;}}
return o;};
for(const name of ["AI_PATCH_FROM","APP_DEMO_FROM","PWA_RELOAD_FROM","COMMUNITY_FEATURE_RENDER_FROM","CB_FROM"]){
  const a=getAnchor(name);const hits=[];
  for(const f of fs.readdirSync("public/assets").filter(f=>f.endsWith(".js")))
    if(fs.readFileSync("public/assets/"+f,"utf8").includes(a))hits.push(f);
  console.log(name.padEnd(34),hits.join(", ")||"(NONE anywhere)");}
'

# Syntax check
node --check server.mjs
```

---

# CRITICAL / HIGH

## H1. Patch anchors target the OLD build — 5 patches silently dead

**File:** `server.mjs` (runtime bundle patcher).
**Root cause:** Assets in `public/assets/` were rebuilt (new content hashes, new minified code) but the `*_FROM` anchor constants still contain old-build substrings. The patcher pattern `if (raw.includes(FROM)) { raw = raw.replace(FROM, TO); }` then fails the `includes` check and returns the raw bundle **silently** (no log, no error).

Verified state (exact substring search across all `public/assets/*.js`):

| Anchor | Defin ition line (server.mjs) | Usage line | Only matches (OLD file) | Required new target | Patch effect |
|---|---|---|---|---|---|
| `AI_PATCH_FROM` | 3346 | 3354 (in `getPatchedCommunityApiBundle`? → actually `getPatchedAIBundle`-style fn) | `useAIStore-B2cv1FZz.js` only | `useAIStore-DRa7CkEN.js` | AI API key scope downgrade dead |
| `COMMUNITY_FEATURE_RENDER_FROM` | 3375 | 3408-3409 | `Community-DIqF5406.js` only | `Community-CEnEgsrd.js` | removing Store/Events nav surfaces dead |
| `PWA_RELOAD_FROM` | 3590 | 3597-3598 | `PWAManager-DjIYufp2.js` only | `PWAManager-CUuXr3sv.js` | update banner auto-reload dead |
| `APP_DEMO_FROM` | 3617 | 3775-3776 | `App-pJGjDiPw.js` only | `App-CQ9mV4wu.js` | demo-mode patch dead |
| `CB_FROM` | 3412 (local const inside fn) | 3414-3415 | `App-pJGjDiPw.js` only | `App-CQ9mV4wu.js` | crash-circuit-breaker patch dead |

**Working anchors (do NOT touch):** `TRACE_FROM` (3757, hits `index-D1Y5F8Lk.js` OK), `COMMUNITY_HUB_CARDS_FROM` (3377, hits `CommunityHub-gANxZssO.js` OK), `COMMUNITY_LB_ICON_FROM` (3400, hits `CommunityVisuals-mHr4KGyg.js` OK), `DASHBOARD_SYLLABUS_FROM`, `COMMUNITY_CHAT_COMPONENT/RENDER`, `COMMUNITY_API_GATE/CHAT`, `SENTRY_DSN_FROM` (3752), `APP_PLAN_FROM_A/B`, `PREM_FROM` (3686).

**How to fix (each broken anchor):**
1. Open the CURRENT target file from the table (e.g. `public/assets/App-CQ9mV4wu.js`).
2. Find the equivalent minified code that the old anchor described:
   - `APP_DEMO_FROM`: in the old build it was `ge = () => typeof window > "u" ? !1 : Ys(window.location.pathname) || window.sessionStorage.getItem(Et) === "1",` — find the same demo-mode check in new build (search for `typeof window > "u"` and `sessionStorage.getItem` with `"1"`).
   - `CB_FROM`: old = `function O(a) {\n    if (!a) return !1;...` — find the new circuit-breaker function (search for `return !1;` near a crash handler, or grep the old file for the context around `function O(`).
   - `PWA_RELOAD_FROM`: old = `(r.isUpdate || r.isExternal) && window.location.reload()` — find same expression in `PWAManager-CUuXr3sv.js` (likely different var names).
   - `COMMUNITY_FEATURE_RENDER_FROM`: old = `a==="store"&&e.jsx(U,{onNavigate:i},"store"),a==="events"&&e.jsx(M,{onNavigate:i},"events"),` — find the same feature-switch in `Community-CEnEgsrd.js`.
   - `AI_PATCH_FROM`: old = `async getApiKey(n) {\n            const e = \`ai_api_key_${n}\`` — find the same `getApiKey` in `useAIStore-DRa7CkEN.js`.
3. Copy the EXACT new substring (including leading/trailing punctuation as in the original `FROM`) into the anchor constant.
4. Re-run the anchor check above — each fixed anchor must show exactly one hit in its new target file.
5. `node --check server.mjs`.

**Why it matters:** the dead patches mean (a) demo-mode detection isn't applied, (b) update banner never auto-reloads, (c) Store/Events surfaces still render in community UI, (d) AI key scope not downgraded, (e) crash circuit breaker not active.

---

## H2. `/__supa/*` proxy exposes Supabase SERVICE-ROLE key to any caller

**File:** `server.mjs`
- `handleSupabaseProxy` defined at **5852** (comment at 5848).
- Proxies `/__supa/*` → forward to Supabase with `apikey` + `Authorization: Bearer` injected at **5860-5861**.
- When `ADMIN_MODE_READY` (defined **236** = `ENABLE_ADMIN_MODE && !!SUPA_SERVICE_KEY && !!ADMIN_COOKIE_SECRET`), `useServiceKey` is `true` (**5858**) → `authHdr = 'Bearer ' + SUPA_SERVICE_KEY` (**5861**).
- Key constants: `SUPA_SERVICE_KEY` at **214** (`process.env.SUPABASE_SERVICE_ROLE_KEY || ''`), `ADMIN_COOKIE_SECRET` at **235** (`ADMIN_SECRET || SUPA_SERVICE_KEY`).
- **No auth check anywhere in the proxy**: it is reachable from the catch-all at **6475** (`handleSupabaseProxy(req, res);`), which runs for every unmatched `/__supa/...` URL regardless of logged-in status.
- CORS: proxy response sets `access-control-allow-origin: *` at **5920**; static handler also sets `Access-Control-Allow-Origin: *` at **8904**.
- Client usage e.g. **6168** (`fetch('/__supa/storage/v1/object/public/avatars/...')`).

**Fix (recommended):**
- In `handleSupabaseProxy` (5852): keep using the user's own `Authorization` header + anon key for ALL callers; ONLY use the service key when the request carries a valid admin cookie/app token (`isAdminAuthed(req)` defined at **239**).
- i.e. change the `useServiceKey` decision (5858) from `ADMIN_MODE_READY` to `ADMIN_MODE_READY && isAdminAuthed(req)`.
- Optionally restrict CORS `*` (5920, 8904) to the app origin.

---

## H3. Unauthenticated `/api/update-now` spawns shell command

**File:** `server.mjs`, route at **6633** (`if (req.method === 'POST' && adminPath === '/api/update-now')`), body at 6633-6651.
- Spawns `bash bin/isotope update` detached, no `isAdminAuthed` check — every other `/__admin/*` route checks at **6319** (`if (adminPath.startsWith('/__admin/') && ... && !isAdminAuthed(req))`), but note 6633 uses `adminPath === '/api/update-now'` which doesn't start with `/__admin/`, and there is no explicit auth check.
- Called from client bundle at **3188** (`fetch('/api/update-now', { method: 'POST', ... })`).

**Fix:** add to 6633: `if (!isAdminAuthed(req)) { res.writeHead(401, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'Unauthorized'})); return; }`

---

## H4. Client-side premium escalation via self-PATCH

**File:** `server.mjs`, `PREMIUM_SCRIPT` template starts at **2229** (function `upgradeProfile` below it).
- Injected into HTML; any logged-in user can `PATCH` their own `users` row (`plan_type:'ranker'`, `billing:'active'`, long expiry) using their own JWT via the RPC/`__supa` path. Combined with H2 this is trivially exploitable.
- Comment (2237-2239) admits intent: "This makes `is_premium_user()` return true in PostgreSQL, so all RLS SELECT/INSERT/UPDATE policies on community tables pass."

**Note for next agent:** If this is intended (self-hosted app), document it, but RLS policies and `is_premium_user()` should still be audited (see `sql/` and `verify-security.sql`). Do NOT silently remove — confirm with owner first.

---

# MEDIUM

## M1. Unhandled promise rejections from `readReqBody(...).then(...)`

**File:** `server.mjs`. `readReqBody` defined at **5772**. These chains have NO `.catch()`:
- **6244** — `readReqBody(req, 1*1024*1024).then(({ errors }) => {...})`
- **6397** — `readReqBody(req, 1024*1024).then((body) => {...})`
- **6655** — `/__auth/check` — `readReqBody(req).then(({ email, username }) => {...})`
- **7338** — `/__auth/signup` — `readReqBody(req).then(async ({ username, password }) => {...})` (inner try/catch exists but the outer `.then` chain itself is unguarded; malformed JSON before the callback rejects the outer promise)
- **7637** — `/__admin/roles` POST — `readReqBody(req).then(async ({ email, role }) => {...})`
- **7673** — `/__admin/roles` DELETE — `readReqBody(req).then(async ({ id }) => {...})`
- **8694** — `/__auth/login` primary — `readReqBody(req).then(async ({ username, password }) => {...})`
- **8757** — admin patch route — `readReqBody(req, 4*1024*1024).then(({ pat, sql }) => {...})`

**Fix:** append `.catch(err => { ...write 400/500 JSON response... })` to each of the 8 chains above (match the style of the `.catch` in the route at 6667-6671).

---

## M2. index.html loads STALE build assets (~800 KB wasted + conflicting CSS)

**File:** `index.html`
- Line **18**: `<link rel="stylesheet" crossorigin href="/assets/index-CrO6t5EW.css">` (Aug 6 build, 427 KB).
- Line **19**: `<link rel="stylesheet" crossorigin href="/assets/vendor-katex-ASjZcBK0.css">`.
- Line **36**: `<link rel="modulepreload" crossorigin href="/assets/vendor-react-BfU3Zn2J.js">` (Aug 6 build).
- Current build files: `public/assets/index-LkPKl--4.css`, `public/assets/vendor-react-BWKHxYQy.js`, `public/assets/vendor-katex-BSXZKQS3.js` (all exist — verified).
- SW caches stale CSS via `cacheFirst` → two CSS versions apply to the same page.

**Fix:** update lines 18-19 and 36 to reference the current hashed files (`index-LkPKl--4.css`, `vendor-katex-BSXZKQS3.css` if exists, `vendor-react-BWKHxYQy.js`), or drop them entirely (entry `index-D1Y5F8Lk.js` injects its own CSS + vendor chunk).

---

## M3. `public/focus-bg-import.js:15` — stale focusBackground chunk

- Line **15**: `var FOCUS_BG_MODULE = '/assets/focusBackground-t8AknbRg.js';` (OLD build).
- Current build chunk: `public/assets/focusBackground-Dc8Rc9XQ.js` (exists).
- Load failure is swallowed by `.catch(() => null)` (~line 77) → focus background silently breaks once old builds are purged.

**Fix:** change line 15 to `/assets/focusBackground-Dc8Rc9XQ.js`, or resolve dynamically from the entry import map.

---

## M4. Unguarded `localStorage.removeItem` can abort app boot

**File:** `public/restore-and-launch.js`
- Line **542** (in `applyCachedCloudSnapshot`): `else localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);`
- Line **622** (in `applyBootstrapSnapshot`): `else localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);`
- `ZUSTAND_ONBOARDING_KEY` defined line **47** (`'isotope-onboarding'`).
- Every other storage accessor in the file is guarded with try/catch (e.g. `writeLocalOnboardingComplete`, `writeJson`); these two are not. If storage throws (privacy mode), the async IIFE rejects → `preloadAssets()` (line 872 area) never runs → blank page.

**Fix:** wrap each call, e.g.
```js
else { try { localStorage.removeItem(ZUSTAND_ONBOARDING_KEY); } catch (_) {} }
```

---

## M5. `public/manifest.webmanifest` — broken screenshot references

- Line **1**, `screenshots` array references `/screenshots/pwa-desktop-1.webp` and `/screenshots/pwa-desktop-2.webp`.
- Only PNGs exist in `screenshots/`: `mobile-dashboard.png`, `mobile-focus.png`, `hero-dashboard.png`, `analytics.png`, etc. — **no `.webp` files** (verified: no `pwa-desktop-*.webp`).

**Fix:** point to existing screenshots, e.g. `/screenshots/hero-dashboard.png` and `/screenshots/community.png` (with `"type":"image/png"`), or generate the `.webp` files.

---

## M6. Refresh tokens in plaintext localStorage

**File:** `public/restore-and-launch.js`, `saveRefreshedSession` at **223** (body 224-231):
- Keys written: `SUPABASE_TOKEN_KEY` (= `isotope-auth-token`), `sb-{SUPA_REF}-auth-token`, `isotope-last-jwt`, `isotope-last-rt` (raw refresh token, line **228**), `isotope-last-session-raw`.
- Same pattern in `public/auth-bridge.js` `writeSession` (~43-47).
- localStorage is readable by any XSS and by the SW scope; stolen refresh token = long-lived session.

**Fix (if in scope):** stop persisting the refresh token (`isotope-last-rt`), or move session to httpOnly cookie via the server; at minimum gate with a comment and confirm with owner (this is common for client-side Supabase apps).

---

# LOW

## L1. Dead builds accumulate in `public/assets` (~18 MB total)
Verified leftover builds: `index-qd2KF3Jd.js`, `index-BPYJFSVW.js`, `App-pJGjDiPw.js`, `App-Bcp_57Ks.js`, `App-DIpgIc18.js`, `vendor-react-BfU3Zn2J.js`, `vendor-react-0f7xbcAh.js`, `vendor-charts-*` (4), plus `public/assets/sw.js` (workbox, unreferenced) and `public/workbox-1d81fbea.js`.
Served graph (keep these): `index-D1Y5F8Lk.js` + its import list: `marketing-core-DzcTqL0l.js`, `vendor-react-BWKHxYQy.js`, `vendor-router-C2sFoTjv.js`, `vendor-sentry-C0ZzGV-C.js`, `Landing-30Ourhwi.js`, `TodayFeature-BDMr9GlA.js`, `FocusTimerLanding-DwoxLp8t.js`, `TasksFeature-Ih8sP5NE.js`, `ExamPlannerFeature-jR31fGos.js`, `SyllabusFeature-BEN3Gt09.js`, `StudyFeature-MNsr-gPu.js`, `AnalyticsFeature-D58mar4z.js`, `StudyGroupsFeature-DINDKvkz.js`, `About-BynUj5GR.js`, `Privacy-2wg91W65.js`, `Terms-12mtllDS.js`, `PublicMarketingApp-DRuHEFFn.js`, `App-CQ9mV4wu.js`, and (from App-CQ9mV4wu.js) `useAuthStore-Aw1au7RF.js`, `FocusTimerLanding-DwoxLp8t.js`, `Focus-B4gLsWoP.js`, `Community-CEnEgsrd.js`, `PWAManager-CUuXr3sv.js`, plus lazy chunks `CommunityHub-gANxZssO.js`, `CommunityVisuals-mHr4KGyg.js`, `communityApi-Ccw5N_9O.js`, `Dashboard-Dzf-IC_a.js`, `sessionSync-mloIEnTd.js`, `SettingsLayout-DkuooNHv.js`, `useSyncStore-Di0wBMnH.js`, `AppAccessGate-DzNuNpuU.js`, `useInvites-D9RLFwf8.js`, `useLeaderboard-BpvH5FXA.js`, `SingleGroup-DU1IhoNK.js`, `Auth-D0Y8CB1f.js`, `Onboarding-C0svxOgT.js`, `useAIStore-DRa7CkEN.js`.
**⚠ Do NOT purge old builds until H1 anchors are re-pointed to new files** — old files are currently the only match for broken anchors.
**Fix:** after fixing H1, delete all other `.js`/`.css` not in the served graph.

## L2. Duplicate entry in `public/sw.js` `RUNTIME_PATCHED_ASSET_PATHS`
Lines **76** and **83**: `'/assets/useSyncStore-Di0wBMnH.js'` appears twice (dedupe).

## L3. Dead duplicate manifest `public/manifest.json`
Not referenced anywhere (index.html line 20 uses `manifest.webmanifest` only). References 6 missing icons (lines 14,20,26,32,38,50): `icon-72x72.png`, `icon-96x96.png`, `icon-128x128.png`, `icon-144x144.png`, `icon-152x152.png`, `icon-384x384.png`. Different `theme_color` (#8b5cf6 vs #7c3aed).

## L4. Hardcoded fallback Supabase creds in source
**File:** `server.mjs` lines **177-178**: `DEFAULT_SUPABASE_URL = "https://vteqquoqvksshmfhuepu.supabase.co"` and `DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOi..."` (anon JWT, exp 2095). Anon-only so low risk, but flagged. Also `ADMIN_COOKIE_SECRET = ADMIN_SECRET || SUPA_SERVICE_KEY` (**235**) — service key doubles as admin cookie HMAC secret; prefer a dedicated `ADMIN_SECRET`.

## L5. `/api/ai-config` discloses configured AI providers
`server.mjs` **6481-6483**: returns `{ gemini: !!GEMINI_API_KEY, groq: !!GROQ_API_KEY }` with no auth. Minor — restrict to authenticated users if desired.

---

# CHECKED / CLEAN
- No TODO/FIXME/HACK markers anywhere.
- No SQL string-concatenation injection (params are `encodeURIComponent`-escaped, e.g. 6661).
- All 22 registered bundle target files exist (server.mjs `*_BUNDLE_ABS` constants).
- `node --check server.mjs` passes.
- `pwa-local.js`, `update-checker.js`, `boot-recovery.js`: storage guarded, no XSS vectors in banners.
- `src/components` (shadcn/ui scaffold): no missing keys, no hooks-in-conditionals; only `dangerouslySetInnerHTML` is `src/components/ui/chart.tsx:79` (component config only).

# SCAFFOLD NOTE (not a shipped app issue)
- `src/` is an unbuildable scaffold: `package.json` has zero dependencies and no build script; `tsconfig.json` extends `"../../tsconfig.base.json"` and references `"../../lib/api-client-react"` — neither exists. The real app is the prebuilt bundles in `public/assets/` booted by `public/restore-and-launch.js`.