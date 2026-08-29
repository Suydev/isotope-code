/**
 * IsotopeAI — Playwright screenshot capture
 * ──────────────────────────────────────────────────────────────────────────────
 * Usage:
 *   node scripts/capture-screenshots.mjs [--server=URL] [--out=DIR] [options]
 *
 * Prerequisites:
 *   npm install -D playwright
 *   npx playwright install chromium
 *   The IsotopeAI server must already be running:  isotope start
 *
 * Options:
 *   --server=URL     Base URL (default: http://127.0.0.1:3000)
 *   --out=DIR        Output directory (default: screenshots/)
 *   --routes=a,b,c   Capture only these route keys
 *   --scale=N        Device pixel ratio (default 2 → 3840×2160 desktop shots)
 *   --compress       Run pngquant over the results if available
 *   --allow-blank    Do not fail on blank/duplicate output (debugging only)
 *
 *   --login          Sign in with a real Supabase account before capturing.
 *                    Credentials come from the environment, never CLI args:
 *                      SHOT_EMAIL / SHOT_PASSWORD
 *                      or ISOTOPE_SHOT_EMAIL / ISOTOPE_SHOT_PASSWORD
 *                    plus SUPABASE_URL / SUPABASE_ANON_KEY.
 *   --demo           Capture the built-in demo workspace instead. Needs no
 *                    account: the app serves in-memory JEE fixtures. Mutually
 *                    exclusive with --login; --login wins if both are given.
 *
 * ── Why this file was rewritten ───────────────────────────────────────────────
 * The previous version silently produced unusable output, and three separate
 * defects each caused it independently:
 *
 *   1. It captured the WRONG ROUTES. `hero-dashboard` pointed at `/`, which is
 *      the marketing landing page, not the app. The real dashboard is
 *      `/dashboard` — 39 references in the bundle confirm it. So the flagship
 *      "dashboard" screenshot never showed the dashboard.
 *
 *   2. `--demo` DID NOTHING. It appended `?demo=1`, and nothing in the shipped
 *      bundle reads a `demo` query parameter. Demo mode is entered by visiting
 *      `/demo`, which sets sessionStorage['isotope-demo-mode']='1'. Worse, the
 *      server injects a guard that deletes that key on any path other than
 *      `/demo` (server.mjs:2389) — and `/demo` immediately redirects to
 *      `/dashboard`, so demo mode destroys itself one navigation after being
 *      switched on. It cannot work without the shim below.
 *
 *   3. Its blank-page check COULD NOT FAIL. `isMainlyWhite` created a fresh
 *      20×20 canvas, filled it with the body background colour, then measured
 *      how white that canvas was. It never sampled the page — it measured its
 *      own paint. That is why three byte-identical pairs of screenshots shipped
 *      marked `"status": "captured"`.
 *
 * This version reads the real PNG bytes back off disk, and fails the run on a
 * blank frame or a duplicate hash. A screenshot tool whose failure mode is
 * "green with wrong output" is worse than no tool.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { inflateSync } from 'zlib';
import https from 'https';
import http from 'http';

// ── Config from CLI args ─────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...v] = a.slice(2).split('=');
      return [k, v.length ? v.join('=') : true];
    })
);

const BASE_URL    = args.server || process.env.ISOTOPE_URL || 'http://127.0.0.1:3000';
const OUT_DIR     = resolve(args.out || 'screenshots');
const COMPRESS    = !!args.compress;
const ALLOW_BLANK = !!args['allow-blank'];
const ONLY        = args.routes ? String(args.routes).split(',') : null;
const SCALE       = Math.max(1, Math.min(4, Number(args.scale) || 2));

// --login and --demo are different products. Signed in you get the real
// account's data; in demo mode you get curated fixtures and no account at all.
// Capturing both at once would mix two datasets across one gallery.
const LOGIN = !!args.login;
const DEMO  = !!args.demo && !LOGIN;
if (args.login && args.demo) {
  console.warn('  ⚠️  --login and --demo are mutually exclusive; using --login.');
}

const SHOT_EMAIL    = process.env.SHOT_EMAIL || process.env.ISOTOPE_SHOT_EMAIL || '';
const SHOT_PASSWORD = process.env.SHOT_PASSWORD || process.env.ISOTOPE_SHOT_PASSWORD || '';
const SUPA_URL      = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPA_ANON     = process.env.SUPABASE_ANON_KEY || '';

// ── Viewports ────────────────────────────────────────────────────────────────
// 1920×1080 at deviceScaleFactor 2 yields a 3840×2160 PNG — true 4K, produced
// by rendering at 2× rather than by upscaling, so text stays sharp.
const DESKTOP = { width: 1920, height: 1080 };
const MOBILE  = { width: 430,  height: 932 };   // iPhone 15 Pro Max logical size

// ── Routes ───────────────────────────────────────────────────────────────────
// Paths verified against the route table in the shipped bundle. `waitFor` is a
// comma-separated selector list; the first match wins. `ready` is an additional
// text or element assertion that proves the route actually rendered its own
// content rather than a shared shell.
const ROUTES = [
  {
    key: 'hero-dashboard', path: '/dashboard', file: 'hero-dashboard.png',
    viewport: DESKTOP, waitFor: '[class*="dashboard"], main',
    description: 'Today dashboard — next task, exam pressure, study progress',
  },
  {
    key: 'focus-timer', path: '/focus', file: 'focus-timer.png',
    viewport: DESKTOP, waitFor: '[class*="timer"], [class*="focus"], main',
    description: 'Focus timer with subject, chapter and task attached',
  },
  {
    key: 'analytics', path: '/analytics', file: 'analytics.png',
    viewport: DESKTOP, waitFor: 'canvas, svg, [class*="analytics"], main',
    description: 'Study analytics — weekly hours and subject breakdown',
  },
  {
    key: 'syllabus', path: '/syllabus', file: 'syllabus.png',
    viewport: DESKTOP, waitFor: '[class*="syllabus"], main',
    description: 'Syllabus tracker with chapter and topic progress',
  },
  {
    key: 'tasks', path: '/tasks', file: 'tasks.png',
    viewport: DESKTOP, waitFor: '[class*="task"], main',
    description: 'Student task manager with priorities and due dates',
  },
  {
    key: 'exams', path: '/exams', file: 'exams.png',
    viewport: DESKTOP, waitFor: '[class*="exam"], main',
    description: 'Exam planner — countdowns, mocks and readiness',
  },
  {
    key: 'study-planner', path: '/study', file: 'study-planner.png',
    viewport: DESKTOP, waitFor: '[class*="study"], [class*="plan"], main',
    description: 'Study planner — the next seven days from real deadlines',
  },
  {
    key: 'community', path: '/community', file: 'community.png',
    viewport: DESKTOP, waitFor: '[class*="community"], [class*="group"], main',
    description: 'Study groups, leaderboard and challenges',
  },
  {
    key: 'settings-sync', path: '/settings', file: 'settings-sync.png',
    viewport: DESKTOP, waitFor: '[class*="setting"], main',
    description: 'Cloud sync status and profile settings',
  },
  {
    key: 'landing', path: '/', file: 'landingpage.png',
    viewport: DESKTOP, waitFor: 'main, header',
    description: 'Public landing page',
    // The landing page is the one route that is genuinely long-form, and the
    // one where a full-page capture is worth the file size.
    fullPage: true,
    public: true,
  },
  {
    key: 'mobile-dashboard', path: '/dashboard', file: 'mobile-dashboard.png',
    viewport: MOBILE, waitFor: '[class*="dashboard"], main',
    description: 'Mobile dashboard',
  },
  {
    key: 'mobile-focus', path: '/focus', file: 'mobile-focus.png',
    viewport: MOBILE, waitFor: '[class*="timer"], [class*="focus"], main',
    description: 'Mobile focus timer',
  },
];

// ── Output helpers ───────────────────────────────────────────────────────────
const RESET='\x1b[0m', GREEN='\x1b[32m', RED='\x1b[31m',
      YELLOW='\x1b[33m', CYAN='\x1b[36m', BOLD='\x1b[1m';
const log  = m => console.log(`${CYAN}  →${RESET} ${m}`);
const ok   = m => console.log(`${GREEN}  ✅ ${m}${RESET}`);
const fail = m => console.error(`${RED}  ❌ ${m}${RESET}`);
const warn = m => console.warn(`${YELLOW}  ⚠️  ${m}${RESET}`);

// ── Real PNG inspection ──────────────────────────────────────────────────────
/**
 * Decode a PNG far enough to sample actual pixels. This replaces the previous
 * heuristic, which measured a canvas it had just painted itself and therefore
 * could never report a blank page.
 *
 * Only the filters PNG actually emits are implemented (0–4), and sampling is
 * sparse — this runs on every capture, so it must be cheap.
 *
 * Returns { width, height, uniform, dominantShare, distinctColours } or null if
 * the file is not a PNG this can read (in which case the caller does not treat
 * the result as a failure — an unreadable check is not a failed check).
 */
