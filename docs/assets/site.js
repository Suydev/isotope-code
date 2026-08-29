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
  /* ── 13. Documentation search (hero bar) ────────────────────────────────── */

  // The hero search bar has to actually work. An input that looks like search
  // and does nothing is worse than no input at all — it invites a query, accepts
  // it, and silently discards it.
  //
  // The index is built from two sources, both already on the page:
  //   - the drawer links, which list every page with its section label;
  //   - every `<h2 id>` and `<h3 id>` in the current document, so a reader can
  //     jump to a section rather than only to a page.
  // Nothing is fetched, and there is no separate index file to drift out of sync
  // with the page set.
  (function docSearch() {
    var form = document.querySelector('[data-docsearch]');
    if (!form) return;

    var input = form.querySelector('input');
    var list = document.querySelector('[data-docsearch-results]');
    if (!input || !list) return;

    /* ── Index ─────────────────────────────────────────────────────────────── */

    var index = [];
    var seen = {};

    Array.prototype.forEach.call(document.querySelectorAll('.drawer a[href]'), function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || seen[href]) return;
      seen[href] = 1;
      // The drawer groups pages under labels ("Guides", "Reference", …). Carrying
      // that through gives the result list a second line of orientation.
      var group = '';
      var prev = a.parentElement && a.parentElement.previousElementSibling;
      var label = a.parentElement && a.parentElement.querySelector
        ? null : null;
      var wrap = a.closest ? a.closest('.drawer') : null;
      if (wrap) {
        var node = a.previousElementSibling;
        while (node) {
          if (node.classList && node.classList.contains('drawer-label')) { group = node.textContent.trim(); break; }
          node = node.previousElementSibling;
        }
      }
      index.push({ href: href, title: a.textContent.trim(), group: group, kind: 'page' });
    });

    // Sections of the page currently open. Cheap, and it makes the bar useful
    // from anywhere in the docs rather than only on the landing page.
    Array.prototype.forEach.call(document.querySelectorAll('.content h2[id], .content h3[id]'), function (h) {
      var text = h.textContent.replace('#', '').trim();
      if (!text) return;
      index.push({
        href: '#' + h.id,
        title: text,
        group: 'On this page',
        kind: 'section'
      });
    });

    if (!index.length) return;

    /* ── Synonyms ──────────────────────────────────────────────────────────────
       A reader searching "black screen", "RLS" or "google login" is describing a
       symptom or an abbreviation, not a page title. Without this table the search
       only matches words that already appear in the link text, which is the least
       useful half of what people type. */
    var ALIAS = {
      'getting-started': 'install setup termux node npm quickstart first run begin start',
      'configuration': 'env environment variable secret port config settings dotenv',
      'supabase-setup': 'supabase postgres project anon key service role sql google oauth login sign in signin provider consent screen redirect uri client id pkce',
      'sync-and-backup': 'sync backup restore snapshot cloud export import migrate data loss',
      'backup-console': 'backup console web ui localhost restore snapshot recovery disaster schema setup fresh project eta progress job detached verify buckets storage s3 pause paused free tier',
      'community': 'group leaderboard chat friend invite challenge social buddy',
      'architecture': 'design internal server patch service worker offline cache how it works',
      'api-reference': 'api endpoint route http json rest request response',
      'database': 'rls row level security table policy trigger function schema sql migration column',
      'cli': 'command line isotope start stop doctor update terminal shell',
      'android-apk': 'apk android app pip picture in picture overlay floating timer widget install gradle build signed debug package',
      'admin': 'admin console dashboard maintenance owner',
      'troubleshooting': 'error broken black screen white screen crash fix problem debug log stuck blank not working google signin redirect mismatch bounce',
      'faq': 'question answer why how common',
      'contributing': 'contribute pull request pr development git branch',
      'changelog': 'release version history change update what is new',
      'security': 'security rls auth token vulnerability report disclosure jwt',
      'privacy': 'privacy data telemetry tracking gdpr analytics',
      'terms': 'terms condition licence use acceptable',
      'license': 'licence mit copyright attribution third party open source'
    };

    index.forEach(function (item) {
      var key = item.href.replace(/^\.\//, '').replace(/\.html$/, '').replace(/^#/, '');
      item.hay = (item.title + ' ' + item.group + ' ' + (ALIAS[key] || '')).toLowerCase();
      item.lcTitle = item.title.toLowerCase();
    });

    /* ── Scoring ───────────────────────────────────────────────────────────── */

    // Subsequence match, so "gauth" finds "Google auth" and "trbl" finds
    // "Troubleshooting". Deliberately last in the scoring order: it matches very
    // loosely, so it should only decide a result when nothing better applies.
    function fuzzy(hay, q) {
      var i = 0;
      for (var c = 0; c < hay.length && i < q.length; c++) {
        if (hay.charAt(c) === q.charAt(i)) i++;
      }
      return i === q.length;
    }

    function score(item, q, terms) {
      var t = item.lcTitle;
      if (t === q) return 120;
      if (t.indexOf(q) === 0) return 95;
      // Word-boundary hit beats a match buried mid-word: "auth" should rank
      // "Google auth" above "Authorised".
      if (new RegExp('\\b' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(t)) return 85;
      if (t.indexOf(q) !== -1) return 70;
      if (item.hay.indexOf(q) !== -1) return 55;
      if (terms.length > 1 && terms.every(function (p) { return item.hay.indexOf(p) !== -1; })) return 40;
      if (q.length >= 3 && fuzzy(t, q)) return 20;
      return 0;
    }

    function matches(q) {
      var terms = q.split(/\s+/).filter(Boolean);
      return index
        .map(function (i) { return { item: i, s: score(i, q, terms) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) {
          if (b.s !== a.s) return b.s - a.s;
          // Pages before sections at equal score: a page is the more likely
          // destination when the reader has not been specific.
          if (a.item.kind !== b.item.kind) return a.item.kind === 'page' ? -1 : 1;
          return a.item.title.length - b.item.title.length;
        })
        .slice(0, 7);
    }

    /* ── Rendering ─────────────────────────────────────────────────────────── */

    function esc(str) {
      return str.replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    // Highlight the matched run so it is obvious why a result is present.
    function mark(title, q) {
      var at = title.toLowerCase().indexOf(q);
      if (at === -1 || !q) return esc(title);
      return esc(title.slice(0, at)) + '<mark>' + esc(title.slice(at, at + q.length)) +
             '</mark>' + esc(title.slice(at + q.length));
    }

    var active = -1;   // keyboard cursor

    function render(found, q) {
      active = -1;
      if (!found.length) {
        list.innerHTML = '<li class="askbar-empty">No page matches ' +
          '<strong>' + esc(q) + '</strong>' +
          '<small>Try <em>sync</em>, <em>rls</em>, <em>google</em> or <em>black screen</em>' +
          ' — or open <a href="./troubleshooting.html">Troubleshooting</a></small></li>';
        list.hidden = false;
        return;
      }
      list.innerHTML = found.map(function (r) {
        return '<li><a href="' + esc(r.item.href) + '">' +
               mark(r.item.title, q) +
               (r.item.group ? '<small>' + esc(r.item.group) + '</small>' : '') +
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
      // Keeps the highlighted row in view when the list overflows.
      if (all[active].scrollIntoView) all[active].scrollIntoView({ block: 'nearest' });
    }

    /* ── Behaviour ─────────────────────────────────────────────────────────── */

    var debounceId = null;
    var lastQuery = '';

    function run() {
      var q = input.value.trim().toLowerCase();
      lastQuery = q;
      if (q.length < 2) { list.hidden = true; list.innerHTML = ''; return; }
      render(matches(q), q);
    }

    input.addEventListener('input', function () {
      clearTimeout(debounceId);
      debounceId = setTimeout(run, 110);
    });

    // Re-open on focus if there is still a query, rather than making the reader
    // retype to see results they just dismissed.
    input.addEventListener('focus', function () {
      if (input.value.trim().length >= 2 && list.innerHTML) list.hidden = false;
    });

    input.addEventListener('keydown', function (e) {
      var all = items();
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) run(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Escape') { list.hidden = true; }
      else if (e.key === 'Enter' && active >= 0 && all[active]) {
        e.preventDefault();
        all[active].click();
      }
    });

    // Enter with no cursor opens the best match. The form keeps a real `action`
    // so this still navigates somewhere sensible if the script fails to load.
    form.addEventListener('submit', function (e) {
      var q = input.value.trim().toLowerCase();
      if (!q) return;
      var found = matches(q);
      if (!found.length) return;
      e.preventDefault();
      location.href = found[0].item.href;
    });

    document.addEventListener('click', function (e) {
      if (!form.contains(e.target) && !list.contains(e.target)) list.hidden = true;
    });

    // "/" focuses search, the convention on every documentation site that has
    // one. Guarded so it never hijacks typing in a real field.
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
