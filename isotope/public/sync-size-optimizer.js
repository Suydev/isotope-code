/**
 * IsotopeAI — Smart Cloud Sync Size Optimizer
 * 
 * Handles intelligent file sync decisions based on data size:
 * - If cloud data is large → Download it (user's local copy is stale)
 * - If user data is large → Upload it (cloud copy is stale)
 * - If both are similar size → Merge/delta sync
 * 
 * Prevents unnecessary large uploads/downloads and optimizes bandwidth.
 */

// Size thresholds (in bytes)
const SYNC_SIZE_CONFIG = {
  LARGE_FILE_THRESHOLD: 1024 * 1024,      // 1 MB — consider as "large"
  DELTA_SYNC_THRESHOLD: 512 * 1024,       // 512 KB — use delta for files this size
  SIZE_RATIO_THRESHOLD: 1.5,              // 50% size difference triggers smart sync
  MAX_UPLOAD_SIZE: 50 * 1024 * 1024,      // 50 MB hard limit
  COMPRESSION_THRESHOLD: 2 * 1024 * 1024, // Compress if > 2 MB
};

/**
 * Calculate JSON payload size in bytes
 */
function calculateDataSize(data) {
  if (!data) return 0;
  try {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    return new Blob([json]).size;
  } catch (_) {
    return 0;
  }
}

/**
 * Compare cloud vs local data sizes and decide sync strategy
 * 
 * Returns: {
 *   strategy: 'download' | 'upload' | 'merge' | 'skip',
 *   reason: string,
 *   shouldCompress: boolean,
 *   cloudSize: number,
 *   localSize: number,
 *   sizeDifference: number,
 * }
 */
function decideSyncStrategy(cloudData, localData, options = {}) {
  const {
    minDataPoints = 0,      // Skip if data has fewer than this many items
    forceDirection = null,  // 'upload' | 'download' | null
  } = options;

  const cloudSize = calculateDataSize(cloudData);
  const localSize = calculateDataSize(localData);

  // Skip empty data
  if (cloudSize === 0 && localSize === 0) {
    return {
      strategy: 'skip',
      reason: 'Both cloud and local data are empty',
      shouldCompress: false,
      cloudSize,
      localSize,
      sizeDifference: 0,
    };
  }

  // Enforce forced direction
  if (forceDirection === 'upload') {
    return {
      strategy: 'upload',
      reason: 'Forced upload direction',
      shouldCompress: localSize > SYNC_SIZE_CONFIG.COMPRESSION_THRESHOLD,
      cloudSize,
      localSize,
      sizeDifference: localSize - cloudSize,
    };
  }

  if (forceDirection === 'download') {
    return {
      strategy: 'download',
      reason: 'Forced download direction',
      shouldCompress: false,
      cloudSize,
      localSize,
      sizeDifference: cloudSize - localSize,
    };
  }

  // Size difference ratio
  const sizeRatio = cloudSize > 0 ? localSize / cloudSize : Infinity;
  const sizeDifference = Math.abs(cloudSize - localSize);

  // If cloud is significantly larger, download it
  if (sizeRatio < 1 / SYNC_SIZE_CONFIG.SIZE_RATIO_THRESHOLD) {
    if (cloudSize > SYNC_SIZE_CONFIG.LARGE_FILE_THRESHOLD) {
      return {
        strategy: 'download',
        reason: `Cloud data is ${(cloudSize / 1024).toFixed(1)} KB (${(sizeRatio * 100).toFixed(1)}% of local size)`,
        shouldCompress: false,
        cloudSize,
        localSize,
        sizeDifference,
      };
    }
  }

  // If local is significantly larger, upload it
  if (sizeRatio > SYNC_SIZE_CONFIG.SIZE_RATIO_THRESHOLD) {
    if (localSize > SYNC_SIZE_CONFIG.LARGE_FILE_THRESHOLD) {
      // Check hard upload limit
      if (localSize > SYNC_SIZE_CONFIG.MAX_UPLOAD_SIZE) {
        return {
          strategy: 'skip',
          reason: `Local data exceeds max upload size (${(localSize / 1024 / 1024).toFixed(1)} MB > ${(SYNC_SIZE_CONFIG.MAX_UPLOAD_SIZE / 1024 / 1024).toFixed(1)} MB)`,
          shouldCompress: false,
          cloudSize,
          localSize,
          sizeDifference,
        };
      }

      return {
        strategy: 'upload',
        reason: `Local data is ${(localSize / 1024).toFixed(1)} KB (${(sizeRatio * 100).toFixed(1)}% of cloud size)`,
        shouldCompress: localSize > SYNC_SIZE_CONFIG.COMPRESSION_THRESHOLD,
        cloudSize,
        localSize,
        sizeDifference,
      };
    }
  }

  // Sizes are similar — use delta/merge sync
  if (Math.abs(sizeRatio - 1) < 0.2) {
    return {
      strategy: 'merge',
      reason: `Cloud (${(cloudSize / 1024).toFixed(1)} KB) and local (${(localSize / 1024).toFixed(1)} KB) sizes are similar`,
      shouldCompress: localSize > SYNC_SIZE_CONFIG.COMPRESSION_THRESHOLD,
      cloudSize,
      localSize,
      sizeDifference,
    };
  }

  // Default: merge if within reasonable delta
  if (sizeDifference < SYNC_SIZE_CONFIG.DELTA_SYNC_THRESHOLD) {
    return {
      strategy: 'merge',
      reason: `Size difference (${(sizeDifference / 1024).toFixed(1)} KB) is within delta threshold`,
      shouldCompress: localSize > SYNC_SIZE_CONFIG.COMPRESSION_THRESHOLD,
      cloudSize,
      localSize,
      sizeDifference,
    };
  }

  // Last resort: upload if local is larger
  if (localSize > cloudSize) {
    if (localSize > SYNC_SIZE_CONFIG.MAX_UPLOAD_SIZE) {
      return {
        strategy: 'skip',
        reason: `Local data too large to upload (${(localSize / 1024 / 1024).toFixed(1)} MB)`,
        shouldCompress: false,
        cloudSize,
        localSize,
        sizeDifference,
      };
    }

    return {
      strategy: 'upload',
      reason: `Local data is larger (${(localSize / 1024).toFixed(1)} KB vs ${(cloudSize / 1024).toFixed(1)} KB)`,
      shouldCompress: localSize > SYNC_SIZE_CONFIG.COMPRESSION_THRESHOLD,
      cloudSize,
      localSize,
      sizeDifference,
    };
  }

  // Otherwise download
  return {
    strategy: 'download',
    reason: `Cloud data is larger (${(cloudSize / 1024).toFixed(1)} KB vs ${(localSize / 1024).toFixed(1)} KB)`,
    shouldCompress: false,
    cloudSize,
    localSize,
    sizeDifference,
  };
}

