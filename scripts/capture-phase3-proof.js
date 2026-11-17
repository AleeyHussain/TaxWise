const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 3022;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  fs.mkdirSync("public/screenshots", { recursive: true });

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

  console.log("Launching browser for screenshots...");
  const browser = await chromium.launch({ headless: true });

  // 1. Landing page AFTER (Full page, 1440x900)
  const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesktop.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await wait(1000);
  await pageDesktop.screenshot({ path: "public/screenshots/landing-after.png", fullPage: true });
  console.log("✓ Saved public/screenshots/landing-after.png");

  // 2. Testimonials Desktop (1440px)
  const testimonialsEl = await pageDesktop.$("section:has-text('Loved by filers who actually finished.')");
  if (testimonialsEl) {
    await testimonialsEl.scrollIntoViewIfNeeded();
    await wait(400);
    await testimonialsEl.screenshot({ path: "public/screenshots/testimonials-desktop.png" });
    console.log("✓ Saved public/screenshots/testimonials-desktop.png");
  }

  // 3. Testimonials Mobile (375px)
  const pageMobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await pageMobile.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await wait(800);
  const testMobileEl = await pageMobile.$("section:has-text('Loved by filers who actually finished.')");
  if (testMobileEl) {
    await testMobileEl.scrollIntoViewIfNeeded();
    await wait(400);
    await testMobileEl.screenshot({ path: "public/screenshots/testimonials-mobile.png" });
    console.log("✓ Saved public/screenshots/testimonials-mobile.png");
  }
  await pageMobile.close();

  // 4. Hero Mockup Card (Default Theme)
  const mockupEl = await pageDesktop.$("text=Self-Employed >> xpath=ancestor::div[contains(@class, 'glass-2')][1]");
  if (mockupEl) {
    await mockupEl.scrollIntoViewIfNeeded();
    await wait(300);
    await mockupEl.screenshot({ path: "public/screenshots/mockup-default.png" });
    console.log("✓ Saved public/screenshots/mockup-default.png");
  }

  // 5. Hero Mockup Card in Aurora Theme
  await pageDesktop.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "aurora");
    document.documentElement.classList.add("dark");
  });
  await wait(600);
  if (mockupEl) {
    await mockupEl.screenshot({ path: "public/screenshots/mockup-themed.png" });
    console.log("✓ Saved public/screenshots/mockup-themed.png (Aurora theme)");
  }

  await browser.close();
  server.kill();
  console.log("All Phase 3 screenshots generated successfully!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Error generating screenshots:", err);
  process.exit(1);
});
