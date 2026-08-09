-- =============================================================================
-- IsotopeAI — full portable schema dump (NO user data)
-- Generated: 2026-08-09 17:52:24 UTC
-- Project ref: vteqquoqvksshmfhuepu
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
CREATE EXTENSION IF NOT EXISTS "hypopg";
CREATE EXTENSION IF NOT EXISTS "index_advisor";
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
  "total_seconds" bigint not null default 0
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
ALTER TABLE ONLY "public"."backup_manifests" ADD CONSTRAINT "backup_manifests_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."buddy_invites" ADD CONSTRAINT "buddy_invites_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."community_device_tokens" ADD CONSTRAINT "community_device_tokens_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."community_enrollments" ADD CONSTRAINT "community_enrollments_pkey" PRIMARY KEY (user_id);
ALTER TABLE ONLY "public"."community_event_attendees" ADD CONSTRAINT "community_event_attendees_pkey" PRIMARY KEY (event_id, user_id);
ALTER TABLE ONLY "public"."community_events" ADD CONSTRAINT "community_events_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."community_friends" ADD CONSTRAINT "community_friends_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."community_join_requests" ADD CONSTRAINT "community_join_requests_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."community_reports" ADD CONSTRAINT "community_reports_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."community_start_alerts" ADD CONSTRAINT "community_start_alerts_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."daily_logs" ADD CONSTRAINT "daily_logs_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."daily_user_stats" ADD CONSTRAINT "daily_user_stats_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."exams" ADD CONSTRAINT "exams_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."focus_sessions" ADD CONSTRAINT "focus_sessions_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."group_announcements" ADD CONSTRAINT "group_announcements_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."group_challenges" ADD CONSTRAINT "group_challenges_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."group_milestones" ADD CONSTRAINT "group_milestones_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."habits" ADD CONSTRAINT "habits_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."mock_tests" ADD CONSTRAINT "mock_tests_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."store_items" ADD CONSTRAINT "store_items_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."study_sessions_log" ADD CONSTRAINT "study_sessions_log_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."subjects" ADD CONSTRAINT "subjects_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."sync_items" ADD CONSTRAINT "sync_items_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."tasks" ADD CONSTRAINT "tasks_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."tests" ADD CONSTRAINT "tests_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."user_display_profiles" ADD CONSTRAINT "user_display_profiles_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."user_inventory" ADD CONSTRAINT "user_inventory_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."user_onboarding" ADD CONSTRAINT "user_onboarding_pkey" PRIMARY KEY (user_id);
ALTER TABLE ONLY "public"."user_points" ADD CONSTRAINT "user_points_pkey" PRIMARY KEY (user_id);
ALTER TABLE ONLY "public"."user_presence" ADD CONSTRAINT "user_presence_pkey" PRIMARY KEY (user_id);
ALTER TABLE ONLY "public"."user_profiles" ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY (user_id);
ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."user_settings" ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY (user_id);
ALTER TABLE ONLY "public"."user_stats_summary" ADD CONSTRAINT "user_stats_summary_pkey" PRIMARY KEY (user_id);
ALTER TABLE ONLY "public"."user_tours" ADD CONSTRAINT "user_tours_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY "public"."buddy_invites" ADD CONSTRAINT "buddy_invites_inviter_id_fkey" FOREIGN KEY (inviter_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."community_event_attendees" ADD CONSTRAINT "community_event_attendees_event_id_fkey" FOREIGN KEY (event_id) REFERENCES community_events(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."community_event_attendees" ADD CONSTRAINT "community_event_attendees_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."community_events" ADD CONSTRAINT "community_events_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY "public"."community_events" ADD CONSTRAINT "community_events_host_user_id_fkey" FOREIGN KEY (host_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY "public"."daily_logs" ADD CONSTRAINT "daily_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."daily_user_stats" ADD CONSTRAINT "daily_user_stats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."exams" ADD CONSTRAINT "exams_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."focus_sessions" ADD CONSTRAINT "focus_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_announcements" ADD CONSTRAINT "group_announcements_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE ONLY "public"."group_announcements" ADD CONSTRAINT "group_announcements_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES group_challenges(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_challenges" ADD CONSTRAINT "group_challenges_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE ONLY "public"."group_challenges" ADD CONSTRAINT "group_challenges_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_chat_messages" ADD CONSTRAINT "group_chat_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL NOT VALID;
ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_milestones" ADD CONSTRAINT "group_milestones_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id);
ALTER TABLE ONLY "public"."habits" ADD CONSTRAINT "habits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."mock_tests" ADD CONSTRAINT "mock_tests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."study_sessions_log" ADD CONSTRAINT "study_sessions_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."subjects" ADD CONSTRAINT "subjects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."sync_items" ADD CONSTRAINT "sync_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."tests" ADD CONSTRAINT "tests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_display_profiles" ADD CONSTRAINT "user_display_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_onboarding" ADD CONSTRAINT "user_onboarding_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_points" ADD CONSTRAINT "user_points_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_presence" ADD CONSTRAINT "user_presence_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_granted_by_fkey" FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_stats_summary" ADD CONSTRAINT "user_stats_summary_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."user_tours" ADD CONSTRAINT "user_tours_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY "public"."buddy_invites" ADD CONSTRAINT "buddy_invites_token_key" UNIQUE (token);
ALTER TABLE ONLY "public"."community_device_tokens" ADD CONSTRAINT "community_device_tokens_user_id_token_key" UNIQUE (user_id, token);
ALTER TABLE ONLY "public"."community_join_requests" ADD CONSTRAINT "community_join_requests_group_id_user_id_key" UNIQUE (group_id, user_id);
ALTER TABLE ONLY "public"."community_start_alerts" ADD CONSTRAINT "community_start_alerts_user_id_target_type_target_id_key" UNIQUE (user_id, target_type, target_id);
ALTER TABLE ONLY "public"."daily_user_stats" ADD CONSTRAINT "daily_user_stats_user_id_date_key" UNIQUE (user_id, date);
ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "gcp_challenge_user_key" UNIQUE (challenge_id, user_id);
ALTER TABLE ONLY "public"."group_challenge_participants" ADD CONSTRAINT "group_challenge_participants_challenge_id_user_id_key" UNIQUE (challenge_id, user_id);
ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_invite_code_key" UNIQUE (invite_code);
ALTER TABLE ONLY "public"."group_invites" ADD CONSTRAINT "group_invites_token_key" UNIQUE (token);
ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_group_id_user_id_key" UNIQUE (group_id, user_id);
ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_slug_key" UNIQUE (slug);
ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_slug_unique" UNIQUE (slug);
ALTER TABLE ONLY "public"."sync_items" ADD CONSTRAINT "sync_items_user_entity_id_unique" UNIQUE (user_id, entity, entity_id);
ALTER TABLE ONLY "public"."user_inventory" ADD CONSTRAINT "user_inventory_user_id_item_id_key" UNIQUE (user_id, item_id);
ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE (user_id, role);
ALTER TABLE ONLY "public"."user_tours" ADD CONSTRAINT "user_tours_user_id_tour_key_key" UNIQUE (user_id, tour_key);
ALTER TABLE ONLY "public"."backup_manifests" ADD CONSTRAINT "backup_manifests_path_user_prefix" CHECK ((split_part(path, '/'::text, 1) = (user_id)::text));
CREATE UNIQUE INDEX backup_manifests_bucket_path_idx ON public.backup_manifests USING btree (bucket, path);
CREATE INDEX IF NOT EXISTS backup_manifests_user_score_idx ON public.backup_manifests USING btree (user_id, selected_as_best DESC, score DESC, updated_at DESC);
CREATE UNIQUE INDEX groups_slug_active_unique ON public.groups USING btree (slug) WHERE ((deleted_at IS NULL) AND (slug IS NOT NULL));
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
CREATE UNIQUE INDEX idx_groups_slug_unique ON public.groups USING btree (slug) WHERE (slug IS NOT NULL);
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
CREATE UNIQUE INDEX uq_community_friends_pair ON public.community_friends USING btree (LEAST(user_id, friend_id), GREATEST(user_id, friend_id));
CREATE UNIQUE INDEX ux_profiles_handle ON public.user_profiles USING btree (lower(handle)) WHERE (handle IS NOT NULL);
CREATE OR REPLACE FUNCTION "private"."can_manage_group"(p_group_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
 AS $iso_fn$

    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id AND role = p_role);
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."cleanup_old_notifications"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO '""'
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

