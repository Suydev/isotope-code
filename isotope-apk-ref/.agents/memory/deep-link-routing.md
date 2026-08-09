---
name: Android deep link routing
description: How invite/community deep links are handled — manifest, MainActivity, android-bridge
---

## Intent filters added to AndroidManifest.xml
```xml
<!-- HTTPS verified app links -->
<intent-filter android:autoVerify="true">
  https://isotopeai.in/invite/*
  https://www.isotopeai.in/invite/*
  https://isotopeai.in/community/*
<!-- Custom scheme fallback (no assetlinks.json needed) -->
<intent-filter>
  isotopeai://invite/*  (isotopeai://anything)
```

## MainActivity.java methods added
- `handleDeepLinkIntent(intent, immediate)` — called in onCreate (cold, immediate=false) and onNewIntent (warm, immediate=true)
- `resolveDeepLinkRoute(uri)` — maps URI to internal /invite/<code> or /community/<path>; returns null for unrecognised URIs
- `navigateWebViewTo(route)` — tries `window.__iso_navigate`, then `history.pushState+popstate`, then `location.href`

## android-bridge.js
- `window.__ISO_INVITE_DOMAIN__` = 'https://isotopeai.in' (already set before this session)
- `window.__isoGetInviteUrl(code, type)` — returns isotopeai:// for type='app', https:// otherwise
- Invite code navigation (openJoinModal) uses __iso_navigate → pushState → location.href

## Cold start timing
Cold start defers WebView navigation by 1500ms via Handler.postDelayed to wait for React app to mount. Warm start is immediate.

## Remaining gap
Android App Links (verified HTTPS) require `assetlinks.json` at `https://isotopeai.in/.well-known/assetlinks.json`. Without it, Chrome will ask the user which app to open. Custom scheme `isotopeai://` bypasses this but requires the user to have the app already.
