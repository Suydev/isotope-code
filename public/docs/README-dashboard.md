# Documentation dashboard

`docs/dashboard.html` is a landing page for the documentation: live schema
counts, all 22 pages in a searchable grid, full-text search over the existing
section index, the most recent releases parsed from the changelog, and an
interactive walkthrough of the product.

It is a static file like every other page in `docs/`. There is no build step,
no framework and no npm dependency. Open the file or serve the directory and
it works.

---

## Files

| File                        | What it is                                                | Loaded by             |
| --------------------------- | --------------------------------------------------------- | --------------------- |
| `docs/dashboard.html`       | The page. Structure, copy, and the static page grid.        | —                     |
| `docs/assets/dashboard.css` | Styles. Dashboard-only.                                    | `dashboard.html`      |
| `docs/assets/dashboard.js`  | Behaviour: filter, search, changelog parse.                 | `dashboard.html`      |
| `docs/README-dashboard.md`  | This file.                                                  | —                     |

Two decisions shape all of it.

**Separate CSS and JS, not additions to the shared files.** `site.css` and
`site.js` are loaded by all 22 hand-built pages and frozen. A new selector block
in the shared sheet is a shared-sheet regression surface: a mistyped `.card` or a
`.grid` override repaints pages nobody was testing. Loading a second stylesheet
from one page makes the blast radius zero by construction, and a change here
never requires re-testing the other 22.

**No new tokens, no new keyframes.** `dashboard.css` defines no colour,
spacing or radius of its own — every value resolves to an existing `--c-*`,
`--s-*`, `--r-*` or `--dur-*` property from `site.css`. It defines no
`@keyframes` either: entrance motion is the existing system (`pageOpen`,
`wordRise`/`wordUp`, `swapCycle`, `auroraIn`, `reveal-3d`, `enterUp`). Adding
motion here would mean adding a second set of reduced-motion opt-outs, which is
how a site ends up with one of them missed. Change a token in `site.css` and the
dashboard follows, same as everything else.

---

## What it does

### 1. Schema counts

Five `data-ticker` figures, read from `isotope-complete.sql`:

| Metric            | Count |
| ----------------- | ----- |
| Database tables   | 42    |
| Postgres functions| 82    |
| RLS policies      | 184   |
| Triggers          | 15    |
| Indexes           | 108   |

These are **not hardcoded by hand and not fetched at runtime** — the schema
file is not served. They are written into the HTML, and
`scripts/validate-docs.mjs` compares every "N tables / N policies / …" mention
across `docs/*.html` against the live SQL dump on every CI run. If the schema
moves and the dashboard does not, validation fails with the page and the line.

When you change the schema, update the five `data-ticker` values here. The
validator will tell you if you forget.

> The tickers follow the existing convention exactly: the animated
> `.ticker` span is `aria-hidden`, and an `.sr-only` span carries the final
> number. A counter mutating its text ~54 times over 900ms otherwise announces
> intermediate garbage, depending on how the reader polls.

### 2. The page grid

All 22 pages, hand-written into the HTML as real `<a>` cards grouped into five
areas:

| Area           | Count | Pages                                                     |
| -------------- | ----- | --------------------------------------------------------- |
| Start here     | 6     | getting-started, configuration, supabase-setup, sync-and-backup, backup-console, community |
| Build & ship   | 4     | architecture, cli, android-apk, contributing               |
| Data & backend | 5     | database, api-reference, admin, security, troubleshooting  |
| Reference      | 4     | faq, changelog, privacy, terms                             |
| Project        | 3     | index (home), license, 404                                 |

Two attributes drive the filter:

- `data-dash-area="start"` — which area chip reveals the card.
- `data-dash-search="…"` — the keyword haystack. If omitted the card falls back
  to its own text content.

The keyword list is **visible on the card as a `.dash-tags` pill row** rather
than hidden in an attribute. You can see why a filter matched, and the terms
are real text — reachable by find-in-page.

### 3. Full-text search

