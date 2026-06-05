---
title: IsotopeAI Local
description: A downloadable local-server study app with Supabase cloud sync.
---

# IsotopeAI Local

Isotope is downloadable software. Run the Node server on your own device, then open the app in your browser.

Supabase is backend/cloud sync only:

- Auth
- Database
- Storage
- Realtime
- Community/group sync
- Optional edge functions

Supabase is not static website hosting, a VPS replacement, or the main website. Do not try to open the app at `https://<project-ref>.supabase.co/`.

## Start Fast

- Windows: run `setup.bat`
- macOS/Linux/Termux: run `bash setup.sh`
- PowerShell: run `.\install.ps1`

Normal users only need `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Owner/admin fields stay blank unless private admin mode is enabled.

## Commands

After setup, run these from any directory:

```bash
isotope start
isotope stop
isotope restart
isotope update
isotope status
isotope doctor
isotope open
isotope logs
```

## Offline Support

After the first successful visit with the local server running, the browser caches the app shell and core assets.

If the local server later stops, the cached shell may still load. Local API routes and Supabase-backed features do not work until the server and network are available again. The UI shows an offline/server-unavailable indicator instead of pretending cloud features are online.

PWA service-worker activation reloads are guarded so a session performs at most one automatic refresh. The update banner only shows a command dialog for `isotope update`; it does not stop or restart the server from the browser.

## Android / Termux Widget

Install shortcuts with:

```bash
bash setup-termux-widget.sh
```

Then add Termux Widget buttons such as `isotope-start`, `isotope-update`, `isotope-open`, and `isotope-doctor` to the Android home screen.

The shortcut installer embeds the resolved absolute `isotope` command path where possible, so widgets keep working even if Android launches them without the interactive Termux `PATH`.

## Admin

Open `/__admin/login` only if you own the Supabase project. Unlock with a private admin secret, an allowed Supabase admin email, or an admin role in `user_roles`.
