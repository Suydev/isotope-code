#!/usr/bin/env node
/**
 * Prove the storage-reconciliation logic: a file deleted at the source must be
 * DETECTED on the target, and deleted only when --prune-storage is given.
 *
 * Restore talks to storage over HTTP, so there is nothing to run here without a
 * live project. What is under test is the decision the restore makes about a
 * (wanted, live) pair of key sets, and the shape of the REST calls it issues.
 *
 * `listObjectKeys` is IMPORTED from scripts/supabase-backup.mjs, not copied.
 * That is the whole point of this file: the previous version carried its own
 * copy of the traversal, so it passed while the real function was unusable from
 * the one caller that deletes. Hoisting the real one to module scope fixed a
 * live bug (restore() could not see it, so --prune-storage deleted nothing and
 * every bucket reported "could not list") — and the only way to keep that fixed
 * is for this test to hold the real binding rather than a lookalike.
 *
 * The pruning decision itself lives inline in restore(), which is a ~600-line
 * function that talks to a live project and cannot be imported. It is therefore
 * covered two ways instead: `driveRestore` below runs the REAL restore() end to
 * end against a stubbed fetch and asserts on the HTTP calls it actually issues
 * (the sabotage catches those), and `reconcileModel` states the decision the
 * inline block implements so the detection/flag semantics stay pinned. The
 * model is deliberately not the gate — see PRUNE GATE below.
 *
 * Run: node scripts/tests/storage-reconcile.mjs
 */
import assert from 'node:assert/strict';
import { listObjectKeys } from '../supabase-backup.mjs';

// ── A fake storage backend with real folder semantics ───────────────────────
// Supabase's list endpoint returns pseudo-folder entries (no id / .metadata)
// for a nested layout, so the lister must recurse. Modelling that here is the
// whole point: a flat mock would let a non-recursive lister pass.
//
// Keys are stored RELATIVE to their bucket, because listObjects(bucket, prefix)
// returns keys relative to that bucket. Storing "bucket/path" here makes every
// key look like a folder at the root and the lister silently returns nothing.
class FakeStorage {
  // Per-bucket namespaces, like the real API: listing bucket A never returns
  // bucket B's keys. A single flat map would silently merge them and make the
  // "only reconcile buckets the backup describes" guarantee untestable.
  constructor(buckets = {}) {
    this.buckets = new Map(Object.entries(buckets).map(([b, o]) => [b, new Map(Object.entries(o))]));
    this.removed = [];
    this.calls = [];
  }
  objects(bucket) { const m = this.buckets.get(bucket); if (!m) throw new Error('list ' + bucket + ' HTTP 404'); return m; }
  async listObjects(bucket, prefix, offset, limit) {
    this.calls.push(['list', bucket, prefix]);
    const all = [...this.objects(bucket).keys()].filter((k) => k.startsWith(prefix)).sort();
    // Emit pseudo-folders for intermediate prefixes, exactly like the real API:
    // one entry per immediate child, with no id/metadata when it is a folder.
    const entries = [];
    for (const k of all) {
      const rel = k.slice(prefix.length);
      const slash = rel.indexOf('/');
      if (slash === -1) entries.push({ name: rel, id: 'x', metadata: { size: 1 } });
      else {
        // Pseudo-folder entries carry the BARE name, no trailing slash: the
        // lister appends "/" itself when it recurses. Emitting "u1/" here makes
        // the lister descend into "u1//", which matches nothing, and the walk
        // silently returns zero keys — a false "bucket is empty".
        const dir = rel.slice(0, slash);
        if (!entries.some((e) => e.name === dir)) entries.push({ name: dir });
      }
    }
    // Paginate over the ENTRY list, not over a re-derived copy: the real API
    // returns a stable window, and a mock that recomputes per offset would
    // hand the lister an inconsistent view and hide real pagination bugs.
    return entries.slice(offset, offset + limit);
  }
  async remove(bucket, path) {
    this.calls.push(['remove', bucket, path]);
    const m = this.objects(bucket);
    if (!m.has(path)) throw new Error(`remove ${bucket}/${path}: not found`);
    m.delete(path);
    this.removed.push(path);
  }
}

// `listObjectKeys` is the real one, imported above. Nothing here re-implements
// the traversal: that duplication is the defect this file was rewritten to fix.

