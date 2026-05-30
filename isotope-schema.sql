-- ============================================================
-- IsotopeAI — Complete Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Users table (plan & billing)
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  name          text,
  avatar_url    text,
  plan_type     text default 'free',
  billing_status text default 'free',
  plan_expires_at timestamptz,
  access_ends_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. User profiles (onboarding data, settings as JSON)
create table if not exists public.user_profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique references auth.users(id) on delete cascade,
  profile_data  jsonb default '{}'::jsonb,
  updated_at    timestamptz default now()
);

-- 3. User points (leaderboard & rewards)
create table if not exists public.user_points (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  points        integer default 0,
  lifetime_points integer default 0,
  updated_at    timestamptz default now()
);

-- 4. User stats summary
create table if not exists public.user_stats_summary (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  total_hours   numeric default 0,
  weekly_hours  numeric default 0,
  monthly_hours numeric default 0,
  current_streak  integer default 0,
  longest_streak  integer default 0,
  total_sessions  integer default 0,
  last_session_at timestamptz,
  updated_at    timestamptz default now()
);

-- 5. Daily user stats
create table if not exists public.daily_user_stats (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  date       date not null,
  seconds_studied integer default 0,
  unique(user_id, date)
);

-- 6. Study sessions log
create table if not exists public.study_sessions_log (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade,
  duration_minutes numeric,
  ended_at         timestamptz,
  subject          text,
  created_at       timestamptz default now()
);