function inspectPng(path) {
  let buf;
  try { buf = readFileSync(path); } catch { return null; }
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;

  let off = 8, width = 0, height = 0, depth = 0, colour = 0, interlace = 0;
  const idat = [];
  let palette = null;
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      depth = data[8]; colour = data[9]; interlace = data[12];
    } else if (type === 'PLTE') palette = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  // Playwright emits 8-bit non-interlaced RGBA. pngquant then rewrites the
  // committed files as 8-bit palette, so both are supported — otherwise this
  // check could never be re-run against what is actually in the repository.
  if (depth !== 8 || interlace !== 0) return null;
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colour];
  if (!channels || !width || !height) return null;
  if (colour === 3 && !palette) return null;

  let raw;
  try { raw = inflateSync(Buffer.concat(idat)); } catch { return null; }

  const stride = width * channels;
  if (raw.length < (stride + 1) * height) return null;

  // Unfilter row by row, sampling as we go. Every row must be unfiltered
  // because filters reference the previous row, but only some are sampled.
  const counts = new Map();
  let prev = Buffer.alloc(stride);
  let pos = 0, sampled = 0;
  const ROW_STEP = Math.max(1, Math.floor(height / 120));
  const COL_STEP = Math.max(1, Math.floor(width / 120)) * channels;

  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const line = Buffer.from(raw.subarray(pos, pos + stride));
    pos += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? line[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      switch (filter) {
        case 1: line[x] = (line[x] + a) & 255; break;
        case 2: line[x] = (line[x] + b) & 255; break;
        case 3: line[x] = (line[x] + ((a + b) >> 1)) & 255; break;
        case 4: {
          const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
          line[x] = (line[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
          break;
        }
      }
    }
    if (y % ROW_STEP === 0) {
      for (let x = 0; x + channels <= stride; x += COL_STEP) {
        let r, g, b;
        if (colour === 3) {
          // Palette image: the sample IS the index, so resolve it to RGB.
          const idx = line[x] * 3;
          r = palette[idx] ?? 0; g = palette[idx + 1] ?? 0; b = palette[idx + 2] ?? 0;
        } else if (channels < 3) {
          r = g = b = line[x];                 // greyscale
        } else {
          r = line[x]; g = line[x + 1]; b = line[x + 2];
        }
        // Quantise to 4 bits per channel: anti-aliased text would otherwise
        // register thousands of near-identical colours and mask a blank page.
        const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
        counts.set(key, (counts.get(key) || 0) + 1);
        sampled++;
      }
    }
    prev = line;
  }
  if (!sampled) return null;

  let top = 0;
  for (const n of counts.values()) if (n > top) top = n;
  return {
    width, height,
    distinctColours: counts.size,
    dominantShare: top / sampled,
    uniform: counts.size <= 2,
  };
}

