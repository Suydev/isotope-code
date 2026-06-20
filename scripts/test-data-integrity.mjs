#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  buildCanonicalBackupPayload,
  compareBackupCandidates,
  mergeBackupData,
  normalizeAnyBackup,
} from '../public/sync/backup-normalizer.js';
import { createBackupManager } from '../server/backup-manager.mjs';

const EMPTY_DATA = {
  profile: null,
  timerState: null,
  tasks: [],
  sessions: [],
  subjects: [],
  habits: [],
  dailyLogs: [],
  tests: [],
  exams: [],
  mockTests: [],
};

function backup(data, extra = {}) {
  return {
    version: 1,
    source: 'isotopeai',
    exportedAt: extra.exportedAt || '2026-06-19T10:00:00.000Z',
    appVersion: 'test',
    data: { ...EMPTY_DATA, ...data },
    ...extra,
  };
}

function createLocalStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  const control = { failKey: null, failCount: 0 };
  return {
    control,
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (control.failKey === key && control.failCount > 0) {
        control.failCount -= 1;
        throw new Error(`Injected localStorage failure for ${key}`);
      }
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    snapshot() {
      return Object.fromEntries(values);
    },
  };
}

function cloneRows(rows) {
  return new Map(Array.from(rows, ([key, value]) => [key, structuredClone(value)]));
}

function createFakeIndexedDB() {
  const stores = new Map();
  const control = {
    failStore: null,
    dropOnRead: null,
  };
  const objectStoreNames = {
    contains(name) {
      return stores.has(name);
    },
  };

  function makeDb(version) {
    return {
      version,
      objectStoreNames,
      createObjectStore(name, options = {}) {
        if (!stores.has(name)) stores.set(name, { keyPath: options.keyPath || 'id', rows: new Map() });
        return {};
      },
      close() {},
      transaction(names, mode) {
        const storeNames = Array.isArray(names) ? names : [names];
        const staged = new Map(storeNames.map((name) => [name, cloneRows(stores.get(name).rows)]));
        const tx = {
          error: null,
          oncomplete: null,
          onerror: null,
          onabort: null,
          failed: false,
          objectStore(name) {
            if (!staged.has(name)) throw new Error(`Unknown store ${name}`);
            const def = stores.get(name);
            return {
              clear() {
                staged.get(name).clear();
                if (control.failStore === name) {
                  tx.failed = true;
                  tx.error = new Error(`Injected IndexedDB failure for ${name}`);
                }
                return {};
              },
              put(record) {
                if (control.failStore === name) {
                  tx.failed = true;
                  tx.error = new Error(`Injected IndexedDB failure for ${name}`);
                  return {};
                }
                staged.get(name).set(record[def.keyPath], structuredClone(record));
                return {};
              },
              getAll() {
                const req = {};
                queueMicrotask(() => {
                  let rows = Array.from(
                    staged.get(name).values(),
                    (value) => structuredClone(value),
                  );
                  if (control.dropOnRead === name) rows = rows.slice(0, Math.max(0, rows.length - 1));
                  req.result = rows;
                  req.onsuccess?.();
                });
                return req;
              },
            };
          },
        };
        setTimeout(() => {
          if (tx.failed) {
            tx.onabort?.();
            return;
          }
          if (mode === 'readwrite') {
            for (const [name, rows] of staged) stores.get(name).rows = rows;
          }
          tx.oncomplete?.();
        }, 0);
        return tx;
      },
    };
  }

  let version = 0;
  return {
    control,
    stores,
    open(_name, requestedVersion) {
      const req = {};
      queueMicrotask(() => {
        const nextVersion = requestedVersion || Math.max(1, version);
        const needsUpgrade = version === 0 || nextVersion > version;
        version = nextVersion;
        req.result = makeDb(version);
        if (needsUpgrade) {
          req.transaction = req.result.transaction([], 'versionchange');
          req.onupgradeneeded?.({ target: { transaction: req.transaction } });
        }
        req.onsuccess?.();
      });
      return req;
    },
  };
}

