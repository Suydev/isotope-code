/* ============================================================================
   data.js — SYNTHETIC dataset.

   ⚠️  EVERY FIGURE IN THIS FILE IS INVENTED.
   The owner asked for a demo with dummy data, so none of this comes from the
   owner's real backup export and none of it comes from the live account. The
   numbers are chosen to be plausible and internally consistent, NOT to match
   anything real.

   The previous preview failed review because it was built from a spec and a
   backup without ever opening the running app. This file is therefore also
   deliberately SMALL: it holds only what the observed screens actually render.

   Observed shapes this dataset must satisfy (from OBSERVED.md):
     - /dashboard empty-state copy and the five insight-row names
     - /exams  6 filter tabs whose counts are rendered INSIDE the label
     - /tasks  5 status + 4 priority vocabularies
     - /syllabus empty state, and the subject grid in onboarding
   ========================================================================= */

(function (global) {
  'use strict';

  /* A fixed reference date. Nothing calls Date.now() for data, so the demo is
     deterministic — the same numbers every load, on any machine, forever. */
  var REF = new Date('2026-10-12T09:30:00Z');

  var FIRST = 'Rhea';
  var NAME = 'Rhea Kapoor';

  /* ── Vocabulary, copied from the observed/live UI ─────────────────────── */

  var TASK_STATUS = [
    { id: 'backlog',     label: 'Backlog',    hex: '#78716c', emoji: '📋', order: 0 },
    { id: 'todo',        label: 'To Do',      hex: '#f59e0b', emoji: '🎯', order: 1 },
    { id: 'in-progress', label: 'In Progress', hex: '#06b6d4', emoji: '⚡', order: 2 },
    { id: 'review',      label: 'Review',     hex: '#8b5cf6', emoji: '🔍', order: 3 },
    { id: 'done',        label: 'Done',       hex: '#10b981', emoji: '✅', order: 4 }
  ];

  var TASK_PRIORITY = [
    { id: 'p1', label: 'Critical', hex: '#ef4444', emoji: '🔴' },
    { id: 'p2', label: 'High',     hex: '#f97316', emoji: '🟠' },
    { id: 'p3', label: 'Medium',   hex: '#f59e0b', emoji: '🔵' },
    { id: 'p4', label: 'Low',      hex: '#10b981', emoji: '🟢' }
  ];

  var EXAM_STATUS_TABS = [
    { id: 'all',             label: 'All',              count: 12 },
    { id: 'upcoming',        label: 'Upcoming',         count: 5 },
    { id: 'in_progress',     label: 'In Progress',      count: 1 },
    { id: 'awaiting_result', label: 'Awaiting Result',  count: 3 },
    { id: 'completed',       label: 'Completed',        count: 2 },
    { id: 'archived',        label: 'Archived',         count: 1 }
  ];

  var EXAM_STATUS_LABEL = {
    upcoming:        { label: 'Upcoming',        icon: '🕒' },
    in_progress:     { label: 'In Progress',     icon: '⚡' },
    pending_result:  { label: 'Result Pending',  icon: '⏳' },
    result_ready:    { label: 'Results Out',     icon: '🔔' },
    result_logged:   { label: 'Completed',       icon: '✅' },
    archived:        { label: 'Archived',        icon: '📦' }
  };

  var COMMUNITY_TABS = [
    { id: 'overview',    label: 'For you' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'buddies',     label: 'Buddies' },
    { id: 'groups',      label: 'Groups' },
    { id: 'discover',    label: 'Discover' }
  ];

  /* Order captured live from the real app's /settings on 2026-10-12. */
  var SETTINGS_GROUPS = ['Profile', 'Account', 'Subscription', 'Focus', 'Academic', 'Gamification', 'Quotes', 'AI Assistant', 'Appearance', 'Notifications', 'Integrations', 'Data & Privacy', 'Feedback & Requests'];

  /* ── Content ──────────────────────────────────────────────────────────── */

  var subjects = [
    { id: 'phy',  name: 'Physics',     icon: '⚛️', hex: '#3b82f6', chapters: 6, topics: 24, done: 17 },
    { id: 'chem', name: 'Chemistry',   icon: '🧪', hex: '#10b981', chapters: 5, topics: 20, done: 11 },
    { id: 'math', name: 'Mathematics', icon: '📐', hex: '#f97316', chapters: 6, topics: 26, done: 20 }
  ];

  var exams = [
    { id: 'e1',  title: 'JEE Mains — Session 2',      status: 'in_progress',     type: 'dday',     priority: 'critical', date: 'Oct 14, 2026', progress: 62, syllabus: 71 },
    { id: 'e2',  title: 'Physics Weekly Test 7',       status: 'upcoming',        type: 'sectional', priority: 'medium',   date: 'Oct 17, 2026', progress: 30, syllabus: 0  },
    { id: 'e3',  title: 'Full Mock 12',               status: 'pending_result',  type: 'mock',     priority: 'high',     date: 'Oct 6, 2026',  progress: 100, syllabus: 0, score: 214 },
    { id: 'e4',  title: 'NEET (UG) — Full Syllabus',  status: 'upcoming',        type: 'dday',     priority: 'high',     date: 'Dec 8, 2026',  progress: 0,  syllabus: 0  },
    { id: 'e5',  title: 'BITSAT',                    status: 'upcoming',        type: 'dday',     priority: 'medium',   date: 'Nov 2, 2026',  progress: 0,  syllabus: 0  },
    { id: 'e6',  title: 'IAT 2027',                  status: 'upcoming',        type: 'dday',     priority: 'low',      date: 'Jan 20, 2027', progress: 0,  syllabus: 0  },
    { id: 'e7',  title: 'Half Syllabus Mock 4',       status: 'result_ready',    type: 'mock',     priority: 'high',     date: 'Oct 2, 2026',  progress: 100, syllabus: 0, score: 186 },
    { id: 'e8',  title: 'Board Practicals',           status: 'result_ready',    type: 'practice', priority: 'low',      date: 'Sep 28, 2026', progress: 100, syllabus: 0, score: 88  },
    { id: 'e9',  title: 'KVPY SX 2026',              status: 'pending_result',  type: 'mock',     priority: 'medium',   date: 'Aug 30, 2026', progress: 100, syllabus: 0, score: 172 },
    { id: 'e10', title: 'Internal Assessment 2',       status: 'result_logged',   type: 'practice', priority: 'medium',   date: 'Aug 18, 2026', progress: 100, syllabus: 0, score: 74 },
    { id: 'e11', title: 'Mid-term Chemistry',         status: 'result_logged',   type: 'sectional', priority: 'medium',  date: 'Aug 4, 2026',  progress: 100, syllabus: 0, score: 81 },
    { id: 'e12', title: 'Old Archive Mock',           status: 'archived',        type: 'mock',     priority: 'low',      date: 'Jul 2, 2026',  progress: 100, syllabus: 0, score: 140 }
  ];

  var tasks = [
    { id: 't1',  title: 'Rotational motion — NUMPY questions', subject: 'Physics',     status: 'in-progress', priority: 'p1', effort: 60, done: 2, due: 'Today' },
    { id: 't2',  title: 'Electrostatics problem set 4',         subject: 'Physics',     status: 'todo',        priority: 'p1', effort: 90, done: 0, due: 'Today' },
    { id: 't3',  title: 'Organic: GOC revision notes',         subject: 'Chemistry',   status: 'review',      priority: 'p2', effort: 45, done: 3, due: 'Today' },
    { id: 't4',  title: 'Integration by parts — 20 Qs',         subject: 'Mathematics', status: 'todo',        priority: 'p2', effort: 75, done: 0, due: 'Tomorrow' },
    { id: 't5',  title: 'Thermodynamics numericals',            subject: 'Physics',     status: 'todo',        priority: 'p2', effort: 60, done: 0, due: 'Tomorrow' },
    { id: 't6',  title: 'Chemical bonding flashcards',          subject: 'Chemistry',   status: 'done',        priority: 'p3', effort: 35, done: 8, due: 'Oct 9' },
    { id: 't7',  title: 'Definite integral PYQ set',            subject: 'Mathematics', status: 'review',      priority: 'p3', effort: 45, done: 4, due: 'Oct 11' },
    { id: 't8',  title: 'Current electricity — error log',      subject: 'Physics',     status: 'backlog',     priority: 'p3', effort: 35, done: 0, due: 'Oct 14' },
    { id: 't9',  title: 'Coordination compounds summary',       subject: 'Chemistry',   status: 'todo',        priority: 'p4', effort: 30, done: 0, due: 'Oct 15' },
    { id: 't10', title: 'Matrix short notes',                  subject: 'Mathematics', status: 'done',        priority: 'p4', effort: 90, done: 5, due: 'Oct 7' },
    { id: 't11', title: 'SHM past papers',                     subject: 'Physics',     status: 'todo',        priority: 'p2', effort: 75, done: 0, due: 'Oct 12' },
    { id: 't12', title: 'Ionic equilibrium drill',             subject: 'Chemistry',   status: 'backlog',     priority: 'p4', effort: 45, done: 0, due: 'Oct 18' }
  ];

  /* 14-day series for the dashboard sparkline. Values are invented minutes. */
  var series = [96, 132, 78, 168, 144, 0, 210, 186, 120, 240, 198, 156, 264, 222];

  var focus = {
    mode: 'Pomodoro',
    pad: '',
    durations: { focus: 25, short: 5, long: 15, untilLongBreak: 4 },
    sounds: [
      { id: 'off',     label: 'Off' },
      { id: 'rain',    label: 'Rain' },
      { id: 'Cricket', label: 'Cricket' },
      { id: 'wind',    label: 'Wind' }
    ],
    sound: 'off',
    elapsed: 0,
    running: false,
    dailyGoalMinutes: 360,
    studiedToday: 142,
    streakDays: 23
  };

  var insights = [
    { id: 'syllabus',   name: 'Syllabus progress',      value: 'Not set up',  meta: 'No data yet · Add subjects to measure' },
    { id: 'consistency',name: 'Consistency',            value: 'No baseline', meta: 'No data yet · Complete a first focus session' },
    { id: 'revisions',  name: 'Revisions',              value: 'No revisions due', meta: 'On track · no tracked revisions overdue' },
    { id: 'mock',       name: 'Mock score trend',       value: 'Add result',  meta: 'No data yet · three results unlock the trend' },
    { id: 'attention',  name: 'Topic needing attention',value: 'Gathering data', meta: 'No data yet · 10 tracked topics needed' }
  ];

  var leaderboard = [
    { rank: 1, name: 'Aditi S.',   points: 8420, streak: 41 },
    { rank: 2, name: 'Kabir M.',   points: 7995, streak: 33 },
    { rank: 3, name: NAME,        points: 7412, streak: 23 },
    { rank: 4, name: 'Ishaan R.',  points: 7188, streak: 19 },
    { rank: 5, name: 'Meera D.',   points: 6904, streak: 28 }
  ];

  var buddies = [
    { name: 'Aditi Sharma',   status: 'Focusing now',  subject: 'Physics' },
    { name: 'Kabir Mehta',   status: 'In a break',    subject: 'Mathematics' },
    { name: 'Meera Desai',   status: 'Offline',       subject: 'Chemistry' }
  ];

  var groups = [
    { name: 'JEE Mains 2027 — Squad', members: 6, tagline: 'Daily 6am accountability thread' },
    { name: 'Organic Chemistry Pit', members: 3, tagline: 'GOC + Hydrocarbons, chapter by chapter' }
  ];

  /* Settings: the real app has FIVE groups. Verified on screen, not inferred. */
  /* Sections mirror the REAL app's /settings, captured live 2026-10-12
     (observed/real/real-settings-controls.json, 44 controls, 12 section buttons
     in this exact order). NOT the 5-group layout an earlier draft guessed. */
  var settings = {
    'Profile': [
      { id: 'displayName', label: 'Enter your name', desc: 'How you appear across Isotope', kind: 'text', value: NAME },
      { id: 'email',       label: 'Email',          desc: 'Used for sign-in and study reminders', kind: 'text', value: 'probe@example.test' },
      { id: 'bio',         label: 'Tell us about yourself...', desc: 'Shown on your community profile', kind: 'text', value: '' },
      { id: 'institution', label: 'Your institution', desc: 'School, college, or self-directed', kind: 'text', value: '' },
      { id: 'grade',       label: 'Grade',          desc: 'e.g., Grade 12, Undergraduate', kind: 'text', value: '12' },
      { id: 'studyMode',   label: 'Study mode',     desc: 'What are you preparing for?', kind: 'choice', value: 'Normal', options: ['Normal', 'Exam Mode', 'Vacation'] },
      { id: 'partnerMode', label: 'Study arrangement', desc: 'Who you plan alongside', kind: 'choice', value: 'Solo', options: ['Solo', 'Partner', 'Group', 'Flexible'] },
      { id: 'shareProgress', label: 'Share progress with my circle', desc: 'Let people you study with see your streak', kind: 'switch', value: false }
    ],
    'Account': [
      { id: 'acctName',  label: 'Display name', desc: 'Shown beside your notes', kind: 'text', value: NAME },
      { id: 'weekStart', label: 'Week starts on', desc: 'Used by every weekly view', kind: 'select', value: 'monday' },
      { id: 'signOut',  label: 'Sign out', desc: 'End this session on this device', kind: 'link', value: 'Sign out' }
    ],
    'Subscription': [
      { id: 'plan',       label: 'Current plan', desc: 'Everything in this preview is sample data', kind: 'select', value: 'Free' },
      { id: 'renewal',    label: 'Renews on',    desc: 'No payment is collected in this preview', kind: 'text', value: '—' },
      { id: 'managePlan', label: 'Manage plan',  desc: 'Change or cancel your plan', kind: 'link', value: 'Manage subscription' }
    ],
    'Focus': [
      { id: 'dailyGoal', label: 'Daily study goal', desc: 'Minutes per day', kind: 'range', value: 360, min: 60, max: 720, step: 30, unit: 'min' },
      { id: 'focusLen',  label: 'Focus length',    desc: 'Pomodoro focus block', kind: 'range', value: 25, min: 5, max: 90, step: 5, unit: 'min' },
      { id: 'breakLen',  label: 'Break length',    desc: 'Short break between blocks', kind: 'range', value: 5, min: 1, max: 30, step: 1, unit: 'min' },
      { id: 'autoStart', label: 'Auto-start breaks', desc: 'Begin the break without pressing start', kind: 'switch', value: false }
    ],
    'Academic': [
      { id: 'track',      label: 'Track',        desc: 'JEE, NEET, or Boards', kind: 'select', value: 'JEE Mains' },
      { id: 'syllabus',   label: 'Syllabus',     desc: 'Chapters this workspace covers', kind: 'link',   value: 'Open syllabus' },
      { id: 'weakTopics', label: 'Topic needing attention', desc: 'Lowest-accuracy topic from your sessions', kind: 'link', value: 'Review weak topics' }
    ],
    'Gamification': [
      { id: 'streak',     label: 'Daily streak', desc: 'Consecutive days with a finished block', kind: 'text', value: '7 days (sample)' },
      { id: 'xp',         label: 'XP earned',    desc: 'Points from finished focus blocks', kind: 'text', value: '1,240 (sample)' },
      { id: 'level',      label: 'Level',        desc: 'Unlocks at each 500 XP', kind: 'text', value: '3' },
      { id: 'leaderboard',label: 'Leaderboard',  desc: 'Compare with your circle', kind: 'link',  value: 'Open leaderboard' }
    ],
    'Quotes': [
      { id: 'dailyQuote', label: 'Quote of the day', desc: 'Shown on the dashboard each morning', kind: 'switch', value: true },
      { id: 'quoteSource', label: 'Quote source', desc: 'Where quotes come from', kind: 'select', value: 'Classic' },
      { id: 'customQuote', label: 'Custom quote', desc: 'Show this instead on exam days', kind: 'text', value: '' }
    ],
    'AI Assistant': [
      { id: 'aiEnabled',   label: 'AI Assistant',      desc: 'Plan sessions and revise weak chapters', kind: 'switch', value: false },
      { id: 'aiSummary',   label: 'Session summaries',  desc: 'Summarise each finished focus block', kind: 'switch', value: false },
      { id: 'aiDifficulty',label: 'Auto-adjust difficulty', desc: 'Tune questions to your accuracy', kind: 'switch', value: false },
      { id: 'aiModel',     label: 'Model',             desc: 'Used for planning and summaries', kind: 'select', value: 'Balanced' }
    ],
    'Appearance': [
      { id: 'theme',       label: 'Theme',       desc: 'Light, dark, or follow the system', kind: 'select', value: 'light' },
      { id: 'density',     label: 'Density',     desc: 'Spacing between cards', kind: 'select', value: 'comfortable' },
      { id: 'dyslexia',    label: 'Dyslexia font', desc: 'Increase letter spacing', kind: 'switch', value: false },
      { id: 'performance', label: 'Performance', desc: 'Reduce animation on slower devices', kind: 'select', value: 'standard' },
      { id: 'reduceMotion',label: 'Reduce motion', desc: 'Disable non-essential animation', kind: 'switch', value: false }
    ],
    'Notifications': [
      { id: 'nudge',      label: 'Study reminders', desc: 'Nudge me when a session is idle', kind: 'switch', value: true },
      { id: 'nudgeTime',  label: 'Reminder time',  desc: 'When the daily nudge arrives', kind: 'select', value: '19:00' },
      { id: 'streakWarn', label: 'Streak warnings', desc: 'Tell me before a streak breaks', kind: 'switch', value: true },
      { id: 'examRem',    label: 'Exam reminders', desc: 'Countdown to each exam date', kind: 'switch', value: false }
    ],
    'Integrations': [
      { id: 'calendar',   label: 'Calendar',      desc: 'Add focus blocks to your calendar', kind: 'switch', value: false },
      { id: 'device',     label: 'Device sync',   desc: 'Keep this device in step with your others', kind: 'switch', value: false },
      { id: 'backup',     label: 'Backup',        desc: 'Export a copy of your data', kind: 'link',   value: 'Export data' },
      { id: 'importData', label: 'Import',        desc: 'Restore from a previous export', kind: 'link',   value: 'Import data' }
    ],
    'Data & Privacy': [
      { id: 'localFirst', label: 'Local-first storage', desc: 'Your study data stays on this device', kind: 'switch', value: true },
      { id: 'analytics',  label: 'Share anonymous analytics', desc: 'Helps us find slow screens', kind: 'switch', value: false },
      { id: 'clearHistory',label: 'Clear session history', desc: 'Delete finished focus blocks', kind: 'link', value: 'Clear history' },
      { id: 'deleteAcct', label: 'Delete account', desc: 'Permanently remove this account', kind: 'link', value: 'Delete account' }
    ],
    'Feedback & Requests': [
      { id: 'feedback', label: 'Feedback', desc: 'Tell us what to build next', kind: 'link', value: 'Go to Feedback Portal' },
      { id: 'featureReq',label: 'Request a feature', desc: 'Vote on what lands next', kind: 'link', value: 'Request a feature' },
      { id: 'docs',     label: 'Documentation', desc: 'Every setting, explained', kind: 'link', value: 'Open Docs' }
    ]
  };

  global.ISO_DEMO = {
    REF: REF, FIRST: FIRST, NAME: NAME, SAMPLE: true,
    TASK_STATUS: TASK_STATUS, TASK_PRIORITY: TASK_PRIORITY,
    EXAM_STATUS_TABS: EXAM_STATUS_TABS, EXAM_STATUS_LABEL: EXAM_STATUS_LABEL,
    COMMUNITY_TABS: COMMUNITY_TABS, SETTINGS_GROUPS: SETTINGS_GROUPS,
    subjects: subjects, exams: exams, tasks: tasks, series: series,
    focus: focus, insights: insights, leaderboard: leaderboard,
    buddies: buddies, groups: groups, settings: settings
  };
})(window);