---
title: IsotopeAI Local
description: A local study app with Supabase cloud sync.
---

# IsotopeAI Local

Install it on your own device. Open it in your browser. Study offline where possible. Sync online through the Isotope Supabase cloud.

## Start Fast

- Windows: run `setup.bat`
- macOS/Linux/Termux: run `./setup.sh`
- PowerShell: run `./install.ps1`

The default public Supabase config is already included for normal users. Owner/admin keys stay blank unless you privately enable admin mode.

## What It Is

A portable local software package:

```
your device -> local Node server -> browser app
                         -> Supabase cloud sync when online
```

It is not a VPS requirement and not a centrally hosted website.

## Online Sync

Supabase handles auth, profiles, onboarding, community groups, events, chat, storage, leaderboard, notifications, and realtime.

## Offline Support

The local server keeps the app open when the network is down. Study workspace pages and cached assets continue to work; cloud-only widgets degrade instead of crashing.

## Admin

Open `/__admin/login` only if you own the Supabase project. Unlock with a private admin secret, an allowed Supabase admin email, or an admin role in `user_roles`.