begin
  insert into public.community_enrollments (user_id, enrolled, day_offset_hours, onboarded, updated_at)
  values (auth.uid(), true, coalesce(p_day_offset_hours, 0), true, now())
  on conflict (user_id) do update
    set day_offset_hours = excluded.day_offset_hours,
        onboarded = true,
        updated_at = now();
  if p_handle is not null and p_handle <> '' then
    insert into public.user_profiles (user_id, handle, display_name, updated_at)
    values (auth.uid(), nullif(p_handle, ''), nullif(p_display_name, ''), now())
    on conflict (user_id) do update
      set handle = excluded.handle,
          display_name = excluded.display_name,
          updated_at = now();
  end if;
  return jsonb_build_object('ok', true, 'enrolled', true);
end;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_create_group"(p_name text, p_description text DEFAULT ''::text, p_exam text DEFAULT NULL::text, p_target_year integer DEFAULT NULL::integer, p_subjects text[] DEFAULT NULL::text[], p_visibility text DEFAULT 'private'::text, p_join_policy text DEFAULT 'request'::text, p_timezone_offset_minutes integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  gid uuid;
  cslug text;
  base_slug text;
  tries int := 0;
begin
  if p_name is null or p_name = '' then raise exception 'name_required'; end if;
  base_slug := regexp_replace(lower(p_name), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  base_slug := coalesce(nullif(base_slug, ''), 'group-' || substr(md5(random()::text), 1, 6));
  cslug := base_slug;
  loop
    exit when not exists (select 1 from public.groups where slug = cslug);
    tries := tries + 1;
    if tries > 4 then
      cslug := base_slug || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 5);
    else
      cslug := base_slug || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 5);
    end if;
  end loop;

  insert into public.groups
    (name, description, slug, exam, target_year, subjects, visibility, join_policy,
     owner_id, member_count, visual_key, timezone_offset, created_at, updated_at)
  values
    (p_name, coalesce(p_description, ''), cslug, p_exam, p_target_year,
     coalesce(p_subjects, '{}'), coalesce(p_visibility, 'public'), coalesce(p_join_policy, 'request'),
     auth.uid(), 1, abs(hashtext(cslug)) % 6, coalesce(p_timezone_offset_minutes, 0), now(), now())
  returning id into gid;

  insert into public.group_members (group_id, user_id, role, joined_at)
  values (gid, auth.uid(), 'owner', now())
  on conflict (group_id, user_id) do nothing;

  return jsonb_build_object(
    'id', gid,
    'slug', cslug,
    'name', p_name,
    'description', coalesce(p_description, ''),
    'exam', p_exam,
    'target_year', p_target_year,
    'subjects', coalesce(p_subjects, '{}'::text[]),
    'visibility', coalesce(p_visibility, 'public'),
    'join_policy', coalesce(p_join_policy, 'request'),
    'member_count', 1,
    'visual_key', abs(hashtext(cslug)) % 6
  );
end
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

begin
  if not exists (select 1 from public.group_members
                 where group_id = p_group_id and user_id = auth.uid()
                   and role = 'owner' and left_at is null) then
    raise exception 'not_allowed';
  end if;
  update public.groups set deleted_at = now(), updated_at = now() where id = p_group_id;
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_discover_groups"(p_query text DEFAULT NULL::text, p_exam text DEFAULT NULL::text, p_target_year integer DEFAULT NULL::integer, p_subject text DEFAULT NULL::text, p_has_space boolean DEFAULT true, p_join_policy text DEFAULT NULL::text, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  uid uuid := auth.uid();
  res jsonb;
