#!/usr/bin/env node

import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildCurrentAudit } from "./generate-current-audit.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");

// This verifier is itself inventoried, so changing it invalidates the audit.
async function main() {
  const { manifest, outputs } = await buildCurrentAudit();
  const failures = [];

  for (const [filePath, expected] of outputs) {
    let actual;
    try {
      actual = await readFile(path.join(REPO_ROOT, filePath), "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") {
        failures.push(`${filePath}: missing`);
        continue;
      }
      throw error;
    }
    if (actual !== expected) failures.push(`${filePath}: stale`);
  }

  if (failures.length > 0) {
    process.stderr.write(
      `Current-file audit verification failed:\n${failures
        .map((failure) => `- ${failure}`)
        .join("\n")}\n` +
        "Run: node scripts/generate-current-audit.mjs\n",
    );
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    `Current-file audit is fresh for ${manifest.scope.auditedFileCount} files ` +
      `(${manifest.repository.worktreeFingerprint}).\n`,
  );
}

const invokedPath = process.argv[1]
  ? pathToFileURL(await realpath(process.argv[1])).href
  : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
