/* ============================================================================
   store.js — one state object, and an ACTION REGISTRY.

   WHY THE REGISTRY EXISTS
   The project's repeated failure is a button that clicks and does nothing. That
   is not a typo bug — it is a shape problem: a big mutable `S` plus a
   `renderAll()` means nothing forces a control to be wired.

   So here, every mutation goes through `act(name, arg)`. `act` is the ONLY
   writer of state. A control that calls a name the registry does not have
   throws loudly in development AND renders a visible failure in the UI, rather
   than dying quietly. That makes "every control calls an action" checkable
   rather than aspirational.
   ========================================================================= */

(function (global) {
  'use strict';

  var D = global.ISO_DEMO;

  /* ── State ────────────────────────────────────────────────────────────── */

  var S = {
    route: '/dashboard',
    theme: 'light',            // the app renders LIGHT; observed
    density: 'comfortable',    // observed on <html>
    dyslexia: false,
    performance: 'standard',

    examsTab: 'all',
    examsView: 'grid',
    examType: 'dday',
    examsSort: 'Soonest',
    examsQuery: '',

    tasksView: 'table',
    tasksFilter: 'All Tasks',
    tasksSort: 'Priority',

    communityTab: 'overview',
    settingsGroup: 'Profile',
    settingsQuery: '',
    searchQuery: '',

    focus: Object.assign({}, D.focus),
    timerHandle: null,

    tasks: D.tasks.slice(),
    exams: D.exams.slice(),

    dialog: null,              // { title, sub, body, actions }
    toasts: [],
    teaserDismissed: false,
    tourSeen: false,
    booted: false
  };

  /* ── Registry ─────────────────────────────────────────────────────────── */

  var actions = {};
  var missing = [];

  function act(name, arg) {
    var fn = actions[name];
    if (typeof fn !== 'function') {
      // Loud, visible, and recorded. Never a silent no-op.
      missing.push(name);
      var err = new Error('No action registered: ' + name);
      if (global.console) console.error('[preview]', err.message);
      toast('Action missing: ' + name, 'bad');
      return false;
    }
    var before = S.route;
    fn(arg);
    if (S.route !== before || S.__forceRender) { S.__forceRender = false; render(); }
    else render();
    return true;
  }

  function define(map) {
    Object.keys(map).forEach(function (k) { actions[k] = map[k]; });
  }

  /* ── Derived ──────────────────────────────────────────────────────────── */

  function examsFor(tab) {
    if (tab === 'all') return S.exams.filter(function (e) { return e.status !== 'archived'; });
    return S.exams.filter(function (e) {
      if (tab === 'awaiting_result') return e.status === 'pending_result' || e.status === 'result_ready';
      return e.status === tab;
    });
  }

  function tasksFor() {
    var out = S.tasks.slice();
    if (S.tasksFilter === 'Incomplete') out = out.filter(function (t) { return t.status !== 'done'; });
    if (S.tasksFilter === 'Today and overdue') out = out.filter(function (t) { return t.due === 'Today'; });
    var by = { p1: 0, p2: 1, p3: 2, p4: 3 };
    if (S.tasksSort === 'Priority') out.sort(function (a, b) { return by[a.priority] - by[b.priority]; });
    if (S.tasksSort === 'Due Date') {
      var rank = { Today: 0, Tomorrow: 1 };
      out.sort(function (a, b) {
        return (rank[a.due] === undefined ? 9 : rank[a.due]) - (rank[b.due] === undefined ? 9 : rank[b.due]);
      });
    }
    if (S.tasksSort === 'Title') out.sort(function (a, b) { return a.title.localeCompare(b.title); });
    return out;
  }

  function stats() {
    var done = S.tasks.filter(function (t) { return t.status === 'done'; }).length;
    var planned = S.tasks.filter(function (t) { return t.status !== 'done'; })
                         .reduce(function (n, t) { return n + t.effort; }, 0);
    var focused = D.series.reduce(function (a, b) { return a + b; }, 0);
    return { done: done, total: S.tasks.length, planned: planned, focused: focused };
  }

  /* ── Toast ────────────────────────────────────────────────────────────── */

  var EXAM_TYPE_LABEL = {
    dday: 'D-Day Exam', mock: 'Full Mock', sectional: 'Sectional Test', practice: 'Practice'
  };

  /* Turn <input type=date> "2026-10-30" into the "Oct 30, 2026" shape the
     rest of the app uses, so a scheduled exam matches existing rows. */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function prettyDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return 'Oct 30, 2026';
    var mo = parseInt(m[2], 10);
    return (MONTHS[mo - 1] || 'Oct') + ' ' + parseInt(m[3], 10) + ', ' + m[1];
  }

  function toast(text, kind) {
    var id = Date.now() + Math.random();
    S.toasts.push({ id: id, text: text, kind: kind || 'ok' });
    setTimeout(function () {
      S.toasts = S.toasts.filter(function (t) { return t.id !== id; });
      render();
    }, 3200);
  }

  /* ── Actions ──────────────────────────────────────────────────────────── */

  define({
    /* Navigating to the route you are already on announces itself instead of
       silently doing nothing — a nav tile that looks dead is the defect class
       this build exists to prevent. */
    navigate: function (r) {
      if (S.route === r) { toast('Already on ' + r); return; }
      S.route = r;
    },

    'theme.toggle': function () {
      S.theme = S.theme === 'light' ? 'dark' : 'light';
      toast('Switched to ' + S.theme + ' mode');
    },

    'theme.set': function (v) { S.theme = v; },

    'density.set': function (v) { S.density = v; toast('Density: ' + v); },
    'dyslexia.toggle': function () { S.dyslexia = !S.dyslexia; toast('Dyslexia font ' + (S.dyslexia ? 'on' : 'off')); },
    'performance.set': function (v) { S.performance = v; toast('Performance: ' + v); },

    /* Dashboard */
    'exams.select': function (id) { toast('Exam workspace: ' + id); },
    'exams.add': function () { openCreateExam(); },
    'dashboard.customize': function () {
      openDialog({
        title: 'Customize your dashboard',
        sub: 'Saved automatically for this exam workspace',
        body: dashboardCustomizerBody,
        actions: [{ label: 'Done', primary: true, act: 'dialog.close' }]
      });
    },
    'dashboard.plan.create': function () { toast('Today’s plan created'); S.__forceRender = true; },
    'dashboard.rebalance': function () { toast('Today’s plan rebalanced'); },
    'dashboard.startSession': function () { S.route = '/focus'; },
    'dashboard.switchActivity': function () { toast('Activity switched'); },
    'dashboard.insight.open': function (id) { toast('Insight: ' + id); },
    'widget.toggle': function (id) { toast('Toggled widget: ' + id); },
    'widget.move': function (arg) { toast('Moved ' + arg.id + (arg.dir === 'up' ? ' up' : ' down')); },
    'density.toggle': function () {
      S.density = S.density === 'comfortable' ? 'compact' : 'comfortable';
      toast('Density: ' + S.density);
    },

    /* Search / notifications */
    'search.open': function () {
      openDialog({ title: 'Search study map', sub: 'Search across your current study workspace.', body: searchBody, actions: [{ label: 'Close', act: 'dialog.close' }] });
    },
    // The top-bar search is a real control, so it gets a real action: typing
    // filters live and opens the workspace search. The build's own self-check
    // caught this input having no action at all — which is exactly what it is for.
    'search.query': function (q) {
      S.searchQuery = String(q == null ? '' : q);
      if (S.searchQuery.length > 1) {
        openDialog({
          title: 'Search study map',
          sub: 'Search across your current study workspace.',
          body: searchBody,
          actions: [{ label: 'Close', act: 'dialog.close' }]
        });
      }
    },
    'notifications.open': function () {
      openDialog({
        title: 'Notifications',
        sub: 'Nothing needs your attention.',
        body: notificationsBody,
        actions: [
          { label: 'Mark all read', act: 'notifications.clear' },
          { label: 'Close', primary: true, act: 'dialog.close' }
        ]
      });
    },
    'notifications.clear': function () { toast('All notifications marked read'); dialog.close(); },
    'storage.open': function () {
      openDialog({ title: 'Storage safety status', sub: 'Local-first storage health', body: storageBody, actions: [{ label: 'Close', primary: true, act: 'dialog.close' }] });
    },
    'updates.open': function () {
      openDialog({ title: 'Product updates', sub: 'What shipped recently', body: updatesBody, actions: [{ label: 'Close', primary: true, act: 'dialog.close' }] });
    },

    /* Exams */
    'exams.tab': function (id) { S.examsTab = id; },
    'exams.view': function (v) { S.examsView = v; },
    'exams.sort': function (v) { S.examsSort = v; toast('Sort: ' + v); },
    'exams.search': function (q) { S.examsQuery = q; },
    'exams.filter': function () { toast('Filter panel'); },
    'exams.schedule': function () { openCreateExam(); },
    'exams.logScore': function (id) {
      var e = S.exams.filter(function (x) { return x.id === id; })[0];
      if (e) toast('Logged a score for ' + e.title);
    },

    /* Tasks */
    'tasks.view': function (v) { S.tasksView = v; },
    'tasks.filter': function (v) { S.tasksFilter = v; },
    'tasks.sort': function (v) { S.tasksSort = v; toast('Sort: ' + v); },
    'tasks.status.set': function (arg) {
      var t = S.tasks.filter(function (x) { return x.id === arg.id; })[0];
      if (!t) return;
      t.status = arg.status;
      toast(t.status === 'done' ? 'Task marked finished.' : 'Task moved to ' + arg.status);
    },
    'tasks.priority.set': function (arg) {
      var t = S.tasks.filter(function (x) { return x.id === arg.id; })[0];
      if (!t) return;
      t.priority = arg.priority;
      toast('Priority set to ' + arg.priority.toUpperCase());
    },
    'tasks.add': function () {
      S.tasks.unshift({ id: 't' + (S.tasks.length + 1), title: 'New task', subject: 'Physics', status: 'todo', priority: 'p3', effort: 45, done: 0, due: 'Today' });
      toast('Task added');
    },
    'tasks.delete': function (id) {
      S.tasks = S.tasks.filter(function (x) { return x.id !== id; });
      toast('Task deleted');
    },

    /* Focus */
    'focus.start': function () {
      S.focus.running = true;
      if (S.timerHandle) clearInterval(S.timerHandle);
      S.timerHandle = setInterval(function () { S.focus.elapsed += 1; render(); }, 1000);
      toast('Focus session started');
    },
    'focus.pause': function () {
      S.focus.running = false;
      if (S.timerHandle) { clearInterval(S.timerHandle); S.timerHandle = null; }
      toast('Session paused. Your context is saved.');
    },
    'focus.reset': function () {
      S.focus.running = false; S.focus.elapsed = 0;
      if (S.timerHandle) { clearInterval(S.timerHandle); S.timerHandle = null; }
      toast('Timer reset');
    },
    'focus.skip': function () { S.focus.elapsed = 0; toast('Skipped'); },
    'focus.plus5': function () { S.focus.elapsed += 300; toast('Added 5 minutes'); },
    'focus.minus5': function () { S.focus.elapsed = Math.max(0, S.focus.elapsed - 300); toast('Subtracted 5 minutes'); },
    'focus.sound': function (id) { S.focus.sound = id; toast('Ambient sound: ' + id); },
    'focus.mode': function (m) { S.focus.mode = m; toast('Mode: ' + m); },
    'focus.breath': function () { toast('Take a breath'); S.route = '/focus'; },
    'focus.pad': function (v) {
      S.focus.pad = v;
      if (v && v.trim()) toast('Parked ' + v.trim().split(/\s+/).length + ' thought(s). It leaves your screen.');
    },
    'focus.log': function () {
      openDialog({
        title: 'Session complete',
        sub: 'Log this session so it counts toward your goals.',
        body: sessionLogBody,
        actions: [
          { label: 'Cancel', act: 'dialog.close' },
          { label: 'Save session', primary: true, act: 'focus.log.save' }
        ]
      });
    },
    'focus.log.mood': function (i) {
      S.focusLogMood = Number(i) || 0;
      S.__forceRender = true;
      dialog.close();
      openDialog({
        title: 'Log your session',
        sub: 'Tell us what you just finished',
        body: sessionLogBody,
        actions: [{ label: 'Save session', primary: true, act: 'focus.log.save' }]
      });
    },
    'focus.log.save': function () {
      S.focus.elapsed = 0; S.focus.running = false;
      if (S.timerHandle) { clearInterval(S.timerHandle); S.timerHandle = null; }
      dialog.close();
      toast('Session saved');
    },

    /* Syllabus */
    'syllabus.create': function () {
      openDialog({
        title: 'Create Subject',
        sub: 'Organize your knowledge base',
        body: subjectFormBody,
        actions: [
          { label: 'Cancel', act: 'dialog.close' },
          { label: 'Create Subject', primary: true, act: 'syllabus.create.save' }
        ]
      });
    },
    'syllabus.create.save': function () {
      var n = (document.getElementById('subject-name') || {}).value || 'New Subject';
      D.subjects.push({ id: 's' + D.subjects.length, name: n, icon: '📘', hex: '#8b5cf6', chapters: 0, topics: 0, done: 0 });
      dialog.close();
      toast('Subject created: ' + n);
    },
    'syllabus.template': function () { toast('Syllabus template loaded'); },

    /* Community */
    'community.tab': function (id) { S.communityTab = id; },
    'community.createGroup': function () { toast('Create group'); },
    'community.refresh': function () { toast('Community refreshed'); },
    'community.startFocus': function () { S.route = '/focus'; },
    'community.privacy': function () { toast('Privacy and sharing'); },
    'community.addBuddy': function () { toast('Buddy request sent'); },
    'community.join': function (id) { toast('Joined ' + id); },

    /* Settings */
    'settings.group': function (g) {
      if (S.settingsGroup === g) { toast('Already showing ' + g); return; }
      S.settingsGroup = g;
    },
    'settings.set': function (arg) {
      for (var i = 0; i < D.SETTINGS_GROUPS.length; i++) {
        var rows = D.settings[D.SETTINGS_GROUPS[i]] || [];
        for (var j = 0; j < rows.length; j++) {
          if (rows[j].id === arg.id) { rows[j].value = arg.value; toast(rows[j].label + ' saved'); return; }
        }
      }
      toast('Unknown setting: ' + arg.id);
    },
    'settings.choice': function (arg) { act('settings.set', arg); },
    'settings.search': function (q) { S.settingsQuery = String(q == null ? '' : q); S.__forceRender = true; },
    'settings.save': function () { toast('Settings saved'); },
    'settings.link': function (v) { toast(v); },

    /* Onboarding */
    'onboarding.name': function (v) { S.draftName = v; },
    'onboarding.avatar': function (n) { toast('Avatar ' + n + ' selected'); },
    'onboarding.pickExam': function (id) { toast('Exam selected: ' + id); },
    'onboarding.pickSubject': function (id) { toast('Subject selected: ' + id); },

    /* Explanations and informational affordances. A "?" popover and a disabled
       Setup AI button look alive and are NOT: clicking them did nothing, which is
       the exact defect class this build is supposed to make impossible. So each
       one now has a real effect — a popover, a toast, or honest navigation. */
    /* Account avatar — opens a real panel. It used to be data-act="noop", which is a
       control that looks alive and is not. */
    'account.open': function () {
      openDialog({
        title: global.ISO_DEMO.NAME,
        sub: 'Demo profile · every figure on this page is synthetic',
        body: '<div class="stack">' +
          '<div class="rowfield"><span class="rowfield__name">App mode</span>' +
            '<div class="tabs">' +
              '<button class="tab" aria-selected="true" data-act="settings.set" data-arg=\'' +
                d.arg({ id: 'appMode', value: 'full' }) + '\'>Full Mode</button>' +
              '<button class="tab" aria-selected="false" data-act="settings.set" data-arg=\'' +
                d.arg({ id: 'appMode', value: 'simple' }) + '\'>Simple Mode</button>' +
            '</div></div>' +
          '<div class="rowfield"><span class="rowfield__name">Display name</span>' +
            '<input class="input" style="height:40px;width:200px" data-text="displayName" ' +
            'value="' + d.esc(global.ISO_DEMO.NAME) + '"></div>' +
          '<div class="rowfield"><span class="rowfield__name">Data</span>' +
            d.btn('Open settings', 'navigate', '/settings', { cls: 'btn--sm' }) + '</div>' +
          '</div>',
        actions: [
          { label: 'Sign out', act: 'account.signout' },
          { label: 'Done', primary: true, act: 'dialog.close' }
        ]
      });
    },
    'account.signout': function () {
      dialog.close();
      S.route = '/onboarding';
      toast('Signed out. This is a demo — no session was destroyed.');
    },

    explain: function (key) {
      var COPY = {
        todayPlan: {
          title: 'How Today’s plan is calculated',
          body: 'Task time left = Σ max(estimate − linked focus, 0). ' +
                'Your first three priorities stay visible on Today. ' +
                'Calculated locally from tracked records · Updated when your data changes.'
        },
        examProgress: {
          title: 'How exam progress is calculated',
          body: 'Pace gap = syllabus completion − expected progress. ' +
                'Missing inputs stay labelled as unknown; they are never treated as zero or complete. ' +
                'Calculated locally from tracked records.'
        },
        subjectProgress: {
          title: 'Subject progress and status',
          body: 'Subject % = average tracked chapter completion. ' +
                'Calculated locally from tracked records.'
        },
        setupAI: {
          title: 'Setup AI',
          body: 'The AI Assistant needs a provider key before it can plan sessions or revise ' +
                'weak chapters. Connect one in Settings › AI Features.'
        },
        taskTime: {
          title: 'How task progress is calculated',
          body: 'Task progress = linked focus minutes ÷ task estimate. ' +
                'Add an estimate and link focus time to see a percentage.'
        },
        habits: { title: 'Daily Habits', body: 'Habits track a streak of days you complete them. Add one to start a streak.' },
        addChapter: { title: 'Add chapter', body: 'Chapters group the topics you track inside a subject.' },
        addGoal: { title: 'Session goals', body: 'Add tasks to your session, or write a mini-goal, to track what this focus block is for.' },
        uploadPhoto: { title: 'Upload photo', body: 'Upload or pick an avatar from the grid above.' },
        chooseIcon: { title: 'Choose icon', body: 'Icons appear next to your subject everywhere in Isotope.' },
        analysis: {
          title: 'Why these numbers',
          body: 'Accuracy, consistency and exam pressure are computed from the sample sessions ' +
                'and exam results in this preview. Every figure is synthetic.'
        },
        syllabusTab: { title: 'Syllabus views', body: 'Syllabus, Templates, Tracking, Saved Resources, Chapters and Coverage are views over the same subject data.' },
        progressTab: { title: 'Progress views', body: 'Today, Weekly, Monthly, Yearly, Subjects, Tasks and Activity Log are scopes over the same activity data.' },
        studyBlock: { title: 'Focus block', body: 'A focus block is one Pomodoro at your configured focus length.' }
      };
      var c = COPY[key] || { title: key, body: 'No description available.' };
      openDialog({ title: c.title, sub: 'IsotopeAI · sample data', body: '<p style="color:var(--ink-muted)">' + c.body + '</p>',
        actions: [{ label: 'Close', primary: true, act: 'dialog.close' }] });
    },

    /* Teaser + misc */
    'teaser.dismiss': function () { S.teaserDismissed = true; toast('Hidden. It will not come back.'); },
    'teaser.enter': function () { toast('Welcome to Isotope'); },
    /* A no-op that still tells the user something. Kept only where a control is
       genuinely informational, and even then it says so instead of silently
       doing nothing. */
    noop: function () { toast('Nothing to do here yet.'); }
  });

  /* ── Dialog plumbing ───────────────────────────────────────────────────── */

  var dialog = {
    open: function (cfg) { S.dialog = cfg; },
    close: function () { S.dialog = null; }
  };
  define({ 'dialog.close': function () { dialog.close(); } });

  function openDialog(cfg) { dialog.open(cfg); }
  function openCreateExam() {
    openDialog({
      title: 'Schedule Exam',
      sub: 'Every exam belongs to a workspace. You can change this later.',
      body: examFormBody,
      actions: [
        { label: 'Cancel', act: 'dialog.close' },
        { label: 'Schedule Exam', primary: true, act: 'exams.create.save' }
      ]
    });
  }
  define({
    'exams.create.save': function () {
      var t = (document.getElementById('exam-title') || {}).value || 'New exam';
      var kind = S.examType || 'dday';
      var dateVal = (document.getElementById('exam-date') || {}).value;
      S.exams.unshift({ id: 'ex' + (S.exams.length + 1), title: t, status: 'upcoming',
                        type: kind, priority: 'medium',
                        date: dateVal ? prettyDate(dateVal) : 'Oct 30, 2026',
                        progress: 0, syllabus: 0 });
      S.examType = 'dday';
      dialog.close();
      toast('Exam scheduled: ' + t + ' · ' + EXAM_TYPE_LABEL[kind]);
    }
  });
  define({
    'exams.type.set': function (kind) {
      S.examType = kind;
      render();
      toast('Type: ' + EXAM_TYPE_LABEL[kind]);
    }
  });

  /* ── Dialog bodies (real controls, each wired to an action) ─────────────── */

  function dashboardCustomizerBody() {
    var rows = [
      { id: 'priorityBriefing',  name: 'What needs attention', lock: true },
      { id: 'examPulse',         name: 'Exam progress' },
      { id: 'subjectAttention',  name: 'Subject progress' },
      { id: 'upcoming',          name: 'Coming up' }
    ];
    return '<div class="stack">' +
      '<div class="row row--between"><span class="label">Density</span>' +
        '<div class="tabs">' +
          '<button class="tab" aria-selected="' + (S.density !== 'compact') + '" data-act="density.toggle">Comfortable</button>' +
          '<button class="tab" aria-selected="' + (S.density === 'compact') + '" data-act="density.toggle">Compact</button>' +
        '</div></div>' +
      '<div class="row row--between"><span class="label">Change app theme</span>' +
        '<div class="tabs">' +
          '<button class="tab" aria-selected="' + (S.theme === 'light') + '" data-act="theme.set" data-arg="light">Light</button>' +
          '<button class="tab" aria-selected="' + (S.theme === 'dark') + '" data-act="theme.set" data-arg="dark">Dark</button>' +
        '</div></div>' +
      '<div><p class="eyebrow">Dashboard sections <span class="sample">Required</span></p>' +
      rows.map(function (r, i) {
        return '<div class="rowfield">' +
          '<div><div class="rowfield__name">' + r.name + '</div>' +
            (r.lock ? '<div class="rowfield__desc">Protected by the recommended decision hierarchy</div>' : '') + '</div>' +
          '<div class="row">' +
            '<button class="iconbtn" aria-label="Move ' + r.name + ' up" data-act="widget.move" data-arg=\'' + JSON.stringify({ id: r.id, dir: 'up' }) + '\' ' + (i === 0 ? 'disabled' : '') + '>↑</button>' +
            '<button class="iconbtn" aria-label="Move ' + r.name + ' down" data-act="widget.move" data-arg=\'' + JSON.stringify({ id: r.id, dir: 'down' }) + '\'>↓</button>' +
            '<button class="switch" role="switch" aria-checked="true" aria-label="Show ' + r.name + '" data-act="widget.toggle" data-arg="' + r.id + '"></button>' +
          '</div></div>';
      }).join('') + '</div></div>';
  }

  function searchBody() {
    var rows = D.tasks.slice(0, 5).map(function (t) {
      return '<button class="tile" data-act="navigate" data-arg="/tasks">' +
        '<div class="tile__row"><span class="tile__name">' + t.title + '</span>' +
        '<span class="badge">' + t.subject + '</span></div>' +
        '<div class="tile__meta">Task · ' + t.subject + '</div></button>';
    }).join('');
    return '<label class="sr-only" for="q">Search tasks, chapters, and exams</label>' +
      '<input class="input" id="q" placeholder="Search tasks, chapters, exams…" style="margin-bottom:12px">' +
      '<div class="stack">' + rows + '</div>';
  }

  function notificationsBody() {
    return '<p style="color:var(--ink-muted);margin:0">Nothing needs your attention.</p>';
  }
  function storageBody() {
    return '<div class="stack">' +
      '<div class="rowfield"><span class="rowfield__name">Local cache</span><span class="badge badge--brand">Healthy</span></div>' +
      '<div class="rowfield"><span class="rowfield__name">Last cloud sync</span><span class="badge">Just now</span></div>' +
      '<div class="rowfield"><span class="rowfield__name">Mode</span><span class="badge">Local</span></div></div>';
  }
  function updatesBody() {
    return '<div class="stack">' +
      '<div class="rowfield"><span class="rowfield__name">Chapter focus view</span><span class="badge badge--brand">New</span></div>' +
      '<div class="rowfield"><span class="rowfield__name">Keyboard shortcuts</span><span class="badge">New</span></div>' +
      '<div class="rowfield"><span class="rowfield__name">Simpler task board</span><span class="badge">Improved</span></div></div>';
  }
  function sessionLogBody() {
    var moods = ['Not productive', 'Distracted', 'Focused', 'Flow State', 'Very productive'];
    return '<div class="stack">' +
      '<label class="label">What are you working on?</label>' +
      '<input class="input" data-text="focus.log.note" placeholder="e.g. Rotational motion — NUMPY questions">' +
      '<label class="label">How productive was it?</label>' +
      '<div class="tabs" role="tablist">' +
        moods.map(function (x, i) {
          return '<button class="tab" role="tab" aria-selected="' + (i === (S.focusLogMood || 2)) +
            '" data-act="focus.log.mood" data-arg="' + i + '">' + x + '</button>';
        }).join('') +
      '</div></div>';
  }
  function subjectFormBody() {
    return '<div class="stack">' +
      '<label class="label">Subject name</label>' +
      '<input class="input" id="subject-name" placeholder="e.g. Physics" maxlength="32">' +
      '<p class="hint">Choose a name and avatar. These are used across your workspace and community profile.</p>' +
      '<label class="label">Iconography</label>' +
      '<div class="row">' + ['⚛️', '🧪', '📐', '📘', '🧬', '🌍'].map(function (e) {
        return '<button class="chip" data-act="onboarding.avatar" data-arg="' + e + '">' + e + '</button>';
      }).join('') + '</div></div>';
  }
  function examFormBody() {
    var cur = S.examType || 'dday';
    return '<div class="stack">' +
      '<label class="label">Title</label>' +
      '<input class="input" id="exam-title" placeholder="e.g. JEE Mains January Session">' +
      '<label class="label">Exam type</label>' +
      '<div class="tabs">' +
        [['dday', 'D-Day Exam'], ['mock', 'Full Mock'], ['sectional', 'Sectional Test'], ['practice', 'Practice']].map(function (t) {
          return '<button class="tab" aria-selected="' + (t[0] === cur) + '" ' +
            'data-act="exams.type.set" data-arg="' + t[0] + '">' + t[1] + '</button>';
        }).join('') +
      '</div>' +
      '<label class="label">Date</label><input class="input" id="exam-date" type="date" value="2026-10-30">' +
      '</div>';
  }

  /* ── Render hook, wired by views.js ───────────────────────────────────── */
  var render = function () {};
  function setRender(fn) { render = fn; }

  /* Mirror state onto <html> exactly as the real app does. */
  function syncAttrs() {
    var h = document.documentElement;
    h.setAttribute('data-density', S.density);
    h.setAttribute('data-dyslexia-font', S.dyslexia ? 'enabled' : 'disabled');
    h.setAttribute('data-performance', S.performance);
    h.setAttribute('data-theme', S.theme);
  }

  global.PV = {
    S: S, act: act, define: define, toast: toast, dialog: dialog,
    openDialog: openDialog, setRender: setRender, syncAttrs: syncAttrs,
    derived: { examsFor: examsFor, tasksFor: tasksFor, stats: stats },
    missing: function () { return missing.slice(); }
  };
})(window);