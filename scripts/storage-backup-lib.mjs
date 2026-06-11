import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createBackupManager } from '../server/backup-manager.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  const env = { ...process.env };
  if (fs.existsSync(envPath)) {
    for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const match = raw.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) continue;
      if (!env[match[1]]) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  if (!env.SUPABASE_URL) throw new Error('SUPABASE_URL is missing');
  if (!env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_ANON_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is missing');
  return env;
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dry_run = true;
    else if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--user=')) args.user = arg.slice('--user='.length);
    else if (arg === '--user') args.user = argv[++i];
  }
  return args;
}

export function createStorageDeps(env) {
  const base = env.SUPABASE_URL.replace(/\/$/, '');
  const authKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
  const anonKey = env.SUPABASE_ANON_KEY || authKey;
  const headers = (extra = {}) => ({
    apikey: anonKey,
    authorization: `Bearer ${authKey}`,
    ...extra,
  });

  async function parseResponse(res, raw = false) {
    if (raw) return { status: res.status, body: Buffer.from(await res.arrayBuffer()) };
    const text = await res.text();
    let body = text;
    try { body = text ? JSON.parse(text) : null; } catch {}
    return { status: res.status, body };
  }

  return {
    async supaStorageDownloadAsUser(bucket, objectPath) {
      const url = `${base}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
      return parseResponse(await fetch(url, { headers: headers() }), true);
    },
    async supaStorageUploadAsUser(bucket, objectPath, buffer, mime, _jwt, options = {}) {
      const url = `${base}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
      return parseResponse(await fetch(url, {
        method: 'POST',
        headers: headers({
          'content-type': mime || 'application/octet-stream',
          'x-upsert': options.upsert ? 'true' : 'false',
        }),
        body: buffer,
      }));
    },
    async supaStorageListAsUser(bucket, prefix, _jwt, options = {}) {
      const url = `${base}/storage/v1/object/list/${encodeURIComponent(bucket)}`;
      return parseResponse(await fetch(url, {
        method: 'POST',
        headers: headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          prefix,
          limit: options.limit || 200,
          offset: options.offset || 0,
          sortBy: { column: 'updated_at', order: 'desc' },
        }),
      }));
    },
    async supaStorageRemoveAsUser(bucket, objectPaths) {
      const url = `${base}/storage/v1/object/${encodeURIComponent(bucket)}`;
      const prefixes = Array.isArray(objectPaths) ? objectPaths : [objectPaths].filter(Boolean);
      return parseResponse(await fetch(url, {
        method: 'DELETE',
        headers: headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ prefixes }),
      }));
    },
    assertSupaOk(res, label) {
      if (res.status >= 200 && res.status < 300) return res;
      const detail = typeof res.body === 'string' ? res.body : JSON.stringify(res.body || {});
      const err = new Error(`${label} failed: ${detail.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    },
    isStorageAlreadyExists(res) {
      const detail = typeof res.body === 'string' ? res.body : JSON.stringify(res.body || {});
      return (res.status === 400 || res.status === 409) && /already exists|duplicate|resource exists/i.test(detail);
    },
    appVersion: 'script',
  };
}

export function createScriptBackupManager(env = loadEnv()) {
  return createBackupManager(createStorageDeps(env));
}

export function printCandidate(candidate) {
  console.log(JSON.stringify({
    path: candidate.path,
    kind: candidate.kind,
    exists: candidate.exists,
    valid: candidate.valid,
    rich: candidate.rich,
    empty: candidate.empty,
    size_bytes: candidate.size_bytes,
    hash: candidate.hash,
    exported_at: candidate.exported_at,
    updated_at: candidate.updated_at,
    collection_counts: candidate.collection_counts,
    reason: candidate.reason,
  }));
}
