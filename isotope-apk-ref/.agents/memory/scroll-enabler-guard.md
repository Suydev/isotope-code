---
name: Scroll enabler Node.js guard
description: The installScrollEnabler IIFE in android-bridge.js must guard pushState existence to avoid crashing in the Node.js test harness.
---

## Rule
`installScrollEnabler` must return early if `window.history.pushState` or `replaceState` is not a function.

## Why
The Node.js test harness provides `history: { back() {} }` with no `pushState`. The IIFE calls `.bind()` on `pushState` to monkey-patch history, which throws a TypeError in non-browser environments. This broke all 62 tests (0/62 pass) until the guard was added.

## How to apply
At the top of the `installScrollEnabler` IIFE, before any `pushState` usage:
```javascript
if (typeof window.history.pushState !== 'function' ||
    typeof window.history.replaceState !== 'function') {
  return; // Android WebView always has full History API; this only fires in test harness
}
```
Do NOT add a no-op `popstate` listener in this branch — it serves no purpose (Android WebView never hits this path) and is misleading.
