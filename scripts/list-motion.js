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
const inventory = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('<motion.')) {
      const tagMatch = line.match(/<motion\.([a-zA-Z0-9]+)/);
      const tag = tagMatch ? tagMatch[1] : 'element';
      const block = lines.slice(idx, idx + 10).join(' ');
      const anims = [];
      if (block.includes('initial=')) anims.push('initial/animate');
      if (block.includes('exit=')) anims.push('exit');
      if (block.includes('whileHover=')) anims.push('whileHover');
      if (block.includes('whileTap=')) anims.push('whileTap');
      if (block.includes('whileInView=')) anims.push('whileInView');
      if (block.includes('layoutId=')) anims.push('layoutId');
      if (block.includes('custom=')) anims.push('custom sliding');
      if (block.includes('style=')) anims.push('scroll parallax / scale');

      inventory.push({
        file: f.replace(/\\/g, '/'),
        line: idx + 1,
        tag: 'motion.' + tag,
        props: anims.length > 0 ? anims.join(', ') : 'motion transition',
        snippet: block.replace(/\s+/g, ' ').slice(0, 100),
      });
    }
  });
}

console.log('Total entries:', inventory.length);
inventory.forEach((item, idx) => {
  console.log(`${idx + 1}. \`${item.file}:${item.line}\` \`<${item.tag}>\` — ${item.props}`);
});
