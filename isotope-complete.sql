-- =============================================================================
-- IsotopeAI — full portable schema dump (NO user data)
-- Generated: 2026-08-30 13:59:15 UTC
-- Project ref: ollsqiutzartjhiuzkbf
-- Schemas: private, rpc_private, public
--
-- HOW TO RESTORE INTO A FRESH SUPABASE PROJECT:
--   1. Create a new Supabase project.
--   2. Open the SQL editor and run this ENTIRE file (it is transactional).
--   3. (Optional) recreate storage buckets used by the app (e.g. 'avatars').
--   4. Update .env: SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
--      (and SUPABASE_ACCESS_TOKEN) to the new project's values, then restart.
--
-- NOTE: auth.* and storage.* schemas are managed by Supabase and are NOT
-- included. User data (profiles, groups, sessions, chat, stats) is excluded
-- intentionally. RLS policies, functions, triggers, indexes and grants are
-- fully restored so the app works out of the box.
-- =============================================================================
BEGIN;

CREATE SCHEMA IF NOT EXISTS "private";
GRANT USAGE ON SCHEMA "private" TO authenticated;
GRANT USAGE ON SCHEMA "private" TO service_role;
GRANT USAGE ON SCHEMA "private" TO anon;
CREATE SCHEMA IF NOT EXISTS "rpc_private";
GRANT USAGE ON SCHEMA "rpc_private" TO anon;
GRANT USAGE ON SCHEMA "rpc_private" TO authenticated;
GRANT USAGE ON SCHEMA "rpc_private" TO service_role;
CREATE SCHEMA IF NOT EXISTS "public";
GRANT USAGE ON SCHEMA "public" TO anon;
GRANT USAGE ON SCHEMA "public" TO authenticated;
GRANT USAGE ON SCHEMA "public" TO service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS "public"."backup_manifests" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "bucket" text not null,
  "path" text not null,
  "kind" text not null,
  "content_hash" text not null,
  "size_bytes" bigint not null,
  "collection_counts" jsonb not null default '{}'::jsonb,
  "exported_at" timestamp with time zone,
  "selected_as_best" boolean not null default false,
  "score" integer not null default 0,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."buddy_invites" (
  "id" uuid not null default gen_random_uuid(),
  "token" text not null,
  "inviter_id" uuid not null,
  "max_uses" integer default 1,
  "uses_count" integer default 0,
  "expires_at" timestamp with time zone,
  "created_at" timestamp with time zone default now()
);
CREATE TABLE IF NOT EXISTS "public"."community_device_tokens" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "token" text not null,
  "platform" text not null default 'web'::text,
  "created_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."community_enrollments" (
  "user_id" uuid not null,
  "enrolled" boolean not null default true,
  "day_offset_hours" integer not null default 0,
  "privacy" jsonb not null default '{}'::jsonb,
  "quiet_hours" jsonb not null default '{}'::jsonb,
  "onboarded" boolean not null default false,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."community_event_attendees" (
  "event_id" uuid not null,
  "user_id" uuid not null,
  "joined_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."community_events" (
  "id" uuid not null default gen_random_uuid(),
  "title" text not null default ''::text,
  "event_type" text not null default 'webinar'::text,
  "description" text,
  "host" text,
  "start_time" timestamp with time zone not null default now(),
  "end_time" timestamp with time zone,
  "image_gradient" text not null default 'from-purple-600 to-blue-500'::text,
  "image_url" text,
  "tags" text[] not null default '{}'::text[],
  "max_attendees" integer,
  "attendee_count" integer not null default 0,
  "is_featured" boolean not null default false,
  "is_active" boolean not null default true,
  "updated_at" timestamp with time zone not null default now(),
  "created_at" timestamp with time zone not null default now(),
  "creator_id" uuid,
  "host_user_id" uuid
);
CREATE TABLE IF NOT EXISTS "public"."community_friends" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "friend_id" uuid not null,
  "status" text not null default 'pending'::text,
  "accepted_at" timestamp with time zone,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."community_join_requests" (
  "id" uuid not null default gen_random_uuid(),
  "group_id" uuid not null,
  "user_id" uuid not null,
  "status" text not null default 'pending'::text,
  "created_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."community_reports" (
  "id" uuid not null default gen_random_uuid(),
  "reporter_user_id" uuid not null,
  "target_type" text not null,
  "target_id" uuid not null,
  "reason" text,
  "created_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."community_start_alerts" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "target_type" text not null,
  "target_id" uuid not null,
  "enabled" boolean not null default true,
  "quiet_hours_enabled" boolean not null default false,
  "quiet_start" time without time zone,
  "quiet_end" time without time zone,
  "updated_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."daily_logs" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "date" date not null default CURRENT_DATE,
  "sleep_hours" numeric,
  "sleep_quality" integer,
  "mood" integer,
  "energy_level" integer,
  "questions_solved" integer default 0,
  "questions_attempted" integer default 0,
  "questions_target" integer default 0,
  "questions_by_subject" jsonb default '{}'::jsonb,
  "notes" text,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "device_id" text
);
CREATE TABLE IF NOT EXISTS "public"."daily_user_stats" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid,
  "date" date not null,
  "seconds_studied" integer default 0,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "version" integer not null default 1,
  "content_hash" text,
  "last_synced_at" timestamp with time zone
);
CREATE TABLE IF NOT EXISTS "public"."exams" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "title" text not null,
  "date" timestamp with time zone,
  "target_score" numeric,
  "total_marks" integer,
  "syllabus_ids" jsonb default '[]'::jsonb,
  "chapter_ids" jsonb default '[]'::jsonb,
  "priority" text default 'medium'::text,
  "is_d_day" boolean default false,
  "preparation_progress" numeric default 0,
  "daily_study_goal" integer,
  "total_prep_time" integer,
  "linked_mock_test_ids" jsonb default '[]'::jsonb,
  "milestones" jsonb default '[]'::jsonb,
  "revision_schedule" jsonb,
  "result" jsonb,
  "analysis" jsonb,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "type" text default 'exam'::text,
  "reminders" jsonb default '[]'::jsonb
);
CREATE TABLE IF NOT EXISTS "public"."focus_sessions" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "subject_ids" jsonb default '[]'::jsonb,
  "chapter_ids" jsonb default '[]'::jsonb,
  "topic_ids" jsonb default '[]'::jsonb,
  "task_ids" jsonb default '[]'::jsonb,
  "subject" text,
  "subject_id" uuid,
  "topic" text,
  "duration" integer default 0,
  "planned_duration" integer default 0,
  "start_time" timestamp with time zone default now(),
  "end_time" timestamp with time zone,
  "type" text default 'focus'::text,
  "task_type" text,
  "session_type" text default 'focus'::text,
  "description" text,
  "mode" text default 'normal'::text,
  "time_allocation" jsonb,
  "allocation_strategy" text,
  "pause_logs" jsonb default '[]'::jsonb,
  "total_pause_time" integer default 0,
  "interruptions" integer default 0,
  "efficiency" numeric default 0,
  "productivity_rating" integer,
  "notes" text,
  "completed_task_ids" jsonb default '[]'::jsonb,
  "questions_attempted" integer default 0,
  "questions_correct" integer default 0,
  "questions_incorrect" integer default 0,
  "questions_skipped" integer default 0,
  "target_questions" integer default 0,
  "questions_by_subject" jsonb default '{}'::jsonb,
  "questions_by_chapter" jsonb default '{}'::jsonb,
  "completed" boolean default false,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "duration_minutes" integer,
  "device_id" text,
  "time_allocation_synced" boolean default false
);
CREATE TABLE IF NOT EXISTS "public"."group_announcements" (
  "id" uuid not null default gen_random_uuid(),
  "group_id" uuid,
  "content" text,
  "author_id" uuid,
  "pinned" boolean default false,
  "created_at" timestamp with time zone default now()
);
CREATE TABLE IF NOT EXISTS "public"."group_challenge_participants" (
  "id" uuid not null default gen_random_uuid(),
  "challenge_id" uuid,
  "user_id" uuid,
  "progress" numeric default 0,
  "completed" boolean default false,
  "completed_at" timestamp with time zone,
  "joined_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."group_challenges" (
  "id" uuid not null default gen_random_uuid(),
  "group_id" uuid,
  "title" text,
  "description" text,
  "goal_type" text,
  "goal_value" numeric,
  "start_time" timestamp with time zone,
  "end_time" timestamp with time zone,
  "created_by" uuid,
  "is_active" boolean default true,
  "created_at" timestamp with time zone default now()
);
CREATE TABLE IF NOT EXISTS "public"."group_chat_messages" (
  "id" uuid not null default gen_random_uuid(),
  "group_id" uuid,
  "author_id" uuid,
  "content" text,
  "pinned" boolean default false,
  "created_at" timestamp with time zone default now(),
  "user_id" uuid,
  "message_type" text not null default 'text'::text,
  "reply_to_id" uuid,
  "deleted_at" timestamp with time zone
);
CREATE TABLE IF NOT EXISTS "public"."group_invites" (
  "id" uuid not null default gen_random_uuid(),
  "group_id" uuid,
  "token" text,
  "created_by" uuid,
  "max_uses" integer,
  "uses_count" integer default 0,
  "expires_at" timestamp with time zone,
  "created_at" timestamp with time zone default now(),
  "invite_code" text
);
CREATE TABLE IF NOT EXISTS "public"."group_members" (
  "id" uuid not null default gen_random_uuid(),
  "group_id" uuid,
  "user_id" uuid,
  "role" text default 'member'::text,
  "joined_at" timestamp with time zone default now(),
  "is_super_admin" boolean not null default false,
  "left_at" timestamp with time zone,
  "updated_at" timestamp with time zone default now()
);
CREATE TABLE IF NOT EXISTS "public"."group_milestones" (
  "id" uuid not null default gen_random_uuid(),
  "group_id" uuid,
  "milestone_type" text,
  "earned_at" timestamp with time zone default now()
);
CREATE TABLE IF NOT EXISTS "public"."groups" (
  "id" uuid not null default gen_random_uuid(),
  "name" text not null,
  "description" text,
  "cover_url" text,
  "logo_url" text,
  "category" text,
  "slug" text,
  "member_count" integer default 0,
  "owner_id" uuid,
  "is_public" boolean not null default true,
  "settings" jsonb default '{}'::jsonb,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "fts" tsvector generated always as (to_tsvector('english'::regconfig, ((((COALESCE(name, ''::text) || ' '::text) || COALESCE(description, ''::text)) || ' '::text) || COALESCE(category, ''::text)))) stored,
  "visibility" text,
  "max_members" integer not null default 100,
  "is_active" boolean not null default true,
  "icon_url" text,
  "exam" text,
  "target_year" integer,
  "subjects" text[],
  "join_policy" text not null default 'request'::text,
  "visual_key" integer not null default 0,
  "timezone_offset" integer not null default 0,
  "daily_start" timestamp with time zone,
  "last_activity" timestamp with time zone
);
CREATE TABLE IF NOT EXISTS "public"."habits" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "name" text not null,
  "icon" text,
  "completed" boolean default false,
  "streak" integer default 0,
  "longest_streak" integer default 0,
  "frequency" text default 'daily'::text,
  "target_days" jsonb default '[]'::jsonb,
  "completion_history" jsonb default '[]'::jsonb,
  "last_completed_date" date,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone
);
CREATE TABLE IF NOT EXISTS "public"."mock_tests" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "name" text not null,
  "test_type" text default 'mock'::text,
  "date" timestamp with time zone,
  "time" text,
  "categories" jsonb default '[]'::jsonb,
  "environment" text,
  "duration" integer,
  "total_questions" integer default 0,
  "expected_difficulty" text,
  "paper_url" text,
  "subject_performance" jsonb default '{}'::jsonb,
  "total_marks" integer default 0,
  "scored_marks" numeric default 0,
  "percentage" numeric default 0,
  "rank" integer,
  "target_score" numeric,
  "preparation_time" integer,
  "confidence_level" integer,
  "notes" text,
  "enable_mistake_tracking" boolean default true,
  "enable_takeaway_collection" boolean default true,
  "enable_review_reminders" boolean default true,
  "syllabus_covered" jsonb default '[]'::jsonb,
  "chapters_covered" jsonb default '[]'::jsonb,
  "mistakes" jsonb default '[]'::jsonb,
  "takeaways" jsonb default '[]'::jsonb,
  "status" text default 'pending'::text,
  "completed_at" timestamp with time zone,
  "analyzed_at" timestamp with time zone,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "exam_id" uuid,
  "device_id" text
);
CREATE TABLE IF NOT EXISTS "public"."notifications" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "type" text not null default 'system'::text,
  "title" text not null default ''::text,
  "body" text not null default ''::text,
  "data" jsonb not null default '{}'::jsonb,
  "read_at" timestamp with time zone,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "version" integer not null default 1,
  "content_hash" text,
  "last_synced_at" timestamp with time zone
);
CREATE TABLE IF NOT EXISTS "public"."store_items" (
  "id" uuid not null default gen_random_uuid(),
  "name" text not null default ''::text,
  "description" text,
  "price" integer not null default 0,
  "currency" text not null default 'coins'::text,
  "category" text not null default 'theme'::text,
  "image" text,
  "active" boolean not null default true,
  "created_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."study_sessions_log" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid,
  "duration_minutes" numeric,
  "ended_at" timestamp with time zone,
  "subject" text,
  "created_at" timestamp with time zone default now(),
  "started_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "version" integer not null default 1,
  "content_hash" text,
  "last_synced_at" timestamp with time zone,
  "device_id" text,
  "notes" text
);
CREATE TABLE IF NOT EXISTS "public"."subjects" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "name" text not null,
  "color" text,
  "gradient" text,
  "icon" text,
  "chapters" jsonb default '[]'::jsonb,
  "exam_template_id" text,
  "exam_name" text,
  "is_custom" boolean default false,
  "topics" jsonb default '[]'::jsonb,
  "syllabus_config" jsonb default '{}'::jsonb,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "study_time" numeric
);
CREATE TABLE IF NOT EXISTS "public"."sync_items" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "entity" text not null,
  "entity_id" text not null,
  "operation" text not null,
  "remote_path" text,
  "bucket" text,
  "content_hash" text,
  "payload_size" bigint,
  "version" integer not null default 1,
  "status" text not null default 'pending'::text,
  "last_error" text,
  "deleted_at" timestamp with time zone,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "last_synced_at" timestamp with time zone
);
CREATE TABLE IF NOT EXISTS "public"."tasks" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "title" text not null,
  "subject" text,
  "subject_id" uuid,
  "chapter_id" text,
  "topic_id" text,
  "status" text default 'pending'::text,
  "priority" text default 'medium'::text,
  "due_date" timestamp with time zone,
  "effort" text,
  "energy" text,
  "energy_level" text,
  "description" text,
  "subtasks" jsonb default '[]'::jsonb,
  "linked_session_ids" jsonb default '[]'::jsonb,
  "focus_session_ids" jsonb default '[]'::jsonb,
  "total_focus_time" integer default 0,
  "completed_in_session" boolean default false,
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "device_id" text,
  "estimated_time" integer,
  "is_recurring" boolean default false,
  "recurring_config" jsonb,
  "parent_task_id" uuid,
  "is_recurring_instance" boolean default false
);
CREATE TABLE IF NOT EXISTS "public"."tests" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "title" text not null,
  "date" timestamp with time zone,
  "total_marks" integer default 0,
  "scored_marks" numeric default 0,
  "percentage" numeric default 0,
  "subjects" jsonb default '[]'::jsonb,
  "subject_id" uuid,
  "analysis" jsonb,
  "mistakes" jsonb default '[]'::jsonb,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "device_id" text
);
CREATE TABLE IF NOT EXISTS "public"."user_display_profiles" (
  "id" uuid not null,
  "username" text,
  "name" text,
  "avatar_url" text,
  "updated_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."user_inventory" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "item_id" uuid not null,
  "equipped" boolean not null default false,
  "purchased_at" timestamp with time zone not null default now(),
  "created_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."user_onboarding" (
  "user_id" uuid not null,
  "completed" boolean not null default false,
  "completed_at" timestamp with time zone,
  "source" text not null default 'profile'::text,
  "updated_at" timestamp with time zone not null default now(),
  "data" jsonb not null default '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS "public"."user_points" (
  "user_id" uuid not null,
  "points" integer default 0,
  "lifetime_points" integer default 0,
  "updated_at" timestamp with time zone default now()
);
CREATE TABLE IF NOT EXISTS "public"."user_presence" (
  "user_id" uuid not null,
  "status" text not null default 'offline'::text,
  "current_subject" text,
  "last_seen" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "state" text,
  "is_online" boolean not null default false,
  "last_beat_at" timestamp with time zone,
  "session_started_at" timestamp with time zone,
  "total_seconds" bigint not null default 0,
  "subject_id" uuid,
  "subject_name" text,
  "task_id" uuid,
  "task_title" text
);
CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "profile_data" jsonb default '{}'::jsonb,
  "updated_at" timestamp with time zone default now(),
  "created_at" timestamp with time zone default now(),
  "deleted_at" timestamp with time zone,
  "version" integer not null default 1,
  "content_hash" text,
  "last_synced_at" timestamp with time zone,
  "device_id" text,
  "handle" text,
  "display_name" text
);
CREATE TABLE IF NOT EXISTS "public"."user_roles" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "role" text not null default 'user'::text,
  "granted_by" uuid,
  "granted_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."user_settings" (
  "user_id" uuid not null,
  "settings" jsonb not null default '{}'::jsonb,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "deleted_at" timestamp with time zone,
  "version" integer not null default 1,
  "content_hash" text,
  "last_synced_at" timestamp with time zone,
  "device_id" text
);
CREATE TABLE IF NOT EXISTS "public"."user_stats_summary" (
  "user_id" uuid not null,
  "total_hours" numeric default 0,
  "weekly_hours" numeric default 0,
  "monthly_hours" numeric default 0,
  "current_streak" integer default 0,
  "longest_streak" integer default 0,
  "total_sessions" integer default 0,
  "last_session_at" timestamp with time zone,
  "updated_at" timestamp with time zone default now(),
  "total_study_seconds" bigint not null default 0,
  "streak_days" integer not null default 0,
  "max_streak_days" integer not null default 0,
  "session_count" integer not null default 0,
  "last_study_date" date
);
CREATE TABLE IF NOT EXISTS "public"."user_tours" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "tour_key" text not null,
  "completed" boolean not null default false,
  "completed_at" timestamp with time zone,
  "dismissed" boolean not null default false,
  "dismissed_at" timestamp with time zone,
  "step_reached" integer not null default 0,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
