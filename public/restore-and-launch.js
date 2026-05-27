/**
 * IsotopeAI — Restore & Launch
 * On first install, starts a clean session so the app's own onboarding runs.
 * No personal defaults are pre-loaded. Personal data has been removed.
 */

const DB_NAME = 'isotope_main';
const RESTORE_FLAG = 'isotope_restore_done_v2';

const DB_SCHEMA = {
  tasks:        { keyPath: 'id' },
  subjects:     { keyPath: 'id' },
  sessions:     { keyPath: 'id' },
  habits:       { keyPath: 'id' },
  tests:        { keyPath: 'id' },
  exams:        { keyPath: 'id' },
  mockTests:    { keyPath: 'id' },
  dailyLogs:    { keyPath: 'id' },
  userProfile:  { keyPath: 'id' },
  timerState:   { keyPath: 'id' },
  syncMetadata: { keyPath: 'collection' },
  migrationMeta:{ keyPath: 'key' },
  kv:           { keyPath: 'key' },
};

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 20);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const [name, opts] of Object.entries(DB_SCHEMA)) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: opts.keyPath });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function writeStore(db, storeName, records) {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(storeName)) { resolve(); return; }
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const rec of records) {
      store.put(rec);
    }
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(new Error('Transaction aborted'));
  });
}

function countStore(db, storeName) {
  return new Promise((resolve) => {
    if (!db.objectStoreNames.contains(storeName)) { resolve(0); return; }
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(0);
  });
}

/**
 * initFirstInstall — sets up the IndexedDB schema and marks migration complete.
 * Does NOT load any personal data, does NOT skip onboarding.
 * The app's built-in onboarding flow runs on first launch.
 */
async function initFirstInstall() {
  if (localStorage.getItem(RESTORE_FLAG) === '1') return;

  const db = await openDB();
  const existingTasks = await countStore(db, 'tasks');

  if (existingTasks > 0) {
    db.close();
    localStorage.setItem(RESTORE_FLAG, '1');
    return;
  }

  // Mark migration metadata so the app's schema checks pass
  await writeStore(db, 'migrationMeta', [
    { key: 'indexeddb_migration_complete_v3', value: true, migratedAt: Date.now() }
  ]);
  db.close();

  localStorage.setItem('indexeddb_migration_complete_v3', 'true');
  localStorage.setItem(RESTORE_FLAG, '1');

  // Do NOT set isotope-auth, isotope-onboarding, or isotope_intro_seen.
  // Leaving these unset triggers the app's built-in first-time onboarding flow.
  console.log('[isotope] Fresh install — onboarding will run');
}

(async () => {
  try {
    await initFirstInstall();
  } catch (e) {
    console.warn('[isotope] Init failed, loading app anyway', e);
  }

  const link1 = document.createElement('link');
  link1.rel = 'modulepreload';
  link1.crossOrigin = '';
  link1.href = '/assets/vendor-react-BfU3Zn2J.js';
  document.head.appendChild(link1);

  const script = document.createElement('script');
  script.type = 'module';
  script.crossOrigin = '';
  script.src = '/assets/index-BPYJFSVW.js';
  document.head.appendChild(script);
})();
