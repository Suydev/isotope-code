import crypto from 'crypto';
import {
  normalizeAnyBackup,
  getBackupData,
  getCollectionCounts,
  isBackupRich,
  isBackupEmpty,
  compareBackupCandidates,
  buildCanonicalBackupPayload,
  buildCloudSnapshotMirror,
} from '../public/sync/backup-normalizer.js';

const BUCKET = 'user-content';

function sha256(text) {
  return crypto.createHash('sha256').update(String(text || '')).digest('hex');
}

function safeJson(value) {
  return JSON.stringify(value, null, 2);
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(value).sort().map((key) => (
    JSON.stringify(key) + ':' + stableStringify(value[key])
  )).join(',') + '}';
}

function dataHash(normalizedOrRaw) {
  return sha256(stableStringify(getBackupData(normalizedOrRaw || {})));
}

function storageMissing(res) {
  const detail = Buffer.isBuffer(res?.body) ? res.body.toString('utf8') : String(res?.body || '');
  return res?.status === 404 || (res?.status === 400 && /not found|does not exist|no such/i.test(detail));
}

function newestFirst(files) {
  return [...(files || [])].sort((a, b) => {
    const at = new Date(a.updated_at || a.created_at || 0).getTime();
    const bt = new Date(b.updated_at || b.created_at || 0).getTime();
    if (bt !== at) return bt - at;
    return String(b.name || '').localeCompare(String(a.name || ''));
  });
}

function publicCandidate(candidate) {
  if (!candidate) return null;
  const {
    raw_text,
    raw,
    normalized,
    ...safe
  } = candidate;
  return safe;
}

function toCanonicalBackupJson(normalized, options = {}) {
  const payload = buildCanonicalBackupPayload(normalized, options);
  return safeJson(payload);
}

function toCloudSnapshotJson(userId, normalized, options = {}) {
  const payload = buildCloudSnapshotMirror(userId, normalized, options);
  return safeJson(payload);
}

function candidateKindFromPath(path) {
  if (path.includes('/backups/history/')) return 'backup_history';
  if (path.endsWith('/backups/latest.json')) return 'backup_latest';
  if (path.includes('/cloud-snapshot/history/')) return 'cloud_snapshot_history';
  if (path.endsWith('/cloud-snapshot/latest.json')) return 'cloud_snapshot_latest';
  if (path.includes('/imports/')) return path.endsWith('/latest.json') ? 'import_latest' : 'import_archive';
  if (path.includes('/exports/')) return path.endsWith('/latest.json') ? 'export_latest' : 'export_archive';
  return 'unknown';
}

function isCanonicalProtectedPath(userId, path) {
  return path === `${userId}/backups/latest.json` || path === `${userId}/cloud-snapshot/latest.json`;
}

function pathPriority(userId, path) {
  if (path === `${userId}/backups/latest.json`) return 100;
  if (path === `${userId}/cloud-snapshot/latest.json`) return 90;
  if (path === `${userId}/imports/latest.json`) return 80;
  if (path === `${userId}/exports/latest.json`) return 70;
  if (path.includes('/backups/history/')) return 60;
  if (path.includes('/imports/')) return 50;
  if (path.includes('/exports/')) return 40;
  if (path.includes('/cloud-snapshot/history/')) return 30;
  return 0;
}

