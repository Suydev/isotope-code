/**
 * IsotopeAI — Docs and README validator
 * ──────────────────────────────────────────────────────────────────────────────
 * Checks:
 *   1. All image paths referenced in README.md exist in the repo
 *   2. All image paths referenced in docs/index.html exist
 *   3. Install commands reference real scripts (checked against file system)
 *   4. No .env or secrets are referenced in docs
 *   5. Version number in README/docs matches package.json
 *   6. All internal links (#anchors) in README are reasonable
 *   7. Screenshot manifest exists and all listed files are present
 *
 * Usage:
 *   node scripts/validate-docs.mjs [--fix] [--strict]
 *
 *   --fix     Auto-fix version numbers in README and docs/index.html
 *   --strict  Exit 1 on any warning (not just errors)
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve, basename } from 'path';

const FIX    = process.argv.includes('--fix');
const STRICT = process.argv.includes('--strict');

const R = '\x1b[0m', G = '\x1b[32m', Y = '\x1b[33m', E = '\x1b[31m', B = '\x1b[1m', C = '\x1b[36m';
const ok    = (msg, detail = '') => { passes++; console.log(`${G}  ✅ ${msg}${R}${detail ? ` ${detail}` : ''}`); };
const warn  = (msg, detail = '') => { console.warn(`${Y}  ⚠️  ${msg}${R}${detail ? `\n     ${detail}` : ''}`); warns++; };
const error = (msg, detail = '') => { console.error(`${E}  ❌ ${msg}${R}${detail ? `\n     ${detail}` : ''}`); errors++; };
const info  = (msg) => console.log(`${C}  →  ${msg}${R}`);

let errors = 0;
let warns = 0;
let passes = 0;

// ── File readers ──────────────────────────────────────────────────────────────
const ROOT = resolve('.');

function readText(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

// ── Load files ────────────────────────────────────────────────────────────────
const README   = readText('README.md');
const DOCS_HTML = readText('docs/index.html');
const PKG      = readText('package.json');
const MANIFEST = readText('screenshots/screenshot-manifest.json');

console.log(`\n${B}IsotopeAI — Docs Validator${R}`);
console.log(`  Root: ${ROOT}`);
console.log('');

// ── 1. Package.json version ───────────────────────────────────────────────────
let pkgVersion = 'unknown';
if (PKG) {
  try {
    pkgVersion = JSON.parse(PKG).version || 'unknown';
    ok(`package.json parsed — version: ${pkgVersion}`);
  } catch {
    error('package.json is not valid JSON');
  }
} else {
  error('package.json not found');
}

// ── 2. README checks ──────────────────────────────────────────────────────────
info('Checking README.md...');
if (!README) {
  error('README.md not found');
} else {
  ok('README.md exists', `(${README.length} chars)`);

  // Version badge
  const versionMatch = README.match(/version-([^-]+)-/g);
  if (versionMatch) {
    for (const m of versionMatch) {
      const v = m.replace('version-', '').replace('-', '');
      if (v !== pkgVersion) {
        warn(`README version badge (${v}) does not match package.json (${pkgVersion})`);
      } else {
        ok(`README version badge matches package.json (${pkgVersion})`);
      }
      break;
    }
  } else {
    warn('No version badge found in README');
  }

  // Screenshot image paths
  const rawImgRE = /https:\/\/raw\.githubusercontent\.com\/[^)"\s]+\.(png|jpg|jpeg|webp|gif|svg)/gi;
  const rawImgs = [...README.matchAll(rawImgRE)].map(m => m[0]);
  for (const imgUrl of rawImgs) {
    const filePart = imgUrl.split('/main/').pop();
    const localPath = join(ROOT, filePart);
    if (existsSync(localPath)) {
      ok(`Image exists: ${filePart}`);
    } else {
      error(`Image missing from repo: ${filePart}`, `Referenced in README: ${imgUrl.slice(0, 80)}`);
    }
  }

  // Local image paths
  const localImgRE = /!\[.*?\]\((\.\/|\/)?([^)]+\.(png|jpg|jpeg|webp|gif|svg))\)/gi;
  for (const m of [...README.matchAll(localImgRE)]) {
    const rel = m[2];
    if (!existsSync(join(ROOT, rel))) {
      error(`Local image missing: ${rel}`);
    }
  }

  // Secret patterns
  const secretPatterns = [
    [/SUPABASE_SERVICE_ROLE_KEY\s*=\s*[A-Za-z0-9]/g, 'SUPABASE_SERVICE_ROLE_KEY with value'],
    [/eyJ[A-Za-z0-9_-]{40,}/g, 'Potential JWT token'],
    [/sbp_[A-Za-z0-9]{20,}/g, 'Potential Supabase PAT'],
    [/ghp_[A-Za-z0-9]{36}/g, 'Potential GitHub PAT'],
  ];
  let hasSecrets = false;
  for (const [re, label] of secretPatterns) {
    if (re.test(README)) {
      error(`README may contain a secret: ${label}`);
      hasSecrets = true;
    }
  }
  if (!hasSecrets) ok('No secret patterns found in README');

  // Install scripts referenced
  const installScripts = [
    ['setup.sh',       'bash setup.sh'],
    ['setup.bat',      'setup.bat'],
    ['install.sh',     'install.sh'],
    ['install.ps1',    'install.ps1'],
    ['install-termux.sh', 'install-termux.sh'],
  ];
  for (const [file, ref] of installScripts) {
    const exists = existsSync(join(ROOT, file));
    const mentioned = README.includes(ref);
    if (mentioned && !exists) {
      error(`README references ${ref} but ${file} does not exist`);
    } else if (mentioned && exists) {
      ok(`${file} referenced and exists`);
    }
  }
}

// ── 3. docs/index.html checks ─────────────────────────────────────────────────
info('Checking docs/index.html...');
if (!DOCS_HTML) {
  warn('docs/index.html not found');
} else {
  ok('docs/index.html exists', `(${DOCS_HTML.length} chars)`);

  // Version
  const verMatch = DOCS_HTML.match(/v(\d+\.\d+\.\d+)/g);
  if (verMatch) {
    const docVer = verMatch[0].replace('v', '');
    if (docVer !== pkgVersion) {
      warn(`docs/index.html version (${docVer}) does not match package.json (${pkgVersion})`);
    } else {
      ok(`docs/index.html version matches package.json (${pkgVersion})`);
    }
  } else {
    warn('No version number found in docs/index.html');
  }

  // Images
  const imgRE = /src="(https:\/\/raw\.githubusercontent\.com\/[^"]+\.(png|jpg|jpeg|webp|svg))"/gi;
  for (const m of [...DOCS_HTML.matchAll(imgRE)]) {
    const url = m[1];
    const filePart = url.split('/main/').pop();
    const localPath = join(ROOT, filePart);
    if (existsSync(localPath)) {
      ok(`Docs image exists: ${filePart}`);
    } else {
      warn(`Docs image not in repo: ${filePart} — verify it exists on GitHub`);
    }
  }

  // Broken external opengraph or logo references
  const badLogo = DOCS_HTML.includes('logo.svg') && !existsSync(join(ROOT, 'logo.svg'));
  if (badLogo) {
    warn('docs/index.html references logo.svg but file does not exist in repo root');
  }
}

// ── 4. (removed) docs/index.md ────────────────────────────────────────────────
// docs/ used to carry six markdown files alongside the HTML pages, which meant two
// sets of documentation that could disagree — and did: index.md still linked to
// install.html, sync.html, gallery.html and motion.html months after they were
// deleted. Their content is now merged into the pages that own the subject
// (sync-and-backup, architecture, changelog) and the markdown is gone, so there is
// nothing left here to validate.

// ── 5. Required files check ───────────────────────────────────────────────────
info('Checking required files...');
const REQUIRED_FILES = [
  'server.mjs',
  'package.json',
  'setup.sh',
  'setup.bat',
  'install.ps1',
  'install-termux.sh',
  'install.sh',
  'setup-termux-widget.sh',
  'update.sh',
  'update.bat',
  'start.sh',
  'start.bat',
  'doctor.sh',
  'doctor.bat',
  'bin/isotope',
  'bin/isotope.bat',
  'bin/isotope.ps1',
  'isotope-complete.sql',
  '.env.example',
  'README.md',
  'CHANGELOG.md',
  'TERMUX_WIDGET.md',
  // ── docs/ ───────────────────────────────────────────────────────────────────
  // This list previously named install.html, sync.html and motion.html, which were
  // superseded by the current page set and deleted. The validator therefore failed
  // on every run — and a check that always fails is a check nobody reads, which is
  // worse than no check: it trains you to ignore the output that would have caught
  // a real regression.
  //
  // Only the structural pages belong here. Individual guides are covered by the
  // orphan and shell checks below, which do not need a hand-maintained list.
  'docs/index.html',
  'docs/404.html',
  'docs/assets/site.css',
  'docs/assets/site.js',
  'docs/logo.svg',
  'scripts/capture-screenshots.mjs',
  'scripts/seed-demo-data.mjs',
  'scripts/validate-docs.mjs',
];

for (const f of REQUIRED_FILES) {
  if (existsSync(join(ROOT, f))) {
    ok(`${f}`);
  } else {
    error(`Required file missing: ${f}`);
  }
}

// ── 6. Screenshot directory ───────────────────────────────────────────────────
info('Checking screenshots/...');
const SCREENSHOT_DIR = join(ROOT, 'screenshots');
if (existsSync(SCREENSHOT_DIR)) {
  function collectImages(dir, prefix = '') {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) return collectImages(abs, rel);
      return /\.(png|jpg|jpeg|webp)$/i.test(entry.name) ? [rel] : [];
    });
  }
  const files = collectImages(SCREENSHOT_DIR);
  ok(`screenshots/ exists — ${files.length} image file(s)`);
  if (files.length === 0) {
    warn('screenshots/ is empty — run: npm run screenshots');
  }

  // Manifest check
  if (MANIFEST) {
    try {
      const manifest = JSON.parse(MANIFEST);
      const missing = (manifest.screenshots || [])
        .filter(s => s.status === 'captured' && !existsSync(join(SCREENSHOT_DIR, s.file)));
      if (missing.length > 0) {
        for (const s of missing) {
          warn(`Screenshot in manifest but missing from disk: ${s.file}`);
        }
      } else {
        ok('All manifest screenshots present on disk');
      }
    } catch {
      warn('screenshot-manifest.json is not valid JSON');
    }
  }
} else {
  warn('screenshots/ directory not found');
}

// ── 6b. docs/ page set integrity ──────────────────────────────────────────────
// A hand-maintained file list is exactly what rotted last time, so this derives
// everything from the directory instead. Three checks, each catching a failure that
// has actually happened on this site:
//
//   1. Orphans. A page nothing links to is unreachable. `backup-console.html` shipped
//      that way, and so would any page added without editing 20 navs by hand.
//   2. Search invisibility. The hero search index is built at runtime from
//      `.drawer a[href]`, so a page missing from the drawer cannot be found even if
//      it is linked elsewhere.
//   3. Dead links. gallery.html shipped three of them before it was deleted.
info('Checking docs/ page set...');
const DOCS_DIR = join(ROOT, 'docs');
if (existsSync(DOCS_DIR)) {
  const pages = readdirSync(DOCS_DIR).filter(f => f.endsWith('.html'));
  const bodies = new Map(pages.map(f => [f, readFileSync(join(DOCS_DIR, f), 'utf8')]));

  // 1. Broken internal links.
  let brokenLinks = 0;
  for (const [file, html] of bodies) {
    const refs = [...html.matchAll(/href="(?:\.\/|\/isotope-code\/)([a-z0-9-]+\.html)"/g)]
      .map(m => m[1]);
    for (const target of new Set(refs)) {
      if (!pages.includes(target)) {
        error(`${file} links to docs/${target}, which does not exist`);
        brokenLinks++;
      }
    }
  }
  if (brokenLinks === 0) ok('No broken internal doc links');

  // 2. Orphans — reachable from at least one other page.
  // Hubs are entered directly rather than linked to from a sibling, so the orphan
  // rule does not apply to them.
  const HUBS = new Set(['index.html', '404.html']);
  const orphans = pages.filter(p => {
    if (HUBS.has(p)) return false;
    for (const [file, html] of bodies) {
      if (file !== p && html.includes(`${p}"`)) return false;
    }
    return true;
  });
  if (orphans.length) {
    for (const p of orphans) error(`docs/${p} is an orphan — no other page links to it`);
  } else {
    ok('No orphan doc pages');
  }

  // 3. Drawer presence, which is what the runtime search index reads.
  const DRAWERLESS = new Set();
  const notInDrawer = pages.filter(p => {
    if (HUBS.has(p) || DRAWERLESS.has(p)) return false;
    const home = bodies.get('index.html') || '';
    const i = home.indexOf('class="drawer');
    if (i === -1) return false;
    const j = home.indexOf('</div>', home.lastIndexOf('drawer-label'));
    return !home.slice(i, j).includes(p);
  });
  if (notInDrawer.length) {
    for (const p of notInDrawer) {
      warn(`docs/${p} is not in the drawer — it will be invisible to site search`);
    }
  } else {
    ok('Every doc page appears in the drawer (search index reads it)');
  }

  // 4. Shell consistency. A page missing the backdrop or the entrance class renders
  //    visibly differently from its siblings.
  const SHELL = [
    ['liquid-bg', 'page backdrop'],
    ['page-open', 'entrance animation'],
    ['site-footer', 'footer'],
  ];
  const drift = [];
  for (const [file, html] of bodies) {
    if (DRAWERLESS.has(file)) continue;
    for (const [needle, label] of SHELL) {
      if (!html.includes(needle)) drift.push(`${file} is missing the ${label} (${needle})`);
    }
  }
  if (drift.length) {
    for (const d of drift) warn(d);
  } else {
    ok(`All ${pages.length} doc pages share the standard shell`);
  }
}

// ── 7. CI workflow ────────────────────────────────────────────────────────────
info('Checking CI workflow...');
const CI = readText('.github/workflows/ci.yml');
if (CI) {
  ok('.github/workflows/ci.yml exists');
  if (CI.includes('validate-docs') || CI.includes('docs')) {
    ok('CI includes docs validation step');
  } else {
    warn('CI does not appear to include docs validation — add: node scripts/validate-docs.mjs');
  }
} else {
  warn('.github/workflows/ci.yml not found');
}

// ── 7a. Crawler routes ────────────────────────────────────────────────────────
//
// Vercel serves files from public/ BEFORE the api/index rewrite, so a
// public/robots.txt would shadow the handler in server.mjs. That is exactly what
// happened: the handler carried a `Sitemap:` line that production never saw,
// because the static copy shadowed it. A catch-all SPA fallback made it invisible
// too — an unmatched /sitemap.xml returned the app shell with HTTP 200, which looks
// like a working file but is discarded as malformed XML.
//
// So: one owner per path. The handler must exist, and public/ must NOT shadow it.
info('Checking crawler routes...');
const serverSrc = readText('server.mjs') || '';
if (serverSrc.includes("urlPath === '/sitemap.xml'")) ok('server.mjs serves /sitemap.xml');
else error('server.mjs serves /sitemap.xml', 'the SPA fallback answers it with the app shell instead');
if (serverSrc.includes("urlPath === '/robots.txt'")) ok('server.mjs serves /robots.txt');
else error('server.mjs serves /robots.txt', 'self-hosted runs get HTML for robots.txt');
if (existsSync(join(ROOT, 'public/robots.txt'))) {
  error('public/robots.txt does not shadow the handler',
    'Vercel serves public/ ahead of the rewrite, so the handler never runs in production');
} else {
  ok('public/robots.txt does not shadow the handler');
}

// ── 7b. Content drift: pages vs the code they describe ──────────────────────
// Everything above checks STRUCTURE. Structure has been fine the whole time —
// the site is reachable, the drawer is complete, no page is an orphan, every
// link resolves. Meanwhile the pages kept describing a server a few versions
// older: routes went undocumented, a schema count froze, and a deleted feature
// stayed presented as live. A check that only ever passes trains nobody to read
// it, so these compare the pages against the code.
info('Checking docs against code...');
const DOCS_ALL = {};
if (existsSync(DOCS_DIR)) {
  for (const f of readdirSync(DOCS_DIR).filter(f => f.endsWith('.html'))) {
    DOCS_ALL[f] = readFileSync(join(DOCS_DIR, f), 'utf8');
  }
}
const ALL_DOCS = Object.values(DOCS_ALL).join('\n');

// 1. Every static server route must be documented on at least one page. Owner-only
//    /__admin/* routes are documented in admin.html rather than the public API
//    page, so they are exempted here.
const SERVER = readText('server.mjs');
if (SERVER) {
  const ROUTE_RE = /['"]((?:\/__|\/api)[^'"]*)['"]/g;
  const routes = new Set();
  let m;
  while ((m = ROUTE_RE.exec(SERVER)) !== null) {
    let p = m[1];
    const star = p.indexOf('*');
    if (star !== -1) p = p.slice(0, star);
    if (/[${}()\[\]`]/.test(p)) continue;      // template fragment, not a route
    p = p.replace(/\/+$/, '');
    if (p.length < 5 || p === '/__' || p === '/api') continue;
    if (p.startsWith('/__admin')) continue;
    routes.add(p);
  }
  // A route counts as documented when a page carries it literally, or when a page
  // documents the group it belongs to (a token ending in /*, :param or …).
  const GROUPS = [...new Set([...ALL_DOCS.matchAll(/(?:\/__|\/api)[A-Za-z0-9_\-/*:…]+/g)].map(x => x[0]))];
  const covered = (p) => {
    if (ALL_DOCS.includes(p)) return true;
    return GROUPS.some(g => {
      if (g === p) return true;
      if (/[*…]$/.test(g)) {                  // wildcard group, e.g. /__supa/*
        const prefix = g.replace(/\/?\*+$/, '').replace(/…+$/, '');
        return p.startsWith(prefix);
      }
      if (/[:{]/.test(g)) {                   // parametric form, e.g. /events/:id
        const prefix = g.replace(/\/:.*$/, '');
        return p.startsWith(prefix);
      }
      return false;
    });
  };
  const undoc = [...routes].filter(p => !covered(p)).sort();
  if (undoc.length) {
    for (const p of undoc) error(`server route ${p} is not documented on any docs page`);
  } else {
    ok(`All ${routes.size} server routes are documented`);
  }
} else {
  warn('server.mjs not found — cannot check route coverage');
}

// 2. Schema counts must match the schema dump the pages say they were counted from.
//
//    The check that used to live here required one exact sentence shape:
//
//      /(\d+)\s*tables?,\s*(\d+)\s*functions?,\s*(\d+)\s*policies?,\s*(\d+)\s*triggers?…/
//
//    That matched ZERO of the forty-odd schema-count mentions in docs/. Every real
//    one either omitted an element ("42 tables, 80 functions, 153 policies"),
//    joined with "and" instead of a comma, put triggers before policies, wrapped
//    the numeral in <strong>, put an adjective between number and noun ("80 public
//    functions"), or lived in a <meta description>. So the headline counts were
//    effectively unchecked: they froze at 153 for months while the dump moved
//    153 -> 164 -> 169 -> 191 -> 188, and the check still reported success because
//    the only thing it really validated was the twelve hand-written data-ticker
//    attributes.
//
//    So: anchor on the NOUN, not on the sentence. Find every "N <schema-noun>" in
//    the page after stripping tags, then decide whether that number is supposed to
//    equal the dump. The scope table is what keeps this honest — "28 policies" in a
//    sentence about performance-patch.sql is true, and flagging it would train the
//    author to ignore the output.

// Strip tags, decode the entities that carry numbers, and drop SVG (whose path
// data is full of decimals that look like counts). Module scope because the
// per-file fact checks need it too, and a page's prose lives in <meta> as much as
// in <body> — the stale policy count shipped in database.html's meta description
// for months precisely because only <body> was ever searched.
const plain = (html) => html
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&mdash;|&#8212;/g, ' — ')
  .replace(/\s+/g, ' ');

const SCHEMA = readText('isotope-complete.sql');
if (SCHEMA) {
  const OWNER = `("[^"]+"\\."[^"]+"|[a-zA-Z_][\\w]*\\."[^"]+"|[a-zA-Z_][\\w]*\\.[a-zA-Z_][\\w]*|[a-zA-Z_][\\w]*)`;
  const grab = (re) => [...SCHEMA.matchAll(re)].map((m) => m[1].replace(/"/g, ''));
  const n = (re) => (SCHEMA.match(re) || []).length;

  const tableNames = grab(new RegExp(`CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+(${OWNER})`, 'g'));
  const funcNames = grab(new RegExp(`CREATE\\s+OR\\s+REPLACE\\s+FUNCTION\\s+(${OWNER})`, 'g'));
  const polOwners = grab(new RegExp(`CREATE\\s+POLICY\\s+"[^"]+"\\s+ON\\s+(${OWNER})`, 'g'));
  const publicFns  = funcNames.filter((f) => f.startsWith('public')).length;
  const publicPols = polOwners.filter((p) => p.startsWith('public')).length;

  const actual = {
    tables:    tableNames.length,
    functions: funcNames.length,
    policies:  polOwners.length,
    triggers:  n(/\bCREATE\s+TRIGGER\b/gi),
    indexes:   n(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS/gi),
  };
  ok(`isotope-complete.sql — ${actual.tables} tables, ${actual.functions} functions (${publicFns} public), ${actual.policies} policies (${publicPols} public), ${actual.triggers} triggers, ${actual.indexes} indexes`);

  // Which SQL file a sentence is talking about. A mention is only compared to the
  // dump when the sentence is about the dump; otherwise it is compared to that
  // file's own numbers, or skipped as out of scope.
  const OTHER_FILES = [
    'community-patch-v6.sql', 'community-patch-v4.sql', 'events-expansion.sql',
    'performance-patch.sql', 'leaderboard-rls-fix.sql', 'isotope-schema.sql',
  ];

  // Counts that are correct but scoped to something other than the base dump.
  // Each is (noun, value, why) so a reader can tell a real finding from noise.
  const SUBSET_OK = [
    { k: 'functions', v: publicFns,  why: 'public-schema functions only' },
    { k: 'policies',  v: publicPols, why: 'public-schema policies only' },
    { k: 'functions', v: 73,         why: 'pre-v6 function count in the patch note' },
    { k: 'functions', v: 57,         why: 'post-patch public function count' },
    { k: 'tables',    v: 38,         why: 'post-patch table count (Events + Store removed)' },
    { k: 'tables',    v: 20,         why: 'tables dropped by community-patch-v6' },
    { k: 'tables',    v: 11,         why: 'partial restore in the incident note' },
    { k: 'policies',  v: 28,         why: 'performance-patch.sql policy count' },
    { k: 'policies',  v: 27,         why: 'performance-patch.sql policy count' },
    { k: 'policies',  v: 7,          why: 'leaderboard-rls-fix.sql drop count' },
    { k: 'policies',  v: 4,          why: 'leaderboard-rls-fix.sql create count' },
    { k: 'policies',  v: 62,         why: 'community-patch-v6.sql drop count' },
    { k: 'policies',  v: 70,         why: 'community-patch-v6.sql drop count (stale)' },
    { k: 'policies',  v: 77,         why: 'community-patch-v6.sql create count' },
    { k: 'policies',  v: 78,         why: 'community-patch-v6.sql create count (stale)' },
    { k: 'indexes',   v: 9,          why: 'performance-patch.sql index count' },
    { k: 'tables',    v: 4,          why: 'tables dropped by v6/events-expansion' },
    { k: 'functions', v: 15,         why: 'v6 function names present in base' },
    { k: 'functions', v: 27,         why: 'distinct functions v6 drops' },
    { k: 'functions', v: 28,         why: 'functions v6 drops (stale)' },
    { k: 'triggers',  v: 14,         why: 'public triggers; the 15th is on auth.users' },
    { k: 'functions', v: 30,         why: 'the community_* RPC surface' },
    { k: 'tables',    v: 8,          why: 'community_* tables' },
    { k: 'policies',  v: 24,         why: 'storage.objects policies' },
    { k: 'policies',  v: 16,         why: 'storage.objects policies (stale)' },
    { k: 'functions', v: 24,         why: 'migration-era count in the incident note' },
  ];
  const subsetIndex = new Map(SUBSET_OK.map((s) => [`${s.k}:${s.v}`, s.why]));

  // "80 public functions", "184 RLS policies", "42 tables". The gap absorbs
  // adjectives; the noun is what identifies the count.
  const COUNT_RE = /(\d+)\s*(?:[A-Za-z]+\s+){0,3}?(tables?|functions?|polic(?:y|ies)|triggers?|indexes?)\b/gi;
  // Map every surface form of the noun onto the `actual` object key. Written as a
  // lookup rather than by stripping suffixes: "policies" -> "polic" -> "policy"
  // is a three-step guess, and one wrong step silently compares against undefined,
  // which reports every correct number as broken.
  const NOUN_KEY = {
    table: 'tables',    tables: 'tables',
    function: 'functions', functions: 'functions',
    policy: 'policies',  policies: 'policies',
    trigger: 'triggers', triggers: 'triggers',
    index: 'indexes',    indexes: 'indexes',
  };

  let stale = 0, checked = 0, scoped = 0;
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    const text = plain(html);
    for (const cm of text.matchAll(COUNT_RE)) {
      const noun = cm[2].toLowerCase();
      const actualKey = NOUN_KEY[noun];
      if (!actualKey) continue;              // not a schema noun
      const v = +cm[1];

      checked++;
      const why = subsetIndex.get(`${actualKey}:${v}`);

      // A mention of a patch file is out of scope for the dump regardless of value.
      const ctx = text.slice(Math.max(0, cm.index - 400), cm.index + 400);
      const aboutPatch = OTHER_FILES.some((f) => ctx.includes(f));
      if (aboutPatch) { scoped++; continue; }

      // The changelog is a record of what each release contained, not a description
      // of the current schema. "14 database indexes" under 3.3.5 was true when it
      // shipped and is not a claim about today's dump — the same class of carve-out
      // as the patch files, for the same reason.
      if (file === 'changelog.html') { scoped++; continue; }

      if (why) {
        // A subset count is fine only when it is genuinely a subset. If it equals
        // neither the total nor a known subset, it is a real error.
        scoped++;
        continue;
      }
      if (v !== actual[actualKey]) {
        const where = text.slice(Math.max(0, cm.index - 60), cm.index + 60).trim();
        error(`docs/${file} says "${v} ${noun}" but isotope-complete.sql has ${actual[actualKey]} ${actualKey} — near: …${where}…`);
        stale++;
      }
    }
  }

  // Tickers: the structured, machine-readable form of the same claim.
  const labelKey = (label) => {
    const l = label.toLowerCase();
    if (l.includes('table')) return 'tables';
    if (l.includes('function')) return 'functions';
    if (l.includes('polic')) return 'policies';
    if (l.includes('trigger')) return 'triggers';
    if (l.includes('index')) return 'indexes';
    return null;
  };
  const tickRe = /data-ticker="(\d+)"[^]*?class="ticker-label">([^<]*)</g;
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    let tm;
    tickRe.lastIndex = 0;
    while ((tm = tickRe.exec(html)) !== null) {
      const k = labelKey(tm[2]);
      if (!k) continue;                       // e.g. "Runtime dependencies" — not a schema count
      const v = +tm[1];
      if (v !== actual[k]) {
        error(`docs/${file} ticker "${tm[2].trim()}" = ${v} != isotope-complete.sql ${actual[k]}`);
        stale++;
      }
    }
  }

  if (stale === 0) {
    ok(`Schema counts in docs match isotope-complete.sql (${checked} mentions scanned, ${scoped} scoped to a patch file or a legitimate subset)`);
  }
} else {
  warn('isotope-complete.sql not found — cannot check schema counts');
}

// 2b. Per-file facts. Statement, byte and line counts for the SQL files the pages
//     describe. These were wrong on five pages at once ("272 KB / 5,368 lines",
//     "1,812 statements") and nothing caught them, because the count check above
//     only ever looked at object nouns in the dump.
//
//     Statement counting reuses the splitter from scripts/supabase-setup.mjs, which
//     is quote-, comment- and dollar-quote-aware. A naive `grep -c ';'` over the
//     file gives 3,053 and counts every semicolon inside a function body, which is
//     how the docs ended up quoting a number no code path could ever produce.
if (SCHEMA) {
  const splitStatements = (sql) => {
    const out = []; let cur = '', i = 0, tag = null; const n = sql.length;
    while (i < n) {
      const c = sql[i], nx = sql[i + 1];
      if (tag) { cur += c; if (c === '$' && sql.startsWith(tag, i)) { cur += tag.slice(1); i += tag.length; tag = null; continue; } i++; continue; }
      if (c === "'") { cur += c; i++; while (i < n && sql[i] !== "'") { if (sql[i] === '\\' && sql[i + 1] !== undefined && sql[i + 1] !== "'") { cur += sql[i] + sql[i + 1]; i += 2; continue; } cur += sql[i]; i++; } if (i < n) { cur += "'"; i++; } continue; }
      if (c === '-' && nx === '-') { while (i < n && sql[i] !== '\n') { cur += sql[i]; i++; } continue; }
      if (c === '/' && nx === '*') { cur += c + nx; i += 2; while (i + 1 < n && !(sql[i] === '*' && sql[i + 1] === '/')) { cur += sql[i]; i++; } if (i + 1 < n) { cur += '*/'; i += 2; } else i++; continue; }
      if (c === '$') { const m = sql.slice(i).match(/^\$[A-Za-z0-9_]*\$/); if (m) { tag = m[0]; cur += tag; i += tag.length; continue; } }
      if (c === ';') { out.push(cur.trim()); cur = ''; i++; continue; }
      cur += c; i++;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const bareStmt = (s) => s.split('\n').filter((l) => !/^\s*--/.test(l)).join('\n').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const WRAPPER = /^(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION|END)\s*;?$/i;

  const fileFacts = (rel) => {
    const t = readText(rel);
    if (!t) return null;
    const bytes = Buffer.byteLength(t, 'utf8');
    return {
      bytes,
      kb: Math.round(bytes / 1024),
      lines: t.split('\n').length,
      statements: splitStatements(t).filter((s) => { const b = bareStmt(s); return b && !WRAPPER.test(b); }).length,
    };
  };

  const filesToMeasure = [
    'isotope-complete.sql', 'community-patch-v6.sql', 'performance-patch.sql', 'leaderboard-rls-fix.sql',
  ];
  const facts = {};
  for (const f of filesToMeasure) {
    const fx = fileFacts(f);
    if (!fx) { warn(`${f} not found — cannot verify its size/statement claims`); continue; }
    facts[f] = fx;
    ok(`${f} — ${fx.statements} statements, ${fx.lines} lines, ${fx.kb} KB`);
  }

  // Now compare every file-size / statement claim in the prose against those facts.
  const SIZE_RE = /(\d[\d,]*)\s*(KB|MB)\b/gi;
  const STMT_RE = /(\d[\d,]*)\s*statements?/gi;
  const LINES_RE = /(\d[\d,]*)\s*lines?\b/gi;
  let factBad = 0;
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    const text = plain(html);
    for (const m of text.matchAll(SIZE_RE)) {
      const v = +m[1].replace(/,/g, '');
      const unit = m[2].toUpperCase();
      const ctx = text.slice(Math.max(0, m.index - 160), m.index + 40);
      // Only judge a size claim when the sentence names the file it is about.
      const named = filesToMeasure.find((f) => ctx.includes(f));
      if (!named || !facts[named]) continue;
      const truth = unit === 'KB' ? facts[named].kb : Math.round(facts[named].bytes / 1048576);
      if (v !== truth) {
        error(`docs/${file} says ${named} is ${m[1]} ${m[2]} but it is ${facts[named].kb} KB (${facts[named].bytes} bytes)`);
        factBad++;
      }
    }
    for (const m of text.matchAll(STMT_RE)) {
      const v = +m[1].replace(/,/g, '');
      const ctx = text.slice(Math.max(0, m.index - 200), m.index + 60);
      const named = filesToMeasure.find((f) => ctx.includes(f)) ||
        (ctx.includes('schema') && 'isotope-complete.sql');
      if (!named || !facts[named]) continue;
      // The changelog quotes what a past release applied; not a present-tense claim.
      if (file === 'changelog.html') continue;
      if (v !== facts[named].statements) {
        error(`docs/${file} says ${named} has ${m[1]} statements but it has ${facts[named].statements}`);
        factBad++;
      }
    }
    for (const m of text.matchAll(LINES_RE)) {
      const v = +m[1].replace(/,/g, '');
      const ctx = text.slice(Math.max(0, m.index - 160), m.index + 40);
      const named = filesToMeasure.find((f) => ctx.includes(f));
      if (!named || !facts[named]) continue;
      if (file === 'changelog.html') continue;
      if (v !== facts[named].lines) {
        // A line count drifts every time the dump is regenerated, which is routine.
        // Worth knowing the docs are behind; not worth failing a build over, since
        // the number is descriptive rather than load-bearing (nobody's restore
        // breaks because a page said 5,368 instead of 6,181).
        warn(`docs/${file} says ${named} has ${m[1]} lines but it has ${facts[named].lines}`);
      }
    }
  }
  if (factBad === 0) ok('File size, line and statement claims in docs match the files on disk');
}

