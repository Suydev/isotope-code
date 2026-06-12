#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const assetDir = path.join(repoRoot, 'public', 'assets');
const outDir = path.resolve(repoRoot, process.env.ASSET_DIFF_OUT || 'artifacts/asset-diff');
const remoteDir = path.join(outDir, 'remote-assets');
const baseUrl = (process.env.ASSET_DIFF_BASE_URL || 'https://isotopeai.in/assets').replace(/\/+$/, '');
const concurrency = Math.max(1, Math.min(12, Number(process.env.ASSET_DIFF_CONCURRENCY || 6)));
const timeoutMs = Math.max(3000, Number(process.env.ASSET_DIFF_TIMEOUT_MS || 20000));

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function looksLikeHtmlFallback(name, headers, body) {
  const ext = path.extname(name).toLowerCase();
  if (!['.js', '.css', '.woff', '.woff2', '.map', '.json'].includes(ext)) return false;
  const contentType = String(headers.contentType || '').toLowerCase();
  const start = body.subarray(0, 120).toString('utf8').trim().toLowerCase();
  return contentType.includes('text/html') || start.startsWith('<!doctype') || start.startsWith('<html');
}

async function fetchBuffer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'isotope-asset-audit/1.0' },
    });
    const body = Buffer.from(await res.arrayBuffer());
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      headers: {
        etag: res.headers.get('etag') || '',
        lastModified: res.headers.get('last-modified') || '',
        contentType: res.headers.get('content-type') || '',
        cacheControl: res.headers.get('cache-control') || '',
      },
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  }));
  return results;
}

const entries = await readdir(assetDir);
const files = [];
for (const name of entries.sort()) {
  const fp = path.join(assetDir, name);
  const st = await stat(fp);
  if (st.isFile()) files.push(name);
}

await mkdir(remoteDir, { recursive: true });
await writeFile(path.join(outDir, 'local-assets.txt'), files.join('\n') + '\n');

const report = await mapLimit(files, concurrency, async (name) => {
  const localPath = path.join(assetDir, name);
  const local = await readFile(localPath);
  const item = {
    file: name,
    local_size: local.length,
    local_hash: sha256(local),
    remote_url: `${baseUrl}/${encodeURIComponent(name)}`,
    remote_exists: false,
    remote_status: 0,
    remote_size: 0,
    remote_hash: '',
    changed: null,
    headers: {},
    error: '',
  };

  try {
    const remote = await fetchBuffer(item.remote_url);
    item.remote_status = remote.status;
    item.headers = remote.headers;
    item.remote_exists = remote.ok;
    if (!remote.ok) {
      item.error = `${remote.status} ${remote.statusText}`.trim();
      return item;
    }
    if (looksLikeHtmlFallback(name, remote.headers, remote.body)) {
      item.remote_exists = false;
      item.changed = null;
      item.error = `unexpected HTML fallback for ${path.extname(name) || 'asset'} request`;
      return item;
    }
    item.remote_size = remote.body.length;
    item.remote_hash = sha256(remote.body);
    item.changed = item.remote_hash !== item.local_hash;
    await writeFile(path.join(remoteDir, name), remote.body);
    return item;
  } catch (err) {
    item.error = err && err.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : (err?.message || String(err));
    return item;
  }
});

const changed = report.filter((item) => item.changed === true);
const missing = report.filter((item) => !item.remote_exists);
const same = report.filter((item) => item.changed === false);

await writeFile(path.join(outDir, 'asset-report.json'), JSON.stringify({
  generated_at: new Date().toISOString(),
  base_url: baseUrl,
  local_asset_count: files.length,
  same_count: same.length,
  changed_count: changed.length,
  missing_or_failed_count: missing.length,
  files: report,
}, null, 2) + '\n');

const lines = [
  '# Asset Diff Summary',
  '',
  `Generated: ${new Date().toISOString()}`,
  `Base URL: ${baseUrl}`,
  `Local assets: ${files.length}`,
  `Same: ${same.length}`,
  `Changed: ${changed.length}`,
  `Missing or failed: ${missing.length}`,
  '',
  '## Changed',
  '',
  changed.length ? '| File | Local bytes | Remote bytes | Remote status |' : 'None.',
];
if (changed.length) {
  lines.push('| --- | ---: | ---: | ---: |');
  changed.forEach((item) => lines.push(`| ${item.file} | ${item.local_size} | ${item.remote_size} | ${item.remote_status} |`));
}
lines.push('', '## Missing Or Failed', '');
if (missing.length) {
  lines.push('| File | Status | Error |');
  lines.push('| --- | ---: | --- |');
  missing.forEach((item) => lines.push(`| ${item.file} | ${item.remote_status || ''} | ${String(item.error || '').replace(/\|/g, '/') } |`));
} else {
  lines.push('None.');
}
await writeFile(path.join(outDir, 'summary.md'), lines.join('\n') + '\n');

console.log(`Asset diff complete: ${files.length} local, ${same.length} same, ${changed.length} changed, ${missing.length} missing/failed`);
console.log(`Report: ${path.relative(repoRoot, path.join(outDir, 'summary.md'))}`);