const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex');

// ── Auth ─────────────────────────────────────────────────────────────────────
function fetchSession() {
  return new Promise(res => {
    if (!SHOT_EMAIL || !SHOT_PASSWORD || !SUPA_URL || !SUPA_ANON) return res(null);
    let u;
    try { u = new URL(`${SUPA_URL}/auth/v1/token?grant_type=password`); } catch { return res(null); }
    const body = Buffer.from(JSON.stringify({ email: SHOT_EMAIL, password: SHOT_PASSWORD }));
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPA_ANON,
        Authorization: 'Bearer ' + SUPA_ANON,
        'Content-Length': String(body.length),
      },
    }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => {
        try {
          const j = JSON.parse(d);
          if (j && j.access_token) return res(d);
          warn(`Supabase auth returned HTTP ${r.statusCode}: ${j.error_description || j.msg || j.error || 'no access_token'}`);
          res(null);
        } catch { res(null); }
      });
    });
    req.on('error', e => { warn(`Supabase auth request failed: ${e.message}`); res(null); });
    req.setTimeout(15000, () => { req.destroy(); warn('Supabase auth timed out'); res(null); });
    req.write(body); req.end();
  });
}

/** Plant the session using the same storage keys auth-bridge.js reads. */
function sessionInitScript(raw, ref) {
  return `(function(){try{
    var raw = ${JSON.stringify(raw)};
    var s = JSON.parse(raw);
    var tok = s.access_token || (s.session && s.session.access_token) || '';
    var rt  = s.refresh_token || (s.session && s.session.refresh_token) || '';
    localStorage.setItem('isotope-auth-token', raw);
    localStorage.setItem('sb-${ref}-auth-token', raw);
    localStorage.setItem('isotope-last-jwt', tok);
    localStorage.setItem('isotope-last-rt', rt);
    localStorage.setItem('isotope-last-session-raw', raw);
  }catch(e){}})();`;
}

