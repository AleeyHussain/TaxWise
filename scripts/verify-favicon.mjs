import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";

const PORT = 3042;
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function verify() {
  fs.mkdirSync("public/screenshots", { recursive: true });

  // 1. Verify Raw SVG
  const logoRaw = fs.readFileSync("public/logo.svg", "utf-8");
  console.log("Checking raw SVG...");
  if (logoRaw.includes("<text")) {
    throw new Error("FAIL: Raw SVG contains <text> element!");
  }
  if (logoRaw.includes("106 14 Q 106 20")) {
    throw new Error("FAIL: Raw SVG still contains old 4-pointed sparkle!");
  }
  console.log("✓ Raw SVG verified: No <text>, no AI sparkles.");

  // 2. Start Next.js server to take real screenshots
  console.log("Starting Next.js production server on port " + PORT + "...");
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
  });

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}`);
      if (res.status === 200) break;
    } catch {
      await wait(500);
    }
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
    await wait(800);

    // Screenshot 1: Header with logo at actual size
    const header = page.locator("header");
    await header.screenshot({ path: "public/screenshots/header-logo.png" });
    console.log("✓ Saved public/screenshots/header-logo.png");

    // Screenshot 2: Mock browser tab showing favicon at 32px
    const tabHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body {
              background: #18181B;
              padding: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 140px;
            }
            .chrome-tab {
              background: #27272A;
              color: #E4E4E7;
              border-radius: 12px 12px 0 0;
              padding: 10px 18px;
              display: flex;
              align-items: center;
              gap: 12px;
              width: 320px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.4);
              border: 1px solid rgba(255,255,255,0.08);
              border-bottom: none;
            }
            .favicon-img {
              width: 32px;
              height: 32px;
              border-radius: 6px;
              flex-shrink: 0;
            }
            .tab-title {
              font-size: 13px;
              font-weight: 500;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .tab-close {
              margin-left: auto;
              color: #A1A1AA;
              font-size: 14px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="chrome-tab">
            <img class="favicon-img" src="http://localhost:${PORT}/favicon.svg" alt="TaxWise Favicon" />
            <span class="tab-title">TaxWise — The tax plan that actually fits your life</span>
            <span class="tab-close">×</span>
          </div>
        </body>
      </html>
    `;

    const tabTab = await browser.newPage({ viewport: { width: 440, height: 160 } });
    await tabTab.setContent(tabHtml);
    await wait(300);
    const tabElement = tabTab.locator(".chrome-tab");
    await tabElement.screenshot({ path: "public/screenshots/favicon-tab.png" });
    console.log("✓ Saved public/screenshots/favicon-tab.png (Tab at 32px)");
    await tabTab.close();

    // Screenshot 3: Logo scaled down to exactly 16x16, enlarged 10x
    const zoomHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body {
              background: #09090B;
              color: #FAFAFA;
              padding: 32px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }
            .comparison {
              display: flex;
              align-items: center;
              gap: 40px;
            }
            .item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
            }
            .label {
              font-size: 12px;
              color: #A1A1AA;
              font-weight: 500;
            }
            .icon-16 {
              width: 16px;
              height: 16px;
            }
            .icon-160 {
              width: 160px;
              height: 160px;
              image-rendering: pixelated;
              border: 1px dashed rgba(255,255,255,0.2);
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="comparison">
            <div class="item">
              <span class="label">Actual 16×16px</span>
              <img class="icon-16" src="http://localhost:${PORT}/favicon.svg" />
            </div>
            <div class="item">
              <span class="label">Enlarged 10× (160×160px Pixel Test)</span>
              <img class="icon-160" src="http://localhost:${PORT}/favicon.svg" />
            </div>
          </div>
        </body>
      </html>
    `;

    const zoomTab = await browser.newPage({ viewport: { width: 480, height: 260 } });
    await zoomTab.setContent(zoomHtml);
    await wait(300);
    await zoomTab.screenshot({ path: "public/screenshots/favicon-16px-enlarged.png" });
    console.log("✓ Saved public/screenshots/favicon-16px-enlarged.png (16px enlarged 10x)");
    await zoomTab.close();

  } finally {
    await browser.close();
    server.kill();
  }
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