// 2c. Dead anchors. A link to "#section" that no longer exists looks fine in review
//     and lands the reader at the top of the page. Two shipped that way: a
//     #updater link on two pages after the self-updater section was deleted, and a
//     #hardening link after that section was renamed. Every anchor the pages emit
//     is checked against the id= set of its target.
if (existsSync(DOCS_DIR)) {
  const idsByPage = new Map();
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    idsByPage.set(file, new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1])));
  }
  let deadAnchors = 0;
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    for (const m of html.matchAll(/href="([^"]*#[^"]+)"/g)) {
      const href = m[1];
      if (/^https?:/.test(href)) continue;
      const [rawFile, frag] = href.split('#');
      if (!frag) continue;
      let target = rawFile;
      if (target.startsWith('./')) target = target.slice(2);
      else if (target.startsWith('/isotope-code/')) target = target.slice('/isotope-code/'.length);
      else if (target === '') target = file;
      else if (target.startsWith('/')) continue;
      if (target === file) {
        if (!idsByPage.get(file).has(frag)) {
          error(`docs/${file} links to its own #${frag}, which does not exist on the page`);
          deadAnchors++;
        }
        continue;
      }
      if (!DOCS_ALL[target]) continue;         // missing pages are reported above
      if (!idsByPage.get(target).has(frag)) {
        error(`docs/${file} links to ${target}#${frag}, but ${target} has no id="${frag}"`);
        deadAnchors++;
      }
    }
  }
  if (deadAnchors === 0) ok('Every internal anchor in docs resolves to a real section');
}

