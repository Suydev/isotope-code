---
name: EnhancedChallengeCard goal_type crash
description: DB has study_hours as goal_type; component config only knows hours/sessions/tasks; crashes with .icon on undefined.
---

## The rule
The `EnhancedChallengeCard` component maps `goal_type` values to a config object `H`. If the DB has a `goal_type` value not in that map, the lookup returns `undefined` and reading `.icon` crashes React.

**Why:** `group_challenges.goal_type` is a free-form text field in the DB. The component's hard-coded config only had: `hours`, `sessions`, `tasks`. DB seed data added `study_hours` which wasn't in the map.

## Fix applied (bundle + patch script)
1. Added `study_hours` entry to `H` config (aliased to `hours` styling/icon)
2. Added `|| {}` fallback to all three config lookups: `Q[m]||{}`, `H[goal_type]||{}`, `Z[n]||{}`

**How to apply:** If new `goal_type` values are added to the DB, either add them to the H config in the source (isotope-code) or add a bundle patch in `apply-android-patches.js` → `EnhancedChallengeCard` section.
