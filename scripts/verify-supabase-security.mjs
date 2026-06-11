#!/usr/bin/env node
import crypto from 'crypto';
import { loadEnv } from './storage-backup-lib.mjs';

const env = loadEnv();
const base = env.SUPABASE_URL?.replace(/\/$/, '');
const service = env.SUPABASE_SERVICE_ROLE_KEY;
const anon = env.SUPABASE_ANON_KEY;

if (!base || !service || !anon) {
  console.log('SKIP service role, anon key, and Supabase URL are required for live cross-user security proof');
  process.exit(0);
}

const runId = crypto.randomBytes(5).toString('hex');
const password = `Iso-${runId}-temporary-Password-123`;
const users = [];
const createdSessionIds = [];
const createdNotificationIds = [];
const createdSyncIds = [];
const createdManifestPaths = [];

function headers(key, extra = {}) {
  return { apikey: key, authorization: `Bearer ${key}`, ...extra };
}

function userHeaders(user, extra = {}) {
  return { apikey: anon, authorization: `Bearer ${user.jwt}`, ...extra };
}

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let body = text;
  try { body = text ? JSON.parse(text) : null; } catch {}
  return { status: res.status, ok: res.ok, body, text };
}

function restUrl(table, query = '') {
  return `${base}/rest/v1/${encodeURIComponent(table)}${query}`;
}

async function restAsUser(user, table, query, init = {}) {
  return jsonFetch(restUrl(table, query), {
    ...init,
    headers: userHeaders(user, {
      'content-type': 'application/json',
      prefer: 'return=representation,resolution=merge-duplicates',
      ...(init.headers || {}),
    }),
  });
}

async function restAsService(table, query, init = {}) {
  return jsonFetch(restUrl(table, query), {
    ...init,
    headers: headers(service, {
      'content-type': 'application/json',
      prefer: 'return=representation,resolution=merge-duplicates',
      ...(init.headers || {}),
    }),
  });
}

function isMissingTable(res) {
  const text = typeof res.body === 'string' ? res.body : JSON.stringify(res.body || {});
  return res.status === 404 || /Could not find the table|schema cache|relation .* does not exist/i.test(text);
}

function isOk(res) {
  return res.status >= 200 && res.status < 300;
}

function affectedRows(res) {
  return Array.isArray(res.body) ? res.body.length : isOk(res) ? 1 : 0;
}

function crossWriteDenied(res) {
  if (res.status === 401 || res.status === 403) return true;
  if (res.status === 400) return true;
  if (isOk(res) && affectedRows(res) === 0) return true;
  return false;
}

const checks = [];

function record(name, ok, detail = '') {
  checks.push({ name, ok, detail, skipped: false });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` ${detail}` : ''}`);
}

function skip(name, detail = '') {
  checks.push({ name, ok: true, detail, skipped: true });
  console.log(`SKIP ${name}${detail ? ` ${detail}` : ''}`);
}

async function createUser(label) {
  const email = `iso-security-${label}-${runId}@example.invalid`;
  const created = await jsonFetch(`${base}/auth/v1/admin/users`, {
    method: 'POST',
    headers: headers(service, { 'content-type': 'application/json' }),
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!created.ok) throw new Error(`create ${label} failed: ${JSON.stringify(created.body)}`);
  users.push({ id: created.body.id, email });
  const session = await jsonFetch(`${base}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(anon, { 'content-type': 'application/json' }),
    body: JSON.stringify({ email, password }),
  });
  if (!session.ok) throw new Error(`signin ${label} failed: ${JSON.stringify(session.body)}`);
  return { id: created.body.id, email, jwt: session.body.access_token };
}

