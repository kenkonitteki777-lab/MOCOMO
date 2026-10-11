import {test,expect} from '@playwright/test';
test('Sui picks up the star with an attached hand, delivers it, and all parts pause together',async({page})=>{
 await page.clock.install({time:new Date('2026-10-11T00:00:00Z')});
 await page.goto('/shorts/first-star');
 await page.clock.pauseAt(new Date('2026-10-11T01:00:00Z'));
 await page.getByRole('button',{name:'アニメをみる',exact:true}).click();
 await page.clock.runFor(12800);
 await page.getByRole('button',{name:'いったん、とめる',exact:true}).click();
 await expect(page.locator('.short-star')).toHaveAttribute('data-owner','sui');
 await expect(page.getByRole('img',{name:'スイ・みつけた',exact:true})).toBeVisible();
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:900});
  const measured=await page.evaluate(()=>{
   const svg=document.querySelector('.performing-sui') as SVGSVGElement;
   const body=svg.querySelector('.sui-body') as SVGGraphicsElement;
   const hands=['left','right'].map(side=>svg.querySelector('.sui-hand-'+side) as SVGGraphicsElement);
   const gaps=hands.map((hand,i)=>{const p=new DOMPoint(i?210:110,327);const a=p.matrixTransform(hand.getScreenCTM()!),b=p.matrixTransform(body.getScreenCTM()!);return Math.hypot(a.x-b.x,a.y-b.y);});
   const point=new DOMPoint(94,327).matrixTransform(hands[0].getScreenCTM()!);
   const star=document.querySelector('.short-star')!.getBoundingClientRect();
   return {gaps,starGap:Math.hypot(point.x-star.x-star.width/2,point.y-star.y-star.height/2),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  expect(measured.overflow).toBe(false);expect(Math.max(...measured.gaps)).toBeLessThan(1);expect(measured.starGap).toBeLessThan(2);
 }
 const frozen=await page.locator('.moco-short').getAttribute('style');
 await page.clock.runFor(1000);expect(await page.locator('.moco-short').getAttribute('style')).toBe(frozen);
 await page.getByRole('button',{name:'つづきを、みる',exact:true}).click();
 await page.clock.runFor(1500);await expect(page.locator('.short-star')).toHaveAttribute('data-owner','shared');
 await page.clock.runFor(1200);await expect(page.locator('.short-star')).toHaveAttribute('data-owner','moco');
 await expect(page.getByRole('img',{name:'スイ・やさしい',exact:true})).toBeVisible();
});
test('reduced motion keeps Sui still throughout the pickup scene',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.clock.install({time:new Date('2026-10-11T00:00:00Z')});await page.goto('/shorts/first-star');
 await page.clock.pauseAt(new Date('2026-10-11T01:00:00Z'));await page.getByRole('button',{name:'アニメをみる',exact:true}).click();
 await page.clock.runFor(12300);const pose=await page.locator('.moco-short').getAttribute('style');
 await page.clock.runFor(800);expect(await page.locator('.moco-short').getAttribute('style')).toBe(pose);
 await expect(page.locator('.short-star')).toHaveAttribute('data-owner','quiet');
});
