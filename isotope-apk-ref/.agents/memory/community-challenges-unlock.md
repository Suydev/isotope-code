---
name: Community challenges premium gate unlock
description: Three useGroupChallenges queries were premium-gated and had to be patched; approach and verification method documented here.
---

# Community challenges premium gate unlock

## The rule
`useGroupChallenges-*.js` has 3 premium-gated query hooks that must always be patched to `!0` (true) in the Android app. Upstream minification churn can change the function identifiers (L/B/R) and break these patches — check `npm test` output when upstream bundle changes.

**Why:** Group challenge queries are gated on `isPremium()` upstream. On Android, all community features are unlocked for all users with no separate subscription tier.

**How to apply:** Patch targets in `scripts/apply-android-patches.js` section "6b-extra. useGroupChallenges". Three patches:
- `function L(r){const n=h(t=>t.isPremium()),e=h(t=>t.userId);` → `function L(r){const n=!0,e=h(t=>t.userId);`
- `function B(r){const n=h(e=>e.isPremium());` → `function B(r){const n=!0;`  
- `function R(r){const n=h(i=>i.isPremium()),e=h(i=>i.userId);` → `function R(r){const n=!0,e=h(i=>i.userId);`

All three are `required:true` (fail-fast if target changes).

## Community seed data (migration 012)
Applied `012_seed_community_data.sql` to prod: 20 challenges + 16 announcements across all 8 groups. Challenges expire in 7-30 days from 2026-07-09 — will need renewal.

Admin user `68aa181f-3ff0-4be5-8e1f-d291a7f3b857` (admin@isotope.local) used as creator/author — confirmed to exist in auth.users.

## View All Members (ANDROID-015) — not a separate code bug
The `Ea` (MembersDrawer) component and `toggleMembersDrawer` flow are correct in the bundle. The button was broken because `gm_read_members` RLS recursion (fixed in migration 011) caused HTTP 500 on the member query. No additional patch needed — needs device verification.
