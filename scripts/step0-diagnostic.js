const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res = res.concat(getFiles(p));
    else if (p.endsWith('.tsx') || p.endsWith('.ts') || p.endsWith('.css')) res.push(p);
  }
  return res;
}

const files = getFiles('src');

// 1. backdrop-blur
let blurMatches = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('backdrop-blur')) {
      blurMatches.push({ file: f.replace(/\\/g, '/'), line: i + 1, text: l.trim() });
    }
  });
}

// 2. data-theme
let dataThemeMatches = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('data-theme')) {
      dataThemeMatches.push({ file: f.replace(/\\/g, '/'), line: i + 1, text: l.trim() });
    }
  });
}

// 3. tokens.css properties
const tokensContent = fs.readFileSync('src/styles/tokens.css', 'utf8');

// 4. hardcoded colors: bg-slate-, bg-gray-, bg-zinc-, bg-white, text-black, bg-black
let hardcoded = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    const m = l.match(/\b(bg-slate-[a-z0-9]+|bg-gray-[a-z0-9]+|bg-zinc-[a-z0-9]+|bg-white\b|text-black\b|bg-black\b)/g);
    if (m) {
      hardcoded.push({ file: f.replace(/\\/g, '/'), line: i + 1, matches: m });
    }
  });
}

// 5. className="btn
let btnMatches = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('className="btn ') || l.includes('className={`btn ') || l.includes('btn btn-') || l.includes('className="btn"')) {
      btnMatches.push({ file: f.replace(/\\/g, '/'), line: i + 1, text: l.trim() });
    }
  });
}

console.log('=== STEP 0 DIAGNOSTIC RESULTS ===\n');

console.log('1. backdrop-blur count:', blurMatches.length);
const blurFiles = [...new Set(blurMatches.map(m => m.file))];
console.log('Files with backdrop-blur (' + blurFiles.length + ' files):');
blurFiles.forEach(f => console.log('  -', f));

console.log('\n2. data-theme count:', dataThemeMatches.length);
dataThemeMatches.forEach(m => console.log('  -', m.file, 'line', m.line, m.text));

console.log('\n3. tokens.css summary:');
console.log(tokensContent);

console.log('\n4. Hardcoded color classes count:', hardcoded.length);
hardcoded.forEach(h => console.log('  -', h.file + ':' + h.line, h.matches.join(', ')));

console.log('\n5. className="btn matches count:', btnMatches.length);
const btnFiles = [...new Set(btnMatches.map(m => m.file))];
console.log('Files with btn classes (' + btnFiles.length + ' files):');
btnFiles.forEach(f => console.log('  -', f));
