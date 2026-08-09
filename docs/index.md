---
title: IsotopeAI Docs
description: Install, sync, backup, admin, and screenshot docs for IsotopeAI.
---

# IsotopeAI Docs

Open the animated GitHub Pages site:

https://suydev.github.io/isotope-code/

One-line installers (all pull the latest `main` branch):

- Android Termux: `bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install-termux.sh)`
- Linux / macOS: `bash <(curl -fsSL https://raw.githubusercontent.com/Suydev/isotope-code/main/install.sh)`
- Windows PowerShell: `irm https://raw.githubusercontent.com/Suydev/isotope-code/main/install.ps1 | iex`

Main pages:

- [Install guide](./install.html)
- [Sync and backup guide](./sync.html)
- [Admin and browser proof guide](./admin.html)
- [Screenshot gallery](./gallery.html)
- [Motion design notes](./motion.html)

Deep technical docs:

- [Sync system](./sync-system.md)
- [Storage backup system](./storage-backup-system.md)
- [Supabase connection map](./supabase-connection-map.md)

Safety rule:

```text
If this device is empty and cloud has study data, upload is blocked until cloud data is restored.
```

Block code:

```text
BLOCKED_EMPTY_OVERWRITE
```
