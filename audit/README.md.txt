FILE IDENTITY

- original path: README.md
- audit path: audit/README.md.txt
- audited commit: 34c3836e45030eb67c4e0f0bf654d30db0509b89
- tracked or untracked: tracked (tracked)
- file type: markdown
- MIME type: text/markdown
- size in bytes: 8072
- SHA-256: fdd37015c9c61a3ac9043a77a6750f783c45b3b3a519fdd0af53ea2128413b1e
- text encoding when applicable: utf-8 or ascii-compatible text
- executable status: not executable
- generated/minified status: authored or hand-maintained
- primary subsystem: documentation
- primary auditor: documentation-ci-agent
- review status: lead-generated; cross-cutting static review applied
- confidence: MEDIUM

PURPOSE

Human-facing documentation or operational notes that should align with the implementation.

ROLE IN THE APPLICATION

- subsystem: documentation
- runtime stage: development, installation, or documentation
- user-visible feature: documentation
- whether it is active: referenced
- whether it is generated: authored or hand-maintained
- whether it is comparison/reference material: not primarily
- whether it is legacy: no direct legacy-only signal
- whether it appears unused: not proven unused

REFERENCES AND CONSUMERS

Confirmed imports, importers, HTML references, CSS references, manifest references, service-worker references, script references, installer references, documentation references, filesystem reads, route consumers, and database consumers found by direct search:
- .github/workflows/ci.yml:207 - README.md
- .github/workflows/pages.yml:8 - - README.md
- .github/workflows/regenerate-release.yml:112 - README.md
- .github/workflows/release.yml:197 - README.md
- CHANGELOG.md:207 - - `README.md` version badge updated to `3.3.0`.
- CHANGELOG.md:238 - - `README.md` version badge updated to `3.2.0`.
- CHANGELOG.md:279 - - `README.md` version badge updated to `3.1.3`.
- docs/BUG_FIXES.md:290 - | `README.md` | Documentation added |
- docs/BUG_FIXES.md:299 - 4. **36176206** — `README.md`: Add bug fixes section with testing recommendations
- docs/BUG_FIXES.md:305 - See [README.md](../README.md) or [AGENTS.md](../AGENTS.md) for more context.
- docs/assets/site.js:74 - { title: 'README', desc: 'Main repository guide', href: 'https://github.com/Suydev/isotope-code/blob/main/README.md', tag: 'github' },
- docs/index.html:161 - <p>Repository: <a href="https://github.com/Suydev/isotope-code">Suydev/isotope-code</a>. Full README: <a href="https://github.com/Suydev/isotope-code/blob/main/README.md">GitHub README</a>.</p>
- scripts/validate-docs.mjs:5 - *   1. All image paths referenced in README.md exist in the repo
- scripts/validate-docs.mjs:46 - const README   = readText('README.md');
- scripts/validate-docs.mjs:70 - info('Checking README.md...');
- scripts/validate-docs.mjs:72 - error('README.md not found');
- scripts/validate-docs.mjs:74 - ok('README.md exists', `(${README.length} chars)`);
- scripts/validate-docs.mjs:216 - 'README.md',
- server.mjs:3017 - '<a class="iso-docs" href="https://github.com/Suydev/isotope-code/blob/main/README.md#updating" target="_blank" rel="noreferrer">Open docs / troubleshooting</a>' +

INTERNAL STRUCTURE

- line count: 358
- imports:
None observed.
- exports:
None observed.
- functions/async flows:
None observed.
- classes:
None observed.
- constants/mutable state candidates:
None observed.
- handlers/lifecycle candidates:
None observed.

INPUTS

