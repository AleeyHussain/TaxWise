const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 3025;

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

  try {
    // 1. Proof 1: Ocean theme applied
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
    await wait(800);

    // Open Theme dropdown and select Ocean
    console.log("Selecting Ocean theme...");
    const themeBtn = page.locator('button[aria-label*="Click to change theme"]');
    await themeBtn.click();
    await wait(400);

    const oceanOption = page.locator('div[role="menuitem"]:has-text("Ocean")');
    await oceanOption.click();
    await wait(600);

    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    console.log(`Current theme: ${themeAttr}, Body bg: ${bodyBg}`);

    await page.screenshot({ path: "public/screenshots/hotfix-ocean-theme.png", fullPage: false });
    console.log("✓ Saved public/screenshots/hotfix-ocean-theme.png");

    // 2. Proof 2: Dropdown z-index (Products dropdown open over content)
    console.log("Opening Products dropdown...");
    const productsBtn = page.locator('button:has-text("Products")').first();
    await productsBtn.click();
    await wait(400);

    await page.screenshot({ path: "public/screenshots/hotfix-dropdown-zindex.png", fullPage: false });
    console.log("✓ Saved public/screenshots/hotfix-dropdown-zindex.png");

    // Close products dropdown by clicking outside or pressing Escape
    await page.keyboard.press("Escape");
    await wait(300);

    // 3. Proof 3: Testimonial contrast
    console.log("Scrolling to Testimonials...");
    const testimonials = page.locator("#testimonials");
    await testimonials.scrollIntoViewIfNeeded();
    await wait(600);

    await page.screenshot({ path: "public/screenshots/hotfix-testimonials-contrast.png", fullPage: false });
    console.log("✓ Saved public/screenshots/hotfix-testimonials-contrast.png");

  } finally {
    await browser.close();
    server.kill();
    console.log("Closed browser and stopped server.");
  }
}

run().catch((err) => {
  console.error("Execution error:", err);
  process.exit(1);
});