function createStorageHarness() {
  const objects = new Map();
  const uploadCounts = new Map();
  const failUploads = new Map();
  let listFailure = null;
  const deps = {
    appVersion: 'test',
    async supaStorageDownloadAsUser(_bucket, path) {
      return objects.has(path)
        ? { status: 200, body: Buffer.from(objects.get(path)) }
        : { status: 404, body: Buffer.from('not found') };
    },
    async supaStorageUploadAsUser(_bucket, path, body) {
      uploadCounts.set(path, (uploadCounts.get(path) || 0) + 1);
      const remaining = failUploads.get(path) || 0;
      if (remaining > 0) {
        failUploads.set(path, remaining - 1);
        return { status: 503, body: 'injected upload failure' };
      }
      objects.set(path, body.toString('utf8'));
      return { status: 200, body: {} };
    },
    async supaStorageListAsUser() {
      if (listFailure) return listFailure;
      return { status: 200, body: [] };
    },
    async supaStorageRemoveAsUser() {
      return { status: 200, body: {} };
    },
    assertSupaOk(res, label) {
      if (res.status >= 200 && res.status < 300) return res;
      throw new Error(`${label} failed: ${String(res.body)}`);
    },
    isStorageAlreadyExists() {
      return false;
    },
  };
  return { manager: createBackupManager(deps), objects, uploadCounts, failUploads, setListFailure(value) { listFailure = value; } };
}

async function testNormalizerIntegrity() {
  const rich = backup({
    tasks: [{ id: 'task-1', title: 'keep', updatedAt: '2026-06-19T09:00:00.000Z' }],
  }, { exportedAt: '2026-06-19T09:00:00.000Z' });
  const ordinaryEmpty = backup({}, { exportedAt: '2026-06-19T11:00:00.000Z' });
  assert.equal(mergeBackupData(ordinaryEmpty, rich).tasks.length, 1, 'ordinary empty backup must not erase rich data');

  const reset = backup({}, {
    exportedAt: '2026-06-19T12:00:00.000Z',
    operation: 'reset',
    intentional_empty: true,
    reset_at: '2026-06-19T12:00:00.000Z',
  });
  const resetMerge = mergeBackupData(reset, rich);
  assert.equal(resetMerge.tasks.length, 0, 'newer intentional reset must clear rich data');
  assert.equal(resetMerge.operation, 'reset');
  assert(compareBackupCandidates(normalizeAnyBackup(reset), normalizeAnyBackup(rich)) > 0, 'newer reset must outrank stale rich backup');

  const deleted = backup({}, {
    exportedAt: '2026-06-19T11:00:00.000Z',
    tombstones: { tasks: [{ id: 'task-1', deletedAt: '2026-06-19T10:00:00.000Z' }] },
  });
  const tombstoneMerge = mergeBackupData(deleted, rich);
  assert.equal(tombstoneMerge.tasks.length, 0, 'newer tombstone must prevent resurrection');
  assert.equal(tombstoneMerge.tombstones.tasks[0].id, 'task-1');

  const newerRecord = backup({
    tasks: [{ id: 'task-1', title: 'recreated', updatedAt: '2026-06-19T13:00:00.000Z' }],
  }, { exportedAt: '2026-06-19T13:00:00.000Z' });
  const recreated = mergeBackupData(newerRecord, deleted);
  assert.equal(recreated.tasks[0].title, 'recreated', 'newer recreation must supersede stale tombstone');
  assert.equal(recreated.tombstones, undefined, 'superseded tombstone must not be propagated');

  const canonicalReset = buildCanonicalBackupPayload(reset);
  assert.equal(canonicalReset.operation, 'reset');
  assert.equal(canonicalReset.intentional_empty, true);
  const canonicalDeleted = buildCanonicalBackupPayload(deleted);
  assert.equal(canonicalDeleted.tombstones.tasks[0].id, 'task-1');
}

async function testBackupManagerIntegrity() {
  const userId = 'user-1';
  const harness = createStorageHarness();
  const rich = backup({
    tasks: [{ id: 'task-1', updatedAt: '2026-06-19T09:00:00.000Z' }],
  }, { exportedAt: '2026-06-19T10:00:00.000Z' });
  const mirrorPath = `${userId}/cloud-snapshot/latest.json`;
  harness.failUploads.set(mirrorPath, 1);

  await assert.rejects(
    harness.manager.writeCanonicalBackup(userId, 'jwt', rich),
    (error) => error.code === 'CANONICAL_BACKUP_INCOMPLETE' && error.payload?.retryable === true,
  );
  const latestPath = `${userId}/backups/latest.json`;
  const historyPath = Array.from(harness.objects.keys()).find((path) => path.includes('/backups/history/'));
  assert(harness.objects.has(latestPath), 'latest must remain recoverable after secondary failure');
  assert(historyPath, 'successful history copy must survive mirror failure');
  assert(!harness.objects.has(mirrorPath), 'failed mirror must remain visibly missing');

  const repaired = await harness.manager.writeCanonicalBackup(userId, 'jwt', rich);
  assert.equal(repaired.history_repaired, false, 'retry must not rewrite an already consistent history copy');
  assert.equal(repaired.cloud_snapshot_repaired, true, 'retry must repair the missing mirror');
  assert.equal(harness.uploadCounts.get(latestPath), 1, 'retry must reuse the committed canonical latest');
  assert.equal(harness.uploadCounts.get(historyPath), 1, 'retry must reuse the committed history copy');

  const best = { selected_internal: { rich: true, collection_counts: { tasks: 1 } } };
  assert.throws(
    () => harness.manager.assertNoEmptyOverwrite(normalizeAnyBackup(backup({})), best),
    (error) => error.code === 'BLOCKED_EMPTY_OVERWRITE',
  );
  assert.doesNotThrow(() => harness.manager.assertNoEmptyOverwrite(normalizeAnyBackup(backup({}, {
    operation: 'reset',
    intentional_empty: true,
  })), best));

  harness.setListFailure({ status: 503, body: 'list unavailable' });
  await assert.rejects(
    harness.manager.findBestCloudBackup(userId, 'jwt'),
    /Storage list .* failed: list unavailable/,
    'candidate listing failures must be surfaced',
  );
}

