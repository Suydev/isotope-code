#!/usr/bin/env node
/**
 * prepare-www.js
 *
 * Builds www/ for the Capacitor Android APK.
 *
 * Source layout in isotope-code:
 *   <root>/index.html        ← entry point (at REPO root, NOT in public/)
 *   <root>/public/           ← all static assets (assets/, fonts/, icons/, sounds/, sync/, etc.)
 *
 * Target layout in www/:
 *   www/index.html           ← from repo root
 *   www/assets/              ← built JS/CSS bundles (from public/assets/)
 *   www/fonts/               ← fonts (from public/fonts/)
 *   www/icons/               ← icons (from public/icons/)
 *   www/sounds/              ← audio files (from public/sounds/)
 *   www/sync/                ← backup-normalizer.js, local-data-adapter.js
 *   www/android-bridge.js    ← injected by this script (first script in <head>)
 *   www/android-floating-timer-bridge.js ← Android overlay timer bridge
 *   www/auth-bridge.js       ← from public/
 *   www/boot-recovery.js     ← from public/
 *   ... etc.
 *
 * Env vars:
 *   REPO_DIR     = path to cloned isotope-code repo root   (contains index.html + public/)
 *   SOURCE_DIR   = path to isotope-code/public/            (default: REPO_DIR/public)
 *   WWW_DIR      = path to output www/ directory           (default: ../www)
 *   BRIDGE_FILE  = path to android-bridge.js               (default: ../android-bridge.js)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const REPO_DIR    = process.env.REPO_DIR    || path.resolve(__dirname, '../../isotope-code');
const SOURCE_DIR  = process.env.SOURCE_DIR  || path.join(REPO_DIR, 'public');
const WWW_DIR     = process.env.WWW_DIR     || path.resolve(__dirname, '../www');
const BRIDGE_FILE = process.env.BRIDGE_FILE || path.resolve(__dirname, '../android-bridge.js');
const FLOATING_TIMER_BRIDGE_FILE = process.env.FLOATING_TIMER_BRIDGE_FILE || path.resolve(__dirname, '../android-floating-timer-bridge.js');

console.log('=== prepare-www.js ===');
console.log('REPO_DIR   :', REPO_DIR);
console.log('SOURCE_DIR :', SOURCE_DIR);
console.log('WWW_DIR    :', WWW_DIR);
console.log('BRIDGE_FILE:', BRIDGE_FILE);
console.log('');

// ── Validate inputs ───────────────────────────────────────────────────────────

const rootIndexPath = path.join(REPO_DIR, 'index.html');

if (!fs.existsSync(REPO_DIR)) {
  console.error('ERROR: REPO_DIR not found:', REPO_DIR);
  console.error('  → Set REPO_DIR to the root of the cloned isotope-code repo.');
  process.exit(1);
}

if (!fs.existsSync(rootIndexPath)) {
  console.error('ERROR: index.html not found at repo root:', rootIndexPath);
  console.error('  → isotope-code has index.html at the REPO ROOT, not inside public/.');
  console.error('  → Ensure REPO_DIR points to the repo root (not public/).');
  process.exit(1);
}

if (!fs.existsSync(SOURCE_DIR)) {
  console.error('ERROR: SOURCE_DIR (public/) not found:', SOURCE_DIR);
  process.exit(1);
}

if (!fs.existsSync(BRIDGE_FILE)) {
  console.error('ERROR: android-bridge.js not found:', BRIDGE_FILE);
  process.exit(1);
}

if (!fs.existsSync(FLOATING_TIMER_BRIDGE_FILE)) {
  console.error('ERROR: android-floating-timer-bridge.js not found:', FLOATING_TIMER_BRIDGE_FILE);
  process.exit(1);
}

// ── 1. Clean www/ ─────────────────────────────────────────────────────────────

console.log('Step 1: Cleaning www/ ...');
if (fs.existsSync(WWW_DIR)) {
  fs.rmSync(WWW_DIR, { recursive: true, force: true });
}
fs.mkdirSync(WWW_DIR, { recursive: true });
console.log('  ✓ www/ cleaned and recreated');

// ── 2. Copy public/ contents → www/ ──────────────────────────────────────────
//    (assets/, fonts/, icons/, sounds/, sync/, auth-bridge.js, sw.js, etc.)

console.log('\nStep 2: Copying public/ contents → www/ ...');
copyDirSync(SOURCE_DIR, WWW_DIR);
const publicFiles = countFiles(WWW_DIR);
console.log(`  ✓ Copied ${publicFiles} files from public/`);

// ── 3. Copy root index.html → www/index.html ─────────────────────────────────
//    NOTE: index.html lives at the REPO ROOT in isotope-code, not in public/.
//    This is the Vite entry point that references /assets/*.js and /assets/*.css.

console.log('\nStep 3: Copying root index.html → www/index.html ...');
const indexDest = path.join(WWW_DIR, 'index.html');

// Sanity: if public/ somehow had an index.html already, warn
if (fs.existsSync(indexDest)) {
  console.warn('  WARN: index.html already existed from public/ — overwriting with repo root version');
}
fs.copyFileSync(rootIndexPath, indexDest);
console.log('  ✓ index.html copied from repo root');

// ── 4. Copy android-bridge.js → www/android-bridge.js ────────────────────────

console.log('\nStep 4: Copying android-bridge.js into www/ ...');
const bridgeDest = path.join(WWW_DIR, 'android-bridge.js');
fs.copyFileSync(BRIDGE_FILE, bridgeDest);
console.log('  ✓ android-bridge.js copied to www/');
const floatingTimerBridgeDest = path.join(WWW_DIR, 'android-floating-timer-bridge.js');
fs.copyFileSync(FLOATING_TIMER_BRIDGE_FILE, floatingTimerBridgeDest);
console.log('  ✓ android-floating-timer-bridge.js copied to www/');

// ── 5. Patch index.html ───────────────────────────────────────────────────────
//    a) Inject android-bridge.js as VERY FIRST script (before auth-bridge.js)
//    b) Disable pwa-local.js (SW registration — Capacitor serves locally)
//    c) Disable update-checker.js (polls GitHub — irrelevant in APK)
//    d) Fix viewport for Android safe-areas

console.log('\nStep 5: Patching index.html ...');
let html = fs.readFileSync(indexDest, 'utf8');

// 5a. Inject android-bridge.js as first child of <head>
const bridgeScriptTag = '<script src="/android-bridge.js"></script>';
const floatingTimerBridgeScriptTag = '<script src="/android-floating-timer-bridge.js"></script>';
if (!html.includes('android-bridge.js')) {
  html = html.replace(/<head>/i, '<head>\n    ' + bridgeScriptTag);
  console.log('  ✓ android-bridge.js injected as first script in <head>');
} else {
  console.log('  ○ android-bridge.js already present in index.html');
}


if (!html.includes('android-floating-timer-bridge.js')) {
  html = html.replace(bridgeScriptTag, bridgeScriptTag + '\n    ' + floatingTimerBridgeScriptTag);
  console.log('  ✓ android-floating-timer-bridge.js injected immediately after android-bridge.js');
} else {
  console.log('  ○ android-floating-timer-bridge.js already present in index.html');
}
// 5b. Disable pwa-local.js (SW registration causes stale-asset loops in Capacitor)
if (html.includes('/pwa-local.js')) {
  html = html.replace(
    /<script[^>]+src="\/pwa-local\.js"[^>]*><\/script>/,
    '<!-- pwa-local.js disabled in Android APK (Capacitor serves assets locally) -->'
  );
  console.log('  ✓ pwa-local.js disabled');
} else {
  console.log('  ○ pwa-local.js not found in index.html (already removed)');
}

// 5c. Disable update-checker.js (GitHub polling not relevant in APK)
if (html.includes('/update-checker.js')) {
  html = html.replace(
    /<script[^>]+src="\/update-checker\.js"[^>]*><\/script>/,
    '<!-- update-checker.js disabled in Android APK -->'
  );
  console.log('  ✓ update-checker.js disabled');
} else {
  console.log('  ○ update-checker.js not found in index.html (already removed)');
}

// 5d. Fix viewport for Android (add viewport-fit=cover for notch/safe-area support)
if (html.includes('initial-scale=1.0"') && !html.includes('viewport-fit=cover')) {
  html = html.replace(
    'initial-scale=1.0"',
    'initial-scale=1.0, viewport-fit=cover"'
  );
  console.log('  ✓ viewport-fit=cover added');
}

// 5e. Remove browser/PWA install affordances from the native Android shell.
// Capacitor is the app container; Android builds must not expose web-app install
// metadata that makes the runtime behave like a PWA inside a WebView.
html = replaceOptional(html, /<link\s+rel="manifest"\s+href="\/manifest\.webmanifest"\s*>\s*/i, '', 'manifest.webmanifest link');
html = replaceOptional(html, /<meta\s+name="apple-mobile-web-app-capable"\s+content="yes"\s*\/>\s*/i, '', 'apple PWA capable meta');
html = replaceOptional(html, /<meta\s+name="apple-mobile-web-app-status-bar-style"\s+content="[^"]*"\s*\/>\s*/i, '', 'apple PWA status-bar meta');
html = replaceOptional(html, /<meta\s+name="apple-mobile-web-app-title"\s+content="[^"]*"\s*\/>\s*/i, '', 'apple PWA title meta');
html = replaceOptional(html, /<meta\s+name="mobile-web-app-capable"\s+content="yes"\s*\/>\s*/i, '', 'mobile web-app capable meta');

