/* ============================================================================
   IsotopeAI Documentation — Dashboard behaviour
   ----------------------------------------------------------------------------
   Four jobs, all progressive enhancement. Every one of them leaves the page
   fully usable when JavaScript does not run, which is the contract site.js
   already keeps:

     1. Browse    filter the 22-page grid by area toggle and free-text query
     2. Search    query assets/search-index.json for section-level hits
     3. Recent    parse changelog.html into the release cards
     4. Demo      the interactive product walkthrough

   Kept separate from site.js on purpose. site.js is loaded by all 22 pages and
   assumes their exact shell; adding dashboard-only selectors to it would make
   a behaviour change to the dashboard a reason to re-test every other page.
   Two files, one shared stylesheet, no build step.
   ========================================================================= */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Root-relative so this resolves identically from /dashboard.html and from
     any depth, the same trick site.js uses for the 404 page. */
  var BASE = location.pathname.replace(/[^/]*$/, '');

  /* ── Shared helpers ──────────────────────────────────────────────────────── */

  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Root-relative href. Every link on this page is same-directory, and writing
  // them as ./x.html matches the markup on the other 22 pages exactly.
  function pageHref(file, anchor) {
    return './' + file + (anchor ? '#' + anchor : '');
  }

  // A search destination, in the only order a URL is valid: path, then query,
  // then fragment. site.js reads `?hl=` back off the destination to mark the
  // term, and it parses location.search — which would be empty if the query
  // were appended after the '#'. Written as one function so the two call sites
  // cannot drift into that ordering.
  function hitHref(file, anchor, q) {
    return './' + file + '?hl=' + encodeURIComponent(q) + (anchor ? '#' + anchor : '');
  }

  /* ── 1. Browse: area toggles + free-text filter ───────────────────────────
     The grid is server-rendered as real links. Everything here is a filter
     over markup that already works, which is why it degrades for free: no JS,
     and all 22 pages are listed and reachable. */

  (function browse() {
    var grid = document.querySelector('[data-dash-groups]');
    if (!grid) return;

    var input = document.querySelector('[data-dash-filter]');
    var clearBtn = document.querySelector('[data-dash-clear]');
    var status = document.querySelector('[data-dash-status]');
    var empty = document.querySelector('[data-dash-empty]');
    var emptyQ = document.querySelector('[data-dash-empty-q]');
    var areaBtns = Array.prototype.slice.call(document.querySelectorAll('[data-dash-area]'));

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-dash-card]'));
    var groups = Array.prototype.slice.call(grid.querySelectorAll('[data-dash-group]'));

    /* Area = 'all' or a specific group key. Single-select, because the areas
       are a partition of the 22 pages: every page belongs to exactly one, so
       offering combinations would let a reader construct an always-empty set
       without learning anything. "All" is the default rather than a pressed
       chip, so the initial view is the unfiltered one. */
    var activeArea = 'all';

    function cardArea(card) { return card.getAttribute('data-dash-area') || ''; }

    function matches(card, q) {
      if (!q) return true;
      // Prebuilt haystack — see the WeakMap below.
      return (haystacks.get(card) || '').indexOf(q) !== -1;
    }

    function apply() {
      var raw = input ? input.value.trim().toLowerCase() : '';
      // Collapse whitespace so "sync  backup" behaves like "sync backup".
      var q = raw.replace(/\s+/g, ' ');

      var shown = 0;

      cards.forEach(function (card) {
        var ok = (activeArea === 'all' || cardArea(card) === activeArea) && matches(card, q);
        card.hidden = !ok;
        if (ok) shown++;
      });

      // A group heading with no visible card under it is noise — it reads as a
      // section that failed to load rather than one that was filtered away.
      groups.forEach(function (group) {
        var any = group.querySelector('[data-dash-card]:not([hidden])');
        group.hidden = !any;
      });

      if (empty) {
        empty.hidden = shown !== 0;
        if (shown === 0 && emptyQ) emptyQ.textContent = raw || '(no filter)';
      }

      if (status) {
        var total = cards.length;
        var areaLabel = 'all areas';
        if (activeArea !== 'all') {
          areaLabel = (areaBtns.filter(function (b) {
            return b.getAttribute('data-dash-area') === activeArea;
          })[0] || {}).textContent || activeArea;
          areaLabel = areaLabel.replace(/\d+$/, '').trim().toLowerCase();
        }
        status.textContent = q
          ? shown + ' of ' + total + ' pages match “' + raw + '” in ' + areaLabel
          : shown + ' of ' + total + ' pages · ' + areaLabel;
      }

      if (clearBtn) clearBtn.hidden = !(input && input.value);
    }

    /* Build the haystack once. Without it, every keystroke concatenates the
       textContent of 22 cards; with it, each keystroke is 22 indexOf calls.

       Kept in a WeakMap rather than written back as a data- attribute: the
       concatenation is ~60 words per card, and round-tripping a duplicate of
       every keyword list into the DOM costs more than it saves. Nothing outside
       this closure reads it. */
    var haystacks = new WeakMap();

    cards.forEach(function (card) {
      haystacks.set(
        card,
        (card.getAttribute('data-dash-search') || card.textContent)
          .replace(/\s+/g, ' ')
          .toLowerCase()
      );
    });

    /* Stagger, capped. `.reveal-3d` reads --i off its own attribute for the
       delay, so the cascade is written the same way as everywhere else on the
       site — but only on the initial render. Re-running an entrance on every
       filter change would make typing feel like the page was rebuilding
       itself, which it is not. */
    function cascade() {
      cards.forEach(function (card, i) {
        // setProperty, not setAttribute: this writes a declaration alongside
        // any inline style already on the element. setAttribute('style', …)
        // would replace the whole attribute and silently drop one.
        var step = Math.min(i, 11);
        card.style.setProperty('--i', String(step));
        if (reduceMotion.matches) { card.classList.add('in'); return; }
        setTimeout(function () { card.classList.add('in'); }, 60 + step * 45);
      });
    }
    cascade();

    var timer = null;
    if (input) {
      input.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(apply, 110);          // debounce, as site.js does
      });
      /* Escape clears, which is what a reader expects from a search field and
         is the only way out of a filtered-to-nothing grid without reaching for
         the mouse. */
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && input.value) {
          e.preventDefault();
          input.value = '';
          apply();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = '';
        apply();
        input.focus();
      });
    }

    areaBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeArea = btn.getAttribute('data-dash-area') || 'all';
        areaBtns.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        apply();
      });
    });

    apply();
  })();

  /* ── 2. Search: section-level hits from the existing index ────────────────
     This is deliberately NOT the site.js askbar. That one owns the global "/"
     shortcut and navigates on Enter; this one is scoped to the page and, on
     Enter, jumps to the top hit. The index file, the scoring order and the
     alias table are shared, so both surfaces rank the same query the same way.

     Reusing assets/search-index.json rather than building a second index is the
     whole point: 245 sections across 22 pages already exist, and a second
     index would be a second thing to keep in step with the pages. */

  (function search() {
    var form = document.querySelector('[data-dash-search-form]');
    var input = form && form.querySelector('input');
    var list = document.querySelector('[data-dash-search-results]');
    var status = document.querySelector('[data-dash-search-status]');
    if (!form || !input || !list) return;

    var index = null;
    var loading = false;
    var active = -1;

    /* Same synonym map site.js uses, kept byte-identical so a reader who types
       "black screen" gets the same destinations here as they do from the hero
       bar. If you change one, change both. */
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
      return ALIAS[String(file).replace(/^\.\//, '').replace(/\.html$/, '')] || '';
    }

    function loadIndex() {
      if (index || loading) return Promise.resolve(index);
      loading = true;
      return fetch(BASE + 'assets/search-index.json')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (json) {
          index = (json && json.e) || null;
          loading = false;
          return index;
        })
        .catch(function () { loading = false; return null; });
    }

    function rxEsc(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function fuzzy(hay, q) {
      var i = 0;
      for (var c = 0; c < hay.length && i < q.length; c++) if (hay.charAt(c) === q.charAt(i)) i++;
      return i === q.length;
    }

    /* Same weights as site.js: a heading match outranks a body match, and a
       whole-phrase body match outranks the alias table. Changing these in one
       place only would make the two search boxes disagree on the same query,
       which is the kind of inconsistency nobody notices until they do. */
    function score(entry, q, terms) {
      var heading = entry.s.toLowerCase();
      var body = (entry.x || '').toLowerCase();
      var alias = aliasFor(entry.f);
      var wordRx = new RegExp('\\b' + rxEsc(q));

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

    function run(q) {
      if (!index) return [];
      var terms = q.split(/\s+/).filter(Boolean);
      var hits = [];
      for (var i = 0; i < index.length; i++) {
        var sc = score(index[i], q, terms);
        if (sc > 0) hits.push({ e: index[i], s: sc });
      }
      hits.sort(function (a, b) {
        if (b.s !== a.s) return b.s - a.s;
        if (!a.e.h !== !b.e.h) return a.e.h ? 1 : -1;
        return a.e.s.length - b.e.s.length;
      });
      return hits.slice(0, 8);
    }

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

    function render(hits, q) {
      active = -1;
      // aria-expanded tracks whether the list is showing, so the field's state
      // matches what a screen reader is being told exists.
      input.setAttribute('aria-expanded', 'true');
      if (!hits.length) {
        list.innerHTML = '<li class="askbar-empty">No match for <strong>' + esc(q) + '</strong>' +
          '<small>Try <em>sync</em>, <em>rls</em>, <em>pip</em> or <em>black screen</em></small></li>';
        list.hidden = false;
        if (status) status.textContent = 'No sections match “' + q + '”.';
        return;
      }
      list.innerHTML = hits.map(function (r) {
        var e = r.e;
        // ?hl= so site.js marks the term on arrival, then fades it. That
        // highlight is the reason a section-level hit is worth navigating to.
        var href = hitHref(e.f, e.h, q);
        var snip = e.x ? snippet(e.x, q) : '';
        return '<li><a href="' + esc(href) + '">' +
               '<span class="r-title">' + mark(e.s, q) + '</span>' +
               '<span class="r-page">' + esc(e.t) + '</span>' +
               (snip ? '<span class="r-snip">' + mark(snip, q) + '</span>' : '') +
               '</a></li>';
      }).join('');
      list.hidden = false;
      if (status) status.textContent = hits.length + ' section' + (hits.length === 1 ? '' : 's') + ' found.';
    }

    function items() { return list.querySelectorAll('a'); }

    // One place that closes the list, so aria-expanded can never drift out of
    // step with what is actually on screen.
    function closeList() {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }

    function setActive(next) {
      var all = items();
      if (!all.length) return;
      if (active >= 0 && all[active]) all[active].removeAttribute('data-active');
      active = (next + all.length) % all.length;
      all[active].setAttribute('data-active', 'true');
      if (all[active].scrollIntoView) all[active].scrollIntoView({ block: 'nearest' });
    }

    /* Focused, not blurred, as the trigger to fetch. The index is 148 KB; on a
       cold load nobody should pay for it, and on a warm one it is already in
       the HTTP cache. Focusing the field is the moment a reader has committed
       to searching. */
    input.addEventListener('focus', function () { loadIndex(); });

    var debounce = null;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        var q = input.value.trim().toLowerCase();
        if (q.length < 2) { list.innerHTML = ''; closeList(); if (status) status.textContent = ''; return; }
        if (!index) {
          // Render a "searching" state rather than nothing: a box that
          // silently ignores the first keystrokes reads as broken.
          if (status) status.textContent = 'Loading the section index…';
          loadIndex().then(function () {
            if (input.value.trim().toLowerCase() === q) render(run(q), q);
          });
          return;
        }
        render(run(q), q);
      }, 110);
    });

    input.addEventListener('keydown', function (e) {
      var all = items();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (list.hidden) return;
        setActive(active + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(active - 1);
      } else if (e.key === 'Escape') {
        if (!input.value) { closeList(); return; }
        input.value = '';
        closeList();
        if (status) status.textContent = '';
      } else if (e.key === 'Enter' && active >= 0 && all[active]) {
        e.preventDefault();
        all[active].click();
      }
    });

    form.addEventListener('submit', function (e) {
      var q = input.value.trim().toLowerCase();
      if (!q) return;
      var hits = run(q);
      if (!hits.length) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      // Enter goes to the top hit rather than the page's default action. The
      // form's action is ./troubleshooting.html so that with JS off, submitting
      // still lands somewhere sensible rather than reloading this page.
      var top = hits[0].e;
      location.href = hitHref(top.f, top.h, q);
    });

    document.addEventListener('click', function (e) {
      if (!form.contains(e.target) && !list.contains(e.target)) closeList();
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

  /* ── 3. Recent changes: parsed from changelog.html ────────────────────────
     Parsed rather than hand-copied, because a hand-copied list is a claim about
     the changelog that stops being true the moment someone adds a release, and
     nothing on this site would catch it. The fetch is best-effort: if it fails,
     the section keeps a working link to the full changelog rather than
     collapsing. */

  (function recentReleases() {
    var list = document.querySelector('[data-dash-releases]');
    var note = document.querySelector('[data-dash-releases-note]');
    if (!list) return;

    // Drop <script>, <style> and comments before parsing. A DOMParser builds a
    // full document including its scripts; they never execute here, but they
    // would otherwise inject noise into textContent.
    function textOf(el) {
      return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    fetch(BASE + 'changelog.html')
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (html) {
        if (!html) throw new Error('unavailable');
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var scope = doc.querySelector('.content') || doc.body;

        /* Each release is an <h2 id="v…"> plus the <p class="muted"> summary and the
           bullet list that follows it, up to the next <h2>. Anchoring on the
           heading rather than on a position is what lets this survive someone
           reordering the page or adding a section to it. */
        var cards = [];
        var headings = Array.prototype.slice.call(scope.querySelectorAll('h2[id]'));

        headings.forEach(function (h, i) {
          var id = h.getAttribute('id') || '';
          /* Version headings only: `v` followed by a digit. A bare first-letter
             test would also match #versioning, which is a prose section about
             semver and has nothing to do with any release. #unreleased is
             excluded too, and deliberately — this panel says what shipped. */
          if (!/^v\d/.test(id)) return;

          // Stop at the next h2 — collect siblings until the boundary.
          var summary = '';
          var bullets = [];
          for (var n = h.nextElementSibling; n && n.tagName !== 'H2'; n = n.nextElementSibling) {
            if (n.tagName === 'P' && !summary && n.classList.contains('muted')) {
              summary = textOf(n);
              continue;
            }
            if (n.tagName === 'UL') {
              Array.prototype.slice.call(n.querySelectorAll('li')).forEach(function (li) {
                if (bullets.length < 2) bullets.push(textOf(li));
              });
            }
          }

          // "3.4.1 — 27 August 2026" -> version, date. The em dash is written as
          // a literal — in the source, and as &mdash; on older pages.
          var full = textOf(h).replace(/#$/, '').trim();
          var parts = full.split(/\s+[—–-]\s+/);
          cards.push({
            id: id,
            version: (parts[0] || full).trim(),
            date: (parts[1] || '').replace(/[^0-9A-Za-z ]/g, '').trim(),
            summary: summary,
            bullets: bullets,
            order: i
          });
        });

        if (!cards.length) throw new Error('no releases parsed');

        // The first parsed release IS the latest one — that is what "first"
        // means in a newest-first changelog. Deriving it here rather than
        // hardcoding a version string is the difference between this panel
        // updating itself on the next release and quietly going stale.
        var latest = cards[0].id;

        list.innerHTML = cards.map(function (c) {
          // data-latest drives the raised surface + accent bar in dashboard.css.
          // It is a data attribute rather than a class so the styling rule can
          // key off a fact ("is this the newest release?") rather than a
          // position that would break the moment a card were reordered.
          //
          // Each release is an <li> wrapping an <a>, because the container is a
          // <ul>: only <li> is a valid child of a list. The <li> is the grid
          // item and the link fills it, so the visible card is still one hit
          // target and the list is announced as a list of releases.
          return '<li class="dash-rel-item">' +
          '<a class="dash-rel reveal-3d" data-latest="' + (c.id === latest ? 'true' : 'false') +
            '" href="' + esc(pageHref('changelog.html', c.id)) + '">' +
            '<span class="dash-rel-head">' +
              '<span class="dash-rel-version">' + esc(c.version) + '</span>' +
              (c.date ? '<span class="dash-rel-date">' + esc(c.date) + '</span>' : '') +
              (c.id === latest
                ? '<span class="pill post">latest</span>'
                : '') +
            '</span>' +
            (c.summary ? '<p class="dash-rel-sum">' + esc(c.summary) + '</p>' : '') +
            (c.bullets.length
              ? '<ul class="dash-rel-points">' + c.bullets.map(function (b) {
                  return '<li>' + esc(b.length > 150 ? b.slice(0, 150) + '…' : b) + '</li>';
                }).join('') + '</ul>'
              : '') +
          '</a></li>';
        }).join('');

        if (note) note.hidden = true;

        /* The cards are written after load, so site.js's reveal observer has
           already swept the document and never saw them. Add .in on a stagger
           here, matching the --i cadence used above — or skip it entirely under
           reduced motion, in which case the visible state is the correct one. */
        var els = Array.prototype.slice.call(list.querySelectorAll('.reveal-3d'));
        if (reduceMotion.matches || !('IntersectionObserver' in window)) {
          els.forEach(function (el) { el.classList.add('in'); });
        } else {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              var el = entry.target;
              var i = Number(el.getAttribute('data-i') || 0);
              setTimeout(function () { el.classList.add('in'); }, i * 50);
              io.unobserve(el);
            });
          }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
          els.forEach(function (el, i) { el.setAttribute('data-i', String(Math.min(i, 6))); io.observe(el); });
        }
      })
      .catch(function () {
        // Say what happened, and keep the way out.
        list.innerHTML = '';
        if (note) {
          note.hidden = false;
          note.innerHTML = 'Release notes are not loaded here. ' +
            '<a href="' + esc(pageHref('changelog.html')) + '">Read the full changelog</a> ' +
            'in the repository — it is the authoritative record.';
        }
      });
  })();

  /* ── 4. The interactive demo ──────────────────────────────────────────────
     An app shell you can drive. Five study surfaces, a workspace rail, a
     stacked pane canvas, a summary rail, and a running trace of what the
     simulated code wrote.

     ── The rule that shapes this whole module ─────────────────────────────────
     Two kinds of thing are on screen and they must never be confused.

       The STAGE is illustrative. Session lengths, subject names, group
       names, member counts and leaderboard rows are invented so there is
       something to show. Every one a reader could mistake for a claim about
       the shipped product carries a visible `sample` marker at the point it
       appears.

       The TRACE is not illustrative. Every function name, table name, column
       name, status value and branch in it was read out of isotope-complete.sql
       or public/assets. That is what makes the demo worth more than a mockup:
       if the trace and the SQL ever disagree, the SQL is right.

     ── Why the demo opens signed out ─────────────────────────────────────────
     A fresh install redirects / and /demo to /auth, and this build disables
     the demo gate, so nobody reaches the dashboard without signing in first.
     Reproducing that ordering is more honest than starting past it: the rail
     opens on the auth wall and Explore is what walks a reader through it.

     ── Why this fetches nothing ──────────────────────────────────────────────
     The rest of this file fetches two same-origin files. This module fetches
     nothing at all. A demo of an offline-first product that needs a network
     round trip to demonstrate the offline-first product would be a joke, and
     it would also make the section fail on a cold cache in exactly the case
     where it is most likely to be opened.

     ── State lives in one object ─────────────────────────────────────────────
     Every surface reads from and writes to `S`. There is no per-pane closure
     holding state, so Reset is a single assignment rather than five
     teardowns, and the sync surface can honestly read a session the focus
     surface created. */
  (function demo() {
    var root = document.querySelector('[data-demo]');
    if (!root) return;

    /* ── Real data ────────────────────────────────────────────────────────────
       window.ISOTOPE_DEMO, loaded from assets/demo-data.js, is derived from a
       genuine IsotopeAI backup snapshot: 195 sessions, 32 tasks, 3 subjects,
       92 daily logs, exported 2026-10-08. So the syllabus, the task titles,
       the focus series and the streak are all real numbers from a real
       install rather than plausible fiction.

       What that does and does not make this: the CONTENT is real and the
       INTERACTION is a simulation. The snapshot is a point-in-time export, not
       a live account, and the controls below still write to nothing. Every
       surface therefore says which it is showing.

       Fallback is total: if the fixture fails to load, this module runs on an
       empty-but-valid object and renders structure rather than throwing, so a
       blocked asset cannot take the page down with it. */
    var FIX = window.ISOTOPE_DEMO || {};

    var SAMPLE = {
      snapshot: FIX.snapshot || '2026-10-08',

      /* The fixture already converts to seconds; the focus length is the one
         thing that stays invented, because a demo needs a session a reader can
         actually finish. It is labelled as such at the point of use. */
      focusMinutes: 25,

      base: {
        total_study_seconds: (FIX.totalMinutes || 0) * 60,
        total_hours:        Math.round(((FIX.totalMinutes || 0) / 60) * 100) / 100,
        weekly_hours:       Math.round(((FIX.weekMinutes || 0) / 60) * 100) / 100,
        monthly_hours:      Math.round(((FIX.fortnightMinutes || 0) / 60) * 100) / 100,
        session_count:      FIX.sessionCount || 0,
        total_sessions:     FIX.sessionCount || 0,
        current_streak:     FIX.streak || 0,
        max_streak_days:    FIX.streak || 0
      },

      /* Real subjects, chapters and topics. The 14-day series is real
         focus-hours per day, used by the summary rail. */
      subjects: FIX.subjects || [],
      series:  FIX.series || [],
      recent:  FIX.recent || [],

      /* Real task titles with their real status and priority, as the export
         recorded them. tasks.status is a free column in the schema, so these
         five values are the app's, not the dump's. */
      tasks: (FIX.tasks || []).map(function (t) {
        return {
          id: 'x' + Math.random().toString(36).slice(2, 9),
          title: t.title, subject: t.subject, status: t.status, priority: t.priority
        };
      }),

      /* join_policy is a real column defaulting to 'request'. Both groups are
         invented because a personal backup contains nobody's study groups —
         but the two policies they exercise are the real branches of
         community_join_group. */
      groups: [
        { name: 'Physics revision group', policy: 'instant',
          members: [['AR', 'A. R.', 'member'], ['SM', 'S. M.', 'member'], ['JO', 'J. O.', 'owner']] },
        { name: 'JEE Main PCM squad', policy: 'request',
          members: [['PK', 'P. K.', 'owner'], ['TA', 'T. A.', 'member']] }
      ]
    };

    /* A leaderboard is the one thing a personal backup genuinely cannot
       supply — it is other people. So it is invented, labelled as invented,
       and its ranking rule (weekly_hours, then total_hours) is the real one
       from get_leaderboard. */
    SAMPLE.board = [
      ['Sample user', SAMPLE.base.total_hours],
      ['Another account', SAMPLE.base.total_hours * 0.88],
      ['A third account',  SAMPLE.base.total_hours * 0.76]
    ];

    var VIEWS = [
      { id: 'focus',    label: 'Focus' },
      { id: 'tasks',    label: 'Tasks' },
      { id: 'syllabus', label: 'Syllabus' },
      { id: 'groups',   label: 'Groups' },
      { id: 'sync',     label: 'Sync' }
    ];

    /* ── The sample marker ────────────────────────────────────────────────────
       The honesty contract, and the reason this is a helper rather than a
       string concatenation: an invented figure must be labelled AT THE POINT IT
       APPEARS, in a form that cannot be missed — not mentioned once in a
       footnote the reader has already scrolled past.

       `caption(parts)` turns the literal token 'sample' into a visible pill. A
       caption that mentions an invented value physically cannot render without
       its marker: you would have to go out of your way to delete the token. */
    var SAMPLE_TOKEN = 'sample';

    function caption(parts) {
      var p = el('p', 'demo-caption');
      parts.forEach(function (part) {
        if (part === SAMPLE_TOKEN) p.appendChild(el('span', 'demo-samp', SAMPLE_TOKEN));
        else p.appendChild(document.createTextNode(part));
      });
      return p;
    }

    /* ── State ───────────────────────────────────────────────────────────────
       One object, rebuilt by reset(). Derived values are recomputed rather
       than incremented in two places, so a value cannot drift between the
       pane and the trace. */
    var S = null;

    function freshState() {
      var openSubjects = {};
      openSubjects[SAMPLE.subjects[0].name] = true;
      return {
        view: 'auth',                  // auth | focus | tasks | syllabus | groups | sync
        signedIn: false,

        /* focus */
        phase: 'idle',                 // idle | running | finished
        elapsed: 0,                    // seconds
        sessionKey: 'demo-session-1',
        processed: false,              // has this session id been counted already
        subject: SAMPLE.subjects[0].name,
        summary: Object.assign({}, SAMPLE.base),

        /* tasks */
        tasks: SAMPLE.tasks.map(function (t) { return Object.assign({}, t); }),
        taskSeq: SAMPLE.tasks.length + 1,

        /* syllabus */
        openSubjects: openSubjects,

        /* community */
        joined: { instant: false, request: false },
        requestState: 'none',          // none | pending | accepted

        /* sync */
        syncPhase: 'local',            // local | queued | reconciled | refused
        queue: [],

        /* areas the reader adds from the rail */
        extraAreas: []
      };
    }

    /* ── Small helpers ─────────────────────────────────────────────────────── */

    function $(sel, ctx) { return (ctx || root).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); }

    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }

    var timer = null;                 // the one interval, owned by this module

    function stopClock() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function clock(secs) {
      var s = Math.max(0, Math.floor(secs));
      var m = Math.floor(s / 60);
      var r = s % 60;
      return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
    }

    /* hhmm derived from seconds, not from hours: the summary rail's hero
       figure reads total_study_seconds, which is a bigint. Deriving both from
       one place is what stops the pane and the rail disagreeing. */
    function hhmmFromSecs(secs) {
      var m = Math.floor(Math.max(0, secs) / 60);
      return Math.floor(m / 60) + 'h ' + (m % 60 < 10 ? '0' : '') + (m % 60) + 'm';
    }

    function hhmm(h) {
      var m = Math.floor(h * 60);
      return Math.floor(m / 60) + 'h ' + (m % 60 < 10 ? '0' : '') + (m % 60) + 'm';
    }

    function plural(n, one, many) { return n === 1 ? one : many; }

    /* ── The trace ───────────────────────────────────────────────────────────
       Append-only, and role="log" in the markup so a reader hears new lines
       without focus being yanked off the control they just pressed.

       Bounded: a log that grows forever is a memory leak on a docs page, and
       a reader who has clicked through forty times does not want forty lines.
       Capped at 40, dropping the oldest. */
    function traceLine(kind, k, v) {
      var list = $('[data-demo-log]');
      if (!list) return;

      var li = el('li', 'demo-trace-line');
      li.setAttribute('data-kind', kind);
      li.appendChild(el('span', 'demo-trace-k', k));
      // textContent, never innerHTML: these strings contain < and > (SQL,
      // JSON) and are not markup.
      li.appendChild(el('span', 'demo-trace-v', v));
      list.appendChild(li);

      while (list.children.length > 40) list.removeChild(list.firstChild);
      list.scrollTop = list.scrollHeight;

      var n = $('[data-demo-trace-count]');
      if (n) {
        n.textContent = list.children.length + ' line' + plural(list.children.length, '', 's');
      }
    }

    /* ── The view switcher ───────────────────────────────────────────────────
       A radiogroup, so the APG contract is implemented rather than implied:
       ArrowLeft/Right (and Up/Down) move and activate, Home/End jump to the
       ends, arrows wrap. Activation is automatic because each view is cheap
       to render and a reader who has arrowed across expects to land on it.

       Roving tabindex: exactly one radio is in the tab order at a time, so Tab
       leaves the group rather than walking through all five.

       The sliding thumb is decorative and positioned from measured layout
       here, so it cannot drift out of sync with the state the way a CSS-only
       :checked selector can once a label wraps. */
    var modeBtns = $$('[data-demo-modes] .demo-mode');
    var thumb = $('.demo-modes-thumb');

    function moveThumb(btn) {
      if (!thumb || !btn) return;
      thumb.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
      thumb.style.width = btn.offsetWidth + 'px';
    }

    function setView(view, focusIt) {
      if (!S.signedIn && view !== 'focus') return;   // nothing past the auth wall
      S.view = view;

      modeBtns.forEach(function (b) {
        var on = b.getAttribute('data-view') === view;
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        // Roving tabindex: exactly one radio is in the tab order, so Tab
        // leaves the group rather than walking through all five.
        b.setAttribute('tabindex', on ? '0' : '-1');
        // Every surface needs an account; signed out there is none.
        b.disabled = !S.signedIn;
        if (on) { moveThumb(b); if (focusIt) b.focus(); }
      });

      renderAll();
    }

    modeBtns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (!b.disabled) setView(b.getAttribute('data-view'), false);
      });

      b.addEventListener('keydown', function (e) {
        var next = null;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown': next = (i + 1) % modeBtns.length; break;
          case 'ArrowLeft':
          case 'ArrowUp':   next = (i - 1 + modeBtns.length) % modeBtns.length; break;
          case 'Home':       next = 0; break;
          case 'End':        next = modeBtns.length - 1; break;
          default: return;                      // let everything else pass
        }
        e.preventDefault();                      // stop the page scrolling
        var target = modeBtns[next];
        if (!target.disabled) setView(target.getAttribute('data-view'), true);
      });
    });

    /* ── Counter ─────────────────────────────────────────────────────────────
       role="status" so switching views is announced without moving focus off
       the radio the reader is holding. */
    function count() {
      var out = $('[data-demo-count]');
      if (!out) return;

      if (S.view === 'auth') { out.textContent = 'signed out - /auth'; return; }
      var ids = VIEWS.map(function (v) { return v.id; });
      var i = ids.indexOf(S.view);
      if (i < 0) i = 0;                          // ids and order disagreeing
      out.textContent = (i + 1) + ' of ' + VIEWS.length + ' surfaces - ' + VIEWS[i].label;
    }

    /* ── Workspace rail ───────────────────────────────────────────────────────
       A tree: study areas, with the open panes of the selected area indented
       beneath it. Each node is a button carrying its own selected/expanded
       state, so the shape of the tree is announced rather than implied. */
    function areas() {
      return SAMPLE.subjects.map(function (s) { return s.name; }).concat(S.extraAreas);
    }

    function subjectByName(name) {
      return SAMPLE.subjects.filter(function (s) { return s.name === name; })[0];
    }

    /* Which panes a subject opens. Real: each names a surface the app has, or
       the route it opens. */
    function panesFor(name) {
      var subject = subjectByName(name);
      if (!subject) return [];
      return [
        { view: 'focus',    label: 'Focus timer' },
        { view: 'syllabus', label: subject.chapters.length + ' chapters' },
        { view: 'tasks',    label: 'Tasks' },
        { view: 'groups',   label: 'Study groups' },
        { view: 'sync',     label: 'Sync queue' }
      ];
    }

    function renderRail() {
      var box = $('[data-demo-rail]');
      if (!box) return;
      box.textContent = '';

      areas().forEach(function (name) {
        var isSubject = !!subjectByName(name);
        var selected = S.subject === name;

        var row = el('button', 'demo-row-ws');
        row.type = 'button';
        row.setAttribute('role', 'treeitem');
        row.setAttribute('aria-selected', selected ? 'true' : 'false');
        row.setAttribute('aria-expanded', isSubject && selected && S.signedIn ? 'true' : 'false');
        row.appendChild(el('span', 'demo-row-ws-label', name));

        row.addEventListener('click', function () {
          if (!isSubject) {
            traceLine('info', 'area', name + ' - custom subject, no chapters row yet');
            return;
          }
          if (selected) {
            // A second press collapses, so the tree can close.
            S.openSubjects[name] = !S.openSubjects[name];
            traceLine('info', 'area', name + ' - ' +
              (S.openSubjects[name] ? 'expanded' : 'collapsed'));
          } else {
            S.subject = name;
            S.openSubjects[name] = true;
            S.subject = name;
            traceLine('info', 'area', name + ' - selected');
            if (S.signedIn) setView('syllabus', false);
          }
          renderAll();
        });

        box.appendChild(row);

        if (isSubject && selected && S.signedIn && S.openSubjects[name]) {
          panesFor(name).forEach(function (p) {
            var pr = el('button', 'demo-row-pane');
            pr.type = 'button';
            pr.setAttribute('role', 'treeitem');
            pr.setAttribute('aria-selected', S.view === p.view ? 'true' : 'false');
            pr.appendChild(el('span', 'demo-row-pane-label', p.label));
            pr.addEventListener('click', function () { setView(p.view, false); });
            box.appendChild(pr);
          });
        }
      });
    }

    /* ── Pane canvas ──────────────────────────────────────────────────────────
       A stack. The focused pane is the only one exposed to assistive tech:
       the ones behind it are aria-hidden with their contents removed from the
       layout, so a screen reader is offered the surface the reader is looking
       at rather than three copies of it. */
    function renderPanes() {
      var host = $('[data-demo-panes]');
      if (!host) return;
      host.textContent = '';

      var stack = el('div', 'demo-stack');
      var defs = currentPanes();

      // Built back to front so the first pane in the list ends up on top.
      for (var i = defs.length - 1; i >= 0; i--) {
        var d = defs[i];
        var pane = el('section', 'demo-pane');
        pane.setAttribute('data-depth', String(i));
        pane.setAttribute('aria-label', d.title);
        if (i > 0) pane.setAttribute('aria-hidden', 'true');

        var head = el('div', 'demo-pane-head');
        head.appendChild(el('h3', 'demo-pane-title', d.title));
        head.appendChild(el('span', 'demo-pane-spacer'));
        if (d.badge) head.appendChild(el('span', 'demo-pill', d.badge));
        pane.appendChild(head);

        var body = el('div', 'demo-pane-body');
        d.render(body);
        pane.appendChild(body);

        stack.appendChild(pane);
      }
      host.appendChild(stack);
    }

    /* The stack contents for the current view. The auth wall comes first
       because it is what a reader sees before anything else exists. */
    function currentPanes() {
      if (!S.signedIn) return [authPane()];
      if (S.view === 'tasks')    return [{ title: 'Tasks', render: renderTasksPane }];
      if (S.view === 'syllabus') return [{ title: 'Syllabus - ' + S.subject, render: renderSyllabusPane }];
      if (S.view === 'groups')   return [{ title: 'Study groups', render: renderGroupsPane }];
      if (S.view === 'sync')     return [{ title: 'Sync - local first', render: renderSyncPane }];
      return [{ title: 'Focus timer - ' + S.subject, render: renderFocusPane }];
    }

    /* ── The auth wall ────────────────────────────────────────────────────────
       Reproduces the real entry point: this build redirects / and /demo to
       /auth and disables the demo gate, so nothing past this screen is
       reachable without an account. The button authenticates nobody — it
       opens the shell on a sample account, and the caption says so. */
    function authPane() {
      return {
        title: 'Sign in',
        badge: 'sample account',
        render: function (body) {
          body.appendChild(el('p', 'demo-note',
            'A fresh install redirects to /auth and there is no demo gate, so this is ' +
            'the first thing anyone sees. Continue opens the shell on a sample account.'));

          var form = el('form', 'demo-form');
          var email = el('input', 'demo-input');
          email.type = 'email';
          email.value = 'you@example.com';
          email.readOnly = true;
          email.setAttribute('aria-label', 'Email address (sample value, read-only)');

          var btn = el('button', 'demo-btn');
          btn.type = 'submit';
          btn.setAttribute('data-variant', 'primary');
          btn.textContent = 'Continue as sample user';

          form.appendChild(email);
          form.appendChild(btn);
          form.addEventListener('submit', function (e) { e.preventDefault(); signIn(); });
          body.appendChild(form);

          body.appendChild(caption([
            'The address is a ', SAMPLE_TOKEN, ' value and the field is read-only. ',
            'Nothing is sent anywhere: the app authenticates against Supabase Auth, ',
            'and this page holds no credentials and makes no request. What follows is a ',
            SAMPLE.snapshot, ' backup snapshot, not a live account.'
          ]));
        }
      };
    }

    function signIn() {
      S.signedIn = true;

      traceLine('policy', 'gate', '/ and /demo redirect to /auth - no demo mode in this build');
      traceLine('write', 'session', 'auth.uid() resolved - SECURITY DEFINER functions can now resolve');
      traceLine('info', 'state', 'signed in - five surfaces unlocked');

      var label = $('[data-session-label]');
      if (label) label.textContent = 'sample user';
      var chip = $('[data-demo-session]');
      if (chip) chip.setAttribute('data-state', 'in');

      modeBtns.forEach(function (b) { b.disabled = false; });
      setView('focus', false);
    }

    /* ══ Focus ══════════════════════════════════════════════════════════════
       The core loop, and the only surface with something that runs on its
       own. It runs because a reader pressed Start, and it stops at the
       session length. It is not an autoplaying loop: nothing on this page
       moves unless asked to.

       Under prefers-reduced-motion the interval still advances the clock,
       because a countdown the reader started is content rather than
       decoration - but each second is a discrete text update with nothing to
       smooth away, which is what the setting asks for. */
    function renderFocusPane(body) {
      var total = SAMPLE.focusMinutes * 60;
      var clockEl = el('p', 'demo-clock', clock(S.phase === 'idle' ? total : S.elapsed));
      clockEl.setAttribute('data-demo-clock', '');
      clockEl.setAttribute('data-state', S.phase);
      clockEl.setAttribute('role', 'timer');
      // aria-live="off": a per-second announcement would flood a screen
      // reader. The finished total is announced once, by the trace.
      clockEl.setAttribute('aria-live', 'off');
      body.appendChild(clockEl);

      var track = el('div', 'demo-bar-track');
      track.setAttribute('aria-hidden', 'true');   // the number above is the content
      var fill = el('div', 'demo-bar-fill');
      fill.setAttribute('data-demo-fill', '');
      fill.setAttribute('data-state', S.phase);
      fill.style.width = (Math.min(1, S.elapsed / total) * 100).toFixed(1) + '%';
      track.appendChild(fill);
      body.appendChild(track);

      var chips = el('ul', 'demo-subjects');
      chips.setAttribute('aria-label', 'Subject for this session');
      SAMPLE.subjects.forEach(function (s) {
        var li = document.createElement('li');
        var chip = el('button', 'demo-subject-chip');
        chip.type = 'button';
        chip.setAttribute('aria-pressed', S.subject === s.name ? 'true' : 'false');
        chip.textContent = s.name;
        chip.addEventListener('click', function () {
          if (S.phase === 'running') return;       // fixed for the life of a session
          S.subject = s.name;
          S.openSubjects[s.name] = true;
          renderAll();
          traceLine('info', 'subject', 'focus_sessions.subject = ' + s.name);
        });
        li.appendChild(chip);
        chips.appendChild(li);
      });
      body.appendChild(chips);

      var actions = el('div', 'demo-actions');
      var primary = el('button', 'demo-btn');
      primary.type = 'button';
      primary.setAttribute('data-variant', 'primary');
      primary.setAttribute('data-demo-primary', '');
      // The finished label names what the button actually does rather than
      // promising a second session. Pressing it re-submits the SAME session
      // id - the retry a dropped request produces - which the RPC rejects as
      // already_processed.
      primary.textContent = S.phase === 'idle' ? 'Start'
                          : S.phase === 'running' ? 'Finish now'
                          : 'Retry finish (same id)';
      primary.addEventListener('click', function () {
        if (S.phase === 'idle') startFocus();
        else if (S.phase === 'running') finishFocus('completed');
        else finishFocus('retried');
      });

      var secondary = el('button', 'demo-btn');
      secondary.type = 'button';
      secondary.setAttribute('data-demo-secondary', '');
      secondary.textContent = S.phase === 'finished' ? 'New session' : 'Reset';
      secondary.disabled = S.phase === 'idle';
      secondary.addEventListener('click', function () {
        stopClock();
        S.phase = 'idle';
        S.elapsed = 0;
        S.processed = false;      // a genuinely new session gets a new id
        S.sessionKey = 'demo-session-' + (S.taskSeq++);
        renderAll();
        traceLine('info', 'state', 'cleared - the next run gets a fresh session id');
      });

      actions.appendChild(primary);
      actions.appendChild(secondary);
      body.appendChild(actions);

      renderStats(body);

      body.appendChild(el('p', 'demo-note',
        'Finishing calls finish_session_sync, which inserts into study_sessions_log ' +
        'with ON CONFLICT (id) DO NOTHING, then folds the duration into ' +
        'daily_user_stats and user_stats_summary. Press finish twice and watch the ' +
        'totals hold.'));

      body.appendChild(caption([
        'Totals, streak and session count come from the ', SAMPLE.snapshot, ' backup ',
        'snapshot. The session LENGTH is a ', SAMPLE_TOKEN, ' value, chosen so you can ',
        'finish one. The columns and the idempotency are the real ones.'
      ]));
    }

    function startFocus() {
      stopClock();
      S.phase = 'running';
      S.elapsed = 0;
      traceLine('write', 'INSERT', 'focus_sessions (local) - ' + S.subject);
      traceLine('info', 'state', 'running - ' + SAMPLE.focusMinutes + ' min');
      renderAll();

      timer = setInterval(function () {
        S.elapsed++;
        /* Only the clock and the bar move here. Re-rendering the whole pane
           every second would tear focus off the button being held and
           recreate the DOM sixty times a minute for nothing. */
        var c = $('[data-demo-clock]');
        if (c) {
          c.textContent = clock(S.elapsed);
          c.setAttribute('data-state', 'running');
        }
        var f = $('[data-demo-fill]');
        if (f) f.style.width = (Math.min(1, S.elapsed / (SAMPLE.focusMinutes * 60)) * 100).toFixed(1) + '%';

        if (S.elapsed >= SAMPLE.focusMinutes * 60) { stopClock(); finishFocus('completed'); }
      }, 1000);
    }

    /* The completion path, and the one that has to be exactly right.

       finish_session_sync derives started_at from ended_at minus the duration,
       inserts the log row with ON CONFLICT (id) DO NOTHING, and returns
       already_processed:true without touching any counter when that insert
       matched nothing. The totals are therefore keyed on the session id, not on
       "did the user press the button" - pressing it twice must not double the
       hours, and this pane shows that by letting you press it again. */
    function finishFocus(reason) {
      stopClock();
      S.phase = 'finished';
      S.elapsed = SAMPLE.focusMinutes * 60;

      var mins = SAMPLE.focusMinutes;
      var secs = mins * 60;
      var hrs = Math.round(mins / 60 * 100) / 100;

      if (S.processed) {
        traceLine('write', 'ON CONFLICT', 'study_sessions_log row_count = 0');
        traceLine('policy', 'result', 'already_processed: true - totals unchanged');
        renderAll();
        return;
      }
      S.processed = true;

      traceLine('write', 'INSERT', 'study_sessions_log (' + mins + ' min, subject=' + S.subject + ')');
      S.summary.total_study_seconds += secs;
      S.summary.total_hours = Math.round((S.summary.total_study_seconds / 3600) * 100) / 100;
      S.summary.weekly_hours = Math.round((S.summary.weekly_hours + hrs) * 100) / 100;
      S.summary.monthly_hours = Math.round((S.summary.monthly_hours + hrs) * 100) / 100;
      S.summary.session_count += 1;
      S.summary.total_sessions += 1;
      S.summary.current_streak = Math.max(S.summary.current_streak, 1);
      S.summary.max_streak_days = Math.max(S.summary.max_streak_days, S.summary.current_streak);

      traceLine('write', 'UPSERT', 'daily_user_stats.seconds_studied += ' + secs);
      traceLine('write', 'UPSERT', 'user_stats_summary.session_count += 1');
      traceLine('info', 'result', reason + ' - total_study_seconds = ' + S.summary.total_study_seconds);

      /* Queued for the sync surface. The queue is real in the sense that
         matters here: the row is written locally and reconciled later, which
         is exactly what architecture.html documents. */
      S.queue.push('focus_session - ' + mins + ' min');
      if (S.syncPhase === 'local') S.syncPhase = 'queued';

      renderAll();
    }

    /* ══ Tasks ══════════════════════════════════════════════════════════════
       tasks.status defaults to 'pending' in the schema; the app writes 'todo'
       on create and 'done' on completion. Both appear so the default and the
       written value are distinguishable. */
    function renderTasksPane(body) {
      var form = el('form', 'demo-form');
      var input = el('input', 'demo-input');
      input.type = 'text';
      input.id = 'demo-task-title';
      input.maxLength = 120;
      input.autocomplete = 'off';
      input.placeholder = 'New task - a title, a chapter, a past paper';
      input.setAttribute('aria-label', 'New task title');

      var add = el('button', 'demo-btn');
      add.type = 'submit';
      add.setAttribute('data-variant', 'primary');
      add.textContent = 'Add task';

      form.appendChild(input);
      form.appendChild(add);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var title = input.value.trim();
        if (!title) { input.focus(); return; }      // no-op rather than an empty row
        S.tasks.push({
          id: 't' + S.taskSeq++,
          title: title,
          subject: S.subject,
          status: 'todo',
          priority: 'medium'
        });
        traceLine('write', 'INSERT', 'tasks (status=todo, priority=medium)');
        renderAll();
        var again = $('#demo-task-title');
        if (again) again.focus();
      });
      body.appendChild(form);

      var list = el('ul', 'demo-list');
      list.setAttribute('data-empty', S.tasks.length ? 'false' : 'true');
      list.setAttribute('data-empty-text', 'No tasks yet. Add one above.');
      list.setAttribute('aria-live', 'polite');     // an added or completed task is announced

      S.tasks.forEach(function (t) {
        var li = el('li', 'demo-row');
        li.setAttribute('data-done', t.status === 'done' ? 'true' : 'false');

        var main = el('div', 'demo-row-main');
        main.appendChild(el('p', 'demo-row-title', t.title));
        main.appendChild(el('p', 'demo-row-meta', t.status + ' - ' + t.priority + ' - ' + t.subject));
        li.appendChild(main);

        if (t.status !== 'done') {
          var btn = el('button', 'demo-row-btn');
          btn.type = 'button';
          // Names the task, so a reader tabbing the list hears which one they
          // are about to complete rather than "Complete, Complete".
          btn.setAttribute('aria-label', 'Mark "' + t.title + '" complete');
          btn.textContent = 'Complete';
          btn.addEventListener('click', function () { completeTask(t.id); });
          li.appendChild(btn);
        } else {
          var done = el('span', 'demo-pill', 'done');
          done.setAttribute('data-tone', 'ok');
          li.appendChild(done);
        }
        list.appendChild(li);
      });
      body.appendChild(list);

      body.appendChild(el('p', 'demo-note',
        'Tasks are local-first: written to IndexedDB and replicated to the ' +
        'user-content backup rather than row-synced. A completed task records the ' +
        'session it was finished in.'));

      body.appendChild(caption([
        'Every title, status and priority here is real, from the ', SAMPLE.snapshot,
        ' backup. Real columns: status, priority, subject, completed_at, ',
        'completed_in_session. Only tasks you add yourself are new.'
      ]));
    }

    function completeTask(id) {
      var t = S.tasks.filter(function (x) { return x.id === id; })[0];
      if (!t || t.status === 'done') return;
      t.status = 'done';
      t.completed_at = 'now()';
      t.completed_in_session = true;

      traceLine('write', 'UPDATE', 'tasks.status = done - completed_at = now()');
      traceLine('info', 'index', 'tasks.completed_in_session = true');
      renderAll();
    }

    /* ══ Syllabus ═══════════════════════════════════════════════════════════
       subjects.chapters and subjects.topics are JSONB columns on one row, so a
       subject's whole tree is a single row rather than a set of joins. */
    function renderSyllabusPane(body) {
      var list = el('ul', 'demo-subject-tree');
      list.setAttribute('aria-label', 'Syllabus by subject');

      SAMPLE.subjects.forEach(function (s) {
        var li = el('li', 'demo-subject-card');
        var open = !!S.openSubjects[s.name];
        li.setAttribute('data-open', open ? 'true' : 'false');

        var head = el('button', 'demo-subject-card-head');
        head.type = 'button';
        head.setAttribute('aria-expanded', open ? 'true' : 'false');

        // Built as DOM rather than innerHTML: the markup is a fixed literal
        // with nothing interpolated, but there is no reason to hand a string
        // to the parser when createElementNS does the same job.
        var chev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chev.setAttribute('class', 'demo-chevron');
        chev.setAttribute('viewBox', '0 0 24 24');
        chev.setAttribute('fill', 'none');
        chev.setAttribute('stroke', 'currentColor');
        chev.setAttribute('stroke-width', '2.5');
        chev.setAttribute('stroke-linecap', 'round');
        chev.setAttribute('stroke-linejoin', 'round');
        chev.setAttribute('aria-hidden', 'true');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M9 6l6 6-6 6');
        chev.appendChild(path);
        head.appendChild(chev);

        head.appendChild(el('span', 'demo-row-ws-label', s.name));
        head.appendChild(el('span', 'demo-pane-spacer'));
        head.appendChild(el('span', 'demo-pill', s.exam));

        head.addEventListener('click', function () {
          S.openSubjects[s.name] = !S.openSubjects[s.name];
          renderAll();
          traceLine('info', 'subjects', s.name + ' - chapters ' +
            (S.openSubjects[s.name] ? 'expanded' : 'collapsed'));
        });
        li.appendChild(head);

        var inner = el('div', 'demo-subject-card-body');
        var chapters = el('ul', 'demo-chapters');

        s.chapters.forEach(function (c) {
          var cl = el('li', 'demo-chapter');
          var main = el('div', 'demo-row-main');
          main.appendChild(el('p', 'demo-chapter-name', c.name));
          main.appendChild(el('p', 'demo-chapter-topics', c.topics.join(' - ')));
          cl.appendChild(main);
          // Derived from the sample array above it, so it cannot disagree
          // with the list it summarises.
          cl.appendChild(el('span', 'demo-chapter-progress', c.topics.length + ' topics'));
          chapters.appendChild(cl);
        });

        inner.appendChild(chapters);
        li.appendChild(inner);
        list.appendChild(li);
      });
      body.appendChild(list);

      body.appendChild(el('p', 'demo-note',
        'A subject is one row. chapters and topics are JSONB on it, and a chapter ' +
        'opens at /syllabus/chapter/:chapterId.'));

      body.appendChild(caption([
        'Subjects, chapters and topics are the real syllabus from the ', SAMPLE.snapshot,
        ' backup. The columns are real too: subjects.chapters, subjects.topics, ',
        'subjects.exam_name.'
      ]));
    }

    /* ══ Groups ═════════════════════════════════════════════════════════════
       The join-request model, in the shape the RLS policies permit.

       community_join_group reads groups.join_policy. 'open' or 'instant' writes
       group_members immediately and returns {status:'joined'}. Anything else -
       and the column defaults to 'request' - writes a pending
       community_join_requests row instead and returns {status:'requested'}. Only
       an owner or coowner may then answer, which is the check
       community_respond_join_request performs before it updates anything. */
    function renderGroupsPane(body) {
      var list = el('ul', 'demo-groups');

      SAMPLE.groups.forEach(function (g, i) {
        var key = i === 0 ? 'instant' : 'request';
        var li = el('li', 'demo-group');

        var head = el('div', 'demo-group-head');
        head.appendChild(el('p', 'demo-group-name', g.name));
        head.appendChild(el('span', 'demo-pill', 'join_policy: ' + g.policy));
        li.appendChild(head);

        var members = el('ul', 'demo-members');
        var rows = g.members.slice();
        if (S.joined[key]) rows.push(['YO', 'You', 'member']);

        rows.forEach(function (m) {
          var mi = el('li', 'demo-member');
          mi.setAttribute('data-role', m[2]);
          var av = el('span', 'demo-member-avatar', m[0]);
          av.setAttribute('aria-hidden', 'true');   // the name beside it is the content
          mi.appendChild(av);
          mi.appendChild(el('span', null, m[1] + ' - ' + m[2]));
          members.appendChild(mi);
        });
        li.appendChild(members);

        if (key === 'instant') {
          var join = el('button', 'demo-btn');
          join.type = 'button';
          if (S.joined.instant) {
            join.setAttribute('aria-pressed', 'true');
            join.textContent = 'Joined';
            join.disabled = true;
          } else {
            join.textContent = 'Join group';
            join.setAttribute('aria-label', 'Join ' + g.name);
            join.addEventListener('click', function () {
              S.joined.instant = true;
              traceLine('write', 'INSERT', 'group_members (role=member, joined_at=now())');
              traceLine('policy', 'branch', "join_policy = 'instant' - member written directly");
              traceLine('info', 'return', '{ status: "joined" }');
              renderAll();
            });
          }
          li.appendChild(join);

        } else {
          var req = el('button', 'demo-btn');
          req.type = 'button';
          if (S.requestState === 'pending') {
            req.disabled = true;
            req.textContent = 'Request pending...';
          } else if (S.requestState === 'accepted') {
            req.setAttribute('aria-pressed', 'true');
            req.textContent = 'In group';
            req.disabled = true;
          } else {
            req.textContent = 'Request to join';
            req.setAttribute('aria-label', 'Request to join ' + g.name);
            req.addEventListener('click', function () {
              S.requestState = 'pending';
              S.joined.request = true;
              traceLine('write', 'INSERT', 'community_join_requests (status=pending)');
              traceLine('policy', 'branch', "join_policy = 'request' - owner must approve");
              traceLine('info', 'return', '{ status: "requested" }');
              renderAll();
            });
          }
          li.appendChild(req);

          /* The approve control only exists once a request is pending, and it
             is the owner's action - the RPC raises not_allowed for anyone
             whose role is not owner or coowner. */
          if (S.requestState === 'pending') {
            var approve = el('button', 'demo-btn');
            approve.type = 'button';
            approve.setAttribute('data-variant', 'primary');
            approve.textContent = 'Owner: approve request';
            approve.setAttribute('aria-label', 'Owner approves the pending request for ' + g.name);
            approve.addEventListener('click', function () {
              S.requestState = 'accepted';
              traceLine('policy', 'check', "role IN ('owner','coowner') - allowed");
              traceLine('write', 'UPDATE', 'community_join_requests.status = accepted');
              traceLine('write', 'INSERT', 'group_members (role=member, joined_at=now())');
              traceLine('info', 'return', '{ ok: true }');
              renderAll();
            });
            li.appendChild(approve);
          }
        }
        list.appendChild(li);
      });
      body.appendChild(list);

      var board = el('ol', 'demo-board');
      SAMPLE.board.forEach(function (r) {
        var li = el('li', 'demo-board-row');
        li.setAttribute('data-you', r[0] === 'You' ? 'true' : 'false');
        li.appendChild(el('span', 'demo-board-rank', String(board.children.length + 1)));
        li.appendChild(el('span', 'demo-board-name', r[0]));
        li.appendChild(el('span', 'demo-board-hours', hhmm(r[1])));
        board.appendChild(li);
      });
      body.appendChild(board);

      body.appendChild(caption([
        'A backup holds one person\u2019s history, so these rows are ', SAMPLE_TOKEN,
        ' \u2014 as are the two study groups and their members. The ranking rule is real ',
        '(get_leaderboard orders on weekly_hours, then total_hours) and so are both join ',
        'policies: join_policy defaults to request.'
      ]));
    }

    /* ══ Sync ═══════════════════════════════════════════════════════════════
       Three lanes, and the interesting one is the third.

       The comparison ladder evaluates richness BEFORE recency: a fresh
       install produces an empty snapshot that is newer than everything the
       user has, and last-write-wins would hand that empty snapshot the
       database. Step two of the ladder refuses it. The "fresh install" button
       exists to make that concrete rather than to assert it. */
    function renderSyncPane(body) {
      var list = el('ul', 'demo-lanes');

      var lanes = [
        { key: 'local', name: 'This device',
          rows: S.summary.session_count + ' session' + plural(S.summary.session_count, '', 's') +
                 ' - ' + hhmm(S.summary.total_hours) },
        { key: 'queued', name: 'Pending sync',
          rows: S.queue.length ? S.queue.length + ' row' + plural(S.queue.length, '', 's') + ' waiting'
                               : 'nothing waiting' },
        { key: 'reconciled', name: 'Supabase',
          rows: S.syncPhase === 'reconciled' ? 'reconciled - ' + S.queue.length + ' row' + plural(S.queue.length, '', 's')
              : S.syncPhase === 'refused' ? 'snapshot refused'
              : 'not connected in this demo' }
      ];

      lanes.forEach(function (l) {
        var li = el('li', 'demo-lane');
        li.setAttribute('data-active', S.syncPhase === l.key ? 'true' : 'false');
        li.setAttribute('data-done',
          (l.key === 'reconciled' && S.syncPhase === 'reconciled') ? 'true' : 'false');

        var inner = el('div', 'demo-lane-body');
        inner.appendChild(el('p', 'demo-lane-name', l.name));
        inner.appendChild(el('p', 'demo-lane-rows', l.rows));
        li.appendChild(inner);

        if (l.key === 'reconciled' && S.syncPhase === 'reconciled') {
          var ok = el('span', 'demo-pill', 'synced');
          ok.setAttribute('data-tone', 'ok');
          li.appendChild(ok);
        }
        if (S.syncPhase === 'refused' && l.key === 'reconciled') {
          var warn = el('span', 'demo-pill', 'refused');
          warn.setAttribute('data-tone', 'warn');
          li.appendChild(warn);
        }
        list.appendChild(li);
      });
      body.appendChild(list);

      var actions = el('div', 'demo-actions');
      var sync = el('button', 'demo-btn');
      sync.type = 'button';
      sync.setAttribute('data-variant', 'primary');
      sync.textContent = 'Go online and sync';
      sync.addEventListener('click', doSync);

      var fresh = el('button', 'demo-btn');
      fresh.type = 'button';
      fresh.textContent = 'Simulate a fresh install';
      fresh.addEventListener('click', freshInstall);

      actions.appendChild(sync);
      actions.appendChild(fresh);
      body.appendChild(actions);

      body.appendChild(el('p', 'demo-note',
        'The second button pushes an empty snapshot that is newer than your work - ' +
        'the case the comparison ladder is built to refuse.'));

      var recent = el('ol', 'demo-board');
      recent.setAttribute('aria-label', 'Most recent sessions');
      (SAMPLE.recent || []).forEach(function (r) {
        var li = el('li', 'demo-board-row');
        li.appendChild(el('span', 'demo-board-name', r.subject + ' \u00b7 ' + r.type));
        li.appendChild(el('span', 'demo-board-hours', r.minutes + 'm'));
        recent.appendChild(li);
      });
      body.appendChild(recent);

      body.appendChild(caption([
        'The fortnight of sessions above is real, from the ', SAMPLE.snapshot,
        ' backup. Each queued row corresponds to a sync_items entry: entity, ',
        'operation, ',
        'status and content_hash. The study hours are real, from the ', SAMPLE.snapshot,
        ' backup.'
      ]));
    }

    /* Online: reconcile the queue, exactly what the app does when it regains a
       connection. The RPC is idempotent, so a retry is safe - which is what
       makes the "Finish now" path above safe to press twice. */
    function doSync() {
      if (!S.queue.length) {
        traceLine('info', 'sync', 'nothing queued - run a focus session first');
        return;
      }
      S.syncPhase = 'reconciled';
      traceLine('write', 'RPC', 'finish_session_sync x ' + S.queue.length);
      traceLine('write', 'UPSERT', 'daily_user_stats.seconds_studied');
      traceLine('info', 'result', 'reconciled - local totals match cloud');
      renderAll();
    }

    /* The empty-snapshot case. Deliberately shows the refusal rather than a
       success, because that is the behaviour the ladder exists to produce. */
    function freshInstall() {
      traceLine('policy', 'compare', 'cloud snapshot: empty, newer - richness wins');
      traceLine('policy', 'ladder', 'step 2 - rich beats empty, local kept');
      traceLine('info', 'result', 'empty snapshot discarded; no data lost');
      S.syncPhase = 'refused';
      renderAll();
    }

    /* ── Summary rail ────────────────────────────────────────────────────────
       Rebuilt from state every time rather than mutated in place, so the rail
       can never show a number the panes do not support. */
    function renderSummary() {
      var hero = $('[data-sum-focus]');
      if (hero) hero.textContent = hhmmFromSecs(S.summary.total_study_seconds);

      var streak = $('[data-sum-streak]');
      if (streak) streak.textContent = String(S.summary.current_streak);

      var ring = $('[data-sum-ring]');
      if (ring) {
        // A fraction of the longest streak, so the ring is always meaningful
        // and never implies a target the app does not have.
        var pct = S.summary.max_streak_days
          ? Math.round((S.summary.current_streak / S.summary.max_streak_days) * 100)
          : 0;
        ring.style.setProperty('--pct', String(Math.min(100, pct)));
        ring.setAttribute('aria-label', S.summary.current_streak + ' day streak, longest ' +
          S.summary.max_streak_days);
      }

      var longest = $('[data-sum-longest]');
      if (longest) longest.textContent = 'longest ' + S.summary.max_streak_days;

      var plan = $('[data-demo-plan]');
      if (plan) plan.textContent = S.signedIn ? 'local - unsynced' : 'local only';

      var dl = $('[data-demo-summary]');
      if (!dl) return;
      dl.textContent = '';

      [
        ['total_study_seconds', String(S.summary.total_study_seconds)],
        ['weekly_hours',        String(S.summary.weekly_hours)],
        ['monthly_hours',       String(S.summary.monthly_hours)],
        ['session_count',       String(S.summary.session_count)],
        ['total_sessions',      String(S.summary.total_sessions)],
        ['last_study_date',     S.processed ? 'today' : '-'],
        ['tasks due',           String(S.tasks.filter(function (t) { return t.status !== 'done'; }).length)],
        ['sync queue',          S.queue.length + ' row' + plural(S.queue.length, '', 's')]
      ].forEach(function (r) {
        var wrap = el('div', 'demo-summary-row');
        wrap.appendChild(el('dt', null, r[0]));
        wrap.appendChild(el('dd', null, r[1]));
        dl.appendChild(wrap);
      });
    }

    /* The stats readout in the focus pane, rebuilt from the same summary
       object the rail reads. */
    function renderStats(body) {
      [
        ['total_study_seconds', String(S.summary.total_study_seconds)],
        ['total_hours',         String(S.summary.total_hours)],
        ['weekly_hours',        String(S.summary.weekly_hours)],
        ['session_count',       String(S.summary.session_count)],
        ['last_study_date',     S.processed ? 'today' : '-']
      ].forEach(function (r) {
        var wrap = el('div', 'demo-stat');
        if (S.processed) wrap.setAttribute('data-changed', 'true');
        wrap.appendChild(el('dt', null, r[0]));
        wrap.appendChild(el('dd', null, r[1]));
        body.appendChild(wrap);
      });
      body.appendChild(caption([
        'Columns are from user_stats_summary and daily_user_stats.'
      ]));
    }

    /* ── Reset ───────────────────────────────────────────────────────────────
       Stops the clock first. Leaving an interval running after a reset is how
       a demo page ends up eating battery on a phone left open on the tab - the
       one resource a reader will not think to go and save. */
    function reset(quiet) {
      stopClock();
      S = freshState();

      /* The switcher carries the five study surfaces and nothing else. The
         auth wall is the signed-out PANE, not a sixth radio, so it is absent
         here deliberately -- a radiogroup listing an entry the reader cannot
         select is a worse lie than one that starts empty. data-view is left
         alone: the markup already assigns each button the surface it owns. */
      modeBtns.forEach(function (b, i) {
        /* All five need an account, but disabling every radio would make the
           group unreachable: Tab would skip it entirely and the arrow keys
           would do nothing, stranding a keyboard reader with no way to learn
           the surfaces exist. So the first stays enabled -- it shows the auth
           pane, which IS what is on screen -- and the rest lock. */
        b.disabled = i !== 0;
        b.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
        b.setAttribute('tabindex', i === 0 ? '0' : '-1');
      });

      var label = $('[data-session-label]');
      if (label) label.textContent = 'signed out';
      var chip = $('[data-demo-session]');
      if (chip) chip.removeAttribute('data-state');

      renderAll();
      // Quiet on first paint: logging "restored" into a log that was never
      // disturbed reads as though something had just been thrown away.
      if (!quiet) traceLine('info', 'reset', SAMPLE_TOKEN + ' data restored');
    }

    function renderAll() {
      renderPanes();
      renderRail();
      renderSummary();
      count();
    }

    /* ── Wiring ──────────────────────────────────────────────────────────────*/

    var resetBtn = $('[data-demo-reset]');
    if (resetBtn) resetBtn.addEventListener('click', function () { reset(false); });

    var exploreBtn = $('[data-demo-explore]');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function () {
        if (!S.signedIn) {
          signIn();
          traceLine('info', 'explore', 'pressed Explore - signed in on the ' + SAMPLE_TOKEN + ' account');
          return;
        }
        /* Already inside. The useful second press is the one that actually
           demonstrates something, so it runs a whole session and reconciles
           it rather than being a no-op. */
        traceLine('info', 'explore', 'running a session, then reconciling it');
        if (S.phase === 'idle') startFocus();
        S.phase = 'finished';
        S.elapsed = SAMPLE.focusMinutes * 60;
        finishFocus('explore');
        doSync();
        renderAll();
      });
    }

    var addArea = $('[data-demo-add-area]');
    if (addArea) {
      addArea.addEventListener('click', function () {
        if (S.extraAreas.length >= 3) {
          traceLine('info', 'area', 'cap reached - three extra areas is enough to show the shape');
          return;
        }
        var name = 'Study area ' + (S.extraAreas.length + 1);
        S.extraAreas.push(name);
        traceLine('write', 'INSERT', 'subjects (is_custom=true, name=' + name + ')');
        traceLine('info', 'area', name + ' - added; a custom subject has no chapters yet');
        renderAll();
      });
    }

    reset(true);

    /* The timer is the only thing on this page that can still be running when
       a reader navigates away. Stop it on unload so a background tab does not
       sit on an interval forever. */
    window.addEventListener('pagehide', stopClock);

    /* The thumb is positioned from measured layout, so it has to be placed
       after the shell has a width. A resize re-places it; nothing else. */
    window.addEventListener('resize', function () {
      var on = modeBtns.filter(function (b) { return b.getAttribute('aria-checked') === 'true'; })[0];
      moveThumb(on);
    });
  })();
})();