/**
 * Demo mode needs a shim, and the reason is worth stating precisely.
 *
 * Demo mode is a single sessionStorage flag. `/demo` sets it, then immediately
 * calls location.replace('/dashboard'). But the server injects a guard into
 * every page's <head> that deletes that flag whenever the path is not `/demo`
 * (server.mjs:2389). So the redirect out of `/demo` is exactly what switches
 * demo mode back off. In a normal browser session the flag survives only
 * because the app reads it during the same tick the launcher runs; a fresh
 * navigation to /dashboard has no flag and falls through to the auth guard.
 *
 * Rather than fight that ordering, this makes the flag sticky for the duration
 * of the capture: set it, and make removeItem ignore that one key. Everything
 * else about Storage behaves normally. This is a test harness, and it is
 * confined to the capture process — no product code changes.
 */
const DEMO_INIT_SCRIPT = `(function(){try{
  var KEY = 'isotope-demo-mode';
  sessionStorage.setItem(KEY, '1');
  var proto = Object.getPrototypeOf(sessionStorage) || Storage.prototype;
  var realRemove = proto.removeItem;
  proto.removeItem = function(k){
    if (k === KEY) return;           // the server guard's delete is a no-op here
    return realRemove.apply(this, arguments);
  };
  var realClear = proto.clear;
  proto.clear = function(){
    var v = sessionStorage.getItem(KEY);
    realClear.apply(this, arguments);
    if (v !== null) realRemove.call(this, KEY) , proto.setItem.call(this, KEY, v);
  };
}catch(e){}})();`;

async function waitForAny(page, selectors, timeout = 12000) {
  const list = selectors.split(',').map(s => s.trim()).filter(Boolean);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      for (const sel of list) if (await page.$(sel)) return true;
    } catch { /* navigating; retry */ }
    await page.waitForTimeout(200);
  }
  return false;
}

/** Did we land where we asked, or did a guard bounce us to /auth? */
async function landedOn(page, expected) {
  try {
    const got = new URL(page.url()).pathname.replace(/\/+$/, '') || '/';
    const want = expected.replace(/\/+$/, '') || '/';
    return { ok: got === want, got };
  } catch { return { ok: true, got: expected }; }
}

