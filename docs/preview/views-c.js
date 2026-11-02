/* ============================================================================
   views-c.js — community, settings, study, analytics, subscription, onboarding.

   Community renders FIVE tabs, Leaderboard among them — observed on the live
   app, and the reason `/leaderboard` is not treated as a missing route.
   Settings renders FIVE groups; the fifth, Support, is real.
   ========================================================================= */

(function (global) {
  'use strict';
  var d = global.D, S = global.PV.S, D_ = global.ISO_DEMO;

  /* ══ /community ═════════════════════════════════════════════════════════ */

  function community() {
    var tab = S.communityTab;
    var body;

    if (tab === 'leaderboard') {
      body = '<table class="table"><thead><tr><th class="num">#</th><th>Student</th>' +
        '<th class="num">Points</th><th class="num">Day streak</th></tr></thead><tbody>' +
        D_.leaderboard.map(function (r) {
          var me = r.name === D_.NAME;
          return '<tr' + (me ? ' style="background:var(--brand-50)"' : '') + '>' +
            '<td class="num">' + r.rank + '</td>' +
            '<td>' + d.esc(r.name) + (me ? ' <span class="sample">you</span>' : '') + '</td>' +
            '<td class="num">' + r.points + '</td><td class="num">🔥 ' + r.streak + '</td></tr>';
        }).join('') + '</tbody></table>';
    } else if (tab === 'buddies') {
      body = '<div class="stack">' + D_.buddies.map(function (b) {
        return d.tile(b.name, b.status, b.subject, 'community.join', b.name);
      }).join('') + '</div>' +
        '<div style="margin-top:12px">' + d.btn('Add your first buddy', 'community.addBuddy', null, { cls: 'btn--primary' }) + '</div>';
    } else if (tab === 'groups') {
      body = '<div class="grid grid--2">' + D_.groups.map(function (g) {
        return d.card('<div style="font-weight:600">' + d.esc(g.name) + '</div>' +
          '<div class="hint">' + g.members + ' members · ' + d.esc(g.tagline) + d.sample() + '</div>' +
          '<div style="margin-top:12px">' + d.btn('Join group', 'community.join', g.name, { cls: 'btn--sm' }) + '</div>');
      }).join('') + '</div>';
    } else if (tab === 'discover') {
      body = '<div class="grid grid--2">' +
        d.card('<h3 class="card__title" style="font-size:var(--fs-h3)">Public study rooms</h3>' +
               '<p class="card__sub">Drop in, no invite needed.</p>') +
        d.card('<h3 class="card__title" style="font-size:var(--fs-h3)">Find your people</h3>' +
               '<p class="card__sub">Match by subject and exam target.</p>') +
        '</div>';
    } else {
      body = d.empty('👥', 'Build your first study circle',
        'Friends, groups and shared progress all live here.',
        d.btn('Add your first buddy', 'community.addBuddy', null, { cls: 'btn--primary btn--lg' }));
    }

    return '<div class="page">' +
      '<div class="page__head">' +
        '<div><h1 class="page__title" style="font-size:var(--fs-h1-comm);font-weight:var(--fw-h1-comm)">Community</h1>' +
        '<p class="page__sub">Buddies, groups and shared progress</p></div>' +
        '<div class="row">' +
          d.btn('Start focus', 'community.startFocus') +
          d.btn('Create group', 'community.createGroup') +
          d.iconBtn('⟳', 'community.refresh', null, { aria: 'Refresh Community' }) +
          d.btn('Privacy and sharing', 'community.privacy', null, { cls: 'btn--sm' }) +
        '</div></div>' +

      '<div class="tabs" style="margin-bottom:16px">' +
        D_.COMMUNITY_TABS.map(function (t) {
          return d.tab(t.label, 'community.tab', t.id, S.communityTab === t.id);
        }).join('') + '</div>' +

      body +
      '<p class="hint" style="margin-top:16px">Buddies, groups and leaderboard rows are invented' + d.sample('sample data') + '.</p>' +
      '</div>';
  }

  /* ══ /settings ══════════════════════════════════════════════════════════ */

  function settings() {
    var g = S.settingsGroup;
    var rows = D_.settings[g] || [];

    return '<div class="page"><div class="grid" style="grid-template-columns:239px minmax(0,1fr)">' +
      '<nav aria-label="Settings sections">' +
        D_.SETTINGS_GROUPS.map(function (name) {
          return '<button class="nav__item" style="width:100%;justify-content:flex-start;height:32px;' +
            'padding:0 8px;font-size:var(--fs-sm);font-weight:600;color:' +
            (S.settingsGroup === name ? 'var(--brand-600)' : 'var(--ink-muted)') + '" ' +
            'aria-current="' + (S.settingsGroup === name ? 'page' : 'false') + '" ' +
            'data-act="settings.group" data-arg="' + d.esc(name) + '">' +
            d.esc(name) + '</button>';
        }).join('') + '</nav>' +

      '<div><div class="row" style="margin-bottom:12px">' +
        '<input class="search" type="search" placeholder="Search settings..." ' +
          'aria-label="Search settings" data-input="settings.search" ' +
          'value="' + d.esc(String(S.settingsQuery || '')) + '">' +
        d.btn('Save Changes', 'settings.save', null, { cls: 'btn--primary btn--sm' }) +
      '</div>' +
      '<h1 class="page__title" style="font-size:24px">' + d.esc(g) + '</h1>' +
      '<div class="card" style="margin-top:12px">' +
      (rows.length ? rows.map(function (r) { return settingRow(r); }).join('')
                   : '<p class="card__sub">Nothing in this section yet.</p>') +
      '</div></div></div></div>';
  }

  function settingRow(r) {
    var body;
    if (r.kind === 'switch') {
      body = d.toggle(r.label, 'settings.set', { id: r.id, value: !r.value }, r.value);
    } else if (r.kind === 'range') {
      body = '<div class="row"><input type="range" min="' + r.min + '" max="' + r.max + '" step="' + r.step + '" ' +
        'value="' + d.esc(String(r.value)) + '" data-range="' + d.esc(r.id) + '" style="width:180px">' +
        '<span class="counter">' + d.esc(String(r.value)) + ' ' + d.esc(r.unit || '') + '</span></div>';
    } else if (r.kind === 'select') {
      body = '<select class="input" style="height:40px;width:auto" data-select="' + d.esc(r.id) + '">' +
        '<option value="' + d.esc(String(r.value)) + '" selected>' + d.esc(String(r.value)) + '</option>' +
        '</select>';
    } else if (r.kind === 'link') {
      body = d.btn(r.value, 'settings.link', r.value, { cls: 'btn--sm' });
    } else if (r.kind === 'choice') {
      // The real app renders these as a button group (Normal|Exam Mode|Vacation).
      body = '<div class="tabs" role="group" aria-label="' + d.esc(r.label) + '">' +
        r.options.map(function (o) {
          return '<button class="tab" role="tab" aria-selected="' + (o === r.value) +
            '" data-act="settings.choice" data-arg=\'' +
            d.esc(JSON.stringify({ id: r.id, value: o })) + '\'>' + d.esc(o) + '</button>';
        }).join('') + '</div>';
    } else {
      body = '<input class="input" style="height:40px;width:260px" value="' + d.esc(String(r.value)) + '" ' +
        'data-text="' + d.esc(r.id) + '">';
    }
    return '<div class="rowfield"><div><div class="rowfield__name">' + d.esc(r.label) + '</div>' +
      '<div class="rowfield__desc">' + d.esc(r.desc) + '</div></div>' + body + '</div>';
  }

  /* ══ /study ═════════════════════════════════════════════════════════════ */

  function study() {
    return '<div class="page"><div class="page__head"><div><h1 class="page__title">Study</h1>' +
      '<p class="page__sub">Deep work, broken into blocks you can finish</p></div>' +
      d.btn('Start focus', 'focus.start', null, { cls: 'btn--primary' }) + '</div>' +
      '<div class="grid grid--2">' +
        d.card('<h3 class="card__title" style="font-size:var(--fs-h3)">Your blocks</h3>' +
          '<div class="stack" style="margin-top:12px">' +
          ['Rotational motion', 'GOC revision', 'Integration by parts', 'SHM past papers']
            .map(function (t, i) { return d.tile(t, (25 + i * 5) + ' min', 'Pomodoro block' + d.sample(), 'explain', 'studyBlock'); }).join('') +
          '</div>') +
        d.card('<h3 class="card__title" style="font-size:var(--fs-h3)">Settings</h3>' +
          '<div style="margin-top:12px">' +
          d.btn('Customize', 'dashboard.customize', null, { cls: 'btn--sm' }) +
          d.btn('All settings', 'navigate', '/settings', { cls: 'btn--sm' }) +
          '</div>') +
      '</div></div>';
  }

  /* ══ /analytics (Progress) ══════════════════════════════════════════════ */

  var ANALYTICS_TABS = ['Today', 'Weekly', 'Monthly', 'Yearly', 'Subjects', 'Tasks', 'Activity Log'];

  function analytics() {
    return '<div class="page"><div class="page__head"><div><h1 class="page__title">Progress</h1>' +
      '<p class="page__sub">Study activity and progress</p></div></div>' +
      '<div class="tabs" style="margin-bottom:16px">' +
        ANALYTICS_TABS.map(function (t, i) { return d.tab(t, 'explain', 'progressTab', i === 1); }).join('') + '</div>' +
      '<div class="grid grid--3">' +
        [['Focused', '31h 42m', '+12% vs last week'], ['Sessions', '86', 'average 24 min'],
         ['Goal days', '19 of 30', '63% of the month']]
          .map(function (m) {
            return d.card('<p class="eyebrow">' + d.esc(m[0]) + '</p>' + d.meter(m[1]) +
              '<p class="hint" style="margin-top:4px">' + d.esc(m[2]) + d.sample() + '</p>');
          }).join('') +
      '</div>' +
      '<div class="card" style="margin-top:16px">' +
        '<h3 class="card__title" style="font-size:var(--fs-h3)">Last 14 days</h3>' +
        '<div style="margin-top:12px">' + d.sparkline(D_.series, 640, 120) + '</div></div>' +
      '</div>';
  }

  /* ══ /subscription ══════════════════════════════════════════════════════ */

  function subscription() {
    var plans = [
      { name: 'Aspirant', price: 'Free', note: 'Everyday study tools' },
      { name: 'Pro', price: '₹105/mo', note: 'More controls and customisable views' }
    ];
    return '<div class="page"><div class="page__head"><div><h1 class="page__title">Subscription</h1>' +
      '<p class="page__sub">Switching plans never changes or deletes your study data</p></div></div>' +
      '<div class="grid grid--2">' + plans.map(function (p, i) {
        return d.card('<div class="row row--between"><h3 class="card__title">' + d.esc(p.name) + '</h3>' +
          d.badge(i ? 'Pro' : 'Free', true) + '</div>' +
          '<p class="card__sub">' + d.esc(p.note) + '</p>' +
          '<div style="margin-top:14px">' + d.meter(p.price) + d.sample() + '</div>' +
          '<div style="margin-top:14px">' + d.btn(i ? 'Choose Pro' : 'Stay free', 'settings.link', p.name, { cls: 'btn--primary' }) + '</div>');
      }).join('') + '</div></div>';
  }

  /* ══ /onboarding ════════════════════════════════════════════════════════ */

  function onboarding() {
    return '<div class="shell" style="min-height:100vh;align-items:flex-start">' +
      '<aside class="rail"><div class="rail__mark">Isotope</div></aside>' +
      '<main class="main" style="padding-top:40px">' +
      '<div style="max-width:576px;margin:0 auto">' +
        '<p class="eyebrow">Profile <span style="color:var(--ink-faint)">1 of 3</span></p>' +
        '<h1 class="page__title" style="font-size:var(--fs-h1-onboard);font-weight:var(--fw-h1-onboard)">' +
          'How should you appear in Isotope?</h1>' +
        '<p class="page__sub">Choose a name and avatar. These are used across your workspace and community profile.</p>' +

        '<div class="card" style="margin-top:24px">' +
          '<div class="field"><label class="label">Display name</label>' +
            '<input class="input" placeholder="What should we call you?" maxlength="32" data-onb="name">' +
            '<span class="hint">You can change this later</span></div>' +

          '<div style="margin-top:18px"><span class="label">Choose an avatar</span>' +
          '<div class="row" style="margin-top:8px">' +
            ['🌅', '🌊', '🌿', '🔭', '🪐', '🦉'].map(function (e, i) {
              return '<button class="avatar" style="width:94px;height:94px;font-size:34px" ' +
                'aria-label="Choose avatar ' + (i + 1) + '" data-act="onboarding.avatar" data-arg="' + (i + 1) + '">' + e + '</button>';
            }).join('') + '</div>' +
          d.btn('Upload photo', 'explain', 'uploadPhoto', { cls: 'btn--sm', glyph: '↑' }) + '</div>' +
        '</div>' +

        '<div class="row" style="margin-top:16px;justify-content:flex-end">' +
          d.btn('Choose exam', 'noop', null, { cls: 'btn--primary', disabled: true }) + '</div>' +
        '<p class="hint" style="text-align:right">Your choices are saved automatically</p>' +
      '</div></main></div>';
  }

  global.VIEWS_C = { community: community, settings: settings, study: study,
                      analytics: analytics, subscription: subscription, onboarding: onboarding };
})(window);