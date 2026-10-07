/* ============================================================================
   IsotopeAI Documentation — Dashboard behaviour
   ----------------------------------------------------------------------------
   Three jobs, all progressive enhancement. Every one of them leaves the page
   fully usable when JavaScript does not run, which is the contract site.js
   already keeps:

     1. Browse    filter the 22-page grid by area toggle and free-text query
     2. Search    query assets/search-index.json for section-level hits
     3. Recent    parse changelog.html into the release cards

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
})();