Queries `assets/search-index.json` — the same 245-section index the hero search
on `index.html` and the sidebar search on every docs page already use. **Do not
build a second index**; a second index is a second thing to keep in step with
the pages.

The scoring weights and the `ALIAS` synonym table are copied from `site.js` so
both search surfaces rank a query identically. **If you change one, change
both**, or the same query will return different results depending on which box
you typed it in.

Behaviour:

- Fetched on focus, not on load — it is 148 KB and nobody should pay for search
  they do not use.
- The first keystrokes render from whatever is available; results re-render once
  the index lands.
- `↓` / `↑` move through results, `Enter` opens, `/` focuses from anywhere,
  `Esc` clears.
- Every result carries `?hl=<term>`, so `site.js` marks the term on arrival and
  fades it.

### 4. Recent changes

Fetches `changelog.html`, parses it with `DOMParser`, and renders the release
cards. It anchors on `<h2 id="v…">` headings and walks forward to the next
`<h2>`, so reordering the changelog or adding a section does not break it.

Parsed rather than hand-copied on purpose: a hand-copied list is a claim about
the changelog that stops being true the moment someone ships a release, and
nothing else on this site would catch it.

If the fetch fails, the panel says so and keeps a working link to the full
changelog. It is never a heading over an empty box.

### 5. The interactive demo

Five clickable walkthroughs — the focus timer, tasks, the syllabus, study
groups and sync — between Browse and Recent changes.

**The rule that shapes it: the stage is illustrative, the trace is not.**

| Part                      | What it is                                                  |
| ------------------------- | ----------------------------------------------------------- |
| The stage (left)          | Illustrative. Session lengths, group names and avatar initials are invented, and each one that a reader could mistake for a claim carries a visible `sample` marker. |
| The trace (right)         | Real. Function names, table names, columns and branch conditions are read out of `isotope-complete.sql` and `public/assets`. |

That split is the whole point. A mockup that invented `finish_session_sync` would
be worth nothing; a mockup that shows what the function actually does — the
`ON CONFLICT (id) DO NOTHING` and the `already_processed` short-circuit — is a
claim a reader can check against the dump. The focus panel therefore lets you
press the primary button a second time after a session completes, and shows the
totals holding still, because that is what the real idempotency does.

**It fetches nothing.** The other three jobs fetch two same-origin files. A demo
of an offline-first product that needs a network round trip would be a joke, and
would also fail on a cold cache in exactly the case it is most likely to be
opened in.

**Prose and the validator.** The demo names real tables (`community_join_requests`,
`group_members`, `group_invites`, `user_stats_summary`, `daily_user_stats`,
`study_sessions_log`) in lower case, never with a numeral in front of one. The
docs validator treats any `N tables` / `N policies` phrase as a checked claim
about the dump, so an incidental "three tables" would fail the build.

See the accessibility notes below for the tablist and the target sizes.

---

## Accessibility notes

The choices worth knowing before you edit anything:

- **Area filters are `<button aria-pressed>`, not `role="tab"`.** The groups
  below are not tab panels and are all visible at once, so a tablist would
  promise a keyboard contract this control does not implement.
- **Both search fields carry `aria-describedby`** pointing at an instruction
  paragraph that exists in `.sr-only` form, so the keyboard behaviour is
  announced rather than only drawn.
- **The filter result count is `role="status"`**, so the change is announced
  without stealing focus from the field the reader is still typing in.
- **The `.swap` block in the headline carries `aria-label` with one canonical
  word** and marks its children decorative. Without it a screen reader reads
  all three at once, since only opacity differs between them.
- **Every interactive target is at least 44px.** The area chips are `min-height:
  44px` for this reason; the filter field is 48px.
- **Focus is never removed.** The ring is on the `.dash-field` container rather
  than the input, because the icon and the `/` hint are part of the same
  control and a ring around only the text box reads as three separate widgets.
- **Pressed chips invert to `--c-text` on `--c-bg`** (18.4:1 light / 16.5:1
  dark) rather than filling with brand violet, which measured 4.2:1 at the top
  of its gradient. Weight is raised alongside colour so the state survives a
  greyscale print.
