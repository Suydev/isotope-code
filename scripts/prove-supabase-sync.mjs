import assert from 'node:assert/strict';
import fs from 'node:fs';

const envFile = process.env.ISOTOPE_ENV_FILE || '.env';
const base = process.env.RUNTIME_PROOF_BASE || 'http://127.0.0.1:3000';

function readEnv(file) {
  const out = {};
  const text = fs.readFileSync(file, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[match[1]] = value;
  }
  return out;
}

const env = readEnv(envFile);
const supaUrl = String(env.SUPABASE_URL || '').replace(/\/+$/, '');
const anonKey = env.SUPABASE_ANON_KEY || '';
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || '';

assert.ok(/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supaUrl), 'SUPABASE_URL is missing or invalid');
assert.ok(anonKey.split('.').length >= 3, 'SUPABASE_ANON_KEY is missing or invalid');
assert.ok(serviceKey.split('.').length >= 3, 'SUPABASE_SERVICE_ROLE_KEY is required for this smoke test');

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  return { response, data, text };
}

function supaHeaders(token, extra = {}) {
  return {
    apikey: token,
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    ...extra,
  };
}

async function supaAdmin(path, options = {}) {
  return jsonFetch(supaUrl + path, {
    ...options,
    headers: supaHeaders(serviceKey, options.headers || {}),
  });
}

async function postgrestDelete(table, query) {
  await supaAdmin(`/rest/v1/${table}?${query}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  }).catch(() => null);
}

async function removeStoragePrefix(userId) {
  const listed = await supaAdmin('/storage/v1/object/list/user-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: userId, limit: 1000, offset: 0 }),
  }).catch(() => null);
  const rows = Array.isArray(listed?.data) ? listed.data : [];
  const paths = rows
    .map((row) => row && row.name ? `${userId}/${row.name}` : null)
    .filter(Boolean);
  if (paths.length === 0) return;
  await supaAdmin('/storage/v1/object/user-content', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefixes: paths }),
  }).catch(() => null);
}

const stamp = Date.now();
const email = `isotope-sync-smoke-${stamp}@example.invalid`;
const password = `Smoke-${stamp}-Passw0rd!`;
let userId = null;

try {
  const created = await supaAdmin('/auth/v1/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { isotope_sync_smoke: true },
    }),
  });
  assert.ok(created.response.ok, `temporary auth user create failed: HTTP ${created.response.status}`);
  userId = created.data?.id;
  assert.ok(userId, 'temporary auth user response did not include id');

  const login = await jsonFetch(`${supaUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  assert.ok(login.response.ok, `temporary auth login failed: HTTP ${login.response.status}`);
  const accessToken = login.data?.access_token;
  assert.ok(accessToken, 'temporary auth login did not return access token');

  const now = new Date().toISOString();
  const backup = {
    version: 1,
    source: 'isotopeai',
    exportedAt: now,
    appVersion: 'sync-smoke',
    data: {
      profile: { display_name: 'Sync Smoke', updatedAt: now },
      timerState: null,
      tasks: [{ id: `smoke-task-${stamp}`, title: 'Supabase sync smoke task', status: 'pending', updatedAt: now }],
      sessions: [],
      subjects: [],
      habits: [],
      dailyLogs: [],
      tests: [],
      exams: [],
      mockTests: [],
    },
  };

  const appHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const upload = await jsonFetch(`${base}/__auth/backup`, {
    method: 'POST',
    headers: appHeaders,
    body: JSON.stringify({ backup_json: JSON.stringify(backup), source: 'sync_smoke' }),
  });
  assert.ok(upload.response.ok && upload.data?.ok, `local backup upload failed: HTTP ${upload.response.status} ${upload.data?.error || ''}`);
  assert.equal(upload.data.bucket, 'user-content');
  assert.ok(upload.data.latest_path === `${userId}/backups/latest.json` || upload.data.path === `${userId}/backups/latest.json`, 'canonical backup path mismatch');

  const best = await jsonFetch(`${base}/__auth/backup/best`, { headers: appHeaders });
  assert.ok(best.response.ok && best.data?.ok, `best-backup check failed: HTTP ${best.response.status} ${best.data?.error || ''}`);
  assert.equal(best.data?.selected?.path, `${userId}/backups/latest.json`);

  const latest = await jsonFetch(`${base}/__auth/backup/latest`, { headers: appHeaders });
  assert.ok(latest.response.ok && latest.data?.ok, `backup download failed: HTTP ${latest.response.status} ${latest.data?.error || ''}`);
  assert.ok(String(latest.data?.backup_json || '').includes('Supabase sync smoke task'), 'downloaded backup did not include uploaded task');

  console.log('PASS Supabase Storage sync smoke');
} finally {
  if (userId) {
    await removeStoragePrefix(userId);
    await postgrestDelete('backup_manifests', `user_id=eq.${encodeURIComponent(userId)}`);
    await postgrestDelete('sync_items', `user_id=eq.${encodeURIComponent(userId)}`);
    await postgrestDelete('user_profiles', `user_id=eq.${encodeURIComponent(userId)}`);
    await postgrestDelete('users', `id=eq.${encodeURIComponent(userId)}`);
    await supaAdmin(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, { method: 'DELETE' }).catch(() => null);
  }
}