- parameters: not directly observed
- environment variables:
- ADMIN: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=.github/workflows/ci.yml:208, .github/workflows/ci.yml:242, .github/workflows/ci.yml:285, .github/workflows/regenerate-release.yml:113, .github/workflows/release.yml:198, README.md:47, README.md:175, README.md:187, README.md:188, README.md:237, README.md:238, README.md:239
- ADMIN_EMAIL: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=.env.example:28, .env.example:29, .env.example:32, ADMIN.md:31, ADMIN.md:32, ADMIN.md:50, ADMIN.md:51, ADMIN.md:195, ADMIN.md:428, ADMIN.md:429, ADMIN.md:450, ADMIN.md:459
- ADMIN_SECRET: classification=secret; required=unknown from static map; inspect use locations; uses=.env.example:25, .github/workflows/ci.yml:242, .github/workflows/ci.yml:285, ADMIN.md:29, ADMIN.md:47, ADMIN.md:54, ADMIN.md:431, ADMIN.md:539, CHANGELOG.md:365, CHANGELOG.md:489, CHANGELOG.md:565, README.md:238
- BLOCKED_EMPTY_OVERWRITE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=README.md:227, docs/index.html:137, docs/index.md:35, docs/sync-system.md:29, docs/sync.html:93, scripts/prove-new-browser-restore.mjs:44, server.mjs:901, server.mjs:988, server.mjs:1052, server.mjs:4452, server.mjs:4459, server.mjs:5603
- CHANGELOG: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=.github/PULL_REQUEST_TEMPLATE.md:17, .github/workflows/ci.yml:209, .github/workflows/release.yml:70, .github/workflows/release.yml:71, .github/workflows/release.yml:73, .github/workflows/release.yml:78, .github/workflows/release.yml:80, .github/workflows/release.yml:92, .github/workflows/release.yml:94, .github/workflows/release.yml:138, .github/workflows/release.yml:140, .github/workflows/release.yml:145
- ENABLE_ADMIN_MODE: classification=public/configuration; required=optional/defaulted; uses=.env.example:18, .env.example:19, ADMIN.md:28, ADMIN.md:46, ADMIN.md:440, ADMIN.md:441, CHANGELOG.md:489, README.md:175, README.md:187, README.md:188, README.md:237, artifacts/isotope/.env:24
- ISOTOPE_ENV_FILE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=ADMIN.md:439, README.md:186, scripts/prove-supabase-sync.mjs:4, setup.sh:26, setup.sh:254, setup.sh:255, setup.sh:258
- LICENSE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=CHANGELOG.md:259, README.md:358, artifacts/asset-diff/remote-assets/vendor-charts-CFLJvnG7.js:11, artifacts/asset-diff/remote-assets/vendor-charts-CFLJvnG7.js:19, artifacts/asset-diff/remote-assets/vendor-charts-CFLJvnG7.js:59, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:8, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:16, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:24, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:32, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:40, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:55, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:63
- MIT: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=CHANGELOG.md:259, README.md:358, artifacts/asset-diff/remote-assets/vendor-charts-CFLJvnG7.js:10, artifacts/asset-diff/remote-assets/vendor-charts-CFLJvnG7.js:18, artifacts/asset-diff/remote-assets/vendor-charts-CFLJvnG7.js:58, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:7, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:15, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:23, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:31, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:39, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:54, artifacts/asset-diff/remote-assets/vendor-react-BfU3Zn2J.js:62
- PORT: classification=public/configuration; required=optional/defaulted; uses=.env.example:15, .github/workflows/ci.yml:287, .github/workflows/regenerate-release.yml:127, .github/workflows/release.yml:213, ADMIN.md:434, ADMIN.md:462, README.md:174, README.md:289, TERMUX_WIDGET.md:62, artifacts/isotope/.env:44, bin/isotope:11, bin/isotope:23
- REPL: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=ADMIN.md:310, README.md:298
- SUPABASE_ANON_KEY: classification=public/configuration; required=required for cloud/auth features; uses=.env.example:3, .env.example:11, .github/workflows/ci.yml:283, .github/workflows/regenerate-release.yml:129, .github/workflows/release.yml:215, ADMIN.md:23, ADMIN.md:368, ADMIN.md:425, README.md:173, README.md:187, README.md:290, artifacts/isotope/.env:12
- SUPABASE_SERVICE_ROLE_KEY: classification=secret; required=unknown from static map; inspect use locations; uses=.env.example:22, .github/workflows/ci.yml:242, ADMIN.md:30, ADMIN.md:48, ADMIN.md:426, ADMIN.md:449, ADMIN.md:491, README.md:242, artifacts/isotope/.env:16, docs/admin.html:60, scripts/prove-new-browser-restore.mjs:10, scripts/prove-supabase-sync.mjs:25
- SUPABASE_URL: classification=public/configuration; required=required for cloud/auth features; uses=.env.example:3, .env.example:8, .github/workflows/ci.yml:282, .github/workflows/regenerate-release.yml:128, .github/workflows/release.yml:214, ADMIN.md:23, ADMIN.md:285, ADMIN.md:366, ADMIN.md:410, ADMIN.md:424, README.md:172, README.md:187
- command-line arguments: not directly observed
- request data: not directly observed
- headers/cookies: not directly observed
- files: not directly observed
- database data:
None observed.
- network responses:
- http://127.0.0.1:3000
- http://127.0.0.1:3000/__admin
- http://127.0.0.1:3000/auth
- https://github.com/Suydev/isotope-code.git
- https://img.shields.io/badge/docs-animated%20GitHub%20Pages-8df31f
- https://img.shields.io/badge/version-3.3.8-314f28
- https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh
- https://supabase.com
- https://suydev.github.io/isotope-code/
- https://suydev.github.io/isotope-code/admin.html
- https://suydev.github.io/isotope-code/gallery.html
- https://suydev.github.io/isotope-code/install.html
- https://suydev.github.io/isotope-code/sync.html
- https://your-project-ref.supabase.co
- browser storage:
- 324: caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => location.reload())
- user interactions: not directly observed

