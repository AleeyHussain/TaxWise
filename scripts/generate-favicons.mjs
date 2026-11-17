import { chromium } from "playwright";
import fs from "fs";
import path from "path";

// Function to assemble multiple PNG buffers into a multi-resolution ICO file
function createIco(images) {
  // images: array of { width, height, buffer }
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

function getSvg(strokeWidth = 10, rx = 24) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
      <defs>
        <linearGradient id="tw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2563EB" />
          <stop offset="100%" stop-color="#06B6D4" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="120" height="120" rx="${rx}" fill="url(#tw-grad)" />
      <g fill="none" stroke="#FFFFFF" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 24 44 L 56 44" />
        <path d="M 40 44 L 40 86" />
        <path d="M 64 44 L 73 86 L 84 55 L 95 88 L 105 38" />
      </g>
      <path d="M 106 14 Q 106 20 100 20 Q 106 20 106 26 Q 106 20 112 20 Q 106 20 106 14 Z" fill="#FFFFFF" fill-opacity="0.9" />
    </svg>
  `;
}

async function generate() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Generating icon sizes...");

  // 1. Generate icon buffers for ICO (16x16, 32x32, 48x48)
  const icoSizes = [
    { size: 16, strokeWidth: 14, rx: 20 },
    { size: 32, strokeWidth: 12, rx: 22 },
    { size: 48, strokeWidth: 11, rx: 24 },
  ];
  const icoBuffers = [];

  for (const { size, strokeWidth, rx } of icoSizes) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
          </style>
        </head>
        <body>${getSvg(strokeWidth, rx)}</body>
      </html>
    `;
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html);
    const buffer = await page.screenshot({ omitBackground: true });
    icoBuffers.push({ width: size, height: size, buffer });
  }

  // Write favicon.ico
  const icoBuffer = createIco(icoBuffers);
  fs.writeFileSync("public/favicon.ico", icoBuffer);
  console.log("✓ Saved public/favicon.ico");

  // 2. Generate 512x512 icon.png
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 512px; height: 512px; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>${getSvg(10, 24)}</body>
    </html>
  `);
  await page.screenshot({ path: "src/app/icon.png", omitBackground: true });
  console.log("✓ Saved src/app/icon.png (512x512)");

  // 3. Generate 180x180 apple-icon.png
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 180px; height: 180px; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>${getSvg(10, 24)}</body>
    </html>
  `);
  await page.screenshot({ path: "src/app/apple-icon.png", omitBackground: true });
  fs.copyFileSync("src/app/apple-icon.png", "public/apple-touch-icon.png");
  console.log("✓ Saved src/app/apple-icon.png & public/apple-touch-icon.png (180x180)");

  // 4. Generate 1200x630 og-image.png
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body {
            width: 1200px;
            height: 630px;
            overflow: hidden;
            background: #0B0F19;
            background-image:
              radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.25) 0%, transparent 50%),
              radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.20) 0%, transparent 50%);
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
            background: rgba(20, 26, 46, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 36px;
            box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          .badge-box {
            width: 200px;
            height: 200px;
            flex-shrink: 0;
          }
          .content {
            display: flex;
            flex-direction: column;
          }
          .wordmark {
            font-size: 110px;
            font-weight: 900;
            letter-spacing: -3px;
            line-height: 1;
            margin-bottom: 20px;
          }
          .wordmark span {
            color: #38BDF8;
          }
          .tagline {
            font-size: 38px;
            font-weight: 500;
            color: #94A3B8;
            line-height: 1.3;
          }
          .pill {
            margin-top: 28px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 20px;
            font-weight: 600;
            color: #22D3EE;
            background: rgba(6, 182, 212, 0.12);
            border: 1px solid rgba(6, 182, 212, 0.3);
            border-radius: 9999px;
            padding: 8px 24px;
            width: fit-content;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge-box">
            ${getSvg(10, 24)}
          </div>
          <div class="content">
            <div class="wordmark">Tax<span>Wise</span></div>
            <div class="tagline">The tax plan that fits you.</div>
            <div class="pill">
              <span>✦</span> AI Recommender · Transparent 8-Plan Catalogue
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: "public/og-image.png" });
  console.log("✓ Saved public/og-image.png (1200x630)");

  // 5. Generate 800x418 twitter-card.png
  await page.setViewportSize({ width: 800, height: 418 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body {
            width: 800px;
            height: 418px;
            overflow: hidden;
            background: #0B0F19;
            background-image:
              radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.25) 0%, transparent 50%),
              radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.20) 0%, transparent 50%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
          }
          .card {
            width: 720px;
            display: flex;
            align-items: center;
            gap: 40px;
            padding: 40px;
            background: rgba(20, 26, 46, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 28px;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          .badge-box {
            width: 140px;
            height: 140px;
            flex-shrink: 0;
          }
          .content {
            display: flex;
            flex-direction: column;
          }
          .wordmark {
            font-size: 76px;
            font-weight: 900;
            letter-spacing: -2px;
            line-height: 1;
            margin-bottom: 12px;
          }
          .wordmark span {
            color: #38BDF8;
          }
          .tagline {
            font-size: 26px;
            font-weight: 500;
            color: #94A3B8;
            line-height: 1.3;
          }
          .pill {
            margin-top: 16px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            font-weight: 600;
            color: #22D3EE;
            background: rgba(6, 182, 212, 0.12);
            border: 1px solid rgba(6, 182, 212, 0.3);
            border-radius: 9999px;
            padding: 6px 18px;
            width: fit-content;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge-box">
            ${getSvg(10, 24)}
          </div>
          <div class="content">
            <div class="wordmark">Tax<span>Wise</span></div>
            <div class="tagline">The tax plan that fits you.</div>
            <div class="pill">
              <span>✦</span> AI Recommender · Transparent Pricing
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: "public/twitter-card.png" });
  console.log("✓ Saved public/twitter-card.png (800x418)");

  await browser.close();
  console.log("All favicons & cards successfully generated!");
}

generate().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
