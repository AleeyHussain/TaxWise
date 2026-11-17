const fs = require("fs");
const path = require("path");

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "styles" && entry.name !== "node_modules" && entry.name !== ".next") {
        files.push(...walk(full));
      }
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      if (!entry.name.includes("globals.css") && !entry.name.includes("tokens.css")) {
        files.push(full);
      }
    }
  }
  return files;
}

const allSrc = walk("src");

// 1. Hardcoded colors
const colorRegex = /bg-(white|slate-[0-9]+|gray-[0-9]+|zinc-[0-9]+|neutral-[0-9]+)/;
let colorMatches = [];
for (const f of allSrc) {
  const content = fs.readFileSync(f, "utf8");
  content.split("\n").forEach((l, i) => {
    if (colorRegex.test(l)) colorMatches.push(f + ":" + (i + 1) + " " + l.trim());
  });
}

// 2. className="btn
let btnMatches = [];
for (const f of allSrc) {
  const content = fs.readFileSync(f, "utf8");
  content.split("\n").forEach((l, i) => {
    if (/className="btn/.test(l)) btnMatches.push(f + ":" + (i + 1) + " " + l.trim());
  });
}

// 3. backdrop-blur
let blurFiles = [];
for (const f of allSrc) {
  const content = fs.readFileSync(f, "utf8");
  if (/backdrop-blur/.test(content)) blurFiles.push(f);
}

// 4. SparkleIcon in Header.tsx
const headerContent = fs.readFileSync("src/components/layout/Header.tsx", "utf8");
const sparkleInHeader = (headerContent.match(/SparkleIcon/g) || []).length;

// 5. motion.|whileInView|AnimatePresence
const motionRegex = /(motion\.|whileInView|AnimatePresence)/g;
let motionCount = 0;
for (const f of allSrc) {
  const content = fs.readFileSync(f, "utf8");
  const matches = content.match(motionRegex);
  if (matches) motionCount += matches.length;
}

console.log("AUDIT_RESULTS:");
console.log("1. Hardcoded colors (must be 0): " + colorMatches.length);
if (colorMatches.length) console.log(colorMatches);
console.log("2. className=\"btn (must be 0): " + btnMatches.length);
if (btnMatches.length) console.log(btnMatches);
console.log("3. backdrop-blur files count (must be >= 8): " + blurFiles.length);
console.log("4. SparkleIcon in Header.tsx (must be 0): " + sparkleInHeader);
console.log("5. motion.|whileInView|AnimatePresence count (must be >= 20): " + motionCount);