OUTPUTS AND SIDE EFFECTS

- 136: isotope update             # update from GitHub
- 222: If this device is empty and cloud has a richer backup, upload is blocked. The app must restore cloud data first.
- 294: | Update failed | `isotope doctor`, then `isotope repair` |
- 324: caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => location.reload())

DATA FLOW

Data flow is indirect through imports, script execution, documentation, installation, or asset consumption as listed in references.

DEPENDENCIES

- platform dependencies: none beyond repository/runtime context observed
- Node core modules:
- 12: <a href="./CHANGELOG.md"><img alt="Version" src="https://img.shields.io/badge/version-3.3.8-314f28"></a>
- 13: <a href="https://suydev.github.io/isotope-code/"><img alt="Docs" src="https://img.shields.io/badge/docs-animated%20GitHub%20Pages-8df31f"></a>
- 17: <a href="https://suydev.github.io/isotope-code/">Animated docs</a>
- 19: <a href="https://suydev.github.io/isotope-code/install.html">Install</a>
- 21: <a href="https://suydev.github.io/isotope-code/sync.html">Sync safety</a>
- 23: <a href="https://suydev.github.io/isotope-code/admin.html">Admin proof</a>
- 25: <a href="https://suydev.github.io/isotope-code/gallery.html">Screenshots</a>
- 29: <a href="https://suydev.github.io/isotope-code/gallery.html">
- 44: - Animated web guide: https://suydev.github.io/isotope-code/
- 45: - Install guide: https://suydev.github.io/isotope-code/install.html
- 46: - Screenshot gallery: https://suydev.github.io/isotope-code/gallery.html
- 58: bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
- 70: http://127.0.0.1:3000
- 76: git clone https://github.com/Suydev/isotope-code.git
- 87: git clone https://github.com/Suydev/isotope-code.git
- 98: git clone https://github.com/Suydev/isotope-code.git
- 106: git clone https://github.com/Suydev/isotope-code.git
- 114: http://127.0.0.1:3000
- 159: 1. Create a free project at https://supabase.com
- 172: SUPABASE_URL=https://your-project-ref.supabase.co
- 247: http://127.0.0.1:3000/__admin
- 288: | App does not open | `isotope start` then open `http://127.0.0.1:3000` |
- 300: Use the browser console on `http://127.0.0.1:3000/auth`:
- 315: To prove the configured Supabase project can perform the Storage-backed sync path end to end:
- external libraries:
None observed.
- local files: see References and Consumers above
- browser APIs:
- 298: Do not test browser globals in the Node REPL. Node has no `window`, so `typeof window.__isoLogin` is not a valid Node check.
- 303: typeof window.__isoLogin
- 304: typeof window.__isoUp
- 324: caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => location.reload())
- 330: typeof window.__isoGetValidJwt
- operating-system commands:
- 57: ```bash
- 58: bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
- 63: ```bash
- 75: ```bash
- 76: git clone https://github.com/Suydev/isotope-code.git
- 78: bash setup.sh
- 86: ```bash
- 87: git clone https://github.com/Suydev/isotope-code.git
- 89: bash setup.sh
- 97: ```powershell
- 98: git clone https://github.com/Suydev/isotope-code.git
- 106: git clone https://github.com/Suydev/isotope-code.git
- 122: - npm
- 131: ```bash
- 262: ```bash
- 263: node scripts/repair-user-backup.mjs --user <user-id> --dry-run
- 268: ```bash
- 269: node scripts/repair-user-backup.mjs --user <user-id> --apply
- 274: ```bash
- 275: node scripts/validate-backup-files.mjs --user <user-id>
- 280: ```bash
- 281: node scripts/validate-storage-cleanup.mjs --user <user-id> --dry-run
- 311: ```bash
- 312: npm run test:auth-bridge
- 317: ```bash
- 318: npm run test:supabase-sync
- 337: ```bash
- 338: node --check server.mjs
- 339: node --check server/backup-manager.mjs
- 340: node --check public/sync/backup-normalizer.js
- 341: node --check public/sync/local-data-adapter.js
- 342: node scripts/validate-backup-files.mjs --user <user-id>
- 343: node scripts/repair-user-backup.mjs --user <user-id> --dry-run
- 344: npm run assets:compare
- Supabase interfaces:
- 40: - Optional Supabase login, backup, restore, and community features
- 144: ## Supabase Setup
- 146: The app works best with your own Supabase project.
- 148: You need Supabase for:
- 159: 1. Create a free project at https://supabase.com
- 172: SUPABASE_URL=https://your-project-ref.supabase.co
- 173: SUPABASE_ANON_KEY=your-anon-public-key
- 187: - Existing `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `ENABLE_ADMIN_MODE` values are preserved.
- 242: Add `SUPABASE_SERVICE_ROLE_KEY` only in your private `.env` when you need admin repair tools.
- 290: | Login fails | Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` |
- 315: To prove the configured Supabase project can perform the Storage-backed sync path end to end:
- 318: npm run test:supabase-sync
- 327: If the top-right cloud sync button says `Authentication required`, the browser is not holding a valid Supabase session even if the app shell still looks logged in. Sign out, sign in again through `/auth`, then run:
- external services: http://127.0.0.1:3000, http://127.0.0.1:3000/__admin, http://127.0.0.1:3000/auth, https://github.com/Suydev/isotope-code.git, https://img.shields.io/badge/docs-animated%20GitHub%20Pages-8df31f, https://img.shields.io/badge/version-3.3.8-314f28, https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh, https://supabase.com, https://suydev.github.io/isotope-code/, https://suydev.github.io/isotope-code/admin.html, https://suydev.github.io/isotope-code/gallery.html, https://suydev.github.io/isotope-code/install.html, https://suydev.github.io/isotope-code/sync.html, https://your-project-ref.supabase.co

SECURITY AND PRIVACY

- Contains or references auth/session/secret-sensitive concepts; verify server-only boundaries and browser exposure.

CORRECTNESS AND FAILURE MODES

- Depends on asynchronous I/O or browser/server storage; failure modes include network loss, stale state, partial writes, and malformed data.

OFFLINE AND LOCAL-FIRST BEHAVIOUR

- Participates in offline/local-first behavior or references browser persistence/cache APIs.

PERFORMANCE

- No major static performance concern observed.

MAINTAINABILITY

- Maintained through existing repository structure; no direct maintainability issue confirmed.

FINDINGS

- finding ID: ISO-AUDIT-0024-01
  severity: INFO
  category: audit
  status: CONFIRMED
  confidence: MEDIUM
  affected lines or byte-level evidence: README.md inspected; no file-specific high-risk issue confirmed
  observed evidence: README.md inspected; no file-specific high-risk issue confirmed
  inferred impact: No direct issue was confirmed from static evidence in this file.
  reproduction or reasoning: Inspect the referenced path and line or byte metadata; no runtime mutation was used.
  recommended correction: Keep covered by relevant smoke/static tests.
  related files: .github/workflows/ci.yml, .github/workflows/pages.yml, .github/workflows/regenerate-release.yml
  regression risk: Review behavior against existing tests before changing.

POSITIVE OBSERVATIONS

- File was included through a deterministic manifest rather than filename-only guessing.
- Tracked by Git, which improves reproducibility of audit evidence.
- At least one direct reference/consumer was found.

RECOMMENDED TESTS

- Keep this file covered by repository smoke tests or reference checks appropriate to its subsystem.

FINAL VERDICT

- role: Human-facing documentation or operational notes that should align with the implementation.
- activity status: referenced
- reliability: MEDIUM; static audit only, runtime behavior should be verified by targeted tests.
- largest risk: subsystem-specific drift from implementation
- highest-value improvement: keep references/tests aligned with actual consumers
