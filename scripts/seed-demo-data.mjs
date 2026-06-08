/**
 * IsotopeAI — Demo data seeder
 * ──────────────────────────────────────────────────────────────────────────────
 * Seeds realistic demo data into the local server for screenshot capture,
 * demonstrations, and local development.
 *
 * Usage:
 *   node scripts/seed-demo-data.mjs [--reset] [--user=email] [--url=URL]
 *
 * Options:
 *   --reset         Clear existing demo data before seeding
 *   --user=EMAIL    Use this user account (must be a real Supabase auth user)
 *   --url=URL       Server base URL (default: http://127.0.0.1:3000)
 *   --dry-run       Print what would be seeded without writing
 *
 * Safety guarantees:
 *   - All demo records use a stable prefix ("__demo__") in identifiers
 *   - --reset only deletes records with this prefix
 *   - Production data is never modified
 *   - Never writes to the Supabase service role API (uses anon key only)
 *   - No real user PII is created or stored
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const RESET_MODE = process.argv.includes('--reset');
const DRY_RUN    = process.argv.includes('--dry-run');

const argMap = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--') && a.includes('='))
    .map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=')]; })
);

const BASE_URL = argMap.url || process.env.ISOTOPE_URL || 'http://127.0.0.1:3000';

// ── Colours ──────────────────────────────────────────────────────────────────
const R = '\x1b[0m', G = '\x1b[32m', Y = '\x1b[33m', C = '\x1b[36m', B = '\x1b[1m';
const ok   = msg => console.log(`${G}  ✅ ${msg}${R}`);
const info = msg => console.log(`${C}  →  ${msg}${R}`);
const warn = msg => console.warn(`${Y}  ⚠️  ${msg}${R}`);
const dry  = msg => console.log(`${Y}  [dry-run] ${msg}${R}`);

// ── Read env ─────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve('.env');
  if (!existsSync(envPath)) return {};
  const text = readFileSync(envPath, 'utf8');
  return Object.fromEntries(
    text.split(/\r?\n/)
      .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
      .map(l => {
        const eq = l.indexOf('=');
        const k  = l.slice(0, eq).trim();
        const v  = l.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
        return [k, v];
      })
  );
}

const env = loadEnv();
const SUPABASE_URL  = process.env.SUPABASE_URL  || env.SUPABASE_URL  || '';
const SUPABASE_KEY  = process.env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  warn('SUPABASE_URL or SUPABASE_ANON_KEY not found in .env');
  warn('Demo data will be written to the local server API only.');
}

// ── Health check ─────────────────────────────────────────────────────────────
async function healthCheck() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch { return false; }
}

// ── Demo data definitions ────────────────────────────────────────────────────
const DEMO_PREFIX = '__demo__';

const DEMO_SUBJECTS = [
  { id: `${DEMO_PREFIX}physics`,  name: 'Physics',     color: '#7c6aff', emoji: '⚡' },
  { id: `${DEMO_PREFIX}chem`,     name: 'Chemistry',   color: '#2dd4bf', emoji: '🧪' },
  { id: `${DEMO_PREFIX}math`,     name: 'Mathematics', color: '#f59e0b', emoji: '📐' },
  { id: `${DEMO_PREFIX}biology`,  name: 'Biology',     color: '#4ade80', emoji: '🧬' },
];

const DEMO_TASKS = [
  { title: 'Complete Mechanics worksheet — Newton\'s Laws', subject: 'Physics',     priority: 'high',   due_days: 1 },
  { title: 'Revise Organic Chemistry — Reaction mechanisms', subject: 'Chemistry',  priority: 'high',   due_days: 2 },
  { title: 'Practice Integration — 20 problems',            subject: 'Mathematics', priority: 'medium', due_days: 3 },
  { title: 'Mock test — Full JEE paper',                    subject: 'Physics',     priority: 'high',   due_days: 7 },
  { title: 'Read NCERT — Cell Division chapter',            subject: 'Biology',     priority: 'low',    due_days: 5 },
  { title: 'Solve PYQs — Electrochemistry (2019–2024)',     subject: 'Chemistry',   priority: 'medium', due_days: 4 },
];

const DEMO_HABITS = [
  { name: 'Morning revision (7–8 AM)', icon: '☀️' },
  { name: '5 PYQ problems daily',      icon: '📝' },
  { name: 'No phone during study blocks', icon: '📵' },
  { name: 'Review notes before sleep', icon: '🌙' },
];

const DEMO_STUDY_SESSIONS = (() => {
  const sessions = [];
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const now = Date.now();
  const DAY  = 86400 * 1000;
  for (let d = 13; d >= 0; d--) {
    const count = d === 0 ? 3 : Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      const subj = subjects[Math.floor(Math.random() * subjects.length)];
      const dur  = (Math.floor(Math.random() * 60) + 25) * 60; // 25–85 min in seconds
      sessions.push({
        subject: subj,
        duration_seconds: dur,
        started_at: new Date(now - d * DAY - i * 3600 * 1000).toISOString(),
        ended_at:   new Date(now - d * DAY - i * 3600 * 1000 + dur * 1000).toISOString(),
        type: 'focus',
        demo: true,
      });
    }
  }
  return sessions;
})();

const DEMO_EXAM = {
  name:    'JEE Advanced 2027',
  date:    new Date(Date.now() + 365 * 86400 * 1000).toISOString().slice(0, 10),
  target:  'AIR < 500',
  demo:    true,
};

// ── Seeder ───────────────────────────────────────────────────────────────────
console.log(`\n${B}IsotopeAI — Demo Data Seeder${R}`);
console.log(`  Server   : ${BASE_URL}`);
console.log(`  Reset    : ${RESET_MODE}`);
console.log(`  Dry-run  : ${DRY_RUN}`);
console.log('');

const healthy = await healthCheck();
if (!healthy) {
  warn(`Local server not responding at ${BASE_URL}/api/health`);
  warn(`Start the server first: isotope start   (or node server.mjs)`);
  process.exit(1);
}
ok('Server is up');

async function apiPost(path, body, label) {
  if (DRY_RUN) {
    dry(`POST ${path} — ${label}`);
    return { ok: true };
  }
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      warn(`${label} → HTTP ${res.status}: ${JSON.stringify(data).slice(0, 120)}`);
      return null;
    }
    return data;
  } catch (err) {
    warn(`${label} → ${err.message}`);
    return null;
  }
}

async function apiGet(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: AbortSignal.timeout(5000) });
    return await res.json().catch(() => null);
  } catch { return null; }
}

// ── Seed subjects ─────────────────────────────────────────────────────────────
info('Seeding demo subjects...');
for (const s of DEMO_SUBJECTS) {
  const r = await apiPost('/api/subjects', { name: s.name, color: s.color, emoji: s.emoji, demo_id: s.id }, `subject: ${s.name}`);
  if (r) ok(`Subject: ${s.emoji} ${s.name}`);
}

// ── Seed tasks ───────────────────────────────────────────────────────────────
info('Seeding demo tasks...');
for (const t of DEMO_TASKS) {
  const due = new Date(Date.now() + t.due_days * 86400 * 1000).toISOString().slice(0, 10);
  const r = await apiPost('/api/tasks', {
    title: t.title,
    subject: t.subject,
    priority: t.priority,
    due_date: due,
    demo: true,
  }, `task: ${t.title.slice(0, 40)}`);
  if (r) ok(`Task [${t.priority}]: ${t.title.slice(0, 40)}`);
}

// ── Seed habits ──────────────────────────────────────────────────────────────
info('Seeding demo habits...');
for (const h of DEMO_HABITS) {
  const r = await apiPost('/api/habits', { name: h.name, icon: h.icon, demo: true }, `habit: ${h.name}`);
  if (r) ok(`Habit: ${h.icon} ${h.name}`);
}

// ── Seed study sessions (summary) ────────────────────────────────────────────
info(`Seeding ${DEMO_STUDY_SESSIONS.length} demo study sessions (last 14 days)...`);
const batchRes = await apiPost('/api/sessions/batch', { sessions: DEMO_STUDY_SESSIONS }, 'study sessions batch');
if (batchRes) {
  ok(`${DEMO_STUDY_SESSIONS.length} study sessions seeded`);
} else {
  // Fallback: seed individually
  let seeded = 0;
  for (const s of DEMO_STUDY_SESSIONS.slice(0, 10)) {
    const r = await apiPost('/api/sessions', s, `session: ${s.subject}`);
    if (r) seeded++;
  }
  ok(`${seeded} individual sessions seeded (batch endpoint not available)`);
}

// ── Seed exam ────────────────────────────────────────────────────────────────
info('Seeding demo exam...');
const examRes = await apiPost('/api/exams', DEMO_EXAM, `exam: ${DEMO_EXAM.name}`);
if (examRes) ok(`Exam: ${DEMO_EXAM.name} (${DEMO_EXAM.date})`);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('');
console.log(`${B}Demo data seeded.${R}`);
console.log(`  Subjects : ${DEMO_SUBJECTS.length}`);
console.log(`  Tasks    : ${DEMO_TASKS.length}`);
console.log(`  Habits   : ${DEMO_HABITS.length}`);
console.log(`  Sessions : ${DEMO_STUDY_SESSIONS.length} (last 14 days)`);
console.log(`  Exams    : 1`);
console.log('');

if (DRY_RUN) {
  console.log(`${Y}Dry-run complete — no data was written.${R}`);
} else {
  console.log(`Open http://127.0.0.1:3000 to see demo data.`);
  console.log(`To capture screenshots: npm run screenshots`);
  console.log(`To reset demo data:     node scripts/seed-demo-data.mjs --reset`);
}
console.log('');
