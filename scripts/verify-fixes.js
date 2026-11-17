const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function verify() {
  const server = spawn('npx', ['next', 'start', '-p', '3016'], { shell: true });
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:3016');
      if (res.status === 200) break;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Light Mode
  const pageLight = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageLight.goto('http://localhost:3016', { waitUntil: 'networkidle' });
  await pageLight.waitForTimeout(600);
  await pageLight.screenshot({ path: 'public/proof/verify-hero-light.png' });

  // FAQ Light
  const faqH2Light = pageLight.locator('h2:has-text("Frequently asked questions")');
  await faqH2Light.scrollIntoViewIfNeeded();
  await pageLight.waitForTimeout(400);
  await pageLight.screenshot({ path: 'public/proof/verify-faq-light.png' });

  // 2. Desktop Dark Mode
  const pageDark = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDark.goto('http://localhost:3016', { waitUntil: 'networkidle' });
  await pageDark.evaluate(() => document.documentElement.classList.add('dark'));
  await pageDark.waitForTimeout(600);

  // Hero Dark (Math Operations + Compare button)
  await pageDark.screenshot({ path: 'public/proof/verify-hero-dark.png' });

  // Check Compare Button styles in Dark Mode
  const compareBtnStyles = await pageDark.$eval('a:has-text("Compare all plans")', el => {
    const cs = window.getComputedStyle(el);
    return {
      text: el.innerText,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      border: cs.border,
      boxShadow: cs.boxShadow,
      backdropFilter: cs.backdropFilter,
    };
  });
  console.log('Compare Button in Dark Mode:', compareBtnStyles);

  // FAQ Dark
  const faqH2Dark = pageDark.locator('h2:has-text("Frequently asked questions")');
  await faqH2Dark.scrollIntoViewIfNeeded();
  await pageDark.waitForTimeout(400);
  await pageDark.screenshot({ path: 'public/proof/verify-faq-dark.png' });

  // Check FAQ trigger questions in Dark Mode
  const faqQuestions = await pageDark.$$eval('button[data-state]', btns => {
    return btns.map(b => {
      const span = b.querySelector('span');
      const cs = span ? window.getComputedStyle(span) : window.getComputedStyle(b);
      return {
        text: (span || b).innerText,
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
      };
    });
  });
  console.log('FAQ Questions in Dark Mode:', faqQuestions);

  // Check Math Badges
  const mathBadges = await pageDark.$$eval('span.font-mono', els => els.map(e => e.innerText));
  console.log('Math expressions detected in hero:', mathBadges);

  await browser.close();
  server.kill();
  console.log('Verification completed successfully!');
}

verify().catch(console.error);
