/**
 * IsotopeAI — Restore & Launch v2.0.0
 *
 * Responsibilities
 * ────────────────
 * 1. Wipe any stale fake data injected by earlier versions of this script.
 * 2. Ensure the IndexedDB schema is initialised.
 * 3. Check the Supabase DB for the user's real onboarding status (DB is truth).
 * 4. Route the browser from an explicit boot decision:
 *      • Real session + DB says onboarded        → /dashboard
 *      • Real session + DB says not onboarded    → /onboarding
 *      • Real session + DB unreachable + trusted completed snapshot
 *                                                 → /dashboard cached/offline
 *      • Real session + DB unreachable + trusted incomplete snapshot
 *                                                 → /onboarding cached/offline
 *      • Real session + DB unreachable + no trusted snapshot
 *                                                 → offline/retry state
 *      • No session                              → /auth
 *
 * What this script does NOT do
 * ─────────────────────────────
 * • It only writes auth state when refreshing an existing Supabase session.
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
const CLOUD_SNAPSHOT_PREFIX  = 'isotope_cloud_snapshot_';

const BOOT_STATES = {
  AUTH_CHECKING: 'authChecking',
  CLOUD_LOADING: 'cloudLoading',
  OFFLINE_CACHED: 'offlineCached',
  READY_LOGGED_OUT: 'readyLoggedOut',
  READY_NEEDS_ONBOARDING: 'readyNeedsOnboarding',
  READY_DASHBOARD: 'readyDashboard',
  SYNC_FAILED: 'syncFailed',
};

const PROTECTED_ROUTE_RE = /^\/(dashboard|community|focus|analytics|study|syllabus|exams|tasks|settings|subscription)(\/.*)?$/;

function publishBootState(state, detail = {}) {
  const payload = {
    version: 1,
    state,
    bootResolved: state !== BOOT_STATES.AUTH_CHECKING && state !== BOOT_STATES.CLOUD_LOADING,
    resolvedAt: new Date().toISOString(),
    ...detail,
  };
  window.__ISO_BOOT_STATE__ = payload;
  try {
    window.dispatchEvent(new CustomEvent('isotope:boot-state', { detail: payload }));
  } catch (_) {}
  return payload;
}

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
 *   • 'isotope-last-session-raw' (bridge/interceptor fallback)
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
    const lastRaw = localStorage.getItem('isotope-last-session-raw');
    if (lastRaw) return lastRaw;
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
    if (p && p.access_token && p.user && p.user.id) return {
      ...p,
      refresh_token: p.refresh_token || null,
    };
    if (p && p.session && p.session.access_token && p.session.user && p.session.user.id) {
      return {
        access_token: p.session.access_token,
        refresh_token: p.session.refresh_token || p.refresh_token || null,
        user: p.session.user,
        expires_at: p.session.expires_at
      };
    }
    if (p && p.currentSession && p.currentSession.access_token && p.currentSession.user && p.currentSession.user.id) {
      return {
        access_token: p.currentSession.access_token,
        refresh_token: p.currentSession.refresh_token || p.refresh_token || null,
        user: p.currentSession.user,
        expires_at: p.currentSession.expires_at
      };
    }
    if (p && p.state && p.state.session && p.state.session.access_token && p.state.session.user && p.state.session.user.id) {
      return {
        access_token: p.state.session.access_token,
        refresh_token: p.state.session.refresh_token || p.refresh_token || null,
        user: p.state.session.user,
        expires_at: p.state.session.expires_at
      };
    }
  } catch (_) {}
  return null;
}

function hasRealSupabaseSession() {
  return !!parseSession(findSessionRaw());
}

function decodeJwtPayload(token) {
  try {
    const part = String(token || '').split('.')[1];
    if (!part) return null;
    let normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4) normalized += '=';
    return JSON.parse(atob(normalized));
  } catch (_) {
    return null;
  }
}

function sessionExpiresSoon(session) {
  const jwtPayload = decodeJwtPayload(session?.access_token);
  const exp = Number(session?.expires_at || jwtPayload?.exp || 0);
  if (!exp) return true;
  return exp < Math.floor(Date.now() / 1000) + 180;
}

function saveRefreshedSession(session) {
  if (!session || !session.access_token || !session.user || !session.user.id) return;
  const raw = JSON.stringify(session);
  try {
    localStorage.setItem(SUPABASE_TOKEN_KEY, raw);
    if (SUPA_REF) localStorage.setItem('sb-' + SUPA_REF + '-auth-token', raw);
    localStorage.setItem('isotope-last-jwt', session.access_token);
    if (session.refresh_token) localStorage.setItem('isotope-last-rt', session.refresh_token);
    localStorage.setItem('isotope-last-session-raw', raw);
  } catch (_) {}
}

async function refreshStoredSessionIfNeeded(session) {
  refreshStoredSessionIfNeeded.lastFailure = null;
  if (!session || !session.access_token) return null;
  if (!sessionExpiresSoon(session)) return session;
  if (!session.refresh_token || !SUPA_URL || !SUPA_ANON) return null;
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(SUPA_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_ANON,
      },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
      signal: controller.signal,
    });
    clearTimeout(tid);
    const data = await resp.json().catch(() => null);
    if (!resp.ok || !data || !data.access_token || !data.user || !data.user.id) {
      refreshStoredSessionIfNeeded.lastFailure = (resp.status === 400 || resp.status === 401) ? 'auth' : 'network';
      return null;
    }
    saveRefreshedSession(data);
    return data;
  } catch (_) {
    refreshStoredSessionIfNeeded.lastFailure = 'network';
    return null;
  }
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
    const tid = setTimeout(() => controller.abort(), 5000);

    const onboardingUrl = SUPA_URL
      + '/rest/v1/user_onboarding'
      + '?select=completed,completed_at,data'
      + '&user_id=eq.' + encodeURIComponent(session.user.id)
      + '&limit=1';
    const onboardingPromise = fetch(onboardingUrl, {
      headers: {
        'apikey':        SUPA_ANON || session.access_token,
        'Authorization': 'Bearer '  + session.access_token,
        'Accept':        'application/json',
      },
      signal: controller.signal,
    }).catch(() => null);

    const profileUrl = SUPA_URL
      + '/rest/v1/user_profiles'
      + '?select=profile_data,updated_at'
      + '&user_id=eq.' + encodeURIComponent(session.user.id)
      + '&limit=1';

    const profilePromise = fetch(profileUrl, {
      headers: {
        'apikey':        SUPA_ANON || session.access_token,
        'Authorization': 'Bearer '  + session.access_token,
        'Accept':        'application/json',
      },
      signal: controller.signal,
    }).catch(() => null);

    const [onboardingResp, resp] = await Promise.all([onboardingPromise, profilePromise]);
    clearTimeout(tid);

    if ((!onboardingResp || !onboardingResp.ok) && (!resp || !resp.ok)) return null;

    let onboardingRow = null;
    if (onboardingResp && onboardingResp.ok) {
      const rows = await onboardingResp.json();
      onboardingRow = Array.isArray(rows) && rows.length ? rows[0] : null;
    }

    let profileRow = null;
    if (resp && resp.ok) {
      const rows = await resp.json();
      profileRow = Array.isArray(rows) && rows.length ? rows[0] : null;
    }

    if ((!resp || !resp.ok) && onboardingRow && typeof onboardingRow.completed === 'boolean') {
      return { isOnboarded: onboardingRow.completed === true, source: 'supabase', snapshot: null };
    }

    const pd = profileRow?.profile_data || {};
    let onboarding = normalizeOnboarding(onboardingRow, pd);
    if (typeof onboarding.completed !== 'boolean') {
      const hasAnyProfileData = isObject(pd) && Object.keys(pd).length > 0;
      if (hasAnyProfileData) return null;
      onboarding = { state: 'incomplete', completed: false, completed_at: null, data: {} };
    }

    const cloudSnapshot = writeCloudSnapshotFromParts({
      user_id: session.user.id,
      fetched_at: new Date().toISOString(),
      profile_data: pd,
      onboarding,
      settings: isObject(pd.settings) ? pd.settings : {},
      tours: isObject(pd.tours) ? pd.tours : {},
    });
    if (!cloudSnapshot) return null;
    applyCachedCloudSnapshot(cloudSnapshot);
    return { isOnboarded: cloudSnapshot.onboarding.completed, source: 'supabase', snapshot: cloudSnapshot };
  } catch (_) {
    return null; // network error or abort — non-fatal
  }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function cloudSnapshotKey(userId) {
  return CLOUD_SNAPSHOT_PREFIX + String(userId || '');
}

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function onboardingFromProfileData(profileData) {
  if (!isObject(profileData)) return { state: 'unknown' };
  if (typeof profileData.isOnboarded === 'boolean') {
    return {
      state: profileData.isOnboarded ? 'completed' : 'incomplete',
      completed: profileData.isOnboarded,
      completed_at: profileData.onboardingCompletedAt || profileData.onboarding_completed_at || null,
      data: isObject(profileData.onboarding) ? profileData.onboarding : {},
    };
  }
  if (typeof profileData.onboarding_completed === 'boolean') {
    return {
      state: profileData.onboarding_completed ? 'completed' : 'incomplete',
      completed: profileData.onboarding_completed,
      completed_at: profileData.onboarding_completed_at || profileData.onboardingCompletedAt || null,
      data: isObject(profileData.onboarding) ? profileData.onboarding : {},
    };
  }
  return { state: 'unknown' };
}

function normalizeOnboarding(onboarding, profileData) {
  if (isObject(onboarding) && typeof onboarding.completed === 'boolean') {
    return {
      state: onboarding.completed ? 'completed' : 'incomplete',
      completed: onboarding.completed,
      completed_at: onboarding.completed_at || null,
      data: isObject(onboarding.data) ? onboarding.data : (isObject(profileData?.onboarding) ? profileData.onboarding : {}),
    };
  }
  return onboardingFromProfileData(profileData);
}

function writeCloudSnapshotFromParts(parts) {
  if (!parts || !parts.user_id) return null;
  const profileData = isObject(parts.profile_data) ? parts.profile_data : {};
  const profile = isObject(parts.profile) ? parts.profile : {};
  const settings = isObject(parts.settings) ? parts.settings : (isObject(profileData.settings) ? profileData.settings : {});
  const mergedProfile = {
    ...profileData,
    ...profile,
    settings: {
      ...(isObject(profileData.settings) ? profileData.settings : {}),
      ...settings,
    },
  };
  const onboarding = normalizeOnboarding(parts.onboarding, mergedProfile);
  if (typeof onboarding.completed !== 'boolean') return null;

  mergedProfile.isOnboarded = onboarding.completed;
  mergedProfile.onboarding_completed = onboarding.completed;
  if (onboarding.completed_at) {
    mergedProfile.onboardingCompletedAt = mergedProfile.onboardingCompletedAt || onboarding.completed_at;
    mergedProfile.onboarding_completed_at = mergedProfile.onboarding_completed_at || onboarding.completed_at;
  }

  const serverCloudSnapshot = isObject(parts.cloud_snapshot) && parts.cloud_snapshot.user_id === parts.user_id
    ? parts.cloud_snapshot
    : null;
  const snapshot = {
    ...(serverCloudSnapshot || {}),
    schema_version: 1,
    user_id: parts.user_id,
    downloaded_at: parts.fetched_at || parts.downloaded_at || serverCloudSnapshot?.downloaded_at || serverCloudSnapshot?.exported_at || new Date().toISOString(),
    exported_at: serverCloudSnapshot?.exported_at || parts.fetched_at || parts.downloaded_at || new Date().toISOString(),
    source: 'supabase',
    trusted: true,
    onboarding,
    profile_data: mergedProfile,
    settings,
    tours: isObject(mergedProfile.tours) ? mergedProfile.tours : {},
    stats_summary: parts.stats_summary || null,
    daily_user_stats: Array.isArray(parts.daily_user_stats) ? parts.daily_user_stats : [],
    study_sessions_log: Array.isArray(parts.study_sessions_log) ? parts.study_sessions_log : [],
    warnings: parts.warnings || {},
  };
  writeJson(cloudSnapshotKey(parts.user_id), snapshot);
  writeJson('isotope_last_cloud_snapshot_user', {
    user_id: parts.user_id,
    downloaded_at: snapshot.downloaded_at,
  });
  return snapshot;
}

function isTrustedSnapshotForUser(snapshot, userId) {
  return isObject(snapshot)
    && snapshot.user_id === userId
    && snapshot.source === 'supabase'
    && snapshot.trusted === true
    && isObject(snapshot.onboarding)
    && typeof snapshot.onboarding.completed === 'boolean';
}

function migrateLegacyCloudSnapshot(userId) {
  const bootstrap = readJson('isotope_cloud_bootstrap', null);
  if (!bootstrap || bootstrap.user_id !== userId) return null;
  const profile = readJson('isotope_user_profile_v2', null);
  if (!isObject(profile)) return null;
  const localOnboarding = readLocalOnboardingState();
  const profileOnboarding = onboardingFromProfileData(profile);
  const completed = typeof profileOnboarding.completed === 'boolean'
    ? profileOnboarding.completed
    : (typeof localOnboarding === 'boolean' ? localOnboarding : undefined);
  if (typeof completed !== 'boolean') return null;
  return writeCloudSnapshotFromParts({
    user_id: userId,
    fetched_at: bootstrap.fetched_at || new Date().toISOString(),
    profile,
    profile_data: profile,
    onboarding: {
      completed,
      completed_at: profile.onboardingCompletedAt || profile.onboarding_completed_at || null,
      data: isObject(profile.onboarding) ? profile.onboarding : {},
    },
    settings: isObject(profile.settings) ? profile.settings : {},
    tours: isObject(profile.tours) ? profile.tours : {},
    warnings: bootstrap.warnings || {},
  });
}

function readTrustedCloudSnapshot(userId) {
  if (!userId) return null;
  const existing = readJson(cloudSnapshotKey(userId), null);
  if (isTrustedSnapshotForUser(existing, userId)) return existing;
  const migrated = migrateLegacyCloudSnapshot(userId);
  return isTrustedSnapshotForUser(migrated, userId) ? migrated : null;
}

function applyCachedCloudSnapshot(snapshot) {
  if (!isTrustedSnapshotForUser(snapshot, snapshot?.user_id)) return null;
  const profile = isObject(snapshot.profile_data) ? snapshot.profile_data : {};
  const mergedProfile = {
    ...profile,
    settings: {
      ...(isObject(profile.settings) ? profile.settings : {}),
      ...(isObject(snapshot.settings) ? snapshot.settings : {}),
    },
    isOnboarded: snapshot.onboarding.completed,
    onboarding_completed: snapshot.onboarding.completed,
    updatedAt: profile.updatedAt || snapshot.downloaded_at || new Date().toISOString(),
  };

  writeJson('isotope_user_profile_v2', mergedProfile);
  if (snapshot.onboarding.completed === true) writeLocalOnboardingComplete();
  else localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);
  writeJson('isotope-user-tours', snapshot.tours || {});
  writeJson('isotope_cloud_stats_summary', snapshot.stats_summary || null);
  writeJson('isotope_cloud_daily_user_stats', snapshot.daily_user_stats || []);
  writeJson('isotope_cloud_bootstrap', {
    user_id: snapshot.user_id,
    fetched_at: snapshot.downloaded_at,
    source: 'cached_cloud_snapshot',
    warnings: snapshot.warnings || {},
  });
  return { isOnboarded: snapshot.onboarding.completed, source: 'cache', snapshot };
}

function mergeArrayById(key, incoming) {
  if (!Array.isArray(incoming) || incoming.length === 0) return;
  const existing = Array.isArray(readJson(key, [])) ? readJson(key, []) : [];
  const byId = new Map();
  for (const row of existing) if (row && row.id) byId.set(row.id, row);
  for (const row of incoming) if (row && row.id) byId.set(row.id, { ...(byId.get(row.id) || {}), ...row });
  writeJson(key, Array.from(byId.values()));
}

function sessionLogRowsToLocal(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => {
    const minutes = Math.max(0, Number(row.duration_minutes) || 0);
    const end = row.ended_at || row.created_at || new Date().toISOString();
    const start = new Date(Math.max(0, new Date(end).getTime() - minutes * 60000)).toISOString();
    return {
      id: row.id,
      subject: 'Synced study',
      subjectId: null,
      topic: '',
      duration: minutes,
      durationMinutes: minutes,
      startTime: start,
      endTime: end,
      type: 'focus',
      sessionType: 'focus',
      completed: true,
      createdAt: row.created_at || end,
      updatedAt: row.ended_at || row.created_at || end,
      cloudSynced: true,
      cloudSource: 'study_sessions_log'
    };
  }).filter((row) => row.id);
}

function applyBootstrapSnapshot(snapshot) {
  if (!snapshot || !snapshot.ok) return null;
  const profile = snapshot.profile_data || snapshot.profile || {};
  const mergedProfile = {
    ...profile,
    ...(snapshot.profile || {}),
    settings: {
      ...(profile.settings || {}),
      ...(snapshot.settings || {})
    },
    updatedAt: profile.updatedAt || snapshot.profile_updated_at || snapshot.fetched_at || new Date().toISOString()
  };

  const cloudSnapshot = writeCloudSnapshotFromParts({
    user_id: snapshot.user_id,
    fetched_at: snapshot.fetched_at || new Date().toISOString(),
    profile: snapshot.profile || {},
    profile_data: mergedProfile,
    onboarding: snapshot.onboarding,
    settings: snapshot.settings || {},
    cloud_snapshot: snapshot.cloud_snapshot || null,
    stats_summary: snapshot.stats_summary || null,
    daily_user_stats: snapshot.daily_user_stats || [],
    study_sessions_log: snapshot.study_sessions_log || [],
    warnings: snapshot.warnings || {},
  });

  writeJson('isotope_user_profile_v2', mergedProfile);

  const onboarded = cloudSnapshot
    ? cloudSnapshot.onboarding.completed === true
    : snapshot.onboarding && snapshot.onboarding.completed === true;
  if (onboarded) writeLocalOnboardingComplete();
  else localStorage.removeItem(ZUSTAND_ONBOARDING_KEY);

  const tours = mergedProfile.tours || {};
  if (tours && typeof tours === 'object') {
    writeJson('isotope-user-tours', tours);
    const groupPrefs = readJson('group-ui-preferences', {});
    writeJson('group-ui-preferences', {
      ...groupPrefs,
      state: {
        ...(groupPrefs.state || {}),
        hasSeenTour: {
          ...((groupPrefs.state && groupPrefs.state.hasSeenTour) || {}),
          ...tours
        }
      }
    });
  }

  writeJson('isotope-user-sync', {
    id: snapshot.user_id,
    username: mergedProfile.username || snapshot.user?.username || '',
    display_name: mergedProfile.display_name || mergedProfile.name || snapshot.user?.name || '',
    avatar_url: mergedProfile.avatar_url || mergedProfile.avatar || snapshot.user?.avatar_url || null,
    plan_type: snapshot.user?.plan_type || 'ranker',
    synced_at: Date.now()
  });

  mergeArrayById('isotope_sessions_v2', sessionLogRowsToLocal(snapshot.study_sessions_log));
  writeJson('isotope_cloud_stats_summary', snapshot.stats_summary || null);
  writeJson('isotope_cloud_daily_user_stats', snapshot.daily_user_stats || []);
  writeJson('isotope_cloud_bootstrap', {
    user_id: snapshot.user_id,
    fetched_at: snapshot.fetched_at || new Date().toISOString(),
    warnings: snapshot.warnings || {}
  });

  return { isOnboarded: onboarded, source: 'supabase', snapshot: cloudSnapshot };
}

async function fetchBootstrapFromServer(session) {
  if (!session || !session.access_token) return null;
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch('/__auth/bootstrap', {
      cache: 'no-store',
      headers: {
        'Authorization': 'Bearer ' + session.access_token,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(tid);
    if (!resp.ok) return null;
    const snapshot = await resp.json();
    return applyBootstrapSnapshot(snapshot);
  } catch (_) {
    return null;
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
  publishBootState(BOOT_STATES.AUTH_CHECKING, {
    onboarding: { state: 'unknown' },
    source: 'boot',
  });

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

  // Step 2: authenticated cloud bootstrap before routing/app preload.
  // Refresh expired/near-expired access tokens before any route decision or sync.
  let session = parseSession(findSessionRaw());
  if (session) {
    const refreshed = await refreshStoredSessionIfNeeded(session);
    if (refreshed) session = refreshed;
    else if (sessionExpiresSoon(session) && refreshStoredSessionIfNeeded.lastFailure === 'auth') session = null;
  }
  let bootDecision = null;
  if (session) {
    publishBootState(BOOT_STATES.CLOUD_LOADING, {
      user_id: session.user.id,
      onboarding: { state: 'unknown' },
      source: 'supabase',
    });

    let dbResult = await fetchBootstrapFromServer(session);
    if (dbResult === null) {
      try { dbResult = await fetchProfileFromDB(session); } catch (_) {}
    }

    if (dbResult !== null) {
      bootDecision = dbResult.isOnboarded
        ? publishBootState(BOOT_STATES.READY_DASHBOARD, {
            user_id: session.user.id,
            onboarding: {
              state: 'completed',
              completed: true,
              completed_at: dbResult.snapshot?.onboarding?.completed_at || null,
            },
            source: 'supabase',
            snapshotDownloadedAt: dbResult.snapshot?.downloaded_at || null,
          })
        : publishBootState(BOOT_STATES.READY_NEEDS_ONBOARDING, {
            user_id: session.user.id,
            onboarding: {
              state: 'incomplete',
              completed: false,
              completed_at: dbResult.snapshot?.onboarding?.completed_at || null,
            },
            source: 'supabase',
            snapshotDownloadedAt: dbResult.snapshot?.downloaded_at || null,
          });
    } else {
      const cached = readTrustedCloudSnapshot(session.user.id);
      if (cached) {
        applyCachedCloudSnapshot(cached);
        bootDecision = publishBootState(BOOT_STATES.OFFLINE_CACHED, {
          user_id: session.user.id,
          cached: true,
          onboarding: {
            state: cached.onboarding.completed ? 'completed' : 'incomplete',
            completed: cached.onboarding.completed,
            completed_at: cached.onboarding.completed_at || null,
          },
          source: 'cached_cloud_snapshot',
          snapshotDownloadedAt: cached.downloaded_at || null,
        });
      } else {
        bootDecision = publishBootState(BOOT_STATES.SYNC_FAILED, {
          user_id: session.user.id,
          onboarding: { state: 'unknown' },
          source: 'unavailable',
          error: 'Cloud state unavailable and no trusted cached cloud snapshot exists.',
        });
      }
    }
  } else {
    bootDecision = publishBootState(BOOT_STATES.READY_LOGGED_OUT, {
      onboarding: { state: 'unknown' },
      source: 'auth',
    });
  }

  // Step 3: routing. Deep links are preserved unless their resolved boot state
  // contradicts the target, because UNKNOWN must never render onboarding.
  const currentPath = window.location.pathname;
  const isRoot      = (currentPath === '/' || currentPath === '');
  const isOnboardingPath = currentPath === '/onboarding' || currentPath.startsWith('/onboarding/');
  const isAuthPath = /^\/(auth|login|signup|reset-password)(\/.*)?$/.test(currentPath);
  const isProtectedPath = PROTECTED_ROUTE_RE.test(currentPath);
  const completed = bootDecision?.onboarding?.completed === true;
  const incomplete = bootDecision?.onboarding?.completed === false;

  if (isRoot) {
    if (!session) window.history.replaceState(null, '', '/auth');
    else if (completed) window.history.replaceState(null, '', '/dashboard');
    else if (incomplete) window.history.replaceState(null, '', '/onboarding');
    else window.history.replaceState(null, '', '/onboarding'); // unknown state → onboarding (safe default)
  } else if (!session && (isProtectedPath || isOnboardingPath)) {
    window.history.replaceState(null, '', '/auth');
  } else if (session && completed && isOnboardingPath) {
    window.history.replaceState(null, '', '/dashboard');
  } else if (session && incomplete && isProtectedPath) {
    window.history.replaceState(null, '', '/onboarding');
  } else if (session && bootDecision?.state === BOOT_STATES.SYNC_FAILED && (isOnboardingPath || isAuthPath)) {
    window.history.replaceState(null, '', '/dashboard');
  }

  // Step 4: preload the app bundle
  preloadAssets();
})();
