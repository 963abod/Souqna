import { test } from '@playwright/test';

test('take screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'public/souqna-homepage.png', fullPage: true });

  // Mobile view screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'public/souqna-mobile.png', fullPage: false });
});