begin
  select coalesce(jsonb_agg(row), '[]'::jsonb) into res from (
    select jsonb_build_object(
      'id', g.id,
      'name', g.name,
      'slug', g.slug,
      'description', g.description,
      'exam', coalesce(g.exam, ''),
      'targetYear', coalesce(g.target_year, 0),
      'subjects', coalesce(g.subjects, '{}'::text[]),
      'visibility', coalesce(g.visibility, 'public'),
      'joinPolicy', coalesce(g.join_policy, 'request'),
      'memberCount', (select count(*) from public.group_members a where a.group_id = g.id and a.left_at is null),
      'activeNow', (select count(*) from public.group_members a
                     join public.user_presence up on up.user_id = a.user_id
                     where a.group_id = g.id and a.left_at is null and up.state = 'studying'),
      'visualKey', coalesce(g.visual_key, 0),
      'joined', exists (select 1 from public.group_members a
                        where a.group_id = g.id and a.user_id = uid and a.left_at is null),
      'matches', coalesce((
        select coalesce(array_agg(ma), '{}') from (
          select g.exam as ma where g.exam is not null
          union all select g.target_year::text || ' edition' where g.target_year is not null
          union all select s || ' group' from unnest(g.subjects) s where g.subjects is not null
        ) sub
      ), '{}')
    ) as row
    from public.groups g
    where g.deleted_at is null
      and coalesce(g.visibility, 'public') = 'public'
      and (p_query is null or g.name ilike '%' || p_query || '%')
      and (p_exam is null or g.exam = p_exam)
      and (p_target_year is null or g.target_year = p_target_year)
      and (p_subject is null or (g.subjects is not null and (p_subject = any (g.subjects))))
      and (p_has_space is false or
           (select count(*) from public.group_members a where a.group_id = g.id and a.left_at is null) < 30)
      and (p_join_policy is null or g.join_policy = p_join_policy)
    order by g.created_at desc
    limit greatest(coalesce(p_limit, 20), 0) offset greatest(coalesce(p_offset, 0), 0)
  ) sub;
  return res;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_group"(p_group_id text, p_period text DEFAULT 'day'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  uid uuid := auth.uid();
  gid uuid;
  res jsonb;
begin
  if uid is null then return null; end if;

  begin
    gid := p_group_id::uuid;
  exception when others then
    select g.id into gid from public.groups g
     where g.slug = p_group_id and g.deleted_at is null;
  end;

  if gid is null then return null; end if;

  select jsonb_build_object(
    'group', jsonb_build_object(
      'id', g.id, 'name', g.name, 'slug', g.slug, 'description', g.description,
      'exam', g.exam, 'targetYear', g.target_year, 'subjects', g.subjects,
      'visibility', g.visibility, 'joinPolicy', g.join_policy,
      'owner_id', g.owner_id, 'created_at', g.created_at,
      'memberCount', (select count(*) from public.group_members a where a.group_id = g.id and a.left_at is null),
      'visualKey', g.visual_key,
      'role', (select ro.role from public.group_members ro where ro.group_id = g.id and ro.user_id = uid and ro.left_at is null)
    ),
    'period', p_period,
    'updatedAt', now(),
    'members', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rank', m.rn,
        'userId', m.user_id,
        'name', m.dname,
        'handle', m.handle,
        'avatarUrl', null,
        'role', m.role,
        'minutes', 0,
        'subjects', '[]'::jsonb,
        'status', coalesce(m.state, 'offline'),
        'currentSubject', m.curr_subject,
        'tasks', null
      ))
      from (
        select a.user_id, a.role,
               row_number() over (order by a.joined_at) as rn,
               coalesce(pf.display_name, '') dname, pf.handle,
               up.state, up.current_subject as curr_subject
        from public.group_members a
        left join public.user_profiles pf on pf.user_id = a.user_id
        left join public.user_presence up on up.user_id = a.user_id
        where a.group_id = gid and a.left_at is null
      ) m
    ), '[]'::jsonb)
  ) into res
  from public.groups g
  where g.id = gid and g.deleted_at is null;

  return res;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_group_messages"(p_group_id text, p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
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
  uid uuid := auth.uid();
  prof jsonb;
  pend int;
  buddies jsonb;
  groups jsonb;
  groupreq jsonb;
  out jsonb;
begin
  if uid is null then return null; end if;

  select jsonb_build_object(
    'user_id', up.user_id,
    'handle', up.handle,
    'display_name', up.display_name,
    'avatar_url', null
  ) into prof
  from public.user_profiles up where up.user_id = uid;

  select
    (select count(*) from public.community_friends f
       where f.friend_id = uid and f.status = 'pending')
    + (select count(*) from public.community_join_requests r
        where r.status = 'pending'
          and exists (select 1
            from public.group_members gm
            join public.groups g on g.id = gm.group_id
            where gm.group_id = r.group_id and gm.user_id = uid
              and gm.role in ('owner','coowner') and g.deleted_at is null))
  into pend;

  select coalesce(jsonb_agg(jsonb_build_object(
    'connectionId', f.id,
    'userId', case when f.user_id = uid then f.friend_id else f.user_id end,
    'name', other.display_name,
    'handle', other.handle,
    'avatarUrl', null,
    'requestStatus', f.status,
    'requestedByMe', f.user_id = uid,
    'presence', jsonb_build_object(
      'state', coalesce(up.state, 'offline'),
      'subject', up.current_subject,
      'startedAt', up.session_started_at,
      'lastSeenAt', coalesce(up.last_beat_at, up.last_seen)
    ),
    'minutesToday', 0,
    'subjects', '[]'::jsonb,
    'tasks', null
  )), '[]'::jsonb)
  into buddies
  from public.community_friends f
  left join public.user_profiles other
    on other.user_id = case when f.user_id = uid then f.friend_id else f.user_id end
  left join public.user_presence up
    on up.user_id = case when f.user_id = uid then f.friend_id else f.user_id end
  where (f.user_id = uid or f.friend_id = uid)
    and f.status in ('pending','accepted');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id,
    'name', g.name,
    'slug', g.slug,
    'description', g.description,
    'exam', coalesce(g.exam, ''),
    'targetYear', coalesce(g.target_year, 0),
    'subjects', coalesce(g.subjects, '{}'::text[]),
    'visibility', coalesce(g.visibility, 'public'),
    'joinPolicy', coalesce(g.join_policy, 'request'),
    'memberCount', (select count(*) from public.group_members a where a.group_id = g.id and a.left_at is null),
    'activeNow', (select count(*) from public.group_members a
                   join public.user_presence up on up.user_id = a.user_id
                   where a.group_id = g.id and a.left_at is null and up.state = 'studying'),
    'visualKey', coalesce(g.visual_key, 0),
    'role', case when gm.role = 'coowner' then 'admin' else gm.role end
  )), '[]'::jsonb)
  into groups
  from public.group_members gm
  join public.groups g on g.id = gm.group_id
  where gm.user_id = uid and gm.left_at is null and g.deleted_at is null;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'groupId', r.group_id,
    'groupName', g.name,
    'userId', r.user_id,
    'name', up.display_name,
    'handle', up.handle,
    'createdAt', r.created_at
  )), '[]'::jsonb)
  into groupreq
  from public.community_join_requests r
  join public.groups g on g.id = r.group_id
  left join public.user_profiles up on up.user_id = r.user_id
  where r.status = 'pending'
    and exists (select 1 from public.group_members gm
      where gm.group_id = r.group_id and gm.user_id = uid
        and gm.role in ('owner','coowner') and gm.left_at is null)
    and g.deleted_at is null;

  out := jsonb_build_object(
    'profile', prof,
    'pendingCount', pend,
    'buddies', buddies,
    'groups', groups,
    'groupRequests', groupreq,
    'updatedAt', now()
  );
  return out;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_get_privacy"()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
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
 SECURITY DEFINER
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

