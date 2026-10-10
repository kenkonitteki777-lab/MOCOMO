import { test, expect } from '@playwright/test';
test('Luna rest responds, stays on a narrow screen, and persists a real visit once', async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 740 });
 await page.goto('/');
 await page.getByRole('button', { name: /ほっとタイム/ }).click();
 await page.getByRole('button', { name: 'そよかぜを、おくる' }).click();
 await expect(page.locator('.luna-rest-moco .performing-moco')).toHaveAttribute('data-action', 'breeze');
 await expect(page.locator('.luna-rest-friend')).toHaveClass(/luna-feels-wind/);
 await page.getByRole('button', { name: 'おやすみ、ルナ' }).click();
 await expect(page.getByRole('img', { name: 'モコモ・ねむい' })).toBeVisible();
 for (const width of [320, 390, 760, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const actor = (await page.locator('.luna-rest-moco').boundingBox())!;
  const scene = (await page.locator('.luna-rest-stage').boundingBox())!;
  expect(actor.y).toBeGreaterThanOrEqual(scene.y);
  expect(actor.y + actor.height).toBeLessThanOrEqual(scene.y + scene.height);
 }
 await page.setViewportSize({ width: 320, height: 740 });
 await page.getByRole('button', { name: 'ひと休みを、記憶に' }).dblclick();
 await expect(page.getByRole('heading', { name: 'ほっとしたね。' })).toBeVisible();
 const visits = await page.evaluate(() => JSON.parse(localStorage.getItem('mocomo.guest.memories.v1') ?? '[]'));
 expect(visits).toHaveLength(1);
 expect(visits[0]).toMatchObject({ event_type: 'REST', payload: { companion: 'luna', restMoment: 'sleep' } });
 await page.reload();
 await page.getByRole('button', { name: /せかい WORLD/ }).click();
 await expect(page.getByText('ルナとひと休みした、やわらかい雲。なにもしない時間も、ここに。')).toBeVisible();
});
test('Luna rest can end without creating a memory and respects reduced motion', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/');
 await page.getByRole('button', { name: /ほっとタイム/ }).click();
 await page.getByRole('button', { name: 'そよかぜを、おくる' }).click();
 expect(await page.locator('.luna-rest-friend').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
 await page.getByRole('button', { name: 'きょうは、ここまで' }).click();
 await expect(page.getByRole('button', { name: /ほっとタイム/ })).toBeVisible();
 await page.getByRole('button', { name: /せかい WORLD/ }).click();
 await expect(page.getByText('ルナとひと休みした、やわらかい雲。なにもしない時間も、ここに。')).toHaveCount(0);
});
