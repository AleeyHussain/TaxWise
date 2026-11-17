const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res = res.concat(getFiles(p));
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) res.push(p);
  }
  return res;
}

const matches = [];
for (const f of getFiles('src')) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (/\bbtn\b|btn-/.test(l)) {
      matches.push({ file: f.replace(/\\/g, '/'), line: i + 1, text: l.trim() });
    }
  });
}

console.log('Total matches:', matches.length);
matches.forEach(m => console.log(`${m.file}:${m.line} -> ${m.text}`));
