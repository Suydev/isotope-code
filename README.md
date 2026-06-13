<p align="center">
  <img src="./logo.svg" alt="IsotopeAI logo" width="76" height="76">
</p>

<h1 align="center">IsotopeAI</h1>

<p align="center">
  A study app you run on your own device.
</p>

<p align="center">
  <a href="./CHANGELOG.md"><img alt="Version" src="https://img.shields.io/badge/version-3.3.8-314f28"></a>
  <a href="https://suydev.github.io/isotope-code/"><img alt="Docs" src="https://img.shields.io/badge/docs-animated%20GitHub%20Pages-8df31f"></a>
</p>

<p align="center">
  <a href="https://suydev.github.io/isotope-code/">Animated docs</a>
  ·
  <a href="https://suydev.github.io/isotope-code/install.html">Install</a>
  ·
  <a href="https://suydev.github.io/isotope-code/sync.html">Sync safety</a>
  ·
  <a href="https://suydev.github.io/isotope-code/admin.html">Admin proof</a>
  ·
  <a href="https://suydev.github.io/isotope-code/gallery.html">Screenshots</a>
</p>

<p align="center">
  <a href="https://suydev.github.io/isotope-code/gallery.html">
    <img src="./screenshots/landingpage.png" alt="IsotopeAI landing page screenshot" width="860">
  </a>
</p>

It includes:

- Focus timer
- Tasks and subjects
- Study sessions and stats
- Habits, exams, tests, and mock tests
- Optional Supabase login, backup, restore, and community features

Start here:

- Animated web guide: https://suydev.github.io/isotope-code/
- Install guide: https://suydev.github.io/isotope-code/install.html
- Screenshot gallery: https://suydev.github.io/isotope-code/gallery.html
- Admin guide: [ADMIN.md](./ADMIN.md)
- Sync details: [docs/sync-system.md](./docs/sync-system.md)
- Backup storage details: [docs/storage-backup-system.md](./docs/storage-backup-system.md)

## Pick Your Device

### Android with Termux

Install Termux from F-Droid or GitHub, not the old Play Store app.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
```

After install:

```bash
isotope start
```

Open:

```text
http://127.0.0.1:3000
```

### Linux

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh
isotope start
```

### macOS

Install Git and Node.js first if you do not have them.

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh
isotope start
```

### Windows

Use PowerShell:

```powershell
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
.\install.ps1
```

Or use Command Prompt:

```bat
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
setup.bat
```

Then open:

```text
http://127.0.0.1:3000
```

## What Setup Does

Setup checks for:

- Node.js 18 or newer
- npm
- Git
- `.env`
- required scripts

It then installs the `isotope` command.

## Useful Commands

```bash
isotope start              # start the app
isotope stop               # stop the app
isotope restart            # restart the app
isotope open               # open in browser
isotope update             # update from GitHub
isotope status             # show status
isotope doctor             # find problems
isotope logs               # show logs
isotope repair             # repair install
isotope reinstall-widgets  # Android Termux widget shortcuts
```

## Supabase Setup

The app works best with your own Supabase project.

You need Supabase for:

- login
- sync
- cloud backup
- restore on a new device
- avatars
- groups and community features

Steps:

1. Create a free project at https://supabase.com
2. Open SQL Editor.
3. Paste and run [isotope-complete.sql](./isotope-complete.sql).
4. Create these Storage buckets if they do not already exist:
   - `avatars`
   - `user-content`
   - `notes`
5. Copy your Project URL and anon key.
6. Put them in `.env`.

Example:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
PORT=3000
ENABLE_ADMIN_MODE=false
```

Do not put a service-role key in the browser.

Do not commit `.env`.

### Setup Env Rules

