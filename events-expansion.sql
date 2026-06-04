-- ============================================================================
-- ISOTOPE COMMUNITY — EVENTS SYSTEM EXPANSION
-- Full living social ecosystem: 16 tables, RPCs, RLS, triggers, indexes
-- ============================================================================

-- PostgreSQL cannot change a function's return type with CREATE OR REPLACE.
-- Drop exact event RPC signatures up front so this expansion is rerunnable.
DROP FUNCTION IF EXISTS public.rsvp_event(uuid, text);
DROP FUNCTION IF EXISTS public.react_to_event(uuid, text);
DROP FUNCTION IF EXISTS public.track_event_view(uuid);
DROP FUNCTION IF EXISTS public.get_event_discovery();
DROP FUNCTION IF EXISTS public.get_event_discovery(text);
DROP FUNCTION IF EXISTS public.get_event_discovery(text, integer);
DROP FUNCTION IF EXISTS public.get_event_discovery(text, integer, integer);
DROP FUNCTION IF EXISTS public.get_event_full(uuid);
DROP FUNCTION IF EXISTS public.update_event_engagement_score(uuid);
DROP FUNCTION IF EXISTS public.increment_event_resource_download(uuid, uuid);

-- ── 1. event_categories ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL UNIQUE,
  slug        text        NOT NULL UNIQUE,
  icon        text        NOT NULL DEFAULT '📅',
  color       text        NOT NULL DEFAULT '#6366f1',
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.event_categories (name, slug, icon, color) VALUES
  ('Study Session',    'study-session',    '📚', '#6366f1'),
  ('Group Revision',   'group-revision',   '🔄', '#8b5cf6'),
  ('Mock Discussion',  'mock-discussion',  '🎯', '#ec4899'),
  ('Doubt Solving',    'doubt-solving',    '❓', '#f59e0b'),
  ('Live Class',       'live-class',       '🎓', '#10b981'),
  ('Sprint',           'sprint',           '⚡', '#ef4444'),
  ('Challenge Launch', 'challenge-launch', '🏆', '#f97316'),
  ('Community Meetup', 'community-meetup', '🤝', '#06b6d4'),
  ('Workshop',         'workshop',         '🔧', '#84cc16'),
  ('Custom',           'custom',           '✨', '#a78bfa')
ON CONFLICT (slug) DO NOTHING;

