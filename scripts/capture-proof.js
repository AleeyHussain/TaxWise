const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 3018;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  fs.mkdirSync(path.join(process.cwd(), "public/screenshots"), { recursive: true });

  console.log("Starting Next.js server on port " + PORT + "...");
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
  });

  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {
      await wait(500);
    }
  }

  if (!ready) {
    console.error("Server failed to start on port " + PORT);
    server.kill();
    process.exit(1);
  }

  console.log("Launching headless browser...");
  const browser = await chromium.launch({ headless: true });

  // 1. Capture landing page header with the new logo -> public/screenshots/logo-header.png
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await wait(1000);

  // Take screenshot of header element
  const header = await page.$("header");
  if (header) {
    await header.screenshot({ path: "public/screenshots/logo-header.png" });
    console.log("✓ Saved public/screenshots/logo-header.png");
  } else {
    await page.screenshot({ path: "public/screenshots/logo-header.png", clip: { x: 0, y: 0, width: 1280, height: 100 } });
    console.log("✓ Saved public/screenshots/logo-header.png (clipped)");
  }

  // 2. Capture the bot at 2x zoom showing the face (eyes, smile, cheeks) -> public/screenshots/bot.png
  // Locate the bot button
  const botButton = await page.$('button[aria-label="Open TaxWise AI Assistant"]');
  if (botButton) {
    // Zoom in on the bot
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Open TaxWise AI Assistant"]');
      if (btn) {
        btn.scrollIntoView({ behavior: "instant", block: "center" });
      }
    });
    await wait(300);

    // Take screenshot of the bot button at 2x device scale factor
    const botBox = await botButton.boundingBox();
    if (botBox) {
      const botPage = await browser.newPage({
        viewport: { width: 300, height: 300 },
        deviceScaleFactor: 2,
      });
      await botPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
      await wait(800);
      const zoomedBtn = await botPage.$('button[aria-label="Open TaxWise AI Assistant"]');
      if (zoomedBtn) {
        await zoomedBtn.screenshot({ path: "public/screenshots/bot.png" });
        console.log("✓ Saved public/screenshots/bot.png at 2x zoom");
      }
      await botPage.close();
    }
  }

  // 3. Capture tab with favicon visible -> public/screenshots/favicon.png
  // Render a browser tab bar showing the actual favicon.ico rendered next to the title
  const tabContext = await browser.newPage({ viewport: { width: 600, height: 120 }, deviceScaleFactor: 2 });
  const faviconBase64 = fs.readFileSync("public/favicon.ico").toString("base64");
  const iconPngBase64 = fs.readFileSync("src/app/icon.png").toString("base64");

  await tabContext.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body {
            background: #1E293B;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
          .browser-window {
            width: 100%;
            background: #0F172A;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          }
          .tab-bar {
            height: 44px;
            background: #0B0F19;
            display: flex;
            align-items: flex-end;
            padding: 0 12px;
            gap: 8px;
          }
          .window-dots {
            display: flex;
            gap: 6px;
            align-items: center;
            margin-right: 12px;
            margin-bottom: 14px;
          }
          .dot { width: 10px; height: 10px; border-radius: 50%; }
          .dot.red { background: #EF4444; }
          .dot.yellow { background: #F59E0B; }
          .dot.green { background: #10B981; }
          .tab {
            height: 36px;
            background: #141A2E;
            border-radius: 8px 8px 0 0;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 14px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-bottom: none;
            max-width: 320px;
            position: relative;
          }
          .favicon-img {
            width: 18px;
            height: 18px;
            border-radius: 4px;
            flex-shrink: 0;
          }
          .tab-title {
            color: #F8FAFC;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .close-tab {
            color: #64748B;
            font-size: 14px;
            margin-left: auto;
            line-height: 1;
          }
          .url-bar {
            height: 36px;
            background: #141A2E;
            display: flex;
            align-items: center;
            padding: 0 16px;
            font-size: 12px;
            color: #94A3B8;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }
          .url-bar span { color: #38BDF8; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="browser-window">
          <div class="tab-bar">
            <div class="window-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="tab">
              <img src="data:image/png;base64,${iconPngBase64}" class="favicon-img" alt="favicon" />
              <span class="tab-title">TaxWise — The tax plan that fits</span>
              <span class="close-tab">&times;</span>
            </div>
          </div>
          <div class="url-bar">
            <span>https://</span>taxwise.vercel.app/
          </div>
        </div>
      </body>
    </html>
  `);
  await tabContext.screenshot({ path: "public/screenshots/favicon.png" });
  console.log("✓ Saved public/screenshots/favicon.png");
  await tabContext.close();

  await browser.close();
  server.kill();
  console.log("All proof screenshots generated successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Error generating proof screenshots:", err);
  process.exit(1);
});