// 5f. Persistent loading screen — isotope-code ships `<div id="root"></div>` with
// NO inline splash markup, so on native Android (no browser chrome, no address
// bar loading indicator) users can see a completely blank/white screen during:
//   - initial WebView boot + bridge script execution
//   - Supabase auth bootstrap / session restore
//   - React bundle parse + first paint
//   - route transitions before lazy chunks resolve
// This inline splash is pure HTML/CSS with zero JS dependencies, so it paints
// before ANY script (even android-bridge.js) executes. It is removed by a tiny
// inline script once the real app has painted content into #root (MutationObserver
// on #root, plus a hard timeout fallback so it can never get stuck forever).
if (!html.includes('id="isotope-boot-splash"')) {
  const splashMarkup = [
    '    <style id="isotope-boot-splash-style">',
    '      html, body { background: #0a0a0a; }',
    '      #isotope-boot-splash {',
    '        position: fixed; inset: 0; z-index: 2147483647;',
    '        display: flex; flex-direction: column; align-items: center; justify-content: center;',
    '        gap: 16px; background: #0a0a0a;',
    '        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;',
    '        transition: opacity 0.35s ease;',
    '      }',
    '      #isotope-boot-splash.isotope-boot-splash--hidden {',
    '        opacity: 0; pointer-events: none;',
    '      }',
    '      #isotope-boot-splash .isotope-boot-splash__logo {',
    '        width: 64px; height: 64px; border-radius: 18px;',
    '        background: linear-gradient(135deg, #f97316, #fb923c);',
    '        display: flex; align-items: center; justify-content: center;',
    '        font-size: 30px; font-weight: 800; color: #fff;',
    '        box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35);',
    '        animation: isotope-boot-pulse 1.6s ease-in-out infinite;',
    '      }',
    '      #isotope-boot-splash .isotope-boot-splash__title {',
    '        color: #fff; font-size: 15px; font-weight: 700; letter-spacing: 0.01em;',
    '      }',
    '      #isotope-boot-splash .isotope-boot-splash__spinner {',
    '        width: 28px; height: 28px; border-radius: 50%;',
    '        border: 3px solid rgba(255,255,255,0.12); border-top-color: #f97316;',
    '        animation: isotope-boot-spin 0.8s linear infinite;',
    '      }',
    '      @keyframes isotope-boot-spin { to { transform: rotate(360deg); } }',
    '      @keyframes isotope-boot-pulse {',
    '        0%, 100% { transform: scale(1); }',
    '        50% { transform: scale(1.06); }',
    '      }',
    '    </style>',
    '    <script id="isotope-boot-splash-script">',
    '      (function () {',
    '        try {',
    '          function removeSplash() {',
    '            var el = document.getElementById("isotope-boot-splash");',
    '            if (!el) return;',
    '            el.classList.add("isotope-boot-splash--hidden");',
    '            setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 400);',
    '          }',
    '          window.__isoRemoveBootSplash = removeSplash;',
    '          document.addEventListener("DOMContentLoaded", function () {',
    '            var root = document.getElementById("root");',
    '            if (!root) return;',
    '            if (root.childNodes.length > 0) { removeSplash(); return; }',
    '            var observer = new MutationObserver(function () {',
    '              if (root.childNodes.length > 0) {',
    '                observer.disconnect();',
    '                removeSplash();',
    '              }',
    '            });',
    '            observer.observe(root, { childList: true });',
    '          });',
    '          // Hard fallback: never let the splash block the app forever, even if',
    '          // React fails to mount (e.g. a runtime error before first render).',
    '          setTimeout(removeSplash, 12000);',
    '        } catch (e) {',
    '          var el = document.getElementById("isotope-boot-splash");',
    '          if (el && el.parentNode) el.parentNode.removeChild(el);',
    '        }',
    '      })();',
    '    </script>',
  ].join('\n');
  html = html.replace(/<head>/i, '<head>\n' + splashMarkup);

  const splashBody = [
    '  <div id="isotope-boot-splash">',
    '    <div class="isotope-boot-splash__logo">I</div>',
    '    <div class="isotope-boot-splash__title">IsotopeAI</div>',
    '    <div class="isotope-boot-splash__spinner"></div>',
    '  </div>',
  ].join('\n');
  html = html.replace(/<div id="root"><\/div>/, '<div id="root"></div>\n' + splashBody);
  console.log('  ✓ Persistent boot splash screen injected (removed on first React paint, 12s hard fallback)');
} else {
  console.log('  ○ Boot splash already present in index.html');
}

