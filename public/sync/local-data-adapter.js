import {
  normalizeAnyBackup,
  getBackupData,
  getCollectionCounts,
  hashBackup,
  isBackupEmpty,
  buildCanonicalBackupPayload,
} from './backup-normalizer.js';

const DB_NAME = 'isotope_main';
const DB_VERSION = 20;

const STORE_DEFS = {
  tasks: { keyPath: 'id' },
  subjects: { keyPath: 'id' },
  sessions: { keyPath: 'id' },
  habits: { keyPath: 'id' },
  tests: { keyPath: 'id' },
  exams: { keyPath: 'id' },
  mockTests: { keyPath: 'id' },
  dailyLogs: { keyPath: 'id' },
  userProfile: { keyPath: 'id' },
  timerState: { keyPath: 'id' },
  syncMetadata: { keyPath: 'collection' },
  migrationMeta: { keyPath: 'key' },
  kv: { keyPath: 'key' },
};

const COLLECTION_TO_STORE = {
  tasks: 'tasks',
  subjects: 'subjects',
  sessions: 'sessions',
  habits: 'habits',
  tests: 'tests',
  exams: 'exams',
  mockTests: 'mockTests',
  dailyLogs: 'dailyLogs',
  profile: 'userProfile',
  timerState: 'timerState',
};

const COLLECTION_TO_STORAGE_KEY = {
  tasks: 'isotope_tasks_v2',
  subjects: 'isotope_subjects_v2',
  sessions: 'isotope_sessions_v2',
  habits: 'isotope_habits_v2',
  tests: 'isotope_tests_v2',
  exams: 'isotope_exams_v2',
  mockTests: 'isotope_mock_tests_v2',
  dailyLogs: 'isotope_daily_logs_v2',
  profile: 'isotope_user_profile_v2',
  timerState: 'isotope_timer_state',
};

const REFRESH_COLLECTIONS = {
  tasks: 'tasks',
  subjects: 'subjects',
  sessions: 'focus_sessions',
  habits: 'habits',
  exams: 'exams',
  tests: 'tests',
  mockTests: 'mock_tests',
  dailyLogs: 'daily_logs',
  profile: 'profile',
};

function canUseIndexedDB() {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function requestToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB request failed'));
  });
}

function transactionDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'));
  });
}

function ensureStores(db, event) {
  const tx = event?.target?.transaction;
  for (const [name, def] of Object.entries(STORE_DEFS)) {
    if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: def.keyPath });
    if (tx && db.objectStoreNames.contains(name)) {
      try { tx.objectStore(name); } catch {}
    }
  }
}

async function openDb() {
  if (!canUseIndexedDB()) return null;
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (event) => ensureStores(req.result, event);
    req.onsuccess = () => {
      const db = req.result;
      const missing = Object.keys(STORE_DEFS).filter((name) => !db.objectStoreNames.contains(name));
      if (missing.length === 0) {
        resolve(db);
        return;
      }
      const nextVersion = db.version + 1;
      db.close();
      const upgrade = window.indexedDB.open(DB_NAME, nextVersion);
      upgrade.onupgradeneeded = (event) => ensureStores(upgrade.result, event);
      upgrade.onsuccess = () => resolve(upgrade.result);
      upgrade.onerror = () => reject(upgrade.error || new Error('IndexedDB schema upgrade failed'));
    };
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
    req.onblocked = () => reject(new Error('IndexedDB open blocked'));
  });
}

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function normalizeRecordForStore(collection, record, index) {
  if (!record || typeof record !== 'object') return null;
  if (collection === 'profile') return { ...record, id: record.id || 'primary' };
  if (collection === 'timerState') return { ...record, id: 'current' };
  return { ...record, id: record.id || `${collection}-${Date.now()}-${index}` };
}

async function readStoreAll(storeName) {
  const db = await openDb().catch(() => null);
  if (!db || !db.objectStoreNames.contains(storeName)) return [];
  try {
    const tx = db.transaction(storeName, 'readonly');
    const rows = await requestToPromise(tx.objectStore(storeName).getAll());
    await transactionDone(tx);
    db.close();
    return Array.isArray(rows) ? rows : [];
  } catch {
    try { db.close(); } catch {}
    return [];
  }
}

