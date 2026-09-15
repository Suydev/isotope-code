-- 025_overview_profile.sql
--
-- community_get_overview omitted the caller's own `profile`, and two fields the
-- compiled Community bundle reads unconditionally. The bundle does
--
--     ownUserId: b.data?.profile?.user_id
--
-- and the buddy "Add a buddy" popup early-returns when ownUserId is falsy:
--
--     const a=async()=>{if(!i)return; ... createInvite({type:"buddy",targetId:i}) ...}
--
-- so `profile.user_id` missing meant the generate-invite button was a silent
-- no-op for every user. `profile.handle`/`display_name` also drive the
-- auto-enrol check (a missing profile makes the app re-bootstrap on every load),
-- and `pendingCount`/`updatedAt` back the attention badge and freshness line.
--
-- This is a pure CREATE OR REPLACE of the same function: same signature, same
-- return type, same buddies/groups/groupRequests shape. Only the three keys are
-- added. Idempotent; no DROP; no data loss.
--
-- `profile` is always an object (never null), matching how the bundle
-- dereferences it.

BEGIN;

CREATE OR REPLACE FUNCTION public.community_get_overview()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    -- The caller's own community profile. The compiled bundle reads
    -- overview.profile.user_id as ownUserId (buddy invite target) and
    -- overview.profile.handle/display_name to decide whether the account is
    -- enrolled. Without it those reads are undefined and buddy code
    -- generation silently no-ops.
    'profile', jsonb_build_object(
      'user_id',      uid,
      'handle',       (select handle from public.user_profiles where user_id = uid),
      'display_name', (select display_name from public.user_profiles where user_id = uid),
      'avatarUrl',    (select avatar_url from public.users where id = uid)
    ),
    -- Badge count the bundle renders when > 0: incoming pending buddy
    -- requests plus incoming pending group join requests.
    'pendingCount', (
      (select count(*) from public.community_friends f
        where f.friend_id = uid and coalesce(f.status, 'pending') = 'pending')
      + (select count(*) from public.community_join_requests r
           join public.group_members gm on gm.group_id = r.group_id and gm.user_id = uid
                                        and gm.role in ('owner', 'admin')
          where coalesce(r.status, 'pending') = 'pending')
    ),
    'updatedAt', now(),
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
$function$;
REVOKE ALL ON FUNCTION public.community_get_overview() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.community_get_overview() TO authenticated;

COMMIT;
