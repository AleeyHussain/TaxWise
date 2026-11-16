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

const files = getFiles('src');
let buttonTransitionHover = [];
let cardTransitionHover = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  // Check buttons
  const btnMatches = content.match(/<button[^>]*className=["'{`][^"'`}]*["'{`]/g) || [];
  btnMatches.forEach(b => {
    const hovers = (b.match(/hover:[^\s"'`}>]+/g) || []);
    const transitions = (b.match(/transition[^\s"'`}>]*/g) || []);
    buttonTransitionHover.push({ file: path.basename(f), hovers: hovers.length, transitions: transitions.length, total: hovers.length + transitions.length, classes: [...hovers, ...transitions] });
  });

  // Check cards
  const cardMatches = content.match(/className=["'{`][^"'`}]*card[^"'`}]*["'{`]/g) || [];
  cardMatches.forEach(c => {
    const hovers = (c.match(/hover:[^\s"'`}>]+/g) || []);
    const transitions = (c.match(/transition[^\s"'`}>]*/g) || []);
    cardTransitionHover.push({ file: path.basename(f), hovers: hovers.length, transitions: transitions.length, total: hovers.length + transitions.length, classes: [...hovers, ...transitions] });
  });
}

console.log('Buttons analyzed:', buttonTransitionHover.length);
console.log('Buttons with total hover+transition < 3:', buttonTransitionHover.filter(b => b.total < 3).length);
console.log('Cards analyzed:', cardTransitionHover.length);
console.log('Cards with total hover+transition < 2:', cardTransitionHover.filter(c => c.total < 2).length);
console.log('Sample button interactive classes:', buttonTransitionHover.slice(0, 5));
console.log('Sample card interactive classes:', cardTransitionHover.slice(0, 5));
