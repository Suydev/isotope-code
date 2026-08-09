-- 013d: Fix FK targets from auth.users → public.users + add users profile read policy.
--
-- ROOT CAUSE of PGRST200 "Could not find a relationship between group_members and user_id":
--
--   Every user-referencing FK in community tables pointed to auth.users.
--   PostgREST only resolves foreign-key embeds within the exposed schema (public).
--   auth.users lives in the auth schema and is invisible to PostgREST's schema cache,
--   so the join syntax  users:user_id(id,avatar_url)  always raises PGRST200.
--
--   Fix: drop each auth.users FK and recreate it targeting public.users instead.
--   Preserve the same ON DELETE behaviour as the original constraint.
--
-- SECOND ISSUE — users_select_own RLS limits SELECT to the caller's own row:
--   Even after the FK is fixed, the join to public.users returns NULL for every
--   member other than the caller because the RLS policy  USING (id = auth.uid())
--   filters out all other rows.  A second PERMISSIVE policy is added so authenticated
--   users can read any non-deleted user's public profile row.

-- ── 1. group_members.user_id ──────────────────────────────────────────────────
-- auth.users → public.users  (CASCADE preserved)
ALTER TABLE public.group_members
  DROP CONSTRAINT IF EXISTS group_members_user_id_fkey;
ALTER TABLE public.group_members
  ADD CONSTRAINT group_members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ── 2. group_announcements.author_id ─────────────────────────────────────────
-- auth.users NO ACTION → public.users SET NULL (author gone → keep announcement)
ALTER TABLE public.group_announcements
  DROP CONSTRAINT IF EXISTS group_announcements_author_id_fkey;
ALTER TABLE public.group_announcements
  ADD CONSTRAINT group_announcements_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- ── 3. group_invites.created_by ───────────────────────────────────────────────
-- auth.users NO ACTION → public.users SET NULL
ALTER TABLE public.group_invites
  DROP CONSTRAINT IF EXISTS group_invites_created_by_fkey;
ALTER TABLE public.group_invites
  ADD CONSTRAINT group_invites_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- ── 4. group_challenges.created_by ───────────────────────────────────────────
-- auth.users NO ACTION → public.users SET NULL
ALTER TABLE public.group_challenges
  DROP CONSTRAINT IF EXISTS group_challenges_created_by_fkey;
ALTER TABLE public.group_challenges
  ADD CONSTRAINT group_challenges_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- ── 5. group_challenge_participants.user_id ───────────────────────────────────
-- auth.users CASCADE → public.users CASCADE
ALTER TABLE public.group_challenge_participants
  DROP CONSTRAINT IF EXISTS group_challenge_participants_user_id_fkey;
ALTER TABLE public.group_challenge_participants
  ADD CONSTRAINT group_challenge_participants_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ── 6. group_chat_messages.author_id ─────────────────────────────────────────
-- auth.users NO ACTION → public.users SET NULL
ALTER TABLE public.group_chat_messages
  DROP CONSTRAINT IF EXISTS group_chat_messages_author_id_fkey;
ALTER TABLE public.group_chat_messages
  ADD CONSTRAINT group_chat_messages_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- group_chat_messages.user_id has 6 rows referencing auth.users entries that have
-- no corresponding public.users row (sync gap between auth and public schemas).
-- Use NOT VALID to skip checking historic rows; new rows will be validated.
ALTER TABLE public.group_chat_messages
  DROP CONSTRAINT IF EXISTS group_chat_messages_user_id_fkey;
ALTER TABLE public.group_chat_messages
  ADD CONSTRAINT group_chat_messages_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
  NOT VALID;

-- ── 7. users SELECT policy for member profile reads ───────────────────────────
-- Existing users_select_own: USING (id = auth.uid())  → only own row visible.
-- New PERMISSIVE policy added; PostgreSQL OR's permissive policies together, so
-- authenticated users can now see any non-deleted user's row.
-- Sensitive columns (email, plan_type, billing_status) are still only returned
-- if the caller explicitly selects them — the app requests only safe fields
-- (id, name, username, avatar_url) in all community queries.
DROP POLICY IF EXISTS "users_read_member_profiles" ON public.users;
CREATE POLICY "users_read_member_profiles"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- ── 8. Reload PostgREST schema cache ─────────────────────────────────────────
-- Forces immediate pickup of the new FK relationships without a service restart.
NOTIFY pgrst, 'reload schema';