/**
 * Apply sync strategy across multiple collections
 * 
 * Returns: {
 *   collections: Map<collectionName, decisionResult>,
 *   summary: { totalUpload, totalDownload, totalSkip },
 *   recommendations: string[],
 * }
 */
function analyzeSyncBatch(collections, options = {}) {
  const decisions = new Map();
  const summary = { totalUpload: 0, totalDownload: 0, totalSkip: 0, totalMerge: 0 };
  const recommendations = [];

  for (const [name, { cloud, local }] of Object.entries(collections)) {
    const decision = decideSyncStrategy(cloud, local, options);
    decisions.set(name, decision);

    if (decision.strategy === 'upload') summary.totalUpload += decision.cloudSize;
    else if (decision.strategy === 'download') summary.totalDownload += decision.cloudSize;
    else if (decision.strategy === 'skip') summary.totalSkip += 1;
    else if (decision.strategy === 'merge') summary.totalMerge += 1;
  }

  // Generate recommendations
  if (summary.totalUpload > SYNC_SIZE_CONFIG.MAX_UPLOAD_SIZE * 0.8) {
    recommendations.push(`⚠️ Total upload size (${(summary.totalUpload / 1024 / 1024).toFixed(1)} MB) approaching limit`);
  }

  if (summary.totalDownload > 100 * 1024 * 1024) {
    recommendations.push(`⚠️ Large download detected (${(summary.totalDownload / 1024 / 1024).toFixed(1)} MB) — may take time on slow networks`);
  }

  const skips = Array.from(decisions.values()).filter(d => d.strategy === 'skip');
  if (skips.length > 0) {
    recommendations.push(`ℹ️ ${skips.length} collections skipped due to size or other constraints`);
  }

  return { decisions, summary, recommendations };
}

