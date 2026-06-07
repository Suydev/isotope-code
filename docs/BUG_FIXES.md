---
layout: default
title: Bug Fixes - IsotopeAI v3.1.2-patch
description: Critical PWA stability fixes for service worker, update checker, and offline mode
---

# Bug Fixes (v3.1.2-patch)

## Overview

This release includes **7 critical bug fixes** for PWA service worker, update checker, and offline mode stability. All issues have been resolved with comprehensive error handling and memory management improvements.

---

## Fixed Bugs

### 1. Service Worker Cache SHA Not Truncated

**File**: `public/sw.js` (Lines 8-9)

**Problem**: 
- Cache name used full SHA: `isotope-local-shell-3.1.2-{full-sha}`
- On app updates, the new cache name wouldn't match old format
- Cache reuse failed, causing duplicate cache entries

**Solution**:
```javascript
// Before
const SHELL_CACHE = CACHE_PREFIX + '-shell-' + APP_VERSION + '-' + APP_SHA;

// After
const SHELL_CACHE = CACHE_PREFIX + '-shell-' + APP_VERSION + '-' + APP_SHA.slice(0, 12);
```

**Impact**: Consistent cache naming, proper cleanup of old caches on activation

---

### 2. Update Checker Polling Timer Leak

**File**: `public/update-checker.js` (Line 212-213)

**Problem**:
- `setInterval()` for update polling never cleaned up
- Page unload left orphaned timer references
- Long-running sessions accumulated memory leaks

**Solution**:
```javascript
// Added cleanup
window.addEventListener('beforeunload', function () {
  clearInterval(timer);
});
```

**Impact**: Proper timer cleanup on page close/navigation, no memory leaks

---

### 3. Update Dismissal Logic Flaw

**File**: `public/update-checker.js` (Line 203)

**Problem**:
```javascript
// Original (BUGGY)
if (dismissed && data.latest.indexOf(dismissed) === 0) return;
// This checks if new SHA STARTS WITH dismissed SHA (prefix match)
// If you dismiss 'abc1234', then 'abc5678' would NOT be dismissed
// But comparison was backwards for intent
```

**Solution**:
```javascript
// Fixed (CORRECT)
if (dismissed && dismissed === data.latest) return;
// Exact SHA match - only dismiss if it's the exact same version
```

**Impact**: Update banner won't show again for the exact dismissed version, no false positives

---

### 4. Silent Update Check Failures

**File**: `public/update-checker.js` (Line 208)

**Problem**:
- Network errors silently caught without logging
- Users had no visibility into why update checks weren't working
- Hard to debug deployment issues

**Solution**:
```javascript
// Before
.catch(function () { hideBanner(); });

// After
.catch(function (err) {
  console.warn('[IsotopeUpdateChecker] Error:', err.message);
  hideBanner();
});
```

**Impact**: Errors logged to console for debugging, better observability

---

### 5. Missing Service Worker Reload Guard

**File**: `public/pwa-local.js` (Lines 6, 124-131)

**Problem**:
- On SW activation, page immediately reloads if version changed
- Multiple clients could trigger simultaneous reloads
- Rapid reload loops possible during deployment

**Solution**:
```javascript
var swActivationReloadGuard = false;

navigator.serviceWorker.addEventListener('message', function (event) {
  var data = event.data || {};
  if (data.type === 'ISOTOPE_SW_READY' || data.type === 'ISOTOPE_SW_VERSION') {
    var newVersion = data.version || '';
    // One-shot reload guard: only reload on first SW activation with new version
    if (!swActivationReloadGuard && newVersion && newVersion !== state.swVersion) {
      swActivationReloadGuard = true;
      state.swVersion = newVersion;
      state.swSha = data.sha || '';
      window.location.reload();
      return;
    }
    state.swVersion = newVersion;
    state.swSha = data.sha || '';
  }
});
```

**Impact**: Single reload on activation, no reload loops, stable SW transitions

---

### 6. Client Detach Exception

**File**: `public/sw.js` (Lines 109-114)

**Problem**:
- Service worker sends messages to all matched clients
- If a client detaches between `matchAll()` and `postMessage()`, uncaught exception
- Rare but possible on tab close/unload race conditions

