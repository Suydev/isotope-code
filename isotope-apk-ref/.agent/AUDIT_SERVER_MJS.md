# server.mjs Audit (isotope-code) — 2026-07-05

File: `/home/runner/workspace/isotope-code/server.mjs` — 8642 lines

## Community-Related Endpoints & Logic

### Lines 1–3000
- **Line 233–243**: `isAdminAuthed(req)` — checks `ADMIN_SECRET` header/query or signed `iso_admin` cookie.
- **Line 287–323**: `verifySupabaseAccessToken(token)` — validates Supabase JWT via `/auth/v1/user`.
- **Line 992**: 403 errors identified as RLS policy violations.
- **Line 2433–2434**: Group analytics: fetches `/rest/v1/group_members?group_id=eq.{gid}&select=user_id,role,joined_at&limit=200`.
- **Line 2549**: Intercepts client calls to `group_members` to enrich member data with display names.
- **Line 2785**: Route handler patch for `/rpc/accept_invite` — normalizes response to `{success:true}`.
- **Line 3083–3147**: `AUTH_GUARD_SCRIPT` — injected into HTML to redirect unauthenticated users.
- **Line 3342–3349**: Injects `SUPA_URL` env var into frontend bundle at serve time.

### Lines 3001–8642
- **Line 4069, 4082**: Patches frontend bundle — translates `token_input` → `p_code` for `accept_invite` and `get_invite_details`.
- **Line 5877–5935**: `/__supa` proxy path with health checks for REST, Auth, Storage.
- **Line 7333**: Schema reference: `group_members(id, group_id, user_id, role, joined_at)`.
- **Line 7335**: Schema reference: `group_invites(id, group_id, token, created_by, max_uses, uses_count, expires_at)`.
- **Line 7377**: Admin diagnostic: verifies `accept_invite(p_code)` RPC exists.
- **Line 7404–7410**: Admin tool checks for "Infinite Recursion" in RLS policies on `groups`, `group_members`, `group_challenges`.
- **Line 7574**: Documents `_is_group_member(gid, uid)` helper — SECURITY DEFINER to prevent RLS recursion.
- **Line 7580**: Diagnostic: verifies UNIQUE constraint on `(group_id, user_id)`.

## Key Architectural Points
- Server patches frontend bundle JS at serve time (line 3342+). Android bridge replaces this with direct Supabase calls.
- `/__supa/*` is the proxy path for all Supabase calls. `android-bridge.js` intercepts these in the WebView.
- Server uses `SUPA_URL` + `SUPA_ANON_KEY` env vars (with public cloud defaults for safety).
- Admin diagnostics suite starts around line 7300 and validates schema/RPC existence.
