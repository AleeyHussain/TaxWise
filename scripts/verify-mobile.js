const { chromium } = require("playwright");
const { spawn } = require("child_process");

const PORT = 3029;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyMobile() {
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
    server.kill();
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
    await wait(600);

    const testimonials = page.locator("#testimonials");
    await testimonials.scrollIntoViewIfNeeded();
    await wait(400);

    await page.screenshot({ path: "public/screenshots/testimonials-verified-mobile.png" });
    console.log("✓ Saved public/screenshots/testimonials-verified-mobile.png");

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log("Mobile horizontal overflow:", hasHorizontalOverflow);
    console.log("Mobile console errors:", errors.length === 0 ? "0 (None)" : errors);
  } finally {
    await browser.close();
    server.kill();
  }
}

verifyMobile().catch((err) => {
  console.error("Mobile verification failed:", err);
  process.exit(1);
});