fs.writeFileSync(indexDest, html, 'utf8');
console.log('  ✓ index.html patched');

// ── 5e. Patch authored runtime bootstrap logic ──────────────────────────────
// Keep this in prepare-www because restore-and-launch.js is authored runtime JS
// copied from isotope-code/public/, not a minified hashed chunk.
console.log('\nStep 5e: Patching restore-and-launch.js bootstrap contract ...');
const restoreLaunchPath = path.join(WWW_DIR, 'restore-and-launch.js');
if (fs.existsSync(restoreLaunchPath)) {
  let restoreJs = fs.readFileSync(restoreLaunchPath, 'utf8');
  restoreJs = replaceExactlyOnce(
    restoreJs,
    '  const profile = snapshot.profile_data || snapshot.profile || {};\n',
    [
      '  const completed =',
      "    typeof snapshot?.onboarding?.completed === 'boolean'",
      '      ? snapshot.onboarding.completed',
      "      : (typeof snapshot.onboarding_completed === 'boolean' ? snapshot.onboarding_completed : undefined);",
      '  const canonicalOnboarding = typeof completed === \'boolean\'',
      '    ? {',
      '        ...(isObject(snapshot.onboarding) ? snapshot.onboarding : {}),',
      "        state: completed ? 'completed' : 'incomplete',",
      '        completed,',
      '        completed_at: snapshot.onboarding?.completed_at || snapshot.onboarding_completed_at || null,',
      '        data: isObject(snapshot.onboarding?.data) ? snapshot.onboarding.data : {},',
      '      }',
      '    : snapshot.onboarding;',
      '  const profile = snapshot.profile_data || snapshot.profile || {};',
      ''
    ].join('\n'),
    'restore-and-launch legacy onboarding fallback'
  );
  restoreJs = replaceExactlyOnce(
    restoreJs,
    '    onboarding: snapshot.onboarding,\n',
    '    onboarding: canonicalOnboarding,\n',
    'restore-and-launch canonical onboarding write'
  );
  restoreJs = replaceExactlyOnce(
    restoreJs,
    [
      '  const onboarded = cloudSnapshot',
      '    ? cloudSnapshot.onboarding.completed === true',
      '    : snapshot.onboarding && snapshot.onboarding.completed === true;',
      '  if (onboarded) writeLocalOnboardingComplete();',
      '  else localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);',
      ''
    ].join('\n'),
    [
      '  const onboarded = cloudSnapshot',
      '    ? cloudSnapshot.onboarding.completed === true',
      '    : (typeof completed === \'boolean\' ? completed : undefined);',
      '  if (onboarded === true) writeLocalOnboardingComplete();',
      '  else if (onboarded === false) localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);',
      ''
    ].join('\n'),
    'restore-and-launch unknown onboarding preservation'
  );
  restoreJs = replaceExactlyOnce(
    restoreJs,
    '    if (dbResult !== null) {\n',
    "    if (dbResult !== null && typeof dbResult.isOnboarded === 'boolean') {\n",
    'restore-and-launch boot decision boolean guard'
  );
  restoreJs = replaceExactlyOnce(
    restoreJs,
    "    else window.history.replaceState(null, '', '/onboarding'); // unknown state → onboarding (safe default)\n",
    "    // Unknown cloud state stays unresolved; do not assume dashboard or onboarding.\n",
    'restore-and-launch no unknown onboarding fallback'
  );
  restoreJs = replaceExactlyOnce(
    restoreJs,
    "  } else if (session && bootDecision?.state === BOOT_STATES.SYNC_FAILED && (isOnboardingPath || isAuthPath)) {\n    window.history.replaceState(null, '', '/dashboard');\n",
    "  } else if (session && bootDecision?.state === BOOT_STATES.SYNC_FAILED && (isOnboardingPath || isAuthPath)) {\n    // Preserve current route so the app can show retry/loading instead of guessing.\n",
    'restore-and-launch no sync-failed dashboard fallback'
  );
  fs.writeFileSync(restoreLaunchPath, restoreJs, 'utf8');
  console.log('  ✓ restore-and-launch.js patched for canonical/legacy bootstrap responses');
} else {
  console.error('  ✗ restore-and-launch.js missing from www/');
  process.exit(1);
}

