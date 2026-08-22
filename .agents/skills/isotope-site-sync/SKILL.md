---
name: isotope-site-sync
description: Sync a production isotopeai.in build back into the local isotope-code repo. Use when the user says the live site updated and wants new assets fetched, checked, renamed to local hash names, patched across references (index.html, sw.js, JS import strings), replaced into public/, and verified. Covers Obscura-rendered crawling of the SPA, content diffing, role-based hash renaming, reference patching, service worker list updates, and smoke testing.
---

# Isotope Site Sync

Pull an updated isotopeai.in production build into the local
`isotope-code` repo by hand, on demand. The live site is a Vite SPA whose
asset filenames carry build hashes that change every deploy; the local repo
uses its own set of hashed names that `server.mjs`, `public/sw.js`, and
`index.html` all hardcode. This skill renames remote assets to the local
hash names and patches every reference so nothing dangles.

## Trigger

Run this workflow only when the user says the live site updated (or asks to
"sync the site", "pull the new build", etc.). It is a manual, supervised
task — never automate it on a schedule.

## Environment

- Local repo: `~/isotope-code` (Termux path:
  `/data/data/com.termux/files/home/isotope-code`). All paths below are
  relative to this repo.
- Live site: `https://isotopeai.in` — Vite SPA, empty `<div id="root">`
  in raw HTML. Content exists only after JS renders, so plain `curl` gives
  empty shells.
- Renderer: Obscura headless browser, installed inside a Ubuntu proot:
  - CLI: `proot-distro login ubuntu -- /usr/local/bin/obscura fetch <url> --dump html --wait-until networkidle0 --timeout 30`
  - Wrappers: `~/bin/obscura-serve` (CDP server), `~/bin/obscura-mcp` (MCP)
  - If an Obscura MCP browser toolset is available in-session, prefer it for
    rendered HTML and DOM inspection.
- GitHub account: Suydev (`gh` CLI authenticated).

## Workflow

### 1. Fetch the new build

1. Get raw served HTML per route with plain fetch (fast, shows script/link tags):
   ```bash
   curl -s https://isotopeai.in/ -o /tmp/iso-root.html
   ```
2. Extract asset URLs: `<script src>`, `<link href>`, plus every
   `/assets/*` string in the HTML.
3. Get rendered HTML for each route via Obscura (routes include `/`,
   `/about`, `/demo`, `/features/*`, `/privacy`, `/terms`; re-scan anchors
   each run — routes change).
4. Download every referenced same-origin asset to a staging dir
   (`/tmp/iso-sync-<date>/`), preserving paths (`assets/`, `icons/`,
   `fonts/`, manifest). Add regex scan of downloaded JS for dynamic-import
   chunk names matching `assets/[A-Za-z0-9_.-]+\.(js|css|woff2?|png|svg)`
   and download those too; repeat until no new files appear.
5. Record which main-bundle hash each route referenced. If two different
   hashes appear across routes, the site redeployed mid-crawl — abort and
   re-run.

### 2. Diff against local

For each staged file, find the local counterpart in `public/assets/` by
role: strip the hash segment (`vendor-react-BWKHxYQy.js` → role
`vendor-react`, match `public/assets/vendor-react-*.js`).

Classify:

- **byte-identical** → skip
- **same role, different content** → update candidate
- **no local counterpart** → brand-new chunk
- **local file with no staged counterpart** → possibly removed upstream;
  flag, do not delete without confirming the live site no longer references it

Report the classification table to the user before changing anything.

### 3. Check candidates

- `node --check` every changed/new `.js` and `.mjs` file (use
  `node --input-type=module --check < file` for ESM).
- Compare file sizes against local counterparts; investigate large deltas.
- Grep new bundles for surprises: removed features, new external hosts,
  changed Supabase usage. Surface findings to the user.

### 4. Rename and patch

Write new content under the **local** hash name (role-matched), then patch
every reference from old remote names to local names using exact-string
replacement:

1. `index.html` — `<script src>`, `<link rel="stylesheet" href>`,
   `modulepreload` links.
2. JS chunks — Vite chunks import each other by exact hashed filename;
   replace old-name strings inside all mirrored/local JS files.
3. CSS — `url()` refs and `@import`.
4. **`public/sw.js`** — update `SHELL_URLS`, `LAZY_CACHE_URLS`,
   `RUNTIME_PATCHED_ASSET_PATHS`, and any other hardcoded hashed paths.
   Stale entries here silently break offline mode. Keep the server's
   self-check strings intact when editing any file (see Guardrails).
5. `server.mjs` — check `RUNTIME_PATCHED_ASSET_PATHS` equivalents /
   patch-target path lists for renamed files.
6. Non-hashed paths (`icons/`, `fonts/`, `manifest.webmanifest`) keep their
   names.

### 5. Replace and verify

1. Copy updated files into `public/` (and root HTML files if changed).
2. Syntax-check everything edited again.
3. Start the server and smoke-test:
   ```bash
   node server.mjs &   # then:
   curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/
   curl -s http://127.0.0.1:3000/sw.js | grep -c "<new-hash>"
   ```
4. Load `http://127.0.0.1:3000/` in the Obscura browser (MCP tools if
   available) and confirm the app boots with no console errors.
5. Report exactly what changed (added / updated / skipped / flagged) and
   leave changes uncommitted unless the user asked for a commit.

## Guardrails

- Never delete local assets without confirming the live site dropped them.
- Never mix builds: one sync session must contain assets from a single
  deploy of the live site (see mid-crawl drift check above).
- Preserve server self-test string assertions when editing
  `public/pwa-local.js` or `public/update-checker.js`
  (e.g. keep `fetch('/api/version'` present) — `server.mjs` verifies them.
- Offline behavior matters: after touching `sw.js`, re-read it fully to be
  sure no stale hash remains anywhere.
- Do not commit unless explicitly asked.
