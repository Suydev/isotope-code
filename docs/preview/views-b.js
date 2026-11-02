/* ============================================================================
   views-b.js — tasks, exams, syllabus.

   Vocabularies (5 statuses, 4 priorities, 6 exam filter tabs) are the ones read
   off the live UI. Counts render INSIDE the tab label, exactly as observed.
   ========================================================================= */

(function (global) {
  'use strict';
  var d = global.D, S = global.PV.S, D_ = global.ISO_DEMO;

  /* ══ /tasks ════════════════════════════════════════════════════════════ */

  var TASK_VIEWS = [
    { id: 'table',      label: 'List',    aria: 'Switch to List view' },
    { id: 'board',      label: 'Board',   aria: 'Switch to Board view' },
    { id: 'eisenhower', label: 'Matrix',  aria: 'Switch to Matrix view' },
    { id: 'calendar',   label: 'Calendar',aria: 'Switch to Calendar view' },
    { id: 'zen',        label: 'Zen',     aria: 'Switch to Zen mode' }
  ];
  var TASK_FILTERS = ['All Tasks', 'Incomplete', 'Today and overdue'];
  var TASK_SORTS = ['Priority', 'Due Date', 'Date Created', 'Title', 'Status'];

  function statusOf(id) {
    return D_.TASK_STATUS.filter(function (s) { return s.id === id; })[0] || D_.TASK_STATUS[0];
  }
  function priorityOf(id) {
    return D_.TASK_PRIORITY.filter(function (p) { return p.id === id; })[0] || D_.TASK_PRIORITY[2];
  }

  function tasks() {
    var rows = global.PV.derived.tasksFor();
    var st = global.PV.derived.stats();

    var body;
    if (!rows.length) {
      body = d.empty('📋', 'No tasks to display', 'Try adjusting filters or create a new task',
                     d.btn('Add task', 'tasks.add', null, { cls: 'btn--primary' }));
    } else if (S.tasksView === 'board') {
      body = '<div class="stack">' + D_.TASK_STATUS.map(function (col) {
        var inCol = rows.filter(function (t) { return t.status === col.id; });
        return '<div><div class="row row--between" style="margin-bottom:8px">' +
          '<span class="eyebrow" style="margin:0">' + col.emoji + ' ' + col.label + '</span>' +
          d.badge(String(inCol.length)) + '</div>' +
          '<div class="stack" style="gap:8px">' +
            (inCol.length ? inCol.map(taskCard).join('') : '<p class="hint">Nothing here.</p>') +
          '</div></div>';
      }).join('') + '</div>';
    } else if (S.tasksView === 'eisenhower') {
      var quads = [
        { name: 'Do First',   test: function (t) { return t.priority === 'p1' && t.status !== 'done'; } },
        { name: 'Schedule',   test: function (t) { return t.priority === 'p2' && t.status !== 'done'; } },
        { name: 'Delegate',   test: function (t) { return t.priority === 'p3' && t.status !== 'done'; } },
        { name: 'Eliminate',  test: function (t) { return t.priority === 'p4' && t.status !== 'done'; } }
      ];
      body = '<div class="grid grid--2">' + quads.map(function (q) {
        var inQ = rows.filter(q.test);
        return d.card('<h3 class="card__title" style="font-size:var(--fs-h3)">' + q.name + '</h3>' +
          '<div class="stack" style="gap:8px;margin-top:10px">' +
          (inQ.length ? inQ.map(taskCard).join('') : '<p class="hint">Empty.</p>') + '</div>');
      }).join('') + '</div>';
    } else if (S.tasksView === 'calendar') {
      body = '<table class="table"><thead><tr><th>Task</th><th>Subject</th><th>Due</th><th class="num">Effort</th></tr></thead><tbody>' +
        rows.map(function (t) {
          return '<tr><td>' + d.esc(t.title) + '</td><td>' + d.esc(t.subject) + '</td><td>' + d.esc(t.due) + '</td>' +
            '<td class="num">' + t.effort + '</td></tr>';
        }).join('') + '</tbody></table>';
    } else if (S.tasksView === 'zen') {
      var open = rows.filter(function (t) { return t.status !== 'done'; });
      body = open.length
        ? '<div class="stack">' + open.map(function (t) {
            return d.card('<div class="row row--between">' +
              '<div><div style="font-weight:600">' + d.esc(t.title) + '</div>' +
              '<div class="hint">' + d.esc(t.subject) + ' · ' + t.effort + ' min</div></div>' +
              '<div class="row">' +
                d.btn('✓ Complete', 'tasks.status.set', { id: t.id, status: 'done' }, { cls: 'btn--sm' }) +
              '</div></div>');
          }).join('') + '</div>'
        : '<div class="empty"><h2 class="empty__title">✅ All Caught Up!</h2>' +
          '<p class="empty__body">You’ve cleared your focus queue. Take a break or add more tasks.</p>' +
          d.btn('Add task', 'tasks.add', null, { cls: 'btn--primary' }) + '</div>';
    } else {
      body = '<table class="table"><thead><tr><th>Task</th><th>Subject</th><th>Status</th><th>Priority</th>' +
             '<th class="num">Effort</th><th>Due</th><th></th></tr></thead><tbody>' +
        rows.map(function (t) {
          var s = statusOf(t.status), p = priorityOf(t.priority);
          return '<tr>' +
            '<td>' + d.esc(t.title) + '</td>' +
            '<td>' + d.esc(t.subject) + '</td>' +
            '<td><span class="badge" style="color:' + s.hex + '">' + s.emoji + ' ' + s.label + '</span></td>' +
            '<td><span class="badge" style="color:' + p.hex + '">' + p.emoji + ' ' + p.label + '</span></td>' +
            '<td class="num">' + t.effort + '</td>' +
            '<td>' + d.esc(t.due) + '</td>' +
            '<td><div class="row">' +
              D_.TASK_STATUS.map(function (ns) {
                return '<button class="btn btn--sm' + (ns.id === t.status ? ' btn--primary' : '') + '" ' +
                  'aria-label="Set ' + ns.label + '" data-act="tasks.status.set" ' +
                  'data-arg=\'' + d.arg({ id: t.id, status: ns.id }) + '\'>' + ns.emoji + '</button>';
              }).join('') +
              d.btn('🗑', 'tasks.delete', t.id, { aria: 'Delete task', cls: 'btn--sm' }) +
            '</div></td>' +
          '</tr>';
        }).join('') + '</tbody></table>';
    }

    return '<div class="page">' +
      '<div class="page__head"><div><h1 class="page__title">Today’s Focus</h1>' +
        '<p class="page__sub">' + st.done + ' of ' + st.total + ' done · ' + st.planned + ' min planned' + d.sample() + '</p></div>' +
        d.btn('Add task', 'tasks.add', null, { cls: 'btn--primary' }) + '</div>' +

      '<div class="row" style="margin-bottom:14px">' +
        '<div class="tabs">' + TASK_VIEWS.map(function (v) {
          return d.tab(v.label, 'tasks.view', v.id, S.tasksView === v.id);
        }).join('') + '</div>' +
        '<div class="spacer"></div>' +
        '<div class="tabs">' + TASK_FILTERS.map(function (f) {
          return d.tab(f, 'tasks.filter', f, S.tasksFilter === f);
        }).join('') + '</div>' +
      '</div>' +

      '<div class="row" style="margin-bottom:14px">' +
        '<span class="hint">Sort &amp; Group</span>' +
        '<div class="tabs">' + TASK_SORTS.map(function (s) {
          return d.tab(s, 'tasks.sort', s, S.tasksSort === s);
        }).join('') + '</div>' +
      '</div>' +

      '<div class="grid grid--dash">' +
        '<div>' + body + '</div>' +
        '<div class="stack">' +
          d.card('<p class="eyebrow">Daily Study Goal</p>' + d.bar(st.planned ? 55 : 0) +
                 '<p class="hint" style="margin-top:6px">' + st.focused + ' min focused this fortnight' + d.sample() + '</p>') +
          d.card('<p class="eyebrow">Weekly Capacity Check</p>' +
                 '<div class="rowfield"><span class="rowfield__name">Planned</span>' + d.badge(st.planned + ' min') + '</div>' +
                 '<div class="rowfield"><span class="rowfield__name">Due</span>' + d.badge(String(rows.length)) + '</div>' +
                 '<div class="rowfield"><span class="rowfield__name">Overdue</span>' + d.badge('0') + '</div>') +
          d.card('<p class="eyebrow">Daily Habits</p>' +
                 '<p class="card__sub">No habits yet — add one!</p>' +
                 '<div style="margin-top:10px">' + d.btn('Choose Icon', 'explain', 'chooseIcon', { cls: 'btn--sm' }) + '</div>') +
        '</div>' +
      '</div></div>';
  }

  function taskCard(t) {
    var s = statusOf(t.status), p = priorityOf(t.priority);
    return d.card('<div class="row row--between">' +
      '<div style="min-width:0"><div style="font-weight:600">' + d.esc(t.title) + '</div>' +
      '<div class="hint">' + d.esc(t.subject) + ' · ' + s.emoji + ' ' + s.label + ' · ' + p.emoji + ' ' + p.label + '</div></div>' +
      '<div class="row">' +
        d.btn('Next status', 'tasks.status.set',
              { id: t.id, status: nextStatus(t.status) }, { cls: 'btn--sm' }) +
      '</div></div>', 'card--flat');
  }
  function nextStatus(s) {
    var i = D_.TASK_STATUS.findIndex(function (x) { return x.id === s; });
    return D_.TASK_STATUS[(i + 1) % D_.TASK_STATUS.length].id;
  }

  /* ══ /exams ═════════════════════════════════════════════════════════════ */

  function examStatusLabel(s) { return (D_.EXAM_STATUS_LABEL[s] || {}).label || s; }
  function examStatusIcon(s) { return (D_.EXAM_STATUS_LABEL[s] || {}).icon || '•'; }

  function exams() {
    var rows = global.PV.derived.examsFor(S.examsTab);
    var q = S.examsQuery.trim().toLowerCase();
    if (q) rows = rows.filter(function (e) {
      return e.title.toLowerCase().indexOf(q) >= 0;
    });

    var body;
    if (!rows.length) {
      body = d.empty('🗓', 'No D-Day exams scheduled', 'Schedule your first exam to start tracking preparation.',
                     d.btn('Schedule first exam', 'exams.schedule', null, { cls: 'btn--primary btn--lg' }));
    } else if (S.examsView === 'list') {
      body = '<table class="table"><thead><tr><th>Exam</th><th>Status</th><th>Date</th>' +
             '<th class="num">Preparation</th><th></th></tr></thead><tbody>' +
        rows.map(function (e) {
          return '<tr><td>' + d.esc(e.title) + '</td>' +
            '<td><span class="badge">' + examStatusIcon(e.status) + ' ' + examStatusLabel(e.status) + '</span></td>' +
            '<td>' + d.esc(e.date) + '</td>' +
            '<td class="num">' + e.progress + '%</td>' +
            '<td>' + d.btn('Log score', 'exams.logScore', e.id, { cls: 'btn--sm' }) + '</td></tr>';
        }).join('') + '</tbody></table>';
    } else {
      body = '<div class="grid grid--2">' + rows.map(function (e) {
        return d.card('<div class="row row--between">' +
          '<div><div style="font-weight:600">' + d.esc(e.title) + '</div>' +
          '<div class="hint">' + examStatusIcon(e.status) + ' ' + examStatusLabel(e.status) + ' · ' + d.esc(e.date) + '</div></div>' +
          d.badge(e.type) + '</div>' +
          '<div style="margin-top:12px">' + d.bar(e.progress) + '</div>' +
          '<div class="row row--between" style="margin-top:10px">' +
            '<span class="hint">Preparation ' + e.progress + '%' + (e.score ? ' · score ' + e.score : '') + d.sample() + '</span>' +
            d.btn('Log score', 'exams.logScore', e.id, { cls: 'btn--sm' }) +
          '</div>');
      }).join('') + '</div>';
    }

    return '<div class="page">' +
      '<div class="page__head"><div><h1 class="page__title">Exams</h1>' +
        '<p class="page__sub">' + D_.exams.length + ' exams' + d.sample() + '</p></div>' +
        '<div class="row">' +
          '<input class="search" style="width:320px" placeholder="Search exams, tags, descriptions..." ' +
            'value="' + d.esc(S.examsQuery) + '" data-input="exams.search">' +
          d.btn('Filter', 'exams.filter', null, { cls: 'btn--sm' }) +
          d.btn(S.examsSort, 'exams.sort', null, { cls: 'btn--sm' }) +
          d.btn('Schedule Exam', 'exams.schedule', null, { cls: 'btn--primary' }) +
        '</div></div>' +

      '<div class="row" style="margin-bottom:14px">' +
        '<div class="tabs">' + D_.EXAM_STATUS_TABS.map(function (t) {
          return '<button class="tab" role="tab" aria-selected="' + (S.examsTab === t.id) + '" ' +
            'data-act="exams.tab" data-arg="' + t.id + '">' + d.esc(t.label) +
            '<span class="tab__count">' + t.count + '</span></button>';
        }).join('') + '</div>' +
        '<div class="spacer"></div>' +
        '<div class="tabs">' +
          d.iconBtn('▦', 'exams.view', 'grid', { aria: 'Grid', pressed: S.examsView === 'grid' }) +
          d.iconBtn('☰', 'exams.view', 'list', { aria: 'List', pressed: S.examsView === 'list' }) +
          d.iconBtn('▦', 'exams.view', 'calendar', { aria: 'Calendar', pressed: S.examsView === 'calendar' }) +
        '</div>' +
      '</div>' +

      '<div class="grid grid--dash"><div>' + body + '</div>' +
        '<div class="stack">' +
          d.card('<h3 class="card__title" style="font-size:var(--fs-h3)">Analytics Command Center</h3>' +
                 '<p class="card__sub">Log a few results to unlock exam intelligence.</p>' +
                 '<div style="margin-top:12px;display:grid;gap:8px">' +
                 [['Recent average', '186'], ['Projected next', '204'], ['Consistency', '72%'],
                  ['Exam pressure', 'High'], ['Accuracy', '68%'], ['Rank signal', 'Improving']]
                   .map(function (m) {
                     return d.tile(m[0], m[1], 'sample', 'explain', 'analysis');
                   }).join('') + '</div>') +
          d.card('<h3 class="card__title" style="font-size:var(--fs-h3)">Action Queue</h3>' +
                 '<p class="card__sub">The next few levers worth attention.</p>') +
        '</div></div>' +

      '<div style="margin-top:16px">' + d.btn('Schedule new exam', 'exams.schedule', null, { cls: 'btn--fab' }) + '</div>' +
      '</div>';
  }

  /* ══ /syllabus ══════════════════════════════════════════════════════════ */

  var SYLLABUS_TABS = ['Syllabus', 'Templates', 'Tracking', 'Saved Resources', 'Chapters', 'Coverage'];

  function syllabus() {
    var subs = D_.subjects;
    return '<div class="page">' +
      '<div class="page__head"><div><h1 class="page__title">Syllabus</h1>' +
        '<p class="page__sub">' + subs.length + ' subjects' + d.sample() + '</p></div>' +
        d.btn('Create Subject', 'syllabus.create', null, { cls: 'btn--primary' }) + '</div>' +

      '<div class="tabs" style="margin-bottom:16px">' +
        SYLLABUS_TABS.map(function (t, i) { return d.tab(t, 'explain', 'syllabusTab', i === 0); }).join('') + '</div>' +

      (subs.length
        ? '<div class="grid grid--3">' + subs.map(function (s) {
            var pct = s.topics ? (s.done / s.topics) * 100 : 0;
            return d.card('<div class="row row--between">' +
              '<div><div style="font-weight:600">' + s.icon + ' ' + d.esc(s.name) + '</div>' +
              '<div class="hint">' + s.chapters + ' chapters · ' + s.topics + ' topics' + d.sample() + '</div></div>' +
              d.meter(Math.round(pct) + '%') + '</div>' +
              '<div style="margin-top:12px">' + d.bar(pct) + '</div>' +
              '<div style="margin-top:12px">' +
                d.btn('Add chapter', 'explain', 'addChapter', { cls: 'btn--sm' }) +
                d.btn('Add a subject', 'syllabus.create', null, { cls: 'btn--sm' }) +
              '</div>');
          }).join('') + '</div>'
        : d.empty('📘', 'No Subjects Yet', 'Add a subject or load a template to start tracking coverage.',
                 d.btn('Create Subject', 'syllabus.create', null, { cls: 'btn--primary btn--lg' }) +
                 d.btn('Load Template', 'syllabus.template', null, { cls: 'btn--lg' }))) +
      '</div>';
  }

  global.VIEWS_B = { tasks: tasks, exams: exams, syllabus: syllabus };
})(window);