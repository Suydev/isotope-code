-- ============================================================================
-- IsotopeAI — Events Removal Patch
-- ============================================================================
-- Events have been removed from this installation.  This file is kept so older
-- setup instructions that apply events-expansion.sql remain safe: running it now
-- deletes event-only Supabase objects instead of recreating them.

DROP POLICY IF EXISTS "event_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "event_images_authenticated_write" ON storage.objects;
-- Delete the `event-images` bucket with the Supabase Storage API if it exists.
-- Direct deletion from storage.objects is intentionally blocked by Supabase.

DROP VIEW IF EXISTS public.community_events_with_counts CASCADE;

DROP FUNCTION IF EXISTS public.join_community_event(uuid);
DROP FUNCTION IF EXISTS public.leave_community_event(uuid);
DROP FUNCTION IF EXISTS public.create_community_event(text, text, text, text, timestamptz, timestamptz, text, text, text[], integer, boolean, boolean);
DROP FUNCTION IF EXISTS public.update_community_event(uuid, text, text, text, text, timestamptz, timestamptz, text, text, text[], integer, boolean, boolean);
DROP FUNCTION IF EXISTS public.delete_community_event(uuid);
DROP FUNCTION IF EXISTS public.get_event_attendees(uuid);
DROP FUNCTION IF EXISTS public._evt_increment_reply_count() CASCADE;
DROP FUNCTION IF EXISTS public._evt_update_analytics() CASCADE;
DROP FUNCTION IF EXISTS public.rsvp_event(uuid, text);
DROP FUNCTION IF EXISTS public.react_to_event(uuid, text);
DROP FUNCTION IF EXISTS public.track_event_view(uuid);
DROP FUNCTION IF EXISTS public.get_event_discovery();
DROP FUNCTION IF EXISTS public.get_event_discovery(text);
DROP FUNCTION IF EXISTS public.get_event_discovery(text, integer);
DROP FUNCTION IF EXISTS public.get_event_discovery(text, integer, integer);
DROP FUNCTION IF EXISTS public.get_event_full(uuid);
DROP FUNCTION IF EXISTS public.get_event_leaderboard(text, uuid, integer);
DROP FUNCTION IF EXISTS public.get_event_stats(uuid);
DROP FUNCTION IF EXISTS public.upsert_event_rsvp(uuid, uuid, text);
DROP FUNCTION IF EXISTS public.update_event_engagement_score(uuid);
DROP FUNCTION IF EXISTS public.increment_event_resource_download(uuid, uuid);
DROP FUNCTION IF EXISTS public.purchase_store_item(uuid, uuid);

DROP TABLE IF EXISTS public.event_pinned_messages CASCADE;
DROP TABLE IF EXISTS public.event_announcements CASCADE;
DROP TABLE IF EXISTS public.event_reminders CASCADE;
DROP TABLE IF EXISTS public.event_recordings CASCADE;
DROP TABLE IF EXISTS public.event_feedback CASCADE;
DROP TABLE IF EXISTS public.event_analytics CASCADE;
DROP TABLE IF EXISTS public.event_presence CASCADE;
DROP TABLE IF EXISTS public.event_roles CASCADE;
DROP TABLE IF EXISTS public.event_resources CASCADE;
DROP TABLE IF EXISTS public.event_reactions CASCADE;
DROP TABLE IF EXISTS public.event_thread_replies CASCADE;
DROP TABLE IF EXISTS public.event_threads CASCADE;
DROP TABLE IF EXISTS public.event_messages CASCADE;
DROP TABLE IF EXISTS public.event_rsvp CASCADE;
DROP TABLE IF EXISTS public.event_achievements CASCADE;
DROP TABLE IF EXISTS public.community_event_attendees CASCADE;
DROP TABLE IF EXISTS public.community_events CASCADE;
DROP TABLE IF EXISTS public.event_categories CASCADE;
DROP TABLE IF EXISTS public.user_inventory CASCADE;
DROP TABLE IF EXISTS public.store_items CASCADE;
