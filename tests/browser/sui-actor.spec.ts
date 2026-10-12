import { test, expect } from '@playwright/test';

test('Sui watches first, replies later, keeps the whole body connected and respects motion settings', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install({ time: new Date('2026-10-12T00:00:00Z') });
  await page.goto('/'); await page.clock.pauseAt(new Date('2026-10-12T01:00:00Z'));
  await page.getByRole('button', { name: /ひみつさがし/ }).click();
  const actor = page.locator('.seek-sui .soft-sui');
  await expect(actor).toHaveAttribute('data-master', 'sui-soft-v2');
  expect(await actor.locator('image').evaluate(async e => { const image = new Image(); image.src = e.getAttribute('href')!; await image.decode(); return image.naturalWidth === 1254 && image.naturalHeight === 1254; })).toBe(true);
  await page.getByRole('button', { name: '雲1をさがす', exact: true }).click();
  await expect(actor).toHaveAttribute('data-feeling', 'focused');
  await page.clock.runFor(900); await expect(actor).toHaveAttribute('data-feeling', 'concerned');
  await page.clock.runFor(800);
  await page.getByRole('button', { name: '雲2をさがす', exact: true }).click();
  await page.clock.runFor(900); await expect(actor).toHaveAttribute('data-feeling', 'curious');
  await page.clock.runFor(800);
  await page.getByRole('button', { name: 'スイに、みせる', exact: true }).click();
  await expect(actor).toHaveAttribute('data-feeling', 'kind');
  await page.clock.runFor(850); await expect(actor).toHaveAttribute('data-feeling', 'kind');
  await page.clock.runFor(100); await expect(actor).toHaveAttribute('data-feeling', 'joy');
  await expect(actor).toHaveAttribute('data-face-state', 'blending');
  await page.clock.runFor(80);
  expect(Number(await actor.locator('.character-face-detail').getAttribute('data-mouth-open'))).toBe(0);
  await page.clock.runFor(320);
  const middle = Number(await actor.locator('.character-face-detail').getAttribute('data-mouth-open'));
  expect(middle).toBeGreaterThan(0); expect(middle).toBeLessThan(15);
  await page.clock.runFor(450); await expect(actor).toHaveAttribute('data-face-state', 'settled');
  await expect(actor.locator('.character-face-detail')).toHaveAttribute('data-mouth-open', '15');
  await expect(actor).toHaveAttribute('data-action', 'nod');
  // The face and single texture share the same moving parent; no separate hands exist.
  await expect(actor.locator('.soft-sui-body > image')).toHaveCount(1);
  await expect(actor.locator('.soft-sui-body .character-face-detail')).toHaveCount(1);
  await page.getByRole('button', { name: 'スイに、こんにちは' }).click();
  await expect(actor).toHaveAttribute('data-feeling', 'shy');
  await page.clock.runFor(800); await page.locator('.seek-stage').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/sui-soft-hello.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(actor).toHaveAttribute('data-face-state', 'settled');
  expect(await actor.locator('.soft-sui-body').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  for (const width of [320, 390, 760, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await actor.evaluate(e => { const a = e.getBoundingClientRect(), f = e.querySelector('.character-face-detail')!.getBoundingClientRect(); return f.left >= a.left && f.right <= a.right && f.top >= a.top && f.bottom <= a.bottom && document.documentElement.scrollWidth <= innerWidth; })).toBe(true);
  }
  expect(await page.evaluate(() => localStorage.getItem('mocomo.guest.memories.v1'))).toBeNull();
  expect(errors).toEqual([]);
});