function serverCandidateTime(candidate) {
  const values = [
    candidate?.normalized?.meaningful_data_at,
    candidate?.exported_at,
    candidate?.updated_at,
    candidate?.created_at,
  ];
  return Math.max(0, ...values.map((value) => {
    const time = new Date(value || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  }));
}

function serverCandidateMeaningfulTime(candidate) {
  const time = new Date(candidate?.normalized?.meaningful_data_at || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function compareServerCandidates(userId, a, b) {
  if (a?.valid && b?.valid && a.rich && b.rich) {
    const dataDelta = serverCandidateMeaningfulTime(a) - serverCandidateMeaningfulTime(b);
    if (Math.abs(dataDelta) > 10000) return dataDelta > 0 ? 1 : -1;
    const priorityDelta = pathPriority(userId, a.path) - pathPriority(userId, b.path);
    if (priorityDelta > 0) return 1;
    if (priorityDelta < 0) return -1;
  }
  if (a?.valid && b?.valid && a.rich === b.rich && a.empty === b.empty) {
    const timeDelta = serverCandidateTime(a) - serverCandidateTime(b);
    if (Math.abs(timeDelta) <= 10000) {
      const priorityDelta = pathPriority(userId, a.path) - pathPriority(userId, b.path);
      if (priorityDelta > 0) return 1;
      if (priorityDelta < 0) return -1;
    }
  }
  if (a?.hash && b?.hash && a.hash === b.hash) {
    const priorityDelta = pathPriority(userId, a.path) - pathPriority(userId, b.path);
    if (priorityDelta > 0) return 1;
    if (priorityDelta < 0) return -1;
  }
  const normal = compareBackupCandidates(a, b);
  if (normal !== 0) return normal;
  const priorityDelta = pathPriority(userId, a?.path || '') - pathPriority(userId, b?.path || '');
  if (priorityDelta > 0) return 1;
  if (priorityDelta < 0) return -1;
  return 0;
}

export function createBackupManager(deps) {
  const {
    supaStorageDownloadAsUser,
    supaStorageUploadAsUser,
    supaStorageListAsUser,
    supaStorageRemoveAsUser,
    assertSupaOk,
    isStorageAlreadyExists,
    appVersion = 'unknown',
  } = deps;

  async function downloadText(path, userJwt) {
    const res = await supaStorageDownloadAsUser(BUCKET, path, userJwt);
    if (storageMissing(res)) return null;
    assertSupaOk(res, `Storage download ${path}`);
    return Buffer.isBuffer(res.body) ? res.body.toString('utf8') : String(res.body || '');
  }

  async function listPrefix(prefix, userJwt, limit = 200) {
    const res = await supaStorageListAsUser(BUCKET, prefix, userJwt, { limit });
    if (res.status === 404 || res.status === 400) return [];
    assertSupaOk(res, `Storage list ${prefix}`);
    return Array.isArray(res.body) ? res.body : [];
  }

  async function buildCandidate(userId, path, userJwt, meta = {}) {
    const base = {
      bucket: BUCKET,
      path,
      exists: false,
      valid: false,
      kind: candidateKindFromPath(path),
      hash: null,
      data_hash: null,
      size_bytes: 0,
      exported_at: null,
      updated_at: meta.updated_at || null,
      collection_counts: getCollectionCounts({ data: {} }),
      rich_score: 0,
      rich: false,
      empty: true,
      reason: 'missing',
    };
    try {
      const rawText = await downloadText(path, userJwt);
      if (!rawText) return base;
      const hash = sha256(rawText);
      const normalized = normalizeAnyBackup(rawText, {
        bucket: BUCKET,
        path,
        source_path: path,
        hash,
        size_bytes: Buffer.byteLength(rawText),
        updated_at: meta.updated_at || null,
      });
      return {
        ...base,
        exists: true,
        valid: normalized.valid,
        kind: candidateKindFromPath(path),
        hash,
        data_hash: dataHash(normalized),
        size_bytes: Buffer.byteLength(rawText),
        exported_at: normalized.exported_at,
        updated_at: meta.updated_at || normalized.updated_at || null,
        collection_counts: normalized.collection_counts,
        rich_score: normalized.rich_score,
        rich: isBackupRich(normalized),
        empty: isBackupEmpty(normalized),
        reason: normalized.reason,
        raw_text: rawText,
        raw: normalized.raw,
        normalized,
      };
    } catch (error) {
      return {
        ...base,
        exists: true,
        valid: false,
        reason: error?.message || 'invalid backup',
      };
    }
  }

  async function collectCandidatePaths(userId, userJwt) {
    const paths = new Map();
    const add = (path, meta = {}) => {
      if (!path || !path.startsWith(`${userId}/`)) return;
      if (!path.endsWith('.json')) return;
      if (!paths.has(path)) paths.set(path, { path, ...meta });
    };

    [
      `${userId}/backups/latest.json`,
      `${userId}/cloud-snapshot/latest.json`,
      `${userId}/imports/latest.json`,
      `${userId}/exports/latest.json`,
    ].forEach((path) => add(path));

    const folderSpecs = [
      `${userId}/backups/history/`,
      `${userId}/imports/`,
      `${userId}/exports/`,
      `${userId}/cloud-snapshot/history/`,
    ];
    for (const prefix of folderSpecs) {
      const files = newestFirst(await listPrefix(prefix, userJwt).catch(() => []));
      for (const file of files.slice(0, 20)) {
        if (!file?.name || file.name === 'history') continue;
        const path = `${prefix}${file.name}`;
        add(path, {
          updated_at: file.updated_at || file.created_at || null,
          id: file.id || null,
          etag: file.metadata?.eTag || file.metadata?.etag || null,
          listed_size_bytes: Number(file.metadata?.size || file.size || 0) || null,
        });
      }
    }
    return Array.from(paths.values());
  }

  async function findBestCloudBackup(userId, userJwt, options = {}) {
    const pathMetas = await collectCandidatePaths(userId, userJwt);
    const candidates = [];
    for (const meta of pathMetas) {
      candidates.push(await buildCandidate(userId, meta.path, userJwt, meta));
    }
    const valid = candidates.filter((candidate) => candidate.exists && candidate.valid);
    const selected = valid.sort((a, b) => -compareServerCandidates(userId, a, b))[0] || null;
    const latestCandidates = candidates.filter((candidate) => (
      candidate.path === `${userId}/backups/latest.json`
      || candidate.path === `${userId}/exports/latest.json`
      || candidate.path === `${userId}/cloud-snapshot/latest.json`
    ));
    const emptyLatest = latestCandidates.find((candidate) => candidate.exists && candidate.empty);
    const richLegacy = candidates.find((candidate) => candidate.exists && candidate.rich && (
      candidate.path.includes('/imports/') || candidate.path.includes('/exports/') || candidate.path.includes('/cloud-snapshot/')
    ));
    const localRecommendation = selected && selected.rich
      ? 'restore_or_merge_before_upload'
      : (selected ? 'cloud_empty_upload_allowed_if_local_rich' : 'upload_local_if_rich');
    return {
      ok: true,
      selected: publicCandidate(selected),
      selected_internal: selected,
      candidates: options.includeRaw ? candidates : candidates.map(publicCandidate),
      candidates_internal: candidates,
      local_recommendation: localRecommendation,
      warning_if_empty_latest: emptyLatest && richLegacy && richLegacy.hash !== emptyLatest.hash
        ? 'A latest backup is empty/profile-only while a richer backup exists. Do not upload empty local data.'
        : null,
    };
  }

  function assertNoEmptyOverwrite(localNormalized, bestResult) {
    const selected = bestResult?.selected_internal || null;
    if (localNormalized && isBackupEmpty(localNormalized) && selected && selected.rich) {
      const err = new Error('Cloud has richer backup. Restore first.');
      err.code = 'BLOCKED_EMPTY_OVERWRITE';
      err.payload = {
        ok: false,
        code: 'BLOCKED_EMPTY_OVERWRITE',
        message: 'Cloud has richer backup. Restore first.',
        selected_backup: publicCandidate(selected),
        local_counts: localNormalized.collection_counts,
        cloud_counts: selected.collection_counts,
      };
      throw err;
    }
  }

  async function uploadJson(path, json, userJwt, options = {}) {
    const uploaded = await supaStorageUploadAsUser(
      BUCKET,
      path,
      Buffer.from(json, 'utf8'),
      'application/json',
      userJwt,
      {
        upsert: options.upsert === true,
        timeoutMessage: options.timeoutMessage || `Storage upload timed out for ${path}`,
        timeoutMs: options.timeoutMs || 30000,
      },
    );
    if (!(options.ignoreAlreadyExists && isStorageAlreadyExists(uploaded))) {
      assertSupaOk(uploaded, `Storage upload ${path}`);
    }
    return uploaded;
  }

  async function hasHistoryHash(userId, hash, userJwt) {
    const files = await listPrefix(`${userId}/backups/history/`, userJwt).catch(() => []);
    return files.some((file) => String(file?.name || '').includes(hash));
  }

  async function writeCanonicalBackup(userId, userJwt, backupInput, options = {}) {
    const normalized = backupInput?.collection_counts
      ? backupInput
      : normalizeAnyBackup(backupInput, {
        path: options.source_path || null,
        source_path: options.source_path || null,
      });
    if (!normalized.valid) throw new Error(normalized.reason || 'Invalid backup');
    const exportedAt = options.exportedAt || normalized.exported_at || new Date().toISOString();
    const canonicalJson = toCanonicalBackupJson(normalized, { exportedAt, appVersion });
    const canonicalHash = sha256(canonicalJson);
    const canonicalDataHash = dataHash(normalized);
    const latestPath = `${userId}/backups/latest.json`;
    const safeStamp = exportedAt.replace(/[:.]/g, '-');
    const historyPath = `${userId}/backups/history/${safeStamp}-${canonicalHash.slice(0, 16)}.json`;
    const mirrorJson = toCloudSnapshotJson(userId, normalizeAnyBackup(canonicalJson, {
      hash: canonicalHash,
      size_bytes: Buffer.byteLength(canonicalJson),
      source_path: latestPath,
    }), { exportedAt, appVersion, source: options.source || 'canonical_backup' });
    const mirrorHash = sha256(mirrorJson);
    const mirrorPath = `${userId}/cloud-snapshot/latest.json`;

    await uploadJson(latestPath, canonicalJson, userJwt, { upsert: true, timeoutMessage: 'Canonical latest backup upload timed out' });
    let history_status = 'skipped_duplicate';
    if (!(await hasHistoryHash(userId, canonicalHash.slice(0, 16), userJwt))) {
      const history = await uploadJson(historyPath, canonicalJson, userJwt, {
        upsert: false,
        ignoreAlreadyExists: true,
        timeoutMessage: 'Canonical backup history upload timed out',
      });
      history_status = history.status;
    }
    await uploadJson(mirrorPath, mirrorJson, userJwt, { upsert: true, timeoutMessage: 'Cloud snapshot mirror upload timed out' });

    const readback = await downloadText(latestPath, userJwt);
    const readbackHash = sha256(readback || '');
    if (readbackHash !== canonicalHash) throw new Error('Canonical latest backup readback hash mismatch');

    const latestNormalized = normalizeAnyBackup(canonicalJson, {
      path: latestPath,
      source_path: latestPath,
      hash: canonicalHash,
      size_bytes: Buffer.byteLength(canonicalJson),
    });
    return {
      ok: true,
      bucket: BUCKET,
      path: latestPath,
      latest_path: latestPath,
      history_path: historyPath,
      history_status,
      cloud_snapshot_path: mirrorPath,
      hash: canonicalHash,
      data_hash: canonicalDataHash,
      cloud_snapshot_hash: mirrorHash,
      size_bytes: Buffer.byteLength(canonicalJson),
      cloud_snapshot_size_bytes: Buffer.byteLength(mirrorJson),
      exported_at: exportedAt,
      collection_counts: latestNormalized.collection_counts,
      rich: latestNormalized.rich,
      empty: latestNormalized.empty,
      backup_json: canonicalJson,
      cloud_snapshot_json: mirrorJson,
    };
  }

  async function restoreBestBackup(userId, userJwt, options = {}) {
    const best = await findBestCloudBackup(userId, userJwt, { includeRaw: true });
    const selected = best.selected_internal;
    if (!selected || !selected.valid) {
      const err = new Error('No valid cloud backup exists');
      err.code = 'STORAGE_NOT_FOUND';
      throw err;
    }
    let promoted = null;
    if (options.promote !== false) {
      promoted = await writeCanonicalBackup(userId, userJwt, selected.normalized, {
        source_path: selected.path,
        source: 'restore_best_backup',
      });
    }
    const backupJson = toCanonicalBackupJson(selected.normalized, {
      exportedAt: selected.exported_at || new Date().toISOString(),
      appVersion,
    });
    return {
      ok: true,
      selected: publicCandidate(selected),
      candidates: best.candidates,
      backup_json: backupJson,
      backup_hash: sha256(backupJson),
      collection_counts: getCollectionCounts(normalizeAnyBackup(backupJson)),
      promoted,
      restore_required_on_browser: true,
    };
  }

  async function cleanupPreview(userId, userJwt) {
    const best = await findBestCloudBackup(userId, userJwt, { includeRaw: true });
    const selectedPath = best.selected_internal?.path || null;
    const candidates = best.candidates_internal || [];
    const canonicalHash = candidates.find((c) => c.path === `${userId}/backups/latest.json`)?.hash || null;
    const seenHash = new Map();
    const backupHistory = candidates.filter((c) => c.path.includes('/backups/history/')).sort((a, b) => -compareBackupCandidates(a, b));
    const importArchives = candidates.filter((c) => c.path.includes('/imports/') && !c.path.endsWith('/latest.json')).sort((a, b) => -compareBackupCandidates(a, b));
    const exportArchives = candidates.filter((c) => c.path.includes('/exports/') && !c.path.endsWith('/latest.json')).sort((a, b) => -compareBackupCandidates(a, b));
    const decisions = [];
    for (const candidate of candidates) {
      let action = 'keep';
      let reason = 'active candidate';
      if (isCanonicalProtectedPath(userId, candidate.path)) {
        reason = 'canonical protected path';
      } else if (candidate.path === selectedPath) {
        reason = 'selected best backup';
      } else if (candidate.path.includes('/backups/history/') && backupHistory.findIndex((c) => c.path === candidate.path) < 5) {
        reason = 'backup history keep-latest-5 policy';
      } else if (candidate.hash && canonicalHash && candidate.hash === canonicalHash) {
        action = 'delete';
        reason = 'duplicate of canonical latest';
      } else if (candidate.empty && best.selected_internal?.rich) {
        action = 'delete';
        reason = 'profile-only backup superseded by richer canonical backup';
      } else if (candidate.hash && seenHash.has(candidate.hash)) {
        action = 'delete';
        reason = `duplicate of ${seenHash.get(candidate.hash)}`;
      } else if (candidate.path.includes('/backups/history/')) {
        if (backupHistory.findIndex((c) => c.path === candidate.path) >= 5) {
          action = 'delete';
          reason = 'backup history beyond keep-latest-5 policy';
        }
      } else if (candidate.path.includes('/imports/') && !candidate.path.endsWith('/latest.json')) {
        if (importArchives.findIndex((c) => c.path === candidate.path) >= 3) {
          action = 'delete';
          reason = 'import archive beyond keep-latest-3 policy';
        }
      } else if (candidate.path.includes('/exports/') && !candidate.path.endsWith('/latest.json')) {
        if (exportArchives.findIndex((c) => c.path === candidate.path) >= 3) {
          action = 'delete';
          reason = 'export archive beyond keep-latest-3 policy';
        }
      }
      if (candidate.hash && !seenHash.has(candidate.hash)) seenHash.set(candidate.hash, candidate.path);
      decisions.push({
        action,
        reason,
        bucket: BUCKET,
        path: candidate.path,
        hash: candidate.hash,
        size_bytes: candidate.size_bytes,
        bytes_freed: action === 'delete' ? candidate.size_bytes : 0,
        collection_counts: candidate.collection_counts,
      });
    }
    const bytesFreed = decisions.reduce((sum, row) => sum + (row.bytes_freed || 0), 0);
    return {
      ok: true,
      selected: best.selected,
      decisions,
      bytes_freed: bytesFreed,
      dry_run: true,
    };
  }

  async function cleanupApply(userId, userJwt) {
    const preview = await cleanupPreview(userId, userJwt);
    const toDelete = preview.decisions.filter((row) => row.action === 'delete').map((row) => row.path);
    if (toDelete.length > 0) {
      const removed = await supaStorageRemoveAsUser(BUCKET, toDelete, userJwt);
      assertSupaOk(removed, 'Storage cleanup delete');
    }
    return {
      ...preview,
      dry_run: false,
      deleted: toDelete,
      deleted_count: toDelete.length,
    };
  }

  return {
    findBestCloudBackup,
    writeCanonicalBackup,
    restoreBestBackup,
    cleanupPreview,
    cleanupApply,
    assertNoEmptyOverwrite,
    normalizeAnyBackup,
    getBackupData,
    getCollectionCounts,
    toCanonicalBackupJson,
    publicCandidate,
  };
}
