import { test, expect } from '@playwright/test';
test('movie continuously moves, freezes on pause, and keeps the held star and hands attached', async ({ page }) => {
 await page.clock.install({time:new Date('2026-10-10T00:00:00Z')});
 await page.goto('/shorts/first-star');
 await page.clock.pauseAt(new Date('2026-10-10T01:00:00Z'));
 await page.getByRole('button',{name:'アニメをみる',exact:true}).click();
 await page.clock.runFor(2800);
 const before = await page.locator('.moco-short').getAttribute('style');
 await page.clock.runFor(300);
 expect(await page.locator('.moco-short').getAttribute('style')).not.toBe(before);
 await page.getByRole('button',{name:'いったん、とめる',exact:true}).click();
 const pose = await page.locator('.moco-short').getAttribute('style');
 await page.clock.runFor(1000);
 expect(await page.locator('.moco-short').getAttribute('style')).toBe(pose);
 await page.getByRole('button',{name:'つづきを、みる',exact:true}).click();
 await page.clock.runFor(7100);
 await expect(page.locator('.moco-short')).toHaveAttribute('data-frame','4');
 const rolled = await page.evaluate(() => {
  const stage=document.querySelector('.moco-short')!.getBoundingClientRect();
  const star=document.querySelector('.short-star')!.getBoundingClientRect();
  return {x:(star.x+star.width/2-stage.x)/stage.width,y:(star.y+star.height/2-stage.y)/stage.height};
 });
 expect(rolled.x).toBeCloseTo(.68,2); expect(rolled.y).toBeCloseTo(.70,2);
 await page.clock.runFor(6200);
 await expect(page.locator('.moco-short')).toHaveAttribute('data-frame','6');
 for (const width of [320,390,760,1440]) {
 await page.setViewportSize({width,height:900});
 const distances = await page.evaluate(() => {
  const svg = document.querySelector('.short-moco .performing-moco') as SVGSVGElement;
  const hands = ['left','right'].map(side=>svg.querySelector('.performer-hand-'+side) as SVGGraphicsElement);
  const body = svg.querySelector('.performer-body') as SVGGraphicsElement;
  const gaps = hands.map((hand,i)=>{
   const point=new DOMPoint(i===0?143:257,327);
   const a=point.matrixTransform(hand.getScreenCTM()!),b=point.matrixTransform(body.getScreenCTM()!);
   return Math.hypot(a.x-b.x,a.y-b.y);
  });
  const handStar = new DOMPoint(273,340).matrixTransform(hands[1].getScreenCTM()!);
  const star=document.querySelector('.short-star')!.getBoundingClientRect();
  return { gaps, starGap:Math.hypot(handStar.x-(star.x+star.width/2),handStar.y-(star.y+star.height/2)) };
 });
 expect(Math.max(...distances.gaps)).toBeLessThan(1);
 expect(distances.starGap).toBeLessThan(2);
 }
 await page.getByRole('button',{name:'はじめから',exact:true}).click();
 await page.clock.runFor(2800);
 await expect(page.locator('.moco-short')).toHaveAttribute('data-frame','1');
 await page.clock.runFor(23000);
 await expect(page.getByRole('button',{name:'もういちど、みる',exact:true})).toBeVisible();
});