async function clearAndWriteStore(storeName, records) {
  const db = await openDb().catch(() => null);
  if (!db || !db.objectStoreNames.contains(storeName)) return false;
  try {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    for (const record of records) store.put(record);
    await transactionDone(tx);
    db.close();
    return true;
  } catch {
    try { db.close(); } catch {}
    return false;
  }
}

async function readCollection(name) {
  const key = COLLECTION_TO_STORAGE_KEY[name];
  const store = COLLECTION_TO_STORE[name];
  if (!key || !store) return name === 'profile' || name === 'timerState' ? null : [];
  const fromDb = await readStoreAll(store);
  if (name === 'profile') {
    const first = fromDb[0] || readJson(key, null);
    if (!first) return null;
    const { id, ...profile } = first;
    return id === 'primary' ? profile : first;
  }
  if (name === 'timerState') {
    const first = fromDb.find((row) => row.id === 'current') || fromDb[0] || readJson(key, null);
    if (!first) return null;
    const { id, ...timer } = first;
    return id === 'current' ? timer : first;
  }
  if (fromDb.length > 0) return fromDb;
  const local = readJson(key, []);
  return Array.isArray(local) ? local : [];
}

async function writeCollection(name, records, options = {}) {
  const key = COLLECTION_TO_STORAGE_KEY[name];
  const store = COLLECTION_TO_STORE[name];
  if (!key || !store) throw new Error(`Unknown local collection: ${name}`);
  if (name === 'profile') {
    const profile = records && typeof records === 'object' && !Array.isArray(records) ? records : null;
    if (profile) {
      writeJson(key, profile);
      await clearAndWriteStore(store, [normalizeRecordForStore(name, profile, 0)]);
    } else if (options.replace !== false) {
      writeJson(key, null);
      await clearAndWriteStore(store, []);
    }
    if (options.refresh !== false) dispatchSyncRefresh(name);
    return;
  }
  if (name === 'timerState') {
    const timer = records && typeof records === 'object' && !Array.isArray(records) ? records : null;
    if (timer) {
      writeJson(key, timer);
      await clearAndWriteStore(store, [normalizeRecordForStore(name, timer, 0)]);
    } else if (options.replace !== false) {
      try { window.localStorage.removeItem(key); } catch {}
      await clearAndWriteStore(store, []);
    }
    if (options.refresh !== false) dispatchSyncRefresh(name);
    return;
  }
  const list = Array.isArray(records) ? records : [];
  const safe = list.map((record, index) => normalizeRecordForStore(name, record, index)).filter(Boolean);
  writeJson(key, safe);
  await clearAndWriteStore(store, safe);
  if (options.refresh !== false) dispatchSyncRefresh(name);
}

async function readAllLocalData() {
  const [
    profile,
    timerState,
    tasks,
    sessions,
    subjects,
    habits,
    dailyLogs,
    tests,
    exams,
    mockTests,
  ] = await Promise.all([
    readCollection('profile'),
    readCollection('timerState'),
    readCollection('tasks'),
    readCollection('sessions'),
    readCollection('subjects'),
    readCollection('habits'),
    readCollection('dailyLogs'),
    readCollection('tests'),
    readCollection('exams'),
    readCollection('mockTests'),
  ]);
  return { profile, timerState, tasks, sessions, subjects, habits, dailyLogs, tests, exams, mockTests };
}

async function countLocalData() {
  return getCollectionCounts({ data: await readAllLocalData() });
}

async function hashLocalData() {
  return hashBackup(buildCanonicalBackupPayload({ data: await readAllLocalData() }));
}

function normalizeLocalStoreData(data) {
  return getBackupData({ data: data || {} });
}

async function isLocalWorkspaceEmpty() {
  return isBackupEmpty({ collection_counts: await countLocalData(), size_bytes: 0 });
}

