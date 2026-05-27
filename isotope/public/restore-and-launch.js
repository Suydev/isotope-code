
const DB_NAME = 'isotope_main';
const RESTORE_FLAG = 'isotope_restore_done_v1';

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

async function restoreData() {
  if (localStorage.getItem(RESTORE_FLAG) === '1') {
    return;
  }

  let backup;
  try {
    const res = await fetch('/backup.json');
    backup = await res.json();
  } catch (e) {
    console.warn('[restore] Could not load backup.json', e);
    return;
  }

  const data = backup.data || {};
  const profile = data.profile || {};

  const db = await openDB();

  const existingCount = await countStore(db, 'tasks');
  if (existingCount > 0) {
    db.close();
    localStorage.setItem(RESTORE_FLAG, '1');
    return;
  }

  const writes = [];

  if (data.tasks?.length)      writes.push(writeStore(db, 'tasks', data.tasks));
  if (data.subjects?.length)   writes.push(writeStore(db, 'subjects', data.subjects));
  if (data.sessions?.length)   writes.push(writeStore(db, 'sessions', data.sessions));
  if (data.habits?.length)     writes.push(writeStore(db, 'habits', data.habits));
  if (data.exams?.length)      writes.push(writeStore(db, 'exams', data.exams));
  if (data.tests?.length)      writes.push(writeStore(db, 'tests', data.tests));
  if (data.mockTests?.length)  writes.push(writeStore(db, 'mockTests', data.mockTests));
  if (data.dailyLogs?.length)  writes.push(writeStore(db, 'dailyLogs', data.dailyLogs));

  const profileRecord = {
    ...profile,
    id: profile.id || 'primary',
    isOnboarded: true,
    currentOnboardingStep: 7,
  };
  writes.push(writeStore(db, 'userProfile', [profileRecord]));

  if (data.timerState) {
    writes.push(writeStore(db, 'timerState', [{
      ...data.timerState,
      id: data.timerState.id || 'primary',
    }]));
  }

  writes.push(writeStore(db, 'migrationMeta', [
    { key: 'indexeddb_migration_complete_v3', value: true, migratedAt: Date.now() }
  ]));

  await Promise.all(writes);
  db.close();

  const userObj = {
    id: 'local-primary',
    userId: 'local-primary',
    name: profile.name || 'Suyash',
    username: profile.username || 'Suyash',
    email: 'local@isotopeai',
    isLocal: true,
    isOnboarded: true,
    isPremium: true,
    subscriptionTier: 'pro',
    avatar: profile.avatar || null,
    bio: profile.bio || '',
    academic: profile.academic || {},
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const authState = { state: { user: userObj, isAuthenticated: true, sessionType: 'local' }, version: 0 };
  localStorage.setItem('isotope-auth', JSON.stringify(authState));

  const onboardingState = { state: { isOnboarded: true, currentStep: 7, completedAt: profile.onboardingCompletedAt || new Date().toISOString() }, version: 0 };
  localStorage.setItem('isotope-onboarding', JSON.stringify(onboardingState));

  localStorage.setItem('isotope_intro_seen', 'true');
  localStorage.setItem('indexeddb_migration_complete_v3', 'true');
  localStorage.setItem('pwa-banner-dismissed', 'true');
  localStorage.setItem('pwa-install-dismissed', 'true');
  localStorage.setItem(RESTORE_FLAG, '1');

  console.log('[restore] Data restored from backup successfully');
}

(async () => {
  try {
    await restoreData();
  } catch (e) {
    console.warn('[restore] Restore failed, loading app anyway', e);
  }

  // Navigate to dashboard so React Router starts there, not the landing page
  if (window.location.pathname === '/' || window.location.pathname === '') {
    window.history.replaceState(null, '', '/dashboard');
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
