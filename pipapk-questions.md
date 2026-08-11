# pipapk Planning — ANSWERED

## Goal
pipapk = Timer overlay only (like isotope-apk's FloatingTimerService)
- Same UI as isotope-apk
- Same buttons
- Same pipeline
- Same error handling

---

## Q1: How does the browser trigger the overlay?
**Answer:** HTTP polling (Recommended)
- Browser `/focus` page → `POST /__pip/state` with `{active:true}` → server cache
- pipapk polls `GET /api/pip/state` → sees active → auto-starts overlay

---

## Q2: What happens when overlay starts?
**Answer:** Show as overlay + Auto PiP + Check overlay permission
- Same as PC browser PiP but Android overlay like isotope-apk
- Shows immediately as floating card over other apps
- Needs "Display over other apps" permission first
- Enters system PiP mode automatically

---

## Q3: UI elements
**Answer:** Same as isotope-apk (Recommended)
- Progress strip (4dp, brand color)
- Header (heading + expand/close buttons)
- Focus type chip
- Timer text (56sp monospace bold)
- Status row (dot + text)
- Question section:
  - Attempted text + target button
  - Target editor row (minus, value, plus, zero)
  - Result buttons (correct, incorrect, skipped)
  - Undo button
- Resize handle (bottom-right)

---

## Q4: Button action flow
**Answer:** Round-trip via server (Recommended)
1. Button pressed → `PipClient.postAction("correct", -1)`
2. POST to `/api/pip/action`
3. Server broadcasts via SSE to `/focus` page
4. `/focus` page applies to real Zustand store

---

## Q5: Error handling
**Answer:** Notification channel + Position persistence + Auto-stop + Connection status
- Permission check in app (main activity), NOT in overlay
- Create notification channel for foreground service
- Save/restore position and size via SharedPreferences
- Graceful stop when timer becomes inactive
- Show connection status (server online/offline)

---

## Q6: Fallback messages
**Answer:** All options
- Server offline badge
- Last known state
- Permission denied message
- Reconnecting indicator

---

## Q7: Overlay stop
**Answer:** Close button + Expand button + all buttons like isotope-apk
- Close button (×) stops overlay
- Expand button (↗) opens app
- All other buttons work like isotope-apk

---

## Q8: Auto-restart
**Answer:** Auto-restart (Recommended)
- Auto-restart on next poll when server detects active timer

---

## Q9: Main activity
**Answer:** Settings screen
- Settings screen for overlay configuration

---

## Q10: Offline auth errors
**Answer:** Browser /focus page
- Errors were in the browser /focus page when pressing PiP button
- Not in pipapk app or isotope-apk app

---

## Q11: Offline behavior (CRITICAL)
**Answer:** App goes dead when offline
- "Who are you? I need Supabase" → asks for auth
- Needs Supabase tokens to function
- Doesn't allow using offline
- Signs out when offline
- User wants: app should work offline WITHOUT Supabase auth

**Root cause:** 
- `__auth/bootstrap` returns 401 when no valid token
- Supabase refresh_token fails with ERR_INTERNET_DISCONNECTED
- Auth guard redirects to /auth after 9s timeout
- `api/health` returns 503 when Supabase unreachable

**Fix needed:**
- Server should serve cached bootstrap when offline
- App should use local session when Supabase unreachable
- Don't redirect to /auth when offline + cached profile exists

**Scope:** Fix server + pipapk

---

## Summary of Architecture

```
┌─────────────────────────────────────────────────────┐
│  BROWSER /focus PAGE                                │
│  - PIP_BRIDGE_JS relays state to POST /__pip/state  │
│  - Receives actions via SSE /__pip/events            │
│  - Applies to real Zustand store                     │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP (localhost)
┌─────────────────▼───────────────────────────────────┐
│  SERVER (server.mjs)                                │
│  - GET /api/pip/state → returns cached snapshot     │
│  - POST /api/pip/action → broadcasts via SSE        │
│  - POST /__pip/state → stores snapshot + seq++      │
│  - GET /__pip/events → SSE stream                   │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP polling (750ms)
┌─────────────────▼───────────────────────────────────┐
│  pipapk APP                                         │
│  - Settings screen (main activity)                  │
│  - FloatingTimerService (overlay)                   │
│    - Polls GET /api/pip/state every 750ms           │
│    - Shows floating card when timer active           │
│    - Buttons POST to /api/pip/action                │
│    - Auto-restarts on next poll                      │
│    - SharedPreferences for position/size            │
│    - Notification channel + foreground service       │
└─────────────────────────────────────────────────────┘
```

---

## Action Items

### Phase 1: Fix offline auth (server + pipapk)
1. [ ] Server: `__auth/bootstrap` → serve cached profile when offline (not 401)
2. [ ] Server: Auth guard → don't redirect to /auth when offline + cached profile
3. [ ] Server: `api/health` → return 200 with degraded status (not 503)
4. [ ] Server: Supabase refresh → catch ERR_INTERNET_DISCONNECTED, use cached session
5. [ ] pipapk: Show "server offline" badge + last known state
6. [ ] pipapk: Don't crash when server unreachable

### Phase 2: pipapk overlay (matching isotope-apk)
7. [ ] pipapk: Auto-start overlay when server detects active timer
8. [ ] pipapk: Auto-stop overlay when timer becomes inactive
9. [ ] pipapk: Match UI exactly to isotope-apk FloatingTimerService
10. [ ] pipapk: Add settings screen (main activity)
11. [ ] pipapk: Add error handling and fallback messages
12. [ ] pipapk: Test on device