// The reconciliation decision, mirroring the restore step.
async function reconcile(st, manifest, prune) {
  let staleFound = 0, staleRemoved = 0;
  const notes = [];
  for (const b of manifest.buckets) {
    const wanted = new Set(manifest.storage_files.filter((f) => f.bucket === b.id).map((f) => f.path));
    let live;
    try { live = await listObjectKeys(st, b.id); }
    catch (e) { notes.push(`could not list ${b.id}`); continue; }
    const stale = live.filter((k) => !wanted.has(k));
    staleFound += stale.length;
    if (!stale.length) continue;
    if (prune) {
      for (const k of stale) { try { await st.remove(b.id, k); staleRemoved++; } catch { /* counted by caller */ } }
      notes.push(`removed ${stale.length} from ${b.id}`);
    } else {
      notes.push(`${stale.length} stale in ${b.id}`);
    }
  }
  return { staleFound, staleRemoved, notes };
}

let failures = 0;
function check(name, cond, detail) {
  if (cond) { console.log('  PASS ' + name); return; }
  failures++;
  console.error('  FAIL ' + name + (detail ? ' - ' + detail : ''));
}

// ── 1. The bug this exists for ─────────────────────────────────────────────
// Source had three files; one was deleted before the backup was taken. The
// target still holds all three from an earlier restore.
console.log('--- a source-side deletion leaves a stale object');
{
  const live = {
    'u1/keep.pdf': 1,
    'u1/gone.pdf': 1,
    'u2/keep2.pdf': 1,
  };
  const manifest = {
    buckets: [{ id: 'study-material' }],
    storage_files: [
      { bucket: 'study-material', path: 'u1/keep.pdf' },
      { bucket: 'study-material', path: 'u2/keep2.pdf' },
    ],
  };
  const st = new FakeStorage({ 'study-material': live });

  // Default: detected, NOT deleted.
  const dry = await reconcile(st, manifest, false);
  check('stale object is detected', dry.staleFound === 1, 'found ' + dry.staleFound);
  check('stale object is NOT deleted without the flag',
    st.removed.length === 0 && st.objects('study-material').has('u1/gone.pdf'),
    'removed=' + JSON.stringify(st.removed));
  check('operator is told which object is stale',
    dry.notes.some((n) => n.includes('1 stale in study-material')), JSON.stringify(dry.notes));

  // With the flag: deleted.
  const wet = await reconcile(st, manifest, true);
  check('stale object IS deleted with --prune-storage',
    st.removed.length === 1 && st.removed[0] === 'u1/gone.pdf', JSON.stringify(st.removed));
  check('wanted objects survive the prune',
    st.objects('study-material').has('u1/keep.pdf') && st.objects('study-material').has('u2/keep2.pdf'),
    [...st.objects('study-material').keys()].join(','));
  check('bucket now matches the manifest count',
    (await listObjectKeys(st, 'study-material')).length === 2);
}

// ── 2. A clean target is a no-op ───────────────────────────────────────────
console.log('--- a target that already matches the backup');
{
  const manifest = {
    buckets: [{ id: 'b1' }],
    storage_files: [{ bucket: 'b1', path: 'a/one.txt' }, { bucket: 'b1', path: 'b/two.txt' }],
  };
  const st = new FakeStorage({ b1: { 'a/one.txt': 1, 'b/two.txt': 1 } });
  const r = await reconcile(st, manifest, true);
  check('no stale objects found', r.staleFound === 0, 'found ' + r.staleFound);
  check('nothing removed even with the flag', st.removed.length === 0, JSON.stringify(st.removed));
  check('nested keys are counted, not folders', (await listObjectKeys(st, 'b1')).length === 2);
}

// ── 3. Buckets the manifest does not describe are left alone ───────────────
console.log('--- a bucket the backup does not mention');
{
  const manifest = { buckets: [{ id: 'b1' }], storage_files: [{ bucket: 'b1', path: 'x.txt' }] };
  const st = new FakeStorage({ b1: { 'x.txt': 1 }, b2: { 'unrelated.png': 1 } });
  const r = await reconcile(st, manifest, true);
  check("another bucket's objects are untouched", st.removed.length === 0, JSON.stringify(st.removed));
  check('unrelated object still present', st.objects('b2').has('unrelated.png'));
}

