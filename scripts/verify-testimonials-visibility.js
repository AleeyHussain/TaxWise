const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");

const PORT = 3028;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verify() {
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

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
    await wait(800);

    // Scroll to Testimonials
    const testimonials = page.locator("#testimonials");
    await testimonials.scrollIntoViewIfNeeded();
    await wait(600);

    // Capture screenshot in light theme
    await page.screenshot({ path: "public/screenshots/testimonials-verified-light.png" });
    console.log("✓ Saved public/screenshots/testimonials-verified-light.png");

    // Inspect colors of blockquotes and paragraphs
    const quotes = await page.evaluate(() => {
      const bqs = Array.from(document.querySelectorAll("#testimonials blockquote"));
      return bqs.map((b) => ({
        text: b.textContent?.slice(0, 30),
        color: window.getComputedStyle(b).color,
        fontSize: window.getComputedStyle(b).fontSize,
        fontWeight: window.getComputedStyle(b).fontWeight,
      }));
    });
    console.log("Blockquotes evaluation:", JSON.stringify(quotes, null, 2));

    // Check overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log("Horizontal overflow:", hasHorizontalOverflow);

    // Switch to dark theme
    const themeBtn = page.locator('button[aria-label*="Click to change theme"]');
    await themeBtn.click();
    await wait(300);
    const darkOption = page.locator('div[role="menuitem"]:has-text("Dark")');
    await darkOption.click();
    await wait(500);
    await testimonials.scrollIntoViewIfNeeded();
    await page.screenshot({ path: "public/screenshots/testimonials-verified-dark.png" });
    console.log("✓ Saved public/screenshots/testimonials-verified-dark.png");

    console.log("Console errors:", errors.length === 0 ? "0 (None)" : errors);
  } finally {
    await browser.close();
    server.kill();
    console.log("Done.");
  }
}

verify().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
