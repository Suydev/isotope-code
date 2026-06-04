/**
 * IsotopeAI — Restore & Launch v2.0.0
 *
 * Responsibilities
 * ────────────────
 * 1. Wipe any stale fake data injected by earlier versions of this script.
 * 2. Ensure the IndexedDB schema is initialised.
 * 3. Check the Supabase DB for the user's real onboarding status (DB is truth).
 * 4. Route the browser:
 *      • Real session + DB says onboarded   →  /dashboard
 *      • Real session + DB says not onboarded → /onboarding (wizard)
 *      • No session                           →  /onboarding (sign-in/sign-up)
 *
 * What this script does NOT do
 * ─────────────────────────────
 * • It does NOT write any auth state.
 * • It does NOT write any onboarding state.
 * • Everything auth-related is owned exclusively by Supabase + the app.
 */

// ── Config ─────────────────────────────────────────────────────────────────

// Injected by server at serve-time (see ORIGIN_SCRIPT in server.mjs)
const SUPA_URL  = (typeof window.__ISO_SUPA_URL__ !== 'undefined' && window.__ISO_SUPA_URL__)
                  || '';
const SUPA_ANON = (typeof window.__ISO_ANON__ !== 'undefined' && window.__ISO_ANON__)
                  || '';

const DB_NAME    = 'isotope_main';
const SCHEMA_KEY = 'isotope_schema_init_v2';

// Both localStorage keys that may hold a Supabase session
const SUPABASE_TOKEN_KEY = 'isotope-auth-token';       // legacy app key
const SUPA_REF           = (() => {
  try { return new URL(SUPA_URL).hostname.split('.')[0] || ''; }
  catch (_) { return ''; }
})();

// Zustand store keys
const ZUSTAND_AUTH_KEY       = 'isotope-auth';
const ZUSTAND_ONBOARDING_KEY = 'isotope-onboarding';

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
    tx.onerror    = resolve;
  });
}

// ── Session helpers ─────────────────────────────────────────────────────────

/**
 * Scan localStorage for any Supabase session. Checks:
 *   • 'isotope-auth-token'      (legacy app key)
 *   • 'sb-{ref}-auth-token'     (Supabase JS v2 standard)
 *   • any key matching sb-*-auth-token pattern
 */
function findSessionRaw() {
  try {
    const legacy = localStorage.getItem(SUPABASE_TOKEN_KEY);
    if (legacy) return legacy;
    if (SUPA_REF) {
      const standard = localStorage.getItem('sb-' + SUPA_REF + '-auth-token');
      if (standard) return standard;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
        const v = localStorage.getItem(k);
        if (v) return v;
      }
    }
  } catch (_) {}
  return null;
}

function parseSession(raw) {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    if (p && p.access_token && p.user && p.user.id) return p;
    if (p && p.session && p.session.access_token && p.session.user && p.session.user.id) {
      return { access_token: p.session.access_token, user: p.session.user, expires_at: p.session.expires_at };
    }
  } catch (_) {}
  return null;
}

function hasRealSupabaseSession() {
  return !!parseSession(findSessionRaw());
}

function readLocalOnboardingState() {
  try {
    const raw = localStorage.getItem(ZUSTAND_ONBOARDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.isOnboarded === true || parsed?.state?.isOnboarded === true) return true;
    if (parsed?.isOnboarded === false || parsed?.state?.isOnboarded === false) return false;
  } catch (_) {}
  return null;
}

function writeLocalOnboardingComplete() {
  try {
    localStorage.setItem(ZUSTAND_ONBOARDING_KEY, JSON.stringify({
      isOnboarded: true,
      state: { isOnboarded: true, currentOnboardingStep: 7 },
      version: 0
    }));
  } catch (_) {}
}

// ── DB onboarding check (authoritative) ────────────────────────────────────

/**
 * Fetch onboarding state from Supabase.
 * Returns:
 *   { isOnboarded: true/false } — when DB responded
 *   null — on network error / timeout
 *
 * Uses the user's own access_token so no service_role key needed here.
 * Times out after 3 seconds so it doesn't slow down page load.
 */
