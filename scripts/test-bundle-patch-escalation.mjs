#!/usr/bin/env node
// Bundle patchers rewrite SHIPPED files by substring match. An anchor that
// stops matching leaves the served bundle byte-identical to the on-disk file:
// the feature silently disappears, with no server-side error.
//
// This test loads the real server.mjs, runs the real getPatched*Bundle()
// against the real public/assets/*.js, and asserts two things:
//
//   1. HAPPY PATH — every patched buffer parses, and NO patcher escalates
//      against the bundles that are actually shipped. A false positive here
//      would put a red banner on a healthy install.
//   2. MUTATION PATH — for each load-bearing anchor, corrupt that anchor in the
//      real bundle bytes, re-run the real patcher, and assert the failure
//      reaches _criticalPatchFailures (the array behind the startup banner).
//      Without this, a missed anchor is only ever a line in a startup log
//      nobody reads.
//
// The mutation harness mangles ALL occurrences of an anchor, because some
// anchors are substrings of a later patch's own replacement (see
// sessionsync patch #5 / #4) -- mangling only the first occurrence in the raw
// bytes proves nothing.
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SERVER = path.join(ROOT, 'server.mjs');

let failures = 0;
const ok = (m) => console.log('  ok   ' + m);
const bad = (m) => { failures++; console.log('  FAIL ' + m); };