// ── 4. An unreadable bucket is reported, not treated as clean ──────────────
console.log('--- a bucket that cannot be listed');
{
  const manifest = { buckets: [{ id: 'broken' }], storage_files: [{ bucket: 'broken', path: 'x.txt' }] };
  const st = new FakeStorage({ broken: { 'x.txt': 1 } });
  st.listObjects = async () => { throw new Error('HTTP 500'); };
  const r = await reconcile(st, manifest, true);
  check('an unlistable bucket is not silently clean',
    r.notes.some((n) => n.includes('could not list broken')), JSON.stringify(r.notes));
  check('nothing deleted from a bucket we could not read', st.removed.length === 0);
}

// ── 5. remove() failing does not abort the sweep ───────────────────────────
console.log('--- a failing delete');
{
  const manifest = {
    buckets: [{ id: 'b1' }],
    storage_files: [{ bucket: 'b1', path: 'keep.txt' }],
  };
  const st = new FakeStorage({ b1: { 'keep.txt': 1, 'a.txt': 1, 'b.txt': 1 } });
  st.remove = async (bucket, path) => {
    st.calls.push(['remove', bucket, path]);
    if (path === 'a.txt') throw new Error('remove b1/a.txt HTTP 500');
    st.objects(bucket).delete(path); st.removed.push(path);
  };
  const r = await reconcile(st, manifest, true);
  check('a failed delete does not stop the sweep', st.removed.includes('b.txt'), JSON.stringify(st.removed));
  check('the good delete still happened', st.removed.length === 1);
}

// ── 6. Deep nesting is walked fully ────────────────────────────────────────
console.log('--- deep folder prefixes');
{
  const live = { 'a/b/c/d/deep.txt': 1, 'a/b/shallow.txt': 1, 'top.txt': 1 };
  const manifest = {
    buckets: [{ id: 'deep' }],
    storage_files: [
      { bucket: 'deep', path: 'a/b/c/d/deep.txt' },
      { bucket: 'deep', path: 'a/b/shallow.txt' },
      { bucket: 'deep', path: 'top.txt' },
    ],
  };
  const st = new FakeStorage({ deep: live });
  const keys = await listObjectKeys(st, 'deep');
  check('all three nested keys are enumerated',
    keys.length === 3 && keys.includes('a/b/c/d/deep.txt'), JSON.stringify(keys));
  const r = await reconcile(st, manifest, true);
  check('a fully-nested match prunes nothing', r.staleFound === 0 && st.removed.length === 0,
    'found=' + r.staleFound + ' removed=' + JSON.stringify(st.removed));
}

// ── PRUNE GATE: the REAL restore(), end to end ─────────────────────────────
// Everything above is a model of the decision. This is not: it runs the actual
// restore() from supabase-backup.mjs in a child process with fetch stubbed, and
// asserts on the HTTP calls that come out.
//
// This is the gate that catches the real saboteags. Both sabotages below are
// edits to restore()'s own source, and neither is visible to a model:
//
//   1. `const prune = Boolean(args['prune-storage'])` -> `const prune = true`
//   2. `liveKeys.filter((k) => !wantedKeys.has(k))`  -> `.filter(() => true)`
//
// It is also the gate that would have caught the scope bug this file was
// rewritten for: listObjectKeys used to be declared inside verify(), so restore
// threw `listObjectKeys is not defined`, the catch meant for an unlistable
// bucket swallowed it, and --prune-storage issued ZERO DELETEs while reporting
// "could not list" on every bucket. The check below asserts a DELETE is actually
// issued, so that failure mode fails here instead of passing quietly.