async function healthCheck(url) {
  return new Promise(res => {
    const req = http.get(`${url}/api/health`, r => res(r.statusCode >= 200 && r.statusCode < 500));
    req.setTimeout(4000, () => { req.destroy(); res(false); });
    req.on('error', () => res(false));
  });
}

function compressPng(p) {
  try {
    execSync(`pngquant --force --quality=70-92 --output "${p}" "${p}"`, { stdio: 'ignore' });
    return true;
  } catch { return false; }
}

// ── Main ─────────────────────────────────────────────────────────────────────
const mode = LOGIN ? 'signed in' : DEMO ? 'demo workspace' : 'unauthenticated';

console.log(`\n${BOLD}IsotopeAI — Screenshot Capture${RESET}`);
console.log(`  Base URL : ${BASE_URL}`);
console.log(`  Output   : ${OUT_DIR}`);
console.log(`  Mode     : ${mode}`);
console.log(`  Scale    : ${SCALE}× (desktop shots ${DESKTOP.width * SCALE}×${DESKTOP.height * SCALE})`);
console.log('');

log('Checking server health…');
if (!await healthCheck(BASE_URL)) {
  fail(`Server not responding at ${BASE_URL}/api/health`);
  console.error('\n  Start it first:\n    isotope start\n  or:\n    node server.mjs\n');
  process.exit(1);
}
ok(`Server is up at ${BASE_URL}`);

mkdirSync(OUT_DIR, { recursive: true });

let sessionRaw = null, supaRef = '';
if (LOGIN) {
  sessionRaw = await fetchSession();
  if (sessionRaw) {
    try { supaRef = new URL(SUPA_URL).hostname.split('.')[0]; } catch {}
    ok(`Signed in as ${SHOT_EMAIL} (project ${supaRef})`);
  } else {
    // Not a warning to shrug at: without a session every gated route redirects
    // to /auth, and the whole gallery becomes twelve copies of the login page.
    // That is exactly how the three duplicate pairs got committed.
    fail('--login was requested but no session could be obtained.');
    fail('Every app route would redirect to /auth and produce identical screenshots.');
    console.error('\n  Need: SHOT_EMAIL, SHOT_PASSWORD, SUPABASE_URL, SUPABASE_ANON_KEY\n');
    process.exit(1);
  }
}
if (DEMO) ok('Demo mode — in-memory JEE fixtures, no account required');

const browser = await chromium.launch({ headless: true });
const manifest = {
  captured_at: new Date().toISOString(),
  base_url: BASE_URL,
  mode,
  scale: SCALE,
  screenshots: [],
};

const toCapture = ONLY ? ROUTES.filter(r => ONLY.includes(r.key)) : ROUTES;
let successCount = 0, failCount = 0;

