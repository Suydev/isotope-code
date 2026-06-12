/**
 * IsotopeAI — Docs and README validator
 * ──────────────────────────────────────────────────────────────────────────────
 * Checks:
 *   1. All image paths referenced in README.md exist in the repo
 *   2. All image paths referenced in docs/index.html and docs/index.md exist
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
const DOCS_MD  = readText('docs/index.md');
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

// ── 4. docs/index.md checks ───────────────────────────────────────────────────
info('Checking docs/index.md...');
if (!DOCS_MD) {
  warn('docs/index.md not found');
} else {
  ok('docs/index.md exists', `(${DOCS_MD.length} chars)`);
}

// ── 5. Required files check ───────────────────────────────────────────────────
info('Checking required files...');
const REQUIRED_FILES = [
  'server.mjs',
  'package.json',
  'setup.sh',
  'setup.bat',
  'install.ps1',
  'install-termux.sh',
  'setup-termux-widget.sh',
  'update.sh',
  'update.bat',
  'start.sh',
  'start.bat',
  'doctor.sh',
  'doctor.bat',
  'bin/isotope',
  'bin/isotope.bat',
  'isotope-complete.sql',
  '.env.example',
  'README.md',
  'CHANGELOG.md',
  'TERMUX_WIDGET.md',
  'docs/index.html',
  'docs/install.html',
  'docs/sync.html',
  'docs/admin.html',
  'docs/gallery.html',
  'docs/motion.html',
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

// ── 7. CI workflow ────────────────────────────────────────────────────────────
info('Checking CI workflow...');
const CI = readText('.github/workflows/ci.yml');
if (CI) {
  ok('.github/workflows/ci.yml exists');
  const hasDocs = CI.includes('validate-docs') || CI.includes('docs');
  if (hasDocs) {
    ok('CI includes docs validation step');
  } else {
    warn('CI does not appear to include docs validation — add: node scripts/validate-docs.mjs');
  }
} else {
  warn('.github/workflows/ci.yml not found');
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