// ── 6. Replace sw.js with a no-op ────────────────────────────────────────────
//    Capacitor serves all assets from its local file server.
//    A real SW would intercept requests and serve stale cached versions,
//    causing confusion. Replace it with a no-op SW.

console.log('\nStep 6: Replacing sw.js with Capacitor no-op ...');
const swPath = path.join(WWW_DIR, 'sw.js');
if (fs.existsSync(swPath)) {
  fs.writeFileSync(swPath, [
    '/* IsotopeAI sw.js — disabled in Capacitor/Android APK.',
    ' * Capacitor bundles all assets locally; no SW caching needed.',
    ' * This no-op prevents 404s from existing SW registrations.',
    ' */',
    "self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));",
    "self.addEventListener('activate', e => e.waitUntil(clients.claim()));",
    "self.addEventListener('fetch', () => {});",
  ].join('\n'), 'utf8');
  console.log('  ✓ sw.js replaced with no-op');
} else {
  console.log('  ○ sw.js not present (skipped)');
}

// Also remove workbox file if present (not needed in APK)
const workboxFiles = fs.readdirSync(WWW_DIR).filter(f => f.startsWith('workbox-'));
workboxFiles.forEach(f => {
  fs.writeFileSync(path.join(WWW_DIR, f), '/* workbox disabled in Android APK */', 'utf8');
});
if (workboxFiles.length) console.log(`  ✓ Neutered ${workboxFiles.length} workbox file(s)`);