begin
  insert into public.user_presence (user_id, state, current_subject, session_started_at, last_beat_at, updated_at)
  values (auth.uid(), p_state, p_subject_name, p_session_started_at, now(), now())
  on conflict (user_id) do update set
    state = excluded.state,
    is_online = true,
    current_subject = case
                        when excluded.state in ('idle','offline') then null
                        else coalesce(excluded.current_subject, user_presence.current_subject)
                      end,
    session_started_at = case
                        when excluded.state in ('idle','offline') then null
                        else coalesce(excluded.session_started_at, user_presence.session_started_at)
                      end,
    last_beat_at = now(),
    updated_at = now();
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_is_enrolled"()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

  select exists(
    select 1 from public.community_enrollments where user_id = auth.uid()
  );
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_join_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  vis text; jp text; is_member boolean; is_owner boolean;
begin
  select g.visibility, g.join_policy, (g.owner_id = auth.uid()) into vis, jp, is_owner
    from public.groups g where g.id = p_group_id and g.deleted_at is null;
  if vis is null then raise exception 'group_not_found'; end if;

  select exists(
    select 1 from public.group_members m
    where m.group_id = p_group_id and m.user_id = auth.uid() and m.left_at is null
  ) into is_member;

  if is_owner or is_member then
    return jsonb_build_object('status', 'member');
  end if;

  if jp = 'open' or jp = 'instant' then
    insert into public.group_members (group_id, user_id, role, joined_at)
    values (p_group_id, auth.uid(), 'member', now())
    on conflict (group_id, user_id) do update set left_at = null;
    return jsonb_build_object('status', 'joined');
  else
    insert into public.community_join_requests (group_id, user_id, status, created_at)
    values (p_group_id, auth.uid(), 'pending', now())
    on conflict (group_id, user_id) do update set status = 'pending', created_at = now();
    return jsonb_build_object('status', 'requested');
  end if;
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_leave_group"(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  update public.group_members set left_at = now(), updated_at = now()
   where group_id = p_group_id and user_id = auth.uid();
  return jsonb_build_object('ok', true);
end
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
  if res is null then return jsonb_build_object('status', 'invalid'); end if;
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

begin
  if not exists (select 1 from public.group_members
                 where group_id = p_group_id and user_id = auth.uid()
                   and role in ('owner','coowner') and left_at is null) then
    raise exception 'not_allowed';
  end if;
  if p_user_id = auth.uid() then raise exception 'cannot_remove_self'; end if;
  update public.group_members set left_at = now(), updated_at = now()
   where group_id = p_group_id and user_id = p_user_id;
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_request_buddy"(p_handle text)
 RETURNS uuid
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

declare
  uid uuid := auth.uid();
  fid uuid;
  cid uuid;
begin
  select user_id into fid from public.user_profiles where lower(handle) = lower(p_handle) limit 1;
  if fid is null then raise exception 'user_not_found'; end if;
  if fid = uid then raise exception 'cannot_be_self'; end if;
  begin
    insert into public.community_friends (user_id, friend_id, status, created_at, updated_at)
    values (uid, fid, 'pending', now(), now())
    returning id into cid;
  exception when unique_violation then
    null;
  end;
  select id into cid from public.community_friends
   where (user_id = uid and friend_id = fid)
      or (user_id = fid and friend_id = uid)
   limit 1;
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
end
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

begin
  if not exists (select 1 from public.group_members
                 where group_id = p_group_id and user_id = auth.uid()
                   and role = 'owner' and left_at is null) then
    raise exception 'not_allowed';
  end if;
  if p_role not in ('owner','coowner','member','admin') then raise exception 'invalid_role'; end if;
  update public.group_members set role = case when p_role = 'admin' then 'coowner' else p_role end, updated_at = now()
   where group_id = p_group_id and user_id = p_user_id;
  return jsonb_build_object('ok', true);
end
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

begin
  if not exists (select 1 from public.group_members
                 where group_id = p_group_id and user_id = auth.uid()
                   and role = 'owner' and left_at is null) then
    raise exception 'not_allowed';
  end if;
  if p_new_owner is null then raise exception 'invalid_owner'; end if;
  if not exists (select 1 from public.group_members
                 where group_id = p_group_id and user_id = p_new_owner and left_at is null) then
    raise exception 'not_a_member';
  end if;
  update public.groups set owner_id = p_new_owner, updated_at = now() where id = p_group_id;
  update public.group_members set role = 'member', updated_at = now()
   where group_id = p_group_id and user_id = auth.uid();
  update public.group_members set role = 'owner', updated_at = now()
   where group_id = p_group_id and user_id = p_new_owner;
  return jsonb_build_object('ok', true);
