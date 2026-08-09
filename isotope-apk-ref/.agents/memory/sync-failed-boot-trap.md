---
name: syncFailed boot trap fix
description: AppAccessGate syncFailed screen traps unauthenticated users if CTA goes to / instead of /auth.
---

## Rule
When `Y === "syncFailed" && !u` (unauthenticated), the `ne` component CTA must point to `/auth`, not `/`.

## Why
The "/" route routes back into AppAccessGate which immediately shows the same syncFailed screen, creating an infinite trap (black screen with no login path). The user sees "Cloud state is unavailable" with a "Retry from home" button that does nothing useful. Changing to "/auth" lets users log in; their session then resolves the syncFailed state.

## How to apply
In `scripts/apply-android-patches.js`, the AppAccessGate `patchFile` call has two patch entries:
1. `syncFailed` → `syncFailed && !u` (allows authenticated users through)
2. Change `ctaLabel: "Retry from home", ctaTo: "/"` → `ctaLabel: "Sign In", ctaTo: "/auth"` and update description

The `ne` component (= `N` from `NetworkRequiredState-O9ZdVBEy.js`) accepts `{title, description, ctaLabel, ctaTo, eyebrow}` — one CTA only.

## Test
`test/prepare-patches.test.mjs` asserts `ctaTo: "/auth"`, `ctaLabel: "Sign In"`, `NOT "Retry from home"`.
