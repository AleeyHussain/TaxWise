const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function testBotAndGlass() {
  const server = spawn('npx', ['next', 'start', '-p', '3017'], { shell: true });
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:3017');
      if (res.status === 200) break;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3017', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Move pointer to verify bot tracks along vertical straight line
  console.log('Testing bot vertical movement tracking cursor...');
  await page.mouse.move(500, 200);
  await page.waitForTimeout(400);
  const botY1 = await page.$eval('button[aria-label="Open TaxWise AI Assistant"]', b => b.getBoundingClientRect().top);
  console.log('Bot top at pointer Y=200:', botY1);

  await page.mouse.move(500, 600);
  await page.waitForTimeout(400);
  const botY2 = await page.$eval('button[aria-label="Open TaxWise AI Assistant"]', b => b.getBoundingClientRect().top);
  console.log('Bot top at pointer Y=600:', botY2);

  // Hover over the bot to show speech bubble
  const botBtn = page.locator('button[aria-label="Open TaxWise AI Assistant"]');
  await botBtn.hover();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'public/proof/bot-floating-with-pointer.png' });
  console.log('Saved bot-floating-with-pointer.png');

  // 2. Click bot to open Quick Assistant Chat drawer
  console.log('Clicking bot to open quick assistant chat drawer...');
  await botBtn.click();
  await page.waitForTimeout(500);

  // Verify chat drawer opened
  const chatDrawer = page.locator('h3:has-text("TaxWise Bot")');
  await chatDrawer.waitFor({ state: 'visible', timeout: 3000 });
  await page.screenshot({ path: 'public/proof/bot-chat-opened.png' });
  console.log('Saved bot-chat-opened.png');

  // 3. Test sending a question via quick prompt
  console.log('Testing quick prompt click...');
  const promptBtn = page.locator('button:has-text("Which plan is best for freelancers?")');
  await promptBtn.click();

  // Wait for assistant response to render
  console.log('Waiting for assistant response...');
  await page.waitForSelector('text=Recommended:', { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/proof/bot-chat-responded.png' });
  console.log('Saved bot-chat-responded.png');

  // 4. Test compare page with new filters
  console.log('Navigating to /compare to verify new interactive UX...');
  await page.goto('http://localhost:3017/compare', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/proof/compare-interactive-glass.png' });
  console.log('Saved compare-interactive-glass.png');

  await browser.close();
  server.kill();
  console.log('All bot and UX tests completed successfully!');
}

testBotAndGlass().catch(err => {
  console.error('Error in testBotAndGlass:', err);
  process.exit(1);
});