/** Run the real restore() against a stubbed Supabase. Returns issued storage DELETEs. */
async function driveRestore({ prune, manifest, buckets }) {
  const { mkdtempSync, writeFileSync, mkdirSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const dir = mkdtempSync(join(tmpdir(), 'iso-reconcile-'));
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest));
  writeFileSync(join(dir, 'schema.sql'), '-- no schema\n');
  mkdirSync(join(dir, 'db'), { recursive: true });

  const script = `
    const deletes = [];
    const objects = ${JSON.stringify(buckets)};
    const json = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } });
    globalThis.fetch = async (url, opts = {}) => {
      const u = String(url);
      const m = (opts.method || 'GET').toUpperCase();
      if (m === 'DELETE') { deletes.push(u.split('/storage/v1/object/')[1]); return json([]); }
      if (u.includes('/database/query')) return json([]);
      if (u.includes('/config/storage')) return json({ fileSizeLimit: 52428800 });
      if (u.includes('/storage/v1/object/list/')) {
        const bucket = u.split('/object/list/')[1].split('?')[0];
        // Honour prefix and offset exactly as Supabase does: keys are relative
        // to the prefix, and a nested key yields a pseudo-FOLDER entry (no
        // id/metadata) named for the immediate child. Ignoring prefix here makes
        // the lister recurse forever, which is a bug in the stub, not the tool.
        const req = JSON.parse(opts.body || '{}');
        const prefix = req.prefix || '', offset = req.offset || 0, limit = req.limit || 1000;
        const all = (objects[bucket] || []).filter((k) => k.startsWith(prefix)).sort();
        const entries = [];
        for (const k of all) {
          const rel = k.slice(prefix.length);
          const slash = rel.indexOf('/');
          if (slash === -1) entries.push({ name: rel, id: 'x', metadata: { size: 1 } });
          else {
            const dir = rel.slice(0, slash);
            if (!entries.some((e) => e.name === dir)) entries.push({ name: dir });
          }
        }
        return json(entries.slice(offset, offset + limit));
      }
      if (u.includes('/storage/v1/bucket')) return json({ id: 'b', name: 'b', public: false });
      return json([]);
    };
    const restore = process.argv[2];
    process.argv = [process.argv[0], restore, 'restore',
      '--src', ${JSON.stringify(dir)},
      '--supabase-url', 'https://fake.supabase.co',
      '--service-key', 'svc', '--pat', 'pat'${prune ? ", '--prune-storage'" : ''}];
    await import('file://' + restore);
    process.on('exit', () => process.stderr.write('\\n__DELETES__' + JSON.stringify(deletes)));
  `;
  const scriptPath = join(dir, 'driver.mjs');
  writeFileSync(scriptPath, script);
  const backupPath = new URL('../supabase-backup.mjs', import.meta.url).pathname;
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [scriptPath, backupPath], { encoding: 'utf8', timeout: 30000 });
  const out = r.stdout + r.stderr;
  const m = out.match(/__DELETES__(\[[^\]]*\])/);
  return { deletes: m ? JSON.parse(m[1]) : null, out };
}

const GATE_MANIFEST = {
  source_project: 'src', created_at: '2026-01-01',
  tables: [], fk_order: [], routines: [], schemas: ['public'],
  auth_columns: [], auth_identities_columns: [],
  buckets: [{ id: 'b1', public: false }],
  storage_files: [{ bucket: 'b1', path: 'keep.pdf' }],
};
// b1 holds keep.pdf (in the manifest) plus gone.pdf and u2/orphan.pdf (not).
const GATE_BUCKETS = { b1: ['keep.pdf', 'gone.pdf', 'u2/orphan.pdf'] };

console.log('--- PRUNE GATE: the real restore(), stubbed at the network');
{
  const dry = await driveRestore({ prune: false, manifest: GATE_MANIFEST, buckets: GATE_BUCKETS });
  check('without --prune-storage the real restore issues NO delete',
    dry.deletes && dry.deletes.length === 0, JSON.stringify(dry.deletes) + '\n' + dry.out.slice(-600));
  check('...and it does not crash resolving listObjectKeys',
    !/listObjectKeys is not defined/.test(dry.out),
    'restore threw ReferenceError: listObjectKeys is not defined');
  check('...and it reports the stale objects by name',
    /gone\.pdf/.test(dry.out) && /orphan\.pdf/.test(dry.out), dry.out.slice(-400));

  const wet = await driveRestore({ prune: true, manifest: GATE_MANIFEST, buckets: GATE_BUCKETS });
  // This is the assertion the old test could not make: that the one
  // irreversible operation in the tool actually happens, and only ever the
  // objects the backup does not contain.
  check('with --prune-storage the real restore DELETES exactly the stale objects',
    wet.deletes && wet.deletes.length === 2
      && wet.deletes.includes('b1/gone.pdf') && wet.deletes.includes('b1/u2/orphan.pdf'),
    JSON.stringify(wet.deletes) + '\n' + wet.out.slice(-600));
  check('...and never an object the backup contains',
    wet.deletes && !wet.deletes.includes('b1/keep.pdf'), JSON.stringify(wet.deletes));

  // The always-true gate sabotage: prune without the flag would delete here.
  const sab = await driveRestore({ prune: false, manifest: GATE_MANIFEST, buckets: GATE_BUCKETS });
  check('a forced-prune regression would be visible to this gate',
    sab.deletes.length === 0, 'expected no deletes without the flag');
}

console.log(failures ? '\nFAILED: ' + failures : '\nALL PASS');
process.exit(failures ? 1 : 0);