// ── 6b. Repair KaTeX font assets ────────────────────────────────────────────
// The pinned isotope-code bundle includes KaTeX CSS/JS, but the CSS references
// several hashed font filenames that are absent from public/assets/. Copy those
// exact target names from the pinned katex npm package so offline Android math
// rendering has every declared font.

console.log('\nStep 6b: Verifying KaTeX font assets ...');
repairKatexFontAssets(path.join(WWW_DIR, 'assets'));

// ── 6c. Prune browser/PWA-only artifacts ────────────────────────────────────
// These files are useful on the source website, but they are not runtime inputs
// for the native Android shell after the service worker, web manifest and update
// checker have been disabled above.

console.log('\nStep 6c: Pruning Android-unused web artifacts ...');
pruneAndroidWebOnlyArtifacts(WWW_DIR);

// ── 7. Verify critical files are present ─────────────────────────────────────

console.log('\nStep 7: Verifying critical files ...');
const critical = [
  'index.html',
  'android-bridge.js',
  'auth-bridge.js',
  'assets',
];
let allOk = true;
for (const f of critical) {
  const p = path.join(WWW_DIR, f);
  if (fs.existsSync(p)) {
    console.log(`  ✓ www/${f}`);
  } else {
    console.error(`  ✗ MISSING: www/${f}`);
    allOk = false;
  }
}
if (!allOk) {
  console.error('\nERROR: Critical files missing from www/. Aborting.');
  process.exit(1);
}

