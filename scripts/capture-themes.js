const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const THEMES = ["light", "dark", "ocean", "crimson", "rose", "aurora"];
const PORT = 3016;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  fs.mkdirSync(path.join(process.cwd(), "public/screenshots/themes"), { recursive: true });

  console.log("Starting Next.js server on port " + PORT + "...");
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
  });

  server.stderr.on("data", (data) => console.error(`[Server error]: ${data}`));

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

  console.log("Server ready! Launching headless browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await wait(1000);

  for (const theme of THEMES) {
    console.log(`Applying theme "${theme}"...`);
    await page.evaluate((t) => {
      document.documentElement.setAttribute("data-theme", t);
      if (t === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
      localStorage.setItem("taxwise_theme", t);
    }, theme);

    await wait(600);

    const outPath = path.join(
      process.cwd(),
      "public/screenshots/themes",
      `${theme}.png`
    );
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot: ${outPath}`);
  }

  await browser.close();
  server.kill();
  console.log("All theme screenshots successfully captured!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Error capturing themes:", err);
  process.exit(1);
});
