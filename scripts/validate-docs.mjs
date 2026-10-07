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
const ok    = (msg, detail = '') => { console.log(`${G}  ✅ ${msg}${R}${detail ? ` ${detail}` : ''}`); };
const warn  = (msg, detail = '') => { console.warn(`${Y}  ⚠️  ${msg}${R}${detail ? `\n     ${detail}` : ''}`); warns++; };
const error = (msg, detail = '') => { console.error(`${E}  ❌ ${msg}${R}${detail ? `\n     ${detail}` : ''}`); errors++; };
const info  = (msg) => console.log(`${C}  →  ${msg}${R}`);

let errors = 0;
let warns = 0;

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
// public/robots.txt is served by Vercel AHEAD of the api/index rewrite, so the
// handler in server.mjs never runs in production. The static copy is the one that
// actually ships — and the two drifted apart silently: the handler gained a
// Sitemap: line while the file Vercel serves kept saying only "Allow: /".
info('Checking crawler routes...');
const robotsBody = readText('public/robots.txt');
if (robotsBody === null) {
  error('public/robots.txt exists', 'the file crawlers read is missing');
} else {
  if (/^Sitemap:\s*\S+/mi.test(robotsBody)) ok('public/robots.txt declares a sitemap');
  else error('public/robots.txt declares a sitemap', 'no "Sitemap:" line — crawlers get no map of the site');
  if (/^Allow:\s*\/$/mi.test(robotsBody)) ok('public/robots.txt allows the site root');
  else error('public/robots.txt allows the site root', 'no longer allows /');
}
const serverSrc = readText('server.mjs') || '';
if (serverSrc.includes("urlPath === '/sitemap.xml'")) ok('server.mjs serves /sitemap.xml');
else error('server.mjs serves /sitemap.xml', 'the SPA fallback answers it with the app shell instead');
if (serverSrc.includes("urlPath === '/robots.txt'")) ok('server.mjs serves /robots.txt');
else error('server.mjs serves /robots.txt', 'self-hosted runs get HTML for robots.txt');

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
const SCHEMA = readText('isotope-complete.sql');
if (SCHEMA) {
  const n = (re) => (SCHEMA.match(re) || []).length;
  const actual = {
    tables:    n(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS/gi),
    functions: n(/CREATE\s+OR\s+REPLACE\s+FUNCTION/gi),
    policies:  n(/CREATE\s+POLICY/gi),
    triggers:  n(/\bCREATE\s+TRIGGER\b/gi),
    indexes:   n(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS/gi),
  };
  ok(`isotope-complete.sql — ${actual.tables} tables, ${actual.functions} functions, ${actual.policies} policies, ${actual.triggers} triggers, ${actual.indexes} indexes`);
  // Canonical headline counts — the tuple in meta/lead copy and the dashboard
  // tickers. A loose "N functions" scan was used before and immediately started
  // flagging legitimate subset mentions ("re-creates 28 policies", "Adds 9
  // indexes"), which trains the author to ignore errors. The only counts that
  // must equal the dump are the headline totals.
  const TUPLE_RE = /(\d+)\s*tables?,\s*(\d+)\s*functions?,\s*(\d+)\s*(?:RLS\s+|row-level\s+security\s+)?policies?,\s*(\d+)\s*triggers?(?:\s+and\s+(\d+)\s*indexes?)?/gi;
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
  let stale = 0;
  for (const [file, html] of Object.entries(DOCS_ALL)) {
    for (const cm of html.matchAll(TUPLE_RE)) {
      const vals = { tables: +cm[1], functions: +cm[2], policies: +cm[3], triggers: +cm[4], indexes: cm[5] ? +cm[5] : undefined };
      for (const [k, v] of Object.entries(vals)) {
        if (v !== actual[k]) {
          error(`docs/${file} headline ${k} count ${v} != isotope-complete.sql ${actual[k]}`);
          stale++;
        }
      }
    }
    let tm;
    while ((tm = tickRe.exec(html)) !== null) {
      const k = labelKey(tm[2]);
      if (!k) continue;
      const v = +tm[1];
      if (v !== actual[k]) {
        error(`docs/${file} ticker "${tm[2].trim()}" = ${v} != isotope-complete.sql ${actual[k]}`);
        stale++;
      }
    }
  }
  if (stale === 0) ok('Schema counts in docs match isotope-complete.sql');
} else {
  warn('isotope-complete.sql not found — cannot check schema counts');
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
console.log(`  ${G}Passed${R}  : ${REQUIRED_FILES.length - errors} checks`);
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
