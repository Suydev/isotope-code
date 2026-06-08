-- IsotopeAI v3.3.7 — Cloud sync schema migration
  -- Run once against your Supabase project.
  -- Safe to re-run (all statements use IF NOT EXISTS / DO $$ guards).
  -- Applied automatically by the Replit agent on 2026-06-08.

  -- ─────────────────────────────────────────────────────────────────────────────
  -- 1. sync_items — durable per-user sync queue and history log
  -- ─────────────────────────────────────────────────────────────────────────────

  CREATE TABLE IF NOT EXISTS public.sync_items (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entity          text NOT NULL,
    entity_id       text NOT NULL,
    operation       text NOT NULL,
    remote_path     text,
    bucket          text,
    content_hash    text,
    payload_size    bigint,
    version         integer NOT NULL DEFAULT 1,
    status          text NOT NULL DEFAULT 'pending',
    last_error      text,
    deleted_at      timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    last_synced_at  timestamptz,
    CONSTRAINT sync_items_user_entity_id_unique UNIQUE (user_id, entity, entity_id)
  );

  CREATE INDEX IF NOT EXISTS sync_items_user_id_idx ON public.sync_items (user_id);
  CREATE INDEX IF NOT EXISTS sync_items_status_idx  ON public.sync_items (user_id, status);
  CREATE INDEX IF NOT EXISTS sync_items_entity_idx  ON public.sync_items (user_id, entity, entity_id);

  ALTER TABLE public.sync_items ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "sync_items_select_own" ON public.sync_items;
  DROP POLICY IF EXISTS "sync_items_insert_own" ON public.sync_items;
  DROP POLICY IF EXISTS "sync_items_update_own" ON public.sync_items;
  DROP POLICY IF EXISTS "sync_items_delete_own"  ON public.sync_items;

  CREATE POLICY "sync_items_select_own" ON public.sync_items
    FOR SELECT USING ((SELECT auth.uid()) = user_id);
  CREATE POLICY "sync_items_insert_own" ON public.sync_items
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
  CREATE POLICY "sync_items_update_own" ON public.sync_items
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);
  CREATE POLICY "sync_items_delete_own" ON public.sync_items
    FOR DELETE USING ((SELECT auth.uid()) = user_id);

  -- ─────────────────────────────────────────────────────────────────────────────
  -- 2. Sync metadata columns on key tables
  --    (version, content_hash, deleted_at, last_synced_at, device_id, updated_at)
  -- ─────────────────────────────────────────────────────────────────────────────

  DO $$ BEGIN
    -- study_sessions_log
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_sessions_log' AND column_name='updated_at') THEN
      ALTER TABLE public.study_sessions_log ADD COLUMN updated_at timestamptz DEFAULT now(); END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_sessions_log' AND column_name='deleted_at') THEN
      ALTER TABLE public.study_sessions_log ADD COLUMN deleted_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_sessions_log' AND column_name='version') THEN
      ALTER TABLE public.study_sessions_log ADD COLUMN version integer NOT NULL DEFAULT 1; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_sessions_log' AND column_name='content_hash') THEN
      ALTER TABLE public.study_sessions_log ADD COLUMN content_hash text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_sessions_log' AND column_name='last_synced_at') THEN
      ALTER TABLE public.study_sessions_log ADD COLUMN last_synced_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='study_sessions_log' AND column_name='device_id') THEN
      ALTER TABLE public.study_sessions_log ADD COLUMN device_id text; END IF;

    -- daily_user_stats
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='daily_user_stats' AND column_name='created_at') THEN
      ALTER TABLE public.daily_user_stats ADD COLUMN created_at timestamptz DEFAULT now(); END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='daily_user_stats' AND column_name='updated_at') THEN
      ALTER TABLE public.daily_user_stats ADD COLUMN updated_at timestamptz DEFAULT now(); END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='daily_user_stats' AND column_name='deleted_at') THEN
      ALTER TABLE public.daily_user_stats ADD COLUMN deleted_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='daily_user_stats' AND column_name='version') THEN
      ALTER TABLE public.daily_user_stats ADD COLUMN version integer NOT NULL DEFAULT 1; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='daily_user_stats' AND column_name='content_hash') THEN
      ALTER TABLE public.daily_user_stats ADD COLUMN content_hash text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='daily_user_stats' AND column_name='last_synced_at') THEN
      ALTER TABLE public.daily_user_stats ADD COLUMN last_synced_at timestamptz; END IF;

    -- user_profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='created_at') THEN
      ALTER TABLE public.user_profiles ADD COLUMN created_at timestamptz DEFAULT now(); END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='deleted_at') THEN
      ALTER TABLE public.user_profiles ADD COLUMN deleted_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='version') THEN
      ALTER TABLE public.user_profiles ADD COLUMN version integer NOT NULL DEFAULT 1; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='content_hash') THEN
      ALTER TABLE public.user_profiles ADD COLUMN content_hash text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='last_synced_at') THEN
      ALTER TABLE public.user_profiles ADD COLUMN last_synced_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='device_id') THEN
      ALTER TABLE public.user_profiles ADD COLUMN device_id text; END IF;

    -- user_settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_settings' AND column_name='deleted_at') THEN
      ALTER TABLE public.user_settings ADD COLUMN deleted_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_settings' AND column_name='version') THEN
      ALTER TABLE public.user_settings ADD COLUMN version integer NOT NULL DEFAULT 1; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_settings' AND column_name='content_hash') THEN
      ALTER TABLE public.user_settings ADD COLUMN content_hash text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_settings' AND column_name='last_synced_at') THEN
      ALTER TABLE public.user_settings ADD COLUMN last_synced_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_settings' AND column_name='device_id') THEN
      ALTER TABLE public.user_settings ADD COLUMN device_id text; END IF;

    -- users
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='deleted_at') THEN
      ALTER TABLE public.users ADD COLUMN deleted_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='version') THEN
      ALTER TABLE public.users ADD COLUMN version integer NOT NULL DEFAULT 1; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='content_hash') THEN
      ALTER TABLE public.users ADD COLUMN content_hash text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='last_synced_at') THEN
      ALTER TABLE public.users ADD COLUMN last_synced_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='device_id') THEN
      ALTER TABLE public.users ADD COLUMN device_id text; END IF;

    -- notifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='notifications' AND column_name='updated_at') THEN
      ALTER TABLE public.notifications ADD COLUMN updated_at timestamptz DEFAULT now(); END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='notifications' AND column_name='deleted_at') THEN
      ALTER TABLE public.notifications ADD COLUMN deleted_at timestamptz; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='notifications' AND column_name='version') THEN
      ALTER TABLE public.notifications ADD COLUMN version integer NOT NULL DEFAULT 1; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='notifications' AND column_name='content_hash') THEN
      ALTER TABLE public.notifications ADD COLUMN content_hash text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='notifications' AND column_name='last_synced_at') THEN
      ALTER TABLE public.notifications ADD COLUMN last_synced_at timestamptz; END IF;
  END $$;
  