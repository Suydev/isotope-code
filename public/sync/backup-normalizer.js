const COLLECTION_KEYS = [
  'profile',
  'timerState',
  'tasks',
  'sessions',
  'subjects',
  'habits',
  'dailyLogs',
  'tests',
  'exams',
  'mockTests',
];

const ARRAY_COLLECTION_KEYS = [
  'tasks',
  'sessions',
  'subjects',
  'habits',
  'dailyLogs',
  'tests',
  'exams',
  'mockTests',
];

const TOMBSTONE_COLLECTION_KEYS = [...COLLECTION_KEYS];

const RICH_COLLECTION_KEYS = [
  'tasks',
  'sessions',
  'subjects',
  'habits',
  'tests',
  'exams',
  'mockTests',
];

function parseJsonInput(input) {
  if (typeof input !== 'string') return input;
  const text = input.trim();
  if (!text) return null;
  return JSON.parse(text);
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(value).sort().map((key) => (
    JSON.stringify(key) + ':' + stableStringify(value[key])
  )).join(',') + '}';
}

function hashTextFallback(text) {
  let h1 = 2166136261;
  let h2 = 16777619;
  const str = String(text || '');
  for (let i = 0; i < str.length; i += 1) {
    const code = str.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 16777619);
    h2 = Math.imul(h2 ^ code, 2246822519);
  }
  return (h1 >>> 0).toString(16).padStart(8, '0')
    + (h2 >>> 0).toString(16).padStart(8, '0')
    + ':' + str.length;
}

function dataSizeBytes(value) {
  try {
    if (typeof Buffer !== 'undefined') return Buffer.byteLength(typeof value === 'string' ? value : JSON.stringify(value || {}));
  } catch {}
  try {
    return new Blob([typeof value === 'string' ? value : JSON.stringify(value || {})]).size;
  } catch {}
  return String(typeof value === 'string' ? value : JSON.stringify(value || {})).length;
}

function cleanObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function cleanArray(value) {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') : [];
}

function emptyDataShape() {
  return {
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
}

function emptyTombstoneShape() {
  return Object.fromEntries(TOMBSTONE_COLLECTION_KEYS.map((key) => [key, []]));
}

function normalizeTombstoneEntry(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return { id: String(value), deletedAt: null };
  }
  if (!value || typeof value !== 'object') return null;
  const id = value.id || value._id || value.record_id || value.recordId;
  if (!id) return null;
  return {
    id: String(id),
    deletedAt: value.deletedAt || value.deleted_at || value.timestamp || null,
  };
}

function normalizeTombstones(...sources) {
  const out = emptyTombstoneShape();
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    for (const key of TOMBSTONE_COLLECTION_KEYS) {
      const entries = Array.isArray(source[key]) ? source[key] : [];
      const byId = new Map(out[key].map((entry) => [entry.id, entry]));
      for (const value of entries) {
        const incoming = normalizeTombstoneEntry(value);
        if (!incoming) continue;
        const existing = byId.get(incoming.id);
        if (!existing || meaningfulTimestamp(incoming.deletedAt) >= meaningfulTimestamp(existing.deletedAt)) {
          byId.set(incoming.id, incoming);
        }
      }
      out[key] = Array.from(byId.values());
    }
  }
  return out;
}

function hasTombstones(tombstones) {
  return TOMBSTONE_COLLECTION_KEYS.some((key) => (tombstones?.[key] || []).length > 0);
}

function getBackupMetadata(normalizedOrRaw) {
  if (normalizedOrRaw?.collection_counts && normalizedOrRaw?.data) {
    return {
      tombstones: normalizeTombstones(normalizedOrRaw.tombstones),
      intentional_empty: normalizedOrRaw.intentional_empty === true || normalizedOrRaw.operation === 'reset',
      operation: normalizedOrRaw.operation || null,
      reset_at: normalizedOrRaw.reset_at || null,
    };
  }
  const raw = normalizedOrRaw?.raw || normalizedOrRaw || {};
  const localBackup = cleanObject(raw.local_backup);
  const operation = raw.operation || localBackup?.operation || raw.data?.operation || null;
  const intentionalEmpty = raw.intentional_empty === true
    || localBackup?.intentional_empty === true
    || raw.data?.intentional_empty === true
    || operation === 'reset';
  return {
    tombstones: normalizeTombstones(
      raw.tombstones,
      raw.deletions,
      raw.data?.tombstones,
      localBackup?.tombstones,
      localBackup?.data?.tombstones,
    ),
    intentional_empty: intentionalEmpty,
    operation: intentionalEmpty ? 'reset' : operation,
    reset_at: raw.reset_at || raw.resetAt || localBackup?.reset_at || localBackup?.resetAt || null,
  };
}