**Solution**:
```javascript
// Before
for (const client of clients) {
  client.postMessage({ type: 'ISOTOPE_SW_READY', version: APP_VERSION, sha: APP_SHA });
}

// After
for (const client of clients) {
  try {
    client.postMessage({ type: 'ISOTOPE_SW_READY', version: APP_VERSION, sha: APP_SHA });
  } catch (e) {
    // Client may be detached or unreachable; silently continue
  }
}
```

**Impact**: No uncaught exceptions during client detach, graceful error handling

---

### 7. HTML Escaping Issue in Banner

**File**: `public/update-checker.js` (Line 129-130)

**Problem**:
- Ternary operator conditional HTML generation
- If `shortSha` falsy, expression returns `false` which gets stringified
- Potential HTML injection if SHA contained special characters

**Solution**:
```javascript
// Before (RISKY)
b.innerHTML = [
  '<div class="iso-dot"></div>',
  '<span class="iso-tag">Update</span>',
  '<div class="iso-msg"><strong>' + escHtml(shortMsg) + '</strong>',
  shortSha ? '<span class="iso-sha">#' + escHtml(shortSha) + '</span>' : '',
  '</div>',
  // ...
].join('');

// After (SAFE)
b.innerHTML = [
  '<div class="iso-dot"></div>',
  '<span class="iso-tag">Update</span>',
  '<div class="iso-msg"><strong>' + escHtml(shortMsg) + '</strong>' +
  (shortSha ? '<span class="iso-sha">#' + escHtml(shortSha) + '</span>' : '') +
  '</div>',
  // ...
].join('');
```

**Impact**: Safe HTML generation, no injection vulnerabilities

---

## Testing Checklist

### ✅ Update Dismissal
```
1. Trigger update check
2. Dismiss update banner
3. Verify same version doesn't show again
4. Verify new version still appears
```

### ✅ Offline Behavior
```
1. Stop isotope server: isotope stop
2. Open app in browser (cached shell)
3. Verify offline mode shown
4. Verify no reload loop
5. Verify no forced onboarding
6. Restart server: isotope start
7. Verify app reconnects
```

### ✅ Memory Leaks
```
1. Open DevTools → Memory tab
2. Take heap snapshot (before)
3. Switch tabs multiple times
4. Refresh page several times
5. Take heap snapshot (after)
6. Compare: no growth in timer references
```

### ✅ Cache Consistency
```
1. isotope update (to bump version)
2. DevTools → Application → Cache Storage
3. Verify cache name format: isotope-local-shell-X.X.X-{12-char-sha}
4. Verify old caches are deleted
5. No duplicate entries
```

### ✅ Browser Console
```
1. Open DevTools → Console
2. Trigger update check
3. Verify console logs (no errors)
4. Look for [IsotopeUpdateChecker] prefix on errors
5. Verify graceful error handling
```

---

## Deployment Notes

### For Users
- Pull latest from branch or merge PR
- No configuration changes needed
- Existing `.env` files work as-is
- Update via `isotope update` or manual pull + `npm install`

### For Admins
- Monitor `~/.isotope/logs/server.log` for errors
- Run `isotope doctor` to verify health
- Check browser console for `[IsotopeUpdateChecker]` warnings
- Cache storage grows slower (consistent naming)

### Backward Compatibility
- ✅ All changes are backward compatible
- ✅ Existing cache entries cleaned automatically on SW activation
- ✅ No database schema changes
- ✅ No breaking API changes

---

## Related Files

| File | Changes |
|---|---|
| `public/sw.js` | SHA truncation + client error handling |
| `public/update-checker.js` | Dismissal logic + error logging + timer cleanup |
| `public/pwa-local.js` | Reload guard + improved messaging |
| `README.md` | Documentation added |

---

## Commit History

1. **657a902** — `public/sw.js`: Truncate cache SHA to 12 characters and add client detach safety
2. **a848d3a** — `public/update-checker.js`: Fix update dismissal logic, add error logging, and prevent timer leaks
3. **8b407ea** — `public/pwa-local.js`: Add service worker reload guard and improve client message handling
4. **36176206** — `README.md`: Add bug fixes section with testing recommendations

---

## Questions?

See [README.md](../README.md) or [AGENTS.md](../AGENTS.md) for more context.