/**
 * Compress JSON data for upload (basic gzip-like compression via deflate)
 * Note: Real gzip would need pako/other library; this is basic size reduction.
 */
async function compressForUpload(data) {
  if (typeof data === 'string') {
    try {
      const blob = new Blob([data], { type: 'application/json' });
      const stream = blob.stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const compressedBlob = await new Response(compressedStream).blob();
      return compressedBlob;
    } catch (_) {
      // Compression not supported; return original
      return new Blob([data], { type: 'application/json' });
    }
  }
  return new Blob([JSON.stringify(data)], { type: 'application/json' });
}

/**
 * Decompress download data
 */
async function decompressDownload(blob) {
  try {
    const stream = blob.stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
    const decompressedBlob = await new Response(decompressedStream).blob();
    return await decompressedBlob.text();
  } catch (_) {
    // Decompression not supported; return raw text
    return await blob.text();
  }
}

/**
 * Execute smart sync for a single collection
 * 
 * Returns: { success, strategy, uploaded, downloaded, compressed, error? }
 */
async function executeSmartSync(collectionName, cloudData, localData, syncHandlers = {}) {
  const {
    onUpload,    // async (data, shouldCompress) => void
    onDownload,  // async (data) => void
    onMerge,     // async (cloudData, localData) => void
  } = syncHandlers;

  try {
    const decision = decideSyncStrategy(cloudData, localData);

    console.log(`[SmartSync:${collectionName}]`, decision);

    switch (decision.strategy) {
      case 'upload':
        if (onUpload) {
          const dataToUpload = localData;
          let uploadPayload = dataToUpload;

          if (decision.shouldCompress) {
            uploadPayload = await compressForUpload(dataToUpload);
            console.log(`[SmartSync:${collectionName}] Compressed for upload: ${(decision.localSize / 1024).toFixed(1)} KB -> ${(uploadPayload.size / 1024).toFixed(1)} KB`);
          }

          await onUpload(uploadPayload, decision.shouldCompress);

          return {
            success: true,
            strategy: 'upload',
            uploaded: decision.localSize,
            downloaded: 0,
            compressed: decision.shouldCompress,
            reason: decision.reason,
          };
        }
        break;

      case 'download':
        if (onDownload) {
          let downloadData = cloudData;

          // If cloud data is a Blob (already downloaded), decompress if needed
          if (cloudData instanceof Blob) {
            downloadData = await decompressDownload(cloudData);
            downloadData = JSON.parse(downloadData);
          }

          await onDownload(downloadData);

          return {
            success: true,
            strategy: 'download',
            uploaded: 0,
            downloaded: decision.cloudSize,
            compressed: false,
            reason: decision.reason,
          };
        }
        break;

      case 'merge':
        if (onMerge) {
          await onMerge(cloudData, localData);

          return {
            success: true,
            strategy: 'merge',
            uploaded: 0,
            downloaded: 0,
            compressed: false,
            reason: decision.reason,
          };
        }
        break;

      case 'skip':
        return {
          success: true,
          strategy: 'skip',
          uploaded: 0,
          downloaded: 0,
          compressed: false,
          reason: decision.reason,
        };
    }

    return {
      success: false,
      strategy: decision.strategy,
      uploaded: 0,
      downloaded: 0,
      compressed: false,
      error: 'No handler provided for strategy: ' + decision.strategy,
    };
  } catch (error) {
    return {
      success: false,
      strategy: 'unknown',
      uploaded: 0,
      downloaded: 0,
      compressed: false,
      error: error.message,
    };
  }
}

/**
 * Public API: Export sync optimizer for use in browser
 */
if (typeof window !== 'undefined') {
  window.__ISO_SYNC_OPTIMIZER__ = {
    decideSyncStrategy,
    analyzeSyncBatch,
    executeSmartSync,
    compressForUpload,
    decompressDownload,
    calculateDataSize,
    config: SYNC_SIZE_CONFIG,
  };
}

// Export for Node/testing (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    decideSyncStrategy,
    analyzeSyncBatch,
    executeSmartSync,
    compressForUpload,
    decompressDownload,
    calculateDataSize,
    SYNC_SIZE_CONFIG,
  };
}
