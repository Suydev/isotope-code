---
name: Community FKs target auth.users
description: All user-referencing FKs in community tables pointed to auth.users; PostgREST can't resolve these for joins.
---

## The rule
When adding FK constraints for community tables in Supabase, always target `public.users`, not `auth.users`.

**Why:** PostgREST only inspects FK constraints in the exposed schema (`public`). If a FK points to `auth.users` (a different schema), PostgREST's schema cache never sees it. Any query using the embed syntax `users:user_id(id,avatar_url)` returns PGRST200 "Could not find a relationship".

## Affected tables (fixed in 013d)
- `group_members.user_id → public.users.id` (CASCADE)
- `group_announcements.author_id → public.users.id` (SET NULL)
- `group_invites.created_by → public.users.id` (SET NULL)
- `group_challenges.created_by → public.users.id` (SET NULL)
- `group_challenge_participants.user_id → public.users.id` (CASCADE)
- `group_chat_messages.author_id → public.users.id` (SET NULL)
- `group_chat_messages.user_id → public.users.id` (NOT VALID — 6 orphaned rows)

## Second issue: users_select_own RLS
The `users_select_own` policy — `USING (id = auth.uid())` — means every join to `public.users` for a different member returns null. Fixed by adding `users_read_member_profiles` PERMISSIVE SELECT policy: `USING (deleted_at IS NULL)` for authenticated.

**How to apply:** Any new table with a user reference needs:
1. FK pointing to `public.users(id)`, not `auth.users`
2. After migration: `NOTIFY pgrst, 'reload schema'` to force cache refresh
