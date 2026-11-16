const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

function getLogoSvg(bg1, bg2, twColor, sparkleColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="100%" stop-color="${bg2}" />
    </linearGradient>
    <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${sparkleColor}" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg)" />
  <!-- Monogram T -->
  <rect x="20" y="32" width="34" height="12" rx="3" fill="${twColor}" />
  <rect x="31" y="32" width="12" height="64" rx="3" fill="${twColor}" />
  <!-- Monogram W -->
  <path d="M52 32 L63 96 H73 L83 54 L93 96 H103 L114 32 H101 L94 76 L85 38 H77 L68 76 L61 32 Z" fill="${twColor}" />
  <!-- Sparkle Accent -->
  <path d="M106 16 L108.5 24.5 L117 27 L108.5 29.5 L106 38 L103.5 29.5 L95 27 L103.5 24.5 Z" fill="url(#sparkleGrad)" />
</svg>`;
}

const logoMain = getLogoSvg('#1E3A8A', '#0F172A', '#FFFFFF', '#22D3EE');
const logoLight = getLogoSvg('#2563EB', '#1E3A8A', '#FFFFFF', '#38BDF8');
const logoDark = getLogoSvg('#18191E', '#0D0E11', '#60A5FA', '#22D3EE');

fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoMain);
fs.writeFileSync(path.join(publicDir, 'logo-light.svg'), logoLight);
fs.writeFileSync(path.join(publicDir, 'logo-dark.svg'), logoDark);

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createLogoPng(size) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const rawRows = [];
  const radius = size * 0.22;
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0;
    for (let x = 0; x < size; x++) {
      // Rounded rect check
      let inBounds = true;
      const cornerX = x < radius ? radius - x : (x > size - radius ? x - (size - radius) : 0);
      const cornerY = y < radius ? radius - y : (y > size - radius ? y - (size - radius) : 0);
      if (cornerX > 0 && cornerY > 0 && (cornerX * cornerX + cornerY * cornerY > radius * radius)) {
        inBounds = false;
      }

      const idx = 1 + x * 4;
      if (!inBounds) {
        row[idx] = 0; row[idx + 1] = 0; row[idx + 2] = 0; row[idx + 3] = 0;
      } else {
        // Deep Navy Gradient (#1E3A8A to #0F172A)
        const ratio = (x + y) / (size * 2);
        row[idx] = Math.round(30 * (1 - ratio) + 15 * ratio);     // R
        row[idx + 1] = Math.round(58 * (1 - ratio) + 23 * ratio); // G
        row[idx + 2] = Math.round(138 * (1 - ratio) + 42 * ratio);// B
        row[idx + 3] = 255;

        // Draw simple 'T' in white
        const isTBar = y >= size * 0.25 && y <= size * 0.35 && x >= size * 0.16 && x <= size * 0.45;
        const isTStem = y >= size * 0.25 && y <= size * 0.75 && x >= size * 0.26 && x <= size * 0.35;
        // Draw simple 'W'
        const isW1 = y >= size * 0.25 && y <= size * 0.75 && x >= size * 0.48 && x <= size * 0.56;
        const isW2 = y >= size * 0.50 && y <= size * 0.75 && x >= size * 0.56 && x <= size * 0.65;
        const isW3 = y >= size * 0.50 && y <= size * 0.75 && x >= size * 0.65 && x <= size * 0.74;
        const isW4 = y >= size * 0.25 && y <= size * 0.75 && x >= size * 0.74 && x <= size * 0.82;

        // Sparkle in cyan (#22D3EE)
        const dx = Math.abs(x - size * 0.83);
        const dy = Math.abs(y - size * 0.22);
        const isSparkle = (dx + dy <= size * 0.08) && (dx <= size * 0.03 || dy <= size * 0.03);

        if (isTBar || isTStem || isW1 || isW2 || isW3 || isW4) {
          row[idx] = 255; row[idx + 1] = 255; row[idx + 2] = 255; row[idx + 3] = 255;
        } else if (isSparkle) {
          row[idx] = 34; row[idx + 1] = 211; row[idx + 2] = 238; row[idx + 3] = 255;
        }
      }
    }
    rawRows.push(row);
  }

  const idat = zlib.deflateSync(Buffer.concat(rawRows));
  return Buffer.concat([header, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const png180 = createLogoPng(180);
const png512 = createLogoPng(512);
const png32 = createLogoPng(32);

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(appDir, 'icon.png'), png512);

// Create valid ICO file wrapping 32x32 PNG
function createIcoFromPng(pngBuffer, size) {
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(size === 256 ? 0 : size, 0); // width
  dirEntry.writeUInt8(size === 256 ? 0 : size, 1); // height
  dirEntry.writeUInt8(0, 2); // color palette
  dirEntry.writeUInt8(0, 3); // reserved
  dirEntry.writeUInt16LE(1, 4); // color planes
  dirEntry.writeUInt16LE(32, 6); // bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // image size
  dirEntry.writeUInt32LE(22, 12); // offset (6 + 16)

  return Buffer.concat([icoHeader, dirEntry, pngBuffer]);
}

const ico = createIcoFromPng(png32, 32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);

console.log('Successfully generated all logos and icons:');
console.log('- public/logo.svg');
console.log('- public/logo-light.svg');
console.log('- public/logo-dark.svg');
console.log('- public/apple-touch-icon.png (180x180)');
console.log('- src/app/icon.png (512x512)');
console.log('- public/favicon.ico');
