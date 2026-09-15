# Vercel — isotope-code

## What Vercel gives you (and what it does not)

Vercel runs **serverless Functions** on Fluid compute — there is no always-on
server. `server.mjs` is a long-running `http.createServer` app, so it is NOT
deployed as-is. Instead a two-file adapter is used:

| File | Role |
|---|---|
| `api/index.js` | Vercel Function entry. Intercepts `http.createServer` before importing `server.mjs`, captures its request handler, fakes the `listen()` lifecycle (warm-up hooks run once per cold start), re-exports the handler as a standard Vercel request handler. |
| `vercel.json` | Wires the adapter in: routes every path to the function, bundles `public/**` into the function, disables static-file serving, sets the plan's max duration. |

Fluid compute (enabled by default) keeps instances warm, so in-memory patch
caches survive across requests. Limits: Hobby max function duration 300s.

## Why everything rewrites to the function

`server.mjs` serves `public/assets/*.js` through `getPatched*Bundle()` — the
serve-time bundle patches only exist in memory. Vercel's filesystem layer serves
raw static files **before** rewrites run, so if `public/` is treated as a
static output, `/assets/...` requests are answered with the unpatched files and
the whole feature set silently breaks.

`vercel.json` therefore sets `"outputDirectory": ".vercel-empty-output"` (an
empty tracked folder) so Vercel produces **no static output**, and every
request falls through to `rewrites` → `/api/index`. `public/` reaches the
function only via `includeFiles`, where the patched in-memory handlers read it.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "functions": {
    "api/index.js": {
      "includeFiles": "public/**",
      "maxDuration": 300
    }
  },
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }],
  "outputDirectory": ".vercel-empty-output"
}
```

- `framework: null` — "Other" preset; no build step.
- `includeFiles: "public/**"` — globs are **project-root relative**; ships the
  compiled app inside the function bundle.
- `maxDuration: 300` — Hobby plan maximum.

## Environment variables

Set in Project → Settings → Environment Variables (Production + Preview):

| Variable | Required | Notes |
|---|---|---|
| `SUPABASE_URL` | yes | must be `https://<ref>.supabase.co` (validated at startup; the function exits otherwise) |
| `SUPABASE_ANON_KEY` | yes | must be JWT-like (3 dot-separated segments) |
| `SUPABASE_SERVICE_ROLE_KEY` | no | **omit it** — the server's config guard exits if it is set but not JWT-like |
| `DISABLE_UPDATE_CHECK` | recommended | `1` — the `/api/version` git SHA calls fall back to the VERSION file instead |

`SUPABASE_URL`/`SUPABASE_ANON_KEY` are the same values as the APK project
(`supabase.config.json` in isotope-apk).

## Deploy (CLI)

```bash
npx vercel login
npx vercel link                 # from the isotope-code repo root
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_ANON_KEY production
echo 1 | npx vercel env add DISABLE_UPDATE_CHECK production
npx vercel --prod
```

The project was created by CLI; for continuous deploys connect the GitHub
repo (Dashboard → Project → Git → Connect Repo, branch `main`).

## Gotchas learned the hard way

1. **SSO deployment protection**: new projects may have SSO protection on
   ("all_except_custom_domains"). Public traffic gets a 302 to
   `vercel.com/sso-api` and every request fails behind it. Disable with:
   `npx vercel project protection disable isotope-code --sso`
2. **Static output shadows the function**: if `public/` is the output
   directory, `/assets/*` is served raw (unpatched) — always verify a served
   bundle actually contains a patch marker, e.g.
   `curl <url>/assets/communityApi-Ccw5N_9O.js | grep -c "const s=()=>!1;"`
3. **Invalid env values kill cold start**: any config guard that calls
   `process.exit(1)` becomes a hard `500 FUNCTION_INVOCATION_FAILED` with the
   reason in `npx vercel logs <deployment-url>`.
4. The APK is completely unaffected — it ships its own bridge and does not
   call this server.

## Verify a deployment

```bash
URL=<deployment-url>
curl -s -o /dev/null -w "%{http_code}\n" $URL/            # 200
curl -s $URL/api/health                                    # {"ok":true,...}
curl -s $URL/assets/communityApi-Ccw5N_9O.js | grep -c "const s=()=>!1;"   # 1
curl -s $URL/assets/Community-CEnEgsrd.js | grep -c "Generate my buddy code" # 1
```

## Rollback

Dashboard → Deployments → previous deployment → "Promote to production", or
`npx vercel rollback`.
