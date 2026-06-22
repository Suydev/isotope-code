import fs from 'node:fs';
import path from 'node:path';

const target = path.resolve('node_modules/@lhci/utils/src/lighthouserc.js');
let handle;
try {
  handle = fs.openSync(target, 'r+');
} catch (error) {
  if (error?.code === 'ENOENT') process.exit(0);
  throw error;
}

try {
  const source = fs.readFileSync(handle, 'utf8');
  const oldCall = 'yaml.safeLoad(contents)';
  const newCall = '(yaml.load || yaml.safeLoad)(contents)';

  if (source.includes(newCall)) {
    // Already patched by an earlier install.
  } else if (!source.includes(oldCall)) {
    throw new Error('Unsupported @lhci/utils lighthouserc parser; update the compatibility patch');
  } else {
    fs.ftruncateSync(handle, 0);
    fs.writeSync(handle, source.replace(oldCall, newCall), 0, 'utf8');
  }
} finally {
  fs.closeSync(handle);
}
