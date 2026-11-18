import { chromium } from "playwright";
import fs from "fs";
import path from "path";

// Proper Apple-style squircle path (continuous cubic beziers)
const squirclePath = "M 34 4 L 94 4 C 114 4 124 14 124 34 L 124 94 C 124 114 114 124 94 124 L 34 124 C 14 124 4 114 4 94 L 4 34 C 4 14 14 4 34 4 Z";

// Function to assemble multiple PNG buffers into a multi-resolution ICO file
function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = count * dirEntrySize;
  let offset = headerSize + dirSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // count of images

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map((i) => i.buffer)]);
}

function getSvg(strokeWidth = 11, gradStart = "#1E3A8A", gradEnd = "#0284C7") {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
      <defs>
        <linearGradient id="tw-ico-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradStart}" />
          <stop offset="100%" stop-color="${gradEnd}" />
        </linearGradient>
      </defs>
      <path d="${squirclePath}" fill="url(#tw-ico-grad)" />
      <g fill="none" stroke="#FFFFFF" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 40 42 L 40 86" />
        <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
      </g>
    </svg>
  `;
}

async function generate() {
  fs.mkdirSync("public", { recursive: true });
  fs.mkdirSync("src/app", { recursive: true });

  // 1. Write public SVGs
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="tw-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color: var(--accent-primary, #1E3A8A);" />
      <stop offset="100%" style="stop-color: var(--accent-cta, #0284C7);" />
    </linearGradient>
  </defs>
  <path d="${squirclePath}" fill="url(#tw-brand-grad)" />
  <g fill="none" stroke="var(--bg-base, #FFFFFF)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 40 42 L 40 86" />
    <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
  </g>
</svg>`;

  const logoLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <path d="${squirclePath}" fill="#1E3A8A" />
  <g fill="none" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 40 42 L 40 86" />
    <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
  </g>
</svg>`;

  const logoDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <path d="${squirclePath}" fill="#F8FAFC" />
  <g fill="none" stroke="#0F172A" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 40 42 L 40 86" />
    <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
  </g>
</svg>`;

  const logoMonoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <mask id="tw-mask">
      <rect width="128" height="128" fill="#FFFFFF" />
      <g fill="none" stroke="#000000" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 40 42 L 40 86" />
        <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
      </g>
    </mask>
  </defs>
  <path d="${squirclePath}" fill="currentColor" mask="url(#tw-mask)" />
</svg>`;

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="tw-fav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <path d="${squirclePath}" fill="url(#tw-fav-grad)" />
  <g fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 40 42 L 40 86" />
    <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
  </g>
</svg>`;

  fs.writeFileSync("public/logo.svg", logoSvg);
  fs.writeFileSync("public/logo-light.svg", logoLightSvg);
  fs.writeFileSync("public/logo-dark.svg", logoDarkSvg);
  fs.writeFileSync("public/logo-monochrome.svg", logoMonoSvg);
  fs.writeFileSync("public/favicon.svg", faviconSvg);
  console.log("✓ Saved public logo & favicon SVGs");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Generating icon sizes...");

  // Generate multi-resolution ICO (16x16, 32x32, 48x48)
  const icoSizes = [
    { size: 16, strokeWidth: 14 },
    { size: 32, strokeWidth: 12 },
    { size: 48, strokeWidth: 11 },
  ];
  const icoBuffers = [];

  for (const { size, strokeWidth } of icoSizes) {
    const html = `<!DOCTYPE html><html><head><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }</style></head><body>${getSvg(strokeWidth)}</body></html>`;
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html);
    const buffer = await page.screenshot({ omitBackground: true });
    icoBuffers.push({ width: size, height: size, buffer });
  }

  const icoBuffer = createIco(icoBuffers);
  fs.writeFileSync("public/favicon.ico", icoBuffer);
  fs.writeFileSync("src/app/favicon.ico", icoBuffer);
  console.log("✓ Saved public/favicon.ico and src/app/favicon.ico");

  // Generate 512x512 icon.png
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><head><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { width: 512px; height: 512px; overflow: hidden; background: transparent; }</style></head><body>${getSvg(11)}</body></html>`);
  await page.screenshot({ path: "src/app/icon.png", omitBackground: true });
  fs.copyFileSync("src/app/icon.png", "public/icon.png");
  console.log("✓ Saved src/app/icon.png and public/icon.png (512x512)");

  // Generate 180x180 apple-icon.png
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`<!DOCTYPE html><html><head><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { width: 180px; height: 180px; overflow: hidden; background: transparent; }</style></head><body>${getSvg(11)}</body></html>`);
  await page.screenshot({ path: "src/app/apple-icon.png", omitBackground: true });
  fs.copyFileSync("src/app/apple-icon.png", "public/apple-touch-icon.png");
  console.log("✓ Saved src/app/apple-icon.png and public/apple-touch-icon.png (180x180)");

  // Generate OG and Twitter card images
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          body {
            width: 1200px;
            height: 630px;
            background: #0A1628;
            background-image:
              radial-gradient(circle at 15% 20%, rgba(30, 58, 138, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 85% 80%, rgba(2, 132, 199, 0.3) 0%, transparent 50%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
          }
          .card {
            width: 1040px;
            display: flex;
            align-items: center;
            gap: 64px;
            padding: 60px;
            background: rgba(15, 31, 58, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 36px;
            box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
          }
          .badge-box { width: 200px; height: 200px; flex-shrink: 0; }
          .wordmark { font-size: 88px; font-weight: 900; letter-spacing: -2px; line-height: 1; }
          .wordmark span { color: #38BDF8; }
          .tagline { font-size: 30px; font-weight: 500; color: #94A3B8; margin-top: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge-box">${getSvg(11)}</div>
          <div>
            <div class="wordmark">Tax<span>Wise</span></div>
            <div class="tagline">The tax plan that actually fits your life.</div>
          </div>
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: "public/og-image.png" });
  await page.screenshot({ path: "public/twitter-card.png" });
  console.log("✓ Saved og-image.png and twitter-card.png");

  await browser.close();
  console.log("All assets generated successfully!");
}

generate().catch((err) => {
  console.error("Error generating assets:", err);
  process.exit(1);
});
