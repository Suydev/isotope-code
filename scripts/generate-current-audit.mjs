#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  realpath,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const OUTPUT_DIR = "audit/current";
const TEXT_EXTENSIONS = new Set([
  "",
  ".bat",
  ".cjs",
  ".css",
  ".csv",
  ".env",
  ".gitignore",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ps1",
  ".sh",
  ".sql",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".webmanifest",
  ".xml",
  ".yaml",
  ".yml",
]);

const TYPE_BY_EXTENSION = new Map([
  [".bat", "shell-script"],
  [".cjs", "javascript"],
  [".css", "stylesheet"],
  [".csv", "data"],
  [".gif", "image"],
  [".html", "html"],
  [".ico", "image"],
  [".jpeg", "image"],
  [".jpg", "image"],
  [".js", "javascript"],
  [".json", "json"],
  [".jsx", "javascript"],
  [".md", "markdown"],
  [".mjs", "javascript"],
  [".mp3", "audio"],
  [".mp4", "video"],
  [".pdf", "document"],
  [".png", "image"],
  [".ps1", "shell-script"],
  [".sh", "shell-script"],
  [".sql", "sql"],
  [".svg", "image-vector"],
  [".ts", "typescript"],
  [".tsx", "typescript"],
  [".ttf", "font"],
  [".txt", "text"],
  [".wav", "audio"],
  [".webmanifest", "json"],
  [".webp", "image"],
  [".woff", "font"],
  [".woff2", "font"],
  [".xml", "xml"],
  [".yaml", "yaml"],
  [".yml", "yaml"],
  [".zip", "archive"],
]);