async function seedUserRows(user) {
  await restAsService('users', '?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify({
      id: user.id,
      email: user.email,
      name: `Security ${runId}`,
      username: `security-${runId}`,
    }),
  });
  await restAsService('user_profiles', '?on_conflict=user_id', {
    method: 'POST',
    body: JSON.stringify({ user_id: user.id, profile_data: { seed: runId } }),
  });
  await restAsService('user_onboarding', '?on_conflict=user_id', {
    method: 'POST',
    body: JSON.stringify({ user_id: user.id, completed: false, source: 'security-proof', data: { seed: runId } }),
  });
  await restAsService('user_settings', '?on_conflict=user_id', {
    method: 'POST',
    body: JSON.stringify({ user_id: user.id, settings: { seed: runId } }),
  });
  await restAsService('user_stats_summary', '?on_conflict=user_id', {
    method: 'POST',
    body: JSON.stringify({ user_id: user.id, total_study_seconds: 0, total_hours: 0, weekly_hours: 0, monthly_hours: 0 }),
  });
  await restAsService('daily_user_stats', '?on_conflict=user_id,date', {
    method: 'POST',
    body: JSON.stringify({ user_id: user.id, date: '2099-01-01', seconds_studied: 0 }),
  });
  await restAsService('user_presence', '?on_conflict=user_id', {
    method: 'POST',
    body: JSON.stringify({ user_id: user.id, status: 'offline', current_subject: null }),
  });
}

async function testOwnOnlyTable({ table, pkQuery, ownPatch, crossPatch, ownSelectPublic = false }) {
  const ownUpdate = await restAsUser(aUser, table, pkQuery(aUser), {
    method: 'PATCH',
    body: JSON.stringify(ownPatch(aUser)),
  });
  if (isMissingTable(ownUpdate)) return skip(`${table} table present`, 'missing');
  record(`${table} own update allowed`, isOk(ownUpdate), `HTTP ${ownUpdate.status}`);

  const crossUpdate = await restAsUser(aUser, table, pkQuery(bUser), {
    method: 'PATCH',
    body: JSON.stringify(crossPatch(bUser)),
  });
  record(`${table} cross-user update denied`, crossWriteDenied(crossUpdate), `HTTP ${crossUpdate.status}`);

  const ownSelect = await restAsUser(aUser, table, `${pkQuery(aUser)}&select=*`, { method: 'GET' });
  record(`${table} own select allowed`, isOk(ownSelect) && affectedRows(ownSelect) > 0, `HTTP ${ownSelect.status}`);

  const crossSelect = await restAsUser(aUser, table, `${pkQuery(bUser)}&select=*`, { method: 'GET' });
  const crossReadOk = isOk(crossSelect) && affectedRows(crossSelect) > 0;
  if (ownSelectPublic) {
    record(`${table} authenticated cross-user read intentionally allowed`, crossReadOk, `HTTP ${crossSelect.status}`);
  } else {
    record(`${table} cross-user select denied`, isOk(crossSelect) && affectedRows(crossSelect) === 0, `HTTP ${crossSelect.status}`);
  }
}

async function testInsertOwnedTable({ table, ownRow, crossRow, ownOnlyRead = true, publicRead = false, rememberId }) {
  const ownInsert = await restAsUser(aUser, table, '', {
    method: 'POST',
    body: JSON.stringify(ownRow(aUser)),
  });
  if (isMissingTable(ownInsert)) return skip(`${table} table present`, 'missing');
  record(`${table} own insert allowed`, isOk(ownInsert), `HTTP ${ownInsert.status}`);
  if (isOk(ownInsert) && rememberId && Array.isArray(ownInsert.body) && ownInsert.body[0]?.id) rememberId(ownInsert.body[0].id);

  const crossInsert = await restAsUser(aUser, table, '', {
    method: 'POST',
    body: JSON.stringify(crossRow(bUser)),
  });
  record(`${table} cross-user insert denied`, crossWriteDenied(crossInsert), `HTTP ${crossInsert.status}`);

  const ownSelect = await restAsUser(aUser, table, `?user_id=eq.${encodeURIComponent(aUser.id)}&select=*`, { method: 'GET' });
  record(`${table} own select allowed`, isOk(ownSelect) && affectedRows(ownSelect) > 0, `HTTP ${ownSelect.status}`);

  if (ownOnlyRead || publicRead) {
    const crossSelect = await restAsUser(aUser, table, `?user_id=eq.${encodeURIComponent(bUser.id)}&select=*`, { method: 'GET' });
    const crossReadOk = isOk(crossSelect) && affectedRows(crossSelect) > 0;
    if (publicRead) record(`${table} authenticated cross-user read intentionally allowed`, crossReadOk, `HTTP ${crossSelect.status}`);
    else record(`${table} cross-user select denied`, isOk(crossSelect) && affectedRows(crossSelect) === 0, `HTTP ${crossSelect.status}`);
  }
}