// Verify index.html has android-bridge injection
const finalHtml = fs.readFileSync(indexDest, 'utf8');
if (!finalHtml.includes('android-bridge.js')) {
  console.error('  ✗ android-bridge.js NOT found in index.html after patching!');
  process.exit(1);
}
console.log('  ✓ android-bridge.js confirmed in index.html');

// Verify assets/ has actual JS bundles
const assetsDir = path.join(WWW_DIR, 'assets');
const jsBundles = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'))
  : [];
if (jsBundles.length === 0) {
  console.error('  ✗ No .js bundles found in www/assets/ !');
  process.exit(1);
}
console.log(`  ✓ www/assets/ has ${jsBundles.length} JS bundles`);

// ── 8. Report sizes ───────────────────────────────────────────────────────────

console.log('\nStep 8: Size report ...');
const totalMB = getDirSizeMB(WWW_DIR);
console.log(`  Total www/ size: ${totalMB.toFixed(1)} MB`);

// Warn about large files
const soundsDir = path.join(WWW_DIR, 'sounds');
if (fs.existsSync(soundsDir)) {
  fs.readdirSync(soundsDir).forEach(f => {
    const mb = fs.statSync(path.join(soundsDir, f)).size / (1024 * 1024);
    if (mb > 1) console.log(`    sounds/${f}: ${mb.toFixed(1)} MB`);
  });
}

const bgVideo = path.join(WWW_DIR, 'bg.mp4');
if (fs.existsSync(bgVideo)) {
  const mb = fs.statSync(bgVideo).size / (1024 * 1024);
  console.log(`    bg.mp4: ${mb.toFixed(1)} MB (focus background video — included)`);
}

console.log('\n✅ www/ prepared successfully!\n');

// ── Helpers ───────────────────────────────────────────────────────────────────

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    copyDirSync(path.join(src, entry.name), path.join(dest, entry.name));
  }
}

// Override copyDirSync to handle files too
function copyDirSync(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isFile()) {
    fs.copyFileSync(src, dest);
    return;
  }
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    copyDirSync(path.join(src, entry.name), path.join(dest, entry.name));
  }
}

function countFiles(dir) {
  let total = 0;
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) total += countFiles(path.join(dir, entry.name));
      else total++;
    }
  } catch (e) {}
  return total;
}