-- ── 2. event_rsvp ────────────────────────────────────────────────────────────
-- Richer RSVP states: going / interested / maybe / not_going
CREATE TABLE IF NOT EXISTS public.event_rsvp (
  event_id   uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state      text        NOT NULL DEFAULT 'going' CHECK (state IN ('going','interested','maybe','not_going')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_event_rsvp_event  ON public.event_rsvp(event_id, state);
CREATE INDEX IF NOT EXISTS idx_event_rsvp_user   ON public.event_rsvp(user_id);
ALTER TABLE public.event_rsvp ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_rsvp' AND policyname='rsvp_read') THEN
    CREATE POLICY rsvp_read ON public.event_rsvp FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_rsvp' AND policyname='rsvp_own') THEN
    CREATE POLICY rsvp_own ON public.event_rsvp FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── 3. event_messages ────────────────────────────────────────────────────────
-- Realtime event chat
CREATE TABLE IF NOT EXISTS public.event_messages (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content      text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  reply_to_id  uuid        REFERENCES public.event_messages(id) ON DELETE SET NULL,
  is_pinned    boolean     NOT NULL DEFAULT false,
  deleted_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evtmsg_event   ON public.event_messages(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evtmsg_user    ON public.event_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_evtmsg_pinned  ON public.event_messages(event_id, is_pinned) WHERE is_pinned = true;
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_messages' AND policyname='evtmsg_read') THEN
    CREATE POLICY evtmsg_read ON public.event_messages FOR SELECT USING (deleted_at IS NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_messages' AND policyname='evtmsg_insert') THEN
    CREATE POLICY evtmsg_insert ON public.event_messages FOR INSERT WITH CHECK (user_id = auth.uid() AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_messages' AND policyname='evtmsg_own_delete') THEN
    CREATE POLICY evtmsg_own_delete ON public.event_messages FOR UPDATE USING (user_id = auth.uid());
  END IF;
END $$;

-- ── 4. event_threads ─────────────────────────────────────────────────────────
-- Discussion threads per event (separate from chat)
CREATE TABLE IF NOT EXISTS public.event_threads (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text        NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
  content    text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  reply_count integer    NOT NULL DEFAULT 0,
  is_pinned  boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evtthd_event ON public.event_threads(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evtthd_user  ON public.event_threads(user_id);
ALTER TABLE public.event_threads ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_threads' AND policyname='evtthd_read') THEN
    CREATE POLICY evtthd_read ON public.event_threads FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_threads' AND policyname='evtthd_insert') THEN
    CREATE POLICY evtthd_insert ON public.event_threads FOR INSERT WITH CHECK (user_id = auth.uid() AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_threads' AND policyname='evtthd_own') THEN
    CREATE POLICY evtthd_own ON public.event_threads FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- ── 5. event_thread_replies ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_thread_replies (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid        NOT NULL REFERENCES public.event_threads(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content    text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 3000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evtreply_thread ON public.event_thread_replies(thread_id, created_at ASC);
ALTER TABLE public.event_thread_replies ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_thread_replies' AND policyname='evtreply_read') THEN
    CREATE POLICY evtreply_read ON public.event_thread_replies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_thread_replies' AND policyname='evtreply_insert') THEN
    CREATE POLICY evtreply_insert ON public.event_thread_replies FOR INSERT WITH CHECK (user_id = auth.uid() AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_thread_replies' AND policyname='evtreply_own') THEN
    CREATE POLICY evtreply_own ON public.event_thread_replies FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;
-- Trigger: increment reply_count on thread
CREATE OR REPLACE FUNCTION public._evt_increment_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
BEGIN
  UPDATE public.event_threads SET reply_count = reply_count + 1, updated_at = now() WHERE id = NEW.thread_id;
  RETURN NEW;
END; $f$;
DROP TRIGGER IF EXISTS trg_evt_reply_count ON public.event_thread_replies;
CREATE TRIGGER trg_evt_reply_count AFTER INSERT ON public.event_thread_replies
  FOR EACH ROW EXECUTE FUNCTION public._evt_increment_reply_count();

-- ── 6. event_reactions ───────────────────────────────────────────────────────
-- Extensible emoji reactions (🔥🎯💯🚀👏 + more)
CREATE TABLE IF NOT EXISTS public.event_reactions (
  event_id   uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction   text        NOT NULL CHECK (reaction IN ('🔥','🎯','💯','🚀','👏','❤️','🧠','⭐','😮','🎉')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id, reaction)
);
CREATE INDEX IF NOT EXISTS idx_evtreact_event ON public.event_reactions(event_id, reaction);
ALTER TABLE public.event_reactions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_reactions' AND policyname='evtreact_read') THEN
    CREATE POLICY evtreact_read ON public.event_reactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_reactions' AND policyname='evtreact_own') THEN
    CREATE POLICY evtreact_own ON public.event_reactions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── 7. event_resources ───────────────────────────────────────────────────────
-- Links, PDFs, notes, recordings, slides attached to event
CREATE TABLE IF NOT EXISTS public.event_resources (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  uploaded_by  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type text       NOT NULL DEFAULT 'link' CHECK (resource_type IN ('link','pdf','note','recording','slides','other')),
  title        text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  url          text        NOT NULL,
  description  text,
  download_count integer   NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evtres_event ON public.event_resources(event_id, created_at DESC);
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_resources' AND policyname='evtres_read') THEN
    CREATE POLICY evtres_read ON public.event_resources FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_resources' AND policyname='evtres_insert') THEN
    CREATE POLICY evtres_insert ON public.event_resources FOR INSERT WITH CHECK (uploaded_by = auth.uid() AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_resources' AND policyname='evtres_own') THEN
    CREATE POLICY evtres_own ON public.event_resources FOR ALL USING (uploaded_by = auth.uid());
  END IF;
END $$;

-- ── 8. event_roles ───────────────────────────────────────────────────────────
-- Host / Co-host / Moderator / Speaker / Participant
CREATE TABLE IF NOT EXISTS public.event_roles (
  event_id    uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'participant' CHECK (role IN ('host','co_host','moderator','speaker','participant')),
  assigned_by uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_evtrole_event ON public.event_roles(event_id, role);
ALTER TABLE public.event_roles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_roles' AND policyname='evtrole_read') THEN
    CREATE POLICY evtrole_read ON public.event_roles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_roles' AND policyname='evtrole_own') THEN
    CREATE POLICY evtrole_own ON public.event_roles FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- ── 9. event_presence ────────────────────────────────────────────────────────
-- Realtime presence: active / watching / speaking / idle / offline
CREATE TABLE IF NOT EXISTS public.event_presence (
  event_id   uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status     text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','watching','speaking','idle','offline')),
  joined_at  timestamptz NOT NULL DEFAULT now(),
  last_seen  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_evtpres_event ON public.event_presence(event_id, status);
ALTER TABLE public.event_presence ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_presence' AND policyname='evtpres_read') THEN
    CREATE POLICY evtpres_read ON public.event_presence FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_presence' AND policyname='evtpres_own') THEN
    CREATE POLICY evtpres_own ON public.event_presence FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── 10. event_analytics ──────────────────────────────────────────────────────
-- Per-event engagement metrics
CREATE TABLE IF NOT EXISTS public.event_analytics (
  event_id          uuid        PRIMARY KEY REFERENCES public.community_events(id) ON DELETE CASCADE,
  view_count        bigint      NOT NULL DEFAULT 0,
  unique_viewers    bigint      NOT NULL DEFAULT 0,
  rsvp_going        integer     NOT NULL DEFAULT 0,
  rsvp_interested   integer     NOT NULL DEFAULT 0,
  rsvp_maybe        integer     NOT NULL DEFAULT 0,
  rsvp_not_going    integer     NOT NULL DEFAULT 0,
  attendance_count  integer     NOT NULL DEFAULT 0,
  chat_message_count integer    NOT NULL DEFAULT 0,
  reaction_count    integer     NOT NULL DEFAULT 0,
  resource_count    integer     NOT NULL DEFAULT 0,
  thread_count      integer     NOT NULL DEFAULT 0,
  engagement_score  numeric(6,2) NOT NULL DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_analytics' AND policyname='evtana_read') THEN
    CREATE POLICY evtana_read ON public.event_analytics FOR SELECT USING (true);
  END IF;
END $$;

-- ── 11. event_feedback ───────────────────────────────────────────────────────
-- Post-event ratings and feedback
CREATE TABLE IF NOT EXISTS public.event_feedback (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating     smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    text        CHECK (char_length(comment) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_evtfb_event ON public.event_feedback(event_id);
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_feedback' AND policyname='evtfb_read') THEN
    CREATE POLICY evtfb_read ON public.event_feedback FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_feedback' AND policyname='evtfb_own') THEN
    CREATE POLICY evtfb_own ON public.event_feedback FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── 12. event_recordings ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_recordings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  uploaded_by uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL DEFAULT 'Event Recording',
  url         text        NOT NULL,
  duration_seconds integer,
  thumbnail_url text,
  view_count  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evtrec_event ON public.event_recordings(event_id, created_at DESC);
ALTER TABLE public.event_recordings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_recordings' AND policyname='evtrec_read') THEN
    CREATE POLICY evtrec_read ON public.event_recordings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_recordings' AND policyname='evtrec_insert') THEN
    CREATE POLICY evtrec_insert ON public.event_recordings FOR INSERT WITH CHECK (uploaded_by = auth.uid() AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_recordings' AND policyname='evtrec_own') THEN
    CREATE POLICY evtrec_own ON public.event_recordings FOR ALL USING (uploaded_by = auth.uid());
  END IF;
END $$;

-- ── 13. event_reminders ──────────────────────────────────────────────────────
-- Scheduled reminder notifications (24h / 1h / 15m / start / follow-up)
CREATE TABLE IF NOT EXISTS public.event_reminders (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remind_at   timestamptz NOT NULL,
  remind_type text        NOT NULL DEFAULT '1h' CHECK (remind_type IN ('24h','1h','15m','start','followup','custom')),
  sent_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id, remind_type)
);
CREATE INDEX IF NOT EXISTS idx_evtrem_remind ON public.event_reminders(remind_at) WHERE sent_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_evtrem_user   ON public.event_reminders(user_id);
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_reminders' AND policyname='evtrem_own') THEN
    CREATE POLICY evtrem_own ON public.event_reminders FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── 14. event_announcements ──────────────────────────────────────────────────
-- Host/co-host announcements pinnable to top
CREATE TABLE IF NOT EXISTS public.event_announcements (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  author_id   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 3000),
  is_pinned   boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evtann_event  ON public.event_announcements(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evtann_pinned ON public.event_announcements(event_id, is_pinned) WHERE is_pinned = true;
ALTER TABLE public.event_announcements ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_announcements' AND policyname='evtann_read') THEN
    CREATE POLICY evtann_read ON public.event_announcements FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_announcements' AND policyname='evtann_insert') THEN
    CREATE POLICY evtann_insert ON public.event_announcements FOR INSERT WITH CHECK (author_id = auth.uid() AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_announcements' AND policyname='evtann_own') THEN
    CREATE POLICY evtann_own ON public.event_announcements FOR ALL USING (author_id = auth.uid());
  END IF;
END $$;

-- ── 15. event_pinned_messages (reference table) ──────────────────────────────
-- Track pinned messages per event (separate from is_pinned flag on messages)
CREATE TABLE IF NOT EXISTS public.event_pinned_messages (
  event_id    uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  message_id  uuid        NOT NULL REFERENCES public.event_messages(id) ON DELETE CASCADE,
  pinned_by   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pinned_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, message_id)
);
ALTER TABLE public.event_pinned_messages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_pinned_messages' AND policyname='evtpin_read') THEN
    CREATE POLICY evtpin_read ON public.event_pinned_messages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_pinned_messages' AND policyname='evtpin_own') THEN
    CREATE POLICY evtpin_own ON public.event_pinned_messages FOR ALL USING (pinned_by = auth.uid());
  END IF;
END $$;

-- ── 16. event_achievements ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_achievements (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement  text        NOT NULL CHECK (achievement IN ('first_event','attended_10','hosted_5','perfect_attendance','community_organizer','super_attendee','event_reviewer')),
  event_id     uuid        REFERENCES public.community_events(id) ON DELETE SET NULL,
  earned_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement)
);
CREATE INDEX IF NOT EXISTS idx_evtach_user ON public.event_achievements(user_id);
ALTER TABLE public.event_achievements ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_achievements' AND policyname='evtach_read') THEN
    CREATE POLICY evtach_read ON public.event_achievements FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_achievements' AND policyname='evtach_own') THEN
    CREATE POLICY evtach_own ON public.event_achievements FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- ── Columns: add category_id + recurring fields to community_events ───────────
ALTER TABLE public.community_events
  ADD COLUMN IF NOT EXISTS category_id      uuid REFERENCES public.event_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_recurring     boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurrence_rule  text        CHECK (recurrence_rule IN ('daily','weekly','monthly','custom')),
  ADD COLUMN IF NOT EXISTS parent_event_id  uuid        REFERENCES public.community_events(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rsvp_going       integer     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rsvp_interested  integer     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rsvp_maybe       integer     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS engagement_score numeric(6,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count       bigint      NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_ce_category    ON public.community_events(category_id);
CREATE INDEX IF NOT EXISTS idx_ce_engagement  ON public.community_events(engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_ce_featured    ON public.community_events(is_featured, start_time) WHERE is_featured = true AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_ce_start_time  ON public.community_events(start_time, is_active);

-- ── Initialize event_analytics rows for existing events ──────────────────────
INSERT INTO public.event_analytics (event_id)
SELECT id FROM public.community_events
ON CONFLICT (event_id) DO NOTHING;

-- ── RPC: rsvp_event ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rsvp_event(
  p_event_id uuid,
  p_state    text DEFAULT 'going'
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_uid  uuid := auth.uid();
  v_old  text;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('ok',false,'error','unauthenticated'); END IF;
  IF p_state NOT IN ('going','interested','maybe','not_going') THEN
    RETURN jsonb_build_object('ok',false,'error','invalid_state');
  END IF;
  SELECT state INTO v_old FROM public.event_rsvp WHERE event_id=p_event_id AND user_id=v_uid;
  IF p_state = 'not_going' THEN
    DELETE FROM public.event_rsvp WHERE event_id=p_event_id AND user_id=v_uid;
    -- Also remove from attendees if was going
    DELETE FROM public.community_event_attendees WHERE event_id=p_event_id AND user_id=v_uid;
  ELSE
    INSERT INTO public.event_rsvp(event_id, user_id, state)
    VALUES(p_event_id, v_uid, p_state)
    ON CONFLICT(event_id, user_id) DO UPDATE SET state=p_state, updated_at=now();
    IF p_state = 'going' THEN
      INSERT INTO public.community_event_attendees(event_id, user_id)
      VALUES(p_event_id, v_uid) ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  -- Update RSVP counts on community_events
  UPDATE public.community_events SET
    rsvp_going      = (SELECT COUNT(*) FROM public.event_rsvp WHERE event_id=p_event_id AND state='going'),
    rsvp_interested = (SELECT COUNT(*) FROM public.event_rsvp WHERE event_id=p_event_id AND state='interested'),
    rsvp_maybe      = (SELECT COUNT(*) FROM public.event_rsvp WHERE event_id=p_event_id AND state='maybe'),
    attendee_count  = (SELECT COUNT(*) FROM public.community_event_attendees WHERE event_id=p_event_id),
    updated_at      = now()
  WHERE id = p_event_id;
  -- Update analytics
  INSERT INTO public.event_analytics(event_id, rsvp_going, rsvp_interested, rsvp_maybe)
  VALUES(p_event_id,
    (SELECT COUNT(*) FROM public.event_rsvp WHERE event_id=p_event_id AND state='going'),
    (SELECT COUNT(*) FROM public.event_rsvp WHERE event_id=p_event_id AND state='interested'),
    (SELECT COUNT(*) FROM public.event_rsvp WHERE event_id=p_event_id AND state='maybe'))
  ON CONFLICT(event_id) DO UPDATE SET
    rsvp_going      = EXCLUDED.rsvp_going,
    rsvp_interested = EXCLUDED.rsvp_interested,
    rsvp_maybe      = EXCLUDED.rsvp_maybe,
    updated_at      = now();
  RETURN jsonb_build_object('ok',true,'state',p_state,'previous',v_old);
END; $$;
GRANT EXECUTE ON FUNCTION public.rsvp_event(uuid,text) TO authenticated, service_role;

-- ── RPC: react_to_event ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.react_to_event(
  p_event_id uuid,
  p_reaction text
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_existed boolean;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('ok',false,'error','unauthenticated'); END IF;
  SELECT EXISTS(SELECT 1 FROM public.event_reactions WHERE event_id=p_event_id AND user_id=v_uid AND reaction=p_reaction)
    INTO v_existed;
  IF v_existed THEN
    DELETE FROM public.event_reactions WHERE event_id=p_event_id AND user_id=v_uid AND reaction=p_reaction;
    RETURN jsonb_build_object('ok',true,'action','removed','reaction',p_reaction);
  ELSE
    INSERT INTO public.event_reactions(event_id, user_id, reaction) VALUES(p_event_id, v_uid, p_reaction)
    ON CONFLICT DO NOTHING;
    RETURN jsonb_build_object('ok',true,'action','added','reaction',p_reaction);
  END IF;
END; $$;
GRANT EXECUTE ON FUNCTION public.react_to_event(uuid,text) TO authenticated, service_role;

-- ── RPC: track_event_view ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.track_event_view(p_event_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  UPDATE public.community_events SET view_count = view_count + 1 WHERE id = p_event_id;
  INSERT INTO public.event_analytics(event_id, view_count)
  VALUES(p_event_id, 1)
  ON CONFLICT(event_id) DO UPDATE SET view_count = event_analytics.view_count + 1, updated_at=now();
END; $$;
GRANT EXECUTE ON FUNCTION public.track_event_view(uuid) TO anon, authenticated, service_role;

-- ── RPC: get_event_discovery ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_event_discovery(
  p_type  text    DEFAULT 'upcoming',
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_uid   uuid := auth.uid();
  v_res   jsonb;
BEGIN
  IF p_type = 'trending' THEN
    SELECT jsonb_agg(row_to_json(e)) INTO v_res FROM (
      SELECT e.*, ea.engagement_score as _score
      FROM public.community_events e
      LEFT JOIN public.event_analytics ea ON ea.event_id = e.id
      WHERE e.is_active = true AND e.start_time > now() - interval '7 days'
      ORDER BY ea.engagement_score DESC NULLS LAST, e.attendee_count DESC
      LIMIT p_limit OFFSET p_offset
    ) e;
  ELSIF p_type = 'starting_soon' THEN
    SELECT jsonb_agg(row_to_json(e)) INTO v_res FROM (
      SELECT * FROM public.community_events
      WHERE is_active = true AND start_time BETWEEN now() AND now() + interval '2 hours'
      ORDER BY start_time ASC LIMIT p_limit OFFSET p_offset
    ) e;
  ELSIF p_type = 'featured' THEN
    SELECT jsonb_agg(row_to_json(e)) INTO v_res FROM (
      SELECT * FROM public.community_events
      WHERE is_active = true AND is_featured = true AND start_time > now()
      ORDER BY start_time ASC LIMIT p_limit OFFSET p_offset
    ) e;
  ELSIF p_type = 'my_groups' AND v_uid IS NOT NULL THEN
    SELECT jsonb_agg(row_to_json(e)) INTO v_res FROM (
      SELECT ce.* FROM public.community_events ce
      WHERE ce.is_active = true AND ce.start_time > now()
        AND ce.creator_id IN (
          SELECT gm2.user_id FROM public.group_members gm2
          WHERE gm2.group_id IN (SELECT group_id FROM public.group_members WHERE user_id = v_uid)
        )
      ORDER BY ce.start_time ASC LIMIT p_limit OFFSET p_offset
    ) e;
  ELSIF p_type = 'near_full' THEN
    SELECT jsonb_agg(row_to_json(e)) INTO v_res FROM (
      SELECT * FROM public.community_events
      WHERE is_active = true AND start_time > now() AND max_attendees > 0
        AND attendee_count >= (max_attendees * 0.8)
      ORDER BY start_time ASC LIMIT p_limit OFFSET p_offset
    ) e;
  ELSE -- upcoming (default)
    SELECT jsonb_agg(row_to_json(e)) INTO v_res FROM (
      SELECT * FROM public.community_events
      WHERE is_active = true AND start_time > now()
      ORDER BY start_time ASC LIMIT p_limit OFFSET p_offset
    ) e;
  END IF;
  RETURN COALESCE(v_res, '[]'::jsonb);
END; $$;
GRANT EXECUTE ON FUNCTION public.get_event_discovery(text, integer, integer) TO anon, authenticated, service_role;

-- ── RPC: get_event_full ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_event_full(p_event_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_uid      uuid := auth.uid();
  v_event    jsonb;
  v_reactions jsonb;
  v_rsvp     text;
  v_my_reactions jsonb;
  v_analytics jsonb;
BEGIN
  SELECT row_to_json(e)::jsonb INTO v_event FROM public.community_events e WHERE id = p_event_id;
  IF v_event IS NULL THEN RETURN jsonb_build_object('error','not_found'); END IF;
  SELECT jsonb_object_agg(reaction, cnt) INTO v_reactions FROM (
    SELECT reaction, COUNT(*) as cnt FROM public.event_reactions WHERE event_id=p_event_id GROUP BY reaction
  ) r;
  IF v_uid IS NOT NULL THEN
    SELECT state INTO v_rsvp FROM public.event_rsvp WHERE event_id=p_event_id AND user_id=v_uid;
    SELECT jsonb_agg(reaction) INTO v_my_reactions FROM public.event_reactions WHERE event_id=p_event_id AND user_id=v_uid;
  END IF;
  SELECT row_to_json(a)::jsonb INTO v_analytics FROM public.event_analytics a WHERE event_id=p_event_id;
  RETURN v_event
    || jsonb_build_object(
      'reactions', COALESCE(v_reactions, '{}'::jsonb),
      'my_rsvp', v_rsvp,
      'my_reactions', COALESCE(v_my_reactions, '[]'::jsonb),
      'analytics', COALESCE(v_analytics, '{}'::jsonb)
    );
END; $$;
GRANT EXECUTE ON FUNCTION public.get_event_full(uuid) TO anon, authenticated, service_role;

-- ── RPC: update_event_engagement_score ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_event_engagement_score(p_event_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_score numeric;
BEGIN
  SELECT
    (COALESCE(view_count,0) * 0.5 +
     COALESCE(reaction_count,0) * 2 +
     COALESCE(chat_message_count,0) * 1.5 +
     COALESCE(rsvp_going,0) * 5 +
     COALESCE(rsvp_interested,0) * 2 +
     COALESCE(thread_count,0) * 3 +
     COALESCE(resource_count,0) * 4 +
     COALESCE(attendance_count,0) * 10)
  INTO v_score
  FROM public.event_analytics WHERE event_id = p_event_id;
  UPDATE public.event_analytics SET engagement_score = COALESCE(v_score,0), updated_at=now() WHERE event_id=p_event_id;
  UPDATE public.community_events SET engagement_score = COALESCE(v_score,0) WHERE id = p_event_id;
END; $$;
GRANT EXECUTE ON FUNCTION public.update_event_engagement_score(uuid) TO service_role;

-- ── Trigger: auto-update analytics counts ────────────────────────────────────
CREATE OR REPLACE FUNCTION public._evt_update_analytics()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_event_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'event_messages' THEN
    v_event_id := COALESCE(NEW.event_id, OLD.event_id);
    INSERT INTO public.event_analytics(event_id, chat_message_count) VALUES(v_event_id, 0)
    ON CONFLICT(event_id) DO UPDATE SET
      chat_message_count = (SELECT COUNT(*) FROM public.event_messages WHERE event_id=v_event_id AND deleted_at IS NULL),
      updated_at=now();
  ELSIF TG_TABLE_NAME = 'event_reactions' THEN
    v_event_id := COALESCE(NEW.event_id, OLD.event_id);
    INSERT INTO public.event_analytics(event_id, reaction_count) VALUES(v_event_id, 0)
    ON CONFLICT(event_id) DO UPDATE SET
      reaction_count = (SELECT COUNT(*) FROM public.event_reactions WHERE event_id=v_event_id),
      updated_at=now();
  ELSIF TG_TABLE_NAME = 'event_resources' THEN
    v_event_id := COALESCE(NEW.event_id, OLD.event_id);
    INSERT INTO public.event_analytics(event_id, resource_count) VALUES(v_event_id, 0)
    ON CONFLICT(event_id) DO UPDATE SET
      resource_count = (SELECT COUNT(*) FROM public.event_resources WHERE event_id=v_event_id),
      updated_at=now();
  ELSIF TG_TABLE_NAME = 'event_threads' THEN
    v_event_id := COALESCE(NEW.event_id, OLD.event_id);
    INSERT INTO public.event_analytics(event_id, thread_count) VALUES(v_event_id, 0)
    ON CONFLICT(event_id) DO UPDATE SET
      thread_count = (SELECT COUNT(*) FROM public.event_threads WHERE event_id=v_event_id),
      updated_at=now();
  END IF;
  RETURN COALESCE(NEW, OLD);
END; $$;

DROP TRIGGER IF EXISTS trg_evtana_messages  ON public.event_messages;
DROP TRIGGER IF EXISTS trg_evtana_reactions ON public.event_reactions;
DROP TRIGGER IF EXISTS trg_evtana_resources ON public.event_resources;
DROP TRIGGER IF EXISTS trg_evtana_threads   ON public.event_threads;

CREATE TRIGGER trg_evtana_messages  AFTER INSERT OR DELETE ON public.event_messages  FOR EACH ROW EXECUTE FUNCTION public._evt_update_analytics();
CREATE TRIGGER trg_evtana_reactions AFTER INSERT OR DELETE ON public.event_reactions FOR EACH ROW EXECUTE FUNCTION public._evt_update_analytics();
CREATE TRIGGER trg_evtana_resources AFTER INSERT OR DELETE ON public.event_resources FOR EACH ROW EXECUTE FUNCTION public._evt_update_analytics();
CREATE TRIGGER trg_evtana_threads   AFTER INSERT OR DELETE ON public.event_threads   FOR EACH ROW EXECUTE FUNCTION public._evt_update_analytics();

CREATE OR REPLACE FUNCTION public.increment_event_resource_download(
  p_event_id uuid,
  p_resource_id uuid
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_count integer;
BEGIN
  UPDATE public.event_resources
  SET download_count = COALESCE(download_count,0) + 1
  WHERE id = p_resource_id AND event_id = p_event_id
  RETURNING download_count INTO v_count;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'resource_not_found');
  END IF;

  RETURN jsonb_build_object('ok', true, 'download_count', v_count);
END; $$;
GRANT EXECUTE ON FUNCTION public.increment_event_resource_download(uuid,uuid) TO anon, authenticated, service_role;

DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_rsvp;             EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_messages;         EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_threads;          EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_thread_replies;   EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_reactions;        EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_resources;        EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_roles;            EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_presence;         EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_reminders;        EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_announcements;    EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_pinned_messages;  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
