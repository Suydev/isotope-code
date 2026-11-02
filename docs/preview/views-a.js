/* ============================================================================
   views.js — the surfaces, one function each, split deliberately small.

   Every control here is emitted by a D.* helper, which always stamps data-act.
   There is no bare <button> in this file. That is the whole point.
   ========================================================================= */

(function (global) {
  'use strict';
  var d = global.D, S = global.PV.S;

  /* ══ /dashboard ═════════════════════════════════════════════════════════ */

  function greeting() {
    // MEASURED: the header on /focus renders "Good Morning" with a capital M,
    // while the same word on /dashboard is lower-case "Good morning". Same app,
    // two spellings. Reproduce both rather than picking one.
    var h = new Date().getHours();
    return h < 12 ? 'Good Morning' : (h < 17 ? 'Good Afternoon' : 'Good Evening');
  }

  function dashboard() {
    var st = global.PV.derived.stats();
    var ex = S.exams.filter(function (e) { return e.status !== 'archived'; })[0];
    var today = global.ISO_DEMO.tasks.filter(function (t) { return t.due === 'Today'; });

    return '<div class="page">' +
      '<div class="page__head">' +
        '<div><h1 class="page__title">' + d.esc(greeting()) + '</h1>' +
        '<p class="page__sub">' + d.esc(global.ISO_DEMO.NAME) +
          '<span class="top__dot"> · Add exam date</span></p></div>' +
        '<div class="row">' +
          d.iconBtn('🔍', 'search.open', null, { aria: 'Open search' }) +
          d.btn('Customize', 'dashboard.customize', null, { aria: 'Customize Today dashboard' }) +
          d.iconBtn('💾', 'storage.open', null, { aria: 'Storage safety status' }) +
          d.iconBtn('📣', 'updates.open', null, { aria: 'View product updates' }) +
          d.iconBtn('🔔', 'notifications.open', null, { aria: 'Notifications' }) +
        '</div>' +
      '</div>' +

      '<div class="grid grid--dash">' +
        /* left column */
        '<div class="stack">' +
          d.card(
            '<div class="row row--between"><h2 class="card__title">Continue where you left off</h2></div>' +
            '<div class="row" style="margin-top:14px">' +
              d.btn('Resume study', 'dashboard.startSession', null, { cls: 'btn--primary btn--lg' }) +
              d.btn('Switch activity', 'dashboard.switchActivity') +
            '</div>' +
            '<div style="margin-top:16px">' + d.bar(0) + '</div>' +
            '<p class="hint" style="margin-top:6px">Link focused time and add an estimate to calculate progress.</p>'
          ) +
          d.card(
            '<h2 class="card__title">Today’s plan</h2>' +
            '<p class="card__sub">' + today.length + ' priorities for today</p>' +
            '<div class="row" style="margin-top:12px">' +
              d.iconBtn('?', 'explain', 'todayPlan', { aria: 'How Today’s plan is calculated' }) +
              d.btn('Add', 'tasks.add', null, { cls: 'btn--sm' }) +
              d.btn('Rebalance', 'dashboard.rebalance', null, { cls: 'btn--sm' }) +
            '</div>' +
            (today.length
              ? '<div class="stack" style="margin-top:12px">' + today.map(function (t) {
                  return d.tile(t.title, t.effort + ' min', t.subject + ' · ' + t.status,
                                'tasks.status.set', { id: t.id, status: 'done' });
                }).join('') + '</div>'
              : '<div style="margin-top:16px">' + d.btn('Create today’s plan →', 'dashboard.plan.create') + '</div>')
          ) +
        '</div>' +

        /* right column */
        '<div class="stack">' +
          d.card('<h2 class="card__title">What needs attention</h2>' +
                 '<p class="card__sub">No urgent signal needs your attention</p>' +
                 '<div style="margin-top:12px">' + d.sparkline(global.ISO_DEMO.series) + '</div>') +
          d.card('<h2 class="card__title">Exam progress</h2>' +
                 '<p class="card__sub">' + d.esc(ex ? ex.title : 'No exam set') + '</p>' +
                 '<div style="margin-top:12px;display:flex;gap:14px;align-items:center">' +
                   d.ring(ex ? ex.progress : 0) +
                   '<div>' + d.meter((ex ? ex.progress : 0) + '%') +
                   '<p class="hint">Syllabus ' + (ex ? ex.syllabus : 0) + '%</p></div>' +
                 '</div>' +
                 '<div style="margin-top:10px">' + d.iconBtn('?', 'explain', 'examProgress', { aria: 'How exam progress is calculated' }) + '</div>') +
          d.card('<h2 class="card__title">Subject progress</h2>' +
                 '<p class="card__sub">Set up your study map</p>' +
                 '<div style="margin-top:12px">' + d.bar(66) + '</div>' +
                 '<div style="margin-top:12px">' + d.btn('Open syllabus', 'navigate', '/syllabus', { cls: 'btn--sm' }) + '</div>') +
          d.card('<h2 class="card__title">Coming up</h2>' +
                 '<p class="card__sub">Your horizon is clear</p>' +
                 '<div style="margin-top:12px">' + d.btn('Add an exam →', 'exams.add', null, { cls: 'btn--sm' }) + '</div>') +
        '</div>' +
      '</div>' +

      /* insight rows — verbatim names observed on the live dashboard */
      '<div class="stack" style="margin-top:16px">' +
        global.ISO_DEMO.insights.map(function (i) {
          return d.tile(i.name, i.value, i.meta, 'dashboard.insight.open', i.id);
        }).join('') +
      '</div>' +

      '<p class="hint" style="margin-top:16px">' +
        'Every figure on this page is invented for demonstration' + d.sample('sample data') + '.</p>' +
    '</div>';
  }

  /* ══ /focus ════════════════════════════════════════════════════════════ */

  function mmss(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }

  function focus() {
    var f = S.focus;
    var total = f.durations.focus * 60;
    var pct = total ? Math.min(100, (f.elapsed / total) * 100) : 0;
    var activeSound = f.sound;

    return '<div class="page">' +
      '<div class="page__head">' +
        '<div><h1 class="page__title" style="font-size:var(--fs-h1-focus)">' + d.esc(greeting()) + ', ' + d.esc(global.ISO_DEMO.NAME) + '</h1>' +
        '<p class="page__sub">' + f.streakDays + 'd · ' + f.studiedToday + ' min studied today</p></div>' +
        '<div class="row">' +
          d.btn('Setup AI', 'explain', 'setupAI', { cls: 'btn--sm' }) +
          d.iconBtn('🔍', 'search.open', null, { aria: 'Open search' }) +
          d.btn('Log past session', 'focus.log', null, { cls: 'btn--sm' }) +
        '</div>' +
      '</div>' +

      '<div class="grid grid--dash">' +
        '<div class="stack">' +
          d.card(
            '<div class="row" style="justify-content:center">' +
              '<div class="tabs">' +
                d.tab('Pomodoro', 'focus.mode', 'Pomodoro', f.mode === 'Pomodoro') +
                d.tab('Stopwatch', 'focus.mode', 'Stopwatch', f.mode === 'Stopwatch') +
              '</div>' +
            '</div>' +
            '<div style="display:grid;place-items:center;padding:18px 0">' +
              '<div style="position:relative;display:grid;place-items:center">' +
                d.ring(pct, 192, 12) +
                '<div style="position:absolute;text-align:center">' +
                  '<div style="font-size:52px;font-weight:700;letter-spacing:-.02em;color:var(--ink-strong)">' + mmss(f.elapsed) + '</div>' +
                  '<div class="hint">' + f.mode + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="row" style="justify-content:center">' +
              (f.running
                ? d.btn('Pause', 'focus.pause', null, { cls: 'btn--primary' })
                : d.btn(f.elapsed ? 'Resume' : 'Start Focus Session', 'focus.start', null, { cls: 'btn--primary' })) +
              d.iconBtn('⟲', 'focus.reset', null, { aria: 'Reset Timer' }) +
              d.btn('Skip', 'focus.skip', null, { cls: 'btn--sm' }) +
            '</div>' +
            '<div class="row" style="justify-content:center;margin-top:10px">' +
              d.btn('Subtract 5 Minutes', 'focus.minus5', null, { cls: 'btn--sm' }) +
              d.btn('Add 5 Minutes', 'focus.plus5', null, { cls: 'btn--sm' }) +
              d.btn('Log session', 'focus.log', null, { cls: 'btn--sm' }) +
            '</div>' +
            '<div style="margin-top:16px">' + d.btn('Take a Breath', 'focus.breath', null, { cls: 'btn--wide' }) + '</div>'
          ) +

          d.card('<p class="eyebrow">Ambient Sounds</p>' +
            '<div class="row">' + f.sounds.map(function (s) {
              return d.chip(s.label, 'focus.sound', s.id, activeSound === s.id);
            }).join('') + '</div>') +

          d.card('<p class="eyebrow">Session Goals</p>' +
            '<p class="card__sub">No goals set. Add tasks to your session or create custom goals below.</p>' +
            '<div style="margin-top:12px">' + d.btn('Add a mini-goal...', 'explain', 'addGoal', { cls: 'btn--sm' }) + '</div>') +

          d.card('<p class="eyebrow">Distraction Pad</p>' +
            '<textarea class="input" data-onb="pad" rows="3" style="height:auto;padding:10px 12px" placeholder="Dump distracting thoughts here...">' + d.esc(S.focus.pad || '') + '</textarea>') +
        '</div>' +

        '<div class="stack">' +
          d.card('<p class="eyebrow">Streak</p>' + d.meter(f.streakDays, 'days')) +
          d.card('<p class="eyebrow">Focus Time</p>' + d.meter(Math.round(f.studiedToday / 60) + 'h ' + (f.studiedToday % 60) + 'm')) +
          d.card('<p class="eyebrow">Daily Study Goal</p>' + d.bar(f.studiedToday / f.dailyGoalMinutes * 100) +
                 '<p class="hint" style="margin-top:6px">' + f.studiedToday + ' of ' + f.dailyGoalMinutes + ' min</p>') +
          d.card('<p class="eyebrow">Recent Sessions</p>' +
                 '<p class="card__sub">No sessions yet</p>' +
                 '<div style="margin-top:12px">' + d.btn('Start a focus session to see your history', 'focus.start', null, { cls: 'btn--sm' }) + '</div>') +
        '</div>' +
      '</div>' +
      '<p class="hint" style="margin-top:16px">Times and totals are invented' + d.sample('sample data') + '.</p>' +
    '</div>';
  }

  global.VIEWS = { dashboard: dashboard, focus: focus, greeting: greeting, mmss: mmss };
})(window);