- **The filter's border is `#8b929c` / `#6e648a`**, not `--c-border`. Those
  tokens are tuned for dividers and measure 1.47:1 / 1.58:1 — fine as a
  surface step, a fail as a control boundary under WCAG 1.4.11. These are the
  same values `site.css` uses for `.sidebar-search`, measured for the same
  reason. The demo controls reuse the same literal for the same reason.
- **The demo is a real `tablist`.** Unlike the area chips above — which are
  `aria-pressed` buttons because they filter a list that is all visible at once
  — the demo switches exactly one visible panel at a time, which is what the
  tab pattern is for. So the full keyboard contract is implemented: Left/Right
  move and wrap, Home/End jump to the ends, and the tablist uses a roving
  tabindex so `Tab` moves past it rather than through all five tabs.
- **The demo trace is `role="log"`, not `role="status"`.** It appends lines
  rather than replacing one string, and announcing an appended line must not
  pull focus off the button the reader just pressed. `aria-relevant="additions"`
  keeps the reader from being read the list header on every step.
- **Demo controls are at 44px, including the inline ones.** The per-row
  Complete button is 44px tall and 44px wide with a full accessible name —
  `aria-label` carries the task title, so a reader tabbing the list hears
  *which* task they are about to complete rather than "Complete, Complete".
- **Nothing in the demo loops.** The only thing that runs on its own is the
  focus countdown, and only because a reader pressed Start. Under
  `prefers-reduced-motion` its transitions are removed, but the countdown still
  advances: a timer the reader started is content, not decoration.
- **Completed tasks and completed requests are marked three ways** — strike,
  status pill and `aria-pressed` — so the state survives greyscale, colour-blind
  vision and a screen reader that never renders the glyph.

---

## Progressive enhancement

Every feature is additive, which is the contract `site.js` already keeps:

| No JS                        | Result                                          |
| ---------------------------- | ----------------------------------------------- |
| The page grid                | All 22 pages listed as real links. Fully usable. |
| The area chips and filter    | Inert. No broken layout — they just do nothing.  |
| Full-text search             | Falls back to the sidebar search in `site.js`.  |
| Recent changes               | Panel keeps its link to the full changelog.      |
| The interactive demo         | Hidden; a `.demo-nojs` paragraph points at the database and architecture pages instead. |

The grid is written out in the HTML on purpose. It is the content, not a
rendering of it.

---

## Adding a page

1. Add the file to `docs/`.
2. Add a `.dash-card` to the right `.dash-group` in `dashboard.html`, with
   `data-dash-area` and `data-dash-search` set. Keep the keyword list visible as
   a `.dash-tags` row — it is what makes a filter match explicable.
3. Add it to the drawer in `docs/index.html`, and to the sidebar in the docs
   pages that list their peers. **`scripts/validate-docs.mjs` fails on a page
   that is missing from the drawer**, because the runtime search index is built
   from `.drawer a[href]` — a page absent from the drawer cannot be found even
   if it is linked elsewhere.
4. Update the `All areas` count in the chip, and any per-area count.

The validator checks orphans, dead links, drawer presence, shell consistency,
schema counts and dead anchors. Run it with:

```bash
node scripts/validate-docs.mjs
```

---

## Things that will bite you

- **`server.mjs` is not involved and was not modified.** These pages are served
  as plain files.
- **`innerHTML` is used in `dashboard.js`** for the search results and release
  cards. Every interpolated value goes through the local `esc()` helper first,
  so the input is escaped; the changelog text is read from a same-origin file
  this page already ships. Keep it that way — if you add a value, escape it.
- **Do not add a `role` or an `aria-*` to a card without checking the
  accessible name.** A card's name is everything inside it, including the tag
  row. That is intentional and good, but it means a card that gains a decorative
  element should get `aria-hidden="true"` on it.
- **`--i` drives the card cascade.** `dashboard.js` writes `--i` on each card at
  load; `.reveal-3d` reads it for the stagger. The cascade runs once, not on
  every filter change — re-running an entrance on each keystroke makes typing
  feel like the page is rebuilding itself.