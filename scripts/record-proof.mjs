import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const PROOF_DIR = path.resolve("public/proof");
if (!fs.existsSync(PROOF_DIR)) {
  fs.mkdirSync(PROOF_DIR, { recursive: true });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Starting Next.js production server on port 3009...");
  const server = spawn("npx", ["next", "start", "-p", "3009"], {
    shell: true,
    stdio: "pipe",
  });

  server.stdout.on("data", (data) => console.log(`[server] ${data}`));
  server.stderr.on("data", (data) => console.error(`[server err] ${data}`));

  // Wait for server to be responsive
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://localhost:3009");
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {
      await wait(1000);
    }
  }

  if (!ready) {
    console.error("Server did not become ready in time.");
    server.kill();
    process.exit(1);
  }

  console.log("Server ready! Launching Playwright with video recording...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: PROOF_DIR,
      size: { width: 1280, height: 800 },
    },
  });

  const page = await context.newPage();

  // 1. Initial page load (Scroll 0)
  console.log("Visiting home page...");
  await page.goto("http://localhost:3009", { waitUntil: "networkidle" });
  await wait(800);
  await page.screenshot({ path: path.join(PROOF_DIR, "01-header-initial.png") });
  console.log("Saved 01-header-initial.png");

  // 2. Scroll down 350px to trigger header shrink + progress bar
  console.log("Scrolling to trigger header shrink and progress bar...");
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "smooth" }));
  await wait(800);
  await page.screenshot({ path: path.join(PROOF_DIR, "02-header-scrolled.png") });
  console.log("Saved 02-header-scrolled.png");

  // 3. Open Products dropdown menu
  console.log("Opening Products dropdown...");
  const productsTrigger = page.locator("button:has-text('Products')").first();
  await productsTrigger.click();
  await wait(600);
  await page.screenshot({ path: path.join(PROOF_DIR, "03-products-dropdown.png") });
  console.log("Saved 03-products-dropdown.png");

  // Close dropdown by pressing Escape
  await page.keyboard.press("Escape");
  await wait(400);

  // 4. Click 'Find my plan' link (/recommend) to show sliding active pill and page transition
  console.log("Navigating to /recommend to show sliding active pill...");
  const recommendLink = page.locator('nav a[href="/recommend"]').first();
  await recommendLink.click();
  await page.waitForURL("**/recommend");
  await wait(800);
  await page.screenshot({ path: path.join(PROOF_DIR, "04-active-pill-sliding.png") });
  console.log("Saved 04-active-pill-sliding.png");

  // 5. Navigate back to Home and scroll to FAQ accordion
  console.log("Navigating back to Home to expand FAQ accordion...");
  await page.goto("http://localhost:3009", { waitUntil: "networkidle" });
  await wait(600);

  // Scroll down to the FAQ section
  await page.evaluate(() => {
    const faq = document.querySelector("#faq") || document.querySelector("section:last-of-type");
    if (faq) {
      faq.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 2200, behavior: "smooth" });
    }
  });
  await wait(800);

  // Click first accordion trigger button
  const accordionTrigger = page.locator('[data-orientation="vertical"] button[data-state]').first();
  if (await accordionTrigger.count() > 0) {
    await accordionTrigger.click();
    await wait(600);
  }
  await page.screenshot({ path: path.join(PROOF_DIR, "05-faq-expanded.png") });
  console.log("Saved 05-faq-expanded.png");

  // Wait 1.5 seconds to complete the video recording
  await wait(1500);

  await page.close();
  await context.close();
  await browser.close();

  // Rename recorded video to taxwise-ui-motion.webm
  const files = fs.readdirSync(PROOF_DIR);
  const videoFile = files.find((f) => f.endsWith(".webm") && f !== "taxwise-ui-motion.webm");
  if (videoFile) {
    const targetVideo = path.join(PROOF_DIR, "taxwise-ui-motion.webm");
    if (fs.existsSync(targetVideo)) {
      fs.unlinkSync(targetVideo);
    }
    fs.renameSync(path.join(PROOF_DIR, videoFile), targetVideo);
    console.log(`Video saved to ${targetVideo}`);
  }

  // Kill server process
  server.kill();
  console.log("Proof recording complete!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Error during proof generation:", err);
  process.exit(1);
});