async function testLocalRestoreIntegrity() {
  const staleTask = [{ id: 'old-task', title: 'stale' }];
  const localStorage = createLocalStorage({
    isotope_tasks_v2: JSON.stringify(staleTask),
  });
  const indexedDB = createFakeIndexedDB();
  globalThis.window = {
    indexedDB,
    localStorage,
    dispatchEvent() {},
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, init) {
      this.type = type;
      this.detail = init?.detail;
    }
  };
  const adapter = await import(`../public/sync/local-data-adapter.js?integrity=${Date.now()}`);
  await adapter.readCollection('tasks');
  indexedDB.stores.get('tasks').rows.set('old-task', staleTask[0]);

  const restoredData = {
    ...EMPTY_DATA,
    tasks: [{ id: 'new-task', title: 'fresh' }],
    sessions: [{ id: 'session-1', duration: 25 }],
  };
  indexedDB.control.failStore = 'sessions';
  await assert.rejects(
    adapter.writeAllLocalData(restoredData),
    /Injected IndexedDB failure for sessions/,
    'IndexedDB restore failure must propagate',
  );
  assert.equal(localStorage.getItem('isotope_restore_metadata'), null, 'failed restore must not write success metadata');
  assert.deepEqual(JSON.parse(localStorage.getItem('isotope_tasks_v2')), staleTask, 'localStorage must not be updated before IndexedDB commits');
  assert(indexedDB.stores.get('tasks').rows.has('old-task'), 'failed multi-store transaction must preserve stale IndexedDB atomically');

  indexedDB.control.failStore = null;
  indexedDB.control.dropOnRead = 'tasks';
  await assert.rejects(
    adapter.writeAllLocalData(restoredData),
    /IndexedDB restore count verification failed/,
    'post-write count verification must reject incomplete results',
  );
  assert.equal(localStorage.getItem('isotope_restore_metadata'), null, 'verification failure must not write success metadata');

  indexedDB.control.dropOnRead = null;
  indexedDB.stores.get('tasks').rows.clear();
  indexedDB.stores.get('tasks').rows.set('old-task', staleTask[0]);
  localStorage.control.failKey = 'isotope_sessions_v2';
  localStorage.control.failCount = 1;
  await assert.rejects(
    adapter.writeAllLocalData(restoredData),
    /Injected localStorage failure for isotope_sessions_v2/,
    'localStorage failure must propagate',
  );
  assert.deepEqual(JSON.parse(localStorage.getItem('isotope_tasks_v2')), staleTask, 'localStorage failure must roll back earlier localStorage writes');
  assert(indexedDB.stores.get('tasks').rows.has('old-task'), 'localStorage failure must roll back the IndexedDB commit');
  assert(!indexedDB.stores.get('tasks').rows.has('new-task'), 'rolled-back IndexedDB must not retain restored rows');

  const result = await adapter.applyBackupToLocal(backup(restoredData), { source_path: 'test-backup' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.after_counts.tasks, 1);
  assert.deepEqual(result.after_counts.sessions, 1);
  const metadata = JSON.parse(localStorage.getItem('isotope_restore_metadata'));
  assert.equal(metadata.collection_counts.tasks, 1);
  assert(metadata.data_hash, 'successful restore metadata must include verified data hash');
}

const tests = [
  ['normalizer tombstones, reset, and rich-vs-empty', testNormalizerIntegrity],
  ['canonical retry repair and listing errors', testBackupManagerIntegrity],
  ['IndexedDB restore propagation and verification', testLocalRestoreIntegrity],
];

for (const [name, test] of tests) {
  await test();
  console.log(`PASS ${name}`);
}
