import { test, expect } from '@playwright/test';

test('Moco stays visible on small screens and responds to jumping and resting', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'モコモ・ほっとする' })).toBeVisible();
  const loaded = await page.evaluate(async () => {
    const image = new Image(); image.src = '/characters/moco/performance/parts-v1.webp';
    await image.decode(); return image.naturalWidth === 1024 && image.naturalHeight === 1536;
  });
  expect(loaded).toBe(true);
  for (const width of [320, 390, 760, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const box = await page.locator('.hero-scene .moco').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/moco-home-mobile.png', fullPage: true });
  await page.getByRole('button', { name: /もこもこジャンプ/ }).click();
  await page.getByRole('button', { name: 'もこもとジャンプ' }).click();
  await expect(page.getByRole('img', { name: 'もこも・わくわく' })).toBeVisible();
  await page.getByRole('button', { name: '← あそびをえらぶ' }).click();
  await page.getByRole('button', { name: /ほっとタイム/ }).click();
  await expect(page.getByRole('img', { name: 'もこも・ひとやすみ' })).toBeVisible();
  await page.screenshot({ path: 'test-results/moco-rest-mobile.png', fullPage: true });
});