async function fetchProfileFromDB(session) {
  if (!SUPA_URL || !session || !session.user || !session.user.id) return null;
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 3000);

    const onboardingUrl = SUPA_URL
      + '/rest/v1/user_onboarding'
      + '?select=completed,completed_at'
      + '&user_id=eq.' + encodeURIComponent(session.user.id)
      + '&limit=1';
    const onboardingResp = await fetch(onboardingUrl, {
      headers: {
        'apikey':        SUPA_ANON || session.access_token,
        'Authorization': 'Bearer '  + session.access_token,
        'Accept':        'application/json',
      },
      signal: controller.signal,
    });
    if (onboardingResp.ok) {
      clearTimeout(tid);
      const rows = await onboardingResp.json();
      if (Array.isArray(rows) && rows.length) {
        return { isOnboarded: rows[0]?.completed === true };
      }
    }

    const profileUrl = SUPA_URL
      + '/rest/v1/user_profiles'
      + '?select=profile_data'
      + '&user_id=eq.' + encodeURIComponent(session.user.id)
      + '&limit=1';

    const resp = await fetch(profileUrl, {
      headers: {
        'apikey':        SUPA_ANON || session.access_token,
        'Authorization': 'Bearer '  + session.access_token,
        'Accept':        'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(tid);
    if (!resp.ok) return null;
    const rows = await resp.json();
    const pd = rows?.[0]?.profile_data;
    if (pd === undefined) return null; // row not found
    return { isOnboarded: pd?.isOnboarded === true };
  } catch (_) {
    return null; // network error or abort — non-fatal
  }
}

// ── Stale-data purge ────────────────────────────────────────────────────────

function isStaleLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const state  = parsed?.state || {};
    if (key === ZUSTAND_AUTH_KEY && state.sessionType === 'local') return true;
    if (key === ZUSTAND_ONBOARDING_KEY && !hasRealSupabaseSession()) {
      if (state.isOnboarded === true) return true;
      if ((state.currentOnboardingStep || 0) >= 7) return true;
    }
    return false;
  } catch (_) { return false; }
}

async function purgeStaleFakeData() {
  if (isStaleLocal(ZUSTAND_AUTH_KEY))       localStorage.removeItem(ZUSTAND_AUTH_KEY);
  if (isStaleLocal(ZUSTAND_ONBOARDING_KEY)) localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);

  const oldKeys = ['isotope_restore_done_v1', 'isotope_launched_v2'];
  for (const k of oldKeys) {
    if (localStorage.getItem(k)) localStorage.removeItem(k);
  }

  if (!hasRealSupabaseSession()) {
    try {
      const db = await openDB();
      await clearStore(db, 'userProfile');
      await clearStore(db, 'migrationMeta');
      db.close();
    } catch (_) {}
  }
}

// ── Schema bootstrap ────────────────────────────────────────────────────────

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
    console.warn('[isotope] Schema init warning:', e);
  }
}

// ── Asset preload ───────────────────────────────────────────────────────────

function preloadAssets() {
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
}

// ── Main ────────────────────────────────────────────────────────────────────

(async () => {
  if (window.location.pathname !== '/demo') {
    try { sessionStorage.removeItem('isotope-demo-mode'); } catch (_) {}
  }

  // Step 1: clean up any stale / fake data from old script versions
  try {
    await purgeStaleFakeData();
    await ensureSchema();
  } catch (e) {
    console.warn('[isotope] Startup cleanup warning:', e);
  }

  // Step 2: routing — only on the root path (deep links pass through untouched)
  const currentPath = window.location.pathname;
  const isRoot      = (currentPath === '/' || currentPath === '');

  if (isRoot) {
    const session = parseSession(findSessionRaw());

    if (!session) {
      // No session → always show sign-in / sign-up page
      window.history.replaceState(null, '', '/onboarding');
    } else {
      // Has session — ask the DB whether onboarding is actually complete.
      // DB is the authoritative source; local Zustand state may be stale.
      let dbResult = null;
      try {
        dbResult = await fetchProfileFromDB(session);
      } catch (_) {}

      if (dbResult !== null) {
        // DB answered
        if (!dbResult.isOnboarded) {
          // DB says NOT onboarded — clear any stale local "onboarded" flag
          // so the app starts fresh and shows the wizard
          localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);
          window.history.replaceState(null, '', '/onboarding');
        } else {
          writeLocalOnboardingComplete();
          window.history.replaceState(null, '', '/dashboard');
        }
      } else {
        // DB unreachable (offline / slow). Keep returning users out of the
        // wizard if this device already has a completed onboarding marker.
        window.history.replaceState(
          null,
          '',
          readLocalOnboardingState() === true ? '/dashboard' : '/onboarding'
        );
      }
    }
  }

  // Step 3: preload the app bundle
  preloadAssets();
})();
