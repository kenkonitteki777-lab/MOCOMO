import { test, expect } from '@playwright/test';

test('each home gesture keeps both hands anchored to the torso throughout its animation', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-10T00:00:00Z') });
  await page.goto('/');
  await page.clock.pauseAt(new Date('2026-10-10T01:00:00Z'));
  for (const name of ['モコモにさわる', '雲を、ぽんっ', 'モコモに星をみせる', 'モコモに風をおくる']) {
    await page.getByRole('button', { name, exact: true }).click();
    await page.clock.runFor(240);
    await expect(page.locator('.home-interaction')).toHaveAttribute('data-phase', 'react');
    const gaps = await page.locator('.home-touch-moco .performing-moco').evaluate(element => {
      const svg = element as SVGSVGElement;
      const body = svg.querySelector('.performer-body') as SVGGraphicsElement;
      const hands = [svg.querySelector('.performer-hand-left'), svg.querySelector('.performer-hand-right')] as SVGGraphicsElement[];
      let largest = 0;
      for (let frame = 0; frame < 48; frame++) {
        // Sample the entire CSS performance while the interaction clock is paused.
        svg.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = frame * 40; });
        const inverse = svg.getScreenCTM()!.inverse();
        hands.forEach((hand, index) => {
          const root = new DOMPoint(index === 0 ? 143 : 257, 327);
          const handRoot = root.matrixTransform(hand.getScreenCTM()!).matrixTransform(inverse);
          const torsoRoot = root.matrixTransform(body.getScreenCTM()!).matrixTransform(inverse);
          largest = Math.max(largest, Math.hypot(handRoot.x - torsoRoot.x, handRoot.y - torsoRoot.y));
        });
      }
      return largest;
    });
    expect(gaps).toBeLessThan(4);
    await page.clock.runFor(2000);
    await expect(page.locator('.home-interaction')).toHaveAttribute('data-phase', 'idle');
  }
});