for (const route of toCapture) {
  const context = await browser.newContext({
    viewport: route.viewport,
    deviceScaleFactor: SCALE,
    colorScheme: 'dark',
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    // Deterministic output: a blinking caret or a mid-flight transition changes
    // bytes between otherwise identical runs, which would defeat the duplicate
    // detection below by producing false differences.
    reducedMotion: 'reduce',
  });

  if (sessionRaw && supaRef) await context.addInitScript(sessionInitScript(sessionRaw, supaRef));
  if (DEMO) await context.addInitScript(DEMO_INIT_SCRIPT);

  const page = await context.newPage();
  page.on('console', () => {});
  page.on('pageerror', () => {});

  const url = `${BASE_URL}${route.path}`;
  const dims = `${route.viewport.width * SCALE}×${route.viewport.height * SCALE}`;
  log(`${route.key} → ${route.file} @ ${dims}${route.fullPage ? ' (full page)' : ''}`);

  const outPath = join(OUT_DIR, route.file);
  const record = {
    key: route.key, file: route.file, path: `screenshots/${route.file}`,
    description: route.description, viewport: route.viewport, scale: SCALE, url,
  };

  try {
    // In demo mode, enter through /demo so the launcher seeds its fixtures,
    // then navigate on. The sticky-flag shim is what lets the flag survive it.
    if (DEMO && !route.public) {
      await page.goto(`${BASE_URL}/demo`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1200);
    }

    const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    if (!response) throw new Error(`no response from ${url}`);
    if (response.status() >= 500) throw new Error(`HTTP ${response.status()} on ${url}`);

    await page.waitForTimeout(700);                       // client router settles
    await waitForAny(page, route.waitFor, 12000);

    // Network idle matters for charts and avatars; not fatal if it never fires.
    try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch {}
    await page.waitForTimeout(900);                       // chart paint

    const where = await landedOn(page, route.path);
    if (!where.ok) {
      // A redirect to /auth means the session did not take. Fail the route
      // rather than save a login page under a dashboard filename.
      throw new Error(`redirected to ${where.got} (expected ${route.path}) — session not accepted`);
    }

    await page.screenshot({ path: outPath, fullPage: !!route.fullPage, animations: 'disabled' });

    const info = inspectPng(outPath);
    if (info) {
      record.dimensions = `${info.width}x${info.height}`;
      record.distinct_colours = info.distinctColours;
      record.dominant_share = Number(info.dominantShare.toFixed(4));
      if (info.uniform || info.dominantShare > 0.985) {
        throw new Error(`blank frame — ${(info.dominantShare * 100).toFixed(1)}% one colour, ${info.distinctColours} distinct`);
      }
    }

    if (COMPRESS && !compressPng(outPath)) {
      warn('pngquant not found — skipping compression (apt install pngquant)');
    }

    record.sha256 = sha256(outPath);
    record.status = 'captured';
    ok(`${route.file} — ${route.description}`);
    successCount++;
  } catch (err) {
    record.status = 'failed';
    record.error = err.message;
    fail(`${route.file} — ${err.message}`);
    failCount++;
  } finally {
    manifest.screenshots.push(record);
    await context.close();
  }
}

await browser.close();

// ── Duplicate detection ──────────────────────────────────────────────────────
// This is the check whose absence let `analytics.png` and `tasks.png` ship as
// the same bytes while both claimed to be captured. Distinct routes producing
// identical pixels means they rendered the same thing — a shared empty state, a
// login wall, or a route that silently no-ops.
const byHash = new Map();
for (const s of manifest.screenshots) {
  if (s.status !== 'captured' || !s.sha256) continue;
  if (!byHash.has(s.sha256)) byHash.set(s.sha256, []);
  byHash.get(s.sha256).push(s.key);
}
const dupes = [...byHash.values()].filter(g => g.length > 1);
if (dupes.length) {
  console.log('');
  fail(`${dupes.length} set(s) of byte-identical screenshots:`);
  for (const g of dupes) {
    fail(`  ${g.join(' = ')}`);
    for (const s of manifest.screenshots) {
      if (g.includes(s.key)) { s.status = 'duplicate'; s.duplicate_of = g.filter(k => k !== s.key); }
    }
  }
  fail('Distinct routes rendered identical pixels — they are not showing what they claim.');
}

manifest.duplicate_groups = dupes;
writeFileSync(join(OUT_DIR, 'screenshot-manifest.json'), JSON.stringify(manifest, null, 2));
log(`Manifest written to ${join(OUT_DIR, 'screenshot-manifest.json')}`);

console.log('');
console.log(`${BOLD}Results:${RESET}`);
console.log(`  ${GREEN}✅ ${successCount} captured${RESET}`);
if (failCount) console.log(`  ${RED}❌ ${failCount} failed${RESET}`);
if (dupes.length) console.log(`  ${RED}❌ ${dupes.length} duplicate group(s)${RESET}`);

if ((failCount || dupes.length) && !ALLOW_BLANK) {
  console.log('');
  console.log('  Signed-out routes redirect to /auth and all look alike — pass --login.');
  console.log('  For fixtures without an account, pass --demo instead.');
  process.exit(1);
}

console.log(`\nSaved to ${OUT_DIR}/`);
