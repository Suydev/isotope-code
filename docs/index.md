---
title: IsotopeAI Setup Guide
description: Simple install and sync guide for Android, Windows, macOS, and Linux.
---

# IsotopeAI

IsotopeAI is a study app you run on your own device.

Use it for focus sessions, tasks, subjects, habits, exams, tests, mock tests, and study stats.

Main links:

- [GitHub repository](https://github.com/Suydev/isotope-code)
- [README](https://github.com/Suydev/isotope-code/blob/main/README.md)
- [Sync system](./sync-system.md)
- [Backup storage system](./storage-backup-system.md)
- [Supabase connection map](./supabase-connection-map.md)

## Install

### Android with Termux

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)
```

### Linux

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh
isotope start
```

### macOS

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
bash setup.sh
isotope start
```

### Windows PowerShell

```powershell
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
.\install.ps1
```

Open:

```text
http://127.0.0.1:3000
```

## Supabase

Use Supabase for login, backup, restore, avatars, and community features.

1. Create a free Supabase project.
2. Run `isotope-complete.sql` in SQL Editor.
3. Add your Project URL and anon key to `.env`.

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

Never commit `.env`.

Never put the service-role key in frontend code.

## Safe Sync

Main backup:

```text
{userId}/backups/latest.json
```

Mirror:

```text
{userId}/cloud-snapshot/latest.json
```

Safety rule:

If this device is empty and cloud has study data, upload is blocked until cloud data is restored.

Block code:

```text
BLOCKED_EMPTY_OVERWRITE
```

## Help

```bash
isotope doctor
isotope logs
isotope repair
isotope update
```