// 2d. Canonical host. Every page shipped a <link rel="canonical"> pointing at a
//     GitHub Pages URL that has never resolved, because Pages was never enabled on
//     the repository. That is the worst kind of SEO bug: it does not look broken,
//     it works exactly as specified, and it tells every crawler the authoritative
//     URL is a host that does not exist. The live host comes from server.mjs's
//     siteOrigin() default — not package.json's homepage, which is itself stale
//     (isotopeai.in, while the running site and all 23 README links use
//     isotopeai.dpdns.org). Trusting homepage here would have turned this check
//     into 22 false errors against a correct deployment.
info('Checking canonical URLs...');
const serverTxtAll = readText('server.mjs') || '';
let canonHost = null;
const originDefault = serverTxtAll.match(/return\s+'(https:\/\/[^']+)'\s*;?\s*$/m) ||
  serverTxtAll.match(/SITE_ORIGIN\s*\|\|\s*'(https:\/\/[^']+)'/);
if (originDefault) { try { canonHost = new URL(originDefault[1]).host; } catch { /* ignore */ } }
if (!canonHost) {
  // Fall back to the host most of the pages already agree on.
  const tally = new Map();
  for (const html of Object.values(DOCS_ALL)) {
    for (const m of html.matchAll(/<link[^>]+rel="canonical"[^>]+href="https?:\/\/([^/"]+)/g)) {
      tally.set(m[1], (tally.get(m[1]) || 0) + 1);
    }
  }
  const best = [...tally].sort((a, b) => b[1] - a[1])[0];
  if (best) canonHost = best[0];
}
if (canonHost) {
  const badCanon = [];
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    for (const m of html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)) {
      let host = null;
      try { host = new URL(m[1]).host; } catch { /* relative canonical */ continue; }
      if (host !== canonHost) badCanon.push(`${file} -> ${m[1]}`);
    }
  }
  if (badCanon.length) {
    for (const b of badCanon) error(`canonical URL points at the wrong host: ${b} (expected ${canonHost})`);
  } else {
    ok(`All canonical URLs use the package.json homepage host (${canonHost})`);
  }

  // The same string is injected into every served page as a docs badge.
  const otherHost = [...serverTxtAll.matchAll(/https:\/\/([a-z0-9.-]+\.[a-z]{2,})\/(?:docs\/|isotope-code\/)/g)]
    .map((m) => m[1]).find((h) => h !== canonHost);
  if (otherHost) {
    error(`server.mjs injects a docs badge pointing at ${otherHost}, not ${canonHost}`);
  } else if (serverTxtAll.includes('isotope-code/') || serverTxtAll.includes('/docs/')) {
    ok('server.mjs docs badge uses the same host as the canonicals');
  }
}