async function storageUploadAs(user, bucket, path, body, contentType = 'application/json') {
  return jsonFetch(`${base}/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: { apikey: anon, authorization: `Bearer ${user.jwt}`, 'content-type': contentType, 'x-upsert': 'true' },
    body,
  });
}

async function testStorageBucket(bucket, contentType = 'application/json', body = JSON.stringify({ proof: runId })) {
  const ownPath = `${aUser.id}/security-proof-${runId}.${contentType === 'image/png' ? 'png' : 'json'}`;
  const crossPath = `${bUser.id}/security-proof-${runId}.${contentType === 'image/png' ? 'png' : 'json'}`;
  const ownUpload = await storageUploadAs(aUser, bucket, ownPath, body, contentType);
  const crossUpload = await storageUploadAs(aUser, bucket, crossPath, body, contentType);
  record(`${bucket} own upload allowed`, isOk(ownUpload), `HTTP ${ownUpload.status}`);
  record(`${bucket} cross-user upload denied`, crossWriteDenied(crossUpload), `HTTP ${crossUpload.status}`);
}

async function cleanup() {
  for (const id of createdSessionIds) await restAsService('study_sessions_log', `?id=eq.${id}`, { method: 'DELETE' }).catch(() => null);
  for (const id of createdNotificationIds) await restAsService('notifications', `?id=eq.${id}`, { method: 'DELETE' }).catch(() => null);
  for (const id of createdSyncIds) await restAsService('sync_items', `?id=eq.${id}`, { method: 'DELETE' }).catch(() => null);
  for (const path of createdManifestPaths) await restAsService('backup_manifests', `?path=eq.${encodeURIComponent(path)}`, { method: 'DELETE' }).catch(() => null);
  for (const user of users) {
    for (const table of [
      'backup_manifests',
      'sync_items',
      'notifications',
      'study_sessions_log',
      'daily_user_stats',
      'user_presence',
      'user_settings',
      'user_onboarding',
      'user_stats_summary',
      'user_profiles',
      'users',
    ]) {
      await restAsService(table, `?user_id=eq.${encodeURIComponent(user.id)}`, { method: 'DELETE' }).catch(() => null);
    }
    await restAsService('users', `?id=eq.${encodeURIComponent(user.id)}`, { method: 'DELETE' }).catch(() => null);
    for (const bucket of ['avatars', 'user-content', 'notes']) {
      await jsonFetch(`${base}/storage/v1/object/${encodeURIComponent(bucket)}`, {
        method: 'DELETE',
        headers: headers(service, { 'content-type': 'application/json' }),
        body: JSON.stringify({ prefixes: [`${user.id}/security-proof-${runId}.json`, `${user.id}/security-proof-${runId}.png`] }),
      }).catch(() => null);
    }
    await jsonFetch(`${base}/auth/v1/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: headers(service),
    }).catch(() => null);
  }
}

let aUser;
let bUser;

