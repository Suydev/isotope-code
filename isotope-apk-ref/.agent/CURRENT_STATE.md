# IsotopeAI Android — Current State

**Updated:** 2026-07-09 (session 3)
**Branch:** main
**Latest commit:** see `git log --oneline -1`
**Current phase:** Community fully unblocked; challenge premium gates removed; seed data applied; CI will build new APK

---

## Verified This Session (2026-07-09 session 3)

- [x] `npm test`: **63/63 PASS** (maintained throughout all fixes)
- [x] `useGroupChallenges` premium gates removed — 3 queries now always enabled
- [x] DB seeded: 20 challenges + 16 announcements across all 8 groups (migration 012)
- [x] DB schema confirmed: group_challenges and group_announcements columns match bundle queries exactly
- [x] View All Members (ANDROID-015): not a separate code bug — the Ea/MembersDrawer component is correct; was a victim of the same gm_read_members RLS recursion (fixed in 011)
- [x] No premium gates in SingleGroup or CommunityHub bundles (all gates were already patched)

---

## Verified Previous Session (2026-07-08 session 2)

- [x] `npm test`: **62/62 PASS** (maintained throughout all fixes)
- [x] RLS infinite-recursion root cause found and fixed (migration 011)
- [x] Group categories backfilled (all 8 groups have correct category)
- [x] group_challenges now accessible for anon role (GRANT applied)
- [x] Bridge `get-daily-leaderboard` now routes to group leaderboard when groupId present
- [x] Supabase migration `011_fix_rls_recursion.sql` applied to prod

---

## Root Cause of "Failed to load groups" 500 Error

**Migration 009 created an infinitely recursive RLS policy:**

```sql
-- gm_read_members (from 009) — SELF-REFERENTIAL:
FOR SELECT USING (group_id IN (
  SELECT gm2.group_id FROM group_members gm2 WHERE gm2.user_id = auth.uid()
))
-- When gchall_manager_write or gann_manager_write subquery hits group_members,
-- gm_read_members fires again → group_members subquery → gm_read_members → ∞ → HTTP 500
```

**Fix applied (migration 011):**
```sql
-- gm_read_members now uses SECURITY DEFINER function (no recursion):
FOR SELECT USING (
  user_id = (SELECT auth.uid())
  OR public._is_group_member(group_id, (SELECT auth.uid()))
)
-- Also dropped gchall_manager_write and gann_manager_write (redundant + recursive)
```

---

## Supabase Project
- Ref: `vteqquoqvksshmfhuepu`
- URL: `https://vteqquoqvksshmfhuepu.supabase.co`
- Access via `SUPABASE_PAT` secret (Management API)

---

## Migrations Applied (in order)
1. `009_community_hardening.sql` — 7 community RPCs, updated RLS policies
2. `010_cleanup_group_members_rls.sql` — restored gm_client_insert_compat
3. `011_fix_rls_recursion.sql` — **fixed gm_read_members recursion; dropped recursive ALL policies**

## DB State After All Migrations

### group_members policies:
- `gm_admin_update` UPDATE — `user_id = auth.uid() OR _is_group_member(...)`
- `gm_client_insert_compat` INSERT — `user_id = auth.uid()` (allows owner + member inserts)
- `gm_read_members` SELECT — `user_id = auth.uid() OR _is_group_member(...)` (no recursion)
- `gm_self_delete` DELETE — `user_id = auth.uid()`

### groups policies:
- `groups_read_public` SELECT (anon) — `is_public = true AND is_active = true AND deleted_at IS NULL`
- `groups_read_authenticated` SELECT (authenticated) — `is_public...` OR `private.is_group_member`
- `groups_insert_own` INSERT — `owner_id = auth.uid()`
- `groups_update_own` UPDATE — `owner_id = auth.uid()`
- `groups_delete_own` DELETE — `owner_id = auth.uid()`

### group_challenges policies:
- `gchall_read` SELECT — `is_active = true OR _is_group_member(...)` (active = discoverable by all)
- `group_challenges_read_members` SELECT — `_is_group_member(...)` (private inactive challenges)
- `group_challenges_insert_managers` / `_update_managers` / `_delete_managers` — `private.can_manage_group`

### Groups with categories:
- Competitive Coding → coding
- CS & Algorithms → coding
- JEE → science
- JEE ADVANCED → science
- Language Lab → languages
- Math Mastery → science
- Physics Olympiad → science
- Pre-Med Biology → science

---

## Community Feature Status

| Feature | DB | Bridge | Bundle | Device |
|---------|-----|--------|--------|--------|
| Load groups list | ✅ (RLS fixed) | N/A | ✅ | 🔄 |
| Filter by category | ✅ (backfilled) | N/A | ✅ | 🔄 |
| Create group | ✅ (gm_insert_compat) | N/A | ✅ (throws on error) | 🔄 |
| Join group | ✅ (gm_insert_compat) | N/A | ✅ | 🔄 |
| Leave group | ✅ (gm_self_delete) | N/A | ✅ | 🔄 |
| View members (SingleGroup) | ✅ (gm_read fixed) | N/A | ✅ | 🔄 |
| Group chat | ✅ (private.is_group_member) | N/A | ✅ | 🔄 |
| Group challenges | ✅ (active = public) | N/A | ✅ | 🔄 |
| Group leaderboard (daily) | ✅ get_group_leaderboard | ✅ routes to group RPC | ✅ | 🔄 |
| Group leaderboard (weekly+) | ✅ get_leaderboard | ✅ | ✅ | 🔄 |
| Group analytics | ✅ get_group_analytics | ✅ | ✅ | 🔄 |
| Group icon upload | ✅ | ✅ /__auth/storage/group-icon | ✅ | 🔄 |

---

## www/ Build Chain
- CI checks out `isotope-code` at `ISOTOPE_CODE_REF = 4bc0e8418e4a694a25a7fc7f92a01f2fa7e65201` (latest main)
- CI runs `prepare-www.js` → copies `isotope-code/public/` → `www/`
- CI runs `apply-android-patches.js` → patches community bundles, removes premium gates
- android-bridge.js and auth-bridge.js injected into index.html

## Test Coverage
- `npm test`: 62/62 PASS
- Bridge handles: finish-session, get-leaderboard, get-daily-leaderboard (→ group RPC when groupId), get-group-leaderboard, get-group-analytics, create_checkout (disabled), redeem_membership_code (grants ranker)

---

## Device Test Priorities (next session)
1. **Community groups load** — should now show 8 groups with correct categories
2. **Create group** — should succeed and add owner to group_members
3. **Join/Leave group** — direct insert/delete through gm_client_insert_compat
4. **Group member list** — gm_read_members no longer recursive
5. **Group chat** — send and receive messages
6. **View All Members button** — still needs investigation (ANDROID-015)
7. **syncFailed screen** → /auth CTA
8. **Privacy page scroll** — SCROLLABLE_PATHS includes /privacy

---

## Files Modified This Session
- `android-bridge.js` — fixed handleGetDailyLeaderboard to route to group RPC when groupId present; removed no-op popstate listener
- `isotope-code/sql/011_fix_rls_recursion.sql` — new migration (applied to prod)
- `test/prepare-patches.test.mjs` — added assertions for syncFailed CTA and useGroups error throw
- `.agent/CURRENT_STATE.md` — this file
- `.agent/NEXT_TASKS.md` — updated task queue
