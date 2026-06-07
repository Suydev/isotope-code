# Cloud Sync Size Optimizer

## Overview

The Smart Cloud Sync Size Optimizer (`public/sync-size-optimizer.js`) intelligently decides whether to **upload or download** data based on file sizes, preventing unnecessary large transfers and optimizing bandwidth.

## How It Works

### Decision Logic

```
cloudData (cloud size)  vs  localData (local size)
         ↓                        ↓
    Compare sizes → Decide strategy
         ↓
    Upload  | Download | Merge | Skip
```

### Strategies

| Strategy | When | Action |
|----------|------|--------|
| **Download** | Cloud is significantly larger (>1.5x) | Pull cloud data to device |
| **Upload** | Local is significantly larger (>1.5x) | Push device data to cloud |
| **Merge** | Sizes are similar (<20% difference) | Delta sync / intelligent merge |
| **Skip** | Both empty or constraints violated | No sync needed |

### Size Thresholds

```javascript
LARGE_FILE_THRESHOLD: 1 MB       // Consider file "large" at this size
DELTA_SYNC_THRESHOLD: 512 KB     // Use delta for files this size  
SIZE_RATIO_THRESHOLD: 1.5        // 50% difference triggers smart sync
MAX_UPLOAD_SIZE: 50 MB           // Hard limit for uploads
COMPRESSION_THRESHOLD: 2 MB      // Auto-compress files over this size
```

## Usage

### 1. Single Collection Sync

```javascript
const { decideSyncStrategy } = window.__ISO_SYNC_OPTIMIZER__;

const cloudData = { tasks: [...], subjects: [...] };
const localData = { tasks: [...], subjects: [...] };

const decision = decideSyncStrategy(cloudData, localData);

console.log(decision);
// {
//   strategy: 'upload',
//   reason: 'Local data is 2.1 MB (180% of cloud size)',
//   shouldCompress: true,
//   cloudSize: 1234567,
//   localSize: 2234567,
//   sizeDifference: 1000000
// }
```

### 2. Batch Analysis

```javascript
const { analyzeSyncBatch } = window.__ISO_SYNC_OPTIMIZER__;

const collections = {
  tasks: {
    cloud: cloudTasks,
    local: localTasks
  },
  subjects: {
    cloud: cloudSubjects,
    local: localSubjects
  }
};

const { decisions, summary, recommendations } = analyzeSyncBatch(collections);

console.log(summary);
// {
//   totalUpload: 5242880,        // 5 MB to upload
//   totalDownload: 2097152,      // 2 MB to download
//   totalSkip: 1,
//   totalMerge: 2
// }

recommendations.forEach(r => console.log(r));
// ℹ️ 1 collections skipped due to size or other constraints
```

### 3. Execute Smart Sync

```javascript
const { executeSmartSync } = window.__ISO_SYNC_OPTIMIZER__;

const result = await executeSmartSync(
  'tasks',
  cloudData,
  localData,
  {
    onUpload: async (data, shouldCompress) => {
      const endpoint = shouldCompress 
        ? '/__auth/backup-compressed'
        : '/__auth/backup';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    },

    onDownload: async (data) => {
      // Apply downloaded data to local storage
      await localDatabase.importData(data);
    },

    onMerge: async (cloudData, localData) => {
      // Intelligent merge: keep newer items from both sides
      const merged = mergeCollections(cloudData, localData);
      await localDatabase.importData(merged);
      await uploadMergedData(merged);
    }
  }
);

console.log(result);
// {
//   success: true,
//   strategy: 'upload',
//   uploaded: 2234567,
//   downloaded: 0,
//   compressed: true,
//   reason: 'Local data is 2.1 MB (180% of cloud size)'
// }
```

## Integration with useSyncStore

Add to the cloud sync trigger in your sync store hook:

```typescript
// In browser app cloud sync hook
async function triggerCloudSync() {
  const { decideSyncStrategy, executeSmartSync } = window.__ISO_SYNC_OPTIMIZER__;

  const collections = {
    tasks: { cloud: cloudTasks, local: localTasks },
    subjects: { cloud: cloudSubjects, local: localSubjects },
    sessions: { cloud: cloudSessions, local: localSessions },
  };

  for (const [name, { cloud, local }] of Object.entries(collections)) {
    const result = await executeSmartSync(name, cloud, local, {
      onUpload: (data, compressed) => uploadToCloud(name, data, compressed),
      onDownload: (data) => applyToLocal(name, data),
      onMerge: (cloud, local) => mergeAndSync(name, cloud, local),
    });

    if (result.success) {
      syncLog.push({
        collection: name,
        strategy: result.strategy,
        bytes: result.uploaded || result.downloaded,
        timestamp: new Date()
      });
    }
  }
}
```