try {
  aUser = await createUser('a');
  bUser = await createUser('b');
  await seedUserRows(aUser);
  await seedUserRows(bUser);

  await testOwnOnlyTable({
    table: 'user_profiles',
    pkQuery: (user) => `?user_id=eq.${encodeURIComponent(user.id)}`,
    ownPatch: () => ({ profile_data: { security_proof: runId, owner: 'a' } }),
    crossPatch: () => ({ profile_data: { security_proof: runId, cross_write: true } }),
  });

  await testOwnOnlyTable({
    table: 'user_onboarding',
    pkQuery: (user) => `?user_id=eq.${encodeURIComponent(user.id)}`,
    ownPatch: () => ({ completed: false, source: 'security-proof', data: { security_proof: runId } }),
    crossPatch: () => ({ completed: true, source: 'cross-write', data: { security_proof: runId } }),
  });

  await testOwnOnlyTable({
    table: 'user_settings',
    pkQuery: (user) => `?user_id=eq.${encodeURIComponent(user.id)}`,
    ownPatch: () => ({ settings: { security_proof: runId, owner: 'a' } }),
    crossPatch: () => ({ settings: { security_proof: runId, cross_write: true } }),
  });

  await testOwnOnlyTable({
    table: 'user_stats_summary',
    pkQuery: (user) => `?user_id=eq.${encodeURIComponent(user.id)}`,
    ownPatch: () => ({ total_study_seconds: 60, total_hours: 0.02 }),
    crossPatch: () => ({ total_study_seconds: 999999, total_hours: 999 }),
    ownSelectPublic: true,
  });

  await testOwnOnlyTable({
    table: 'daily_user_stats',
    pkQuery: (user) => `?user_id=eq.${encodeURIComponent(user.id)}&date=eq.2099-01-01`,
    ownPatch: () => ({ seconds_studied: 60 }),
    crossPatch: () => ({ seconds_studied: 999999 }),
    ownSelectPublic: true,
  });

  await testOwnOnlyTable({
    table: 'user_presence',
    pkQuery: (user) => `?user_id=eq.${encodeURIComponent(user.id)}`,
    ownPatch: () => ({ status: 'offline', current_subject: 'security-proof' }),
    crossPatch: () => ({ status: 'focus', current_subject: 'cross-write' }),
    ownSelectPublic: true,
  });

  await testInsertOwnedTable({
    table: 'study_sessions_log',
    ownRow: (user) => ({ user_id: user.id, duration_minutes: 1, subject: `security-proof-${runId}` }),
    crossRow: (user) => ({ user_id: user.id, duration_minutes: 1, subject: `cross-write-${runId}` }),
    rememberId: (id) => createdSessionIds.push(id),
  });

  await testInsertOwnedTable({
    table: 'notifications',
    ownRow: (user) => ({ user_id: user.id, type: 'security-proof', title: 'Security proof', body: runId, data: { runId } }),
    crossRow: (user) => ({ user_id: user.id, type: 'security-proof', title: 'Cross write', body: runId, data: { runId } }),
    rememberId: (id) => createdNotificationIds.push(id),
  });

  await testInsertOwnedTable({
    table: 'sync_items',
    ownRow: (user) => ({ user_id: user.id, entity: 'security-proof', entity_id: runId, operation: 'upsert', content_hash: runId, status: 'pending' }),
    crossRow: (user) => ({ user_id: user.id, entity: 'security-proof', entity_id: `${runId}-cross`, operation: 'upsert', content_hash: runId, status: 'pending' }),
    rememberId: (id) => createdSyncIds.push(id),
  });

  const manifestPath = `${aUser.id}/backups/security-proof-${runId}.json`;
  createdManifestPaths.push(manifestPath);
  await testInsertOwnedTable({
    table: 'backup_manifests',
    ownRow: (user) => ({
      user_id: user.id,
      bucket: 'user-content',
      path: manifestPath,
      kind: 'security-proof',
      content_hash: runId,
      size_bytes: 2,
      collection_counts: {},
      score: 0,
    }),
    crossRow: (user) => ({
      user_id: user.id,
      bucket: 'user-content',
      path: `${user.id}/backups/security-proof-${runId}.json`,
      kind: 'security-proof',
      content_hash: runId,
      size_bytes: 2,
      collection_counts: {},
      score: 0,
    }),
  });

  await testStorageBucket('user-content');
  await testStorageBucket('notes');
  await testStorageBucket('avatars', 'image/png', Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex'));

  const failed = checks.filter((check) => !check.ok && !check.skipped);
  if (failed.length) process.exitCode = 1;
} finally {
  await cleanup();
}
