/**
 * IsotopeAI — Restore & Launch v1.4.0
 *
 * Responsibilities
 * ────────────────
 * 1. Wipe any stale FAKE data injected by earlier versions of this script
 *    (session-type "local", fake isOnboarded flags, etc.)
 * 2. Ensure the IndexedDB schema is initialised (so the app never hits a
 *    missing-object-store error on first load).
 * 3. Route the browser:
 *      • Real Supabase session present  →  /dashboard
 *      • No session (new / signed-out)  →  /onboarding  (Google Sign-In)
 *
 * What this script does NOT do
 * ─────────────────────────────
 * • It does NOT write any auth state.
 * • It does NOT write any onboarding state.
 * • It does NOT touch the Supabase client.
 * Everything auth-related is owned exclusively by Supabase + the app's own
 * Zustand stores.
 */

// ── Constants ──────────────────────────────────────────────────────────────

const DB_NAME    = 'isotope_main';
const SCHEMA_KEY = 'isotope_schema_init_v2';   // bump version so re-init runs once

// Supabase's raw JWT storage key (found in compiled App bundle)
const SUPABASE_TOKEN_KEY = 'isotope-auth-token';

// Zustand store keys our old scripts polluted
const ZUSTAND_AUTH_KEY       = 'isotope-auth';       // useAuthStore
const ZUSTAND_ONBOARDING_KEY = 'isotope-onboarding'; // useOnboardingStore

const DB_SCHEMA = {
  tasks:         { keyPath: 'id' },
  subjects:      { keyPath: 'id' },
  sessions:      { keyPath: 'id' },
  habits:        { keyPath: 'id' },
  tests:         { keyPath: 'id' },
  exams:         { keyPath: 'id' },
  mockTests:     { keyPath: 'id' },
  dailyLogs:     { keyPath: 'id' },
  userProfile:   { keyPath: 'id' },
  timerState:    { keyPath: 'id' },
  syncMetadata:  { keyPath: 'collection' },
  migrationMeta: { keyPath: 'key' },
  kv:            { keyPath: 'key' },
};

// ── IndexedDB helpers ──────────────────────────────────────────────────────

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
    req.onerror   = () => reject(req.error);
  });
}

function writeStore(db, storeName, records) {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(storeName)) { resolve(); return; }
    const tx    = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const rec of records) store.put(rec);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
    tx.onabort    = () => reject(new Error('aborted'));
  });
}

function clearStore(db, storeName) {
  return new Promise((resolve) => {
    if (!db.objectStoreNames.contains(storeName)) { resolve(); return; }
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    tx.oncomplete = resolve;
    tx.onerror    = resolve; // non-fatal
  });
}

// ── Detect & wipe stale fake data ─────────────────────────────────────────

/**
 * Returns true if the localStorage value was written by our old fake-auth
 * scripts (i.e. has sessionType:'local' or step 7 with no real session).
 */
function isStaleLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const state  = parsed?.state || {};
    // Auth store: fake if sessionType is 'local'
    if (key === ZUSTAND_AUTH_KEY && state.sessionType === 'local') return true;
    // Onboarding store: fake if we wrote isOnboarded:true + step 7 with no real session
    if (key === ZUSTAND_ONBOARDING_KEY) {
      const hasRealSession = !!localStorage.getItem(SUPABASE_TOKEN_KEY);
      if (!hasRealSession && state.isOnboarded === true) return true;
      // Even with a session: if currentStep is exactly 7 AND completedAt was set
      // by our old script, we must trust the server — so we clean it up to let
      // the app re-fetch the real onboarding state from Supabase.
      if (!hasRealSession && state.currentStep >= 7) return true;
    }
    return false;
  } catch (_) { return false; }
}

async function purgeStaleFakeData() {
  // 1. Remove fake Zustand stores
  if (isStaleLocal(ZUSTAND_AUTH_KEY)) {
    localStorage.removeItem(ZUSTAND_AUTH_KEY);
  }
  if (isStaleLocal(ZUSTAND_ONBOARDING_KEY)) {
    localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);
  }

  // 2. Remove other fake keys from old script versions
  const fakeKeys = [
    'isotope_restore_done_v1',
    'isotope_launched_v2',
  ];
  for (const k of fakeKeys) {
    if (localStorage.getItem(k)) localStorage.removeItem(k);
  }

  // 3. Clear fake userProfile from IndexedDB (old scripts wrote isOnboarded:true)
  const hasRealSession = !!localStorage.getItem(SUPABASE_TOKEN_KEY);
  if (!hasRealSession) {
    try {
      const db = await openDB();
      await clearStore(db, 'userProfile');
      await clearStore(db, 'migrationMeta');
      db.close();
    } catch (_) {}
  }
}

// ── Schema bootstrap (first-run only) ─────────────────────────────────────

async function ensureSchema() {
  if (localStorage.getItem(SCHEMA_KEY) === '1') return;
  try {
    const db = await openDB();
    await writeStore(db, 'migrationMeta', [
      { key: 'indexeddb_migration_complete_v3', value: true, migratedAt: Date.now() }
    ]);
    db.close();
    localStorage.setItem('indexeddb_migration_complete_v3', 'true');
    localStorage.setItem(SCHEMA_KEY, '1');
  } catch (e) {
    console.warn('[isotope] Schema error:', e);
  }
}

// ── Routing helper ─────────────────────────────────────────────────────────

function hasRealSupabaseSession() {
  try {
    const raw = localStorage.getItem(SUPABASE_TOKEN_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    // Supabase stores { access_token, refresh_token, ... }
    return !!(parsed?.access_token || parsed?.access_token === '');
  } catch (_) {
    return !!localStorage.getItem(SUPABASE_TOKEN_KEY);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

(async () => {
  try {
    await purgeStaleFakeData();
    await ensureSchema();
  } catch (e) {
    console.warn('[isotope] Startup cleanup warning:', e);
  }

  // Route on root only — deep links (e.g. /reset-password) must pass through
  const path = window.location.pathname;
  if (path === '/' || path === '') {
    const dest = hasRealSupabaseSession() ? '/dashboard' : '/onboarding';
    window.history.replaceState(null, '', dest);
  }

  // Preload the vendor chunk, then bootstrap the app bundle
  const link       = document.createElement('link');
  link.rel         = 'modulepreload';
  link.crossOrigin = '';
  link.href        = '/assets/vendor-react-BfU3Zn2J.js';
  document.head.appendChild(link);

  const script       = document.createElement('script');
  script.type        = 'module';
  script.crossOrigin = '';
  script.src         = '/assets/index-BPYJFSVW.js';
  document.head.appendChild(script);
})();
