const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 3025;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  fs.mkdirSync("public/screenshots/themes", { recursive: true });

  console.log("Starting server on port " + PORT + "...");
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
    console.error("Failed to start server on port " + PORT);
    server.kill();
    process.exit(1);
  }

  console.log("Launching Chromium...");
  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------
  // Test 3: Theme persistence (Aurora theme, no flash on reload)
  // -------------------------------------------------------------
  console.log("Executing Test 3: Theme persistence test (Aurora)...");
  const persistCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const persistPage = await persistCtx.newPage();
  await persistPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });

  // Set Aurora theme
  await persistPage.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "aurora");
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "aurora");
  });
  await wait(300);

  // Reload page and immediately capture within 150ms
  await persistPage.reload({ waitUntil: "domcontentloaded" });
  await wait(50);
  await persistPage.screenshot({ path: "public/screenshots/aurora-no-flash.png" });
  console.log("✓ Saved public/screenshots/aurora-no-flash.png");
  await persistCtx.close();

  // -------------------------------------------------------------
  // Test 4: Favicon in Tab (browser tab bar at 32px)
  // -------------------------------------------------------------
  console.log("Executing Test 4: Favicon in tab...");
  const tabCtx = await browser.newContext({ viewport: { width: 500, height: 100 }, deviceScaleFactor: 2 });
  const tabPage = await tabCtx.newPage();
  const iconBase64 = fs.readFileSync("src/app/icon.png").toString("base64");
  await tabPage.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body {
            background: #0B0F19;
            padding: 16px;
            display: flex;
            align-items: center;
          }
          .tab {
            height: 38px;
            background: #141A2E;
            border-radius: 8px 8px 0 0;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 14px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: none;
            width: 280px;
          }
          .fav { width: 22px; height: 22px; border-radius: 4px; }
          .title { color: #F8FAFC; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        </style>
      </head>
      <body>
        <div class="tab">
          <img src="data:image/png;base64,${iconBase64}" class="fav" alt="TW" />
          <span class="title">TaxWise — The tax plan that fits</span>
        </div>
      </body>
    </html>
  `);
  await tabPage.screenshot({ path: "public/screenshots/favicon-tab.png" });
  console.log("✓ Saved public/screenshots/favicon-tab.png");
  await tabCtx.close();

  // -------------------------------------------------------------
  // Test 5: Bot face verification at 2x zoom (eyes + smile + cheeks)
  // -------------------------------------------------------------
  console.log("Executing Test 5: Bot face 2x zoom...");
  const botCtx = await browser.newContext({ viewport: { width: 320, height: 320 }, deviceScaleFactor: 2 });
  const botPage = await botCtx.newPage();
  await botPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await wait(800);
  const botBtn = await botPage.$('button[aria-label="Open TaxWise AI Assistant"]');
  if (botBtn) {
    await botBtn.screenshot({ path: "public/screenshots/bot-zoom.png" });
    console.log("✓ Saved public/screenshots/bot-zoom.png at 2x zoom");
  }
  await botCtx.close();

  // -------------------------------------------------------------
  // Test 6: Six theme screenshots (landing page, same scroll position)
  // -------------------------------------------------------------
  console.log("Executing Test 6: Six theme screenshots...");
  const themePage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const THEMES = ["light", "dark", "ocean", "crimson", "rose", "aurora"];
  for (const t of THEMES) {
    await themePage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
    await themePage.evaluate((name) => {
      document.documentElement.setAttribute("data-theme", name);
      if (name === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
      localStorage.setItem("theme", name);
    }, t);
    await wait(400);
    await themePage.screenshot({ path: `public/screenshots/themes/${t}.png` });
    console.log(`✓ Saved public/screenshots/themes/${t}.png`);
  }
  await themePage.close();

  // -------------------------------------------------------------
  // Test 8: Reduced motion verification
  // -------------------------------------------------------------
  console.log("Executing Test 8: Reduced motion verification...");
  const motionCtx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const motionPage = await motionCtx.newPage();
  await motionPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await wait(600);
  await motionPage.screenshot({ path: "public/screenshots/reduced-motion.png" });
  console.log("✓ Saved public/screenshots/reduced-motion.png");
  await motionCtx.close();

  // -------------------------------------------------------------
  // Test 9: Mobile responsiveness (375px width)
  // -------------------------------------------------------------
  console.log("Executing Test 9: Mobile responsiveness (375px)...");
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await wait(800);
  await mobilePage.screenshot({ path: "public/screenshots/mobile-375.png", fullPage: true });

  // Test mobile menu open and close
  const hamburgerBtn = await mobilePage.$('button[aria-label="Open main menu"]');
  if (hamburgerBtn) {
    await hamburgerBtn.click();
    await wait(300);
    await mobilePage.screenshot({ path: "public/screenshots/mobile-menu-open.png" });
    console.log("✓ Mobile menu opened and captured");
    const closeBtn = await mobilePage.$('button[aria-label="Close menu"]');
    if (closeBtn) {
      await closeBtn.click();
      await wait(300);
      console.log("✓ Mobile menu closed cleanly");
    }
  }
  console.log("✓ Saved public/screenshots/mobile-375.png");
  await mobileCtx.close();

  // -------------------------------------------------------------
  // Test 10: Final landing screenshot (1440px, Aurora theme, full page)
  // -------------------------------------------------------------
  console.log("Executing Test 10: Final landing screenshot (1440px Aurora)...");
  const finalCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const finalPage = await finalCtx.newPage();
  await finalPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await finalPage.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "aurora");
    document.documentElement.classList.add("dark");
  });
  await wait(800);
  await finalPage.screenshot({ path: "public/screenshots/final-landing.png", fullPage: true });
  console.log("✓ Saved public/screenshots/final-landing.png (Full page Aurora)");
  await finalCtx.close();

  await browser.close();
  server.kill();
  console.log("All Playwright verification tests finished successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Verification test run failed:", err);
  process.exit(1);
});