## Integration with server.mjs

Sync size decisions can be logged on the server side for diagnostics:

```javascript
// In server.mjs POST /__auth/sync endpoint
app.post('/__auth/sync', async (req, res) => {
  const { collections } = req.body;
  
  // Each collection includes { cloudSize, localSize, strategy }
  for (const coll of collections) {
    if (coll.strategy === 'skip' && coll.reason) {
      console.log(`[Sync] Skipping ${coll.name}: ${coll.reason}`);
    } else if (coll.shouldCompress) {
      console.log(`[Sync] Compressing ${coll.name} for upload`);
    }
  }

  // Process sync...
});
```

## Compression Support

Files over 2 MB are automatically compressed if the browser supports the Compression Streams API:

```javascript
const { compressForUpload, decompressDownload } = window.__ISO_SYNC_OPTIMIZER__;

// Compress for upload
const compressed = await compressForUpload(largeJSON);
await fetch('/__auth/backup-compressed', {
  method: 'POST',
  body: compressed,
  headers: { 'Content-Encoding': 'gzip' }
});

// Decompress on download
const blob = await response.blob();
const decompressed = await decompressDownload(blob);
const data = JSON.parse(decompressed);
```

## Monitoring & Logging

Track sync decisions in your Sync Metadata:

```javascript
// In app sync store
const syncHistory = [];

for (const [name, decision] of decisions) {
  syncHistory.push({
    collection: name,
    strategy: decision.strategy,
    cloudSize: decision.cloudSize,
    localSize: decision.localSize,
    sizeDifference: decision.sizeDifference,
    reason: decision.reason,
    timestamp: new Date().toISOString(),
  });
}

localStorage.setItem('isotope_sync_decisions', JSON.stringify(syncHistory));
```

## Edge Cases Handled

1. **Empty data** → Skip (no transfer needed)
2. **Oversized uploads** → Skip with warning (exceeds 50 MB limit)
3. **Network errors** → Return `{ success: false, error: ... }`
4. **Missing handlers** → Return graceful error
5. **Compression unsupported** → Fall back to uncompressed upload
6. **Decompression unsupported** → Fall back to uncompressed download

## Performance Benefits

| Scenario | Without Optimizer | With Optimizer |
|----------|------------------|-----------------|
| User has 5 MB local, cloud is empty | Upload 5 MB | Upload 5 MB ✓ (same) |
| User has 100 KB local, cloud is 5 MB | Download 5 MB | Download 5 MB ✓ (smart) |
| Both have ~2 MB (similar) | Upload 2 MB | Merge intelligently ✓ |
| Sync stalled on large file | Full retry | Detect, skip, try next ✓ |

## Configuration

Adjust size thresholds in `public/sync-size-optimizer.js`:

```javascript
const SYNC_SIZE_CONFIG = {
  LARGE_FILE_THRESHOLD: 1024 * 1024,      // Change to 500 KB for stricter limits
  DELTA_SYNC_THRESHOLD: 512 * 1024,       // Change to 1 MB for more aggressive merges
  SIZE_RATIO_THRESHOLD: 1.5,              // Change to 1.2 for tighter ratio
  MAX_UPLOAD_SIZE: 50 * 1024 * 1024,      // Change to 25 MB for smaller devices
  COMPRESSION_THRESHOLD: 2 * 1024 * 1024, // Change to 1 MB for more compression
};
```

## Future Enhancements

- [ ] Chunked upload/download for files > 10 MB
- [ ] Incremental delta encoding (send only diffs, not full snapshots)
- [ ] Bandwidth throttling (respect metered connections)
- [ ] Retry logic with exponential backoff for failed transfers
- [ ] Conflict resolution strategies (last-write-wins, merge-by-timestamp, user-choice)
- [ ] Streaming large file support (avoid memory bloat)

---

**Related documentation:**
- `SYNC_TRACE_MAP.md` — Complete sync architecture overview
- `CODEX-PROMPT.md` — Cloud sync testing and verification matrix
- `README.md` — Cloud Sync & Backup section
- `public/sync-size-optimizer.js` — Implementation

