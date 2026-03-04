import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('Navigating to app...');
await page.goto('https://polyglottype.vercel.app');
await page.waitForTimeout(3000);

// Screenshot
await page.screenshot({ path: 'demo-screenshot.png', fullPage: true });
console.log('Screenshot saved');

await browser.close();
console.log('Done');