CREATE TABLE IF NOT EXISTS "public"."users" (
  "id" uuid not null,
  "email" text,
  "name" text,
  "avatar_url" text,
  "plan_type" text default 'ranker'::text,
  "billing_status" text default 'active'::text,
  "plan_expires_at" timestamp with time zone,
  "access_ends_at" timestamp with time zone,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  "username" text,
  "coins" integer not null default 0,
  "gems" integer not null default 0,
  "deleted_at" timestamp with time zone,
  "version" integer not null default 1,
  "content_hash" text,
  "last_synced_at" timestamp with time zone,
  "device_id" text,
  "access_source" text
);
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'backup_manifests_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."backup_manifests" ADD CONSTRAINT "backup_manifests_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buddy_invites_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."buddy_invites" ADD CONSTRAINT "buddy_invites_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_device_tokens_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_device_tokens" ADD CONSTRAINT "community_device_tokens_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_enrollments_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_enrollments" ADD CONSTRAINT "community_enrollments_pkey" PRIMARY KEY (user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_attendees_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_event_attendees" ADD CONSTRAINT "community_event_attendees_pkey" PRIMARY KEY (event_id, user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_events_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_events" ADD CONSTRAINT "community_events_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_friends_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_friends" ADD CONSTRAINT "community_friends_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_join_requests_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_join_requests" ADD CONSTRAINT "community_join_requests_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_reports_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_reports" ADD CONSTRAINT "community_reports_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_start_alerts_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_start_alerts" ADD CONSTRAINT "community_start_alerts_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'daily_logs_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."daily_logs" ADD CONSTRAINT "daily_logs_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'daily_user_stats_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."daily_user_stats" ADD CONSTRAINT "daily_user_stats_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exams_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."exams" ADD CONSTRAINT "exams_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'focus_sessions_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."focus_sessions" ADD CONSTRAINT "focus_sessions_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_announcements_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_announcements" ADD CONSTRAINT "group_announcements_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_challenge_participants_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_challenges_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenges" ADD CONSTRAINT "group_challenges_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_chat_messages_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_invites_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_milestones_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_milestones" ADD CONSTRAINT "group_milestones_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'groups_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'habits_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."habits" ADD CONSTRAINT "habits_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mock_tests_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."mock_tests" ADD CONSTRAINT "mock_tests_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'store_items_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."store_items" ADD CONSTRAINT "store_items_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_sessions_log_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."study_sessions_log" ADD CONSTRAINT "study_sessions_log_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subjects_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."subjects" ADD CONSTRAINT "subjects_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sync_items_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."sync_items" ADD CONSTRAINT "sync_items_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."tasks" ADD CONSTRAINT "tasks_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tests_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."tests" ADD CONSTRAINT "tests_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_display_profiles_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_display_profiles" ADD CONSTRAINT "user_display_profiles_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_inventory_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_inventory" ADD CONSTRAINT "user_inventory_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_onboarding_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_onboarding" ADD CONSTRAINT "user_onboarding_pkey" PRIMARY KEY (user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_points_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_points" ADD CONSTRAINT "user_points_pkey" PRIMARY KEY (user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_presence_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_presence" ADD CONSTRAINT "user_presence_pkey" PRIMARY KEY (user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_profiles" ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY (user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_settings" ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY (user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_stats_summary_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_stats_summary" ADD CONSTRAINT "user_stats_summary_pkey" PRIMARY KEY (user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_tours_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_tours" ADD CONSTRAINT "user_tours_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_pkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY (id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buddy_invites_inviter_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."buddy_invites" ADD CONSTRAINT "buddy_invites_inviter_id_fkey" FOREIGN KEY (inviter_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_attendees_event_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_event_attendees" ADD CONSTRAINT "community_event_attendees_event_id_fkey" FOREIGN KEY (event_id) REFERENCES community_events(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_attendees_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_event_attendees" ADD CONSTRAINT "community_event_attendees_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_events_creator_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_events" ADD CONSTRAINT "community_events_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_events_host_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_events" ADD CONSTRAINT "community_events_host_user_id_fkey" FOREIGN KEY (host_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'daily_logs_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."daily_logs" ADD CONSTRAINT "daily_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'daily_user_stats_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."daily_user_stats" ADD CONSTRAINT "daily_user_stats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exams_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."exams" ADD CONSTRAINT "exams_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'focus_sessions_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."focus_sessions" ADD CONSTRAINT "focus_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_announcements_author_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_announcements" ADD CONSTRAINT "group_announcements_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_announcements_group_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_announcements" ADD CONSTRAINT "group_announcements_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_challenge_participants_challenge_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES group_challenges(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_challenge_participants_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_challenges_created_by_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenges" ADD CONSTRAINT "group_challenges_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_challenges_group_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenges" ADD CONSTRAINT "group_challenges_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_chat_messages_author_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_chat_messages_group_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_chat_messages_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL NOT VALID;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_invites_created_by_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_invites_group_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_milestones_group_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_milestones" ADD CONSTRAINT "group_milestones_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'groups_owner_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'habits_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."habits" ADD CONSTRAINT "habits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mock_tests_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."mock_tests" ADD CONSTRAINT "mock_tests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_sessions_log_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."study_sessions_log" ADD CONSTRAINT "study_sessions_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subjects_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."subjects" ADD CONSTRAINT "subjects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sync_items_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."sync_items" ADD CONSTRAINT "sync_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tests_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."tests" ADD CONSTRAINT "tests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_display_profiles_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_display_profiles" ADD CONSTRAINT "user_display_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_onboarding_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_onboarding" ADD CONSTRAINT "user_onboarding_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_points_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_points" ADD CONSTRAINT "user_points_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_presence_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_presence" ADD CONSTRAINT "user_presence_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_granted_by_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_granted_by_fkey" FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_stats_summary_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_stats_summary" ADD CONSTRAINT "user_stats_summary_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_tours_user_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_tours" ADD CONSTRAINT "user_tours_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_id_fkey' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buddy_invites_token_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."buddy_invites" ADD CONSTRAINT "buddy_invites_token_key" UNIQUE (token);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_device_tokens_user_id_token_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_device_tokens" ADD CONSTRAINT "community_device_tokens_user_id_token_key" UNIQUE (user_id, token);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_join_requests_group_id_user_id_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_join_requests" ADD CONSTRAINT "community_join_requests_group_id_user_id_key" UNIQUE (group_id, user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_start_alerts_user_id_target_type_target_id_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."community_start_alerts" ADD CONSTRAINT "community_start_alerts_user_id_target_type_target_id_key" UNIQUE (user_id, target_type, target_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'daily_user_stats_user_id_date_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."daily_user_stats" ADD CONSTRAINT "daily_user_stats_user_id_date_key" UNIQUE (user_id, date);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gcp_challenge_user_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "gcp_challenge_user_key" UNIQUE (challenge_id, user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_challenge_participants_challenge_id_user_id_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_challenge_id_user_id_key" UNIQUE (challenge_id, user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_invites_invite_code_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_invite_code_key" UNIQUE (invite_code);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_invites_token_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_token_key" UNIQUE (token);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_user_id_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_group_id_user_id_key" UNIQUE (group_id, user_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'groups_slug_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_slug_key" UNIQUE (slug);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'groups_slug_unique' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_slug_unique" UNIQUE (slug);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sync_items_user_entity_id_unique' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."sync_items" ADD CONSTRAINT "sync_items_user_entity_id_unique" UNIQUE (user_id, entity, entity_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_inventory_user_id_item_id_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_inventory" ADD CONSTRAINT "user_inventory_user_id_item_id_key" UNIQUE (user_id, item_id);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE (user_id, role);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_tours_user_id_tour_key_key' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."user_tours" ADD CONSTRAINT "user_tours_user_id_tour_key_key" UNIQUE (user_id, tour_key);
  END IF;
END $iso_c$;
DO $iso_c$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'backup_manifests_path_user_prefix' AND connamespace = 'public'::regnamespace) THEN
    ALTER TABLE ONLY "public"."backup_manifests" ADD CONSTRAINT "backup_manifests_path_user_prefix" CHECK ((split_part(path, '/'::text, 1) = (user_id)::text));
  END IF;
END $iso_c$;
CREATE UNIQUE INDEX IF NOT EXISTS backup_manifests_bucket_path_idx ON public.backup_manifests USING btree (bucket, path);
CREATE INDEX IF NOT EXISTS backup_manifests_user_score_idx ON public.backup_manifests USING btree (user_id, selected_as_best DESC, score DESC, updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS groups_slug_active_unique ON public.groups USING btree (slug) WHERE ((deleted_at IS NULL) AND (slug IS NOT NULL));
CREATE INDEX IF NOT EXISTS idx_ce_active_time ON public.community_events USING btree (is_active, start_time);
CREATE INDEX IF NOT EXISTS idx_ce_featured ON public.community_events USING btree (is_featured) WHERE (is_featured = true);
CREATE INDEX IF NOT EXISTS idx_cea_event ON public.community_event_attendees USING btree (event_id);
CREATE INDEX IF NOT EXISTS idx_cea_user ON public.community_event_attendees USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_g_v8 ON public.group_challenges USING btree (group_id, is_active) WHERE (is_active = true);
CREATE INDEX IF NOT EXISTS idx_community_events_creator_id ON public.community_events USING btree (creator_id);
CREATE INDEX IF NOT EXISTS idx_community_events_host_user_id ON public.community_events USING btree (host_user_id);
CREATE INDEX IF NOT EXISTS idx_daily_user_date ON public.daily_user_stats USING btree (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_user_date_minutes ON public.daily_user_stats USING btree (user_id, date DESC) INCLUDE (seconds_studied);
CREATE INDEX IF NOT EXISTS idx_events_active_v8 ON public.community_events USING btree (is_active, start_time) WHERE (is_active = true);
CREATE INDEX IF NOT EXISTS idx_gann_author ON public.group_announcements USING btree (author_id);
CREATE INDEX IF NOT EXISTS idx_gann_group ON public.group_announcements USING btree (group_id);
CREATE INDEX IF NOT EXISTS idx_gann_pinned ON public.group_announcements USING btree (group_id, pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gchall_created_by ON public.group_challenges USING btree (created_by);
CREATE INDEX IF NOT EXISTS idx_gchall_group ON public.group_challenges USING btree (group_id);
CREATE INDEX IF NOT EXISTS idx_gchat_author_id ON public.group_chat_messages USING btree (author_id);
CREATE INDEX IF NOT EXISTS idx_gchat_group_time ON public.group_chat_messages USING btree (group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gchat_user ON public.group_chat_messages USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_gcpart_challenge ON public.group_challenge_participants USING btree (challenge_id);
CREATE INDEX IF NOT EXISTS idx_gcpart_user ON public.group_challenge_participants USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_ginv_created_by ON public.group_invites USING btree (created_by);
CREATE INDEX IF NOT EXISTS idx_ginv_group ON public.group_invites USING btree (group_id);
CREATE INDEX IF NOT EXISTS idx_ginv_token ON public.group_invites USING btree (token);
CREATE INDEX IF NOT EXISTS idx_gm_group ON public.group_members USING btree (group_id);
CREATE INDEX IF NOT EXISTS idx_gm_user ON public.group_members USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_gm_user_group_covering ON public.group_members USING btree (user_id, group_id);
CREATE INDEX IF NOT EXISTS idx_gmile_group ON public.group_milestones USING btree (group_id);
CREATE INDEX IF NOT EXISTS idx_groups_active ON public.groups USING btree (is_active) WHERE (is_active = true);
CREATE INDEX IF NOT EXISTS idx_groups_category ON public.groups USING btree (category) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_groups_created ON public.groups USING btree (created_at DESC) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_groups_del ON public.groups USING btree (deleted_at) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_groups_fts ON public.groups USING gin (fts);
CREATE INDEX IF NOT EXISTS idx_groups_is_public ON public.groups USING btree (is_public) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_groups_owner ON public.groups USING btree (owner_id);
CREATE INDEX IF NOT EXISTS idx_groups_public ON public.groups USING btree (is_public) WHERE (is_public = true);
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups USING btree (slug) WHERE (slug IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS idx_groups_slug_unique ON public.groups USING btree (slug) WHERE (slug IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_notif_unread ON public.notifications USING btree (user_id, read_at) WHERE (read_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_notif_user_time ON public.notifications USING btree (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_points_lifetime ON public.user_points USING btree (lifetime_points DESC);
CREATE INDEX IF NOT EXISTS idx_points_points ON public.user_points USING btree (points DESC);
CREATE INDEX IF NOT EXISTS idx_points_user_id ON public.user_points USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON public.user_presence USING btree (last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_presence_s_v8 ON public.user_presence USING btree (status, last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_presence_status ON public.user_presence USING btree (status);
CREATE INDEX IF NOT EXISTS idx_presence_updated_at ON public.user_presence USING btree (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.user_profiles USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.study_sessions_log USING btree (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_u_v8 ON public.study_sessions_log USING btree (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.study_sessions_log USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON public.study_sessions_log USING btree (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_stats_total_hours ON public.user_stats_summary USING btree (total_hours DESC);
CREATE INDEX IF NOT EXISTS idx_stats_user_id ON public.user_stats_summary USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_stats_weekly_hours ON public.user_stats_summary USING btree (weekly_hours DESC);
CREATE INDEX IF NOT EXISTS idx_store_act_v8 ON public.store_items USING btree (active, category);
CREATE INDEX IF NOT EXISTS idx_uroles_granted_by ON public.user_roles USING btree (granted_by);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_completed ON public.user_onboarding USING btree (completed);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles USING btree (role);
CREATE INDEX IF NOT EXISTS idx_users_plan_type ON public.users USING btree (plan_type);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users USING btree (username);
CREATE INDEX IF NOT EXISTS sync_items_status_idx ON public.sync_items USING btree (user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_community_friends_pair ON public.community_friends USING btree (LEAST(user_id, friend_id), GREATEST(user_id, friend_id));
CREATE UNIQUE INDEX IF NOT EXISTS ux_profiles_handle ON public.user_profiles USING btree (lower(handle)) WHERE (handle IS NOT NULL);
CREATE OR REPLACE FUNCTION "private"."can_manage_group"(p_group_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


  select
    exists (
      select 1
      from public.groups g
      where g.id = p_group_id
        and g.owner_id = p_user_id
    )
    or exists (
      select 1
      from public.group_members gm
      where gm.group_id = p_group_id
        and gm.user_id = p_user_id
        and gm.role in ('owner', 'admin', 'moderator')
    );
$iso_fn$;
CREATE OR REPLACE FUNCTION "private"."is_group_member"(p_group_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = p_group_id
      and gm.user_id = p_user_id
  );
$iso_fn$;
CREATE OR REPLACE FUNCTION "rpc_private"."accept_invite"(p_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


declare
  v_invite public.group_invites%rowtype;
  v_group_slug text;
  v_uid uuid := (select auth.uid());
  v_inserted boolean := false;
begin
  if v_uid is null then
    return jsonb_build_object('success', false, 'error', 'Not authenticated');
  end if;

  select gi.*
  into v_invite
  from public.group_invites gi
  where gi.token = p_code or gi.invite_code = p_code
  order by gi.created_at desc nulls last
  limit 1
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Invite not found');
  end if;
  if v_invite.expires_at is not null and v_invite.expires_at <= now() then
    return jsonb_build_object('success', false, 'error', 'Invite has expired');
  end if;
  if v_invite.max_uses is not null
     and coalesce(v_invite.uses_count, 0) >= v_invite.max_uses then
    return jsonb_build_object('success', false, 'error', 'Invite has reached maximum uses');
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (v_invite.group_id, v_uid, 'member')
  on conflict (group_id, user_id) do nothing;
  v_inserted := found;

  if v_inserted then
    update public.group_invites
    set uses_count = coalesce(uses_count, 0) + 1,
        invite_code = coalesce(invite_code, token),
        token = coalesce(token, invite_code)
    where id = v_invite.id;
  end if;

  select g.slug
  into v_group_slug
  from public.groups g
  where g.id = v_invite.group_id;

  return jsonb_build_object(
    'success', true,
    'ok', true,
    'group_id', v_invite.group_id,
    'group_slug', coalesce(v_group_slug, v_invite.group_id::text),
    'slug', coalesce(v_group_slug, v_invite.group_id::text),
    'already_member', not v_inserted
  );
end;
$iso_fn$;
CREATE OR REPLACE FUNCTION "rpc_private"."get_invite_details"(p_code text)
 RETURNS TABLE(group_id uuid, group_slug text, group_name text, description text, member_count bigint, is_valid boolean)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


  select
    g.id,
    g.slug,
    g.name,
    g.description,
    count(gm.user_id),
    (
      (gi.expires_at is null or gi.expires_at > now())
      and (gi.max_uses is null or coalesce(gi.uses_count, 0) < gi.max_uses)
    )
  from public.group_invites gi
  join public.groups g on g.id = gi.group_id
  left join public.group_members gm on gm.group_id = g.id
  where (gi.token = p_code or gi.invite_code = p_code)
    and (g.is_active = true or g.is_active is null)
    and g.deleted_at is null
  group by g.id, g.slug, g.name, g.description,
           gi.expires_at, gi.max_uses, gi.uses_count;
$iso_fn$;
CREATE OR REPLACE FUNCTION "rpc_private"."join_community_event"(p_event_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


declare
  v_uid uuid := (select auth.uid());
  v_evt public.community_events%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'Not authenticated');
  end if;

  select *
  into v_evt
  from public.community_events
  where id = p_event_id
    and is_active = true;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Event not found or inactive');
  end if;

  insert into public.community_event_attendees (event_id, user_id)
  values (p_event_id, v_uid)
  on conflict (event_id, user_id) do nothing;

  update public.community_events
  set attendee_count = (
    select count(*)
    from public.community_event_attendees
    where event_id = p_event_id
  )
  where id = p_event_id;

  return jsonb_build_object('ok', true);
end;
$iso_fn$;
CREATE OR REPLACE FUNCTION "rpc_private"."leave_community_event"(p_event_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'Not authenticated');
  end if;

  delete from public.community_event_attendees
  where event_id = p_event_id
    and user_id = v_uid;

  update public.community_events
  set attendee_count = (
    select count(*)
    from public.community_event_attendees
    where event_id = p_event_id
  )
  where id = p_event_id;

  return jsonb_build_object('ok', true);
end;
$iso_fn$;
CREATE OR REPLACE FUNCTION "rpc_private"."purchase_store_item"(p_user_id uuid, p_item_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


declare
  v_item public.store_items%rowtype;
  v_points integer;
begin
  if p_user_id is null
     or (
       (select auth.role()) <> 'service_role'
       and (
         (select auth.uid()) is null
         or p_user_id is distinct from (select auth.uid())
       )
     ) then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;

  select *
  into v_item
  from public.store_items
  where id = p_item_id
    and active = true
    and price >= 0
  for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'item_not_found');
  end if;

  if exists (
    select 1
    from public.user_inventory
    where user_id = p_user_id
      and item_id = p_item_id
  ) then
    return jsonb_build_object('ok', false, 'error', 'already_owned');
  end if;

  update public.user_points
  set points = points - v_item.price
  where user_id = p_user_id
    and points >= v_item.price
  returning points into v_points;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'insufficient_coins');
  end if;

  insert into public.user_inventory (user_id, item_id, equipped, purchased_at)
  values (p_user_id, p_item_id, false, now());

  return jsonb_build_object('ok', true, 'coins_remaining', v_points);
end;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_auto_add_group_owner"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


     BEGIN
       INSERT INTO public.group_members(group_id, user_id, role, joined_at)
       VALUES (NEW.id, NEW.owner_id, 'owner', now())
       ON CONFLICT (group_id, user_id) DO NOTHING;
       RETURN NEW;
     END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_auto_add_super_admin"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


  BEGIN
    -- Only if the admin user exists and isn't already a member
    IF EXISTS (SELECT 1 FROM public.users WHERE id = '223465cf-a1fd-454c-8346-0fb04357faf0') THEN
      INSERT INTO public.group_members (group_id, user_id, role, is_super_admin, joined_at)
      VALUES (NEW.id, '223465cf-a1fd-454c-8346-0fb04357faf0', 'admin', true, now())
      ON CONFLICT (group_id, user_id) DO UPDATE SET role = 'admin', is_super_admin = true;
    END IF;
    RETURN NEW;
  END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_ensure_community_enrollment"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

BEGIN
  INSERT INTO public.community_enrollments (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_ensure_onboarding_complete"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$
 BEGIN INSERT INTO public.user_onboarding (user_id, completed, completed_at, data) VALUES (NEW.id, true, now(), '{}'::jsonb) ON CONFLICT (user_id) DO NOTHING; RETURN NEW; END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_ensure_stats_summary"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

BEGIN
  INSERT INTO public.user_stats_summary (user_id, total_hours, weekly_hours, monthly_hours, total_sessions, current_streak)
  VALUES (NEW.id, 0, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_ensure_user_points"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

BEGIN
  INSERT INTO public.user_points (user_id, points, lifetime_points)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_ensure_user_profile"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

BEGIN
  INSERT INTO public.user_profiles (user_id, profile_data)
  VALUES (NEW.id, '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_has_group_role"(gid uuid, uid uuid, allowed_roles text[])
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


  SELECT EXISTS (
    SELECT 1
    FROM public.group_members gm
    WHERE gm.group_id = gid
      AND gm.user_id = uid
      AND gm.role = ANY(allowed_roles)
  );
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_is_group_member"(gid uuid, uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE group_id = gid AND user_id = uid);
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."_sync_group_member_count"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET member_count = member_count + 1, updated_at = now()
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET member_count = GREATEST(0, member_count - 1), updated_at = now()
    WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."accept_invite"(p_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_invite public.group_invites%ROWTYPE;
  v_uid    uuid := auth.uid();
  v_slug   text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT * INTO v_invite
  FROM public.group_invites
  WHERE token = p_code OR invite_code = p_code
  LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite not found');
  END IF;
  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has expired');
  END IF;
  IF v_invite.max_uses IS NOT NULL AND v_invite.uses_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has reached maximum uses');
  END IF;
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_invite.group_id, v_uid, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;
  UPDATE public.group_invites
  SET
    uses_count  = uses_count + 1,
    invite_code = COALESCE(invite_code, token),
    token       = COALESCE(token, invite_code)
  WHERE id = v_invite.id;
  SELECT g.slug INTO v_slug FROM public.groups g WHERE g.id = v_invite.group_id;
  RETURN jsonb_build_object('success', true, 'group_id', v_invite.group_id, 'group_slug', v_slug);
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."check_user_role"(p_user_id uuid, p_role text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id AND role = p_role);
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."cleanup_old_notifications"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


BEGIN
  DELETE FROM public.notifications
  WHERE user_id=NEW.user_id AND created_at < now() - interval '90 days';
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_bootstrap_profile"(p_display_name text, p_handle text DEFAULT NULL::text, p_day_offset_hours integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid    uuid := auth.uid();
  v_handle text;
  v_taken  uuid;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Normalise once, here, so the column, the JSONB key and the unique index all
  -- agree. ux_profiles_handle is on lower(handle); storing mixed case would let
  -- two users differ only by case and collide on insert instead of on validation.
  v_handle := nullif(btrim(coalesce(p_handle, '')), '');
  IF v_handle IS NOT NULL THEN
    v_handle := lower(regexp_replace(v_handle, '[^A-Za-z0-9_]+', '_', 'g'));
    v_handle := nullif(btrim(v_handle, '_'), '');
  END IF;

  -- A handle is how other people find you, so a clash has to be reported rather
  -- than silently applied and then rejected by the index.
  IF v_handle IS NOT NULL THEN
    SELECT user_id INTO v_taken
      FROM public.user_profiles
     WHERE lower(handle) = v_handle
       AND user_id <> v_uid
     LIMIT 1;
    IF v_taken IS NOT NULL THEN
      RETURN jsonb_build_object(
        'success', false,
        -- Readable for the UI, machine-readable for anything that wants to branch.
        'error', format('The handle @%s is already taken. Pick another.', v_handle),
        'code',  'handle_taken',
        'handle', v_handle);
    END IF;
  END IF;

  -- Ensure a row exists. Enrolment used to depend on user_profiles already
  -- having been created by the signup trigger; when it had not, the UPDATE
  -- matched zero rows and reported success having written nothing.
  INSERT INTO public.user_profiles (user_id, profile_data, created_at, updated_at)
  VALUES (v_uid, '{}'::jsonb, now(), now())
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.user_profiles
     SET handle       = COALESCE(v_handle, handle),
         display_name = COALESCE(nullif(btrim(p_display_name), ''), display_name),
         profile_data = jsonb_set(
                          jsonb_set(
                            jsonb_set(
                              jsonb_set(
                                COALESCE(profile_data, '{}'::jsonb),
                                '{community_enrolled}', 'true'::jsonb, true),
                              '{community_handle}', to_jsonb(COALESCE(v_handle, handle)), true),
                            '{community_display_name}', to_jsonb(p_display_name), true),
                          '{community_day_offset_hours}', to_jsonb(p_day_offset_hours), true),
         updated_at   = now()
   WHERE user_id = v_uid;

  -- Enrolment row carries privacy + day offset; the overview reads it.
  INSERT INTO public.community_enrollments (user_id, enrolled, day_offset_hours, created_at, updated_at)
  VALUES (v_uid, true, COALESCE(p_day_offset_hours, 0), now(), now())
  ON CONFLICT (user_id) DO UPDATE
     SET enrolled         = true,
         day_offset_hours = COALESCE(EXCLUDED.day_offset_hours, public.community_enrollments.day_offset_hours),
         onboarded        = true,
         updated_at       = now();

  RETURN jsonb_build_object(
    'success', true,
    'handle',  (SELECT handle FROM public.user_profiles WHERE user_id = v_uid)
  );
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_create_group"(p_name text, p_description text DEFAULT NULL::text, p_exam text DEFAULT NULL::text, p_target_year integer DEFAULT NULL::integer, p_subjects text[] DEFAULT '{}'::text[], p_visibility text DEFAULT 'public'::text, p_join_policy text DEFAULT 'open'::text, p_timezone_offset_minutes integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_group_id uuid;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  INSERT INTO public.groups (name, description, exam, target_year, subjects, visibility, join_policy, owner_id)
  VALUES (p_name, p_description, p_exam, p_target_year, p_subjects, p_visibility, p_join_policy, v_uid)
  RETURNING id INTO v_group_id;
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_group_id, v_uid, 'owner');
  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object(
    'id', v_group_id,
    'slug', lower(regexp_replace(p_name, '[^a-z0-9]+', '-', 'g')),
    'name', p_name,
    'description', p_description,
    'exam', p_exam,
    'targetYear', p_target_year,
    'subjects', p_subjects,
    'visibility', p_visibility,
    'joinPolicy', p_join_policy,
    'memberCount', 1,
    'activeNow', 0,
    'visualKey', 0,
    'role', 'owner'
  ));
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_create_invite"(p_type text, p_target_id uuid DEFAULT NULL::uuid, p_days integer DEFAULT 7)
 RETURNS text
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  code text;
  group_exists boolean;
  is_owner boolean;
  user_exists boolean;
begin
  if p_target_id is null then
    raise exception 'A valid invite target is required.';
  end if;

  if p_type = 'buddy' then
    if p_target_id <> auth.uid() then
      raise exception 'Buddy invite links can only be created for your own account.';
    end if;
    select exists(select 1 from public.user_profiles where user_id = auth.uid())
      into user_exists;
    if not user_exists then
      raise exception 'Finish setting up your profile first, then try again.';
    end if;
    select substr(md5(random()::text || clock_timestamp()::text), 1, 8) into code;
    insert into public.buddy_invites (inviter_id, token, max_uses, expires_at, created_at)
    values (auth.uid(), code, 1, now() + (coalesce(p_days, 7) * interval '1 day'), now());
    return code;
  end if;

  select exists(select 1 from public.groups where id = p_target_id and deleted_at is null) into group_exists;
  if not group_exists then
    raise exception 'This group no longer exists. Refresh and try again.';
  end if;
  select exists(select 1 from public.group_members where group_id = p_target_id and user_id = auth.uid() and role in ('owner','admin'))
     or exists(select 1 from public.groups where id = p_target_id and owner_id = auth.uid())
  into is_owner;
  if not is_owner then
    raise exception 'Only group owners or admins can create invite links.';
  end if;
  select substr(md5(random()::text || clock_timestamp()::text), 1, 8) into code;
  insert into public.group_invites (group_id, token, created_by, max_uses, expires_at, created_at)
  values (p_target_id, code, auth.uid(), 1, now() + (coalesce(p_days, 7) * interval '1 day'), now());
  return code;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_delete_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role != 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only owner can delete');
  END IF;
  UPDATE public.groups SET deleted_at = now() WHERE id = p_group_id;
  RETURN jsonb_build_object('success', true);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_discover_groups"(p_query text DEFAULT ''::text, p_exam text DEFAULT NULL::text, p_target_year integer DEFAULT NULL::integer, p_subject text DEFAULT NULL::text, p_has_space boolean DEFAULT NULL::boolean, p_join_policy text DEFAULT NULL::text, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

  WITH page AS (
    SELECT
      g.id,
      g.name,
      -- Prefer the stored slug; derive one only when it is absent.
      COALESCE(
        NULLIF(g.slug, ''),
        trim(both '-' from regexp_replace(lower(g.name), '[^a-z0-9]+', '-', 'g'))
      )                                              AS slug,
      g.description,
      g.exam,
      g.target_year,
      COALESCE(g.subjects, ARRAY[]::text[])          AS subjects,
      COALESCE(g.join_policy, 'request')             AS join_policy,
      g.visibility,
      COALESCE(g.visual_key, 0)                      AS visual_key,
      COALESCE(g.max_members, 30)                    AS max_members,
      -- member_count is maintained by trg_sync_member_count; recount only if
      -- it is NULL so this stays O(1) per row in the normal case.
      COALESCE(
        g.member_count,
        (SELECT count(*) FROM public.group_members gm WHERE gm.group_id = g.id)
      )::int                                         AS member_count,
      -- activeNow: members seen in the last 5 minutes. Was hardcoded 0.
      (
        SELECT count(*)
        FROM public.group_members gm2
        JOIN public.user_presence up ON up.user_id = gm2.user_id
        WHERE gm2.group_id = g.id
          AND COALESCE(up.last_beat_at, up.last_seen) > now() - interval '5 minutes'
          AND COALESCE(up.state, up.status, '') NOT IN ('offline', 'idle')
      )::int                                         AS active_now,
      g.created_at
    FROM public.groups g
    WHERE g.deleted_at IS NULL
      AND COALESCE(g.is_active, true) IS TRUE
      -- Private groups must not surface in Discover.
      AND COALESCE(g.visibility, 'public') <> 'private'
      AND (
        p_query IS NULL OR p_query = ''
        OR g.name ILIKE '%' || p_query || '%'
        OR COALESCE(g.description, '') ILIKE '%' || p_query || '%'
      )
      AND (p_exam IS NULL OR g.exam = p_exam)
      AND (p_target_year IS NULL OR g.target_year = p_target_year)
      AND (p_subject IS NULL OR p_subject = ANY(COALESCE(g.subjects, ARRAY[]::text[])))
      AND (p_join_policy IS NULL OR COALESCE(g.join_policy, 'request') = p_join_policy)
      AND (
        p_has_space IS NOT TRUE
        OR COALESCE(
             g.member_count,
             (SELECT count(*) FROM public.group_members gm3 WHERE gm3.group_id = g.id)
           ) < COALESCE(g.max_members, 30)
      )
    -- LIMIT/OFFSET belong here, on ROWS, not on the aggregate below.
    ORDER BY g.last_activity DESC NULLS LAST, g.created_at DESC
    LIMIT  LEAST(GREATEST(COALESCE(p_limit, 20), 1), 50)
    OFFSET GREATEST(COALESCE(p_offset, 0), 0)
  )
  SELECT jsonb_build_object(
    'success', true,
    'data', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id',          page.id,
            'name',        page.name,
            'slug',        page.slug,
            'description', page.description,
            'exam',        page.exam,
            'targetYear',  page.target_year,
            'subjects',    to_jsonb(page.subjects),
            'joinPolicy',  page.join_policy,
            'visibility',  page.visibility,
            'visualKey',   page.visual_key,
            'memberCount', page.member_count,
            'maxMembers',  page.max_members,
            'activeNow',   page.active_now
          )
          ORDER BY page.created_at DESC
        )
        FROM page
      ),
      '[]'::jsonb
    )
  );
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_group"(p_group_id uuid, p_period text DEFAULT 'week'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_group RECORD;
BEGIN
  SELECT * INTO v_group FROM public.groups WHERE id = p_group_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group not found');
  END IF;
  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'id', v_group.id,
      'slug', lower(regexp_replace(v_group.name, '[^a-z0-9]+', '-', 'g')),
      'name', v_group.name,
      'description', v_group.description,
      'exam', v_group.exam,
      'targetYear', v_group.target_year,
      'subjects', v_group.subjects,
      'visibility', v_group.visibility,
      'joinPolicy', v_group.join_policy,
      'memberCount', (SELECT COUNT(*) FROM public.group_members WHERE group_id = v_group.id),
      'activeNow', 0,
      'visualKey', v_group.visual_key,
      'role', (SELECT role FROM public.group_members WHERE group_id = v_group.id AND user_id = auth.uid()),
      'members', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', gm.user_id,
          'name', COALESCE(u.username, u.name, 'Unknown'),
          'avatar', u.avatar_url,
          'role', gm.role,
          'minutes', COALESCE(us.total_study_seconds / 60, 0),
          'status', 'idle'
        ))
        FROM public.group_members gm
        LEFT JOIN public.users u ON u.id = gm.user_id
        LEFT JOIN public.user_stats_summary us ON us.user_id = gm.user_id
        WHERE gm.group_id = v_group.id
      ), '[]'::jsonb)
    )
  );
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_group_messages"(p_group_id text, p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  uid uuid := auth.uid();
  gid uuid;
begin
  if uid is null then return null; end if;

  begin
    gid := p_group_id::uuid;
  exception when others then
    select g.id into gid from public.groups g
     where g.slug = p_group_id and g.deleted_at is null;
  end;

  if gid is null then return null; end if;

  if not exists (
    select 1 from public.group_members a
     where a.group_id = gid and a.user_id = uid and a.left_at is null
  ) then
    return null;
  end if;

  return jsonb_build_object(
    'messages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'groupId', m.group_id,
        'authorId', m.user_id,
        'authorName', coalesce(pf.display_name, pf.handle, pf.profile_data->>'name', ''),
        'authorHandle', pf.handle,
        'authorAvatar', coalesce(pf.profile_data->>'avatar', pf.profile_data->>'avatarUrl', ''),
        'content', m.content,
        'messageType', m.message_type,
        'replyToId', m.reply_to_id,
        'pinned', m.pinned,
        'createdAt', m.created_at
      ) order by m.created_at asc)
      from (
        select * from public.group_chat_messages
         where group_id = gid and deleted_at is null
         order by created_at desc
         limit p_limit
      ) m
      left join public.user_profiles pf on pf.user_id = m.user_id
    ), '[]'::jsonb)
  );
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_overview"()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  uid      uuid := auth.uid();
  v_offset integer := 0;
  v_day    date;
  result   jsonb;
begin
  -- The day boundary is the USER'S, not UTC. A student studying at 01:00 local
  -- has not started a new day yet, and showing their buddies' minutes as 0
  -- because UTC rolled over is wrong in the way that makes people distrust the
  -- number.
  select coalesce(day_offset_hours, 0) into v_offset
    from public.community_enrollments where user_id = uid;
  v_day := (now() + make_interval(hours => coalesce(v_offset, 0)))::date;

  with conn as (
    -- Direction matters: community_respond_buddy only accepts a request that was
    -- sent TO you, so an outgoing request rendered with an Accept button is a
    -- button that always fails.
    select f.id  as connection_id,
           case when f.user_id = uid then f.friend_id else f.user_id end as buddy_id,
           f.status,
           (f.user_id = uid) as outgoing
      from public.community_friends f
     where (f.user_id = uid or f.friend_id = uid)
       and coalesce(f.status, 'pending') <> 'blocked'
  ),
  priv as (
    select c.buddy_id,
           coalesce((e.privacy->>'stealthMode')::boolean,
                    (e.privacy->>'stealth_mode')::boolean, false)            as stealth,
           coalesce((e.privacy->>'shareLiveStatus')::boolean,
                    (e.privacy->>'share_live_status')::boolean, true)        as share_live,
           coalesce((e.privacy->>'shareCurrentSubject')::boolean,
                    (e.privacy->>'share_current_subject')::boolean, true)    as share_subject,
           coalesce((e.privacy->>'shareTasks')::boolean,
                    (e.privacy->>'share_tasks')::boolean, true)              as share_tasks,
           coalesce((e.privacy->>'shareExactTime')::boolean,
                    (e.privacy->>'share_exact_time')::boolean, true)         as share_time,
           coalesce((e.privacy->>'shareSubjectBreakdown')::boolean,
                    (e.privacy->>'share_subject_breakdown')::boolean, true)  as share_breakdown,
           coalesce((e.privacy->>'shareQuestionCounts')::boolean,
                    (e.privacy->>'share_question_counts')::boolean, true)    as share_questions,
           -- community_get_privacy exposes shareCurrentTask and the UI renders
           -- presence.task, so it needs its own gate. Without it the task title
           -- would ride along under shareCurrentSubject, and a user who shared a
           -- subject but not a task would leak the task.
           coalesce((e.privacy->>'shareCurrentTask')::boolean,
                    (e.privacy->>'share_current_task')::boolean, true)       as share_task
      from conn c
      left join public.community_enrollments e on e.user_id = c.buddy_id
  ),
  mins as (
    select c.buddy_id,
           coalesce(sum(s.duration_minutes), 0)::int as minutes_today
      from conn c
      left join public.study_sessions_log s
             on s.user_id = c.buddy_id
            and s.deleted_at is null
            and (s.ended_at + make_interval(hours => coalesce(v_offset, 0)))::date = v_day
     group by c.buddy_id
  ),
  subj as (
    select c.buddy_id,
           jsonb_agg(jsonb_build_object(
             'name',      x.subject,
             'minutes',   x.minutes,
             -- Question counts live on the session rows only when the user logs
             -- them; absent is 0, which the UI sums without special-casing.
             'questions', 0
           ) order by x.minutes desc) as subjects
      from conn c
      join lateral (
        select coalesce(nullif(btrim(s.subject), ''), 'General') as subject,
               coalesce(sum(s.duration_minutes), 0)::int         as minutes
          from public.study_sessions_log s
         where s.user_id = c.buddy_id
           and s.deleted_at is null
           and (s.ended_at + make_interval(hours => coalesce(v_offset, 0)))::date = v_day
         group by 1
         order by 2 desc
         limit 8
      ) x on true
     group by c.buddy_id
  ),
  tsk as (
    select c.buddy_id,
           jsonb_agg(jsonb_build_object(
             'id',      x.id,
             'title',   x.title,
             'subject', x.subject,
             'done',    x.done
           ) order by x.done, x.title) as tasks
      from conn c
      join lateral (
        select t.id,
               t.title,
               coalesce(nullif(btrim(t.subject), ''), 'General') as subject,
               (t.status = 'completed' or t.completed_at is not null) as done
          from public.tasks t
         where t.user_id = c.buddy_id
           and t.deleted_at is null
           and (
             (t.due_date is not null
               and (t.due_date + make_interval(hours => coalesce(v_offset, 0)))::date = v_day)
             or (t.completed_at is not null
               and (t.completed_at + make_interval(hours => coalesce(v_offset, 0)))::date = v_day)
           )
         order by 4, 2
         limit 12
      ) x on true
     group by c.buddy_id
  )
  select jsonb_build_object(
    'stats', jsonb_build_object(
      'totalGroups',  (select count(*) from public.groups where deleted_at is null),
      'totalMembers', (select count(distinct user_id) from public.group_members),
      'totalMessages', 0
    ),
    'groups', coalesce((select jsonb_agg(jsonb_build_object(
        'id',   g.id,
        'name', g.name,
        'slug', coalesce(nullif(g.slug, ''), lower(regexp_replace(g.name, '[^a-zA-Z0-9]+', '-', 'g'))),
        'memberCount', (select count(*) from public.group_members where group_id = g.id),
        -- Real figure, not the hardcoded 0 this returned before: members seen
        -- inside the last two minutes.
        'activeNow', (
          select count(*) from public.group_members gm
            join public.user_presence up on up.user_id = gm.user_id
           where gm.group_id = g.id
             and coalesce(up.is_online, up.status = 'studying') is true
             and coalesce(up.last_beat_at, up.last_seen) > now() - interval '2 minutes'
        ),
        'visualKey', g.visual_key,
        'exam', g.exam
      )) from public.groups g where g.deleted_at is null), '[]'::jsonb),

    'buddies', coalesce((select jsonb_agg(jsonb_build_object(
        'userId',        c.buddy_id,
        'connectionId',  c.connection_id,
        'requestStatus', case when c.status = 'accepted' then 'accepted' else 'pending' end,
        -- Outgoing pending requests must not render an Accept control.
        'outgoing',      c.outgoing,
        'name',          coalesce(nullif(btrim(pr.display_name), ''),
                                  nullif(btrim(u.name), ''),
                                  nullif(btrim(pr.handle), ''),
                                  'Study buddy'),
        'handle',        pr.handle,
        'avatarUrl',     u.avatar_url,
        -- Live status is emitted in BOTH shapes, deliberately.
        --
        -- The compiled bundle reads them inconsistently and both spellings are
        -- live in the same file:
        --
        --   nested   s.presence.state / .subject / .task   — 22 sites, incl. the
        --            buddy-card mapper and the "studying now" rail
        --   flat     n.currentSubject, n.status            — the member row it
        --            maps INTO, shared with group members
        --
        -- The first version of this RPC returned only the flat pair, so
        -- `s.presence` was undefined for EVERY buddy and every one of those 22
        -- sites threw `Cannot read properties of undefined (reading 'state')`
        -- inside render, unmounting the tree and blanking the page. Nothing had
        -- hit it only because community_request_buddy failed for everyone, so no
        -- accepted pair existed — the first person to accept a request would have
        -- crashed. Emitting both is the only shape that satisfies the bundle, and
        -- the bundle is baked into the APK so it cannot be the thing that changes.
        --
        -- `presence` is always an OBJECT, never null: a null would reintroduce the
        -- same crash by a different route, since the call sites dereference it
        -- without a guard.
        'presence', jsonb_build_object(
          'state',   case
                       when p.stealth or not p.share_live then 'idle'
                       when coalesce(up.last_beat_at, up.last_seen) > now() - interval '2 minutes'
                         then coalesce(nullif(up.state, ''), nullif(up.status, ''), 'idle')
                       else 'idle'
                     end,
          'subject', case
                       when p.stealth or not p.share_subject then null
                       when coalesce(up.last_beat_at, up.last_seen) > now() - interval '2 minutes'
                         then coalesce(nullif(up.subject_name, ''), nullif(up.current_subject, ''))
                       else null
                     end,
          'task',    case
                       when p.stealth or not p.share_task then null
                       when coalesce(up.last_beat_at, up.last_seen) > now() - interval '2 minutes'
                         then nullif(up.task_title, '')
                       else null
                     end
        ),
        -- Flat aliases of the same two values. Kept in sync by construction:
        -- change the CASE above and these follow, because they read the object.
        'status',        case
                           when p.stealth or not p.share_live then 'idle'
                           when coalesce(up.last_beat_at, up.last_seen) > now() - interval '2 minutes'
                             then coalesce(nullif(up.state, ''), nullif(up.status, ''), 'idle')
                           else 'idle'
                         end,
        'currentSubject', case
                            when p.stealth or not p.share_subject then null
                            when coalesce(up.last_beat_at, up.last_seen) > now() - interval '2 minutes'
                              then coalesce(nullif(up.subject_name, ''), nullif(up.current_subject, ''))
                            else null
                          end,
        'minutesToday',  case when p.share_time then coalesce(m.minutes_today, 0) else null end,
        -- `subjects` and `tasks` are NULL when withheld and [] when genuinely
        -- empty, because the UI distinguishes them:
        --     s.subjects === null  -> "Subject details are not shared."
        --     (s.subjects||[])     -> "No settled study time in this period."
        -- Returning [] for a withheld field would tell the reader their buddy did
        -- nothing today, which is a different and wrong statement.
        'subjects',      case when p.share_breakdown
                              then coalesce(
                                     case when p.share_questions then sb.subjects
                                          -- Withheld question counts must be NULL,
                                          -- not absent. The UI tests
                                          -- `r.questions !== null` and renders the
                                          -- value otherwise — a stripped key is
                                          -- `undefined`, which is !== null, so it
                                          -- printed the literal text
                                          -- "undefined questions". NULL renders
                                          -- as the intended em dash.
                                          else (select jsonb_agg(jsonb_set(e, '{questions}', 'null'::jsonb))
                                                  from jsonb_array_elements(sb.subjects) e)
                                     end, '[]'::jsonb)
                              else null end,
        'tasks',         case when p.share_tasks then coalesce(tk.tasks, '[]'::jsonb) else null end
      ))
      from conn c
      join priv p           on p.buddy_id = c.buddy_id
      left join public.user_profiles pr on pr.user_id = c.buddy_id
      left join public.users u          on u.id       = c.buddy_id
      left join public.user_presence up on up.user_id = c.buddy_id
      left join mins m      on m.buddy_id = c.buddy_id
      left join subj sb     on sb.buddy_id = c.buddy_id
      left join tsk  tk     on tk.buddy_id = c.buddy_id
    ), '[]'::jsonb),

    -- Incoming group join requests for groups the caller manages. The UI already
    -- reads overview.groupRequests and normalises a missing key to [], so this
    -- was silently empty for the same reason buddies was.
    'groupRequests', coalesce((select jsonb_agg(jsonb_build_object(
        'id',        r.id,
        'groupId',   r.group_id,
        'groupName', g.name,
        'userId',    r.user_id,
        'name',      coalesce(nullif(btrim(u2.name), ''), nullif(btrim(pr2.handle), ''), 'Student'),
        'handle',    pr2.handle,
        'avatarUrl', u2.avatar_url,
        'createdAt', r.created_at
      ))
      from public.community_join_requests r
      join public.groups g on g.id = r.group_id
      join public.group_members gm on gm.group_id = r.group_id
                                  and gm.user_id = uid
                                  and gm.role in ('owner', 'admin')
      left join public.users u2         on u2.id       = r.user_id
      left join public.user_profiles pr2 on pr2.user_id = r.user_id
     where coalesce(r.status, 'pending') = 'pending'), '[]'::jsonb)
  ) into result;

  return result;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_privacy"()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  priv jsonb;
begin
  select coalesce(privacy, '{}'::jsonb) into priv
  from public.community_enrollments where user_id = auth.uid();
  if priv = '{}'::jsonb then return null; end if;
  return jsonb_build_object(
    'scope', coalesce(nullif(priv->>'scope', ''), 'global'),
    'targetId', coalesce(priv->>'targetId', ''),
    'shareLiveStatus', coalesce((priv->>'shareLiveStatus')::boolean, (priv->>'share_live_status')::boolean, true),
    'shareCurrentSubject', coalesce((priv->>'shareCurrentSubject')::boolean, (priv->>'share_current_subject')::boolean, true),
    'shareCurrentTask', coalesce((priv->>'shareCurrentTask')::boolean, (priv->>'share_current_task')::boolean, true),
    'shareTasks', coalesce((priv->>'shareTasks')::boolean, (priv->>'share_tasks')::boolean, true),
    'shareExactTime', coalesce((priv->>'shareExactTime')::boolean, (priv->>'share_exact_time')::boolean, true),
    'shareSubjectBreakdown', coalesce((priv->>'shareSubjectBreakdown')::boolean, (priv->>'share_subject_breakdown')::boolean, true),
    'shareQuestionCounts', coalesce((priv->>'shareQuestionCounts')::boolean, (priv->>'share_question_counts')::boolean, true),
    'shareStreak', coalesce((priv->>'shareStreak')::boolean, (priv->>'share_streak')::boolean, true),
    'allowStartNotifications', coalesce((priv->>'allowStartNotifications')::boolean, (priv->>'allow_start_notifications')::boolean, false),
    'stealthMode', coalesce((priv->>'stealthMode')::boolean, (priv->>'stealth_mode')::boolean, false)
  );
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_start_alert"(p_target_type text, p_target_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  res jsonb;
begin
  select jsonb_build_object(
    'enabled', a.enabled,
    'quiet_hours_enabled', a.quiet_hours_enabled,
    'quiet_start', a.quiet_start,
    'quiet_end', a.quiet_end
  ) into res
  from public.community_start_alerts a
  where a.user_id = auth.uid() and a.target_type = p_target_type and a.target_id = p_target_id;
  return res;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_heartbeat"(p_state text, p_subject_id uuid DEFAULT NULL::uuid, p_subject_name text DEFAULT NULL::text, p_task_id uuid DEFAULT NULL::uuid, p_task_title text DEFAULT NULL::text, p_session_started_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;

  -- Update or insert presence record
  INSERT INTO public.user_presence (user_id, status, last_seen, subject_id, subject_name, task_id, task_title, session_started_at)
  VALUES (auth.uid(), p_state, now(), p_subject_id, p_subject_name, p_task_id, p_task_title, p_session_started_at)
  ON CONFLICT (user_id) DO UPDATE SET
    status = EXCLUDED.status,
    last_seen = EXCLUDED.last_seen,
    subject_id = EXCLUDED.subject_id,
    subject_name = EXCLUDED.subject_name,
    task_id = EXCLUDED.task_id,
    task_title = EXCLUDED.task_title,
    session_started_at = COALESCE(user_presence.session_started_at, EXCLUDED.session_started_at),
    updated_at = now();

  RETURN jsonb_build_object('ok', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('ok', false, 'error', SQLERRM);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_is_enrolled"()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
    AND (up.profile_data->>'community_enrolled')::boolean = true
  );
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_join_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_group RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT * INTO v_group FROM public.groups WHERE id = p_group_id AND (deleted_at IS NULL);
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group not found');
  END IF;
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (p_group_id, v_uid, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN jsonb_build_object('success', true, 'data', 'joined');
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_leave_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  DELETE FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  RETURN jsonb_build_object('success', true);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_preview_invite"(p_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  res jsonb;
begin
  -- Buddy invite. Requires definer rights: buddy_invites is RLS-enabled with no
  -- policies, so an invoker-rights read here returns nothing and the whole
  -- function falls through to report "invalid".
  select jsonb_build_object(
    'status', 'valid',
    'type', 'buddy',
    'inviterId', b.inviter_id,
    'name', coalesce(nullif(up.display_name, ''), 'Someone'),
    'handle', coalesce(up.handle, ''),
    'avatarUrl', null,
    'isFull', false
  ) into res
  from public.buddy_invites b
  left join public.user_profiles up on up.user_id = b.inviter_id
  where b.token = p_token
    and (b.expires_at is null or b.expires_at > now())
    and (b.max_uses is null or b.uses_count < b.max_uses)
  limit 1;
  if res is not null then
    return res;
  end if;

  -- Group invite.
  select jsonb_build_object(
    'status', 'valid',
    'type', 'group',
    'targetId', g.id,
    'name', g.name,
    'exam', coalesce(g.exam, ''),
    'targetYear', coalesce(g.target_year, 0),
    'subjects', coalesce(g.subjects, '{}'::text[]),
    'memberCount', (select count(*) from public.group_members a where a.group_id = g.id and a.left_at is null),
    'isFull', (select count(*) from public.group_members a where a.group_id = g.id and a.left_at is null) >= 30
  ) into res
  from public.group_invites inv
  join public.groups g on g.id = inv.group_id and g.deleted_at is null
  where inv.token = p_token
    and (inv.expires_at is null or inv.expires_at > now())
    and (inv.max_uses is null or inv.uses_count < inv.max_uses)
  limit 1;
  -- Tail kept byte-faithful to the live definition (verified by normalised
  -- diff) so this migration changes privileges ONLY, not behaviour.
  if res is null then
    return jsonb_build_object('status', 'invalid');
  end if;
  return res;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_redeem_invite"(p_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  inviter uuid;
  single_use boolean;
  blocked_exists boolean;
  gid uuid;
begin
  select b.inviter_id, (b.max_uses is not null)
    into inviter, single_use
  from public.buddy_invites b
  where b.token = p_token
    and (b.expires_at is null or b.expires_at > now())
    and (b.max_uses is null or b.uses_count < b.max_uses)
  limit 1;
  if inviter is not null then
    if inviter = auth.uid() then
      raise exception 'invite_invalid';
    end if;
    select exists(select 1 from public.community_friends
      where status = 'blocked'
        and ((user_id = inviter and friend_id = auth.uid())
          or (user_id = auth.uid() and friend_id = inviter)))
      into blocked_exists;
    if blocked_exists then
      raise exception 'invite_blocked';
    end if;
    delete from public.community_friends
     where (user_id = inviter and friend_id = auth.uid())
        or (user_id = auth.uid() and friend_id = inviter);
    insert into public.community_friends (user_id, friend_id, status, accepted_at, created_at, updated_at)
    values (inviter, auth.uid(), 'accepted', now(), now(), now());
    if single_use then
      update public.buddy_invites set uses_count = max_uses, created_at = now() where token = p_token;
    else
      update public.buddy_invites set uses_count = uses_count + 1 where token = p_token;
    end if;
    return jsonb_build_object('status', 'joined', 'type', 'buddy', 'group_id', null, 'groupId', null);
  end if;

  select inv.group_id, (inv.max_uses is not null) into gid, single_use
  from public.group_invites inv
  where inv.token = p_token
    and (inv.expires_at is null or inv.expires_at > now())
    and (inv.max_uses is null or inv.uses_count < inv.max_uses)
  limit 1;
  if gid is null then raise exception 'invite_invalid'; end if;

  insert into public.group_members (group_id, user_id, role, joined_at)
  values (gid, auth.uid(), 'member', now())
  on conflict (group_id, user_id) do update set left_at = null;

  if single_use then
    update public.group_invites set uses_count = max_uses, created_at = now()
     where token = p_token;
  else
    update public.group_invites set uses_count = uses_count + 1 where token = p_token;
  end if;
  return jsonb_build_object('status', 'joined', 'type', 'group', 'group_id', gid, 'groupId', gid);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_register_device_token"(p_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  insert into public.community_device_tokens (user_id, token, platform)
  values (auth.uid(), p_token, 'web')
  on conflict (user_id, token) do nothing;
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_remove_buddy"(p_other_user uuid, p_block boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  delete from public.community_friends
   where (user_id = auth.uid() and friend_id = p_other_user)
      or (user_id = p_other_user and friend_id = auth.uid());
  if p_block then
    insert into public.community_friends (user_id, friend_id, status)
    values (auth.uid(), p_other_user, 'blocked')
    on conflict do nothing;
  end if;
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_remove_group_member"(p_group_id uuid, p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role NOT IN ('owner', 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  DELETE FROM public.group_members WHERE group_id = p_group_id AND user_id = p_user_id;
  RETURN jsonb_build_object('success', true);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_request_buddy"(p_handle text)
 RETURNS uuid
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  uid    uuid := auth.uid();
  needle text;
  fid    uuid;
  cid    uuid;
  st     text;
begin
  -- Messages are written for a STUDENT, not a developer.
  --
  -- communityApi surfaces the Postgres error verbatim:
  --     const u = e => e instanceof Error ? e.message : "Something went wrong."
  --     catch (r) { return { success: false, error: u(r) } }
  -- so `raise exception 'user_not_found'` renders "user_not_found" in the UI. The
  -- bundle is compiled and baked into the APK, so the readable text has to come
  -- from here.
  if uid is null then
    raise exception 'Please sign in to add a study buddy.';
  end if;

  needle := lower(btrim(coalesce(p_handle, '')));
  needle := ltrim(needle, '@');           -- users type "@name"; the store holds "name"
  if needle = '' then
    raise exception 'Enter your buddy''s handle.';
  end if;

  -- Three lookups, in order of authority. The column is canonical; the JSONB key
  -- covers accounts enrolled before this migration; users.username covers
  -- accounts that never enrolled in Community but are still findable by name.
  select user_id into fid
    from public.user_profiles
   where lower(handle) = needle
     and deleted_at is null
   limit 1;

  if fid is null then
    select user_id into fid
      from public.user_profiles
     where lower(profile_data->>'community_handle') = needle
       and deleted_at is null
     limit 1;
  end if;

  if fid is null then
    select id into fid
      from public.users
     where lower(username) = needle
       and deleted_at is null
     limit 1;
  end if;

  if fid is null then
    raise exception 'No one is using the handle @%. Check the spelling and try again.', needle;
  end if;
  if fid = uid then
    raise exception 'That is your own handle.';
  end if;

  -- An existing connection decides what happens next. Previously any
  -- unique_violation was swallowed and the row re-selected, so re-requesting an
  -- existing buddy — or one who had blocked you — was indistinguishable from a
  -- fresh request.
  select id, status into cid, st
    from public.community_friends
   where (user_id = uid and friend_id = fid)
      or (user_id = fid and friend_id = uid)
   limit 1;

  if cid is not null then
    if st = 'blocked' then
      raise exception 'You cannot send a request to @%.', needle;
    end if;
    return cid;
  end if;

  insert into public.community_friends (user_id, friend_id, status, created_at, updated_at)
  values (uid, fid, 'pending', now(), now())
  on conflict do nothing
  returning id into cid;

  if cid is null then
    -- Lost a race with a concurrent request; the row exists either way.
    select id into cid
      from public.community_friends
     where (user_id = uid and friend_id = fid)
        or (user_id = fid and friend_id = uid)
     limit 1;
  end if;

  return cid;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_respond_buddy"(p_connection_id uuid, p_accept boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  update public.community_friends
     set status = case when p_accept then 'accepted' else 'rejected' end,
         accepted_at = case when p_accept then coalesce(accepted_at, now()) end,
         updated_at = now()
   where id = p_connection_id and (friend_id = auth.uid() or user_id = auth.uid())
     and status = 'pending';
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_respond_join_request"(p_request_id uuid, p_accept boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  gid uuid; uid uuid;
begin
  select jr.group_id, jr.user_id into gid, uid
    from public.community_join_requests jr where jr.id = p_request_id and jr.status = 'pending';
  if gid is null then raise exception 'request_not_found'; end if;
  if not exists (select 1 from public.group_members gm
                 where gm.group_id = gid and gm.user_id = auth.uid()
                   and gm.role in ('owner','coowner') and gm.left_at is null) then
    raise exception 'not_allowed';
  end if;
  update public.community_join_requests set status = case when p_accept then 'accepted' else 'rejected' end
   where id = p_request_id;
  if p_accept then
    insert into public.group_members (group_id, user_id, role, joined_at)
    values (gid, uid, 'member', now())
    on conflict (group_id, user_id) do update set left_at = null;
  end if;
  return jsonb_build_object('ok', true);
end;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_save_privacy"(p_settings jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  insert into public.community_enrollments (user_id, privacy, onboarded, updated_at)
  values (auth.uid(), coalesce(p_settings, '{}'::jsonb), true, now())
  on conflict (user_id) do update set
    privacy = excluded.privacy,
    onboarded = true,
    updated_at = now();
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_send_group_message"(p_group_id text, p_content text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  uid uuid := auth.uid();
  gid uuid;
  mid uuid;
begin
  if uid is null or nullif(trim(p_content), '') is null then
    return jsonb_build_object('ok', false);
  end if;

  begin
    gid := p_group_id::uuid;
  exception when others then
    select g.id into gid from public.groups g
     where g.slug = p_group_id and g.deleted_at is null;
  end;

  if gid is null then return jsonb_build_object('ok', false); end if;

  if not exists (
    select 1 from public.group_members a
     where a.group_id = gid and a.user_id = uid and a.left_at is null
  ) then
    return jsonb_build_object('ok', false);
  end if;

  insert into public.group_chat_messages (group_id, user_id, content, message_type)
  values (gid, uid, left(trim(p_content), 2000), 'text')
  returning id into mid;

  return jsonb_build_object('ok', true, 'messageId', mid);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_set_group_role"(p_group_id uuid, p_user_id uuid, p_role text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role != 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only owner can set roles');
  END IF;
  UPDATE public.group_members
  SET role = p_role
  WHERE group_id = p_group_id AND user_id = p_user_id;
  RETURN jsonb_build_object('success', true);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_set_start_alert"(p_target_type text, p_target_id uuid, p_enabled boolean DEFAULT true, p_quiet_hours_enabled boolean DEFAULT false, p_quiet_start time without time zone DEFAULT NULL::time without time zone, p_quiet_end time without time zone DEFAULT NULL::time without time zone, p_timezone_offset_minutes integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  insert into public.community_start_alerts
    (user_id, target_type, target_id, enabled, quiet_hours_enabled, quiet_start, quiet_end, updated_at)
  values (auth.uid(), p_target_type, p_target_id,
          coalesce(p_enabled, true), coalesce(p_quiet_hours_enabled, false),
          p_quiet_start, p_quiet_end, now())
  on conflict (user_id, target_type, target_id) do update set
    enabled = coalesce(p_enabled, community_start_alerts.enabled),
    quiet_hours_enabled = coalesce(p_quiet_hours_enabled, community_start_alerts.quiet_hours_enabled),
    quiet_start = coalesce(p_quiet_start, community_start_alerts.quiet_start),
    quiet_end = coalesce(p_quiet_end, community_start_alerts.quiet_end),
    updated_at = now();
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_submit_report"(p_target_type text, p_target_id uuid, p_reason text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  insert into public.community_reports (reporter_user_id, target_type, target_id, reason)
  values (auth.uid(), p_target_type, p_target_id, coalesce(p_reason, ''));
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_sync_quiet_hours"(p_enabled boolean DEFAULT false, p_start time without time zone DEFAULT NULL::time without time zone, p_end time without time zone DEFAULT NULL::time without time zone, p_timezone_offset_minutes integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  insert into public.community_enrollments (user_id, quiet_hours, onboarded, updated_at)
  values (auth.uid(), jsonb_build_object(
    'enabled', coalesce(p_enabled, false),
    'start', to_char(p_start, 'HH24:MI'),
    'end', to_char(p_end, 'HH24:MI'),
    'timezoneOffsetMinutes', coalesce(p_timezone_offset_minutes, 0)
  ), true, now())
  on conflict (user_id) do update set
    quiet_hours = excluded.quiet_hours,
    updated_at = now();
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_transfer_group"(p_group_id uuid, p_new_owner uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role != 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only owner can transfer');
  END IF;
  UPDATE public.group_members SET role = 'owner' WHERE group_id = p_group_id AND user_id = p_new_owner;
  UPDATE public.group_members SET role = 'admin' WHERE group_id = p_group_id AND user_id = v_uid;
  RETURN jsonb_build_object('success', true);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_update_group"(p_group_id uuid, p_changes jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role NOT IN ('owner', 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  UPDATE public.groups
  SET
    name = COALESCE(p_changes->>'name', name),
    description = COALESCE(p_changes->>'description', description),
    exam = COALESCE(p_changes->>'exam', exam),
    target_year = COALESCE((p_changes->>'targetYear')::int, target_year),
    subjects = COALESCE(p_changes->'subjects', subjects),
    visibility = COALESCE(p_changes->>'visibility', visibility),
    join_policy = COALESCE(p_changes->>'joinPolicy', join_policy),
    updated_at = now()
  WHERE id = p_group_id;
  RETURN jsonb_build_object('success', true);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."create_community_event"(p_title text, p_event_type text DEFAULT 'webinar'::text, p_description text DEFAULT NULL::text, p_host text DEFAULT NULL::text, p_start_time timestamp with time zone DEFAULT now(), p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_image_gradient text DEFAULT 'from-purple-600 to-blue-500'::text, p_image_url text DEFAULT NULL::text, p_tags text[] DEFAULT '{}'::text[], p_max_attendees integer DEFAULT NULL::integer, p_is_featured boolean DEFAULT false, p_is_active boolean DEFAULT true)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE v_id uuid;
BEGIN
  IF p_title IS NULL OR trim(p_title) = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'title is required');
  END IF;
  INSERT INTO public.community_events
    (title, event_type, description, host, start_time, end_time, image_gradient, image_url,
     tags, max_attendees, is_featured, is_active, attendee_count, updated_at)
  VALUES
    (trim(p_title), p_event_type, p_description, p_host, p_start_time, p_end_time,
     p_image_gradient, p_image_url, COALESCE(p_tags,'{}'), p_max_attendees,
     p_is_featured, p_is_active, 0, now())
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('ok', true, 'id', v_id);
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."delete_community_event"(p_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


BEGIN
  DELETE FROM public.community_events WHERE id = p_id;
  RETURN jsonb_build_object('ok', true, 'deleted', FOUND);
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."delete_community_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = v_uid AND role = 'owner'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only the group owner can delete this group');
  END IF;

  -- Cascade delete all group-owned data
  DELETE FROM public.group_challenge_participants
    WHERE challenge_id IN (SELECT id FROM public.group_challenges WHERE group_id = p_group_id);
  DELETE FROM public.group_challenges       WHERE group_id = p_group_id;
  DELETE FROM public.group_announcements    WHERE group_id = p_group_id;
  DELETE FROM public.group_milestones       WHERE group_id = p_group_id;
  DELETE FROM public.group_chat_messages    WHERE group_id = p_group_id;
  DELETE FROM public.group_invites          WHERE group_id = p_group_id;
  DELETE FROM public.group_members          WHERE group_id = p_group_id;
  DELETE FROM public.groups                 WHERE id       = p_group_id;

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."expire_stale_presence"()
 RETURNS void
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


BEGIN
  UPDATE public.user_presence SET status='offline'
  WHERE status != 'offline' AND last_seen < now() - interval '2 minutes';
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."finish_session_sync"(p_session_id uuid, p_action text DEFAULT 'complete'::text, p_duration_minutes integer DEFAULT 0, p_group_id uuid DEFAULT NULL::uuid, p_session_type text DEFAULT 'focus'::text, p_notes text DEFAULT NULL::text, p_ended_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_uid       uuid    := auth.uid();
  v_today     date    := CURRENT_DATE;
  v_secs      bigint;
  v_hrs       numeric;
  v_row_count bigint;
  v_was_found boolean;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;
  IF p_action = 'delete' THEN
    DELETE FROM public.study_sessions_log WHERE id = p_session_id AND user_id = v_uid;
    v_was_found := FOUND;
    RETURN jsonb_build_object(
      'already_absent',     NOT v_was_found,
      'affected_group_ids', CASE WHEN p_group_id IS NOT NULL THEN jsonb_build_array(p_group_id) ELSE '[]'::jsonb END,
      'challenge_updates',  '[]'::jsonb
    );
  END IF;
  v_secs := GREATEST(0, p_duration_minutes) * 60;
  v_hrs  := round(p_duration_minutes::numeric / 60, 4);
  INSERT INTO public.study_sessions_log
    (id, user_id, duration_minutes, started_at, ended_at, subject, notes)
  VALUES (
    p_session_id, v_uid, p_duration_minutes,
    COALESCE(p_ended_at, now()) - (p_duration_minutes || ' minutes')::interval,
    COALESCE(p_ended_at, now()),
    p_session_type, p_notes
  )
  ON CONFLICT (id) DO NOTHING;
  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  IF v_row_count = 0 THEN
    RETURN jsonb_build_object(
      'already_processed',  true,
      'affected_group_ids', '[]'::jsonb,
      'challenge_updates',  '[]'::jsonb
    );
  END IF;
  INSERT INTO public.daily_user_stats (user_id, date, seconds_studied)
  VALUES (v_uid, v_today, v_secs)
  ON CONFLICT (user_id, date) DO UPDATE
    SET seconds_studied = daily_user_stats.seconds_studied + EXCLUDED.seconds_studied;
  INSERT INTO public.user_stats_summary
    (user_id, total_study_seconds, total_hours, weekly_hours, monthly_hours,
     session_count, total_sessions, last_session_at, last_study_date, updated_at)
  VALUES
    (v_uid, v_secs, v_hrs, v_hrs, v_hrs, 1, 1, COALESCE(p_ended_at, now()), v_today, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_study_seconds = user_stats_summary.total_study_seconds + v_secs,
    total_hours         = round((user_stats_summary.total_study_seconds + v_secs)::numeric / 3600, 2),
    weekly_hours        = user_stats_summary.weekly_hours  + v_hrs,
    monthly_hours       = user_stats_summary.monthly_hours + v_hrs,
    session_count       = user_stats_summary.session_count  + 1,
    total_sessions      = user_stats_summary.total_sessions + 1,
    last_session_at     = COALESCE(p_ended_at, now()),
    last_study_date     = v_today,
    updated_at          = now();
  RETURN jsonb_build_object(
    'already_processed',  false,
    'affected_group_ids', CASE WHEN p_group_id IS NOT NULL THEN jsonb_build_array(p_group_id) ELSE '[]'::jsonb END,
    'challenge_updates',  '[]'::jsonb
  );
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_event_attendees"(p_event_id uuid)
 RETURNS TABLE(user_id uuid, username text, name text, joined_at timestamp with time zone)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


  SELECT cea.user_id, u.username, u.name, cea.joined_at
  FROM   public.community_event_attendees cea
  LEFT JOIN public.users u ON u.id = cea.user_id
  WHERE  cea.event_id = p_event_id
  ORDER  BY cea.joined_at ASC;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_group_analytics_from_snapshots"(p_group_id uuid, p_days integer DEFAULT 7)
 RETURNS TABLE(date date, total_seconds bigint, active_members bigint)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


  SELECT
    d.date,
    COALESCE(SUM(d.seconds_studied), 0)::bigint,
    COUNT(DISTINCT d.user_id)::bigint
  FROM public.daily_user_stats d
  JOIN public.group_members gm ON gm.user_id = d.user_id AND gm.group_id = p_group_id
  WHERE d.date >= (CURRENT_DATE - (p_days - 1))
  GROUP BY d.date
  ORDER BY d.date;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_group_leaderboard"(p_group_id uuid, p_limit integer DEFAULT 20)
 RETURNS TABLE(rank bigint, user_id uuid, username text, name text, avatar_url text, points integer)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


  SELECT
    ROW_NUMBER() OVER (ORDER BY COALESCE(up.points,0) DESC),
    gm.user_id,
    u.username,
    u.name,
    u.avatar_url,
    COALESCE(up.points, 0)
  FROM public.group_members gm
  JOIN public.users u             ON u.id       = gm.user_id
  LEFT JOIN public.user_points up ON up.user_id = gm.user_id
  WHERE gm.group_id = p_group_id
  ORDER BY COALESCE(up.points,0) DESC
  LIMIT p_limit;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_invite_details"(p_code text)
 RETURNS TABLE(group_id uuid, group_name text, group_slug text, group_description text, group_cover_url text, group_logo_url text, group_member_count bigint, inviter_username text, inviter_avatar_url text, is_valid boolean)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


  SELECT
    g.id,
    g.name,
    g.slug,
    g.description,
    g.cover_url,
    g.logo_url,
    COUNT(DISTINCT gm.user_id),
    up.handle,
    up.profile_data ->> 'avatarUrl',
    (
      (gi.expires_at IS NULL OR gi.expires_at > now())
      AND (gi.max_uses IS NULL OR gi.uses_count < gi.max_uses)
    )
  FROM public.group_invites gi
  JOIN public.groups g ON g.id = gi.group_id
  LEFT JOIN public.group_members gm ON gm.group_id = g.id AND gm.left_at IS NULL
  LEFT JOIN public.user_profiles up ON up.user_id = gi.created_by
  WHERE (gi.token = p_code OR gi.invite_code = p_code)
    AND (g.is_active = true OR g.is_active IS NULL)
    AND g.deleted_at IS NULL
  GROUP BY g.id, g.name, g.slug, g.description, g.cover_url, g.logo_url, up.handle, up.profile_data, gi.expires_at, gi.max_uses, gi.uses_count;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_leaderboard"(p_period text DEFAULT 'weekly'::text, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
 RETURNS TABLE(rank bigint, user_id uuid, username text, name text, avatar_url text, total_hours numeric, weekly_hours numeric, monthly_hours numeric, total_sessions integer, current_streak integer, last_session_at timestamp with time zone, score numeric)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

  SELECT
    ROW_NUMBER() OVER (
      ORDER BY
        CASE p_period
          WHEN 'monthly' THEN COALESCE(s.monthly_hours, 0)
          ELSE                COALESCE(s.weekly_hours, 0)
        END DESC,
        COALESCE(s.total_hours, 0) DESC
    ) AS rank,
    u.id AS user_id,
    u.username,
    u."name",
    u.avatar_url,
    COALESCE(s.total_hours, 0)   AS total_hours,
    COALESCE(s.weekly_hours, 0)  AS weekly_hours,
    COALESCE(s.monthly_hours, 0) AS monthly_hours,
    COALESCE(s.total_sessions, 0)::integer AS total_sessions,
    COALESCE(s.current_streak, 0)::integer AS current_streak,
    s.last_session_at,
    COALESCE(
      CASE p_period WHEN 'monthly' THEN s.monthly_hours ELSE s.weekly_hours END, 0
    ) AS score
  FROM public.users u
  LEFT JOIN public.user_stats_summary s ON s.user_id = u.id
  ORDER BY
    CASE p_period
      WHEN 'monthly' THEN COALESCE(s.monthly_hours, 0)
      ELSE                COALESCE(s.weekly_hours, 0)
    END DESC,
    COALESCE(s.total_hours, 0) DESC
  LIMIT p_limit
  OFFSET p_offset;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_membership_snapshot"(p_user_id uuid DEFAULT NULL::uuid, target_user_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


  select jsonb_build_object(
    'user_id',          u.id,
    'effective_plan',   coalesce(u.plan_type, 'free'),
    'plan_type',        coalesce(u.plan_type, 'free'),
    'plan_expires_at',  u.plan_expires_at,
    'access_source',    coalesce(u.access_source, 'free'),
    'access_ends_at',   u.access_ends_at,
    'billing_status',   coalesce(u.billing_status, 'free'),
    'cancel_at_period_end', coalesce(false, false),
    'portal_eligible',      coalesce(false, false),
    'is_premium',       (coalesce(u.plan_type,'free') <> 'free'),
    'points',           coalesce(up.points, 0),
    'lifetime_points',  coalesce(up.lifetime_points, 0)
  )
  from public.users u
  left join public.user_points up on up.user_id = u.id
  where u.id = coalesce(p_user_id, target_user_id);
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_my_group_ids"()
 RETURNS uuid[]
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$

 SELECT ARRAY(SELECT group_id FROM public.group_members WHERE user_id = (SELECT auth.uid()));
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_my_role"()
 RETURNS text
 LANGUAGE sql
 STABLE
 SET "search_path" TO ''
 AS $iso_fn$


    SELECT role FROM public.user_roles
    WHERE user_id = auth.uid()
    ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'moderator' THEN 2 ELSE 3 END LIMIT 1;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_username text;
  v_name     text;
  v_email    text;
BEGIN
  v_username := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''),
    split_part(COALESCE(NEW.email,''), '@', 1),
    'user_' || left(NEW.id::text, 8)
  );
  v_name  := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''), v_username);
  v_email := COALESCE(NEW.email, v_username || '@isotope.local');
  INSERT INTO public.users (id, email, name, username, plan_type, billing_status, plan_expires_at, access_ends_at)
  VALUES (NEW.id, v_email, v_name, v_username, 'ranker', 'active', '2099-12-31 23:59:59+00', '2099-12-31 23:59:59+00')
  ON CONFLICT (id) DO UPDATE SET
    username        = EXCLUDED.username,
    name            = COALESCE(EXCLUDED.name, users.name),
    plan_type       = 'ranker',
    billing_status  = 'active',
    plan_expires_at = '2099-12-31 23:59:59+00',
    access_ends_at  = '2099-12-31 23:59:59+00',
    updated_at      = now();
  INSERT INTO public.user_profiles (user_id, profile_data) VALUES (NEW.id, '{}') ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_points (user_id, points, lifetime_points) VALUES (NEW.id, 0, 0) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_stats_summary (user_id, total_study_seconds, streak_days, max_streak_days, session_count)
    VALUES (NEW.id, 0, 0, 0, 0) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_presence (user_id, status, last_seen) VALUES (NEW.id, 'offline', now()) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."is_premium_user"()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET "search_path" TO ''
 AS $iso_fn$

 SELECT true;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."is_premium_user"(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

 SELECT true;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."join_community_event"(p_event_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_uid uuid := auth.uid();
  v_evt public.community_events%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;
  SELECT * INTO v_evt FROM public.community_events WHERE id = p_event_id;
  IF NOT FOUND OR NOT v_evt.is_active THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Event not found or inactive');
  END IF;
  INSERT INTO public.community_event_attendees (event_id, user_id)
  VALUES (p_event_id, v_uid)
  ON CONFLICT (event_id, user_id) DO NOTHING;
  UPDATE public.community_events
    SET attendee_count = (SELECT COUNT(*) FROM public.community_event_attendees WHERE event_id = p_event_id)
  WHERE id = p_event_id;
  RETURN jsonb_build_object('ok', true);
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."join_community_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_uid   uuid := auth.uid();
  v_group public.groups%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_group FROM public.groups
  WHERE id = p_group_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group not found');
  END IF;
  IF NOT v_group.is_public THEN
    RETURN jsonb_build_object('success', false, 'error', 'This group is invite-only');
  END IF;
  IF v_group.member_count >= v_group.max_members THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group is full');
  END IF;
  IF public._is_group_member(p_group_id, v_uid) THEN
    RETURN jsonb_build_object('success', true, 'already_member', true);
  END IF;

  INSERT INTO public.group_members (group_id, user_id, role, joined_at)
  VALUES (p_group_id, v_uid, 'member', now())
  ON CONFLICT (group_id, user_id) DO NOTHING;

  UPDATE public.groups SET member_count = member_count + 1, updated_at = now()
  WHERE id = p_group_id AND member_count < max_members;

  RETURN jsonb_build_object('success', true, 'group_id', p_group_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."leave_community_event"(p_event_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;
  DELETE FROM public.community_event_attendees WHERE event_id = p_event_id AND user_id = v_uid;
  UPDATE public.community_events
    SET attendee_count = (SELECT COUNT(*) FROM public.community_event_attendees WHERE event_id = p_event_id)
  WHERE id = p_event_id;
  RETURN jsonb_build_object('ok', true);
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."leave_community_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_uid  uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT role INTO v_role FROM public.group_members
  WHERE group_id = p_group_id AND user_id = v_uid;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not a member of this group');
  END IF;
  IF v_role = 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Owner cannot leave; delete the group or transfer ownership first');
  END IF;

  DELETE FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  UPDATE public.groups SET member_count = GREATEST(0, member_count - 1), updated_at = now()
  WHERE id = p_group_id;

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."purchase_store_item"(p_user_id uuid, p_item_id uuid)
 RETURNS jsonb
 LANGUAGE sql
 VOLATILE
 SET "search_path" TO ''
 AS $iso_fn$


  select rpc_private.purchase_store_item(p_user_id, p_item_id);
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"()
 RETURNS event_trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."set_group_slug_from_name"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SET "search_path" TO ''
 AS $iso_fn$


BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := lower(regexp_replace(coalesce(NEW.name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    IF NEW.slug = '' THEN
      NEW.slug := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."set_user_tours_updated_at"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SET "search_path" TO ''
 AS $iso_fn$


  BEGIN NEW.updated_at = now(); RETURN NEW; END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."sync_group_member_count"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."sync_group_visibility"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SET "search_path" TO ''
 AS $iso_fn$


BEGIN
  -- Normalize common strings
  IF NEW.visibility IS NULL THEN
    -- if visibility omitted, keep is_public as-is
    RETURN NEW;
  END IF;

  NEW.is_public := lower(trim(NEW.visibility)) IN ('public','true','t','1','yes','y');
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."sync_user_display_profile"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


begin
  if tg_op = 'DELETE' then
    delete from public.user_display_profiles where id = old.id;
    return old;
  end if;
  insert into public.user_display_profiles (id, username, name, avatar_url, updated_at)
  values (new.id, new.username, new.name, new.avatar_url, coalesce(new.updated_at, now()))
  on conflict (id) do update set
    username = excluded.username,
    name = excluded.name,
    avatar_url = excluded.avatar_url,
    updated_at = excluded.updated_at;
  return new;
end;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."sync_user_onboarding_from_profile"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO ''
 AS $iso_fn$


DECLARE
  v_done boolean;
  v_completed_at timestamptz;
BEGIN
  v_done := COALESCE((NEW.profile_data->>'isOnboarded')::boolean, false);
  IF v_done THEN
    v_completed_at := COALESCE(
      NULLIF(NEW.profile_data->>'onboardingCompletedAt', '')::timestamptz,
      now()
    );
  ELSE
    v_completed_at := NULL;
  END IF;

  INSERT INTO public.user_onboarding(user_id, completed, completed_at, source, updated_at)
  VALUES (NEW.user_id, v_done, v_completed_at, 'profile', now())
  ON CONFLICT(user_id) DO UPDATE SET
    completed    = EXCLUDED.completed,
    completed_at = COALESCE(EXCLUDED.completed_at, public.user_onboarding.completed_at),
    source       = EXCLUDED.source,
    updated_at   = now();
  RETURN NEW;
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."update_community_event"(p_id uuid, p_title text DEFAULT NULL::text, p_event_type text DEFAULT NULL::text, p_description text DEFAULT NULL::text, p_host text DEFAULT NULL::text, p_start_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_image_gradient text DEFAULT NULL::text, p_image_url text DEFAULT NULL::text, p_tags text[] DEFAULT NULL::text[], p_max_attendees integer DEFAULT NULL::integer, p_is_featured boolean DEFAULT NULL::boolean, p_is_active boolean DEFAULT NULL::boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE v_found boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.community_events WHERE id = p_id) INTO v_found;
  IF NOT v_found THEN RETURN jsonb_build_object('ok', false, 'error', 'Event not found'); END IF;
  UPDATE public.community_events SET
    title          = COALESCE(p_title,          title),
    event_type     = COALESCE(p_event_type,     event_type),
    description    = COALESCE(p_description,    description),
    host           = COALESCE(p_host,           host),
    start_time     = COALESCE(p_start_time,     start_time),
    end_time       = COALESCE(p_end_time,       end_time),
    image_gradient = COALESCE(p_image_gradient, image_gradient),
    image_url      = COALESCE(p_image_url,      image_url),
    tags           = COALESCE(p_tags,           tags),
    max_attendees  = COALESCE(p_max_attendees,  max_attendees),
    is_featured    = COALESCE(p_is_featured,    is_featured),
    is_active      = COALESCE(p_is_active,      is_active),
    updated_at     = now()
  WHERE id = p_id;
  RETURN jsonb_build_object('ok', true);
END
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."update_group_member_role"(p_group_id uuid, p_target_uid uuid, p_new_role text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$


DECLARE
  v_uid       uuid := auth.uid();
  v_my_role   text;
  v_tgt_role  text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  IF p_new_role NOT IN ('member','moderator','admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid role. Allowed: member, moderator, admin');
  END IF;
  -- Prevent self-promotion
  IF v_uid = p_target_uid THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot change your own role');
  END IF;

  SELECT role INTO v_my_role  FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  SELECT role INTO v_tgt_role FROM public.group_members WHERE group_id = p_group_id AND user_id = p_target_uid;

  IF v_my_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are not a member of this group');
  END IF;
  IF v_tgt_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Target user is not a member');
  END IF;
  IF v_tgt_role = 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot change the owner''s role');
  END IF;

  -- Permission checks
  IF v_my_role = 'owner' THEN
    NULL; -- owner can set any non-owner role
  ELSIF v_my_role = 'admin' THEN
    IF p_new_role NOT IN ('member','moderator') THEN
      RETURN jsonb_build_object('success', false, 'error', 'Admins can only set member or moderator role');
    END IF;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Only owners and admins can change roles');
  END IF;

  UPDATE public.group_members SET role = p_new_role
  WHERE group_id = p_group_id AND user_id = p_target_uid;

  RETURN jsonb_build_object('success', true, 'role', p_new_role);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$iso_fn$;
DROP TRIGGER IF EXISTS "sync_user_display_profile" ON "public"."users";
CREATE TRIGGER sync_user_display_profile AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION sync_user_display_profile();
DROP TRIGGER IF EXISTS "tr_cleanup_old_notifications" ON "public"."notifications";
CREATE TRIGGER tr_cleanup_old_notifications AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION cleanup_old_notifications();
DROP TRIGGER IF EXISTS "tr_sync_user_onboarding_from_profile" ON "public"."user_profiles";
CREATE TRIGGER tr_sync_user_onboarding_from_profile AFTER INSERT OR UPDATE OF profile_data ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION sync_user_onboarding_from_profile();
DROP TRIGGER IF EXISTS "trg_auto_add_owner" ON "public"."groups";
CREATE TRIGGER trg_auto_add_owner AFTER INSERT ON public.groups FOR EACH ROW EXECUTE FUNCTION _auto_add_group_owner();
DROP TRIGGER IF EXISTS "trg_auto_add_super_admin" ON "public"."groups";
CREATE TRIGGER trg_auto_add_super_admin AFTER INSERT ON public.groups FOR EACH ROW EXECUTE FUNCTION _auto_add_super_admin();
DROP TRIGGER IF EXISTS "trg_ensure_community_enrollment" ON "public"."users";
CREATE TRIGGER trg_ensure_community_enrollment AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION _ensure_community_enrollment();
DROP TRIGGER IF EXISTS "trg_ensure_onboarding" ON "public"."users";
CREATE TRIGGER trg_ensure_onboarding AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION _ensure_onboarding_complete();
DROP TRIGGER IF EXISTS "trg_ensure_stats" ON "public"."users";
CREATE TRIGGER trg_ensure_stats AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION _ensure_stats_summary();
DROP TRIGGER IF EXISTS "trg_ensure_user_points" ON "public"."users";
CREATE TRIGGER trg_ensure_user_points AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION _ensure_user_points();
DROP TRIGGER IF EXISTS "trg_ensure_user_profile" ON "public"."users";
CREATE TRIGGER trg_ensure_user_profile AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION _ensure_user_profile();
DROP TRIGGER IF EXISTS "trg_set_group_slug" ON "public"."groups";
CREATE TRIGGER trg_set_group_slug BEFORE INSERT ON public.groups FOR EACH ROW EXECUTE FUNCTION set_group_slug_from_name();
DROP TRIGGER IF EXISTS "trg_sync_group_visibility" ON "public"."groups";
CREATE TRIGGER trg_sync_group_visibility BEFORE INSERT OR UPDATE OF visibility ON public.groups FOR EACH ROW EXECUTE FUNCTION sync_group_visibility();
DROP TRIGGER IF EXISTS "trg_sync_member_count" ON "public"."group_members";
CREATE TRIGGER trg_sync_member_count AFTER INSERT OR DELETE ON public.group_members FOR EACH ROW EXECUTE FUNCTION _sync_group_member_count();
DROP TRIGGER IF EXISTS "trg_user_tours_updated_at" ON "public"."user_tours";
CREATE TRIGGER trg_user_tours_updated_at BEFORE UPDATE ON public.user_tours FOR EACH ROW EXECUTE FUNCTION set_user_tours_updated_at();
DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
ALTER TABLE "public"."backup_manifests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."buddy_invites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_device_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_event_attendees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_friends" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_join_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."community_start_alerts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."daily_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."daily_user_stats" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."exams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."focus_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_announcements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_challenge_participants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_challenges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_chat_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_invites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_milestones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."habits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."mock_tests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."store_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."study_sessions_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."subjects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sync_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_display_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_inventory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_onboarding" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_points" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_presence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_stats_summary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_tours" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "backup_manifests_auth_policy" ON "public"."backup_manifests";
CREATE POLICY "backup_manifests_auth_policy" ON "public"."backup_manifests" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "backup_manifests_delete_own" ON "public"."backup_manifests";
CREATE POLICY "backup_manifests_delete_own" ON "public"."backup_manifests" AS PERMISSIVE FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "backup_manifests_insert_own" ON "public"."backup_manifests";
CREATE POLICY "backup_manifests_insert_own" ON "public"."backup_manifests" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (split_part(path, '/'::text, 1) = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "backup_manifests_select_own" ON "public"."backup_manifests";
CREATE POLICY "backup_manifests_select_own" ON "public"."backup_manifests" AS PERMISSIVE FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "backup_manifests_update_own" ON "public"."backup_manifests";
CREATE POLICY "backup_manifests_update_own" ON "public"."backup_manifests" AS PERMISSIVE FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (split_part(path, '/'::text, 1) = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "community_device_tokens_auth_policy" ON "public"."community_device_tokens";
CREATE POLICY "community_device_tokens_auth_policy" ON "public"."community_device_tokens" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "community_tokens_own" ON "public"."community_device_tokens";
CREATE POLICY "community_tokens_own" ON "public"."community_device_tokens" AS PERMISSIVE FOR SELECT  USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "community_enrollments_auth_policy" ON "public"."community_enrollments";
CREATE POLICY "community_enrollments_auth_policy" ON "public"."community_enrollments" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "community_enrollments_own" ON "public"."community_enrollments";
CREATE POLICY "community_enrollments_own" ON "public"."community_enrollments" AS PERMISSIVE FOR SELECT  USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "cea_own" ON "public"."community_event_attendees";
CREATE POLICY "cea_own" ON "public"."community_event_attendees" AS PERMISSIVE FOR ALL  USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
DROP POLICY IF EXISTS "cea_read_auth" ON "public"."community_event_attendees";
CREATE POLICY "cea_read_auth" ON "public"."community_event_attendees" AS PERMISSIVE FOR SELECT  USING ((auth.role() = 'authenticated'::text));
DROP POLICY IF EXISTS "community_event_attendees_auth_policy" ON "public"."community_event_attendees";
CREATE POLICY "community_event_attendees_auth_policy" ON "public"."community_event_attendees" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "event_attendees_delete_own" ON "public"."community_event_attendees";
CREATE POLICY "event_attendees_delete_own" ON "public"."community_event_attendees" AS PERMISSIVE FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "event_attendees_insert_own" ON "public"."community_event_attendees";
CREATE POLICY "event_attendees_insert_own" ON "public"."community_event_attendees" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "event_attendees_read_active" ON "public"."community_event_attendees";
CREATE POLICY "event_attendees_read_active" ON "public"."community_event_attendees" AS PERMISSIVE FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM community_events ce
  WHERE ((ce.id = community_event_attendees.event_id) AND (ce.is_active = true)))));
DROP POLICY IF EXISTS "ce_read_public" ON "public"."community_events";
CREATE POLICY "ce_read_public" ON "public"."community_events" AS PERMISSIVE FOR SELECT  USING ((is_active = true));
DROP POLICY IF EXISTS "ce_service_write" ON "public"."community_events";
CREATE POLICY "ce_service_write" ON "public"."community_events" AS PERMISSIVE FOR ALL  USING ((auth.role() = 'service_role'::text));
DROP POLICY IF EXISTS "community_events_auth_policy" ON "public"."community_events";
CREATE POLICY "community_events_auth_policy" ON "public"."community_events" AS PERMISSIVE FOR ALL  USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));
DROP POLICY IF EXISTS "community_events_read_active" ON "public"."community_events";
CREATE POLICY "community_events_read_active" ON "public"."community_events" AS PERMISSIVE FOR SELECT TO anon, authenticated USING ((is_active = true));
DROP POLICY IF EXISTS "community_friends_auth_policy" ON "public"."community_friends";
CREATE POLICY "community_friends_auth_policy" ON "public"."community_friends" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "community_friends_own" ON "public"."community_friends";
CREATE POLICY "community_friends_own" ON "public"."community_friends" AS PERMISSIVE FOR SELECT  USING (((auth.uid() = user_id) OR (auth.uid() = friend_id)));
DROP POLICY IF EXISTS "community_join_requests_auth_policy" ON "public"."community_join_requests";
CREATE POLICY "community_join_requests_auth_policy" ON "public"."community_join_requests" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "community_requests_own" ON "public"."community_join_requests";
CREATE POLICY "community_requests_own" ON "public"."community_join_requests" AS PERMISSIVE FOR SELECT  USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "community_reports_auth_policy" ON "public"."community_reports";
CREATE POLICY "community_reports_auth_policy" ON "public"."community_reports" AS PERMISSIVE FOR ALL  USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));
DROP POLICY IF EXISTS "community_reports_insert" ON "public"."community_reports";
CREATE POLICY "community_reports_insert" ON "public"."community_reports" AS PERMISSIVE FOR INSERT  WITH CHECK ((auth.uid() = reporter_user_id));
DROP POLICY IF EXISTS "community_start_alerts_auth_policy" ON "public"."community_start_alerts";
CREATE POLICY "community_start_alerts_auth_policy" ON "public"."community_start_alerts" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "community_start_own" ON "public"."community_start_alerts";
CREATE POLICY "community_start_own" ON "public"."community_start_alerts" AS PERMISSIVE FOR SELECT  USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "daily_logs_user_policy" ON "public"."daily_logs";
CREATE POLICY "daily_logs_user_policy" ON "public"."daily_logs" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "daily_delete_own" ON "public"."daily_user_stats";
CREATE POLICY "daily_delete_own" ON "public"."daily_user_stats" AS PERMISSIVE FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "daily_insert_own" ON "public"."daily_user_stats";
CREATE POLICY "daily_insert_own" ON "public"."daily_user_stats" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "daily_own" ON "public"."daily_user_stats";
CREATE POLICY "daily_own" ON "public"."daily_user_stats" AS PERMISSIVE FOR ALL  USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "daily_read_all" ON "public"."daily_user_stats";
CREATE POLICY "daily_read_all" ON "public"."daily_user_stats" AS PERMISSIVE FOR SELECT  USING (true);
DROP POLICY IF EXISTS "daily_read_authenticated" ON "public"."daily_user_stats";
CREATE POLICY "daily_read_authenticated" ON "public"."daily_user_stats" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "daily_update_own" ON "public"."daily_user_stats";
CREATE POLICY "daily_update_own" ON "public"."daily_user_stats" AS PERMISSIVE FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "daily_user_stats_auth_policy" ON "public"."daily_user_stats";
CREATE POLICY "daily_user_stats_auth_policy" ON "public"."daily_user_stats" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "exams_user_policy" ON "public"."exams";
CREATE POLICY "exams_user_policy" ON "public"."exams" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "focus_sessions_user_policy" ON "public"."focus_sessions";
CREATE POLICY "focus_sessions_user_policy" ON "public"."focus_sessions" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "announcements_read_public" ON "public"."group_announcements";
CREATE POLICY "announcements_read_public" ON "public"."group_announcements" AS PERMISSIVE FOR SELECT  USING ((EXISTS ( SELECT 1
   FROM groups g
  WHERE ((g.id = group_announcements.group_id) AND (g.is_public = true) AND (g.is_active = true)))));
DROP POLICY IF EXISTS "gann_read" ON "public"."group_announcements";
CREATE POLICY "gann_read" ON "public"."group_announcements" AS PERMISSIVE FOR SELECT  USING (_is_group_member(group_id, auth.uid()));
DROP POLICY IF EXISTS "gann_write" ON "public"."group_announcements";
CREATE POLICY "gann_write" ON "public"."group_announcements" AS PERMISSIVE FOR ALL  USING ((author_id = auth.uid())) WITH CHECK ((author_id = auth.uid()));
DROP POLICY IF EXISTS "group_announcements_auth_policy" ON "public"."group_announcements";
CREATE POLICY "group_announcements_auth_policy" ON "public"."group_announcements" AS PERMISSIVE FOR ALL  USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));
DROP POLICY IF EXISTS "group_announcements_delete_managers" ON "public"."group_announcements";
CREATE POLICY "group_announcements_delete_managers" ON "public"."group_announcements" AS PERMISSIVE FOR DELETE TO anon, authenticated USING (((author_id = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_announcements_insert_managers" ON "public"."group_announcements";
CREATE POLICY "group_announcements_insert_managers" ON "public"."group_announcements" AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (((author_id = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_announcements_read_members" ON "public"."group_announcements";
CREATE POLICY "group_announcements_read_members" ON "public"."group_announcements" AS PERMISSIVE FOR SELECT TO anon, authenticated USING (private.is_group_member(group_id, ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "group_announcements_update_managers" ON "public"."group_announcements";
CREATE POLICY "group_announcements_update_managers" ON "public"."group_announcements" AS PERMISSIVE FOR UPDATE TO anon, authenticated USING (((author_id = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid)))) WITH CHECK (((author_id = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "challenge_participants_delete_own" ON "public"."group_challenge_participants";
CREATE POLICY "challenge_participants_delete_own" ON "public"."group_challenge_participants" AS PERMISSIVE FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "challenge_participants_insert_own" ON "public"."group_challenge_participants";
CREATE POLICY "challenge_participants_insert_own" ON "public"."group_challenge_participants" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "challenge_participants_read_members" ON "public"."group_challenge_participants";
CREATE POLICY "challenge_participants_read_members" ON "public"."group_challenge_participants" AS PERMISSIVE FOR SELECT TO anon, authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM group_challenges gc
  WHERE ((gc.id = group_challenge_participants.challenge_id) AND private.is_group_member(gc.group_id, ( SELECT auth.uid() AS uid)))))));
DROP POLICY IF EXISTS "challenge_participants_update_own" ON "public"."group_challenge_participants";
CREATE POLICY "challenge_participants_update_own" ON "public"."group_challenge_participants" AS PERMISSIVE FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "gcpart_own" ON "public"."group_challenge_participants";
CREATE POLICY "gcpart_own" ON "public"."group_challenge_participants" AS PERMISSIVE FOR ALL  USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
DROP POLICY IF EXISTS "gcpart_read" ON "public"."group_challenge_participants";
CREATE POLICY "gcpart_read" ON "public"."group_challenge_participants" AS PERMISSIVE FOR SELECT  USING ((challenge_id IN ( SELECT gc.id
   FROM group_challenges gc
  WHERE _is_group_member(gc.group_id, auth.uid()))));
DROP POLICY IF EXISTS "group_challenge_participants_auth_policy" ON "public"."group_challenge_participants";
CREATE POLICY "group_challenge_participants_auth_policy" ON "public"."group_challenge_participants" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "gchall_insert" ON "public"."group_challenges";
CREATE POLICY "gchall_insert" ON "public"."group_challenges" AS PERMISSIVE FOR INSERT  WITH CHECK (((created_by = auth.uid()) AND _is_group_member(group_id, auth.uid())));
DROP POLICY IF EXISTS "gchall_read" ON "public"."group_challenges";
CREATE POLICY "gchall_read" ON "public"."group_challenges" AS PERMISSIVE FOR SELECT  USING (_is_group_member(group_id, auth.uid()));
DROP POLICY IF EXISTS "gchall_update" ON "public"."group_challenges";
CREATE POLICY "gchall_update" ON "public"."group_challenges" AS PERMISSIVE FOR UPDATE  USING ((created_by = auth.uid()));
DROP POLICY IF EXISTS "group_challenges_auth_policy" ON "public"."group_challenges";
CREATE POLICY "group_challenges_auth_policy" ON "public"."group_challenges" AS PERMISSIVE FOR ALL  USING ((auth.uid() = created_by)) WITH CHECK ((auth.uid() = created_by));
DROP POLICY IF EXISTS "group_challenges_delete_managers" ON "public"."group_challenges";
CREATE POLICY "group_challenges_delete_managers" ON "public"."group_challenges" AS PERMISSIVE FOR DELETE TO anon, authenticated USING (((created_by = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_challenges_insert_managers" ON "public"."group_challenges";
CREATE POLICY "group_challenges_insert_managers" ON "public"."group_challenges" AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (((created_by = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_challenges_update_managers" ON "public"."group_challenges";
CREATE POLICY "group_challenges_update_managers" ON "public"."group_challenges" AS PERMISSIVE FOR UPDATE TO anon, authenticated USING (((created_by = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid)))) WITH CHECK (((created_by = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "gchat_insert" ON "public"."group_chat_messages";
CREATE POLICY "gchat_insert" ON "public"."group_chat_messages" AS PERMISSIVE FOR INSERT  WITH CHECK (((user_id = auth.uid()) AND _is_group_member(group_id, auth.uid())));
DROP POLICY IF EXISTS "gchat_read" ON "public"."group_chat_messages";
CREATE POLICY "gchat_read" ON "public"."group_chat_messages" AS PERMISSIVE FOR SELECT  USING (_is_group_member(group_id, auth.uid()));
DROP POLICY IF EXISTS "group_chat_insert_own" ON "public"."group_chat_messages";
CREATE POLICY "group_chat_insert_own" ON "public"."group_chat_messages" AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND private.is_group_member(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_chat_messages_auth_policy" ON "public"."group_chat_messages";
CREATE POLICY "group_chat_messages_auth_policy" ON "public"."group_chat_messages" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "group_chat_read_members" ON "public"."group_chat_messages";
CREATE POLICY "group_chat_read_members" ON "public"."group_chat_messages" AS PERMISSIVE FOR SELECT TO anon, authenticated USING (private.is_group_member(group_id, ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "group_chat_update_own" ON "public"."group_chat_messages";
CREATE POLICY "group_chat_update_own" ON "public"."group_chat_messages" AS PERMISSIVE FOR UPDATE TO anon, authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) AND private.is_group_member(group_id, ( SELECT auth.uid() AS uid)))) WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND private.is_group_member(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "ginv_create" ON "public"."group_invites";
CREATE POLICY "ginv_create" ON "public"."group_invites" AS PERMISSIVE FOR INSERT  WITH CHECK (((created_by = ( SELECT auth.uid() AS uid)) AND (group_id IN ( SELECT group_members.group_id
   FROM group_members
  WHERE ((group_members.user_id = ( SELECT auth.uid() AS uid)) AND (group_members.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text])))))));
DROP POLICY IF EXISTS "ginv_delete" ON "public"."group_invites";
CREATE POLICY "ginv_delete" ON "public"."group_invites" AS PERMISSIVE FOR DELETE  USING (((created_by = ( SELECT auth.uid() AS uid)) OR (group_id IN ( SELECT group_members.group_id
   FROM group_members
  WHERE ((group_members.user_id = ( SELECT auth.uid() AS uid)) AND (group_members.role = ANY (ARRAY['owner'::text, 'admin'::text])))))));
DROP POLICY IF EXISTS "ginv_read" ON "public"."group_invites";
CREATE POLICY "ginv_read" ON "public"."group_invites" AS PERMISSIVE FOR SELECT  USING (((group_id IN ( SELECT group_members.group_id
   FROM group_members
  WHERE (group_members.user_id = ( SELECT auth.uid() AS uid)))) OR (created_by = ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_invites_auth_policy" ON "public"."group_invites";
CREATE POLICY "group_invites_auth_policy" ON "public"."group_invites" AS PERMISSIVE FOR ALL  USING ((auth.uid() = created_by)) WITH CHECK ((auth.uid() = created_by));
DROP POLICY IF EXISTS "group_invites_delete_managers" ON "public"."group_invites";
CREATE POLICY "group_invites_delete_managers" ON "public"."group_invites" AS PERMISSIVE FOR DELETE TO anon, authenticated USING (((created_by = ( SELECT auth.uid() AS uid)) OR private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_invites_insert_managers" ON "public"."group_invites";
CREATE POLICY "group_invites_insert_managers" ON "public"."group_invites" AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (((created_by = ( SELECT auth.uid() AS uid)) AND private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "group_invites_read_managers" ON "public"."group_invites";
CREATE POLICY "group_invites_read_managers" ON "public"."group_invites" AS PERMISSIVE FOR SELECT TO anon, authenticated USING (((created_by = ( SELECT auth.uid() AS uid)) OR private.can_manage_group(group_id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "gm_delete_admin" ON "public"."group_members";
CREATE POLICY "gm_delete_admin" ON "public"."group_members" AS PERMISSIVE FOR DELETE  USING (((auth.uid() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM group_members gm2
  WHERE ((gm2.group_id = group_members.group_id) AND (gm2.user_id = auth.uid()) AND (gm2.role = ANY (ARRAY['admin'::text, 'owner'::text])))))));
DROP POLICY IF EXISTS "gm_delete_self" ON "public"."group_members";
CREATE POLICY "gm_delete_self" ON "public"."group_members" AS PERMISSIVE FOR DELETE  USING (((auth.uid() IS NOT NULL) AND (user_id = auth.uid())));
DROP POLICY IF EXISTS "gm_insert" ON "public"."group_members";
CREATE POLICY "gm_insert" ON "public"."group_members" AS PERMISSIVE FOR INSERT  WITH CHECK ((auth.role() = 'authenticated'::text));
DROP POLICY IF EXISTS "gm_insert_owner_self" ON "public"."group_members";
CREATE POLICY "gm_insert_owner_self" ON "public"."group_members" AS PERMISSIVE FOR INSERT  WITH CHECK (((auth.uid() IS NOT NULL) AND (user_id = auth.uid()) AND (role = 'owner'::text) AND (EXISTS ( SELECT 1
   FROM groups g
  WHERE ((g.id = group_members.group_id) AND (g.owner_id = auth.uid()))))));
DROP POLICY IF EXISTS "gm_join_public_group" ON "public"."group_members";
CREATE POLICY "gm_join_public_group" ON "public"."group_members" AS PERMISSIVE FOR INSERT  WITH CHECK (((auth.uid() IS NOT NULL) AND (user_id = auth.uid()) AND (role = 'member'::text) AND (EXISTS ( SELECT 1
   FROM groups g
  WHERE ((g.id = group_members.group_id) AND (g.is_public = true) AND (g.is_active = true))))));
DROP POLICY IF EXISTS "gm_join_via_invite" ON "public"."group_members";
CREATE POLICY "gm_join_via_invite" ON "public"."group_members" AS PERMISSIVE FOR INSERT  WITH CHECK (((auth.uid() IS NOT NULL) AND (user_id = auth.uid()) AND (role = 'member'::text) AND (EXISTS ( SELECT 1
   FROM group_invites gi
  WHERE ((gi.group_id = group_members.group_id) AND ((gi.expires_at IS NULL) OR (gi.expires_at > now())) AND ((gi.max_uses IS NULL) OR (gi.uses_count < gi.max_uses)))))));
DROP POLICY IF EXISTS "gm_own_delete" ON "public"."group_members";
CREATE POLICY "gm_own_delete" ON "public"."group_members" AS PERMISSIVE FOR DELETE  USING ((user_id = auth.uid()));
DROP POLICY IF EXISTS "gm_owner_update" ON "public"."group_members";
CREATE POLICY "gm_owner_update" ON "public"."group_members" AS PERMISSIVE FOR UPDATE  USING (((user_id = auth.uid()) OR (group_id IN ( SELECT groups.id
   FROM groups
  WHERE (groups.owner_id = auth.uid())))));
DROP POLICY IF EXISTS "gm_read" ON "public"."group_members";
CREATE POLICY "gm_read" ON "public"."group_members" AS PERMISSIVE FOR SELECT  USING ((auth.role() = 'authenticated'::text));
DROP POLICY IF EXISTS "gm_self_delete" ON "public"."group_members";
CREATE POLICY "gm_self_delete" ON "public"."group_members" AS PERMISSIVE FOR DELETE TO authenticated USING ((user_id = auth.uid()));
DROP POLICY IF EXISTS "gm_update_own_row" ON "public"."group_members";
CREATE POLICY "gm_update_own_row" ON "public"."group_members" AS PERMISSIVE FOR UPDATE  USING (((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))) WITH CHECK (((auth.uid() IS NOT NULL) AND (user_id = auth.uid())));
DROP POLICY IF EXISTS "group_members_auth_policy" ON "public"."group_members";
CREATE POLICY "group_members_auth_policy" ON "public"."group_members" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "gmile_read" ON "public"."group_milestones";
CREATE POLICY "gmile_read" ON "public"."group_milestones" AS PERMISSIVE FOR SELECT  USING (_is_group_member(group_id, auth.uid()));
DROP POLICY IF EXISTS "group_milestones_auth_policy" ON "public"."group_milestones";
CREATE POLICY "group_milestones_auth_policy" ON "public"."group_milestones" AS PERMISSIVE FOR ALL  USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));
DROP POLICY IF EXISTS "group_milestones_read_members" ON "public"."group_milestones";
CREATE POLICY "group_milestones_read_members" ON "public"."group_milestones" AS PERMISSIVE FOR SELECT TO anon, authenticated USING (private.is_group_member(group_id, ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "groups_auth_insert" ON "public"."groups";
CREATE POLICY "groups_auth_insert" ON "public"."groups" AS PERMISSIVE FOR INSERT  WITH CHECK ((auth.role() = 'authenticated'::text));
DROP POLICY IF EXISTS "groups_auth_policy" ON "public"."groups";
CREATE POLICY "groups_auth_policy" ON "public"."groups" AS PERMISSIVE FOR ALL  USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "groups_delete_own" ON "public"."groups";
CREATE POLICY "groups_delete_own" ON "public"."groups" AS PERMISSIVE FOR DELETE TO authenticated USING ((owner_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "groups_insert_own" ON "public"."groups";
CREATE POLICY "groups_insert_own" ON "public"."groups" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((owner_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "groups_member_read" ON "public"."groups";
CREATE POLICY "groups_member_read" ON "public"."groups" AS PERMISSIVE FOR SELECT  USING ((id IN ( SELECT group_members.group_id
   FROM group_members
  WHERE (group_members.user_id = auth.uid()))));
DROP POLICY IF EXISTS "groups_owner_delete" ON "public"."groups";
CREATE POLICY "groups_owner_delete" ON "public"."groups" AS PERMISSIVE FOR DELETE  USING ((owner_id = auth.uid()));
DROP POLICY IF EXISTS "groups_owner_update" ON "public"."groups";
CREATE POLICY "groups_owner_update" ON "public"."groups" AS PERMISSIVE FOR UPDATE  USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));
DROP POLICY IF EXISTS "groups_read_authenticated" ON "public"."groups";
CREATE POLICY "groups_read_authenticated" ON "public"."groups" AS PERMISSIVE FOR SELECT TO anon, authenticated USING ((((is_public = true) AND (is_active = true) AND (deleted_at IS NULL)) OR private.is_group_member(id, ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "groups_read_public" ON "public"."groups";
CREATE POLICY "groups_read_public" ON "public"."groups" AS PERMISSIVE FOR SELECT TO anon USING (((is_public = true) AND (is_active = true) AND (deleted_at IS NULL)));
DROP POLICY IF EXISTS "groups_update_own" ON "public"."groups";
CREATE POLICY "groups_update_own" ON "public"."groups" AS PERMISSIVE FOR UPDATE TO authenticated USING ((owner_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((owner_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "groups_update_owner" ON "public"."groups";
CREATE POLICY "groups_update_owner" ON "public"."groups" AS PERMISSIVE FOR UPDATE  USING (((auth.uid() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM group_members gm
  WHERE ((gm.group_id = groups.id) AND (gm.user_id = auth.uid()) AND (gm.role = ANY (ARRAY['admin'::text, 'owner'::text])))))));
DROP POLICY IF EXISTS "habits_user_policy" ON "public"."habits";
CREATE POLICY "habits_user_policy" ON "public"."habits" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "mock_tests_user_policy" ON "public"."mock_tests";
CREATE POLICY "mock_tests_user_policy" ON "public"."mock_tests" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "notif_own" ON "public"."notifications";
CREATE POLICY "notif_own" ON "public"."notifications" AS PERMISSIVE FOR ALL  USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
DROP POLICY IF EXISTS "notifications_own" ON "public"."notifications";
CREATE POLICY "notifications_own" ON "public"."notifications" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "notifications_user_policy" ON "public"."notifications";
CREATE POLICY "notifications_user_policy" ON "public"."notifications" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "store_items_read" ON "public"."store_items";
CREATE POLICY "store_items_read" ON "public"."store_items" AS PERMISSIVE FOR SELECT TO anon, authenticated USING ((active = true));
DROP POLICY IF EXISTS "store_read_all" ON "public"."store_items";
CREATE POLICY "store_read_all" ON "public"."store_items" AS PERMISSIVE FOR SELECT  USING (true);
DROP POLICY IF EXISTS "sessions_own" ON "public"."study_sessions_log";
CREATE POLICY "sessions_own" ON "public"."study_sessions_log" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "study_sessions_log_auth_policy" ON "public"."study_sessions_log";
CREATE POLICY "study_sessions_log_auth_policy" ON "public"."study_sessions_log" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "subjects_user_policy" ON "public"."subjects";
CREATE POLICY "subjects_user_policy" ON "public"."subjects" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "sync_items_auth_policy" ON "public"."sync_items";
CREATE POLICY "sync_items_auth_policy" ON "public"."sync_items" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "sync_items_own" ON "public"."sync_items";
CREATE POLICY "sync_items_own" ON "public"."sync_items" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "tasks_user_policy" ON "public"."tasks";
CREATE POLICY "tasks_user_policy" ON "public"."tasks" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "tests_user_policy" ON "public"."tests";
CREATE POLICY "tests_user_policy" ON "public"."tests" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "user_display_profiles_read" ON "public"."user_display_profiles";
CREATE POLICY "user_display_profiles_read" ON "public"."user_display_profiles" AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "inventory_own" ON "public"."user_inventory";
CREATE POLICY "inventory_own" ON "public"."user_inventory" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "user_inventory_auth_policy" ON "public"."user_inventory";
CREATE POLICY "user_inventory_auth_policy" ON "public"."user_inventory" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "onboarding_own" ON "public"."user_onboarding";
CREATE POLICY "onboarding_own" ON "public"."user_onboarding" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "user_onboarding_user_policy" ON "public"."user_onboarding";
CREATE POLICY "user_onboarding_user_policy" ON "public"."user_onboarding" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "points_insert_own" ON "public"."user_points";
CREATE POLICY "points_insert_own" ON "public"."user_points" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "points_own_write" ON "public"."user_points";
CREATE POLICY "points_own_write" ON "public"."user_points" AS PERMISSIVE FOR ALL  USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
DROP POLICY IF EXISTS "points_read_all" ON "public"."user_points";
CREATE POLICY "points_read_all" ON "public"."user_points" AS PERMISSIVE FOR SELECT  USING (true);
DROP POLICY IF EXISTS "points_read_authenticated" ON "public"."user_points";
CREATE POLICY "points_read_authenticated" ON "public"."user_points" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "points_update_own" ON "public"."user_points";
CREATE POLICY "points_update_own" ON "public"."user_points" AS PERMISSIVE FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "user_points_auth_policy" ON "public"."user_points";
CREATE POLICY "user_points_auth_policy" ON "public"."user_points" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "presence_delete_own" ON "public"."user_presence";
CREATE POLICY "presence_delete_own" ON "public"."user_presence" AS PERMISSIVE FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "presence_insert_own" ON "public"."user_presence";
CREATE POLICY "presence_insert_own" ON "public"."user_presence" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "presence_own_write" ON "public"."user_presence";
CREATE POLICY "presence_own_write" ON "public"."user_presence" AS PERMISSIVE FOR ALL  USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
DROP POLICY IF EXISTS "presence_read_auth" ON "public"."user_presence";
CREATE POLICY "presence_read_auth" ON "public"."user_presence" AS PERMISSIVE FOR SELECT  USING ((auth.role() = 'authenticated'::text));
DROP POLICY IF EXISTS "presence_read_authenticated" ON "public"."user_presence";
CREATE POLICY "presence_read_authenticated" ON "public"."user_presence" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "presence_update_own" ON "public"."user_presence";
CREATE POLICY "presence_update_own" ON "public"."user_presence" AS PERMISSIVE FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "user_presence_user_policy" ON "public"."user_presence";
CREATE POLICY "user_presence_user_policy" ON "public"."user_presence" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "profiles_own" ON "public"."user_profiles";
CREATE POLICY "profiles_own" ON "public"."user_profiles" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "user_profiles_user_policy" ON "public"."user_profiles";
CREATE POLICY "user_profiles_user_policy" ON "public"."user_profiles" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "roles_read_own" ON "public"."user_roles";
CREATE POLICY "roles_read_own" ON "public"."user_roles" AS PERMISSIVE FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "settings_own" ON "public"."user_settings";
CREATE POLICY "settings_own" ON "public"."user_settings" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "user_settings_user_policy" ON "public"."user_settings";
CREATE POLICY "user_settings_user_policy" ON "public"."user_settings" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "stats_delete_own" ON "public"."user_stats_summary";
CREATE POLICY "stats_delete_own" ON "public"."user_stats_summary" AS PERMISSIVE FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "stats_insert_own" ON "public"."user_stats_summary";
CREATE POLICY "stats_insert_own" ON "public"."user_stats_summary" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "stats_own" ON "public"."user_stats_summary";
CREATE POLICY "stats_own" ON "public"."user_stats_summary" AS PERMISSIVE FOR ALL  USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "stats_read_all" ON "public"."user_stats_summary";
CREATE POLICY "stats_read_all" ON "public"."user_stats_summary" AS PERMISSIVE FOR SELECT  USING (true);
DROP POLICY IF EXISTS "stats_read_authenticated" ON "public"."user_stats_summary";
CREATE POLICY "stats_read_authenticated" ON "public"."user_stats_summary" AS PERMISSIVE FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "stats_update_own" ON "public"."user_stats_summary";
CREATE POLICY "stats_update_own" ON "public"."user_stats_summary" AS PERMISSIVE FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "user_stats_summary_user_policy" ON "public"."user_stats_summary";
CREATE POLICY "user_stats_summary_user_policy" ON "public"."user_stats_summary" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "user_tours_auth_policy" ON "public"."user_tours";
CREATE POLICY "user_tours_auth_policy" ON "public"."user_tours" AS PERMISSIVE FOR ALL  USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "user_tours_own" ON "public"."user_tours";
CREATE POLICY "user_tours_own" ON "public"."user_tours" AS PERMISSIVE FOR ALL TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "users_insert_own" ON "public"."users";
CREATE POLICY "users_insert_own" ON "public"."users" AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "users_insert_policy" ON "public"."users";
CREATE POLICY "users_insert_policy" ON "public"."users" AS PERMISSIVE FOR INSERT  WITH CHECK ((auth.uid() = id));
DROP POLICY IF EXISTS "users_own" ON "public"."users";
CREATE POLICY "users_own" ON "public"."users" AS PERMISSIVE FOR ALL  USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));
DROP POLICY IF EXISTS "users_read_member_profiles" ON "public"."users";
CREATE POLICY "users_read_member_profiles" ON "public"."users" AS PERMISSIVE FOR SELECT TO authenticated USING ((deleted_at IS NULL));
DROP POLICY IF EXISTS "users_read_public" ON "public"."users";
CREATE POLICY "users_read_public" ON "public"."users" AS PERMISSIVE FOR SELECT  USING (true);
DROP POLICY IF EXISTS "users_select_own" ON "public"."users";
CREATE POLICY "users_select_own" ON "public"."users" AS PERMISSIVE FOR SELECT TO authenticated USING ((id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "users_select_policy" ON "public"."users";
CREATE POLICY "users_select_policy" ON "public"."users" AS PERMISSIVE FOR SELECT  USING ((auth.uid() = id));
DROP POLICY IF EXISTS "users_update_own" ON "public"."users";
CREATE POLICY "users_update_own" ON "public"."users" AS PERMISSIVE FOR UPDATE TO authenticated USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));
DROP POLICY IF EXISTS "users_update_policy" ON "public"."users";
CREATE POLICY "users_update_policy" ON "public"."users" AS PERMISSIVE FOR UPDATE  USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
GRANT DELETE ON TABLE "public"."backup_manifests" TO anon;
GRANT INSERT ON TABLE "public"."backup_manifests" TO anon;
GRANT MAINTAIN ON TABLE "public"."backup_manifests" TO anon;
GRANT REFERENCES ON TABLE "public"."backup_manifests" TO anon;
GRANT SELECT ON TABLE "public"."backup_manifests" TO anon;
GRANT TRIGGER ON TABLE "public"."backup_manifests" TO anon;
GRANT TRUNCATE ON TABLE "public"."backup_manifests" TO anon;
GRANT UPDATE ON TABLE "public"."backup_manifests" TO anon;
GRANT DELETE ON TABLE "public"."backup_manifests" TO authenticated;
GRANT INSERT ON TABLE "public"."backup_manifests" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."backup_manifests" TO authenticated;
GRANT REFERENCES ON TABLE "public"."backup_manifests" TO authenticated;
GRANT SELECT ON TABLE "public"."backup_manifests" TO authenticated;
GRANT TRIGGER ON TABLE "public"."backup_manifests" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."backup_manifests" TO authenticated;
GRANT UPDATE ON TABLE "public"."backup_manifests" TO authenticated;
GRANT DELETE ON TABLE "public"."backup_manifests" TO service_role;
GRANT INSERT ON TABLE "public"."backup_manifests" TO service_role;
GRANT MAINTAIN ON TABLE "public"."backup_manifests" TO service_role;
GRANT REFERENCES ON TABLE "public"."backup_manifests" TO service_role;
GRANT SELECT ON TABLE "public"."backup_manifests" TO service_role;
GRANT TRIGGER ON TABLE "public"."backup_manifests" TO service_role;
GRANT TRUNCATE ON TABLE "public"."backup_manifests" TO service_role;
GRANT UPDATE ON TABLE "public"."backup_manifests" TO service_role;
GRANT DELETE ON TABLE "public"."buddy_invites" TO anon;
GRANT INSERT ON TABLE "public"."buddy_invites" TO anon;
GRANT MAINTAIN ON TABLE "public"."buddy_invites" TO anon;
GRANT REFERENCES ON TABLE "public"."buddy_invites" TO anon;
GRANT SELECT ON TABLE "public"."buddy_invites" TO anon;
GRANT TRIGGER ON TABLE "public"."buddy_invites" TO anon;
GRANT TRUNCATE ON TABLE "public"."buddy_invites" TO anon;
GRANT UPDATE ON TABLE "public"."buddy_invites" TO anon;
GRANT DELETE ON TABLE "public"."buddy_invites" TO authenticated;
GRANT INSERT ON TABLE "public"."buddy_invites" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."buddy_invites" TO authenticated;
GRANT REFERENCES ON TABLE "public"."buddy_invites" TO authenticated;
GRANT SELECT ON TABLE "public"."buddy_invites" TO authenticated;
GRANT TRIGGER ON TABLE "public"."buddy_invites" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."buddy_invites" TO authenticated;
GRANT UPDATE ON TABLE "public"."buddy_invites" TO authenticated;
GRANT DELETE ON TABLE "public"."buddy_invites" TO service_role;
GRANT INSERT ON TABLE "public"."buddy_invites" TO service_role;
GRANT MAINTAIN ON TABLE "public"."buddy_invites" TO service_role;
GRANT REFERENCES ON TABLE "public"."buddy_invites" TO service_role;
GRANT SELECT ON TABLE "public"."buddy_invites" TO service_role;
GRANT TRIGGER ON TABLE "public"."buddy_invites" TO service_role;
GRANT TRUNCATE ON TABLE "public"."buddy_invites" TO service_role;
GRANT UPDATE ON TABLE "public"."buddy_invites" TO service_role;
GRANT DELETE ON TABLE "public"."community_device_tokens" TO anon;
GRANT INSERT ON TABLE "public"."community_device_tokens" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_device_tokens" TO anon;
GRANT REFERENCES ON TABLE "public"."community_device_tokens" TO anon;
GRANT SELECT ON TABLE "public"."community_device_tokens" TO anon;
GRANT TRIGGER ON TABLE "public"."community_device_tokens" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_device_tokens" TO anon;
GRANT UPDATE ON TABLE "public"."community_device_tokens" TO anon;
GRANT DELETE ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT INSERT ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT SELECT ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_device_tokens" TO authenticated;
GRANT DELETE ON TABLE "public"."community_device_tokens" TO service_role;
GRANT INSERT ON TABLE "public"."community_device_tokens" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_device_tokens" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_device_tokens" TO service_role;
GRANT SELECT ON TABLE "public"."community_device_tokens" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_device_tokens" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_device_tokens" TO service_role;
GRANT UPDATE ON TABLE "public"."community_device_tokens" TO service_role;
GRANT DELETE ON TABLE "public"."community_enrollments" TO anon;
GRANT INSERT ON TABLE "public"."community_enrollments" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_enrollments" TO anon;
GRANT REFERENCES ON TABLE "public"."community_enrollments" TO anon;
GRANT SELECT ON TABLE "public"."community_enrollments" TO anon;
GRANT TRIGGER ON TABLE "public"."community_enrollments" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_enrollments" TO anon;
GRANT UPDATE ON TABLE "public"."community_enrollments" TO anon;
GRANT DELETE ON TABLE "public"."community_enrollments" TO authenticated;
GRANT INSERT ON TABLE "public"."community_enrollments" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_enrollments" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_enrollments" TO authenticated;
GRANT SELECT ON TABLE "public"."community_enrollments" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_enrollments" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_enrollments" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_enrollments" TO authenticated;
GRANT DELETE ON TABLE "public"."community_enrollments" TO service_role;
GRANT INSERT ON TABLE "public"."community_enrollments" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_enrollments" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_enrollments" TO service_role;
GRANT SELECT ON TABLE "public"."community_enrollments" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_enrollments" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_enrollments" TO service_role;
GRANT UPDATE ON TABLE "public"."community_enrollments" TO service_role;
GRANT DELETE ON TABLE "public"."community_event_attendees" TO anon;
GRANT INSERT ON TABLE "public"."community_event_attendees" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_event_attendees" TO anon;
GRANT REFERENCES ON TABLE "public"."community_event_attendees" TO anon;
GRANT SELECT ON TABLE "public"."community_event_attendees" TO anon;
GRANT TRIGGER ON TABLE "public"."community_event_attendees" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_event_attendees" TO anon;
GRANT UPDATE ON TABLE "public"."community_event_attendees" TO anon;
GRANT DELETE ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT INSERT ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT SELECT ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT DELETE ON TABLE "public"."community_event_attendees" TO service_role;
GRANT INSERT ON TABLE "public"."community_event_attendees" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_event_attendees" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_event_attendees" TO service_role;
GRANT SELECT ON TABLE "public"."community_event_attendees" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_event_attendees" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_event_attendees" TO service_role;
GRANT UPDATE ON TABLE "public"."community_event_attendees" TO service_role;
GRANT DELETE ON TABLE "public"."community_events" TO anon;
GRANT INSERT ON TABLE "public"."community_events" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_events" TO anon;
GRANT REFERENCES ON TABLE "public"."community_events" TO anon;
GRANT SELECT ON TABLE "public"."community_events" TO anon;
GRANT TRIGGER ON TABLE "public"."community_events" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_events" TO anon;
GRANT UPDATE ON TABLE "public"."community_events" TO anon;
GRANT DELETE ON TABLE "public"."community_events" TO authenticated;
GRANT INSERT ON TABLE "public"."community_events" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_events" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_events" TO authenticated;
GRANT SELECT ON TABLE "public"."community_events" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_events" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_events" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_events" TO authenticated;
GRANT DELETE ON TABLE "public"."community_events" TO service_role;
GRANT INSERT ON TABLE "public"."community_events" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_events" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_events" TO service_role;
GRANT SELECT ON TABLE "public"."community_events" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_events" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_events" TO service_role;
GRANT UPDATE ON TABLE "public"."community_events" TO service_role;
GRANT DELETE ON TABLE "public"."community_friends" TO anon;
GRANT INSERT ON TABLE "public"."community_friends" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_friends" TO anon;
GRANT REFERENCES ON TABLE "public"."community_friends" TO anon;
GRANT SELECT ON TABLE "public"."community_friends" TO anon;
GRANT TRIGGER ON TABLE "public"."community_friends" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_friends" TO anon;
GRANT UPDATE ON TABLE "public"."community_friends" TO anon;
GRANT DELETE ON TABLE "public"."community_friends" TO authenticated;
GRANT INSERT ON TABLE "public"."community_friends" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_friends" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_friends" TO authenticated;
GRANT SELECT ON TABLE "public"."community_friends" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_friends" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_friends" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_friends" TO authenticated;
GRANT DELETE ON TABLE "public"."community_friends" TO service_role;
GRANT INSERT ON TABLE "public"."community_friends" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_friends" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_friends" TO service_role;
GRANT SELECT ON TABLE "public"."community_friends" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_friends" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_friends" TO service_role;
GRANT UPDATE ON TABLE "public"."community_friends" TO service_role;
GRANT DELETE ON TABLE "public"."community_join_requests" TO anon;
GRANT INSERT ON TABLE "public"."community_join_requests" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_join_requests" TO anon;
GRANT REFERENCES ON TABLE "public"."community_join_requests" TO anon;
GRANT SELECT ON TABLE "public"."community_join_requests" TO anon;
GRANT TRIGGER ON TABLE "public"."community_join_requests" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_join_requests" TO anon;
GRANT UPDATE ON TABLE "public"."community_join_requests" TO anon;
GRANT DELETE ON TABLE "public"."community_join_requests" TO authenticated;
GRANT INSERT ON TABLE "public"."community_join_requests" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_join_requests" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_join_requests" TO authenticated;
GRANT SELECT ON TABLE "public"."community_join_requests" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_join_requests" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_join_requests" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_join_requests" TO authenticated;
GRANT DELETE ON TABLE "public"."community_join_requests" TO service_role;
GRANT INSERT ON TABLE "public"."community_join_requests" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_join_requests" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_join_requests" TO service_role;
GRANT SELECT ON TABLE "public"."community_join_requests" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_join_requests" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_join_requests" TO service_role;
GRANT UPDATE ON TABLE "public"."community_join_requests" TO service_role;
GRANT DELETE ON TABLE "public"."community_reports" TO anon;
GRANT INSERT ON TABLE "public"."community_reports" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_reports" TO anon;
GRANT REFERENCES ON TABLE "public"."community_reports" TO anon;
GRANT SELECT ON TABLE "public"."community_reports" TO anon;
GRANT TRIGGER ON TABLE "public"."community_reports" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_reports" TO anon;
GRANT UPDATE ON TABLE "public"."community_reports" TO anon;
GRANT DELETE ON TABLE "public"."community_reports" TO authenticated;
GRANT INSERT ON TABLE "public"."community_reports" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_reports" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_reports" TO authenticated;
GRANT SELECT ON TABLE "public"."community_reports" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_reports" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_reports" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_reports" TO authenticated;
GRANT DELETE ON TABLE "public"."community_reports" TO service_role;
GRANT INSERT ON TABLE "public"."community_reports" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_reports" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_reports" TO service_role;
GRANT SELECT ON TABLE "public"."community_reports" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_reports" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_reports" TO service_role;
GRANT UPDATE ON TABLE "public"."community_reports" TO service_role;
GRANT DELETE ON TABLE "public"."community_start_alerts" TO anon;
GRANT INSERT ON TABLE "public"."community_start_alerts" TO anon;
GRANT MAINTAIN ON TABLE "public"."community_start_alerts" TO anon;
GRANT REFERENCES ON TABLE "public"."community_start_alerts" TO anon;
GRANT SELECT ON TABLE "public"."community_start_alerts" TO anon;
GRANT TRIGGER ON TABLE "public"."community_start_alerts" TO anon;
GRANT TRUNCATE ON TABLE "public"."community_start_alerts" TO anon;
GRANT UPDATE ON TABLE "public"."community_start_alerts" TO anon;
GRANT DELETE ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT INSERT ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT REFERENCES ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT SELECT ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT TRIGGER ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT UPDATE ON TABLE "public"."community_start_alerts" TO authenticated;
GRANT DELETE ON TABLE "public"."community_start_alerts" TO service_role;
GRANT INSERT ON TABLE "public"."community_start_alerts" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_start_alerts" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_start_alerts" TO service_role;
GRANT SELECT ON TABLE "public"."community_start_alerts" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_start_alerts" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_start_alerts" TO service_role;
GRANT UPDATE ON TABLE "public"."community_start_alerts" TO service_role;
GRANT DELETE ON TABLE "public"."daily_logs" TO anon;
GRANT INSERT ON TABLE "public"."daily_logs" TO anon;
GRANT MAINTAIN ON TABLE "public"."daily_logs" TO anon;
GRANT REFERENCES ON TABLE "public"."daily_logs" TO anon;
GRANT SELECT ON TABLE "public"."daily_logs" TO anon;
GRANT TRIGGER ON TABLE "public"."daily_logs" TO anon;
GRANT TRUNCATE ON TABLE "public"."daily_logs" TO anon;
GRANT UPDATE ON TABLE "public"."daily_logs" TO anon;
GRANT DELETE ON TABLE "public"."daily_logs" TO authenticated;
GRANT INSERT ON TABLE "public"."daily_logs" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."daily_logs" TO authenticated;
GRANT REFERENCES ON TABLE "public"."daily_logs" TO authenticated;
GRANT SELECT ON TABLE "public"."daily_logs" TO authenticated;
GRANT TRIGGER ON TABLE "public"."daily_logs" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."daily_logs" TO authenticated;
GRANT UPDATE ON TABLE "public"."daily_logs" TO authenticated;
GRANT DELETE ON TABLE "public"."daily_logs" TO service_role;
GRANT INSERT ON TABLE "public"."daily_logs" TO service_role;
GRANT MAINTAIN ON TABLE "public"."daily_logs" TO service_role;
GRANT REFERENCES ON TABLE "public"."daily_logs" TO service_role;
GRANT SELECT ON TABLE "public"."daily_logs" TO service_role;
GRANT TRIGGER ON TABLE "public"."daily_logs" TO service_role;
GRANT TRUNCATE ON TABLE "public"."daily_logs" TO service_role;
GRANT UPDATE ON TABLE "public"."daily_logs" TO service_role;
GRANT DELETE ON TABLE "public"."daily_user_stats" TO anon;
GRANT INSERT ON TABLE "public"."daily_user_stats" TO anon;
GRANT MAINTAIN ON TABLE "public"."daily_user_stats" TO anon;
GRANT REFERENCES ON TABLE "public"."daily_user_stats" TO anon;
GRANT SELECT ON TABLE "public"."daily_user_stats" TO anon;
GRANT TRIGGER ON TABLE "public"."daily_user_stats" TO anon;
GRANT TRUNCATE ON TABLE "public"."daily_user_stats" TO anon;
GRANT UPDATE ON TABLE "public"."daily_user_stats" TO anon;
GRANT DELETE ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT INSERT ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT REFERENCES ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT SELECT ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT TRIGGER ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT UPDATE ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT DELETE ON TABLE "public"."daily_user_stats" TO service_role;
GRANT INSERT ON TABLE "public"."daily_user_stats" TO service_role;
GRANT MAINTAIN ON TABLE "public"."daily_user_stats" TO service_role;
GRANT REFERENCES ON TABLE "public"."daily_user_stats" TO service_role;
GRANT SELECT ON TABLE "public"."daily_user_stats" TO service_role;
GRANT TRIGGER ON TABLE "public"."daily_user_stats" TO service_role;
GRANT TRUNCATE ON TABLE "public"."daily_user_stats" TO service_role;
GRANT UPDATE ON TABLE "public"."daily_user_stats" TO service_role;
GRANT DELETE ON TABLE "public"."exams" TO anon;
GRANT INSERT ON TABLE "public"."exams" TO anon;
GRANT MAINTAIN ON TABLE "public"."exams" TO anon;
GRANT REFERENCES ON TABLE "public"."exams" TO anon;
GRANT SELECT ON TABLE "public"."exams" TO anon;
GRANT TRIGGER ON TABLE "public"."exams" TO anon;
GRANT TRUNCATE ON TABLE "public"."exams" TO anon;
GRANT UPDATE ON TABLE "public"."exams" TO anon;
GRANT DELETE ON TABLE "public"."exams" TO authenticated;
GRANT INSERT ON TABLE "public"."exams" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."exams" TO authenticated;
GRANT REFERENCES ON TABLE "public"."exams" TO authenticated;
GRANT SELECT ON TABLE "public"."exams" TO authenticated;
GRANT TRIGGER ON TABLE "public"."exams" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."exams" TO authenticated;
GRANT UPDATE ON TABLE "public"."exams" TO authenticated;
GRANT DELETE ON TABLE "public"."exams" TO service_role;
GRANT INSERT ON TABLE "public"."exams" TO service_role;
GRANT MAINTAIN ON TABLE "public"."exams" TO service_role;
GRANT REFERENCES ON TABLE "public"."exams" TO service_role;
GRANT SELECT ON TABLE "public"."exams" TO service_role;
GRANT TRIGGER ON TABLE "public"."exams" TO service_role;
GRANT TRUNCATE ON TABLE "public"."exams" TO service_role;
GRANT UPDATE ON TABLE "public"."exams" TO service_role;
GRANT DELETE ON TABLE "public"."focus_sessions" TO anon;
GRANT INSERT ON TABLE "public"."focus_sessions" TO anon;
GRANT MAINTAIN ON TABLE "public"."focus_sessions" TO anon;
GRANT REFERENCES ON TABLE "public"."focus_sessions" TO anon;
GRANT SELECT ON TABLE "public"."focus_sessions" TO anon;
GRANT TRIGGER ON TABLE "public"."focus_sessions" TO anon;
GRANT TRUNCATE ON TABLE "public"."focus_sessions" TO anon;
GRANT UPDATE ON TABLE "public"."focus_sessions" TO anon;
GRANT DELETE ON TABLE "public"."focus_sessions" TO authenticated;
GRANT INSERT ON TABLE "public"."focus_sessions" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."focus_sessions" TO authenticated;
GRANT REFERENCES ON TABLE "public"."focus_sessions" TO authenticated;
GRANT SELECT ON TABLE "public"."focus_sessions" TO authenticated;
GRANT TRIGGER ON TABLE "public"."focus_sessions" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."focus_sessions" TO authenticated;
GRANT UPDATE ON TABLE "public"."focus_sessions" TO authenticated;
GRANT DELETE ON TABLE "public"."focus_sessions" TO service_role;
GRANT INSERT ON TABLE "public"."focus_sessions" TO service_role;
GRANT MAINTAIN ON TABLE "public"."focus_sessions" TO service_role;
GRANT REFERENCES ON TABLE "public"."focus_sessions" TO service_role;
GRANT SELECT ON TABLE "public"."focus_sessions" TO service_role;
GRANT TRIGGER ON TABLE "public"."focus_sessions" TO service_role;
GRANT TRUNCATE ON TABLE "public"."focus_sessions" TO service_role;
GRANT UPDATE ON TABLE "public"."focus_sessions" TO service_role;
GRANT DELETE ON TABLE "public"."group_announcements" TO anon;
GRANT INSERT ON TABLE "public"."group_announcements" TO anon;
GRANT MAINTAIN ON TABLE "public"."group_announcements" TO anon;
GRANT REFERENCES ON TABLE "public"."group_announcements" TO anon;
GRANT SELECT ON TABLE "public"."group_announcements" TO anon;
GRANT TRIGGER ON TABLE "public"."group_announcements" TO anon;
GRANT TRUNCATE ON TABLE "public"."group_announcements" TO anon;
GRANT UPDATE ON TABLE "public"."group_announcements" TO anon;
GRANT DELETE ON TABLE "public"."group_announcements" TO authenticated;
GRANT INSERT ON TABLE "public"."group_announcements" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."group_announcements" TO authenticated;
GRANT REFERENCES ON TABLE "public"."group_announcements" TO authenticated;
GRANT SELECT ON TABLE "public"."group_announcements" TO authenticated;
GRANT TRIGGER ON TABLE "public"."group_announcements" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."group_announcements" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_announcements" TO authenticated;
GRANT DELETE ON TABLE "public"."group_announcements" TO service_role;
GRANT INSERT ON TABLE "public"."group_announcements" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_announcements" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_announcements" TO service_role;
GRANT SELECT ON TABLE "public"."group_announcements" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_announcements" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_announcements" TO service_role;
GRANT UPDATE ON TABLE "public"."group_announcements" TO service_role;
GRANT DELETE ON TABLE "public"."group_challenge_participants" TO anon;
GRANT INSERT ON TABLE "public"."group_challenge_participants" TO anon;
GRANT MAINTAIN ON TABLE "public"."group_challenge_participants" TO anon;
GRANT REFERENCES ON TABLE "public"."group_challenge_participants" TO anon;
GRANT SELECT ON TABLE "public"."group_challenge_participants" TO anon;
GRANT TRIGGER ON TABLE "public"."group_challenge_participants" TO anon;
GRANT TRUNCATE ON TABLE "public"."group_challenge_participants" TO anon;
GRANT UPDATE ON TABLE "public"."group_challenge_participants" TO anon;
GRANT DELETE ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT INSERT ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT REFERENCES ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT SELECT ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT TRIGGER ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT DELETE ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT INSERT ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT SELECT ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT UPDATE ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT DELETE ON TABLE "public"."group_challenges" TO anon;
GRANT INSERT ON TABLE "public"."group_challenges" TO anon;
GRANT MAINTAIN ON TABLE "public"."group_challenges" TO anon;
GRANT REFERENCES ON TABLE "public"."group_challenges" TO anon;
GRANT SELECT ON TABLE "public"."group_challenges" TO anon;
GRANT TRIGGER ON TABLE "public"."group_challenges" TO anon;
GRANT TRUNCATE ON TABLE "public"."group_challenges" TO anon;
GRANT UPDATE ON TABLE "public"."group_challenges" TO anon;
GRANT DELETE ON TABLE "public"."group_challenges" TO authenticated;
GRANT INSERT ON TABLE "public"."group_challenges" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."group_challenges" TO authenticated;
GRANT REFERENCES ON TABLE "public"."group_challenges" TO authenticated;
GRANT SELECT ON TABLE "public"."group_challenges" TO authenticated;
GRANT TRIGGER ON TABLE "public"."group_challenges" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."group_challenges" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_challenges" TO authenticated;
GRANT DELETE ON TABLE "public"."group_challenges" TO service_role;
GRANT INSERT ON TABLE "public"."group_challenges" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_challenges" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_challenges" TO service_role;
GRANT SELECT ON TABLE "public"."group_challenges" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_challenges" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_challenges" TO service_role;
GRANT UPDATE ON TABLE "public"."group_challenges" TO service_role;
GRANT DELETE ON TABLE "public"."group_chat_messages" TO anon;
GRANT INSERT ON TABLE "public"."group_chat_messages" TO anon;
GRANT MAINTAIN ON TABLE "public"."group_chat_messages" TO anon;
GRANT REFERENCES ON TABLE "public"."group_chat_messages" TO anon;
GRANT SELECT ON TABLE "public"."group_chat_messages" TO anon;
GRANT TRIGGER ON TABLE "public"."group_chat_messages" TO anon;
GRANT TRUNCATE ON TABLE "public"."group_chat_messages" TO anon;
GRANT UPDATE ON TABLE "public"."group_chat_messages" TO anon;
GRANT DELETE ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT INSERT ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT REFERENCES ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT SELECT ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT TRIGGER ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT DELETE ON TABLE "public"."group_chat_messages" TO service_role;
GRANT INSERT ON TABLE "public"."group_chat_messages" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_chat_messages" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_chat_messages" TO service_role;
GRANT SELECT ON TABLE "public"."group_chat_messages" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_chat_messages" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_chat_messages" TO service_role;
GRANT UPDATE ON TABLE "public"."group_chat_messages" TO service_role;
GRANT DELETE ON TABLE "public"."group_invites" TO anon;
GRANT INSERT ON TABLE "public"."group_invites" TO anon;
GRANT MAINTAIN ON TABLE "public"."group_invites" TO anon;
GRANT REFERENCES ON TABLE "public"."group_invites" TO anon;
GRANT SELECT ON TABLE "public"."group_invites" TO anon;
GRANT TRIGGER ON TABLE "public"."group_invites" TO anon;
GRANT TRUNCATE ON TABLE "public"."group_invites" TO anon;
GRANT UPDATE ON TABLE "public"."group_invites" TO anon;
GRANT DELETE ON TABLE "public"."group_invites" TO authenticated;
GRANT INSERT ON TABLE "public"."group_invites" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."group_invites" TO authenticated;
GRANT REFERENCES ON TABLE "public"."group_invites" TO authenticated;
GRANT SELECT ON TABLE "public"."group_invites" TO authenticated;
GRANT TRIGGER ON TABLE "public"."group_invites" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."group_invites" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_invites" TO authenticated;
GRANT DELETE ON TABLE "public"."group_invites" TO service_role;
GRANT INSERT ON TABLE "public"."group_invites" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_invites" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_invites" TO service_role;
GRANT SELECT ON TABLE "public"."group_invites" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_invites" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_invites" TO service_role;
GRANT UPDATE ON TABLE "public"."group_invites" TO service_role;
GRANT DELETE ON TABLE "public"."group_members" TO anon;
GRANT INSERT ON TABLE "public"."group_members" TO anon;
GRANT MAINTAIN ON TABLE "public"."group_members" TO anon;
GRANT REFERENCES ON TABLE "public"."group_members" TO anon;
GRANT SELECT ON TABLE "public"."group_members" TO anon;
GRANT TRIGGER ON TABLE "public"."group_members" TO anon;
GRANT TRUNCATE ON TABLE "public"."group_members" TO anon;
GRANT UPDATE ON TABLE "public"."group_members" TO anon;
GRANT DELETE ON TABLE "public"."group_members" TO authenticated;
GRANT INSERT ON TABLE "public"."group_members" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."group_members" TO authenticated;
GRANT REFERENCES ON TABLE "public"."group_members" TO authenticated;
GRANT SELECT ON TABLE "public"."group_members" TO authenticated;
GRANT TRIGGER ON TABLE "public"."group_members" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."group_members" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_members" TO authenticated;
GRANT DELETE ON TABLE "public"."group_members" TO service_role;
GRANT INSERT ON TABLE "public"."group_members" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_members" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_members" TO service_role;
GRANT SELECT ON TABLE "public"."group_members" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_members" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_members" TO service_role;
GRANT UPDATE ON TABLE "public"."group_members" TO service_role;
GRANT DELETE ON TABLE "public"."group_milestones" TO anon;
GRANT INSERT ON TABLE "public"."group_milestones" TO anon;
GRANT MAINTAIN ON TABLE "public"."group_milestones" TO anon;
GRANT REFERENCES ON TABLE "public"."group_milestones" TO anon;
GRANT SELECT ON TABLE "public"."group_milestones" TO anon;
GRANT TRIGGER ON TABLE "public"."group_milestones" TO anon;
GRANT TRUNCATE ON TABLE "public"."group_milestones" TO anon;
GRANT UPDATE ON TABLE "public"."group_milestones" TO anon;
GRANT DELETE ON TABLE "public"."group_milestones" TO authenticated;
GRANT INSERT ON TABLE "public"."group_milestones" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."group_milestones" TO authenticated;
GRANT REFERENCES ON TABLE "public"."group_milestones" TO authenticated;
GRANT SELECT ON TABLE "public"."group_milestones" TO authenticated;
GRANT TRIGGER ON TABLE "public"."group_milestones" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."group_milestones" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_milestones" TO authenticated;
GRANT DELETE ON TABLE "public"."group_milestones" TO service_role;
GRANT INSERT ON TABLE "public"."group_milestones" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_milestones" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_milestones" TO service_role;
GRANT SELECT ON TABLE "public"."group_milestones" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_milestones" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_milestones" TO service_role;
GRANT UPDATE ON TABLE "public"."group_milestones" TO service_role;
GRANT DELETE ON TABLE "public"."groups" TO anon;
GRANT INSERT ON TABLE "public"."groups" TO anon;
GRANT MAINTAIN ON TABLE "public"."groups" TO anon;
GRANT REFERENCES ON TABLE "public"."groups" TO anon;
GRANT SELECT ON TABLE "public"."groups" TO anon;
GRANT TRIGGER ON TABLE "public"."groups" TO anon;
GRANT TRUNCATE ON TABLE "public"."groups" TO anon;
GRANT UPDATE ON TABLE "public"."groups" TO anon;
GRANT DELETE ON TABLE "public"."groups" TO authenticated;
GRANT INSERT ON TABLE "public"."groups" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."groups" TO authenticated;
GRANT REFERENCES ON TABLE "public"."groups" TO authenticated;
GRANT SELECT ON TABLE "public"."groups" TO authenticated;
GRANT TRIGGER ON TABLE "public"."groups" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."groups" TO authenticated;
GRANT UPDATE ON TABLE "public"."groups" TO authenticated;
GRANT DELETE ON TABLE "public"."groups" TO service_role;
GRANT INSERT ON TABLE "public"."groups" TO service_role;
GRANT MAINTAIN ON TABLE "public"."groups" TO service_role;
GRANT REFERENCES ON TABLE "public"."groups" TO service_role;
GRANT SELECT ON TABLE "public"."groups" TO service_role;
GRANT TRIGGER ON TABLE "public"."groups" TO service_role;
GRANT TRUNCATE ON TABLE "public"."groups" TO service_role;
GRANT UPDATE ON TABLE "public"."groups" TO service_role;
GRANT DELETE ON TABLE "public"."habits" TO anon;
GRANT INSERT ON TABLE "public"."habits" TO anon;
GRANT MAINTAIN ON TABLE "public"."habits" TO anon;
GRANT REFERENCES ON TABLE "public"."habits" TO anon;
GRANT SELECT ON TABLE "public"."habits" TO anon;
GRANT TRIGGER ON TABLE "public"."habits" TO anon;
GRANT TRUNCATE ON TABLE "public"."habits" TO anon;
GRANT UPDATE ON TABLE "public"."habits" TO anon;
GRANT DELETE ON TABLE "public"."habits" TO authenticated;
GRANT INSERT ON TABLE "public"."habits" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."habits" TO authenticated;
GRANT REFERENCES ON TABLE "public"."habits" TO authenticated;
GRANT SELECT ON TABLE "public"."habits" TO authenticated;
GRANT TRIGGER ON TABLE "public"."habits" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."habits" TO authenticated;
GRANT UPDATE ON TABLE "public"."habits" TO authenticated;
GRANT DELETE ON TABLE "public"."habits" TO service_role;
GRANT INSERT ON TABLE "public"."habits" TO service_role;
GRANT MAINTAIN ON TABLE "public"."habits" TO service_role;
GRANT REFERENCES ON TABLE "public"."habits" TO service_role;
GRANT SELECT ON TABLE "public"."habits" TO service_role;
GRANT TRIGGER ON TABLE "public"."habits" TO service_role;
GRANT TRUNCATE ON TABLE "public"."habits" TO service_role;
GRANT UPDATE ON TABLE "public"."habits" TO service_role;
GRANT DELETE ON TABLE "public"."mock_tests" TO anon;
GRANT INSERT ON TABLE "public"."mock_tests" TO anon;
GRANT MAINTAIN ON TABLE "public"."mock_tests" TO anon;
GRANT REFERENCES ON TABLE "public"."mock_tests" TO anon;
GRANT SELECT ON TABLE "public"."mock_tests" TO anon;
GRANT TRIGGER ON TABLE "public"."mock_tests" TO anon;
GRANT TRUNCATE ON TABLE "public"."mock_tests" TO anon;
GRANT UPDATE ON TABLE "public"."mock_tests" TO anon;
GRANT DELETE ON TABLE "public"."mock_tests" TO authenticated;
GRANT INSERT ON TABLE "public"."mock_tests" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."mock_tests" TO authenticated;
GRANT REFERENCES ON TABLE "public"."mock_tests" TO authenticated;
GRANT SELECT ON TABLE "public"."mock_tests" TO authenticated;
GRANT TRIGGER ON TABLE "public"."mock_tests" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."mock_tests" TO authenticated;
GRANT UPDATE ON TABLE "public"."mock_tests" TO authenticated;
GRANT DELETE ON TABLE "public"."mock_tests" TO service_role;
GRANT INSERT ON TABLE "public"."mock_tests" TO service_role;
GRANT MAINTAIN ON TABLE "public"."mock_tests" TO service_role;
GRANT REFERENCES ON TABLE "public"."mock_tests" TO service_role;
GRANT SELECT ON TABLE "public"."mock_tests" TO service_role;
GRANT TRIGGER ON TABLE "public"."mock_tests" TO service_role;
GRANT TRUNCATE ON TABLE "public"."mock_tests" TO service_role;
GRANT UPDATE ON TABLE "public"."mock_tests" TO service_role;
GRANT DELETE ON TABLE "public"."notifications" TO anon;
GRANT INSERT ON TABLE "public"."notifications" TO anon;
GRANT MAINTAIN ON TABLE "public"."notifications" TO anon;
GRANT REFERENCES ON TABLE "public"."notifications" TO anon;
GRANT SELECT ON TABLE "public"."notifications" TO anon;
GRANT TRIGGER ON TABLE "public"."notifications" TO anon;
GRANT TRUNCATE ON TABLE "public"."notifications" TO anon;
GRANT UPDATE ON TABLE "public"."notifications" TO anon;
GRANT DELETE ON TABLE "public"."notifications" TO authenticated;
GRANT INSERT ON TABLE "public"."notifications" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."notifications" TO authenticated;
GRANT REFERENCES ON TABLE "public"."notifications" TO authenticated;
GRANT SELECT ON TABLE "public"."notifications" TO authenticated;
GRANT TRIGGER ON TABLE "public"."notifications" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."notifications" TO authenticated;
GRANT UPDATE ON TABLE "public"."notifications" TO authenticated;
GRANT DELETE ON TABLE "public"."notifications" TO service_role;
GRANT INSERT ON TABLE "public"."notifications" TO service_role;
GRANT MAINTAIN ON TABLE "public"."notifications" TO service_role;
GRANT REFERENCES ON TABLE "public"."notifications" TO service_role;
GRANT SELECT ON TABLE "public"."notifications" TO service_role;
GRANT TRIGGER ON TABLE "public"."notifications" TO service_role;
GRANT TRUNCATE ON TABLE "public"."notifications" TO service_role;
GRANT UPDATE ON TABLE "public"."notifications" TO service_role;
GRANT DELETE ON TABLE "public"."store_items" TO anon;
GRANT INSERT ON TABLE "public"."store_items" TO anon;
GRANT MAINTAIN ON TABLE "public"."store_items" TO anon;
GRANT REFERENCES ON TABLE "public"."store_items" TO anon;
GRANT SELECT ON TABLE "public"."store_items" TO anon;
GRANT TRIGGER ON TABLE "public"."store_items" TO anon;
GRANT TRUNCATE ON TABLE "public"."store_items" TO anon;
GRANT UPDATE ON TABLE "public"."store_items" TO anon;
GRANT DELETE ON TABLE "public"."store_items" TO authenticated;
GRANT INSERT ON TABLE "public"."store_items" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."store_items" TO authenticated;
GRANT REFERENCES ON TABLE "public"."store_items" TO authenticated;
GRANT SELECT ON TABLE "public"."store_items" TO authenticated;
GRANT TRIGGER ON TABLE "public"."store_items" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."store_items" TO authenticated;
GRANT UPDATE ON TABLE "public"."store_items" TO authenticated;
GRANT DELETE ON TABLE "public"."store_items" TO service_role;
GRANT INSERT ON TABLE "public"."store_items" TO service_role;
GRANT MAINTAIN ON TABLE "public"."store_items" TO service_role;
GRANT REFERENCES ON TABLE "public"."store_items" TO service_role;
GRANT SELECT ON TABLE "public"."store_items" TO service_role;
GRANT TRIGGER ON TABLE "public"."store_items" TO service_role;
GRANT TRUNCATE ON TABLE "public"."store_items" TO service_role;
GRANT UPDATE ON TABLE "public"."store_items" TO service_role;
GRANT DELETE ON TABLE "public"."study_sessions_log" TO anon;
GRANT INSERT ON TABLE "public"."study_sessions_log" TO anon;
GRANT MAINTAIN ON TABLE "public"."study_sessions_log" TO anon;
GRANT REFERENCES ON TABLE "public"."study_sessions_log" TO anon;
GRANT SELECT ON TABLE "public"."study_sessions_log" TO anon;
GRANT TRIGGER ON TABLE "public"."study_sessions_log" TO anon;
GRANT TRUNCATE ON TABLE "public"."study_sessions_log" TO anon;
GRANT UPDATE ON TABLE "public"."study_sessions_log" TO anon;
GRANT DELETE ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT INSERT ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT REFERENCES ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT SELECT ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT TRIGGER ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT UPDATE ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT DELETE ON TABLE "public"."study_sessions_log" TO service_role;
GRANT INSERT ON TABLE "public"."study_sessions_log" TO service_role;
GRANT MAINTAIN ON TABLE "public"."study_sessions_log" TO service_role;
GRANT REFERENCES ON TABLE "public"."study_sessions_log" TO service_role;
GRANT SELECT ON TABLE "public"."study_sessions_log" TO service_role;
GRANT TRIGGER ON TABLE "public"."study_sessions_log" TO service_role;
GRANT TRUNCATE ON TABLE "public"."study_sessions_log" TO service_role;
GRANT UPDATE ON TABLE "public"."study_sessions_log" TO service_role;
GRANT DELETE ON TABLE "public"."subjects" TO anon;
GRANT INSERT ON TABLE "public"."subjects" TO anon;
GRANT MAINTAIN ON TABLE "public"."subjects" TO anon;
GRANT REFERENCES ON TABLE "public"."subjects" TO anon;
GRANT SELECT ON TABLE "public"."subjects" TO anon;
GRANT TRIGGER ON TABLE "public"."subjects" TO anon;
GRANT TRUNCATE ON TABLE "public"."subjects" TO anon;
GRANT UPDATE ON TABLE "public"."subjects" TO anon;
GRANT DELETE ON TABLE "public"."subjects" TO authenticated;
GRANT INSERT ON TABLE "public"."subjects" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."subjects" TO authenticated;
GRANT REFERENCES ON TABLE "public"."subjects" TO authenticated;
GRANT SELECT ON TABLE "public"."subjects" TO authenticated;
GRANT TRIGGER ON TABLE "public"."subjects" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."subjects" TO authenticated;
GRANT UPDATE ON TABLE "public"."subjects" TO authenticated;
GRANT DELETE ON TABLE "public"."subjects" TO service_role;
GRANT INSERT ON TABLE "public"."subjects" TO service_role;
GRANT MAINTAIN ON TABLE "public"."subjects" TO service_role;
GRANT REFERENCES ON TABLE "public"."subjects" TO service_role;
GRANT SELECT ON TABLE "public"."subjects" TO service_role;
GRANT TRIGGER ON TABLE "public"."subjects" TO service_role;
GRANT TRUNCATE ON TABLE "public"."subjects" TO service_role;
GRANT UPDATE ON TABLE "public"."subjects" TO service_role;
GRANT DELETE ON TABLE "public"."sync_items" TO anon;
GRANT INSERT ON TABLE "public"."sync_items" TO anon;
GRANT MAINTAIN ON TABLE "public"."sync_items" TO anon;
GRANT REFERENCES ON TABLE "public"."sync_items" TO anon;
GRANT SELECT ON TABLE "public"."sync_items" TO anon;
GRANT TRIGGER ON TABLE "public"."sync_items" TO anon;
GRANT TRUNCATE ON TABLE "public"."sync_items" TO anon;
GRANT UPDATE ON TABLE "public"."sync_items" TO anon;
GRANT DELETE ON TABLE "public"."sync_items" TO authenticated;
GRANT INSERT ON TABLE "public"."sync_items" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."sync_items" TO authenticated;
GRANT REFERENCES ON TABLE "public"."sync_items" TO authenticated;
GRANT SELECT ON TABLE "public"."sync_items" TO authenticated;
GRANT TRIGGER ON TABLE "public"."sync_items" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."sync_items" TO authenticated;
GRANT UPDATE ON TABLE "public"."sync_items" TO authenticated;
GRANT DELETE ON TABLE "public"."sync_items" TO service_role;
GRANT INSERT ON TABLE "public"."sync_items" TO service_role;
GRANT MAINTAIN ON TABLE "public"."sync_items" TO service_role;
GRANT REFERENCES ON TABLE "public"."sync_items" TO service_role;
GRANT SELECT ON TABLE "public"."sync_items" TO service_role;
GRANT TRIGGER ON TABLE "public"."sync_items" TO service_role;
GRANT TRUNCATE ON TABLE "public"."sync_items" TO service_role;
GRANT UPDATE ON TABLE "public"."sync_items" TO service_role;
GRANT DELETE ON TABLE "public"."tasks" TO anon;
GRANT INSERT ON TABLE "public"."tasks" TO anon;
GRANT MAINTAIN ON TABLE "public"."tasks" TO anon;
GRANT REFERENCES ON TABLE "public"."tasks" TO anon;
GRANT SELECT ON TABLE "public"."tasks" TO anon;
GRANT TRIGGER ON TABLE "public"."tasks" TO anon;
GRANT TRUNCATE ON TABLE "public"."tasks" TO anon;
GRANT UPDATE ON TABLE "public"."tasks" TO anon;
GRANT DELETE ON TABLE "public"."tasks" TO authenticated;
GRANT INSERT ON TABLE "public"."tasks" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."tasks" TO authenticated;
GRANT REFERENCES ON TABLE "public"."tasks" TO authenticated;
GRANT SELECT ON TABLE "public"."tasks" TO authenticated;
GRANT TRIGGER ON TABLE "public"."tasks" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."tasks" TO authenticated;
GRANT UPDATE ON TABLE "public"."tasks" TO authenticated;
GRANT DELETE ON TABLE "public"."tasks" TO service_role;
GRANT INSERT ON TABLE "public"."tasks" TO service_role;
GRANT MAINTAIN ON TABLE "public"."tasks" TO service_role;
GRANT REFERENCES ON TABLE "public"."tasks" TO service_role;
GRANT SELECT ON TABLE "public"."tasks" TO service_role;
GRANT TRIGGER ON TABLE "public"."tasks" TO service_role;
GRANT TRUNCATE ON TABLE "public"."tasks" TO service_role;
GRANT UPDATE ON TABLE "public"."tasks" TO service_role;
GRANT DELETE ON TABLE "public"."tests" TO anon;
GRANT INSERT ON TABLE "public"."tests" TO anon;
GRANT MAINTAIN ON TABLE "public"."tests" TO anon;
GRANT REFERENCES ON TABLE "public"."tests" TO anon;
GRANT SELECT ON TABLE "public"."tests" TO anon;
GRANT TRIGGER ON TABLE "public"."tests" TO anon;
GRANT TRUNCATE ON TABLE "public"."tests" TO anon;
GRANT UPDATE ON TABLE "public"."tests" TO anon;
GRANT DELETE ON TABLE "public"."tests" TO authenticated;
GRANT INSERT ON TABLE "public"."tests" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."tests" TO authenticated;
GRANT REFERENCES ON TABLE "public"."tests" TO authenticated;
GRANT SELECT ON TABLE "public"."tests" TO authenticated;
GRANT TRIGGER ON TABLE "public"."tests" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."tests" TO authenticated;
GRANT UPDATE ON TABLE "public"."tests" TO authenticated;
GRANT DELETE ON TABLE "public"."tests" TO service_role;
GRANT INSERT ON TABLE "public"."tests" TO service_role;
GRANT MAINTAIN ON TABLE "public"."tests" TO service_role;
GRANT REFERENCES ON TABLE "public"."tests" TO service_role;
GRANT SELECT ON TABLE "public"."tests" TO service_role;
GRANT TRIGGER ON TABLE "public"."tests" TO service_role;
GRANT TRUNCATE ON TABLE "public"."tests" TO service_role;
GRANT UPDATE ON TABLE "public"."tests" TO service_role;
GRANT DELETE ON TABLE "public"."user_display_profiles" TO anon;
GRANT INSERT ON TABLE "public"."user_display_profiles" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_display_profiles" TO anon;
GRANT REFERENCES ON TABLE "public"."user_display_profiles" TO anon;
GRANT SELECT ON TABLE "public"."user_display_profiles" TO anon;
GRANT TRIGGER ON TABLE "public"."user_display_profiles" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_display_profiles" TO anon;
GRANT UPDATE ON TABLE "public"."user_display_profiles" TO anon;
GRANT DELETE ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT INSERT ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT SELECT ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT DELETE ON TABLE "public"."user_display_profiles" TO service_role;
GRANT INSERT ON TABLE "public"."user_display_profiles" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_display_profiles" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_display_profiles" TO service_role;
GRANT SELECT ON TABLE "public"."user_display_profiles" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_display_profiles" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_display_profiles" TO service_role;
GRANT UPDATE ON TABLE "public"."user_display_profiles" TO service_role;
GRANT DELETE ON TABLE "public"."user_inventory" TO anon;
GRANT INSERT ON TABLE "public"."user_inventory" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_inventory" TO anon;
GRANT REFERENCES ON TABLE "public"."user_inventory" TO anon;
GRANT SELECT ON TABLE "public"."user_inventory" TO anon;
GRANT TRIGGER ON TABLE "public"."user_inventory" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_inventory" TO anon;
GRANT UPDATE ON TABLE "public"."user_inventory" TO anon;
GRANT DELETE ON TABLE "public"."user_inventory" TO authenticated;
GRANT INSERT ON TABLE "public"."user_inventory" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_inventory" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_inventory" TO authenticated;
GRANT SELECT ON TABLE "public"."user_inventory" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_inventory" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_inventory" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_inventory" TO authenticated;
GRANT DELETE ON TABLE "public"."user_inventory" TO service_role;
GRANT INSERT ON TABLE "public"."user_inventory" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_inventory" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_inventory" TO service_role;
GRANT SELECT ON TABLE "public"."user_inventory" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_inventory" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_inventory" TO service_role;
GRANT UPDATE ON TABLE "public"."user_inventory" TO service_role;
GRANT DELETE ON TABLE "public"."user_onboarding" TO anon;
GRANT INSERT ON TABLE "public"."user_onboarding" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_onboarding" TO anon;
GRANT REFERENCES ON TABLE "public"."user_onboarding" TO anon;
GRANT SELECT ON TABLE "public"."user_onboarding" TO anon;
GRANT TRIGGER ON TABLE "public"."user_onboarding" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_onboarding" TO anon;
GRANT UPDATE ON TABLE "public"."user_onboarding" TO anon;
GRANT DELETE ON TABLE "public"."user_onboarding" TO authenticated;
GRANT INSERT ON TABLE "public"."user_onboarding" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_onboarding" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_onboarding" TO authenticated;
GRANT SELECT ON TABLE "public"."user_onboarding" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_onboarding" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_onboarding" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_onboarding" TO authenticated;
GRANT DELETE ON TABLE "public"."user_onboarding" TO service_role;
GRANT INSERT ON TABLE "public"."user_onboarding" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_onboarding" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_onboarding" TO service_role;
GRANT SELECT ON TABLE "public"."user_onboarding" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_onboarding" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_onboarding" TO service_role;
GRANT UPDATE ON TABLE "public"."user_onboarding" TO service_role;
GRANT DELETE ON TABLE "public"."user_points" TO anon;
GRANT INSERT ON TABLE "public"."user_points" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_points" TO anon;
GRANT REFERENCES ON TABLE "public"."user_points" TO anon;
GRANT SELECT ON TABLE "public"."user_points" TO anon;
GRANT TRIGGER ON TABLE "public"."user_points" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_points" TO anon;
GRANT UPDATE ON TABLE "public"."user_points" TO anon;
GRANT DELETE ON TABLE "public"."user_points" TO authenticated;
GRANT INSERT ON TABLE "public"."user_points" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_points" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_points" TO authenticated;
GRANT SELECT ON TABLE "public"."user_points" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_points" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_points" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_points" TO authenticated;
GRANT DELETE ON TABLE "public"."user_points" TO service_role;
GRANT INSERT ON TABLE "public"."user_points" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_points" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_points" TO service_role;
GRANT SELECT ON TABLE "public"."user_points" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_points" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_points" TO service_role;
GRANT UPDATE ON TABLE "public"."user_points" TO service_role;
GRANT DELETE ON TABLE "public"."user_presence" TO anon;
GRANT INSERT ON TABLE "public"."user_presence" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_presence" TO anon;
GRANT REFERENCES ON TABLE "public"."user_presence" TO anon;
GRANT SELECT ON TABLE "public"."user_presence" TO anon;
GRANT TRIGGER ON TABLE "public"."user_presence" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_presence" TO anon;
GRANT UPDATE ON TABLE "public"."user_presence" TO anon;
GRANT DELETE ON TABLE "public"."user_presence" TO authenticated;
GRANT INSERT ON TABLE "public"."user_presence" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_presence" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_presence" TO authenticated;
GRANT SELECT ON TABLE "public"."user_presence" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_presence" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_presence" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_presence" TO authenticated;
GRANT DELETE ON TABLE "public"."user_presence" TO service_role;
GRANT INSERT ON TABLE "public"."user_presence" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_presence" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_presence" TO service_role;
GRANT SELECT ON TABLE "public"."user_presence" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_presence" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_presence" TO service_role;
GRANT UPDATE ON TABLE "public"."user_presence" TO service_role;
GRANT DELETE ON TABLE "public"."user_profiles" TO anon;
GRANT INSERT ON TABLE "public"."user_profiles" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_profiles" TO anon;
GRANT REFERENCES ON TABLE "public"."user_profiles" TO anon;
GRANT SELECT ON TABLE "public"."user_profiles" TO anon;
GRANT TRIGGER ON TABLE "public"."user_profiles" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_profiles" TO anon;
GRANT UPDATE ON TABLE "public"."user_profiles" TO anon;
GRANT DELETE ON TABLE "public"."user_profiles" TO authenticated;
GRANT INSERT ON TABLE "public"."user_profiles" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_profiles" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_profiles" TO authenticated;
GRANT SELECT ON TABLE "public"."user_profiles" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_profiles" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_profiles" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_profiles" TO authenticated;
GRANT DELETE ON TABLE "public"."user_profiles" TO service_role;
GRANT INSERT ON TABLE "public"."user_profiles" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_profiles" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_profiles" TO service_role;
GRANT SELECT ON TABLE "public"."user_profiles" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_profiles" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_profiles" TO service_role;
GRANT UPDATE ON TABLE "public"."user_profiles" TO service_role;
GRANT DELETE ON TABLE "public"."user_roles" TO anon;
GRANT INSERT ON TABLE "public"."user_roles" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_roles" TO anon;
GRANT REFERENCES ON TABLE "public"."user_roles" TO anon;
GRANT SELECT ON TABLE "public"."user_roles" TO anon;
GRANT TRIGGER ON TABLE "public"."user_roles" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_roles" TO anon;
GRANT UPDATE ON TABLE "public"."user_roles" TO anon;
GRANT DELETE ON TABLE "public"."user_roles" TO authenticated;
GRANT INSERT ON TABLE "public"."user_roles" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_roles" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_roles" TO authenticated;
GRANT SELECT ON TABLE "public"."user_roles" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_roles" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_roles" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_roles" TO authenticated;
GRANT DELETE ON TABLE "public"."user_roles" TO service_role;
GRANT INSERT ON TABLE "public"."user_roles" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_roles" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_roles" TO service_role;
GRANT SELECT ON TABLE "public"."user_roles" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_roles" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_roles" TO service_role;
GRANT UPDATE ON TABLE "public"."user_roles" TO service_role;
GRANT DELETE ON TABLE "public"."user_settings" TO anon;
GRANT INSERT ON TABLE "public"."user_settings" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_settings" TO anon;
GRANT REFERENCES ON TABLE "public"."user_settings" TO anon;
GRANT SELECT ON TABLE "public"."user_settings" TO anon;
GRANT TRIGGER ON TABLE "public"."user_settings" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_settings" TO anon;
GRANT UPDATE ON TABLE "public"."user_settings" TO anon;
GRANT DELETE ON TABLE "public"."user_settings" TO authenticated;
GRANT INSERT ON TABLE "public"."user_settings" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_settings" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_settings" TO authenticated;
GRANT SELECT ON TABLE "public"."user_settings" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_settings" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_settings" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_settings" TO authenticated;
GRANT DELETE ON TABLE "public"."user_settings" TO service_role;
GRANT INSERT ON TABLE "public"."user_settings" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_settings" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_settings" TO service_role;
GRANT SELECT ON TABLE "public"."user_settings" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_settings" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_settings" TO service_role;
GRANT UPDATE ON TABLE "public"."user_settings" TO service_role;
GRANT DELETE ON TABLE "public"."user_stats_summary" TO anon;
GRANT INSERT ON TABLE "public"."user_stats_summary" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_stats_summary" TO anon;
GRANT REFERENCES ON TABLE "public"."user_stats_summary" TO anon;
GRANT SELECT ON TABLE "public"."user_stats_summary" TO anon;
GRANT TRIGGER ON TABLE "public"."user_stats_summary" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_stats_summary" TO anon;
GRANT UPDATE ON TABLE "public"."user_stats_summary" TO anon;
GRANT DELETE ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT INSERT ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT SELECT ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT DELETE ON TABLE "public"."user_stats_summary" TO service_role;
GRANT INSERT ON TABLE "public"."user_stats_summary" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_stats_summary" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_stats_summary" TO service_role;
GRANT SELECT ON TABLE "public"."user_stats_summary" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_stats_summary" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_stats_summary" TO service_role;
GRANT UPDATE ON TABLE "public"."user_stats_summary" TO service_role;
GRANT DELETE ON TABLE "public"."user_tours" TO anon;
GRANT INSERT ON TABLE "public"."user_tours" TO anon;
GRANT MAINTAIN ON TABLE "public"."user_tours" TO anon;
GRANT REFERENCES ON TABLE "public"."user_tours" TO anon;
GRANT SELECT ON TABLE "public"."user_tours" TO anon;
GRANT TRIGGER ON TABLE "public"."user_tours" TO anon;
GRANT TRUNCATE ON TABLE "public"."user_tours" TO anon;
GRANT UPDATE ON TABLE "public"."user_tours" TO anon;
GRANT DELETE ON TABLE "public"."user_tours" TO authenticated;
GRANT INSERT ON TABLE "public"."user_tours" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."user_tours" TO authenticated;
GRANT REFERENCES ON TABLE "public"."user_tours" TO authenticated;
GRANT SELECT ON TABLE "public"."user_tours" TO authenticated;
GRANT TRIGGER ON TABLE "public"."user_tours" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."user_tours" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_tours" TO authenticated;
GRANT DELETE ON TABLE "public"."user_tours" TO service_role;
GRANT INSERT ON TABLE "public"."user_tours" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_tours" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_tours" TO service_role;
GRANT SELECT ON TABLE "public"."user_tours" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_tours" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_tours" TO service_role;
GRANT UPDATE ON TABLE "public"."user_tours" TO service_role;
GRANT DELETE ON TABLE "public"."users" TO anon;
GRANT INSERT ON TABLE "public"."users" TO anon;
GRANT MAINTAIN ON TABLE "public"."users" TO anon;
GRANT REFERENCES ON TABLE "public"."users" TO anon;
GRANT SELECT ON TABLE "public"."users" TO anon;
GRANT TRIGGER ON TABLE "public"."users" TO anon;
GRANT TRUNCATE ON TABLE "public"."users" TO anon;
GRANT UPDATE ON TABLE "public"."users" TO anon;
GRANT DELETE ON TABLE "public"."users" TO authenticated;
GRANT INSERT ON TABLE "public"."users" TO authenticated;
GRANT MAINTAIN ON TABLE "public"."users" TO authenticated;
GRANT REFERENCES ON TABLE "public"."users" TO authenticated;
GRANT SELECT ON TABLE "public"."users" TO authenticated;
GRANT TRIGGER ON TABLE "public"."users" TO authenticated;
GRANT TRUNCATE ON TABLE "public"."users" TO authenticated;
GRANT UPDATE ON TABLE "public"."users" TO authenticated;
GRANT DELETE ON TABLE "public"."users" TO service_role;
GRANT INSERT ON TABLE "public"."users" TO service_role;
GRANT MAINTAIN ON TABLE "public"."users" TO service_role;
GRANT REFERENCES ON TABLE "public"."users" TO service_role;
GRANT SELECT ON TABLE "public"."users" TO service_role;
GRANT TRIGGER ON TABLE "public"."users" TO service_role;
GRANT TRUNCATE ON TABLE "public"."users" TO service_role;
GRANT UPDATE ON TABLE "public"."users" TO service_role;
GRANT EXECUTE ON FUNCTION "private"."can_manage_group"(p_group_id uuid, p_user_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "private"."is_group_member"(p_group_id uuid, p_user_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "rpc_private"."accept_invite"(p_code text) TO authenticated;
GRANT EXECUTE ON FUNCTION "rpc_private"."join_community_event"(p_event_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "rpc_private"."leave_community_event"(p_event_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "rpc_private"."purchase_store_item"(p_user_id uuid, p_item_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."_auto_add_group_owner"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."_auto_add_super_admin"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."_ensure_community_enrollment"() TO service_role;
GRANT EXECUTE ON FUNCTION "public"."_ensure_onboarding_complete"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."_ensure_stats_summary"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."_ensure_user_points"() TO service_role;
GRANT EXECUTE ON FUNCTION "public"."_ensure_user_profile"() TO service_role;
GRANT EXECUTE ON FUNCTION "public"."_has_group_role"(gid uuid, uid uuid, allowed_roles text[]) TO anon;
GRANT EXECUTE ON FUNCTION "public"."_is_group_member"(gid uuid, uid uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."_sync_group_member_count"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."accept_invite"(p_code text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."check_user_role"(p_user_id uuid, p_role text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."cleanup_old_notifications"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_bootstrap_profile"(p_display_name text, p_handle text, p_day_offset_hours integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_create_group"(p_name text, p_description text, p_exam text, p_target_year integer, p_subjects text[], p_visibility text, p_join_policy text, p_timezone_offset_minutes integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_create_invite"(p_type text, p_target_id uuid, p_days integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_delete_group"(p_group_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_discover_groups"(p_query text, p_exam text, p_target_year integer, p_subject text, p_has_space boolean, p_join_policy text, p_limit integer, p_offset integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_get_group"(p_group_id uuid, p_period text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_get_group_messages"(p_group_id text, p_limit integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_get_overview"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_get_privacy"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_get_start_alert"(p_target_type text, p_target_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_heartbeat"(p_state text, p_subject_id uuid, p_subject_name text, p_task_id uuid, p_task_title text, p_session_started_at timestamp with time zone) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_is_enrolled"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_join_group"(p_group_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_leave_group"(p_group_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_preview_invite"(p_token text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_redeem_invite"(p_token text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_register_device_token"(p_token text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_remove_buddy"(p_other_user uuid, p_block boolean) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_remove_group_member"(p_group_id uuid, p_user_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_request_buddy"(p_handle text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_respond_buddy"(p_connection_id uuid, p_accept boolean) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_respond_join_request"(p_request_id uuid, p_accept boolean) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_save_privacy"(p_settings jsonb) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_send_group_message"(p_group_id text, p_content text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_set_group_role"(p_group_id uuid, p_user_id uuid, p_role text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_set_start_alert"(p_target_type text, p_target_id uuid, p_enabled boolean, p_quiet_hours_enabled boolean, p_quiet_start time without time zone, p_quiet_end time without time zone, p_timezone_offset_minutes integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_submit_report"(p_target_type text, p_target_id uuid, p_reason text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_sync_quiet_hours"(p_enabled boolean, p_start time without time zone, p_end time without time zone, p_timezone_offset_minutes integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_transfer_group"(p_group_id uuid, p_new_owner uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_update_group"(p_group_id uuid, p_changes jsonb) TO anon;
GRANT EXECUTE ON FUNCTION "public"."create_community_event"(p_title text, p_event_type text, p_description text, p_host text, p_start_time timestamp with time zone, p_end_time timestamp with time zone, p_image_gradient text, p_image_url text, p_tags text[], p_max_attendees integer, p_is_featured boolean, p_is_active boolean) TO anon;
GRANT EXECUTE ON FUNCTION "public"."delete_community_event"(p_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."delete_community_group"(p_group_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."expire_stale_presence"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."finish_session_sync"(p_session_id uuid, p_action text, p_duration_minutes integer, p_group_id uuid, p_session_type text, p_notes text, p_ended_at timestamp with time zone) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_event_attendees"(p_event_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_group_analytics_from_snapshots"(p_group_id uuid, p_days integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_group_leaderboard"(p_group_id uuid, p_limit integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_invite_details"(p_code text) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_leaderboard"(p_period text, p_limit integer, p_offset integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_membership_snapshot"(p_user_id uuid, target_user_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_my_group_ids"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_my_role"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."is_premium_user"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."is_premium_user"(uid uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."join_community_event"(p_event_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."join_community_group"(p_group_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."leave_community_event"(p_event_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."leave_community_group"(p_group_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."purchase_store_item"(p_user_id uuid, p_item_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."set_group_slug_from_name"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."set_user_tours_updated_at"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."sync_group_member_count"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."sync_group_visibility"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."sync_user_display_profile"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."sync_user_onboarding_from_profile"() TO anon;
GRANT EXECUTE ON FUNCTION "public"."update_community_event"(p_id uuid, p_title text, p_event_type text, p_description text, p_host text, p_start_time timestamp with time zone, p_end_time timestamp with time zone, p_image_gradient text, p_image_url text, p_tags text[], p_max_attendees integer, p_is_featured boolean, p_is_active boolean) TO anon;
GRANT EXECUTE ON FUNCTION "public"."update_group_member_role"(p_group_id uuid, p_target_uid uuid, p_new_role text) TO anon;
-- storage buckets (id, visibility, size cap, allowed types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[])
  ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('group-icons', 'group-icons', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[])
  ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('study-material', 'study-material', false, 104857600, NULL)
  ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('user-content', 'user-content', false, 52428800, NULL)
  ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
-- storage access policies
DROP POLICY IF EXISTS "avatars owner delete" ON storage."objects";
CREATE POLICY "avatars owner delete" ON storage."objects" FOR DELETE TO public USING (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
DROP POLICY IF EXISTS "avatars owner update" ON storage."objects";
CREATE POLICY "avatars owner update" ON storage."objects" FOR UPDATE TO public USING (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
DROP POLICY IF EXISTS "avatars owner write" ON storage."objects";
CREATE POLICY "avatars owner write" ON storage."objects" FOR INSERT TO public WITH CHECK (((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
DROP POLICY IF EXISTS "avatars public read" ON storage."objects";
CREATE POLICY "avatars public read" ON storage."objects" FOR SELECT TO public USING ((bucket_id = 'avatars'::text));
DROP POLICY IF EXISTS "group_icons_owner_delete" ON storage."objects";
CREATE POLICY "group_icons_owner_delete" ON storage."objects" FOR DELETE TO authenticated USING (((bucket_id = 'group-icons'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "group_icons_owner_insert" ON storage."objects";
CREATE POLICY "group_icons_owner_insert" ON storage."objects" FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'group-icons'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "group_icons_owner_update" ON storage."objects";
CREATE POLICY "group_icons_owner_update" ON storage."objects" FOR UPDATE TO authenticated USING (((bucket_id = 'group-icons'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text))) WITH CHECK (((bucket_id = 'group-icons'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "group_icons_public_read" ON storage."objects";
CREATE POLICY "group_icons_public_read" ON storage."objects" FOR SELECT TO public USING ((bucket_id = 'group-icons'::text));
DROP POLICY IF EXISTS "study_material_owner_delete" ON storage."objects";
CREATE POLICY "study_material_owner_delete" ON storage."objects" FOR DELETE TO authenticated USING (((bucket_id = 'study-material'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "study_material_owner_insert" ON storage."objects";
CREATE POLICY "study_material_owner_insert" ON storage."objects" FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'study-material'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "study_material_owner_select" ON storage."objects";
CREATE POLICY "study_material_owner_select" ON storage."objects" FOR SELECT TO authenticated USING (((bucket_id = 'study-material'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "study_material_owner_update" ON storage."objects";
CREATE POLICY "study_material_owner_update" ON storage."objects" FOR UPDATE TO authenticated USING (((bucket_id = 'study-material'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text))) WITH CHECK (((bucket_id = 'study-material'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
DROP POLICY IF EXISTS "user-content owner delete" ON storage."objects";
CREATE POLICY "user-content owner delete" ON storage."objects" FOR DELETE TO public USING (((bucket_id = 'user-content'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
DROP POLICY IF EXISTS "user-content owner read" ON storage."objects";
CREATE POLICY "user-content owner read" ON storage."objects" FOR SELECT TO public USING (((bucket_id = 'user-content'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
DROP POLICY IF EXISTS "user-content owner update" ON storage."objects";
CREATE POLICY "user-content owner update" ON storage."objects" FOR UPDATE TO public USING (((bucket_id = 'user-content'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
DROP POLICY IF EXISTS "user-content owner write" ON storage."objects";
CREATE POLICY "user-content owner write" ON storage."objects" FOR INSERT TO public WITH CHECK (((bucket_id = 'user-content'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
COMMIT;
