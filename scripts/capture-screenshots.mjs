/**
 * IsotopeAI — Playwright screenshot capture
 * ──────────────────────────────────────────────────────────────────────────────
 * Usage:
 *   node scripts/capture-screenshots.mjs [--server=URL] [--out=DIR] [--compress]
 *
 * Prerequisites:
 *   npm install -D playwright
 *   npx playwright install chromium
 *
 * The script expects the local IsotopeAI server to be running.
 * Start it first:  isotope start   (or  node server.mjs)
 *
 * Options:
 *   --server=URL     Base URL (default: http://127.0.0.1:3000)
 *   --out=DIR        Output directory (default: screenshots/)
 *   --compress       Compress PNGs with pngquant after capture (if available)
 *   --routes=a,b,c   Capture only these route keys
 *   --demo           Seed demo data before capturing (loads ?demo=1)
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

// ── Config from CLI args ─────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...v] = a.slice(2).split('=');
      return [k, v.length ? v.join('=') : true];
    })
);

const BASE_URL = args.server || process.env.ISOTOPE_URL || 'http://127.0.0.1:3000';
const OUT_DIR  = resolve(args.out || 'screenshots');
const COMPRESS = !!args.compress;
const DEMO     = !!args.demo;
const ONLY     = args.routes ? args.routes.split(',') : null;

// ── Viewport sizes ───────────────────────────────────────────────────────────
const DESKTOP = { width: 1440, height: 1000 };
const MOBILE  = { width: 390,  height: 844 };

// ── Routes to capture ────────────────────────────────────────────────────────
const ROUTES = [
  {
    key: 'hero-dashboard',
    path: '/',
    file: 'hero-dashboard.png',
    viewport: DESKTOP,
    waitFor: '.dashboard, [data-testid="dashboard"], .focus-timer, main',
    description: 'Main dashboard with stats, streak, timer',
  },
  {
    key: 'focus-timer',
    path: '/focus',
    file: 'focus-timer.png',
    viewport: DESKTOP,
    waitFor: '.timer, [data-testid="focus"], [class*="timer"], main',
    description: 'Focus timer with subject/task selected',
  },
  {
    key: 'analytics',
    path: '/analytics',
    file: 'analytics.png',
    viewport: DESKTOP,
    waitFor: '.analytics, [class*="analytics"], canvas, main',
    description: 'Analytics charts — weekly hours, subject breakdown',
  },
  {
    key: 'syllabus',
    path: '/syllabus',
    file: 'syllabus.png',
    viewport: DESKTOP,
    waitFor: '.syllabus, [class*="syllabus"], main',
    description: 'Syllabus progress with chapter breakdown',
  },
  {
    key: 'tasks',
    path: '/tasks',
    file: 'tasks.png',
    viewport: DESKTOP,
    waitFor: '.tasks, [class*="task"], main',
    description: 'Task manager with priorities and due dates',
  },
  {
    key: 'exams',
    path: '/exams',
    file: 'exams.png',
    viewport: DESKTOP,
    waitFor: '.exams, [class*="exam"], main',
    description: 'Exam countdown and mock test analytics',
  },
  {
    key: 'community',
    path: '/community',
    file: 'community.png',
    viewport: DESKTOP,
    waitFor: '.community, [class*="community"], main',
    description: 'Groups, leaderboard, challenges',
  },
  {
    key: 'settings-sync',
    path: '/settings',
    file: 'settings-sync.png',
    viewport: DESKTOP,
    waitFor: '.settings, [class*="settings"], main',
    description: 'Cloud sync status and profile settings',
  },
  {
    key: 'mobile-dashboard',
    path: '/',
    file: 'mobile-dashboard.png',
    viewport: MOBILE,
    waitFor: 'main, .dashboard, [class*="dash"]',
    description: 'Mobile responsive dashboard',
  },
  {
    key: 'mobile-focus',
    path: '/focus',
    file: 'mobile-focus.png',
    viewport: MOBILE,
    waitFor: 'main, .timer, [class*="timer"]',
    description: 'Mobile focus timer',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const RESET = '\x1b[0m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';

function log(msg)  { console.log(`${CYAN}  →${RESET} ${msg}`); }
function ok(msg)   { console.log(`${GREEN}  ✅ ${msg}${RESET}`); }
function fail(msg) { console.error(`${RED}  ❌ ${msg}${RESET}`); }
function warn(msg) { console.warn(`${YELLOW}  ⚠️  ${msg}${RESET}`); }

async function waitForSelector(page, selectors, timeout = 8000) {
  const list = selectors.split(',').map(s => s.trim());
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const sel of list) {
      const el = await page.$(sel);
      if (el) return true;
    }
    await page.waitForTimeout(200);
  }
  return false;
}

async function isBlankPage(page) {
  return await page.evaluate(() => {
    const body = document.body;
    if (!body) return true;
    const text = (body.innerText || '').trim();
    const imgs = document.querySelectorAll('img').length;
    const visible = document.querySelectorAll('[class], div, section, main').length;
    return text.length < 30 && imgs === 0 && visible < 5;
  });
}

async function isMainlyWhite(page, file) {
  // Rough check: if screenshot is > 90% white pixels, warn
  // This is a heuristic — a full pixel comparison would require canvas access
  const pixel = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 20; canvas.height = 20;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    ctx.fillStyle = bodyBg || '#fff';
    ctx.fillRect(0, 0, 20, 20);
    const d = ctx.getImageData(0, 0, 20, 20).data;
    let bright = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 230 && d[i+1] > 230 && d[i+2] > 230) bright++;
    }
    return bright / 400;
  });
  if (pixel !== null && pixel > 0.9) {
    warn(`${file} may be mostly white (ratio: ${pixel.toFixed(2)}) — check manually`);
    return true;
  }
  return false;
}

async function healthCheck(url) {
  try {
    const { default: http } = await import('http');
    return new Promise(resolve => {
      const req = http.get(`${url}/api/health`, res => {
        resolve(res.statusCode >= 200 && res.statusCode < 500);
      });
      req.setTimeout(3000, () => { req.destroy(); resolve(false); });
      req.on('error', () => resolve(false));
    });
  } catch {
    return false;
  }
}

function compressPng(filePath) {
  try {
    execSync(`pngquant --force --quality=65-90 --output "${filePath}" "${filePath}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
const results = [];
const manifest = { captured_at: new Date().toISOString(), base_url: BASE_URL, screenshots: [] };

console.log(`\n${BOLD}IsotopeAI — Screenshot Capture${RESET}`);
console.log(`  Base URL : ${BASE_URL}`);
console.log(`  Output   : ${OUT_DIR}`);
console.log(`  Compress : ${COMPRESS}`);
console.log(`  Demo mode: ${DEMO}`);
console.log('');

// Health check
log('Checking server health...');
const healthy = await healthCheck(BASE_URL);
if (!healthy) {
  fail(`Server not responding at ${BASE_URL}/api/health`);
  console.error(`\n  Start the server first:\n    isotope start\n  or:\n    node server.mjs\n`);
  process.exit(1);
}
ok(`Server is up at ${BASE_URL}`);

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });

let successCount = 0;
let failCount = 0;
const toCapture = ONLY ? ROUTES.filter(r => ONLY.includes(r.key)) : ROUTES;

for (const route of toCapture) {
  const context = await browser.newContext({
    viewport: route.viewport,
    deviceScaleFactor: 2, // retina quality
    colorScheme: 'dark',
    locale: 'en-IN',
  });
  const page = await context.newPage();

  // Suppress console noise
  page.on('console', () => {});
  page.on('pageerror', () => {});

  const url = DEMO
    ? `${BASE_URL}${route.path}${route.path.includes('?') ? '&' : '?'}demo=1`
    : `${BASE_URL}${route.path}`;

  log(`Capturing: ${route.key} (${route.file}) @ ${route.viewport.width}×${route.viewport.height}`);

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    if (!response || response.status() >= 500) {
      throw new Error(`HTTP ${response?.status()} on ${url}`);
    }

    // Wait for meaningful content
    await waitForSelector(page, route.waitFor, 8000);
    await page.waitForTimeout(1500); // allow animations/charts to render

    // Blank page check
    const blank = await isBlankPage(page);
    if (blank) {
      warn(`${route.file} — page appears blank or empty. The route may require auth.`);
    }

    const outPath = join(OUT_DIR, route.file);
    await page.screenshot({ path: outPath, fullPage: false });

    await isMainlyWhite(page, route.file);

    if (COMPRESS) {
      const compressed = compressPng(outPath);
      if (!compressed) warn(`pngquant not found — install it for compression: apt install pngquant`);
    }

    ok(`${route.file} — ${route.description}`);
    successCount++;

    manifest.screenshots.push({
      key: route.key,
      file: route.file,
      path: `screenshots/${route.file}`,
      description: route.description,
      viewport: route.viewport,
      url,
      status: 'captured',
    });
  } catch (err) {
    fail(`${route.file} — ${err.message}`);
    failCount++;

    manifest.screenshots.push({
      key: route.key,
      file: route.file,
      description: route.description,
      status: 'failed',
      error: err.message,
    });
  } finally {
    await context.close();
  }
}

await browser.close();

// Write manifest
const manifestPath = join(OUT_DIR, 'screenshot-manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
log(`Manifest written to: ${manifestPath}`);

console.log('');
console.log(`${BOLD}Results:${RESET}`);
console.log(`  ${GREEN}✅ ${successCount} captured${RESET}`);
if (failCount > 0) console.log(`  ${RED}❌ ${failCount} failed${RESET}`);

if (failCount > 0) {
  console.log(`\nFailed routes often require authentication.`);
  console.log(`Seed demo data first: npm run demo:seed`);
  console.log(`Then re-run with --demo flag.`);
  process.exit(1);
}

console.log(`\nAll screenshots saved to: ${OUT_DIR}/`);