function normalizeDataShape(...sources) {
  const out = emptyDataShape();
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    const profile = cleanObject(source.profile) || cleanObject(source.userProfile) || cleanObject(source.profile_data);
    const timerState = cleanObject(source.timerState) || cleanObject(source.timer_state);
    if (profile) out.profile = { ...(out.profile || {}), ...profile };
    if (timerState) out.timerState = { ...(out.timerState || {}), ...timerState };
    for (const key of ARRAY_COLLECTION_KEYS) {
      const incoming = cleanArray(source[key]);
      if (incoming.length) out[key] = incoming;
    }
  }
  return out;
}

function meaningfulTimestamp(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function getLatestRecordTimestamp(data) {
  const normalized = normalizeDataShape(data);
  let latest = meaningfulTimestamp(normalized.profile?.updatedAt || normalized.profile?.updated_at);
  for (const key of ARRAY_COLLECTION_KEYS) {
    for (const item of normalized[key]) {
      latest = Math.max(
        latest,
        meaningfulTimestamp(item.updatedAt || item.updated_at || item.lastModified || item.createdAt || item.created_at),
      );
    }
  }
  return latest;
}

function getCollectionCounts(normalizedOrRaw) {
  const data = getBackupData(normalizedOrRaw);
  return {
    profile: data.profile ? 1 : 0,
    timerState: data.timerState ? 1 : 0,
    tasks: data.tasks.length,
    sessions: data.sessions.length,
    subjects: data.subjects.length,
    habits: data.habits.length,
    dailyLogs: data.dailyLogs.length,
    tests: data.tests.length,
    exams: data.exams.length,
    mockTests: data.mockTests.length,
  };
}

function isCountsRich(counts, sizeBytes = 0) {
  if (RICH_COLLECTION_KEYS.some((key) => Number(counts[key] || 0) > 0)) return true;
  const realCollectionCount = ARRAY_COLLECTION_KEYS.reduce((sum, key) => sum + Number(counts[key] || 0), 0);
  return sizeBytes > 100 * 1024 && realCollectionCount > 0;
}

function isCountsEmpty(counts) {
  return ARRAY_COLLECTION_KEYS.every((key) => Number(counts[key] || 0) === 0)
    && Number(counts.timerState || 0) === 0;
}

function richScoreFromCounts(counts, sizeBytes = 0) {
  const weighted =
    Number(counts.tasks || 0) * 10
    + Number(counts.sessions || 0) * 8
    + Number(counts.subjects || 0) * 10
    + Number(counts.exams || 0) * 8
    + Number(counts.tests || 0) * 8
    + Number(counts.mockTests || 0) * 8
    + Number(counts.habits || 0) * 5
    + Number(counts.dailyLogs || 0) * 2
    + Number(counts.profile || 0)
    + Number(counts.timerState || 0);
  return (isCountsRich(counts, sizeBytes) ? 100000 : 0) + weighted + Math.min(5000, Math.floor(sizeBytes / 1024));
}

function normalizeAnyBackup(input, meta = {}) {
  const raw = parseJsonInput(input);
  if (!raw || typeof raw !== 'object') {
    return {
      valid: false,
      kind: 'invalid',
      reason: 'Backup JSON must be an object',
      data: emptyDataShape(),
      collection_counts: getCollectionCounts({ data: emptyDataShape() }),
      exported_at: null,
      size: dataSizeBytes(input || ''),
      source_path: meta.source_path || meta.path || null,
    };
  }

  const localBackup = cleanObject(raw.local_backup);
  const localBackupData = cleanObject(localBackup?.data);
  const rawData = cleanObject(raw.data);
  const backupData = cleanObject(raw.backup_data);
  const localCollections = cleanObject(raw.local_collections);
  const profileData = cleanObject(raw.profile_data);
  const data = normalizeDataShape(
    rawData,
    localBackupData,
    backupData,
    localCollections,
    profileData ? { profile: profileData } : null,
  );
  const kind = raw.schema_version === 1
    ? 'cloud_snapshot'
    : ((raw.version === 1 && (raw.source === 'isotopeai' || raw.source === 'isotope-study')) ? 'local_backup_v1' : 'unknown');
  const exportedAt = raw.exported_at
    || raw.exportedAt
    || localBackup?.exportedAt
    || raw.downloaded_at
    || meta.exported_at
    || meta.updated_at
    || null;
  const appVersion = raw.app_version || raw.appVersion || localBackup?.appVersion || null;
  const size = Number(meta.size_bytes || meta.size || 0) || dataSizeBytes(input);
  const counts = getCollectionCounts({ data });
  const meaningfulDataAt = getLatestRecordTimestamp(data);
  const backupMetadata = getBackupMetadata(raw);
  const normalized = {
    valid: kind !== 'unknown'
      || ARRAY_COLLECTION_KEYS.some((key) => data[key].length > 0)
      || !!data.profile
      || backupMetadata.intentional_empty
      || hasTombstones(backupMetadata.tombstones),
    kind,
    exported_at: exportedAt,
    app_version: appVersion,
    profile: data.profile,
    data,
    collection_counts: counts,
    hash: meta.hash || hashBackup(raw),
    size,
    size_bytes: size,
    source_path: meta.source_path || meta.path || null,
    bucket: meta.bucket || null,
    updated_at: meta.updated_at || null,
    meaningful_data_at: meaningfulDataAt ? new Date(meaningfulDataAt).toISOString() : null,
    tombstones: backupMetadata.tombstones,
    intentional_empty: backupMetadata.intentional_empty,
    operation: backupMetadata.operation,
    reset_at: backupMetadata.reset_at,
    raw,
  };
  normalized.empty = isBackupEmpty(normalized);
  normalized.rich = isBackupRich(normalized);
  normalized.rich_score = richScoreFromCounts(counts, size);
  normalized.reason = normalized.intentional_empty
    ? 'intentional empty reset'
    : (normalized.rich ? 'rich backup' : (normalized.empty ? 'profile-only or empty backup' : 'valid sparse backup'));
  return normalized;
}

function getBackupData(normalizedOrRaw) {
  if (normalizedOrRaw && normalizedOrRaw.data && COLLECTION_KEYS.every((key) => key in normalizedOrRaw.data)) {
    return normalizeDataShape(normalizedOrRaw.data);
  }
  if (normalizedOrRaw && normalizedOrRaw.collection_counts && normalizedOrRaw.raw) {
    return normalizeAnyBackup(normalizedOrRaw.raw).data;
  }
  return normalizeAnyBackup(normalizedOrRaw).data;
}

function hashBackup(normalizedOrRaw) {
  const value = normalizedOrRaw?.raw || normalizedOrRaw;
  return hashTextFallback(stableStringify(value || {}));
}

function isBackupRich(normalized) {
  const n = normalized?.collection_counts ? normalized : normalizeAnyBackup(normalized);
  return isCountsRich(n.collection_counts || {}, Number(n.size_bytes || n.size || 0));
}

function isBackupEmpty(normalized) {
  const n = normalized?.collection_counts ? normalized : normalizeAnyBackup(normalized);
  return isCountsEmpty(n.collection_counts || {});
}

function candidateTime(candidate) {
  return Math.max(
    meaningfulTimestamp(candidate.meaningful_data_at),
    meaningfulTimestamp(candidate.exported_at),
    meaningfulTimestamp(candidate.updated_at),
    meaningfulTimestamp(candidate.created_at),
  );
}

function compareBackupCandidates(a, b) {
  const left = a?.normalized || a;
  const right = b?.normalized || b;
  if (!left && !right) return 0;
  if (left && !right) return 1;
  if (!left && right) return -1;
  if (left.valid && !right.valid) return 1;
  if (!left.valid && right.valid) return -1;
  if (left.intentional_empty && !right.intentional_empty) {
    const resetDelta = meaningfulTimestamp(left.reset_at || left.exported_at) - candidateTime(right);
    if (resetDelta >= 0) return 1;
  }
  if (!left.intentional_empty && right.intentional_empty) {
    const resetDelta = meaningfulTimestamp(right.reset_at || right.exported_at) - candidateTime(left);
    if (resetDelta >= 0) return -1;
  }
  if (left.rich && right.empty) return 1;
  if (left.empty && right.rich) return -1;
  if (left.rich && !right.rich) return 1;
  if (!left.rich && right.rich) return -1;
  const timeDelta = candidateTime(left) - candidateTime(right);
  if (timeDelta > 0) return 1;
  if (timeDelta < 0) return -1;
  const scoreDelta = Number(left.rich_score || 0) - Number(right.rich_score || 0);
  if (scoreDelta > 0) return 1;
  if (scoreDelta < 0) return -1;
  const sizeDelta = Number(left.size_bytes || left.size || 0) - Number(right.size_bytes || right.size || 0);
  if (sizeDelta > 0) return 1;
  if (sizeDelta < 0) return -1;
  return 0;
}

function latestRecordTime(record) {
  return meaningfulTimestamp(record?.updatedAt || record?.updated_at || record?.lastModified || record?.createdAt || record?.created_at);
}

function tombstoneWins(tombstone, record) {
  const deletedAt = meaningfulTimestamp(tombstone?.deletedAt);
  const recordTime = latestRecordTime(record);
  return deletedAt === 0 || recordTime === 0 || deletedAt >= recordTime;
}

function mergeById(localRecords, cloudRecords) {
  const out = new Map();
  const push = (record, source) => {
    if (!record || typeof record !== 'object') return;
    const id = record.id || record._id || null;
    if (!id) {
      out.set(source + ':' + stableStringify(record), record);
      return;
    }
    const existing = out.get(id);
    if (!existing) {
      out.set(id, record);
      return;
    }
    const existingTime = latestRecordTime(existing);
    const incomingTime = latestRecordTime(record);
    if (!existingTime || incomingTime >= existingTime) {
      out.set(id, { ...existing, ...record });
    }
  };
  for (const record of cleanArray(cloudRecords)) push(record, 'cloud');
  for (const record of cleanArray(localRecords)) push(record, 'local');
  return Array.from(out.values());
}

function nonEmptyObjectMerge(base, overlay) {
  const out = { ...(base || {}) };
  for (const [key, value] of Object.entries(overlay || {})) {
    if (value === undefined) continue;
    if (value === null || value === '') {
      if (!(key in out)) out[key] = value;
      continue;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = nonEmptyObjectMerge(out[key] && typeof out[key] === 'object' ? out[key] : {}, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function mergeBackupData(local, cloud) {
  const localNormalized = normalizeAnyBackup(local || {});
  const cloudNormalized = normalizeAnyBackup(cloud || {});
  const localData = localNormalized.data;
  const cloudData = cloudNormalized.data;
  const resetCandidates = [localNormalized, cloudNormalized]
    .filter((item) => item.intentional_empty)
    .sort((a, b) => meaningfulTimestamp(b.reset_at || b.exported_at) - meaningfulTimestamp(a.reset_at || a.exported_at));
  const winningReset = resetCandidates[0] || null;
  if (winningReset) {
    const other = winningReset === localNormalized ? cloudNormalized : localNormalized;
    const resetTime = meaningfulTimestamp(winningReset.reset_at || winningReset.exported_at);
    const otherTime = Math.max(getLatestRecordTimestamp(other.data), meaningfulTimestamp(other.exported_at));
    if (resetTime === 0 || resetTime >= otherTime) {
      return {
        ...emptyDataShape(),
        tombstones: normalizeTombstones(localNormalized.tombstones, cloudNormalized.tombstones),
        operation: 'reset',
        intentional_empty: true,
        reset_at: winningReset.reset_at || winningReset.exported_at || null,
      };
    }
  }
  const merged = emptyDataShape();
  merged.profile = nonEmptyObjectMerge(cloudData.profile || {}, localData.profile || {});
  for (const key of ARRAY_COLLECTION_KEYS) {
    if (localData[key].length === 0 && cloudData[key].length > 0) merged[key] = cloudData[key];
    else if (cloudData[key].length === 0 && localData[key].length > 0) merged[key] = localData[key];
    else merged[key] = mergeById(localData[key], cloudData[key]);
  }
  const localTimer = localData.timerState;
  const cloudTimer = cloudData.timerState;
  if (localTimer && cloudTimer) {
    merged.timerState = latestRecordTime(localTimer) >= latestRecordTime(cloudTimer) ? localTimer : cloudTimer;
  } else {
    merged.timerState = localTimer || cloudTimer || null;
  }
  const tombstones = normalizeTombstones(localNormalized.tombstones, cloudNormalized.tombstones);
  for (const key of ARRAY_COLLECTION_KEYS) {
    const recordsById = new Map(merged[key].map((record) => [String(record.id || record._id || ''), record]));
    merged[key] = merged[key].filter((record) => {
      const id = String(record.id || record._id || '');
      const tombstone = tombstones[key].find((entry) => entry.id === id);
      return !tombstone || !tombstoneWins(tombstone, record);
    });
    tombstones[key] = tombstones[key].filter((entry) => {
      const record = recordsById.get(entry.id);
      return !record || tombstoneWins(entry, record);
    });
  }
  for (const key of ['profile', 'timerState']) {
    const record = merged[key];
    const id = key === 'profile' ? String(record?.id || 'primary') : String(record?.id || 'current');
    const tombstone = tombstones[key].find((entry) => entry.id === id);
    if (record && tombstone && tombstoneWins(tombstone, record)) merged[key] = null;
    tombstones[key] = tombstones[key].filter((entry) => !record || tombstoneWins(entry, record));
  }
  if (hasTombstones(tombstones)) merged.tombstones = tombstones;
  return merged;
}

function buildCanonicalBackupPayload(normalizedOrRaw, options = {}) {
  const normalized = normalizedOrRaw?.collection_counts ? normalizedOrRaw : normalizeAnyBackup(normalizedOrRaw, options);
  const metadata = getBackupMetadata(normalizedOrRaw);
  const payload = {
    version: 1,
    source: 'isotopeai',
    exportedAt: options.exportedAt || normalized.exported_at || new Date().toISOString(),
    appVersion: options.appVersion || normalized.app_version || 'unknown',
    data: getBackupData(normalized),
  };
  if (hasTombstones(metadata.tombstones)) payload.tombstones = metadata.tombstones;
  if (metadata.intentional_empty) {
    payload.operation = 'reset';
    payload.intentional_empty = true;
    payload.reset_at = metadata.reset_at || payload.exportedAt;
  }
  return payload;
}

function buildCloudSnapshotMirror(userId, normalizedOrRaw, options = {}) {
  const backup = buildCanonicalBackupPayload(normalizedOrRaw, options);
  const normalized = normalizeAnyBackup(backup, options);
  return {
    schema_version: 1,
    user_id: userId,
    exported_at: backup.exportedAt,
    downloaded_at: options.downloaded_at || backup.exportedAt,
    source: options.source || 'canonical_backup',
    trusted: true,
    app_version: backup.appVersion,
    profile_data: backup.data.profile || {},
    local_backup: backup,
    backup_data: backup.data,
    local_collections: backup.data,
    collection_counts: normalized.collection_counts,
  };
}

if (typeof window !== 'undefined') {
  window.IsotopeBackupNormalizer = {
    COLLECTION_KEYS,
    ARRAY_COLLECTION_KEYS,
    TOMBSTONE_COLLECTION_KEYS,
    normalizeAnyBackup,
    getBackupData,
    getCollectionCounts,
    hashBackup,
    isBackupRich,
    isBackupEmpty,
    compareBackupCandidates,
    mergeBackupData,
    buildCanonicalBackupPayload,
    buildCloudSnapshotMirror,
  };
}

export {
  COLLECTION_KEYS,
  ARRAY_COLLECTION_KEYS,
  TOMBSTONE_COLLECTION_KEYS,
  normalizeAnyBackup,
  getBackupData,
  getCollectionCounts,
  hashBackup,
  isBackupRich,
  isBackupEmpty,
  compareBackupCandidates,
  mergeBackupData,
  buildCanonicalBackupPayload,
  buildCloudSnapshotMirror,
};