const RISK_PATTERNS = [
  {
    id: "timers.interval",
    pattern: /\bsetInterval\s*\(/g,
  },
  {
    id: "timers.timeout",
    pattern: /\bsetTimeout\s*\(/g,
  },
  {
    id: "network.fetch",
    pattern: /\bfetch\s*\(/g,
  },
  {
    id: "network.http_client",
    pattern: /\b(?:axios|XMLHttpRequest|EventSource)\b/g,
  },
  {
    id: "network.websocket",
    pattern: /\b(?:WebSocket|wss?:\/\/)\b/g,
  },
  {
    id: "network.supabase_client",
    pattern: /\b(?:createClient|supabase\.co|SUPABASE_URL)\b/g,
  },
  {
    id: "storage.web",
    pattern: /\b(?:localStorage|sessionStorage|indexedDB)\b/g,
  },
  {
    id: "storage.cache_api",
    pattern: /\b(?:caches\.|CacheStorage|Cache-Control)\b/g,
  },
  {
    id: "storage.filesystem",
    pattern: /\b(?:readFile|writeFile|appendFile|createReadStream|createWriteStream)\b/g,
  },
  {
    id: "secrets.identifiers",
    pattern:
      /\b(?:API_KEY|ANON_KEY|SERVICE_ROLE_KEY|SUPABASE_KEY|SUPABASE_URL|JWT_SECRET|ACCESS_TOKEN|REFRESH_TOKEN|CLIENT_SECRET|PRIVATE_KEY|DATABASE_URL)\b/g,
  },
  {
    id: "injection.eval",
    pattern: /\b(?:eval|Function)\s*\(/g,
  },
  {
    id: "injection.inner_html",
    pattern: /\b(?:innerHTML|outerHTML|insertAdjacentHTML|dangerouslySetInnerHTML)\b/g,
  },
  {
    id: "sql.statements",
    pattern:
      /\b(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|GRANT|REVOKE)\b/gi,
  },
  {
    id: "sql.rls",
    pattern:
      /\b(?:ROW LEVEL SECURITY|ENABLE ROW LEVEL SECURITY|CREATE POLICY|ALTER POLICY|auth\.uid\s*\()\b/gi,
  },
  {
    id: "connection.reconnect_loop",
    pattern:
      /\b(?:reconnect|retryConnection|scheduleReconnect|connectionRetry|backoff)\b/gi,
  },
  {
    id: "connection.persistent_channel",
    pattern: /\.(?:channel|subscribe)\s*\(|\b(?:heartbeat|keepalive)\b/gi,
  },
  {
    id: "connection.online_state_listener",
    pattern:
      /addEventListener\s*\(\s*["'](?:online|offline|visibilitychange)["']/g,
  },
  {
    id: "connection.hardcoded_localhost",
    pattern: /\bhttps?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/g,
  },
];

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: options.encoding ?? "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function splitNull(value) {
  return value.split("\0").filter(Boolean);
}

function normalizeRepoPath(value) {
  return value.replaceAll("\\", "/").replace(/^\.\/+/, "");
}

function isAuditPath(filePath) {
  return filePath === "audit" || filePath.startsWith("audit/");
}

function isSensitivePath(filePath) {
  const basename = path.posix.basename(filePath).toLowerCase();
  if (
    (basename === ".env" || basename.startsWith(".env.")) &&
    !/\.(?:example|sample|template)$/.test(basename)
  ) {
    return true;
  }
  return /(?:^|\/)(?:id_rsa|id_ed25519|credentials?)(?:\.|$)/i.test(filePath) ||
    /\.(?:key|p12|pfx|pem)$/i.test(filePath);
}

async function collectSourcePaths() {
  const tracked = splitNull(git(["ls-files", "-z"])).map(normalizeRepoPath);
  const untracked = splitNull(
    git(["ls-files", "--others", "--exclude-standard", "-z"]),
  ).map(normalizeRepoPath);
  const candidates = new Set(
    [...tracked, ...untracked].filter((filePath) => !isAuditPath(filePath)),
  );

  const excludedSensitiveCount = [...candidates].filter(isSensitivePath).length;
  const paths = [...candidates].filter((filePath) => !isSensitivePath(filePath));
  paths.sort((a, b) => a.localeCompare(b, "en"));

  return {
    paths,
    trackedCount: tracked.filter((filePath) => !isAuditPath(filePath)).length,
    untrackedCount: untracked.filter((filePath) => !isAuditPath(filePath)).length,
    excludedSensitiveCount,
  };
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function detectText(buffer, extension) {
  if (!TEXT_EXTENSIONS.has(extension)) return false;
  const sample = buffer.subarray(0, Math.min(buffer.length, 16 * 1024));
  return !sample.includes(0);
}

function detectType(filePath, isText) {
  const basename = path.posix.basename(filePath);
  const extension = path.posix.extname(filePath).toLowerCase();
  if (basename === "Dockerfile") return "container-config";
  if (basename === "LICENSE") return "license";
  if (basename === "VERSION") return "version";
  if (basename.startsWith(".env")) return "environment-template";
  if (basename.startsWith(".git")) return "git-config";
  return TYPE_BY_EXTENSION.get(extension) ?? (isText ? "text" : "binary");
}

function looksLikeWrapper(text, size) {
  if (!text || size > 4096) return false;
  const withoutComments = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .trim();
  return (
    withoutComments.length > 0 &&
    /(?:\bimport\b|\bexport\b)/.test(withoutComments) &&
    !/(?:\bfunction\b|=>|\bclass\b|\bfetch\s*\(|\bsetTimeout\s*\()/.test(
      withoutComments,
    )
  );
}

function classifyFile(filePath, type, text, size) {
  const extension = path.posix.extname(filePath).toLowerCase();
  const executableAsset = [".js", ".css"].includes(extension);
  const inGeneratedAssets = filePath.startsWith("public/assets/");

  if (filePath.startsWith("artifacts/")) {
    return {
      origin: "generated",
      kind: "artifact-snapshot",
      editable: false,
    };
  }
  if (
    inGeneratedAssets ||
    /^public\/workbox-[A-Za-z0-9_-]+\.(?:js|css)$/.test(filePath)
  ) {
    if (executableAsset && looksLikeWrapper(text, size)) {
      return {
        origin: "generated",
        kind: "bundle-wrapper",
        editable: false,
      };
    }
    return {
      origin: "generated",
      kind: executableAsset ? "bundle" : "bundle-asset",
      editable: false,
    };
  }
  if (
    /(?:^|\/)(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(filePath)
  ) {
    return {
      origin: "generated",
      kind: "dependency-lock",
      editable: false,
    };
  }
  if (
    type === "image" ||
    type === "image-vector" ||
    type === "font" ||
    type === "audio" ||
    type === "video" ||
    type === "archive"
  ) {
    return {
      origin: "authored",
      kind: "static-asset",
      editable: true,
    };
  }
  if (
    filePath === "index.html" ||
    filePath.startsWith("public/") &&
    ["javascript", "html", "json", "stylesheet"].includes(type)
  ) {
    return {
      origin: "authored",
      kind: "runtime",
      editable: true,
    };
  }
  if (
    filePath === "server.mjs" ||
    filePath.startsWith("server/") ||
    filePath.startsWith("src/")
  ) {
    return {
      origin: "authored",
      kind: "source",
      editable: true,
    };
  }
  if (
    filePath.startsWith("scripts/") ||
    /\.(?:sh|bat|ps1)$/.test(filePath)
  ) {
    return {
      origin: "authored",
      kind: "tooling",
      editable: true,
    };
  }
  if (type === "sql") {
    return {
      origin: "authored",
      kind: "database",
      editable: true,
    };
  }
  if (["markdown", "license"].includes(type) || filePath.startsWith("docs/")) {
    return {
      origin: "authored",
      kind: "documentation",
      editable: true,
    };
  }
  return {
    origin: "authored",
    kind: "configuration",
    editable: true,
  };
}

function countMatches(text, pattern) {
  pattern.lastIndex = 0;
  let count = 0;
  while (pattern.exec(text) !== null) {
    count += 1;
    if (pattern.lastIndex === 0) pattern.lastIndex += 1;
  }
  pattern.lastIndex = 0;
  return count;
}

function detectRisks(text) {
  if (text === null) return [];
  return RISK_PATTERNS.map(({ id, pattern }) => ({
    id,
    count: countMatches(text, pattern),
  })).filter(({ count }) => count > 0);
}

function extensionCandidates(candidate) {
  if (path.posix.extname(candidate)) return [candidate];
  return [
    candidate,
    `${candidate}.js`,
    `${candidate}.mjs`,
    `${candidate}.cjs`,
    `${candidate}.ts`,
    `${candidate}.tsx`,
    `${candidate}.jsx`,
    `${candidate}.json`,
    `${candidate}.css`,
    path.posix.join(candidate, "index.js"),
    path.posix.join(candidate, "index.ts"),
    path.posix.join(candidate, "index.tsx"),
  ];
}

function resolveReference(sourcePath, rawReference, pathSet, basenameIndex) {
  const cleaned = rawReference
    .replace(/[?#].*$/, "")
    .replace(/^file:\/\//, "")
    .trim();
  if (
    !cleaned ||
    /^(?:https?:|wss?:|data:|blob:|mailto:|tel:|node:)/i.test(cleaned)
  ) {
    return [];
  }

  const candidates = [];
  if (cleaned.startsWith("@/")) {
    candidates.push(`src/${cleaned.slice(2)}`);
  } else if (cleaned.startsWith("/")) {
    candidates.push(`public${cleaned}`, cleaned.slice(1));
  } else if (cleaned.startsWith(".")) {
    candidates.push(
      path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), cleaned)),
    );
  } else {
    candidates.push(cleaned);
    if (cleaned.startsWith("public/")) candidates.push(cleaned);
  }

  const resolved = new Set();
  for (const candidate of candidates) {
    for (const extended of extensionCandidates(normalizeRepoPath(candidate))) {
      if (pathSet.has(extended)) resolved.add(extended);
    }
  }

  if (resolved.size === 0 && !cleaned.includes("/")) {
    for (const match of basenameIndex.get(cleaned) ?? []) resolved.add(match);
  }
  return [...resolved];
}

function extractReferences(sourcePath, text, pathSet, basenameIndex) {
  if (text === null) return [];
  const rawReferences = new Set();
  const patterns = [
    /(?:from\s*|import\s*\(|require\s*\(|new\s+URL\s*\()\s*["'`]([^"'`]+)["'`]/g,
    /(?:src|href|content|url)\s*=\s*["']([^"']+)["']/gi,
    /["'`]((?:\.{0,2}\/|\/|@\/)[^"'`\s]+)["'`]/g,
    /\b([A-Za-z0-9_@./-]+\.(?:c?m?js|jsx|tsx?|css|json|html?|svg|png|jpe?g|webp|gif|woff2?|ttf|wav|mp3|mp4|webmanifest|sql|md))(?:[?#][^\s"'`)]*)?/g,
  ];

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      rawReferences.add(match[1]);
    }
  }

  const references = new Set();
  for (const rawReference of rawReferences) {
    for (const resolved of resolveReference(
      sourcePath,
      rawReference,
      pathSet,
      basenameIndex,
    )) {
      if (resolved !== sourcePath) references.add(resolved);
    }
  }
  return [...references].sort((a, b) => a.localeCompare(b, "en"));
}

function identifyEntrypoint(filePath) {
  if (filePath === "index.html") return "browser-entry";
  if (filePath === "server.mjs") return "server-entry";
  if (
    filePath === "public/sw.js" ||
    filePath === "public/firebase-messaging-sw.js"
  ) {
    return "worker-entry";
  }
  if (filePath === "package.json" || filePath === "vite.config.ts") {
    return "build-entry";
  }
  if (
    filePath.startsWith(".github/workflows/") ||
    filePath.startsWith("scripts/") ||
    filePath.startsWith("bin/") ||
    /^(?:start|setup|doctor|update|install)[^/]*\.(?:sh|bat|ps1)$/.test(filePath)
  ) {
    return "tool-entry";
  }
  return null;
}

function computeActiveSet(filesByPath) {
  const active = new Set();
  const queue = [];
  for (const file of filesByPath.values()) {
    if (file.entrypoint) {
      active.add(file.path);
      queue.push(file.path);
    }
  }

  for (let index = 0; index < queue.length; index += 1) {
    const current = filesByPath.get(queue[index]);
    for (const reference of current.references) {
      if (!active.has(reference)) {
        active.add(reference);
        queue.push(reference);
      }
    }
  }
  return active;
}

function summarizeCounts(files, selector) {
  const counts = {};
  for (const file of files) {
    const key = selector(file);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, "en")),
  );
}

function renderSummary(manifest) {
  const lines = [
    "# Current file audit",
    "",
    `Schema: ${manifest.schemaVersion}`,
    `Worktree fingerprint: ${manifest.repository.worktreeFingerprint}`,
    `Audited files: ${manifest.scope.auditedFileCount}`,
    `Git-tracked non-audit files: ${manifest.scope.trackedNonAuditFileCount}`,
    `Untracked non-audit files: ${manifest.scope.untrackedNonAuditFileCount}`,
    `Excluded sensitive paths: ${manifest.scope.excludedSensitivePathCount}`,
    `Active/reachable files: ${manifest.summary.activeFileCount}`,
    "",
    "## Classification",
    "",
  ];

  for (const [classification, count] of Object.entries(
    manifest.summary.classifications,
  )) {
    lines.push(`- ${classification}: ${count}`);
  }

  lines.push("", "## Risk signals", "");
  if (Object.keys(manifest.summary.riskSignals).length === 0) {
    lines.push("- none");
  } else {
    for (const [signal, count] of Object.entries(manifest.summary.riskSignals)) {
      lines.push(`- ${signal}: ${count}`);
    }
  }

  lines.push(
    "",
    "## Safety and interpretation",
    "",
    "- This directory is the reproducible source of truth for the current worktree; older per-file reports under `audit/` are historical snapshots and may be stale.",
    "- The audit contains hashes, sizes, classifications, paths, graph edges, and signal counts only.",
    "- It never stores source snippets, environment values, matched secret values, or file contents.",
    "- `generated:bundle-wrapper` is intentionally distinct from full generated bundles.",
    "- `active` means reachable from a declared runtime, build, workflow, or tool entrypoint through detected static references.",
    "- Regenerate with `node scripts/generate-current-audit.mjs`.",
    "- Verify freshness with `node scripts/verify-current-audit.mjs`.",
    "",
  );
  return `${lines.join("\n")}`;
}

export async function buildCurrentAudit() {
  const { paths, trackedCount, untrackedCount, excludedSensitiveCount } =
    await collectSourcePaths();
  const trackedSet = new Set(splitNull(git(["ls-files", "-z"])));
  const pathSet = new Set(paths);
  const textByPath = new Map();
  const basenameIndex = new Map();
  for (const filePath of paths) {
    const basename = path.posix.basename(filePath);
    if (!basenameIndex.has(basename)) basenameIndex.set(basename, []);
    basenameIndex.get(basename).push(filePath);
  }

  const files = [];
  for (const filePath of paths) {
    const absolutePath = path.join(REPO_ROOT, filePath);
    let buffer;
    try {
      buffer = await readFile(absolutePath);
    } catch (error) {
      if (error?.code === "ENOENT") {
        throw new Error(`Cannot audit missing current source file: ${filePath}`);
      }
      throw error;
    }
    const extension = path.posix.extname(filePath).toLowerCase();
    const isText = detectText(buffer, extension);
    const text = isText ? buffer.toString("utf8") : null;
    textByPath.set(filePath, text);
    const type = detectType(filePath, isText);
    const classification = classifyFile(filePath, type, text, buffer.length);
    files.push({
      path: filePath,
      source: trackedSet.has(filePath) ? "git-tracked" : "worktree-untracked",
      sha256: sha256(buffer),
      size: buffer.length,
      type,
      text: isText,
      classification: `${classification.origin}:${classification.kind}`,
      editableSource: classification.editable,
      entrypoint: identifyEntrypoint(filePath),
      references: [],
      consumers: [],
      activeConsumers: [],
      active: false,
      riskSignals: detectRisks(text),
    });
  }

  const filesByPath = new Map(files.map((file) => [file.path, file]));
  for (const file of files) {
    file.references = extractReferences(
      file.path,
      textByPath.get(file.path),
      pathSet,
      basenameIndex,
    );
    for (const reference of file.references) {
      filesByPath.get(reference).consumers.push(file.path);
    }
  }
  for (const file of files) {
    file.consumers.sort((a, b) => a.localeCompare(b, "en"));
  }

  const activeSet = computeActiveSet(filesByPath);
  for (const file of files) {
    file.active = activeSet.has(file.path);
    file.activeConsumers = file.consumers.filter((consumer) =>
      activeSet.has(consumer),
    );
  }

  const worktreeFingerprint = sha256(
    Buffer.from(
      files
        .map((file) => `${file.path}\0${file.sha256}\0${file.size}\n`)
        .join(""),
    ),
  );
  const riskTotals = {};
  for (const file of files) {
    for (const signal of file.riskSignals) {
      riskTotals[signal.id] = (riskTotals[signal.id] ?? 0) + signal.count;
    }
  }

  const manifest = {
    schemaVersion: 1,
    repository: {
      worktreeFingerprint,
    },
    scope: {
      source: "Git index paths with current worktree content",
      excludedPathPrefixes: ["audit/"],
      sensitivePathPolicy:
        "Omit live environment, private-key, and credential paths; never emit contents or matched values",
      trackedNonAuditFileCount: trackedCount,
      untrackedNonAuditFileCount: untrackedCount,
      excludedSensitivePathCount: excludedSensitiveCount,
      auditedFileCount: files.length,
    },
    summary: {
      totalBytes: files.reduce((sum, file) => sum + file.size, 0),
      activeFileCount: files.filter((file) => file.active).length,
      classifications: summarizeCounts(files, (file) => file.classification),
      types: summarizeCounts(files, (file) => file.type),
      riskSignals: Object.fromEntries(
        Object.entries(riskTotals).sort(([a], [b]) => a.localeCompare(b, "en")),
      ),
    },
    files,
  };

  const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
  const summaryText = renderSummary(manifest);
  return {
    manifest,
    outputs: new Map([
      [`${OUTPUT_DIR}/manifest.json`, manifestText],
      [`${OUTPUT_DIR}/README.md`, summaryText],
    ]),
  };
}

export async function writeCurrentAudit() {
  const { manifest, outputs } = await buildCurrentAudit();
  await mkdir(path.join(REPO_ROOT, OUTPUT_DIR), { recursive: true });
  for (const [filePath, content] of outputs) {
    await writeFile(path.join(REPO_ROOT, filePath), content, "utf8");
  }
  return manifest;
}

async function main() {
  const manifest = await writeCurrentAudit();
  process.stdout.write(
    `Generated ${OUTPUT_DIR}/manifest.json and ${OUTPUT_DIR}/README.md for ` +
      `${manifest.scope.auditedFileCount} current files.\n`,
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