// Load server.mjs with its patchers exposed on globalThis, plus a hook that
// runs a callback after the module body has evaluated. Nothing about the
// patcher source is modified.
function loadServer(epilogueBody) {
  const src = fs.readFileSync(SERVER, 'utf8');
  const patched = src
    .replace(/^const ([A-Z0-9_]*_ABS)\s*=/gm, 'globalThis.$1 =')
    .replace(/^function (getPatched\w+)\(/gm, 'globalThis.$1 = function $1(')
    .replace(/^var _criticalPatchFailures = /gm, 'globalThis._criticalPatchFailures = ')
    ;
  const tmp = path.join(ROOT, '.test-bundle-patches.tmp.mjs');
  fs.writeFileSync(tmp, patched + '\n' + epilogueBody);
  try {
    const r = spawnSync(process.execPath, ['--experimental-vm-modules', '--no-warnings', tmp], {
      cwd: ROOT, encoding: 'utf8', timeout: 120000, killSignal: 'SIGKILL',
      env: { ...process.env, PORT: '0', ISOTOPE_SKIP_BUNDLE_CHECK: '1', NODE_OPTIONS: '' },
    });
    if (r.status !== 0 && !r.stdout.includes('__TEST_SENTINEL__')) {
      throw new Error('harness failed: ' + String(r.stderr || '').slice(-1500));
    }
    return String(r.stdout || '');
  } finally {
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
}

const PATCHERS = [
  ['auth', 'AUTH_BUNDLE_ABS', 'getPatchedAuthBundle'],
  ['focus', 'FOCUS_BUNDLE_ABS', 'getPatchedFocusBundle'],
  ['onboarding', 'ONBOARDING_BUNDLE_ABS', 'getPatchedOnboardingBundle'],
  ['singlegroup', 'SINGLE_GROUP_BUNDLE_ABS', 'getPatchedSingleGroupBundle'],
  ['settings', 'SETTINGS_BUNDLE_ABS', 'getPatchedSettingsBundle'],
  ['syncstore', 'USE_SYNC_STORE_BUNDLE_ABS', 'getPatchedUseSyncStoreBundle'],
  ['appaccessgate', 'APP_ACCESS_GATE_BUNDLE_ABS', 'getPatchedAppAccessGateBundle'],
  ['sessionsync', 'SESSION_SYNC_BUNDLE_ABS', 'getPatchedSessionSyncBundle'],
  ['invites', 'INVITES_BUNDLE_ABS', 'getPatchedInvitesBundle'],
  ['community', 'COMMUNITY_BUNDLE_ABS', 'getPatchedCommunityBundle'],
  ['communityapi', 'COMMUNITY_API_BUNDLE_ABS', 'getPatchedCommunityApiBundle'],
  ['usecommunity', 'USE_COMMUNITY_BUNDLE_ABS', 'getPatchedUseCommunityBundle'],
  ['communityhub', 'COMMUNITY_HUB_BUNDLE_ABS', 'getPatchedCommunityHubBundle'],
  ['communityvis', 'COMMUNITY_VISUALS_BUNDLE_ABS', 'getPatchedCommunityVisualsBundle'],
  ['dashboard', 'DASHBOARD_BUNDLE_ABS', 'getPatchedDashboardBundle'],
  ['analytics', 'ANALYTICS_BUNDLE_ABS', 'getPatchedAnalyticsBundle'],
  ['study', 'STUDY_BUNDLE_ABS', 'getPatchedStudyBundle'],
  ['pwamanager', 'PWA_MANAGER_BUNDLE_ABS', 'getPatchedPWAManagerBundle'],
  ['core', 'MARKETING_CORE_BUNDLE_ABS', 'getPatchedCoreBundle'],
  ['authstore', 'USE_AUTH_STORE_BUNDLE_ABS', 'getPatchedAuthStoreBundle'],
  ['entry', 'ENTRY_BUNDLE_ABS', 'getPatchedEntryBundle'],
  ['app', 'APP_BUNDLE_ABS', 'getPatchedAppBundle'],
  ['notifstore', 'NOTIF_STORE_ABS', 'getPatchedNotifStore'],
  ['authbridge', 'AUTH_BRIDGE_ABS', 'getPatchedAuthBridge'],
];

// One load-bearing anchor per patcher that must escalate when it misses.
// Chosen for blast radius: sync, access-gate routing, and the cloud-write
// verification that is the whole point of the onboarding patch.
const MUTATIONS = [
  ['syncstore', 'assets/useSyncStore-Di0wBMnH.js', 'patchedUseSyncStoreBundle',
    'triggerSync:async()=>{const t=u.getState(),{userId:a,isAuthenticated:s}=t,r=t.isPremium();if(!s||!a||!r)return;const o=await n();', 'getPatchedUseSyncStoreBundle'],
  ['sessionsync-complete', 'assets/sessionSync-mloIEnTd.js', 'patchedSessionSyncBundle',
    'if(!f())return await r(e.id),{success:!0};', 'getPatchedSessionSyncBundle'],
  ['sessionsync-pending', 'assets/sessionSync-mloIEnTd.js', 'patchedSessionSyncBundle',
    'if(!f())return await _(),{synced:0,failed:0};', 'getPatchedSessionSyncBundle'],
  ['appaccessgate-boot', 'assets/AppAccessGate-DzNuNpuU.js', 'patchedAppAccessGateBundle',
    'const ye=await(await Ae()).canBootstrapFromCloud(O.userId,!0);D(ye)', 'getPatchedAppAccessGateBundle'],
  ['singlegroup-tour', 'assets/SingleGroup-DU1IhoNK.js', 'patchedSingleGroupBundle',
    'onDestroyed:()=>{l(t,!0)}}', 'getPatchedSingleGroupBundle'],
  ['settings-avatar', 'assets/SettingsLayout-DkuooNHv.js', 'patchedSettingsBundle',
    'avatar:void 0', 'getPatchedSettingsBundle'],
  ['onboarding-verified-write', 'assets/Onboarding-C0svxOgT.js', 'patchedOnboardingBundle',
    'a({currentStep:C}),await r({isOnboarded:!0,onboardingCompletedAt:new Date().toISOString()})', 'getPatchedOnboardingBundle'],
  ['leaderboard-local-stats', 'assets/useLeaderboard-BpvH5FXA.js', 'patchedLeaderboardBundle',
    'async function N(){try{const s=await S.getSessions();return A(s)}catch', 'getPatchedLeaderboardBundle'],
  ['authstore-session-mirror', 'assets/useAuthStore-Aw1au7RF.js', null,
    'vs={getItem:async a=>{const e=await M.getItem(a);return typeof e=="string"?e:null}', 'getPatchedAuthStoreBundle'],
  ['authstore-pkce-config', 'assets/useAuthStore-Aw1au7RF.js', null,
    'auth:{autoRefreshToken:!1,persistSession:!0,detectSessionInUrl:!0,storage:vs,storageKey:"isotope-auth-token"}', 'getPatchedAuthStoreBundle'],
  ['authstore-plan-default', 'assets/useAuthStore-Aw1au7RF.js', null,
    'planType:"free"', 'getPatchedAuthStoreBundle'],
  ['authstore-circuit-breaker', 'assets/useAuthStore-Aw1au7RF.js', null,
    'function x(a){if(!a)return!1;if(typeof a=="object"){const t=a.status??a.statusCode;', 'getPatchedAuthStoreBundle'],
  ['community-chat-component', 'assets/Community-CEnEgsrd.js', 'patchedCommunityBundle',
    '};export{Is as default};', 'getPatchedCommunityBundle'],
  ['community-chat-render', 'assets/Community-CEnEgsrd.js', 'patchedCommunityBundle',
    ',g&&e.jsxs(B,{title:"Group settings"', 'getPatchedCommunityBundle'],
  ['community-leaderboard-tab', 'assets/Community-CEnEgsrd.js', 'patchedCommunityBundle',
    'const Ve=[{id:"overview",label:"Overview"},{id:"buddies",label:"Buddies"},{id:"groups",label:"Groups"},{id:"discover",label:"Discover"}],', 'getPatchedCommunityBundle'],
  ['community-leaderboard-render', 'assets/Community-CEnEgsrd.js', 'patchedCommunityBundle',
    'er:()=>a("discover"),onNotice:f}):e.jsx(ss,{filters:k', 'getPatchedCommunityBundle'],
];

// ── Pass 1: happy path ───────────────────────────────────────────────────────
console.log('\nbundle patchers: happy path (real bundles, no escalation expected)');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isotope-patchtest-'));
const happy = `
globalThis.__J = ${JSON.stringify(PATCHERS)};
globalThis.__OUT = ${JSON.stringify(tmpDir)};
const __r = {};
for (const [label, absName, fnName] of globalThis.__J) {
  const abs = globalThis[absName], fn = globalThis[fnName];
  if (!fs.existsSync(abs)) { __r[label] = 'NOFILE'; continue; }
  globalThis._criticalPatchFailures.length = 0;
  let out = null, threw = null;
  try { out = fn(); } catch (e) { threw = String(e && e.message || e); }
  if (threw) { __r[label] = 'THREW:' + threw; continue; }
  if (out == null) { __r[label] = 'NULL'; continue; }
  fs.writeFileSync(globalThis.__OUT + '/' + label + '.out.js', Buffer.isBuffer(out) ? out : Buffer.from(String(out)));
  __r[label] = [...globalThis._criticalPatchFailures];
}
console.log('__RESULT__' + JSON.stringify(__r));
console.log('__TEST_SENTINEL__');
process.exit(0);
`;
let parsed = null;
try {
  const out = loadServer(happy);
  const m = out.match(/__RESULT__(\{.*\})/);
  parsed = m ? JSON.parse(m[1]) : null;
} catch (e) { bad('happy path harness threw: ' + e.message); }
if (parsed) {
  for (const [label, v] of Object.entries(parsed)) {
    if (v === 'NULL') { ok(label + ' returned null (opted out)'); continue; }
    if (typeof v === 'string') { bad(label + ' ' + v); continue; }
    if (v.length) bad(label + ' escalated against the SHIPPED bundle: ' + JSON.stringify(v));
    else ok(label + ' clean');
  }
  // Every emitted buffer must parse: patched bytes exist only in memory, so a
  // malformed replacement is invisible to every other check.
  const script = `
    const fs=require('fs'),vm=require('vm');
    const bad=[];
    for(const f of JSON.parse(process.argv[1])){
      try{ new vm.SourceTextModule(fs.readFileSync(f,'utf8'),{identifier:f}); }
      catch(e){ bad.push([f,String(e.message)]); }
    }
    process.stdout.write(JSON.stringify(bad));`;
  const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.out.js')).map(f => path.join(tmpDir, f));
  if (files.length) {
    const r = spawnSync(process.execPath, ['--experimental-vm-modules', '--no-warnings', '-e', script, JSON.stringify(files)],
      { encoding: 'utf8', timeout: 90000 });
    let badFiles = [];
    try { badFiles = JSON.parse(r.stdout || '[]'); } catch { /* reported below */ }
    if (badFiles.length) for (const [f, msg] of badFiles) bad('patched output does not parse: ' + path.basename(f) + ' :: ' + msg);
    else ok(files.length + ' patched bundles parse as valid ES modules');
  }
}
try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}

// ── Pass 2: mutation path ────────────────────────────────────────────────────
console.log('\nbundle patchers: mutation path (corrupt an anchor, expect escalation)');
const mutCases = MUTATIONS.map(([name, asset, reset, needle, patcher]) => ({ name, asset, reset, needle, patcher }));
const mutate = `
globalThis.__C = ${JSON.stringify(mutCases)};
const __origRead = fs.readFileSync;
const __r = {};
for (const c of globalThis.__C) {
  const abs = path.join(PUBLIC_DIR, c.asset);
  const orig = __origRead(abs, 'utf8');
  if (!orig.includes(c.needle)) { __r[c.name] = 'ANCHOR-ABSENT'; continue; }
  fs.readFileSync = function (p, ...rest) {
    if (p !== abs) return __origRead.call(fs, p, ...rest);
    // Mangle EVERY occurrence: an anchor can be a substring of a later patch's
    // own replacement, so a first-occurrence-only mutation would be undone.
    return __origRead.call(fs, p, ...rest).split(c.needle).join('Z'.repeat(c.needle.length));
  };
  // NB: the memo caches are module-scoped let, so this MUST be a bare
  // assignment to the binding. globalThis[c.reset] = null compiles and runs
  // without error but clears nothing, so the patcher returns its first (clean)
  // result and the mutation is never observed.
  if (c.reset) eval(c.reset + ' = null');
  globalThis._criticalPatchFailures.length = 0;
  try { globalThis[c.patcher](); } catch (_) {}
  fs.readFileSync = __origRead;
  __r[c.name] = [...globalThis._criticalPatchFailures];
}
console.log('__RESULT__' + JSON.stringify(__r));
console.log('__TEST_SENTINEL__');
process.exit(0);
`;
try {
  const out = loadServer(mutate);
  const m = out.match(/__RESULT__(\{.*\})/);
  const res = m ? JSON.parse(m[1]) : null;
  if (!res) throw new Error('no result');
  for (const [name, v] of Object.entries(res)) {
    if (v === 'ANCHOR-ABSENT') { bad(name + ': anchor not present in the shipped bundle (test is stale)'); continue; }
    if (Array.isArray(v) && v.length) ok(name + ' escalated: ' + v.join(', '));
    else bad(name + ': patch silently returned an unpatched bundle (no escalation)');
  }
} catch (e) { bad('mutation harness threw: ' + e.message); }

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'All bundle-patch escalation checks passed.'));
process.exit(failures ? 1 : 0);
