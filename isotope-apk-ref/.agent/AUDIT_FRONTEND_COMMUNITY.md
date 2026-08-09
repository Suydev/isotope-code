# Frontend Community Audit (isotope-code) — 2026-07-05

## Key Finding: src/ is OUT OF SYNC with public/assets/

`isotope-code/src/` is a skeleton/placeholder. The actual compiled community
features live in `public/assets/*.js` (154 chunks, ~342KB main bundle).
Any analysis or fixes must target the compiled assets, not src/.

## What the Compiled Frontend Actually Does

### Group Creation (useGroups-vEjDKzZY.js)
- Direct `.from("groups").insert(...)` — does NOT call `create_community_group` RPC
- Then direct `.from("group_members").insert(...)` for owner row
- Two separate inserts = NOT atomic, race condition possible

### Group Joining (useGroups-vEjDKzZY.js)
- Direct `.from("group_members").insert(...)` — does NOT call `join_community_group` RPC
- No max_members check client-side before insert

### Group Leaving (useGroups-vEjDKzZY.js)
- `.delete()` from `group_members` — direct table delete

### Invite Operations (useInvites-*.js)
- **Create invite**: `upsert` on `group_invites` after checking owner/admin status client-side
- **Accept invite**: `n.rpc("accept_invite", { p_code: t })` — CORRECT, uses RPC
- **Revoke invite**: `.delete()` from `group_invites`

### What RPCs Are Called From Frontend
- `accept_invite` ✓
- `get_invite_details` ✓
- `get_leaderboard` ✓
- `get_group_leaderboard` ✓
- `get_group_analytics_from_snapshots` ✓
- `create_community_group` ✗ — NOT called; direct inserts used instead
- `join_community_group` ✗ — NOT called; direct inserts used instead
- `leave_community_group` ✗ — NOT called; direct delete used instead
- `update_group_member_role` ✗ — NOT called; direct update possible (now blocked by RLS)
- `delete_community_group` ✗ — NOT called; owner used direct delete

## Implication for Security Fix

With `009_community_hardening.sql` applied:
- Direct `group_members` INSERT is now BLOCKED by RLS (no INSERT policy)
- Group creation via direct insert will FAIL for clients
- Frontend needs to call `create_community_group` RPC instead
- Option A: Patch compiled bundle in `apply-android-patches.js` (fragile, Android-only)
- Option B: Rebuild isotope-code from source with RPC calls (correct long-term fix)
- Option C: Add a `groups` INSERT policy + `group_members` INSERT policy scoped to
  "only if you are inserting yourself as owner" (workaround, less secure)

**Recommendation**: Apply migration 009, then patch the compiled bundle in apply-android-patches.js
to call `create_community_group` RPC for the APK. Fix src/ in isotope-code as a follow-up.

## Files in public/assets/ Relevant to Community
- `App-pJGjDiPw.js` — 342KB main bundle
- `useGroups-vEjDKzZY.js` — group CRUD, direct table ops
- `useInvites-*.js` — invite create/accept/revoke
- `CommunityHub-*.js` — tab navigation, events/calendar tab
- `useLeaderboard-*.js` — leaderboard hook
- `GroupInviteGenerator-*.js` — invite URL generation
- `InviteOnlineOnlyRoute-*.js` — invite route guard
