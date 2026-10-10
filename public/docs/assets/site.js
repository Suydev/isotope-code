/* ============================================================================
   IsotopeAI Documentation — behaviour
   ----------------------------------------------------------------------------
   Progressive enhancement only. Every feature here is additive: with JS off the
   pages are fully readable, all content is visible, and navigation works.

   Contents
   --------
   1. Theme        persisted light/dark, follows system until the user chooses
   2. Drawer       mobile navigation
   3. Reveal       IntersectionObserver entrance, staggered
   4. Copy         clipboard buttons on code blocks
   5. TOC          scroll-spy for the right rail
   6. Tilt         pointer-driven 3D on .tilt cards (fine pointers only)
   7. Parallax     rAF-batched scroll offset for .parallax
   8. Spin pause   pauses .spin3d when off-screen (saves frames/battery)
   9. Search       client-side filter over the sidebar index
   ========================================================================= */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ── 1. Theme ───────────────────────────────────────────────────────────── */

  var THEME_KEY = 'isotope-docs-theme';

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      var toDark = theme !== 'dark';
      // Label states what the control will DO, which is what a screen reader
      // user needs — not what the current theme is.
      btn.setAttribute('aria-label', toDark ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('title', btn.getAttribute('aria-label'));
      var sun = btn.querySelector('[data-icon="sun"]');
      var moon = btn.querySelector('[data-icon="moon"]');
      if (sun && moon) {
        sun.style.display = theme === 'dark' ? 'none' : '';
        moon.style.display = theme === 'dark' ? '' : 'none';
      }
    }
  }

  applyTheme(storedTheme() || systemTheme());

  // Track the system theme only while the user has not made an explicit choice.
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });
  } catch (e) { /* Safari < 14 */ }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
  });

  /* ── 2. Mobile drawer ───────────────────────────────────────────────────── */

  var drawer = document.querySelector('[data-drawer]');
  var drawerToggle = document.querySelector('[data-drawer-toggle]');

  function setDrawer(open) {
    if (!drawer || !drawerToggle) return;
    drawer.setAttribute('data-open', open ? 'true' : 'false');
    drawerToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    // Lock the page behind the sheet so the background does not scroll under it
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (drawerToggle) {
    drawerToggle.addEventListener('click', function () {
      setDrawer(drawer.getAttribute('data-open') !== 'true');
    });
  }

  // Escape must always close an overlay (HIG: escape-routes)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.getAttribute('data-open') === 'true') {
      setDrawer(false);
      drawerToggle.focus();
    }
  });

  // Following a link inside the drawer should dismiss it
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
  }

  // Leaving the mobile breakpoint must not leave a locked body behind
  try {
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setDrawer(false);
    });
  } catch (e) {}

  /* ── 3. Reveal on scroll ────────────────────────────────────────────────── */

  var revealTargets = document.querySelectorAll('.reveal, .reveal-3d');

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    // No observer or motion is unwanted → show everything immediately
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings 40ms apart (MD: 30-50ms per item)
        var idx = Number(el.getAttribute('data-stagger') || 0);
        setTimeout(function () { el.classList.add('in'); }, idx * 40);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealTargets, function (el, i) {
      // Auto-assign stagger index within each grid
      if (!el.hasAttribute('data-stagger')) {
        var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : i;
        el.setAttribute('data-stagger', String(Math.min(siblings, 8)));
      }
      revealObserver.observe(el);
    });
  }

  /* ── 4. Copy buttons ────────────────────────────────────────────────────── */

  var COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var DONE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  Array.prototype.forEach.call(document.querySelectorAll('.codeblock'), function (block) {
    var head = block.querySelector('.codeblock-head');
    var pre = block.querySelector('pre');
    if (!pre) return;
    if (!head) {
      head = document.createElement('div');
      head.className = 'codeblock-head';
      head.innerHTML = '<span>' + (block.getAttribute('data-lang') || 'shell') + '</span>';
      block.insertBefore(head, pre);
    }
    if (head.querySelector('.copy-btn')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.innerHTML = COPY_ICON + '<span>Copy</span>';

    btn.addEventListener('click', function () {
      var text = pre.innerText;
      var done = function () {
        btn.setAttribute('data-copied', 'true');
        btn.innerHTML = DONE_ICON + '<span>Copied</span>';
        // Announce for screen readers without stealing focus
        btn.setAttribute('aria-label', 'Code copied to clipboard');
        setTimeout(function () {
          btn.removeAttribute('data-copied');
          btn.innerHTML = COPY_ICON + '<span>Copy</span>';
          btn.setAttribute('aria-label', 'Copy code to clipboard');
        }, 2000);
      };
      var failed = function () {
        btn.innerHTML = COPY_ICON + '<span>Press Ctrl+C</span>';
        setTimeout(function () { btn.innerHTML = COPY_ICON + '<span>Copy</span>'; }, 2500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(failed);
      } else {
        // Fallback for non-secure contexts
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          done();
        } catch (err) { failed(); }
      }
    });

    head.appendChild(btn);
  });

  /* ── 5. TOC scroll-spy ──────────────────────────────────────────────────── */

  var toc = document.querySelector('[data-toc]');
  if (toc) {
    var headings = document.querySelectorAll('.content h2[id], .content h3[id]');
    if (headings.length) {
      // Build the rail from the document so it can never drift from the content
      if (!toc.querySelector('a')) {
        var list = document.createElement('div');
        Array.prototype.forEach.call(headings, function (h) {
          var a = document.createElement('a');
          a.href = '#' + h.id;
          a.textContent = h.textContent.replace('#', '').trim();
          if (h.tagName === 'H3') a.style.paddingInlineStart = 'var(--s-3)';
          list.appendChild(a);
        });
        toc.appendChild(list);
      }

      var tocLinks = toc.querySelectorAll('a');
      if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.id;
            Array.prototype.forEach.call(tocLinks, function (a) {
              a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
          });
        }, { rootMargin: '-20% 0px -70% 0px' });
        Array.prototype.forEach.call(headings, function (h) { spy.observe(h); });
      }
    }
  }

  /* ── 6. Tilt (3D) ───────────────────────────────────────────────────────── */

  // Skipped entirely on coarse pointers and under reduced motion, so touch
  // scrolling is never intercepted and motion-sensitive users get static cards.
  if (finePointer.matches && !reduceMotion.matches) {
    var MAX_TILT = 7; // degrees — subtle; larger reads as gimmicky

    Array.prototype.forEach.call(document.querySelectorAll('.tilt'), function (card) {
      var frame = null;

      function onMove(e) {
        if (frame) return;               // one update per frame, max
        frame = requestAnimationFrame(function () {
          frame = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--ry', ((px - 0.5) * 2 * MAX_TILT).toFixed(2) + 'deg');
          card.style.setProperty('--rx', ((0.5 - py) * 2 * MAX_TILT).toFixed(2) + 'deg');
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      }

      card.addEventListener('pointerenter', function () {
        card.setAttribute('data-tracking', 'true');
      });
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', function () {
        if (frame) { cancelAnimationFrame(frame); frame = null; }
        card.removeAttribute('data-tracking');   // restores the spring-back transition
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ── 7. Parallax ────────────────────────────────────────────────────────── */

  var parallaxEls = document.querySelectorAll('.parallax');
  if (parallaxEls.length && !reduceMotion.matches) {
    var ticking = false;

    function updateParallax() {
      ticking = false;
      var vh = window.innerHeight;
      Array.prototype.forEach.call(parallaxEls, function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;          // off-screen → skip
        var speed = Number(el.getAttribute('data-speed') || 0.08);
        var centre = r.top + r.height / 2 - vh / 2;
        el.style.setProperty('--py', (-centre * speed).toFixed(1) + 'px');
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
    }, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });
    updateParallax();
  }

  /* ── 9. Sidebar filter ─────────────────────────────────────────────────── */

  var filter = document.querySelector('[data-nav-filter]');
  if (filter) {
    var sidebar = document.querySelector('.sidebar');
    var timer = null;

    filter.addEventListener('input', function () {
      clearTimeout(timer);                       // debounce (advisor rule)
      timer = setTimeout(function () {
        var q = filter.value.trim().toLowerCase();
        var anyVisible = false;

        Array.prototype.forEach.call(sidebar.querySelectorAll('.sidebar-group'), function (group) {
          var groupHit = false;
          Array.prototype.forEach.call(group.querySelectorAll('a'), function (a) {
            var hit = !q || a.textContent.toLowerCase().indexOf(q) !== -1;
            a.style.display = hit ? '' : 'none';
            if (hit) { groupHit = true; anyVisible = true; }
          });
          group.style.display = groupHit ? '' : 'none';
        });

        // Never a dead end: say so and suggest a way out (advisor: no-results)
        var empty = sidebar.querySelector('[data-no-results]');
        if (!empty) {
          empty = document.createElement('p');
          empty.setAttribute('data-no-results', '');
          empty.className = 'faint';
          empty.style.fontSize = 'var(--t-sm)';
          empty.style.padding = 'var(--s-3)';
          sidebar.appendChild(empty);
        }
        if (!anyVisible && q) {
          empty.innerHTML = 'No page matches “' + q.replace(/[<>&]/g, '') +
            '”.<br>Try <strong>install</strong>, <strong>sync</strong>, <strong>api</strong> or <strong>database</strong>.';
          empty.style.display = '';
        } else {
          empty.style.display = 'none';
        }
      }, 120);
    });
  }
  /* ── 10. Scroll-reactive chrome ─────────────────────────────────────────── */

  // Apple's chrome is transparent over a hero and frosted once you scroll. One
  // rAF-batched scroll listener drives both the topbar state and the progress
  // hairline, so there is no second handler competing for frames.
  var topbar = document.querySelector('.topbar');
  var progress = document.querySelector('[data-progress]');

  if (topbar || progress) {
    var chromeTicking = false;

    function updateChrome() {
      chromeTicking = false;
      var y = window.scrollY || document.documentElement.scrollTop || 0;

      if (topbar) {
        // Threshold rather than 0 so a 1px inertial jitter cannot flicker it
        topbar.setAttribute('data-scrolled', y > 8 ? 'true' : 'false');
      }

      if (progress) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
      }
    }

    window.addEventListener('scroll', function () {
      if (!chromeTicking) { chromeTicking = true; requestAnimationFrame(updateChrome); }
    }, { passive: true });
    window.addEventListener('resize', updateChrome, { passive: true });
    updateChrome();
  }

  /* ── 11. Section rise ───────────────────────────────────────────────────── */

  var riseTargets = document.querySelectorAll('.rise');
  if (riseTargets.length) {
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      Array.prototype.forEach.call(riseTargets, function (el) { el.classList.add('in'); });
    } else {
      var riseObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          riseObserver.unobserve(entry.target);   // once only
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
      Array.prototype.forEach.call(riseTargets, function (el) { riseObserver.observe(el); });
    }
  }

  /* ── 12. Number tickers ─────────────────────────────────────────────────── */

  // Counts up once when scrolled into view. Reduced motion gets the final value
  // immediately — the number is the content, the animation is not.
  var tickers = document.querySelectorAll('[data-ticker]');
  if (tickers.length) {
    var runTicker = function (el) {
      var target = Number(el.getAttribute('data-ticker')) || 0;
      if (reduceMotion.matches || target === 0) { el.textContent = String(target); return; }
      var start = null;
      var dur = 900;
      var step = function (ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        // ease-out cubic: fast start, settles precisely on the value
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(tickers, runTicker);
    } else {
      var tickObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runTicker(entry.target);
          tickObserver.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(tickers, function (el) { tickObserver.observe(el); });
    }
  }
  /* ── 13. Documentation search ───────────────────────────────────────────── */

  // Full-text search across every page, from a prebuilt index.
  //
  // Three requirements shaped this, in order of how much they constrained it:
  //
  //   1. Searching "ios" must find the paragraph about iOS on faq.html even
  //      though the reader is on a different page. That needs text the browser
  //      does not have, so `assets/search-index.json` is generated at build time
  //      by scripts/build-search-index.mjs and fetched once, lazily.
  //   2. A hit must land on the section, not the page. The index is keyed on
  //      `<h2 id>` / `<h3 id>` boundaries so every result carries an anchor.
  //   3. Arriving at a section is disorienting if you cannot see why. The term
  //      is highlighted on arrival and the highlight fades after ~2.5s — long
  //      enough to locate, short enough not to become permanent decoration.
  //
  // The index is 148 KB, so it is fetched on first interaction rather than on
  // page load. Nobody pays for search they do not use.
  (function docSearch() {
    var form = document.querySelector('[data-docsearch]');
    var input = form && form.querySelector('input');
    var list = document.querySelector('[data-docsearch-results]');
    if (!form || !input || !list) return;

    var HL_KEY = 'isotope-docs-hl';    // survives the navigation, then cleared
    var index = null;                  // populated on first use
    var loading = false;

    /* ── Nav fallback ─────────────────────────────────────────────────────────
       Until the index arrives — and permanently if it 404s — search still works
       over the drawer links, which are already in the DOM. Degraded, not
       broken: a slow network gets page-level results rather than nothing. */
    var navIndex = [];
    Array.prototype.forEach.call(document.querySelectorAll('.drawer a[href]'), function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (navIndex.some(function (n) { return n.f === href; })) return;
      navIndex.push({ f: href, t: a.textContent.trim(), h: '', s: a.textContent.trim(), x: '' });
    });

    /* ── Synonyms ─────────────────────────────────────────────────────────────
       Readers describe symptoms and use abbreviations. Without this, "black
       screen" and "login" only match pages that happen to use those exact
       words in a heading. Applied to the page, not the section, since these are
       whole-topic aliases. */
    var ALIAS = {
      'getting-started': 'install setup termux node npm quickstart first run begin',
      'configuration': 'env environment variable secret port config dotenv',
      'supabase-setup': 'supabase postgres project anon key service role sql google oauth login sign in provider consent redirect uri wildcard bucket storage rls',
      'sync-and-backup': 'sync backup restore snapshot cloud export import migrate data loss bucket',
      'backup-console': 'backup console restore snapshot recovery disaster verify',
      'community': 'group leaderboard chat friend invite challenge social buddy',
      'architecture': 'design internal server patch service worker offline cache how it works',
      'api-reference': 'api endpoint route http json rest request response',
      'database': 'rls row level security table policy trigger function schema migration column',
      'cli': 'command line isotope start stop doctor update terminal shell',
      'android-apk': 'apk android app pip picture in picture overlay floating timer install gradle',
      'admin': 'admin console dashboard maintenance owner',
      'troubleshooting': 'error broken black screen white screen crash fix problem debug log stuck blank not working',
      'faq': 'question answer why how common ios iphone ipad apple',
      'contributing': 'contribute pull request pr development git branch',
      'changelog': 'release version history change update what is new',
      'security': 'security rls auth token vulnerability report disclosure jwt',
      'privacy': 'privacy data telemetry tracking gdpr analytics',
      'terms': 'terms condition licence use acceptable',
      'license': 'licence mit copyright attribution third party open source'
    };

    function aliasFor(file) {
      return ALIAS[file.replace(/^\.\//, '').replace(/\.html$/, '')] || '';
    }

    /* ── Loading ─────────────────────────────────────────────────────────────── */

    function loadIndex() {
      if (index || loading) return Promise.resolve(index);
      loading = true;
      // Root-relative so it resolves identically from 404.html at any depth.
      var base = location.pathname.replace(/[^/]*$/, '');
      return fetch(base + 'assets/search-index.json')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (json) {
          index = (json && json.e) || null;
          loading = false;
          return index;
        })
        .catch(function () { loading = false; return null; });
    }

    /* ── Matching ────────────────────────────────────────────────────────────── */

    function esc(str) {
      return String(str).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }
    function rxEsc(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    // Subsequence match, so "gauth" finds "Google auth". Last in the scoring
    // order because it matches very loosely.
    function fuzzy(hay, q) {
      var i = 0;
      for (var c = 0; c < hay.length && i < q.length; c++) if (hay.charAt(c) === q.charAt(i)) i++;
      return i === q.length;
    }

    function score(entry, q, terms) {
      var heading = entry.s.toLowerCase();
      var body = (entry.x || '').toLowerCase();
      var alias = aliasFor(entry.f);
      var wordRx = new RegExp('\\b' + rxEsc(q));

      // Heading matches rank above body matches throughout: a section whose
      // title is the query is almost always the intended destination.
      if (heading === q) return 140;
      if (heading.indexOf(q) === 0) return 120;
      if (wordRx.test(heading)) return 105;
      if (heading.indexOf(q) !== -1) return 90;
      if (wordRx.test(body)) return 70;
      if (body.indexOf(q) !== -1) return 55;
      if (alias.indexOf(q) !== -1) return 45;
      if (terms.length > 1) {
        var hay = heading + ' ' + body + ' ' + alias;
        if (terms.every(function (t) { return hay.indexOf(t) !== -1; })) return 35;
      }
      if (q.length >= 3 && fuzzy(heading, q)) return 18;
      return 0;
    }

    function search(q) {
      var pool = index || navIndex;
      var terms = q.split(/\s+/).filter(Boolean);
      var hits = [];
      for (var i = 0; i < pool.length; i++) {
        var sc = score(pool[i], q, terms);
        if (sc > 0) hits.push({ e: pool[i], s: sc });
      }
      hits.sort(function (a, b) {
        if (b.s !== a.s) return b.s - a.s;
        // Page-level entries before their own subsections at equal score.
        if (!a.e.h !== !b.e.h) return a.e.h ? 1 : -1;
        return a.e.s.length - b.e.s.length;
      });
      return hits.slice(0, 8);
    }

    /* ── Snippet ─────────────────────────────────────────────────────────────
       A result is far easier to judge with the sentence around the match than
       with a section title alone. The window is centred on the hit and trimmed
       to word boundaries so it does not start mid-word. */
    function snippet(text, q) {
      if (!text) return '';
      var at = text.toLowerCase().indexOf(q);
      if (at === -1) return text.slice(0, 110) + (text.length > 110 ? '…' : '');
      var from = Math.max(0, at - 42);
      var to = Math.min(text.length, at + q.length + 68);
      var cut = text.slice(from, to);
      if (from > 0) cut = cut.replace(/^\S*\s/, '…');
      if (to < text.length) cut = cut.replace(/\s\S*$/, '…');
      return cut;
    }

    function mark(text, q) {
      var at = text.toLowerCase().indexOf(q);
      if (at === -1 || !q) return esc(text);
      return esc(text.slice(0, at)) + '<mark>' + esc(text.slice(at, at + q.length)) +
             '</mark>' + esc(text.slice(at + q.length));
    }

    /* ── Rendering ───────────────────────────────────────────────────────────── */

    var active = -1;

    function render(hits, q) {
      active = -1;
      if (!hits.length) {
        list.innerHTML = '<li class="askbar-empty">No match for <strong>' + esc(q) + '</strong>' +
          '<small>Try <em>sync</em>, <em>rls</em>, <em>ios</em> or <em>black screen</em>' +
          ' — or open <a href="./troubleshooting.html">Troubleshooting</a></small></li>';
        list.hidden = false;
        return;
      }
      list.innerHTML = hits.map(function (r) {
        var e = r.e;
        // The query is carried in the URL so the destination page knows what to
        // highlight. `hl` rather than a hash fragment, because the hash is
        // already being used for the section anchor.
        var url = e.f + (e.h ? '#' + e.h : '') +
                  (e.h ? '' : '') ;
        var sep = url.indexOf('#') === -1 ? '?' : '';
        var href = e.h
          ? e.f + '?hl=' + encodeURIComponent(q) + '#' + e.h
          : e.f + '?hl=' + encodeURIComponent(q);
        var snip = e.x ? snippet(e.x, q) : '';
        return '<li' + (e.d ? ' class="is-sub"' : '') + '><a href="' + esc(href) + '">' +
               '<span class="r-title">' + mark(e.s, q) + '</span>' +
               '<span class="r-page">' + esc(e.t) + '</span>' +
               (snip ? '<span class="r-snip">' + mark(snip, q) + '</span>' : '') +
               '</a></li>';
      }).join('');
      list.hidden = false;
    }

    function items() { return list.querySelectorAll('a'); }

    function setActive(next) {
      var all = items();
      if (!all.length) return;
      if (active >= 0 && all[active]) all[active].removeAttribute('data-active');
      active = (next + all.length) % all.length;
      all[active].setAttribute('data-active', 'true');
      if (all[active].scrollIntoView) all[active].scrollIntoView({ block: 'nearest' });
    }

    /* ── Behaviour ───────────────────────────────────────────────────────────── */

    var debounceId = null;

    function run() {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { list.hidden = true; list.innerHTML = ''; return; }
      // Render immediately from whatever index is available, then again once the
      // full one lands. The reader sees results at the first keystroke rather
      // than waiting on a fetch.
      render(search(q), q);
      if (!index) {
        loadIndex().then(function (loaded) {
          if (loaded && input.value.trim().toLowerCase() === q) render(search(q), q);
        });
      }
    }

    input.addEventListener('input', function () {
      clearTimeout(debounceId);
      debounceId = setTimeout(run, 110);
    });

    // Warm the index on focus, so it is usually ready before the second keystroke.
    input.addEventListener('focus', function () {
      loadIndex();
      if (input.value.trim().length >= 2 && list.innerHTML) list.hidden = false;
    });

    input.addEventListener('keydown', function (e) {
      var all = items();
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) run(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Escape') { list.hidden = true; }
      else if (e.key === 'Enter' && active >= 0 && all[active]) { e.preventDefault(); all[active].click(); }
    });

    form.addEventListener('submit', function (e) {
      var q = input.value.trim().toLowerCase();
      if (!q) return;
      var hits = search(q);
      if (!hits.length) return;
      e.preventDefault();
      var top = hits[0].e;
      location.href = top.f + '?hl=' + encodeURIComponent(q) + (top.h ? '#' + top.h : '');
    });

    document.addEventListener('click', function (e) {
      if (!form.contains(e.target) && !list.contains(e.target)) list.hidden = true;
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      var el = document.activeElement;
      var tag = el && el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
  })();

  /* ── 13b. Arrival highlight ─────────────────────────────────────────────────
     Runs on every page, not only after a search: `?hl=<term>` is a shareable
     link that lands on a section with the term marked.

     Why the highlight fades rather than persisting: a permanent mark competes
     with the text for the rest of the session, and the reader has already found
     what they came for by the time they have read the sentence. 2.5s visible
     then a 600ms fade is the shortest that still survives a smooth scroll —
     removing it sooner would mean the mark disappears before the page has
     finished moving.

     The URL is cleaned afterwards so a reload does not re-highlight, and so the
     address bar does not keep a stale query in it. */
  (function arrivalHighlight() {
    var params = new URLSearchParams(location.search);
    var term = (params.get('hl') || '').trim();
    if (!term || term.length < 2) return;

    var VISIBLE_MS = 2500;
    var FADE_MS = 600;
    var MAX_MARKS = 40;      // a common word must not repaint the whole page

    // Only inside the content region: marking the term in the nav or footer
    // would be noise, and those are not where the reader is looking.
    var root = document.querySelector('.content') || document.querySelector('main');
    if (!root) return;

    var lower = term.toLowerCase();
    var marks = [];

    // TreeWalker rather than innerHTML replacement: rewriting HTML would destroy
    // event listeners, break the copy buttons, and risk mangling markup inside
    // code blocks. This only ever splits text nodes.
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.toLowerCase().indexOf(lower) === -1) {
          return NodeFilter.FILTER_REJECT;
        }
        // Never inside an existing mark, a script, or a heading anchor glyph.
        var p = node.parentNode;
        while (p && p !== root) {
          var tag = p.nodeName;
          if (tag === 'MARK' || tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
          if (p.classList && p.classList.contains('anchor')) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var targets = [];
    var node;
    while ((node = walker.nextNode()) && targets.length < MAX_MARKS) targets.push(node);

    targets.forEach(function (textNode) {
      var text = textNode.nodeValue;
      var at = text.toLowerCase().indexOf(lower);
      if (at === -1) return;
      var after = textNode.splitText(at);
      after.splitText(term.length);
      var m = document.createElement('mark');
      m.className = 'hl';
      m.textContent = after.nodeValue;
      after.parentNode.replaceChild(m, after);
      marks.push(m);
    });

    if (!marks.length) return;

    // If the URL had no fragment, scroll to the first hit — otherwise the
    // browser has already handled the anchor and moving again would fight it.
    if (!location.hash && marks[0].scrollIntoView) {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      marks[0].scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }

    // Announce it, since a visual highlight tells a screen-reader user nothing.
    var live = document.createElement('p');
    live.className = 'sr-only';
    live.setAttribute('role', 'status');
    live.textContent = marks.length === 1
      ? 'One match for ' + term + ' highlighted on this page.'
      : marks.length + ' matches for ' + term + ' highlighted on this page.';
    root.insertBefore(live, root.firstChild);

    setTimeout(function () {
      marks.forEach(function (m) { m.classList.add('fading'); });
      setTimeout(function () {
        marks.forEach(function (m) {
          // Unwrap rather than just fading: leaving 40 <mark> elements in the
          // DOM at opacity 0 would keep affecting text selection and copy.
          var parent = m.parentNode;
          if (!parent) return;
          parent.replaceChild(document.createTextNode(m.textContent), m);
          parent.normalize();
        });
        if (live.parentNode) live.parentNode.removeChild(live);
      }, FADE_MS);
    }, VISIBLE_MS);

    // Drop ?hl= from the address bar without adding a history entry, so Back
    // still goes where the reader expects.
    if (window.history && history.replaceState) {
      params.delete('hl');
      var qs = params.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
  })();

  /* ── 13. Per-page backdrop ──────────────────────────────────────────────── */

  // Five abstract fields ship with the site, and every page should get a
  // different one — a reader moving through the docs sees the colour shift as
  // they go, which makes each page feel like its own place rather than one long
  // scroll.
  //
  // The choice is derived from the pathname rather than randomised. Random would
  // mean the same page looked different on every visit, which reads as a bug
  // instead of as design, and it would make any visual regression impossible to
  // reproduce. A hash of the path is stable per page, stable across reloads, and
  // still spreads the five images unevenly enough to look unplanned.
  (function backdrop() {
    var el = document.querySelector('.liquid-bg');
    if (!el) return;

    var COUNT = 5;

    // FNV-1a. Chosen over summing character codes because short similar strings
    // ("terms.html" / "privacy.html") would otherwise land on the same value.
    var path = location.pathname.replace(/\/index\.html$/, '/') || '/';
    var h = 0x811c9dc5;
    for (var i = 0; i < path.length; i++) {
      h ^= path.charCodeAt(i);
      h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
    }
    var pick = String((h % COUNT) + 1);

    for (var n = 1; n <= COUNT; n++) el.classList.remove('bg-' + n);
    el.classList.add('bg-' + pick);

    // Expose it so per-page accent theming can key off the same value rather
    // than computing its own and drifting out of step.
    document.documentElement.setAttribute('data-bg', pick);
  })();
})();
