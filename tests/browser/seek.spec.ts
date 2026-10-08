import { test, expect } from '@playwright/test';

test('cloud discovery reactions serialize touches and save only actual finds', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await page.getByRole('button', { name: /ひみつさがし/ }).click();
  const save = page.getByRole('button', { name: 'この時間を、記憶に' });
  await expect(save).toBeDisabled();
  await page.getByRole('button', { name: '雲1をさがす', exact: true }).dblclick();
  await expect(page.getByRole('img', { name: 'モコモ・こまった' })).toBeVisible();
  await expect(page.locator('#seek-caption')).toContainText('風がでてきた');
  await expect(save).toBeDisabled(); await expect(page.locator('.seek-pouch')).toHaveCount(0);
  await page.getByRole('button', { name: '雲2をさがす', exact: true }).dblclick();
  await expect(page.locator('.seek-pouch [role=img]')).toHaveCount(1);
  await expect(page.getByRole('img', { name: 'モコモ・びっくり' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'スイ・わくわく' })).toBeVisible();
  await page.getByRole('button', { name: 'スイに、みせる', exact: true }).dblclick();
  await expect(page.getByRole('img', { name: 'モコモ・うれしい', exact: true })).toBeVisible();
  await expect(page.locator('#seek-caption')).toContainText('ふたりで見る');
  await expect(page.locator('.seek-pouch [role=img]')).toHaveCount(1);
  await page.getByRole('button', { name: 'スイに、こんにちは' }).click();
  await expect(page.locator('#seek-caption')).toContainText('きみとさがす');
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('mocomo.guest.memories.v1') || '[]'))).toHaveLength(0);
  // Fix Math.random only in this isolated test to know the next hidden cloud.
  await page.evaluate(() => { Math.random = () => 0; });
  await page.getByRole('button', { name: 'はっぱをさがす', exact: true }).click();
  await page.getByRole('button', { name: '雲1をさがす', exact: true }).click();
  await expect(page.locator('.seek-pouch [role=img]')).toHaveCount(2);
  await expect(page.locator('#seek-caption')).toContainText('はっぱ、みつけた');
  await page.screenshot({ path: 'test-results/mocomo-seek-mobile.png', fullPage: true });
  await save.dblclick();
  await expect(page.getByRole('heading', { name: 'きみが、みつけたひみつ。' })).toBeVisible();
  const records = JSON.parse(await page.evaluate(() => localStorage.getItem('mocomo.guest.memories.v1') || '[]'));
  expect(records).toHaveLength(1); expect(records[0].payload).toMatchObject({ item: 'はっぱ', discoveries: ['星', 'はっぱ'], companion: 'sui' });
  await page.getByRole('button', { name: 'スイのおはなしを読む', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ほしを、まんなかに', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '6ページへ' }).click();
  await page.getByRole('button', { name: 'スイとひみつをさがす', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ひみつさがし' })).toBeVisible();
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('mocomo.guest.memories.v1') || '[]'))).toHaveLength(1);
  await page.reload(); await page.getByRole('button', { name: /せかい WORLD/ }).click();
  await expect(page.getByRole('img', { name: '庭のはっぱ', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('cloud touch sizes, quiet mode, reduced motion and exiting mid-reveal remain usable', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: /ひみつさがし/ }).click();
  for (const width of [320, 390, 760, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const boxes = await page.locator('.seek-touch-cloud').evaluateAll(es => es.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, right: r.right, w: r.width, h: r.height }; }));
    for (const b of boxes) { expect(b.w).toBeGreaterThanOrEqual(64); expect(b.h).toBeGreaterThanOrEqual(100); expect(b.x).toBeGreaterThanOrEqual(0); expect(b.right).toBeLessThanOrEqual(width); }
    expect(boxes[0].right).toBeLessThanOrEqual(boxes[1].x); expect(boxes[1].right).toBeLessThanOrEqual(boxes[2].x);
  }
  await page.getByRole('button', { name: '雲2をさがす' }).click();
  await expect(page.getByRole('img', { name: 'モコモ・きになる' })).toBeVisible();
  await page.getByRole('button', { name: 'きょうは、ここまで' }).click();
  await page.getByRole('button', { name: /ひみつさがし/ }).click();
  await expect(page.locator('.seek-pouch')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: '雲2をさがす' }).click();
  await expect(page.locator('.seek-pouch [role=img]')).toHaveCount(1);
  await page.getByRole('button', { name: 'スイに、みせる', exact: true }).click();
  await expect(page.getByRole('img', { name: 'モコモ・うれしい', exact: true })).toBeVisible();
  expect(await page.locator('.performer-body').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  expect(await page.locator('.seek-moco').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  await page.getByRole('button', { name: /おうち FAMILY/ }).click(); await page.getByRole('button', { name: '私は保護者です' }).click();
  await page.getByRole('switch', { name: /動きをひかえめに/ }).click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: /あそぶ PLAY/ }).click(); await page.getByRole('button', { name: /ひみつさがし/ }).click();
  await page.getByRole('button', { name: '雲2をさがす' }).click();
  await expect(page.locator('.seek-pouch [role=img]')).toHaveCount(1);
  expect(await page.locator('.seek-sui').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
});