async function writeAllLocalData(backupData, options = {}) {
  const data = getBackupData({ data: backupData || {} });
  await Promise.all([
    writeCollection('tasks', data.tasks, { refresh: false }),
    writeCollection('sessions', data.sessions, { refresh: false }),
    writeCollection('subjects', data.subjects, { refresh: false }),
    writeCollection('habits', data.habits, { refresh: false }),
    writeCollection('dailyLogs', data.dailyLogs, { refresh: false }),
    writeCollection('tests', data.tests, { refresh: false }),
    writeCollection('exams', data.exams, { refresh: false }),
    writeCollection('mockTests', data.mockTests, { refresh: false }),
    writeCollection('profile', data.profile, { refresh: false, replace: options.replace !== false }),
    writeCollection('timerState', data.timerState, { refresh: false, replace: options.replace !== false }),
  ]);
  const meta = {
    source_path: options.source_path || null,
    hash: options.hash || null,
    restored_at: new Date().toISOString(),
    collection_counts: getCollectionCounts({ data }),
  };
  writeJson('isotope_restore_metadata', meta);
  refreshAllStores();
  return meta;
}

function writeRestoreMetadata(meta) {
  const payload = {
    ...(meta || {}),
    restored_at: meta?.restored_at || new Date().toISOString(),
  };
  writeJson('isotope_restore_metadata', payload);
  return payload;
}

function readRestoreMetadata() {
  return readJson('isotope_restore_metadata', null);
}

function refreshAllStores() {
  dispatchSyncRefresh();
  for (const collection of Object.keys(REFRESH_COLLECTIONS)) dispatchSyncRefresh(collection);
}

function dispatchSyncRefresh(collection) {
  try {
    const mapped = collection ? REFRESH_COLLECTIONS[collection] || collection : undefined;
    window.dispatchEvent(new CustomEvent('isotope:sync_refresh', { detail: mapped ? { collection: mapped } : {} }));
  } catch {}
}

function validateBackupShape(payload) {
  const normalized = normalizeAnyBackup(payload);
  if (!normalized.valid) throw new Error(normalized.reason || 'Invalid backup');
  return normalized;
}

function normalizeBackupPayload(payload) {
  return normalizeAnyBackup(payload);
}

async function buildBackupPayloadFromLocal() {
  return buildCanonicalBackupPayload({ data: await readAllLocalData() }, { exportedAt: new Date().toISOString() });
}

async function applyBackupToLocal(backupJson, options = {}) {
  const normalized = validateBackupShape(backupJson);
  const before = await countLocalData();
  await writeAllLocalData(getBackupData(normalized), {
    source_path: options.source_path || normalized.source_path,
    hash: options.hash || normalized.hash,
    replace: options.replace !== false,
  });
  const after = await countLocalData();
  const message = `Restored ${after.tasks} tasks, ${after.sessions} sessions, ${after.subjects} subjects from cloud backup.`;
  try {
    window.localStorage.setItem('isotope_last_restore_message', message);
    window.dispatchEvent(new CustomEvent('isotope:cloud_restore_complete', {
      detail: { message, before_counts: before, after_counts: after, source_path: options.source_path || normalized.source_path || null },
    }));
  } catch {}
  return { ok: true, message, before_counts: before, after_counts: after, normalized };
}

const api = {
  readAllLocalData,
  countLocalData,
  hashLocalData,
  isLocalWorkspaceEmpty,
  writeAllLocalData,
  readCollection,
  writeCollection,
  refreshAllStores,
  dispatchSyncRefresh,
  normalizeLocalStoreData,
  validateBackupShape,
  normalizeBackupPayload,
  buildBackupPayloadFromLocal,
  applyBackupToLocal,
  writeRestoreMetadata,
  readRestoreMetadata,
};

if (typeof window !== 'undefined') {
  window.IsotopeLocalDataAdapter = api;
}

export {
  readAllLocalData,
  countLocalData,
  hashLocalData,
  isLocalWorkspaceEmpty,
  writeAllLocalData,
  readCollection,
  writeCollection,
  refreshAllStores,
  dispatchSyncRefresh,
  normalizeLocalStoreData,
  validateBackupShape,
  normalizeBackupPayload,
  buildBackupPayloadFromLocal,
  applyBackupToLocal,
  writeRestoreMetadata,
  readRestoreMetadata,
};
