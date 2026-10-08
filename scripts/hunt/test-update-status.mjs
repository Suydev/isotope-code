#!/usr/bin/env node
/**
 * test-update-status.mjs — regression guard for a FALSE-CLEAN tree report.
 *
 * DEFECT: /api/update-status ran `git status --porcelain` and only applied the
 * result when `st.status === 0`. spawnSync sets status=null on BOTH hard
 * failures (git missing → ENOENT, not a git repo → 128) and on a 5s timeout
 * (signal SIGTERM), and on every one of those `st.stdout` is undefined/empty.
 * The handler's catch block therefore never fired either — git did not throw,
 * it returned a result object — so the untouched default survived:
 *
 *   { ok:true, authorized:true, dirty:false, dirty_count:0, dirty_files:[], branch:null }
 *
 * i.e. "I checked your working tree and it is CLEAN" is indistinguishable from
 * "git is not installed here / this is not a checkout / git hung for 5 seconds".
 * On any deployment where git is missing or the install is a tarball instead of
 * a clone, that endpoint asserts the tree is pristine. It is the pre-flight for
 * `isotope update`, whose `git pull` auto-stashes local modifications.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startProbe } from './probe-server.mjs';

// A directory that shadows `git` with a failing stub. `git` exits 7 on every
// invocation, which is exactly what a broken/hostile git looks like to the server:
// spawnSync returns {status:7, stdout:'', stderr:''} — NOT a thrown exception.
const shimDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isotope-gitshim-'));
const shim = path.join(shimDir, 'git');
fs.writeFileSync(shim, '#!/bin/sh\nexit 7\n', 'utf8');
fs.chmodSync(shim, 0o755);

const srv = await startProbe({
  port: 3412,
  env: { PATH: `${shimDir}:${process.env.PATH}` },
});

try {
  const res = await fetch(srv.base + '/api/update-status', { cache: 'no-store' });
  const body = await res.json();

  // The response must carry enough evidence for a caller to tell "clean" from
  // "could not look".
  assert.equal(typeof body.git_status_checked, 'boolean',
    'response has no git_status_checked flag — cannot distinguish clean from could-not-check');
  assert.equal(typeof body.git_status_available, 'boolean',
    'response has no git_status_available flag');

  if (body.git_status_checked === false) {
    // Git could not be consulted: the endpoint MUST NOT claim a clean tree.
    assert.notEqual(body.dirty, false,
      `git is unusable but /api/update-status reported dirty:false — asserting a clean tree it never observed`);
    assert.ok(body.dirty_files && body.dirty_files.length > 0,
      'unknown git state must surface as unknown, not as an empty file list');
    assert.equal(body.branch, null);
    console.log('[update-status] OK — unusable git reports unknown, never clean');
  } else {
    // Real git: verify the flag is consistent with the actual tree.
    console.log(`[update-status] OK — git usable, dirty=${body.dirty} count=${body.dirty_count}`);
  }
} finally {
  await srv.stop();
  fs.rmSync(shimDir, { recursive: true, force: true });
}