end
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."community_update_group"(p_group_id uuid, p_changes jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

begin
  if not exists (select 1 from public.group_members
                 where group_id = p_group_id and user_id = auth.uid()
                   and role in ('owner','coowner') and left_at is null) then
    raise exception 'not_allowed';
  end if;
  if p_changes->>'name' is not null and trim(coalesce(p_changes->>'name', '')) = '' then
    raise exception 'name_required';
  end if;
  update public.groups g set
    name          = coalesce(p_changes->>'name', g.name),
    description   = coalesce(p_changes->>'description', g.description),
    visibility    = coalesce(p_changes->>'visibility', g.visibility),
    join_policy   = coalesce(p_changes->>'joinPolicy', p_changes->>'join_policy', g.join_policy),
    target_year   = case
                      when coalesce(p_changes->'targetYear', p_changes->'target_year') is null
                        or jsonb_typeof(coalesce(p_changes->'targetYear', p_changes->'target_year')) = 'null'
                      then g.target_year
                      else coalesce(p_changes->>'targetYear', p_changes->>'target_year')::int
                    end,
    exam          = coalesce(p_changes->>'exam', g.exam),
    subjects      = case
                      when p_changes ? 'subjects' and jsonb_typeof(p_changes->'subjects') = 'array'
                      then (select coalesce(array_agg(s), '{}'::text[]) from jsonb_array_elements_text(p_changes->'subjects') s)
                      else g.subjects
                    end,
    updated_at    = now()
   where id = p_group_id;
  return jsonb_build_object('ok', true);
end
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
CREATE OR REPLACE FUNCTION "public"."create_community_group"(p_name text, p_description text DEFAULT NULL::text, p_category text DEFAULT 'General'::text, p_cover_url text DEFAULT NULL::text, p_is_public boolean DEFAULT true, p_max_members integer DEFAULT 100, p_visibility text DEFAULT 'public'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO 'public'
 AS $iso_fn$

DECLARE
  v_uid      uuid := auth.uid();
  v_group_id uuid;
  v_slug     text;
  v_slug_base text;
  v_counter  integer := 0;
  v_group    public.groups%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group name is required');
  END IF;
  IF p_max_members < 2 OR p_max_members > 10000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'max_members must be between 2 and 10000');
  END IF;

  -- Generate unique slug
  v_slug_base := lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug_base := trim(v_slug_base, '-');
  IF v_slug_base = '' THEN v_slug_base := 'group'; END IF;
  v_slug := v_slug_base;
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.groups WHERE slug = v_slug AND deleted_at IS NULL);
    v_counter := v_counter + 1;
    v_slug := v_slug_base || '-' || v_counter;
    IF v_counter > 9999 THEN
      v_slug := v_slug_base || '-' || extract(epoch FROM now())::bigint;
      EXIT;
    END IF;
  END LOOP;

  -- Insert group
  INSERT INTO public.groups (
    name, description, category, cover_url,
    is_public, max_members, visibility, owner_id,
    slug, member_count, created_at, updated_at
  ) VALUES (
    trim(p_name), p_description, COALESCE(p_category,'General'), p_cover_url,
    p_is_public, p_max_members,
    CASE WHEN p_is_public THEN 'public' ELSE COALESCE(p_visibility,'invite_only') END,
    v_uid,
    v_slug, 1, now(), now()
  )
  RETURNING id INTO v_group_id;

  -- Insert owner membership
  INSERT INTO public.group_members (group_id, user_id, role, joined_at)
  VALUES (v_group_id, v_uid, 'owner', now())
  ON CONFLICT (group_id, user_id) DO UPDATE SET role = 'owner';

  SELECT * INTO v_group FROM public.groups WHERE id = v_group_id;

  RETURN jsonb_build_object(
    'success',   true,
    'group_id',  v_group_id,
    'slug',      v_slug,
    'group',     row_to_json(v_group)::jsonb
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."create_community_group"(p_name text, p_description text DEFAULT NULL::text, p_category text DEFAULT 'community'::text, p_is_public boolean DEFAULT true, p_slug text DEFAULT NULL::text, p_logo_url text DEFAULT NULL::text, p_cover_url text DEFAULT NULL::text, p_settings jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 VOLATILE
 SET "search_path" TO '""'
 AS $iso_fn$

DECLARE
  v_group_id uuid;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_slug IS NULL THEN
    -- basic slug fallback; you can override by passing p_slug
    p_slug := lower(regexp_replace(coalesce(p_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    IF p_slug = '' THEN
      p_slug := NULL;
    END IF;
  END IF;

  INSERT INTO public.groups (
    name,
    description,
    category,
    is_public,
    slug,
    logo_url,
    cover_url,
    owner_id,
    settings
  )
  VALUES (
    p_name,
    p_description,
    p_category,
    COALESCE(p_is_public, true),
    p_slug,
    p_logo_url,
    p_cover_url,
    v_uid,
    COALESCE(p_settings, '{}'::jsonb)
  )
  RETURNING id INTO v_group_id;

  -- add creator as owner (and ensure a member row exists)
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_group_id, v_uid, 'owner')
  ON CONFLICT (group_id, user_id) DO UPDATE SET role = EXCLUDED.role;

  RETURN v_group_id;
END;
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
 SET "search_path" TO '""'
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
 LANGUAGE plpgsql
 STABLE
 SECURITY DEFINER
 AS $iso_fn$

BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY
        CASE p_period
          WHEN 'monthly' THEN s.monthly_hours
          ELSE                s.weekly_hours
        END DESC NULLS LAST,
        s.total_hours DESC NULLS LAST
    ),
    s.user_id,
    u.username,
    u.name,
    u.avatar_url,
    COALESCE(s.total_hours,   0),
    COALESCE(s.weekly_hours,  0),
    COALESCE(s.monthly_hours, 0),
    COALESCE(s.total_sessions,  0)::integer,
    COALESCE(s.current_streak,  0)::integer,
    s.last_session_at,
    COALESCE(
      CASE p_period WHEN 'monthly' THEN s.monthly_hours ELSE s.weekly_hours END, 0
    )
  FROM public.user_stats_summary s
  JOIN public.users u ON u.id = s.user_id
  ORDER BY score DESC NULLS LAST, s.total_hours DESC NULLS LAST
  LIMIT  p_limit
  OFFSET p_offset;
END
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
 SET "search_path" TO '""'
 AS $iso_fn$
 SELECT ARRAY(SELECT group_id FROM public.group_members WHERE user_id = (SELECT auth.uid()));
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."get_my_role"()
 RETURNS text
 LANGUAGE sql
 STABLE
 SET "search_path" TO '""'
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
CREATE OR REPLACE FUNCTION "public"."is_premium_user"(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 AS $iso_fn$
 SELECT true;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."is_premium_user"()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
 AS $iso_fn$

  select rpc_private.purchase_store_item(p_user_id, p_item_id);
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"()
 RETURNS event_trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
 AS $iso_fn$

  BEGIN NEW.updated_at = now(); RETURN NEW; END;
$iso_fn$;
CREATE OR REPLACE FUNCTION "public"."sync_group_member_count"()
 RETURNS trigger
 LANGUAGE plpgsql
 VOLATILE
 SECURITY DEFINER
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
 SET "search_path" TO '""'
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
DROP TRIGGER IF EXISTS "trg_set_group_slug" ON "public"."groups";
CREATE TRIGGER trg_set_group_slug BEFORE INSERT ON public.groups FOR EACH ROW EXECUTE FUNCTION set_group_slug_from_name();
DROP TRIGGER IF EXISTS "trg_sync_group_visibility" ON "public"."groups";
CREATE TRIGGER trg_sync_group_visibility BEFORE INSERT OR UPDATE OF visibility ON public.groups FOR EACH ROW EXECUTE FUNCTION sync_group_visibility();
DROP TRIGGER IF EXISTS "trg_sync_member_count" ON "public"."group_members";
CREATE TRIGGER trg_sync_member_count AFTER INSERT OR DELETE ON public.group_members FOR EACH ROW EXECUTE FUNCTION _sync_group_member_count();
DROP TRIGGER IF EXISTS "trg_user_tours_updated_at" ON "public"."user_tours";
CREATE TRIGGER trg_user_tours_updated_at BEFORE UPDATE ON public.user_tours FOR EACH ROW EXECUTE FUNCTION set_user_tours_updated_at();
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
CREATE POLICY "daily_own" ON "public"."daily_user_stats" AS PERMISSIVE FOR ALL  USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
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
DROP POLICY IF EXISTS "stats_own_write" ON "public"."user_stats_summary";
CREATE POLICY "stats_own_write" ON "public"."user_stats_summary" AS PERMISSIVE FOR ALL  USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
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
GRANT DELETE ON TABLE "public"."backup_manifests" TO authenticated;
GRANT INSERT ON TABLE "public"."backup_manifests" TO authenticated;
GRANT SELECT ON TABLE "public"."backup_manifests" TO authenticated;
GRANT UPDATE ON TABLE "public"."backup_manifests" TO authenticated;
GRANT DELETE ON TABLE "public"."backup_manifests" TO service_role;
GRANT INSERT ON TABLE "public"."backup_manifests" TO service_role;
GRANT MAINTAIN ON TABLE "public"."backup_manifests" TO service_role;
GRANT REFERENCES ON TABLE "public"."backup_manifests" TO service_role;
GRANT SELECT ON TABLE "public"."backup_manifests" TO service_role;
GRANT TRIGGER ON TABLE "public"."backup_manifests" TO service_role;
GRANT TRUNCATE ON TABLE "public"."backup_manifests" TO service_role;
GRANT UPDATE ON TABLE "public"."backup_manifests" TO service_role;
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
GRANT DELETE ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT INSERT ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT SELECT ON TABLE "public"."community_event_attendees" TO authenticated;
GRANT DELETE ON TABLE "public"."community_event_attendees" TO service_role;
GRANT INSERT ON TABLE "public"."community_event_attendees" TO service_role;
GRANT MAINTAIN ON TABLE "public"."community_event_attendees" TO service_role;
GRANT REFERENCES ON TABLE "public"."community_event_attendees" TO service_role;
GRANT SELECT ON TABLE "public"."community_event_attendees" TO service_role;
GRANT TRIGGER ON TABLE "public"."community_event_attendees" TO service_role;
GRANT TRUNCATE ON TABLE "public"."community_event_attendees" TO service_role;
GRANT UPDATE ON TABLE "public"."community_event_attendees" TO service_role;
GRANT SELECT ON TABLE "public"."community_events" TO anon;
GRANT SELECT ON TABLE "public"."community_events" TO authenticated;
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
GRANT SELECT ON TABLE "public"."daily_user_stats" TO anon;
GRANT DELETE ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT INSERT ON TABLE "public"."daily_user_stats" TO authenticated;
GRANT SELECT ON TABLE "public"."daily_user_stats" TO authenticated;
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
GRANT SELECT ON TABLE "public"."group_announcements" TO anon;
GRANT DELETE ON TABLE "public"."group_announcements" TO authenticated;
GRANT INSERT ON TABLE "public"."group_announcements" TO authenticated;
GRANT SELECT ON TABLE "public"."group_announcements" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_announcements" TO authenticated;
GRANT DELETE ON TABLE "public"."group_announcements" TO service_role;
GRANT INSERT ON TABLE "public"."group_announcements" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_announcements" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_announcements" TO service_role;
GRANT SELECT ON TABLE "public"."group_announcements" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_announcements" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_announcements" TO service_role;
GRANT UPDATE ON TABLE "public"."group_announcements" TO service_role;
GRANT DELETE ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT INSERT ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT SELECT ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_challenge_participants" TO authenticated;
GRANT DELETE ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT INSERT ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT SELECT ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT UPDATE ON TABLE "public"."group_challenge_participants" TO service_role;
GRANT SELECT ON TABLE "public"."group_challenges" TO anon;
GRANT DELETE ON TABLE "public"."group_challenges" TO authenticated;
GRANT INSERT ON TABLE "public"."group_challenges" TO authenticated;
GRANT SELECT ON TABLE "public"."group_challenges" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_challenges" TO authenticated;
GRANT DELETE ON TABLE "public"."group_challenges" TO service_role;
GRANT INSERT ON TABLE "public"."group_challenges" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_challenges" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_challenges" TO service_role;
GRANT SELECT ON TABLE "public"."group_challenges" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_challenges" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_challenges" TO service_role;
GRANT UPDATE ON TABLE "public"."group_challenges" TO service_role;
GRANT INSERT ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT SELECT ON TABLE "public"."group_chat_messages" TO authenticated;
GRANT DELETE ON TABLE "public"."group_chat_messages" TO service_role;
GRANT INSERT ON TABLE "public"."group_chat_messages" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_chat_messages" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_chat_messages" TO service_role;
GRANT SELECT ON TABLE "public"."group_chat_messages" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_chat_messages" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_chat_messages" TO service_role;
GRANT UPDATE ON TABLE "public"."group_chat_messages" TO service_role;
GRANT DELETE ON TABLE "public"."group_invites" TO authenticated;
GRANT INSERT ON TABLE "public"."group_invites" TO authenticated;
GRANT SELECT ON TABLE "public"."group_invites" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_invites" TO authenticated;
GRANT DELETE ON TABLE "public"."group_invites" TO service_role;
GRANT INSERT ON TABLE "public"."group_invites" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_invites" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_invites" TO service_role;
GRANT SELECT ON TABLE "public"."group_invites" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_invites" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_invites" TO service_role;
GRANT UPDATE ON TABLE "public"."group_invites" TO service_role;
GRANT SELECT ON TABLE "public"."group_members" TO anon;
GRANT DELETE ON TABLE "public"."group_members" TO authenticated;
GRANT INSERT ON TABLE "public"."group_members" TO authenticated;
GRANT SELECT ON TABLE "public"."group_members" TO authenticated;
GRANT UPDATE ON TABLE "public"."group_members" TO authenticated;
GRANT DELETE ON TABLE "public"."group_members" TO service_role;
GRANT INSERT ON TABLE "public"."group_members" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_members" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_members" TO service_role;
GRANT SELECT ON TABLE "public"."group_members" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_members" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_members" TO service_role;
GRANT UPDATE ON TABLE "public"."group_members" TO service_role;
GRANT SELECT ON TABLE "public"."group_milestones" TO authenticated;
GRANT DELETE ON TABLE "public"."group_milestones" TO service_role;
GRANT INSERT ON TABLE "public"."group_milestones" TO service_role;
GRANT MAINTAIN ON TABLE "public"."group_milestones" TO service_role;
GRANT REFERENCES ON TABLE "public"."group_milestones" TO service_role;
GRANT SELECT ON TABLE "public"."group_milestones" TO service_role;
GRANT TRIGGER ON TABLE "public"."group_milestones" TO service_role;
GRANT TRUNCATE ON TABLE "public"."group_milestones" TO service_role;
GRANT UPDATE ON TABLE "public"."group_milestones" TO service_role;
GRANT SELECT ON TABLE "public"."groups" TO anon;
GRANT DELETE ON TABLE "public"."groups" TO authenticated;
GRANT INSERT ON TABLE "public"."groups" TO authenticated;
GRANT SELECT ON TABLE "public"."groups" TO authenticated;
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
GRANT DELETE ON TABLE "public"."notifications" TO authenticated;
GRANT INSERT ON TABLE "public"."notifications" TO authenticated;
GRANT SELECT ON TABLE "public"."notifications" TO authenticated;
GRANT UPDATE ON TABLE "public"."notifications" TO authenticated;
GRANT DELETE ON TABLE "public"."notifications" TO service_role;
GRANT INSERT ON TABLE "public"."notifications" TO service_role;
GRANT MAINTAIN ON TABLE "public"."notifications" TO service_role;
GRANT REFERENCES ON TABLE "public"."notifications" TO service_role;
GRANT SELECT ON TABLE "public"."notifications" TO service_role;
GRANT TRIGGER ON TABLE "public"."notifications" TO service_role;
GRANT TRUNCATE ON TABLE "public"."notifications" TO service_role;
GRANT UPDATE ON TABLE "public"."notifications" TO service_role;
GRANT SELECT ON TABLE "public"."store_items" TO anon;
GRANT SELECT ON TABLE "public"."store_items" TO authenticated;
GRANT DELETE ON TABLE "public"."store_items" TO service_role;
GRANT INSERT ON TABLE "public"."store_items" TO service_role;
GRANT MAINTAIN ON TABLE "public"."store_items" TO service_role;
GRANT REFERENCES ON TABLE "public"."store_items" TO service_role;
GRANT SELECT ON TABLE "public"."store_items" TO service_role;
GRANT TRIGGER ON TABLE "public"."store_items" TO service_role;
GRANT TRUNCATE ON TABLE "public"."store_items" TO service_role;
GRANT UPDATE ON TABLE "public"."store_items" TO service_role;
GRANT DELETE ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT INSERT ON TABLE "public"."study_sessions_log" TO authenticated;
GRANT SELECT ON TABLE "public"."study_sessions_log" TO authenticated;
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
GRANT DELETE ON TABLE "public"."sync_items" TO authenticated;
GRANT INSERT ON TABLE "public"."sync_items" TO authenticated;
GRANT SELECT ON TABLE "public"."sync_items" TO authenticated;
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
GRANT SELECT ON TABLE "public"."user_display_profiles" TO anon;
GRANT SELECT ON TABLE "public"."user_display_profiles" TO authenticated;
GRANT DELETE ON TABLE "public"."user_display_profiles" TO service_role;
GRANT INSERT ON TABLE "public"."user_display_profiles" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_display_profiles" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_display_profiles" TO service_role;
GRANT SELECT ON TABLE "public"."user_display_profiles" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_display_profiles" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_display_profiles" TO service_role;
GRANT UPDATE ON TABLE "public"."user_display_profiles" TO service_role;
GRANT DELETE ON TABLE "public"."user_inventory" TO authenticated;
GRANT INSERT ON TABLE "public"."user_inventory" TO authenticated;
GRANT SELECT ON TABLE "public"."user_inventory" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_inventory" TO authenticated;
GRANT DELETE ON TABLE "public"."user_inventory" TO service_role;
GRANT INSERT ON TABLE "public"."user_inventory" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_inventory" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_inventory" TO service_role;
GRANT SELECT ON TABLE "public"."user_inventory" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_inventory" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_inventory" TO service_role;
GRANT UPDATE ON TABLE "public"."user_inventory" TO service_role;
GRANT DELETE ON TABLE "public"."user_onboarding" TO authenticated;
GRANT INSERT ON TABLE "public"."user_onboarding" TO authenticated;
GRANT SELECT ON TABLE "public"."user_onboarding" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_onboarding" TO authenticated;
GRANT DELETE ON TABLE "public"."user_onboarding" TO service_role;
GRANT INSERT ON TABLE "public"."user_onboarding" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_onboarding" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_onboarding" TO service_role;
GRANT SELECT ON TABLE "public"."user_onboarding" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_onboarding" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_onboarding" TO service_role;
GRANT UPDATE ON TABLE "public"."user_onboarding" TO service_role;
GRANT INSERT ON TABLE "public"."user_points" TO authenticated;
GRANT SELECT ON TABLE "public"."user_points" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_points" TO authenticated;
GRANT DELETE ON TABLE "public"."user_points" TO service_role;
GRANT INSERT ON TABLE "public"."user_points" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_points" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_points" TO service_role;
GRANT SELECT ON TABLE "public"."user_points" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_points" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_points" TO service_role;
GRANT UPDATE ON TABLE "public"."user_points" TO service_role;
GRANT DELETE ON TABLE "public"."user_presence" TO authenticated;
GRANT INSERT ON TABLE "public"."user_presence" TO authenticated;
GRANT SELECT ON TABLE "public"."user_presence" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_presence" TO authenticated;
GRANT DELETE ON TABLE "public"."user_presence" TO service_role;
GRANT INSERT ON TABLE "public"."user_presence" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_presence" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_presence" TO service_role;
GRANT SELECT ON TABLE "public"."user_presence" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_presence" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_presence" TO service_role;
GRANT UPDATE ON TABLE "public"."user_presence" TO service_role;
GRANT DELETE ON TABLE "public"."user_profiles" TO authenticated;
GRANT INSERT ON TABLE "public"."user_profiles" TO authenticated;
GRANT SELECT ON TABLE "public"."user_profiles" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_profiles" TO authenticated;
GRANT DELETE ON TABLE "public"."user_profiles" TO service_role;
GRANT INSERT ON TABLE "public"."user_profiles" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_profiles" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_profiles" TO service_role;
GRANT SELECT ON TABLE "public"."user_profiles" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_profiles" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_profiles" TO service_role;
GRANT UPDATE ON TABLE "public"."user_profiles" TO service_role;
GRANT SELECT ON TABLE "public"."user_roles" TO authenticated;
GRANT DELETE ON TABLE "public"."user_roles" TO service_role;
GRANT INSERT ON TABLE "public"."user_roles" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_roles" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_roles" TO service_role;
GRANT SELECT ON TABLE "public"."user_roles" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_roles" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_roles" TO service_role;
GRANT UPDATE ON TABLE "public"."user_roles" TO service_role;
GRANT DELETE ON TABLE "public"."user_settings" TO authenticated;
GRANT INSERT ON TABLE "public"."user_settings" TO authenticated;
GRANT SELECT ON TABLE "public"."user_settings" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_settings" TO authenticated;
GRANT DELETE ON TABLE "public"."user_settings" TO service_role;
GRANT INSERT ON TABLE "public"."user_settings" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_settings" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_settings" TO service_role;
GRANT SELECT ON TABLE "public"."user_settings" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_settings" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_settings" TO service_role;
GRANT UPDATE ON TABLE "public"."user_settings" TO service_role;
GRANT SELECT ON TABLE "public"."user_stats_summary" TO anon;
GRANT DELETE ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT INSERT ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT SELECT ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT UPDATE ON TABLE "public"."user_stats_summary" TO authenticated;
GRANT DELETE ON TABLE "public"."user_stats_summary" TO service_role;
GRANT INSERT ON TABLE "public"."user_stats_summary" TO service_role;
GRANT MAINTAIN ON TABLE "public"."user_stats_summary" TO service_role;
GRANT REFERENCES ON TABLE "public"."user_stats_summary" TO service_role;
GRANT SELECT ON TABLE "public"."user_stats_summary" TO service_role;
GRANT TRIGGER ON TABLE "public"."user_stats_summary" TO service_role;
GRANT TRUNCATE ON TABLE "public"."user_stats_summary" TO service_role;
GRANT UPDATE ON TABLE "public"."user_stats_summary" TO service_role;
GRANT DELETE ON TABLE "public"."user_tours" TO authenticated;
GRANT INSERT ON TABLE "public"."user_tours" TO authenticated;
GRANT SELECT ON TABLE "public"."user_tours" TO authenticated;
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
GRANT SELECT ON TABLE "public"."users" TO anon;
GRANT UPDATE ON TABLE "public"."users" TO anon;
GRANT DELETE ON TABLE "public"."users" TO authenticated;
GRANT INSERT ON TABLE "public"."users" TO authenticated;
GRANT SELECT ON TABLE "public"."users" TO authenticated;
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
GRANT EXECUTE ON FUNCTION "public"."_has_group_role"(gid uuid, uid uuid, allowed_roles text[]) TO anon;
GRANT EXECUTE ON FUNCTION "public"."_is_group_member"(gid uuid, uid uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."_sync_group_member_count"() TO service_role;
GRANT EXECUTE ON FUNCTION "public"."accept_invite"(p_code text) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."check_user_role"(p_user_id uuid, p_role text) TO service_role;
GRANT EXECUTE ON FUNCTION "public"."community_bootstrap_profile"(p_display_name text, p_handle text, p_day_offset_hours integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_create_group"(p_name text, p_description text, p_exam text, p_target_year integer, p_subjects text[], p_visibility text, p_join_policy text, p_timezone_offset_minutes integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_create_invite"(p_type text, p_target_id uuid, p_days integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_delete_group"(p_group_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_discover_groups"(p_query text, p_exam text, p_target_year integer, p_subject text, p_has_space boolean, p_join_policy text, p_limit integer, p_offset integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."community_get_group"(p_group_id text, p_period text) TO anon;
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
GRANT EXECUTE ON FUNCTION "public"."create_community_event"(p_title text, p_event_type text, p_description text, p_host text, p_start_time timestamp with time zone, p_end_time timestamp with time zone, p_image_gradient text, p_image_url text, p_tags text[], p_max_attendees integer, p_is_featured boolean, p_is_active boolean) TO service_role;
GRANT EXECUTE ON FUNCTION "public"."create_community_group"(p_name text, p_description text, p_category text, p_cover_url text, p_is_public boolean, p_max_members integer, p_visibility text) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."create_community_group"(p_name text, p_description text, p_category text, p_is_public boolean, p_slug text, p_logo_url text, p_cover_url text, p_settings jsonb) TO anon;
GRANT EXECUTE ON FUNCTION "public"."delete_community_event"(p_id uuid) TO service_role;
GRANT EXECUTE ON FUNCTION "public"."delete_community_group"(p_group_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."expire_stale_presence"() TO service_role;
GRANT EXECUTE ON FUNCTION "public"."finish_session_sync"(p_session_id uuid, p_action text, p_duration_minutes integer, p_group_id uuid, p_session_type text, p_notes text, p_ended_at timestamp with time zone) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."get_event_attendees"(p_event_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."get_group_analytics_from_snapshots"(p_group_id uuid, p_days integer) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."get_group_leaderboard"(p_group_id uuid, p_limit integer) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_leaderboard"(p_period text, p_limit integer, p_offset integer) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."get_membership_snapshot"(p_user_id uuid, target_user_id uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."get_my_role"() TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."is_premium_user"() TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."is_premium_user"(uid uuid) TO anon;
GRANT EXECUTE ON FUNCTION "public"."join_community_event"(p_event_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."join_community_group"(p_group_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."leave_community_event"(p_event_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."leave_community_group"(p_group_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."purchase_store_item"(p_user_id uuid, p_item_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION "public"."update_community_event"(p_id uuid, p_title text, p_event_type text, p_description text, p_host text, p_start_time timestamp with time zone, p_end_time timestamp with time zone, p_image_gradient text, p_image_url text, p_tags text[], p_max_attendees integer, p_is_featured boolean, p_is_active boolean) TO service_role;
GRANT EXECUTE ON FUNCTION "public"."update_group_member_role"(p_group_id uuid, p_target_uid uuid, p_new_role text) TO authenticated;
COMMIT;