- `.env` is the preferred runtime env file.
- If `.env` is missing and `yeh.env` exists, setup copies `yeh.env` to `.env`.
- If `ISOTOPE_ENV_FILE` is set, setup reads that file, copies it to `.env`, and uses the copied values.
- Existing `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `ENABLE_ADMIN_MODE` values are preserved.
- If `ENABLE_ADMIN_MODE` is missing, setup writes `ENABLE_ADMIN_MODE=false`.

## Safe Cloud Backup

The app now uses one backup system.

Main backup:

```text
{userId}/backups/latest.json
```

Backup history:

```text
{userId}/backups/history/{timestamp}-{hash}.json
```

Cloud mirror:

```text
{userId}/cloud-snapshot/latest.json
```

Old folders are still read for safety:

```text
{userId}/imports/latest.json
{userId}/exports/latest.json
{userId}/cloud-snapshot/latest.json
```

Important rule:

If this device is empty and cloud has a richer backup, upload is blocked. The app must restore cloud data first.

Blocked code:

```text
BLOCKED_EMPTY_OVERWRITE
```

## Admin Mode

Admin mode is optional.

Use it only on your own machine.

```env
ENABLE_ADMIN_MODE=true
ADMIN_SECRET=<long-random-secret>
ADMIN_EMAIL=<your-email@example.com>
```

Add `SUPABASE_SERVICE_ROLE_KEY` only in your private `.env` when you need admin repair tools.

Open:

```text
http://127.0.0.1:3000/__admin
```

Useful admin pages:

- `/__admin/verify`
- `/__admin/sync`
- `/__admin/storage`
- `/__admin/roles`
- `/__admin/patch`

## Backup Repair Commands

Dry-run first:

```bash
node scripts/repair-user-backup.mjs --user <user-id> --dry-run
```

Apply only after the dry-run looks safe:

```bash
node scripts/repair-user-backup.mjs --user <user-id> --apply
```

Check backups:

```bash
node scripts/validate-backup-files.mjs --user <user-id>
```

Preview cleanup:

```bash
node scripts/validate-storage-cleanup.mjs --user <user-id> --dry-run
```

## Troubleshooting

| Problem | Try this |
|---|---|
| App does not open | `isotope start` then open `http://127.0.0.1:3000` |
| Port is busy | `isotope stop` or set `PORT=3001` in `.env` |
| Login fails | Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` |
| Sync is blocked | Restore the cloud backup first |
| Storage permission error | Re-run `isotope-complete.sql` |
| Android widget is missing | `isotope reinstall-widgets` |
| Update failed | `isotope doctor`, then `isotope repair` |

### Runtime Login Bridge And Cache Troubleshooting

Do not test browser globals in the Node REPL. Node has no `window`, so `typeof window.__isoLogin` is not a valid Node check.

Use the browser console on `http://127.0.0.1:3000/auth`:

```js
typeof window.__isoLogin
typeof window.__isoUp
```

Both should return `"function"`.

Use the Node smoke test when a browser is not available:

```bash
npm run test:auth-bridge
```

To prove the configured Supabase project can perform the Storage-backed sync path end to end:

```bash
npm run test:supabase-sync
```

If a stale PWA or browser cache is serving old runtime files, clear runtime caches from the browser console:

```js
caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => location.reload())
```

If the top-right cloud sync button says `Authentication required`, the browser is not holding a valid Supabase session even if the app shell still looks logged in. Sign out, sign in again through `/auth`, then run:

```js
typeof window.__isoGetValidJwt
```

## For Contributors

Before changing sync, backup, auth, or SQL:

```bash
node --check server.mjs
node --check server/backup-manager.mjs
node --check public/sync/backup-normalizer.js
node --check public/sync/local-data-adapter.js
node scripts/validate-backup-files.mjs --user <user-id>
node scripts/repair-user-backup.mjs --user <user-id> --dry-run
npm run assets:compare
```

Rules:

- Do not commit `.env`.
- Do not expose service-role keys to the frontend.
- Do not weaken RLS to hide a bug.
- Do not let empty local data overwrite rich cloud data.
- Do not replace compiled assets from the live site unless the asset report proves the same chunk graph is available.
- Keep docs simple and true.

## License

MIT. See [LICENSE](./LICENSE).
