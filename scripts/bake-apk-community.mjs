#!/usr/bin/env node
/**
 * bake-apk-community.mjs
 * Bakes the web serve-time community patches directly into the APK's static
 * bundles (APK has no server.mjs, so patches must be pre-applied).
 *
 * Patches applied (mirrors server.mjs exactly):
 *   1. CommunityApi: premium demo-gate neutralised + chat methods appended
 *   2. Community:    crash guards (buddies filter, overview shape, subjects)
 *   3. Community:    chat component + render hook + create-group button +
 *                    leaderboard tab/view/icon
 *
 * Usage: node scripts/bake-apk-community.mjs <path-to-assets-dir>
 */
import fs from 'fs';
import path from 'path';

const assetsDir = process.argv[2];
if (!assetsDir || !fs.existsSync(assetsDir)) {
  console.error('Usage: node bake-apk-community.mjs <assets-dir>');
  process.exit(1);
}

const COMMUNITY_ABS = path.join(assetsDir, 'Community-CEnEgsrd.js');
const API_ABS = path.join(assetsDir, 'communityApi-Ccw5N_9O.js');

// ── Load exact patch strings from server.mjs ────────────────────────────────
const serverSrc = fs.readFileSync(
  new URL('../../isotope-code/server.mjs', import.meta.url).pathname,
  'utf8'
);

function extract(name) {
  const re = new RegExp('const ' + name + '\\s*=\\s*(`[\\s\\S]*?`|\'[\\s\\S]*?\');\\n', '');
  const m = serverSrc.match(re);
  if (!m) throw new Error('Cannot extract ' + name);
  // eval the literal to get the actual string value
  // eslint-disable-next-line no-eval
  return eval('(' + m[1] + ')');
}

const API_GATE_FROM   = extract('COMMUNITY_API_GATE_FROM');
const API_GATE_TO     = extract('COMMUNITY_API_GATE_TO');
const API_CHAT_FROM   = extract('COMMUNITY_API_CHAT_FROM');
const API_CHAT_TO     = extract('COMMUNITY_API_CHAT_TO');
const CRASH_FROM      = extract('CRASH_FROM');
const CRASH_TO        = extract('CRASH_TO');
const SUBJ_FROM       = extract('SUBJ_FROM');
const SUBJ_TO         = extract('SUBJ_TO');
const BUDDIES_FROM    = extract('BUDDIES_FROM');
const BUDDIES_TO      = extract('BUDDIES_TO');
const OVERVIEW_FROM   = extract('OVERVIEW_FROM');
const OVERVIEW_TO     = extract('OVERVIEW_TO');
const SLICE_A_FROM    = extract('SLICE_A_FROM');
const SLICE_A_TO      = extract('SLICE_A_TO');
const CHAT_COMP_FROM  = extract('COMMUNITY_CHAT_COMPONENT_FROM');
const CHAT_COMP_TO    = extract('COMMUNITY_CHAT_COMPONENT_TO');
const CHAT_RENDER_F   = extract('COMMUNITY_CHAT_RENDER_FROM');
const CHAT_RENDER_T   = extract('COMMUNITY_CHAT_RENDER_TO');
const CREATE_BTN_F    = extract('COMMUNITY_CREATE_BTN_FROM');
const CREATE_BTN_T    = extract('COMMUNITY_CREATE_BTN_TO');
const LB_TAB_F        = extract('COMMUNITY_LB_TAB_FROM');
const LB_TAB_T        = extract('COMMUNITY_LB_TAB_TO');
const LB_RENDER_F     = extract('COMMUNITY_LB_RENDER_FROM');
const LB_RENDER_T     = extract('COMMUNITY_LB_RENDER_TO');

// ── Patch communityApi ───────────────────────────────────────────────────────
let api = fs.readFileSync(API_ABS, 'utf8');
let apiApplied = 0;
if (api.includes(API_GATE_FROM)) { api = api.replace(API_GATE_FROM, API_GATE_TO); apiApplied++; }
else console.warn('[bake] api gate anchor missing');
if (api.includes(API_CHAT_FROM)) { api = api.replace(API_CHAT_FROM, API_CHAT_TO); apiApplied++; }
else console.warn('[bake] api chat anchor missing');
fs.writeFileSync(API_ABS, api);
console.log('[bake] communityApi patched:', apiApplied, '/ 2');

// ── Patch Community bundle ───────────────────────────────────────────────────
let com = fs.readFileSync(COMMUNITY_ABS, 'utf8');
let comApplied = 0;
const pairs = [
  [CRASH_FROM, CRASH_TO], [SUBJ_FROM, SUBJ_TO],
  [BUDDIES_FROM, BUDDIES_TO], [OVERVIEW_FROM, OVERVIEW_TO],
  [CHAT_COMP_FROM, CHAT_COMP_TO], [CHAT_RENDER_F, CHAT_RENDER_T],
  [CREATE_BTN_F, CREATE_BTN_T], [LB_TAB_F, LB_TAB_T],
  [LB_RENDER_F, LB_RENDER_T],
];
for (const [from, to] of pairs) {
  if (com.includes(from)) { com = com.split(from).join(to); comApplied++; }
  else console.warn('[bake] community anchor missing:', String(from).slice(0, 50));
}
fs.writeFileSync(COMMUNITY_ABS, com);
console.log('[bake] Community patched:', comApplied, '/', pairs.length);
