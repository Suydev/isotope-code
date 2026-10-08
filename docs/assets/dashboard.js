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
     Five walkthroughs of the product, each with real controls and a live trace
     of what the simulated code wrote.

     ── The rule that shapes this whole module ─────────────────────────────────
     There are two kinds of thing on screen and they must never be confused.

       The STAGE is illustrative. Session lengths, subject names, group names,
       avatar initials and member counts are invented so the panel has something
       to show. Every one of them that a reader could mistake for a claim about
       the shipped product carries a visible "sample" marker in the caption.

       The TRACE is not illustrative. Every function name, table name, column
       name, status value and branch in it was read out of isotope-complete.sql
       or public/assets. That is what makes the demo worth more than a mockup:
       if the trace and the SQL ever disagree, the SQL is right.

     ── Why this fetches nothing ──────────────────────────────────────────────
     The rest of this file fetches two same-origin files. This module fetches
     nothing at all. A demo of an offline-first product that needs a network
     round trip to demonstrate the offline-first product would be a joke, and it
     would also make the section fail on a cold cache in exactly the case where
     it is most likely to be opened.

     ── State lives in one object ─────────────────────────────────────────────
     All five panels read from and write to `S`. There is no per-panel closure
     holding state, so Reset is a single assignment rather than five teardowns,
     and the sync panel can honestly read a session the focus panel created. */
  (function demo() {
    var root = document.querySelector('[data-demo]');
    if (!root) return;

    /* ── Sample data ──────────────────────────────────────────────────────────
       Declared once, here, so the boundary between invented and real is a
       single readable place rather than a value sprinkled through five
       functions. Anything in this block may appear on screen and is therefore
       marked as sample in the caption of the panel that shows it. */
    var SAMPLE = {
      focusMinutes: 25,          // the app's default focus length
      subject: 'Organic chemistry',
      /* Starting totals, so the effect of a session is visible as a delta
         rather than as a number growing out of nothing. */
      base: {
        total_study_seconds: 126000,   // 35h
        total_hours: 35,
        weekly_hours: 4.5,
        session_count: 12,
        total_sessions: 12
      },
      groups: [
        { name: 'Organic chemistry · revision', policy: 'instant', members: [['RA', 'Ravi A.', 'member'], ['SM', 'Sara M.', 'member'], ['JO', 'Jonas O.', 'owner']] },
        { name: 'Term 2 exam squad',            policy: 'request', members: [['PK', 'Priya K.', 'owner'], ['TA', 'Tom A.', 'member']] }
      ],
      userHandle: 'you',
      syncDevice: 'device-local'
    };

    /* ── State ───────────────────────────────────────────────────────────────
       One object, rebuilt by reset(). Derived values are recomputed rather than
       incremented in two places, so a value cannot drift between the stage and
       the trace. */
    var S = null;

    function freshState() {
      return {
        tab: 'focus',

        /* focus */
        phase: 'idle',            // idle | running | finished
        elapsed: 0,               // seconds
        sessionKey: 'demo-session-1',
        processed: false,         // has this session id been counted already
        summary: Object.assign({}, SAMPLE.base),

        /* tasks */
        tasks: [
          { id: 't1', title: 'Past paper 2024 — thermodynamics', status: 'todo', priority: 'p2' },
          { id: 't2', title: 'Flashcards: reaction mechanisms',     status: 'todo', priority: 'p3' }
        ],

        /* community */
        joined: { instant: false, request: false },
        requestState: 'none',     // none | pending | accepted
        membersAdded: 0,

        /* sync */
        syncPhase: 'local',       // local | queued | reconciled | refused
        queue: [],
        cloudSnapshot: null
      };
    }

    /* ── Small helpers ─────────────────────────────────────────────────────── */

    function $(sel) { return root.querySelector(sel); }
    function $$(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

    var timer = null;            // the one interval, owned by this module

    function stopClock() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function clock(secs) {
      var m = Math.floor(Math.max(0, secs) / 60);
      var s = Math.max(0, secs) % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function hhmm(h) {
      var m = Math.floor(h * 60);
      var hrs = Math.floor(m / 60);
      var mm = m % 60;
      return hrs + 'h ' + (mm < 10 ? '0' : '') + mm + 'm';
    }

    /* ── The trace ───────────────────────────────────────────────────────────
       Append-only, and role="log" in the markup so a reader hears new lines
       without focus being yanked off the control they just pressed.

       Bounded: a log that grows forever is a memory leak on a docs page, and a
       reader who has clicked through forty times does not want forty lines.
       Capped at 40, dropping the oldest. */
    function traceLine(kind, k, v) {
      var list = $('[data-demo-log]');
      if (!list) return;
      var li = document.createElement('li');
      li.className = 'demo-trace-line';
      li.setAttribute('data-kind', kind);

      var kEl = document.createElement('span');
      kEl.className = 'demo-trace-k';
      kEl.textContent = k;

      var vEl = document.createElement('span');
      vEl.className = 'demo-trace-v';
      vEl.textContent = v;        // textContent, never innerHTML: these strings
                                  // contain < and > (SQL, JSON) and are not markup.

      li.appendChild(kEl);
      li.appendChild(vEl);
      list.appendChild(li);

      while (list.children.length > 40) list.removeChild(list.firstChild);
      list.scrollTop = list.scrollHeight;
    }

    /* ── Tabs ────────────────────────────────────────────────────────────────
       A real tablist, so the full APG keyboard contract is implemented rather
       than the pattern being implied: Left/Right (and Up/Down) move between
       tabs and activate, Home/End jump to the ends. Activation is
       automatic — there is no manual-activation mode here because each panel is
       cheap to render and a reader who has tabbed across expects to land on it.

       Arrow keys wrap, which is what the pattern specifies and what a reader
       at the last tab would otherwise hit a wall on. */
    var tabs = $$('.demo-tab');

    function selectTab(id, focusIt) {
      var target = null;
      tabs.forEach(function (t) {
        var on = t.id === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        // Roving tabindex: exactly one tab is in the tab order at a time, so
        // Tab moves past the tablist rather than through all five.
        t.setAttribute('tabindex', on ? '0' : '-1');
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
        if (on) target = t;
      });
      if (target && focusIt) target.focus();
      S.tab = id.replace('dt-', '');
      count();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectTab(t.id, false); });

      t.addEventListener('keydown', function (e) {
        var next = null;
        switch (e.key) {
          case 'ArrowRight': next = (i + 1) % tabs.length; break;
          case 'ArrowLeft':  next = (i - 1 + tabs.length) % tabs.length; break;
          case 'Home':       next = 0; break;
          case 'End':        next = tabs.length - 1; break;
          default: return;                       // let everything else pass
        }
        e.preventDefault();                       // stop the page scrolling
        selectTab(tabs[next].id, true);
      });
    });

    /* ── Counter ─────────────────────────────────────────────────────────────
       "3 of 5 steps" in the toolbar. role="status" so switching tabs is
       announced without moving focus off the tab the reader is holding. */
    function count() {
      var order = ['focus', 'tasks', 'syllabus', 'groups', 'sync'];
      var el = $('[data-demo-count]');
      if (!el) return;
      var i = order.indexOf(S.tab);
      // i is -1 only if a tab id and the order list ever disagree. Falling back
      // to the first panel keeps the toolbar readable instead of throwing on a
      // property of undefined, which would take the rest of the module with it.
      if (i < 0) i = 0;
      el.textContent = (i + 1) + ' of ' + order.length + ' steps · ' +
        tabs[i].textContent.trim();
    }

    /* ══ Panel 1: focus timer ═══════════════════════════════════════════════
       The core loop, and the only panel with something that runs on its own.

       It runs because a reader pressed Start, and it stops on its own at the
       session length. It is not an autoplaying loop: nothing on this page
       moves unless asked to, which matters more here than anywhere else on a
       docs page.

       Under prefers-reduced-motion the interval still advances the clock,
       because a countdown the reader started is content rather than
       decoration — but each second is a discrete text update with no
       transition to smooth away, which is what the setting is asking for. */
    function renderFocus() {
      var panel = document.getElementById('dp-focus');
      if (!panel) return;
      var el = panel.querySelector('[data-demo-clock]');
      var fill = panel.querySelector('[data-demo-fill]');
      var primary = panel.querySelector('[data-demo-primary]');
      var secondary = panel.querySelector('[data-demo-secondary]');
      if (!el) return;

      var total = SAMPLE.focusMinutes * 60;
      el.textContent = clock(S.phase === 'idle' ? total : S.elapsed);
      el.setAttribute('data-state', S.phase);

      /* The bar is aria-hidden and purely decorative: the same number is in the
         text above it and in the announcement, so nothing is lost if it never
         renders. */
      if (fill) {
        fill.style.width = (Math.min(1, S.elapsed / total) * 100).toFixed(1) + '%';
      }

      if (primary) {
        /* The finished label names what the button actually does rather than
           promising a second session. Pressing it re-submits the SAME session
           id — the retry a dropped request would produce — which the RPC
           rejects as already_processed. A label reading "Run it again" here
           would be a control that looks like it adds an hour and does not. */
        primary.textContent = S.phase === 'idle' ? 'Start'
                           : S.phase === 'running' ? 'Finish now'
                           : 'Retry finish (same id)';
        primary.disabled = false;
      }
      if (secondary) {
        secondary.textContent = S.phase === 'finished' ? 'New session' : 'Reset';
        secondary.disabled = S.phase === 'idle';
      }
    }

    function startFocus() {
      stopClock();
      S.phase = 'running';
      traceLine('write', 'INSERT', 'focus_sessions (local) — ' + SAMPLE.subject);
      traceLine('info', 'state', 'running · ' + SAMPLE.focusMinutes + ' min');
      renderFocus();

      timer = setInterval(function () {
        S.elapsed++;
        renderFocus();
        if (S.elapsed >= SAMPLE.focusMinutes * 60) { stopClock(); finishFocus('completed'); }
      }, 1000);
    }

    /* The completion path, and the one that has to be exactly right.

       finish_session_sync derives started_at from ended_at minus the duration,
       inserts the log row with ON CONFLICT (id) DO NOTHING, and returns
       already_processed:true without touching any counter when that insert
       matched nothing. The totals are therefore keyed on the session id, not on
       "did the user press the button" — pressing it twice must not double the
       hours, and this panel shows that by letting you press it again. */
    function finishFocus(reason) {
      S.phase = 'finished';
      var mins = SAMPLE.focusMinutes;
      var secs = mins * 60;
      var hrs = Math.round(mins / 60 * 100) / 100;

      if (S.processed) {
        traceLine('write', 'ON CONFLICT', 'row_count = 0 — already_processed: true');
        traceLine('policy', 'result', 'totals unchanged (idempotent by session id)');
        renderFocus();
        return;
      }

      S.processed = true;

      traceLine('write', 'INSERT', 'study_sessions_log (' + mins + ' min, subject=' + SAMPLE.subject + ')');
      S.summary.total_study_seconds += secs;
      S.summary.total_hours = Math.round((S.summary.total_study_seconds / 3600) * 100) / 100;
      S.summary.weekly_hours = Math.round((S.summary.weekly_hours + hrs) * 100) / 100;
      S.summary.session_count += 1;
      S.summary.total_sessions += 1;

      traceLine('write', 'UPSERT', 'daily_user_stats.seconds_studied += ' + secs);
      traceLine('write', 'UPSERT', 'user_stats_summary.session_count += 1');
      traceLine('info', 'result', reason + ' — total_study_seconds = ' + S.summary.total_study_seconds);

      /* Queued for the sync panel. The queue is real in the sense that matters
         here: the row is written locally and reconciled later, which is exactly
         what architecture.html documents for focus sessions. */
      S.queue.push('focus_session · ' + mins + ' min');
      if (S.syncPhase === 'local') S.syncPhase = 'queued';

      renderFocus();
      renderStats();
      renderSync();
    }

    /* The stats readout, rebuilt from state each time rather than mutated in
       place — so the panel can never show a number the totals do not support. */
    function renderStats() {
      var dl = $('[data-demo-stats]');
      if (!dl) return;

      var rows = [
        ['total_study_seconds', String(S.summary.total_study_seconds)],
        ['total_hours',         String(S.summary.total_hours)],
        ['weekly_hours',        String(S.summary.weekly_hours)],
        ['session_count',       String(S.summary.session_count)],
        ['last_study_date',     S.processed ? 'today' : '—']
      ];

      dl.textContent = '';
      rows.forEach(function (r) {
        var wrap = document.createElement('div');
        wrap.className = 'demo-stat';
        if (S.processed) wrap.setAttribute('data-changed', 'true');

        var dt = document.createElement('dt');
        dt.textContent = r[0];
        var dd = document.createElement('dd');
        dd.textContent = r[1];

        wrap.appendChild(dt);
        wrap.appendChild(dd);
        dl.appendChild(wrap);
      });
    }

    /* ══ Panel 2: tasks ════════════════════════════════════════════════════
       Create and complete. The status values are the ones in the bundle:
       tasks.status defaults to 'pending' in the schema, and the app writes
       'todo' on create and 'done' on completion. */

    var taskSeq = 3;

    function renderTasks() {
      var ul = $('[data-demo-tasks]');
      if (!ul) return;

      ul.textContent = '';
      // aria-live is on the list so an added or completed task is announced.
      ul.setAttribute('data-empty', S.tasks.length ? 'false' : 'true');

      S.tasks.forEach(function (t) {
        var li = document.createElement('li');
        li.className = 'demo-row';
        li.setAttribute('data-done', t.status === 'done' ? 'true' : 'false');

        var main = document.createElement('div');
        main.className = 'demo-row-main';

        var title = document.createElement('p');
        title.className = 'demo-row-title';
        title.textContent = t.title;

        var meta = document.createElement('p');
        meta.className = 'demo-row-meta';
        meta.textContent = 'status: ' + t.status + ' · priority: ' + t.priority;

        main.appendChild(title);
        main.appendChild(meta);
        li.appendChild(main);

        if (t.status !== 'done') {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'demo-row-btn';
          btn.setAttribute('aria-pressed', 'false');
          // The label names the task, so a reader tabbing the list hears which
          // one they are about to complete rather than "Complete, Complete".
          btn.setAttribute('aria-label', 'Mark “' + t.title + '” complete');
          btn.textContent = 'Complete';
          btn.addEventListener('click', function () { completeTask(t.id); });
          li.appendChild(btn);
        } else {
          var done = document.createElement('span');
          done.className = 'pill get';
          done.textContent = 'done';
          li.appendChild(done);
        }

        ul.appendChild(li);
      });
    }

    function completeTask(id) {
      var t = S.tasks.filter(function (x) { return x.id === id; })[0];
      if (!t || t.status === 'done') return;
      t.status = 'done';
      t.completed_at = 'now()';
      t.completed_in_session = true;

      traceLine('write', 'UPDATE', 'tasks.status = done · completed_at = now()');
      traceLine('info', 'index', 'tasks.completed_in_session = true');
      renderTasks();
    }

    var form = $('[data-demo-task-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = $('#demo-task-title');
        var title = input.value.trim();
        if (!title) { input.focus(); return; }     // no-op rather than empty row

        S.tasks.push({
          id: 't' + (taskSeq++),
          title: title,
          status: 'todo',
          priority: 'p3'
        });
        traceLine('write', 'INSERT', 'tasks (status=todo, priority=p3)');
        input.value = '';
        renderTasks();
        input.focus();
      });
    }

    /* ══ Panel 3: syllabus ════════════════════════════════════════════════
       Deliberately has no controls. The chunk list is the shipped one — nine
       lazily-imported bundles — and there is nothing honest a reader could do
       to it. A panel with a fake button on it would teach the reader that the
       controls on the other four panels are decorative, which would cost the
       whole section its credibility. */

    /* ══ Panel 4: study groups ═════════════════════════════════════════════
       The join-request model, in the shape the RLS policies actually permit.

       community_join_group reads groups.join_policy. 'open' or 'instant'
       writes group_members immediately. Anything else — and the column defaults
       to 'request' — writes a pending community_join_requests row instead and
       returns {status:'requested'}. Only an owner or coowner may then answer,
       which is the check community_respond_join_request performs before it
       updates anything. */
    function renderGroups() {
      var ul = $('[data-demo-groups]');
      if (!ul) return;
      ul.textContent = '';

      SAMPLE.groups.forEach(function (g, i) {
        var key = i === 0 ? 'instant' : 'request';
        var li = document.createElement('li');
        li.className = 'demo-group';

        var head = document.createElement('div');
        head.className = 'demo-group-head';

        var name = document.createElement('p');
        name.className = 'demo-group-name';
        name.textContent = g.name;

        var pill = document.createElement('span');
        pill.className = 'pill neutral';
        pill.textContent = 'join_policy: ' + g.policy;

        head.appendChild(name);
        head.appendChild(pill);
        li.appendChild(head);

        var members = document.createElement('div');
        members.className = 'demo-group-body';

        var ul2 = document.createElement('ul');
        ul2.className = 'demo-members';
        // One extra member once the demo's user has actually joined, so the
        // member list and the table agree with each other.
        var rows = g.members.slice();
        if (S.joined[key]) rows.push(['YO', 'You', S.requestState === 'accepted' ? 'member' : 'member']);

        rows.forEach(function (m) {
          var mi = document.createElement('li');
          mi.className = 'demo-member';
          mi.setAttribute('data-role', m[2]);

          var av = document.createElement('span');
          av.className = 'demo-member-avatar';
          av.setAttribute('aria-hidden', 'true');   // the name beside it is the content
          av.textContent = m[0];

          var nm = document.createElement('span');
          nm.textContent = m[1] + ' · ' + m[2];

          mi.appendChild(av);
          mi.appendChild(nm);
          ul2.appendChild(mi);
        });
        members.appendChild(ul2);
        li.appendChild(members);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'demo-btn';
        btn.style.marginTop = 'var(--s-3)';
        btn.style.display = 'block';

        if (key === 'instant') {
          if (S.joined.instant) {
            btn.setAttribute('aria-pressed', 'true');
            btn.textContent = 'Joined';
            btn.disabled = true;
          } else {
            btn.textContent = 'Join group';
            btn.setAttribute('aria-label', 'Join ' + g.name);
            btn.addEventListener('click', function () {
              S.joined.instant = true;
              traceLine('write', 'INSERT', 'group_members (role=member, joined_at=now())');
              traceLine('info', 'return', '{ status: "joined" }');
              traceLine('policy', 'branch', "join_policy = 'instant' → member written directly");
              renderGroups();
            });
          }
        } else {
          if (S.requestState === 'pending') {
            btn.disabled = true;
            btn.textContent = 'Request pending…';
          } else if (S.requestState === 'accepted') {
            btn.setAttribute('aria-pressed', 'true');
            btn.textContent = 'In group';
            btn.disabled = true;
          } else {
            btn.textContent = 'Request to join';
            btn.setAttribute('aria-label', 'Request to join ' + g.name);
            btn.addEventListener('click', function () {
              S.requestState = 'pending';
              S.joined.request = true;
              traceLine('write', 'INSERT', 'community_join_requests (status=pending)');
              traceLine('policy', 'branch', "join_policy = 'request' → owner must approve");
              traceLine('info', 'return', '{ status: "requested" }');
              renderGroups();
            });
          }
        }
        li.appendChild(btn);

        /* The approve control only exists once a request is pending, and it is
           the owner's action — the RPC refuses anyone whose role is not owner or
           coowner, and the demo shows the refusal as well as the success. */
        if (key === 'request' && S.requestState === 'pending') {
          var approve = document.createElement('button');
          approve.type = 'button';
          approve.className = 'demo-btn';
          approve.setAttribute('data-variant', 'primary');
          approve.style.marginTop = 'var(--s-2)';
          approve.style.display = 'block';
          approve.textContent = 'Owner: approve request';
          approve.setAttribute('aria-label', 'Owner approves the pending request for ' + g.name);
          approve.addEventListener('click', function () {
            S.requestState = 'accepted';
            traceLine('policy', 'check', 'role IN (owner, coowner) → allowed');
            traceLine('write', 'UPDATE', 'community_join_requests.status = accepted');
            traceLine('write', 'INSERT', 'group_members (role=member, joined_at=now())');
            renderGroups();
          });
          li.appendChild(approve);
        }

        ul.appendChild(li);
      });
    }

    /* ══ Panel 5: sync ═════════════════════════════════════════════════════
       Three lanes, and the interesting one is the third.

       The comparison ladder evaluates richness BEFORE recency: a fresh install
       produces an empty snapshot that is newer than everything the user has,
       and last-write-wins would hand that empty snapshot the database. Step two
       of the ladder refuses it. The "fresh install" button exists to make that
       concrete rather than to assert it. */
    function renderSync() {
      var ul = $('[data-demo-lanes]');
      if (!ul) return;
      ul.textContent = '';

      var lanes = [
        { key: 'local',      name: 'This device',     rows: S.summary.session_count + ' session' + (S.summary.session_count === 1 ? '' : 's') + ' · ' + hhmm(S.summary.total_hours) },
        { key: 'queued',     name: 'Pending sync',    rows: S.queue.length ? S.queue.length + ' row' + (S.queue.length === 1 ? '' : 's') + ' waiting' : 'nothing waiting' },
        { key: 'reconciled', name: 'Supabase',        rows: S.syncPhase === 'reconciled' ? 'reconciled · ' + S.queue.length + ' row' + (S.queue.length === 1 ? '' : 's') : 'not connected in this demo' }
      ];

      lanes.forEach(function (l) {
        var li = document.createElement('li');
        li.className = 'demo-lane';
        li.setAttribute('data-active', S.syncPhase === l.key ? 'true' : 'false');
        li.setAttribute('data-done', (l.key === 'reconciled' && S.syncPhase === 'reconciled') ? 'true' : 'false');

        var body = document.createElement('div');
        body.className = 'demo-lane-body';

        var name = document.createElement('p');
        name.className = 'demo-lane-name';
        name.textContent = l.name;

        var rows = document.createElement('p');
        rows.className = 'demo-lane-rows';
        rows.textContent = l.rows;

        body.appendChild(name);
        body.appendChild(rows);
        li.appendChild(body);

        if (l.key === 'reconciled' && S.syncPhase === 'reconciled') {
          var pill = document.createElement('span');
          pill.className = 'pill get';
          pill.textContent = 'synced';
          li.appendChild(pill);
        }
        if (S.syncPhase === 'refused' && l.key === 'reconciled') {
          var warn = document.createElement('span');
          warn.className = 'pill patch';
          warn.textContent = 'refused';
          li.appendChild(warn);
        }

        ul.appendChild(li);
      });
    }

    /* Online: reconcile the queue, exactly what the app does when it regains a
       connection. The RPC is idempotent, so a retry is safe — which is what
       makes the "Finish now" path above safe to press twice. */
    function doSync() {
      if (!S.queue.length) {
        traceLine('info', 'sync', 'nothing queued — run a focus session first');
        return;
      }
      S.syncPhase = 'reconciled';
      traceLine('write', 'RPC', 'finish_session_sync × ' + S.queue.length);
      traceLine('write', 'UPSERT', 'daily_user_stats.seconds_studied');
      traceLine('info', 'result', 'reconciled · local totals match cloud');
      renderSync();
    }

    /* The empty-snapshot case. Deliberately shows the refusal rather than a
       success, because that is the behaviour the ladder exists to produce. */
    function freshInstall() {
      S.cloudSnapshot = { rich: false, at: 'now' };
      traceLine('policy', 'compare', 'cloud snapshot: empty, newer → richness wins');
      traceLine('policy', 'ladder', 'step 2 · rich beats empty → local kept');
      traceLine('info', 'result', 'empty snapshot discarded; no data lost');
      S.syncPhase = 'refused';
      renderSync();
    }

    /* ── Wiring the two unnamed buttons in each panel ────────────────────────
       The markup gives each panel a primary and a secondary control without
       hardcoding their meaning, so the behaviour lives in one place per panel
       rather than being duplicated across five handlers. */
    function wirePanel(panelId, onPrimary, onSecondary) {
      var panel = document.getElementById(panelId);
      if (!panel) return;
      var p = panel.querySelector('[data-demo-primary]');
      var s = panel.querySelector('[data-demo-secondary]');
      if (p && onPrimary) p.addEventListener('click', onPrimary);
      if (s && onSecondary) s.addEventListener('click', onSecondary);
    }

    /* ── Reset ───────────────────────────────────────────────────────────────
       Stops the clock first. Leaving an interval running after a reset is how a
       demo page ends up eating battery on a phone that was left open on the
       tab — the one resource a reader will not think to go and save. */
    function reset(quiet) {
      stopClock();
      S = freshState();
      taskSeq = 3;
      renderAll();
      // Quiet on first paint: logging "restored" into a log that was never
      // disturbed reads as though something had just been thrown away.
      if (!quiet) traceLine('info', 'reset', 'sample data restored');
    }

    function renderAll() {
      selectTab('dt-focus', false);
      renderFocus();
      renderStats();
      renderTasks();
      renderGroups();
      renderSync();
    }

    /* ── Boot ────────────────────────────────────────────────────────────────*/

    wirePanel('dp-focus',
      function () {
        if (S.phase === 'idle') startFocus();
        else if (S.phase === 'running') finishFocus('completed');
        // Finished: re-submit the SAME session id, which is the retry a dropped
        // request would produce. The RPC's ON CONFLICT (id) DO NOTHING makes it
        // a no-op — and the panel shows that rather than pretending to add time.
        else finishFocus('retried');
      },
      function () {
        stopClock();
        S.phase = 'idle';
        S.elapsed = 0;
        S.processed = false;      // a genuinely new session gets a new id
        renderFocus();
        traceLine('info', 'state', 'cleared — next run gets a fresh session id');
      }
    );

    wirePanel('dp-sync', doSync, freshInstall);

    var resetBtn = $('[data-demo-reset]');
    if (resetBtn) resetBtn.addEventListener('click', function () { reset(false); });

    reset(true);

    /* The timer is the only thing on this page that can still be running when a
       reader navigates away. Stop it on unload so a background tab does not sit
       on an interval forever. */
    window.addEventListener('pagehide', stopClock);
  })();
})();