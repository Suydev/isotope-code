#!/usr/bin/env node
/**
 * agent-status.mjs
 * Prints current state of the IsotopeAI Android project for new agents.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function run(cmd, fallback = '') {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim(); }
  catch { return fallback; }
}

function readJson(file) {
  try { return JSON.parse(readFileSync(resolve(ROOT, file), 'utf8')); } catch { return null; }
}

function readText(file) {
  try { return readFileSync(resolve(ROOT, file), 'utf8').trim(); } catch { return null; }
}

function fileAge(file) {
  try {
    const s = statSync(resolve(ROOT, file));
    const age = Date.now() - s.mtimeMs;
    const h = Math.floor(age / 3600000);
    if (h > 48) return `${Math.floor(h/24)}d ago`;
    if (h > 0) return `${h}h ago`;
    return `${Math.floor(age/60000)}m ago`;
  } catch { return 'missing'; }
}

const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED   = '\x1b[31m';
const CYAN  = '\x1b[36m';
const DIM   = '\x1b[2m';

function ok(s)   { return `${GREEN}✓${RESET} ${s}`; }
function warn(s) { return `${YELLOW}⚠${RESET} ${s}`; }
function err(s)  { return `${RED}✗${RESET} ${s}`; }
function info(s) { return `${CYAN}→${RESET} ${s}`; }

console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  IsotopeAI Android — Agent Status${RESET}`);
console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`);

// ── Git state ────────────────────────────────────────────────────────────────
const branch = run('git rev-parse --abbrev-ref HEAD', 'unknown');
const sha    = run('git rev-parse HEAD', '').slice(0, 12);
const status = run('git --no-optional-locks status --porcelain', '');
const ahead  = run('git rev-list --count @{u}..HEAD 2>/dev/null || echo 0', '0');
const behind = run('git rev-list --count HEAD..@{u} 2>/dev/null || echo 0', '0');

console.log(`${BOLD}GIT${RESET}`);
console.log(`  Branch: ${CYAN}${branch}${RESET}`);
console.log(`  HEAD:   ${sha || 'no commits'}`);
console.log(`  Remote: ${ahead} ahead, ${behind} behind`);
if (status) {
  const lines = status.split('\n').slice(0, 10);
  console.log(warn(`  Uncommitted changes:`));
  lines.forEach(l => console.log(`    ${DIM}${l}${RESET}`));
  if (status.split('\n').length > 10) console.log(`    ${DIM}... and more${RESET}`);
} else {
  console.log(ok('  Working tree clean'));
}

// ── State JSON ───────────────────────────────────────────────────────────────
const state = readJson('.agent/state.json');
console.log(`\n${BOLD}CURRENT STATE${RESET}`);
if (state) {
  console.log(`  Phase:        ${state.phase || 'unknown'}`);
  console.log(`  Active task:  ${state.activeTaskId || 'none'}`);
  console.log(`  Last APK:     ${state.lastSuccessfulApk || 'none built yet'}`);
  console.log(`  Last AAB:     ${state.lastSuccessfulAab || 'none built yet'}`);
  console.log(`  Pushed:       ${state.pushed ? ok('yes') : warn('NO — not pushed')}`);
  if (state.blockingIssue) console.log(warn(`  Blocker: ${state.blockingIssue}`));
  console.log(`  Updated:      ${state.updatedAt || 'unknown'}`);
} else {
  console.log(err('  .agent/state.json missing!'));
}

// ── Active task ──────────────────────────────────────────────────────────────
const tasks = readText('.agent/NEXT_TASKS.md');
console.log(`\n${BOLD}ACTIVE TASK${RESET}`);
if (tasks) {
  const taskBlocks = tasks.match(/### TASK [\s\S]*?(?=### TASK|$)/g) || [];
  const taskBlock = taskBlocks.find(block => /\*\*Status:\*\* ACTIVE/.test(block));
  if (taskBlock) {
    const idMatch = taskBlock.match(/^### TASK ([A-Z]+-\d+)/m);
    const objMatch = taskBlock.match(/\*\*Objective:\*\* (.+)/);
    const nextMatch = taskBlock.match(/```bash([\s\S]*?)```/);
    console.log(`  ID:  ${idMatch ? idMatch[1] : 'unknown'}`);
    if (objMatch) console.log(`  ${objMatch[1]}`);
    if (nextMatch) {
      console.log(`  Next command:`);
      nextMatch[1].trim().split('\n').forEach(l => console.log(`    ${CYAN}${l}${RESET}`));
    }
  } else {
    console.log(warn('  No ACTIVE task found — check NEXT_TASKS.md'));
  }
} else {
  console.log(err('  .agent/NEXT_TASKS.md missing!'));
}

// ── Secrets check ─────────────────────────────────────────────────────────────
console.log(`\n${BOLD}REQUIRED SECRETS${RESET} ${DIM}(values never printed)${RESET}`);
const secrets = [
  ['GITHUB_PAT', false, 'GitHub push access'],
  ['SUPABASE_URL', false, 'Supabase project URL (optional — hardcoded in bridge)'],
  ['SUPABASE_PUBLISHABLE_KEY', false, 'Supabase anon key (optional — hardcoded)'],
  ['ANDROID_KEYSTORE_BASE64', false, 'Release signing (release builds only)'],
];
for (const [name, required, purpose] of secrets) {
  const present = !!process.env[name];
  if (present) {
    console.log(ok(`  ${name.padEnd(30)} — ${purpose}`));
  } else if (required) {
    console.log(err(`  ${name.padEnd(30)} — MISSING (required) — ${purpose}`));
  } else {
    console.log(`  ${DIM}${name.padEnd(30)} — not set (optional) — ${purpose}${RESET}`);
  }
}

// ── Tool versions ─────────────────────────────────────────────────────────────
console.log(`\n${BOLD}TOOL VERSIONS${RESET}`);
const nodeVer  = run('node --version', 'not found');
const npmVer   = run('npm --version', 'not found');
const javaVer  = run('java -version 2>&1 | head -1', 'not found');
const capVer   = run('npx cap --version 2>/dev/null', 'not found');
console.log(`  Node.js:   ${nodeVer}`);
console.log(`  npm:       ${npmVer}`);
console.log(`  Java:      ${javaVer}`);
console.log(`  Capacitor: ${capVer}`);

// ── Handoff files staleness ──────────────────────────────────────────────────
console.log(`\n${BOLD}HANDOFF FILES${RESET}`);
const agentFiles = [
  '.agent/CURRENT_STATE.md',
  '.agent/NEXT_TASKS.md',
  '.agent/KNOWN_ISSUES.md',
  '.agent/TEST_STATUS.md',
  '.agent/SESSION_LOG.md',
  '.agent/state.json',
];
for (const f of agentFiles) {
  const age = fileAge(f);
  const exists = existsSync(resolve(ROOT, f));
  if (!exists) {
    console.log(err(`  ${f} — MISSING`));
  } else {
    console.log(`  ${exists ? ok(f) : err(f)} ${DIM}(${age})${RESET}`);
  }
}

// ── www/ check ────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}BUILD ARTIFACTS${RESET}`);
const wwwExists    = existsSync(resolve(ROOT, 'www'));
const androidExists = existsSync(resolve(ROOT, 'android'));
const apkPath      = resolve(ROOT, 'android/app/build/outputs/apk/debug/app-debug.apk');
const apkExists    = existsSync(apkPath);

console.log(`  www/:     ${wwwExists ? ok('exists') : warn('not prepared — run prepare-www.js')}`);
console.log(`  android/: ${androidExists ? ok('exists') : warn('not initialized — run: npx cap add android')}`);
console.log(`  APK:      ${apkExists ? ok(apkPath) : warn('not built yet')}`);

// ── Next recommended command ──────────────────────────────────────────────────
console.log(`\n${BOLD}RECOMMENDED NEXT COMMAND${RESET}`);
const nextCmd = state?.nextCommand || 'npm run agent:resume';
console.log(`  ${CYAN}${nextCmd}${RESET}`);

console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}\n`);
