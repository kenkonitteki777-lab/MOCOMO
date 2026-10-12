import { test, expect } from '@playwright/test';

test('new contact shot decodes, shares one clock, pauses exactly and resumes to both smiles', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.clock.install({ time: new Date('2026-10-12T00:00:00Z') });
  await page.goto('/shorts/together', { waitUntil: 'networkidle' });
  await page.clock.pauseAt(new Date('2026-10-12T01:00:00Z'));
  const stage = page.locator('.together-short');
  await expect(stage).toHaveAttribute('data-master', 'cloud-pair-v1');
  expect(await stage.locator('image').evaluate(async e => { const im = new Image(); im.src = e.getAttribute('href')!; await im.decode(); return im.naturalWidth === 1254; })).toBe(true);
  await expect(stage.locator('.together-connected > image')).toHaveCount(1);
  await expect(stage.locator('.together-connected .character-face-detail')).toHaveCount(2);
  await page.getByRole('button', { name: 'ふたりを、みる', exact: true }).click();
  await page.clock.runFor(3500); await expect(stage).toHaveAttribute('data-frame', '1');
  await page.getByRole('button', { name: 'いったん、とめる' }).click();
  const snapshot = () => stage.evaluate(e => ({ body: e.querySelector('.together-connected')!.getAttribute('transform'), faces: Array.from(e.querySelectorAll('.face-mouth')).map(f => f.getAttribute('d')) }));
  const paused = await snapshot(); await page.clock.runFor(2000); expect(await snapshot()).toEqual(paused);
  await page.getByRole('button', { name: 'つづきを、みる' }).click(); await page.clock.runFor(5000);
  await expect(page.getByRole('button', { name: 'もういちど、みる' })).toBeVisible();
  await expect(stage.locator('.together-moco-face .character-face-detail')).toHaveAttribute('data-mouth-open', '14');
  await expect(stage.locator('.together-sui-face .character-face-detail')).toHaveAttribute('data-mouth-open', '10');
  await stage.scrollIntoViewIfNeeded(); await page.screenshot({ path: 'test-results/together-smile.png' });
  await page.getByRole('button', { name: 'もういちど、みる' }).click(); await page.clock.runFor(100); await expect(stage).toHaveAttribute('data-frame', '0');
  expect(await page.evaluate(() => localStorage.getItem('mocomo.guest.memories.v1'))).toBeNull(); expect(errors).toEqual([]);
});

test('contact faces fit mobile and desktop, manual quiet and OS reduction hold the shared texture still', async ({ page }) => {
  await page.goto('/shorts/first-star'); await page.getByRole('link', { name: /ほしを、まんなかに/ }).click();
  const timeline = page.getByRole('slider', { name: 'ふたりのおはなしの再生位置' });
  const stage = page.locator('.together-short');
  for (const width of [320, 390, 760, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    for (const t of ['0', '1.1', '2.5', '5.5', '8']) {
      await timeline.fill(t);
      expect(await stage.evaluate(e => { const s = e.getBoundingClientRect(); return document.documentElement.scrollWidth <= innerWidth && Array.from(e.querySelectorAll('.character-face-detail')).every(f => { const r = f.getBoundingClientRect(); return r.left >= s.left && r.right <= s.right && r.top >= s.top && r.bottom <= s.bottom; }); })).toBe(true);
    }
  }
  await page.getByRole('button', { name: '動きをひかえめに' }).click(); await timeline.fill('6');
  expect(await stage.locator('.together-connected').getAttribute('transform')).toBe('translate(400 540) rotate(0) scale(1 1) translate(-400 -540) translate(0 0)');
  await page.getByRole('button', { name: '動きをひかえめに' }).click(); await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: '動きをひかえめに' })).toBeDisabled();
  await timeline.fill('6.2'); expect(await stage.locator('.together-connected').getAttribute('transform')).toBe('translate(400 540) rotate(0) scale(1 1) translate(-400 -540) translate(0 0)');
  await page.setViewportSize({ width: 390, height: 844 }); await timeline.fill('0'); await stage.scrollIntoViewIfNeeded(); await page.screenshot({ path: 'test-results/together-neutral.png' });
});