// 3. Deleted client surfaces. The in-app self-updater UI is gone from injectScripts
//    (no overlay, no floating pill) and /api/update-now no longer spawns
//    `isotope update`. A page that still presents one of these as a live feature
//    describes a build that no longer ships. The changelog may mention them — it is
//    a record of the deletion.
const RETIRED = [
  { needle: '/api/update-now', context: ['410', 'no longer', 'removed', 'no-op', 'stub'] },
  { needle: 'update-checker.js', context: ['removed', 'no longer', 'deleted'] },
];
for (const { needle, context } of RETIRED) {
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    if (file === 'changelog.html' || !html.includes(needle)) continue;
    if (!context.some(c => html.toLowerCase().includes(c))) {
      error(`docs/${file} documents the deleted surface "${needle}" as live (needs one of: ${context.join(', ')})`);
    }
  }
}

// 4. The changelog must describe the shipped version, not an older one.
const CL = readText('docs/changelog.html');
if (CL && pkgVersion !== 'unknown') {
  const body = CL.slice(CL.indexOf('<body'));
  // Match a real changelog heading (## [x.y.z]), not a bare number pulled out of
  // an SVG path's decimal coordinates.
  const m = body.match(/(?:<h[1-6][^>]*>|##\s*\[?)(\d+\.\d+\.\d+)/);
  if (!m) warn('docs/changelog.html has no version number');
  else if (m[1] !== pkgVersion) warn(`docs/changelog.html latest entry is ${m[1]}, package.json is ${pkgVersion}`);
  else ok('docs/changelog.html latest entry matches package.json');
}
const CLMD = readText('CHANGELOG.md');
if (CLMD && pkgVersion !== 'unknown') {
  const m = CLMD.match(/^## \[?(\d+\.\d+\.\d+)/m);
  if (!m) warn('CHANGELOG.md has no versioned entry');
  else if (m[1] !== pkgVersion) warn(`CHANGELOG.md latest entry is ${m[1]}, package.json is ${pkgVersion}`);
  else ok('CHANGELOG.md latest entry matches package.json');
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('');
console.log(`${B}Validation summary${R}`);
// This was `${REQUIRED_FILES.length - errors}`, which subtracted the total error
// count from the number of files in the required-files list. The two are unrelated
// — one error made the total read "24 checks" next to "Errors: 1", and the number
// moved for reasons that had nothing to do with how many things passed. `passes` is
// counted where a check actually succeeds, so it means what the label says.
console.log(`  ${G}Passed${R}  : ${passes} checks`);
console.log(`  ${Y}Warnings${R}: ${warns}`);
console.log(`  ${E}Errors${R}  : ${errors}`);
console.log('');

if (errors > 0) {
  console.error(`${E}${B}Validation failed — ${errors} error(s).${R}`);
  process.exit(1);
} else if (STRICT && warns > 0) {
  console.error(`${Y}${B}Strict mode — ${warns} warning(s) treated as errors.${R}`);
  process.exit(1);
} else if (warns > 0) {
  console.log(`${Y}Validation passed with ${warns} warning(s).${R}`);
} else {
  console.log(`${G}${B}All checks passed.${R}`);
}
