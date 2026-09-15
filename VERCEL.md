# Vercel Deployment — isotope-code

How to deploy this app to Vercel. Vercel runs the whole server (`server.mjs`)
as a **single Vercel Function** on [Fluid compute](https://vercel.com/docs/fluid-compute)
— static assets, serve-time bundle patches, and every endpoint (auth,
community, AI proxy, sync) run through the same code path as a local
`node server.mjs`.

## How it works

Vercel Functions are serverless: they must export a request handler, not run a
long-lived `http.Server`. Two files bridge that gap with **zero changes to
`server.mjs`**:

| File | Role |
|---|---|
| `api/index.js` | Serverless adapter. Intercepts `http.createServer` *before* importing `server.mjs`, captures its request handler, fakes the `listen` lifecycle (the warm-up hooks registered in the listen callback run once per cold start), and re-exports the handler. |
| `vercel.json` | Selects the "Other" framework preset, routes **every** path to the function, and includes `public/**` in the function bundle. |

### Routing

```json
"rewrites": [{ "source": "/(.*)", "destination": "/api/index" }]
```

Everything — `/`, `/assets/*.js` (served **patched** by `getPatched*Bundle()`),
`/__auth/*`, `/__leaderboard`, `/api/*` — is handled by the function. This is
required: the bundle patches only exist at serve time, so the patched chunks
must never be served as raw static files.

### File inclusion

```json
"functions": {
  "api/index.js": { "includeFiles": "public/**", "maxDuration": 300 }
}
```

Vercel's [Node File Trace](https://github.com/vercel/nft) bundles code the
function imports; `public/` files are read at runtime by dynamic name, so
`includeFiles` (glob patterns are **relative to the project root**) ships the
whole compiled app inside the function. `server.mjs` sits at the repo root, so
its `__dirname`-derived paths (`public/assets/...`) resolve correctly in the
bundled function.

### Fluid compute (enabled by default)

Function instances stay warm across requests and process multiple invocations
per instance, so the in-memory bundle-patch caches are built once per cold
start, not per request. No configuration needed.

## Prerequisites

- A [Vercel account](https://vercel.com) (Hobby is enough; the function fits
  the Hobby limits: 300 s max duration, default memory).
- This repo on GitHub (`github.com/Suydev/isotope-code`).
- A Supabase project — the same one the APK uses (`SUPABASE_URL` /
  `SUPABASE_ANON_KEY`).

## Environment variables

Set these in **Project → Settings → Environment Variables** (all environments):
Production, Preview, Development.

| Variable | Required | Value |
|---|---|---|
| `SUPABASE_URL` | yes | `https://<your-ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | yes | The project's anon key (JWT-like, 3 dot-separated parts). The server validates the format and exits if invalid. |
| `SUPABASE_SERVICE_ROLE_KEY` | no | Only if you use admin flows. Leave unset otherwise. |
| `DISABLE_UPDATE_CHECK` | recommended | `1` — skips the `git rev-parse` calls in `/api/version` (git metadata is not meaningful on Vercel; the calls are try/caught and fall back to the VERSION file SHA anyway). |
| `ENABLE_ADMIN_MODE` | no | Leave **unset**. Owner-only tooling, never needed for the deployed app. |

No other env vars are required. `.env` is NOT committed and is NOT needed on
Vercel — set everything in the dashboard.

## Deploy — Git integration (recommended)

1. Push this repo to GitHub with `api/index.js` and `vercel.json` committed.
2. Go to [vercel.com/new](https://vercel.com/new) → import `Suydev/isotope-code`.
3. Vercel detects no framework ("Other") and reads `vercel.json` automatically:
   no Build Command, no Output Directory, one function.
4. Add the environment variables from the table above.
5. Click **Deploy**. Every push to the tracked branch (default `main`)
   auto-deploys; PRs get preview URLs.

## Deploy — CLI

```bash
# Authenticate
npx vercel login

# Link the local folder to a Vercel project (creates it if needed)
npx vercel link

# Add environment variables (repeat per variable; follow the prompts)
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_ANON_KEY production
npx vercel env add DISABLE_UPDATE_CHECK production

# Deploy to production
npx vercel --prod
```

## Test locally with the Vercel runtime

```bash
# Verifies env vars exist in .env or the shell environment
npx vercel dev
```

Or verify the adapter in plain Node (warm-up + patch logs, exits 0):

```bash
SUPABASE_URL=... SUPABASE_ANON_KEY=... node api/index.js
```

## Supabase configuration (shared with the APK)

- **Redirect URLs** must include the deployed Vercel domain(s):
  `https://<project>.vercel.app` (and your custom domain if you add one), plus
  `isotopeai://auth/callback` for the APK. Set in Supabase Auth → URL
  Configuration.
- **Migrations are NOT auto-applied** by Vercel. Apply `sql/*.sql` to the
  Supabase project manually (or via the SQL editor). The APK's
  `supabase/*.sql` directory is the migration source of truth for the shared
  project.

## Limitations & notes

- **Cold starts**: the first request after an idle period rebuilds the patch
  caches (~1 s). Fluid compute keeps instances warm afterwards; region failover
  handles outages. No action needed.
- **In-memory state** (auth rate limiter, caches) resets per instance. The rate
  limiter is per-instance rather than global — acceptable for the deployed app;
  Supabase enforces the real auth limits server-side.
- **No WebSockets** are used by this app, so the WebSocket limits do not apply.
- **Offline handling** is built in: Supabase-unreachable requests return 503
  with `Retry-After` instead of 500.
- **The APK is unaffected**: the APK ships its own `android-bridge.js` and does
  not call this server. Deploying to Vercel changes nothing for the APK.
- **Docker files** (`Dockerfile`, `render.yaml`, `railway.toml`) remain for
  long-running hosts, which have no cold starts. Vercel and those hosts can
  coexist; point the APK/web at whichever you prefer.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `500 FUNCTION_INVOCATION_FAILED` | Missing/invalid env vars — the server's `[Config]` guard calls `process.exit(1)` at cold start | Check the function logs for `[Config] Missing required environment variables` / `Invalid SUPABASE_URL`; fix the env vars and redeploy. |
| `ENOENT ... public/assets/...` | `public/**` not included in the function bundle | Confirm `vercel.json` has `includeFiles: "public/**"` and that `public/` is committed (not gitignored). |
| Deploy builds an empty/static site | `vercel.json` missing at the repo root, so Vercel guessed a static preset | Ensure `vercel.json` (with `"framework": null`) is committed. |
| Patches missing on served bundles | Requests bypassing the function (e.g. a static output dir configured) | Remove any `outputDirectory` setting; every path must rewrite to `/api/index`. |
| Function timeout on heavy requests | `maxDuration` too low | Hobby max is 300 s; `vercel.json` already sets 300. |

## Rollback

Use **Deployments → … → Instant Rollback** in the dashboard, or redeploy a
previous commit: `npx vercel --prod` from that commit's checkout. No database
state changes are involved in a rollback.