-- 7. Store items (rewards shop)
create table if not exists public.store_items (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  description text,
  price       integer,
  item_type   text,
  item_data   jsonb default '{}'::jsonb,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- 8. User inventory (purchased items)
create table if not exists public.user_inventory (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  item_id      uuid references public.store_items(id),
  equipped     boolean default false,
  purchased_at timestamptz default now()
);

-- 9. Groups (study groups / community)
create table if not exists public.groups (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  cover_url    text,
  logo_url     text,
  category     text,
  slug         text unique,
  member_count integer default 0,
  owner_id     uuid references auth.users(id),
  is_public    boolean default true,
  settings     jsonb default '{}'::jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 10. Group members
create table if not exists public.group_members (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid references public.groups(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  role       text default 'member',
  joined_at  timestamptz default now(),
  unique(group_id, user_id)
);

-- 11. Group chat messages
create table if not exists public.group_chat_messages (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid references public.groups(id) on delete cascade,
  author_id  uuid references auth.users(id),
  content    text,
  pinned     boolean default false,
  created_at timestamptz default now()
);

-- 12. Group challenges
create table if not exists public.group_challenges (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid references public.groups(id) on delete cascade,
  title       text,
  description text,
  goal_type   text,
  goal_value  numeric,
  start_time  timestamptz,
  end_time    timestamptz,
  created_by  uuid references auth.users(id),
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- 13. Group challenge participants
create table if not exists public.group_challenge_participants (
  id           uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.group_challenges(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete cascade,
  progress     numeric default 0,
  completed    boolean default false,
  completed_at timestamptz,
  unique(challenge_id, user_id)
);

-- 14. Group announcements
create table if not exists public.group_announcements (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid references public.groups(id) on delete cascade,
  content    text,
  author_id  uuid references auth.users(id),
  pinned     boolean default false,
  created_at timestamptz default now()
);

-- 15. Group invites
create table if not exists public.group_invites (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid references public.groups(id) on delete cascade,
  token       text unique,
  created_by  uuid references auth.users(id),
  max_uses    integer,
  uses_count  integer default 0,
  expires_at  timestamptz,
  created_at  timestamptz default now()
);

-- 16. Group milestones
create table if not exists public.group_milestones (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid references public.groups(id) on delete cascade,
  milestone_type text,
  earned_at      timestamptz default now()
);

-- ============================================================
-- RPC: get_membership_snapshot
-- ============================================================
create or replace function public.get_membership_snapshot(p_user_id uuid)
returns table (
  effective_plan       text,
  access_source        text,
  billing_status       text,
  access_ends_at       timestamptz,
  cancel_at_period_end boolean,
  portal_eligible      boolean
)
language sql security definer as $$
  select
    coalesce(u.plan_type, 'free')     as effective_plan,
    coalesce(u.plan_type, 'free')     as access_source,
    coalesce(u.billing_status, 'free') as billing_status,
    u.access_ends_at,
    false as cancel_at_period_end,
    false as portal_eligible
  from public.users u
  where u.id = p_user_id
  limit 1;
$$;

-- ============================================================
-- RPC: is_premium_user (used in RLS policies)
-- ============================================================
create or replace function public.is_premium_user()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
    and plan_type in ('scholar', 'ranker')
  );
$$;

-- ============================================================
-- RPC: accept_invite
-- ============================================================
create or replace function public.accept_invite(p_token text)
returns json language plpgsql security definer as $$
declare
  v_invite public.group_invites;
  v_member_exists boolean;
begin
  select * into v_invite from public.group_invites
  where token = p_token
    and (expires_at is null or expires_at > now())
    and (max_uses is null or uses_count < max_uses);
  if v_invite.id is null then
    return json_build_object('success', false, 'error', 'Invalid or expired invite');
  end if;
  select exists(select 1 from public.group_members
    where group_id = v_invite.group_id and user_id = auth.uid()) into v_member_exists;
  if not v_member_exists then
    insert into public.group_members (group_id, user_id, role)
      values (v_invite.group_id, auth.uid(), 'member');
    update public.groups set member_count = member_count + 1
      where id = v_invite.group_id;
    update public.group_invites set uses_count = uses_count + 1
      where id = v_invite.id;
  end if;
  return json_build_object('success', true, 'group_id', v_invite.group_id);
end;
$$;

-- ============================================================
-- RPC: get_invite_details
-- ============================================================
create or replace function public.get_invite_details(p_token text)
returns json language sql security definer as $$
  select json_build_object(
    'group_id',          gi.group_id,
    'group_name',        g.name,
    'group_description', g.description,
    'member_count',      g.member_count,
    'expires_at',        gi.expires_at,
    'valid',             (gi.expires_at is null or gi.expires_at > now())
                         and (gi.max_uses is null or gi.uses_count < gi.max_uses)
  )
  from public.group_invites gi
  join public.groups g on g.id = gi.group_id
  where gi.token = p_token;
$$;

-- ============================================================
-- RPC: get_group_analytics_from_snapshots
-- ============================================================
create or replace function public.get_group_analytics_from_snapshots(p_group_id uuid)
returns json language sql security definer as $$
  select json_build_object(
    'total_study_hours', coalesce(sum(d.seconds_studied) / 3600.0, 0),
    'member_count',      g.member_count,
    'active_members',    count(distinct d.user_id)
  )
  from public.groups g
  left join public.group_members gm on gm.group_id = g.id
  left join public.daily_user_stats d on d.user_id = gm.user_id
    and d.date >= current_date - interval '30 days'
  where g.id = p_group_id
  group by g.member_count;
$$;

-- ============================================================
-- RLS — enable on all tables
-- ============================================================
alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_points enable row level security;
alter table public.user_stats_summary enable row level security;
alter table public.daily_user_stats enable row level security;
alter table public.study_sessions_log enable row level security;
alter table public.store_items enable row level security;
alter table public.user_inventory enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_chat_messages enable row level security;
alter table public.group_challenges enable row level security;
alter table public.group_challenge_participants enable row level security;
alter table public.group_announcements enable row level security;
alter table public.group_invites enable row level security;
alter table public.group_milestones enable row level security;

-- Policies: users manage their own data
create policy "users_self"       on public.users       for all using (auth.uid() = id);
create policy "profiles_self"    on public.user_profiles for all using (auth.uid() = user_id);
create policy "points_self"      on public.user_points  for all using (auth.uid() = user_id);
create policy "stats_self"       on public.user_stats_summary for all using (auth.uid() = user_id);
create policy "daily_stats_self" on public.daily_user_stats   for all using (auth.uid() = user_id);
create policy "sessions_self"    on public.study_sessions_log for all using (auth.uid() = user_id);
create policy "inventory_self"   on public.user_inventory     for all using (auth.uid() = user_id);
create policy "store_read"       on public.store_items for select using (true);

-- Community: any logged-in user can read, members can write
create policy "groups_read"      on public.groups for select using (true);
create policy "groups_insert"    on public.groups for insert with check (auth.uid() = owner_id);
create policy "groups_update"    on public.groups for update using (auth.uid() = owner_id);
create policy "members_read"     on public.group_members for select using (true);
create policy "members_insert"   on public.group_members for insert with check (auth.uid() = user_id);
create policy "members_delete"   on public.group_members for delete using (auth.uid() = user_id);
create policy "members_update"   on public.group_members for update using (exists (select 1 from public.group_members where group_id = group_members.group_id and user_id = auth.uid() and role = 'owner'));
create policy "chat_read"        on public.group_chat_messages for select using (true);
create policy "chat_insert"      on public.group_chat_messages for insert with check (auth.uid() = author_id);
create policy "challenges_read"  on public.group_challenges for select using (true);
create policy "challenges_insert" on public.group_challenges for insert with check (auth.uid() = created_by);
create policy "participants_all" on public.group_challenge_participants for all using (auth.uid() = user_id);
create policy "announcements_read" on public.group_announcements for select using (true);
create policy "announcements_insert" on public.group_announcements for insert with check (auth.uid() = author_id);
create policy "invites_read"     on public.group_invites for select using (true);
create policy "invites_insert"   on public.group_invites for insert with check (auth.uid() = created_by);
create policy "milestones_read"  on public.group_milestones for select using (true);

-- ============================================================
-- Trigger: auto-create user row + profile on signup
-- Every new user gets Scholar tier automatically on YOUR instance
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name, plan_type, billing_status, plan_expires_at, access_ends_at)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    'scholar',
    'active',
    '2099-12-31T23:59:59Z',
    '2099-12-31T23:59:59Z'
  )
  on conflict (id) do nothing;

  insert into public.user_profiles (user_id, profile_data)
  values (new.id, '{}')
  on conflict (user_id) do nothing;

  insert into public.user_points (user_id, points, lifetime_points)
  values (new.id, 0, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Done! Your database is ready.
