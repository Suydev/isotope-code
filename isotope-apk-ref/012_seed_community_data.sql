-- 012_seed_community_data.sql
-- Seeds realistic challenges and announcements for all 8 community groups.
-- Uses admin user 68aa181f-3ff0-4be5-8e1f-d291a7f3b857 as author/creator.
-- Safe to re-run: INSERT ... ON CONFLICT (id) DO NOTHING.

-- ── Group Challenges ──────────────────────────────────────────────────────────

INSERT INTO group_challenges
  (id, group_id, title, description, goal_type, goal_value,
   start_time, end_time, created_by, is_active, created_at)
VALUES
  -- JEE
  ('a1000001-0000-0000-0000-000000000001',
   '8d576b6d-dcee-4435-82cd-31cd7375bf22',
   'JEE Blitz Week',
   'Study 20 hours this week to ace the JEE prep sprint.',
   'study_hours', 20,
   now(), now() + interval '7 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000001-0000-0000-0000-000000000002',
   '8d576b6d-dcee-4435-82cd-31cd7375bf22',
   '10 Sessions Marathon',
   'Complete 10 study sessions before the month ends.',
   'sessions', 10,
   now(), now() + interval '30 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  -- JEE Advanced
  ('a1000002-0000-0000-0000-000000000001',
   'b8efd565-ed62-4476-885e-b359fa0b7cc5',
   'Advanced Grinding Challenge',
   'Log 30 study hours this month. JEE Advanced demands it.',
   'study_hours', 30,
   now(), now() + interval '30 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000002-0000-0000-0000-000000000002',
   'b8efd565-ed62-4476-885e-b359fa0b7cc5',
   'Daily Consistency',
   'Complete at least 15 sessions in 2 weeks.',
   'sessions', 15,
   now(), now() + interval '14 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  -- Physics Olympiad
  ('a1000003-0000-0000-0000-000000000001',
   '965b7af0-03e7-4f5e-803a-43224353b946',
   'Olympiad Prep Sprint',
   'Log 25 hours of physics study before the month is up.',
   'study_hours', 25,
   now(), now() + interval '30 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000003-0000-0000-0000-000000000002',
   '965b7af0-03e7-4f5e-803a-43224353b946',
   'Problem Set Finisher',
   'Complete 12 focused problem-solving sessions.',
   'sessions', 12,
   now(), now() + interval '21 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  -- CS & Algorithms
  ('a1000004-0000-0000-0000-000000000001',
   'eb84ae6d-e5bf-4553-9748-97e518177b14',
   'Algorithm Deep Dive',
   'Spend 15 hours on data structures and algorithms.',
   'study_hours', 15,
   now(), now() + interval '14 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000004-0000-0000-0000-000000000002',
   'eb84ae6d-e5bf-4553-9748-97e518177b14',
   'LeetCode Grind',
   'Complete 20 coding practice sessions this month.',
   'sessions', 20,
   now(), now() + interval '30 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  -- Pre-Med Biology
  ('a1000005-0000-0000-0000-000000000001',
   '101304fb-197a-44cf-801a-b5662056d285',
   'NEET Biology Blitz',
   'Study 18 hours of biology before the next test cycle.',
   'study_hours', 18,
   now(), now() + interval '14 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000005-0000-0000-0000-000000000002',
   '101304fb-197a-44cf-801a-b5662056d285',
   'Flashcard Sprint',
   'Complete 10 high-intensity review sessions.',
   'sessions', 10,
   now(), now() + interval '10 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  -- Language Lab
  ('a1000006-0000-0000-0000-000000000001',
   '42b6ce67-5e34-48fd-827a-c2e3717764c2',
   'Fluency Challenge',
   'Rack up 12 hours of language practice in 2 weeks.',
   'study_hours', 12,
   now(), now() + interval '14 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000006-0000-0000-0000-000000000002',
   '42b6ce67-5e34-48fd-827a-c2e3717764c2',
   'Daily Practice Streak',
   'Complete 14 study sessions in 14 days, one per day.',
   'sessions', 14,
   now(), now() + interval '14 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  -- Competitive Coding
  ('a1000007-0000-0000-0000-000000000001',
   '573fab12-05b7-4341-878d-3e87bd7fd34b',
   'Contest Prep Week',
   'Log 10 hours of competitive coding prep in 7 days.',
   'study_hours', 10,
   now(), now() + interval '7 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000007-0000-0000-0000-000000000002',
   '573fab12-05b7-4341-878d-3e87bd7fd34b',
   'Sprint to 25 Sessions',
   'Hit 25 focused coding sessions before the deadline.',
   'sessions', 25,
   now(), now() + interval '30 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  -- Math Mastery
  ('a1000008-0000-0000-0000-000000000001',
   '4aaafe09-341c-432e-988f-78ddf020b54d',
   'Math Marathon',
   'Study math for 20 hours this month.',
   'study_hours', 20,
   now(), now() + interval '30 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now()),

  ('a1000008-0000-0000-0000-000000000002',
   '4aaafe09-341c-432e-988f-78ddf020b54d',
   'Problem Solving Blitz',
   'Complete 15 math practice sessions.',
   'sessions', 15,
   now(), now() + interval '21 days',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true, now())

ON CONFLICT (id) DO NOTHING;


-- ── Group Announcements ───────────────────────────────────────────────────────

INSERT INTO group_announcements
  (id, group_id, content, author_id, pinned, created_at)
VALUES
  -- JEE
  ('b1000001-0000-0000-0000-000000000001',
   '8d576b6d-dcee-4435-82cd-31cd7375bf22',
   'Welcome to the JEE group! Share your progress, ask questions, and motivate each other. Best of luck to everyone appearing this year!',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '2 days'),

  ('b1000001-0000-0000-0000-000000000002',
   '8d576b6d-dcee-4435-82cd-31cd7375bf22',
   'Reminder: Start the JEE Blitz Week challenge. 20 hours this week keeps the rank in peak!',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '1 day'),

  -- JEE Advanced
  ('b1000002-0000-0000-0000-000000000001',
   'b8efd565-ed62-4476-885e-b359fa0b7cc5',
   'JEE Advanced group is live! This is for serious aspirants only. Keep the discussions focused and the study hours high.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '3 days'),

  ('b1000002-0000-0000-0000-000000000002',
   'b8efd565-ed62-4476-885e-b359fa0b7cc5',
   'New challenge posted: Advanced Grinding Challenge. 30 hours this month. Let''s see who tops the leaderboard!',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '1 day'),

  -- Physics Olympiad
  ('b1000003-0000-0000-0000-000000000001',
   '965b7af0-03e7-4f5e-803a-43224353b946',
   'Welcome to Physics Olympiad prep! Focus on conceptual clarity and problem-solving speed. Share resources freely.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '4 days'),

  ('b1000003-0000-0000-0000-000000000002',
   '965b7af0-03e7-4f5e-803a-43224353b946',
   'Start the Olympiad Prep Sprint challenge. 25 hours of physics this month. Quality over quantity!',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '12 hours'),

  -- CS & Algorithms
  ('b1000004-0000-0000-0000-000000000001',
   'eb84ae6d-e5bf-4553-9748-97e518177b14',
   'CS & Algorithms group is open! Great for DSA prep, FAANG interviews, and competitive programming. Welcome aboard!',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '5 days'),

  ('b1000004-0000-0000-0000-000000000002',
   'eb84ae6d-e5bf-4553-9748-97e518177b14',
   'The LeetCode Grind challenge is live. 20 coding sessions in 30 days.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '2 days'),

  -- Pre-Med Biology
  ('b1000005-0000-0000-0000-000000000001',
   '101304fb-197a-44cf-801a-b5662056d285',
   'Welcome Pre-Med aspirants! Use this group to stay consistent, share notes, and crush the biology section of NEET.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '2 days'),

  ('b1000005-0000-0000-0000-000000000002',
   '101304fb-197a-44cf-801a-b5662056d285',
   'NEET Biology Blitz challenge is live. 18 hours in 14 days. Consistency is the key to NEET success!',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '6 hours'),

  -- Language Lab
  ('b1000006-0000-0000-0000-000000000001',
   '42b6ce67-5e34-48fd-827a-c2e3717764c2',
   'Welcome to Language Lab! Whether you are learning French, Japanese, or Spanish, all language learners are welcome here.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '3 days'),

  ('b1000006-0000-0000-0000-000000000002',
   '42b6ce67-5e34-48fd-827a-c2e3717764c2',
   'New challenge: Daily Practice Streak. 14 sessions in 14 days! Keep the streak alive.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '1 day'),

  -- Competitive Coding
  ('b1000007-0000-0000-0000-000000000001',
   '573fab12-05b7-4341-878d-3e87bd7fd34b',
   'Competitive Coding group is live! For Codeforces, ICPC, and all things CP. Share problems, editorial links, and strategies.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '4 days'),

  ('b1000007-0000-0000-0000-000000000002',
   '573fab12-05b7-4341-878d-3e87bd7fd34b',
   'Contest Prep Week is running. 10 hours in 7 days before the next rated round. Are you in?',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '8 hours'),

  -- Math Mastery
  ('b1000008-0000-0000-0000-000000000001',
   '4aaafe09-341c-432e-988f-78ddf020b54d',
   'Math Mastery group is live! Perfect for JEE/CUET math, olympiad prep, or just loving numbers. All levels welcome.',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', true,
   now() - interval '2 days'),

  ('b1000008-0000-0000-0000-000000000002',
   '4aaafe09-341c-432e-988f-78ddf020b54d',
   'Math Marathon challenge posted. 20 hours this month. Let the numbers flow!',
   '68aa181f-3ff0-4be5-8e1f-d291a7f3b857', false,
   now() - interval '3 hours')

ON CONFLICT (id) DO NOTHING;