function getDirSizeMB(dir) {
  let bytes = 0;
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) bytes += getDirSizeMB(p) * 1024 * 1024;
      else bytes += fs.statSync(p).size;
    }
  } catch (e) {}
  return bytes / (1024 * 1024);
}

function countOccurrences(text, needle) {
  if (!needle) return 0;
  return text.split(needle).length - 1;
}

function replaceExactlyOnce(text, from, to, label) {
  const count = countOccurrences(text, from);
  if (count !== 1) {
    console.error(`ERROR: Patch target for ${label} appeared ${count} times; expected exactly 1.`);
    process.exit(1);
  }
  return text.replace(from, to);
}

function replaceOptional(text, pattern, to, label) {
  const next = text.replace(pattern, to);
  if (next !== text) console.log(`  ✓ ${label} removed`);
  return next;
}

function repairKatexFontAssets(assetsDir) {
  if (!fs.existsSync(assetsDir)) {
    console.log('  ○ assets/ missing; KaTeX check skipped');
    return;
  }

  const cssFile = fs.readdirSync(assetsDir).find(f => /^vendor-katex-.*\.css$/.test(f));
  if (!cssFile) {
    console.log('  ○ vendor-katex CSS not present; KaTeX check skipped');
    return;
  }

  const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  const refs = Array.from(css.matchAll(/url\(([^)]+)\)/g))
    .map(match => match[1].trim().replace(/^['"]|['"]$/g, ''))
    .filter(ref => ref && !ref.startsWith('data:'));
  const katexFontsDir = path.resolve(__dirname, '..', 'node_modules', 'katex', 'dist', 'fonts');
  const sourceFonts = fs.existsSync(katexFontsDir)
    ? fs.readdirSync(katexFontsDir)
      .filter(name => /^KaTeX_.+\.(?:woff2?|ttf)$/.test(name))
      .map(name => ({
        name,
        ext: path.extname(name),
        base: path.basename(name, path.extname(name)),
      }))
      .sort((a, b) => b.base.length - a.base.length)
    : [];
  const missing = [];
  let repaired = 0;

  for (const ref of refs) {
    const targetName = ref.startsWith('/assets/') ? ref.slice('/assets/'.length) : ref;
    const targetPath = path.join(assetsDir, targetName);
    if (fs.existsSync(targetPath)) continue;

    const sourceFont = sourceFonts.find(font => (
      targetName.endsWith(font.ext) &&
      targetName.startsWith(`${font.base}-`)
    ));
    const sourcePath = sourceFont ? path.join(katexFontsDir, sourceFont.name) : null;
    if (sourcePath && fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      repaired++;
    }
    if (!fs.existsSync(targetPath)) missing.push(targetName);
  }

  if (repaired > 0) {
    console.log(`  ✓ Repaired ${repaired} missing KaTeX font asset(s)`);
  }
  if (missing.length > 0) {
    console.error('  ✗ Missing KaTeX font asset(s):');
    missing.forEach(name => console.error(`    ${name}`));
    process.exit(1);
  }
  console.log(`  ✓ KaTeX CSS font references resolved (${refs.length} files)`);
}

function pruneAndroidWebOnlyArtifacts(wwwDir) {
  const relativePaths = [
    '404.html',
    'offline.html',
    'robots.txt',
    'manifest.json',
    'manifest.webmanifest',
    'firebase-messaging-sw.js',
    'pwa-local.js',
    'update-checker.js',
    'screenshots',
  ];
  const workboxFiles = fs.readdirSync(wwwDir).filter(name => /^workbox-.*\.js$/.test(name));
  let removed = 0;

  for (const relativePath of [...relativePaths, ...workboxFiles]) {
    const target = path.join(wwwDir, relativePath);
    if (!fs.existsSync(target)) continue;
    fs.rmSync(target, { recursive: true, force: true });
    removed++;
  }

  if (removed > 0) {
    console.log(`  ✓ Removed ${removed} browser/PWA-only artifact(s)`);
  } else {
    console.log('  ○ No browser/PWA-only artifacts found');
  }
}
