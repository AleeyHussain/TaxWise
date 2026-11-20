const { chromium } = require("playwright");
const { spawn } = require("child_process");

const PORT = 3032;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureHero() {
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
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
    await wait(600);

    // Screenshot Hero
    await page.screenshot({ path: "public/screenshots/hero-updated.png" });
    console.log("✓ Saved public/screenshots/hero-updated.png");

    // Inspect the 3 cards styles
    const cardData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll(".grid-cols-1.sm\\:grid-cols-3 > div"));
      return cards.map((c) => ({
        bg: window.getComputedStyle(c).backgroundColor,
        border: window.getComputedStyle(c).borderColor,
        text: c.textContent?.trim(),
      }));
    });
    console.log("Cards evaluated:", JSON.stringify(cardData, null, 2));

    // Check if any floating math items exist
    const mathCount = await page.evaluate(() => {
      return document.querySelectorAll(".pointer-events-auto.absolute.hidden.select-none.md\\:block").length;
    });
    console.log("Floating math elements count:", mathCount);
  } finally {
    await browser.close();
    server.kill();
  }
}

captureHero().catch((err) => {
  console.error("Hero capture failed:", err);
  process.exit(1);
});
