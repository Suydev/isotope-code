import fs from 'node:fs';
import path from 'node:path';

const target = path.resolve('node_modules/@lhci/utils/src/lighthouserc.js');
if (!fs.existsSync(target)) process.exit(0);

const source = fs.readFileSync(target, 'utf8');
const oldCall = 'yaml.safeLoad(contents)';
const newCall = '(yaml.load || yaml.safeLoad)(contents)';

if (source.includes(newCall)) process.exit(0);
if (!source.includes(oldCall)) {
  throw new Error('Unsupported @lhci/utils lighthouserc parser; update the compatibility patch');
}

fs.writeFileSync(target, source.replace(oldCall, newCall));
