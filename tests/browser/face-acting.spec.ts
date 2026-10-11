import { test,expect } from '@playwright/test';
test('face morph and camera freeze together; the emotional close view preserves faces at every size',async({page})=>{
 await page.clock.install({time:new Date('2026-10-11T00:00:00Z')});
 await page.goto('/shorts/first-star');
 await page.clock.pauseAt(new Date('2026-10-11T01:00:00Z'));
 await page.getByRole('button',{name:'アニメをみる',exact:true}).click();
 await page.clock.runFor(2100);
 const a=await page.locator('.short-moco .face-mouth').getAttribute('d');
 await page.clock.runFor(250);
 expect(await page.locator('.short-moco .face-mouth').getAttribute('d')).not.toBe(a);
 await page.clock.runFor(3150);
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>{const stage=document.querySelector('.moco-short')!.getBoundingClientRect();return Array.from(document.querySelectorAll('.character-face-detail')).every(el=>{const r=el.getBoundingClientRect();return r.left>stage.left&&r.right<stage.right&&r.top>stage.top&&r.bottom<stage.bottom;});})).toBe(true);
 }
 await page.clock.runFor(13650);
 await page.getByRole('button',{name:'いったん、とめる',exact:true}).click();
 const mouth=await page.locator('.short-moco .face-mouth').getAttribute('d');
 const style=await page.locator('.moco-short').getAttribute('style');
 await page.clock.runFor(1800);
 expect(await page.locator('.short-moco .face-mouth').getAttribute('d')).toBe(mouth);
 expect(await page.locator('.moco-short').getAttribute('style')).toBe(style);
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:900});
  const contained=await page.evaluate(()=>{
   const stage=document.querySelector('.moco-short')!.getBoundingClientRect();
   return Array.from(document.querySelectorAll('.character-face-detail')).every(el=>{const r=el.getBoundingClientRect();return r.left>stage.left&&r.right<stage.right&&r.top>stage.top&&r.bottom<stage.bottom;});
  });
  expect(contained).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.screenshot({path:'test-results/face-acting-thanks.png'});
 await page.getByRole('button',{name:'つづきを、みる',exact:true}).click();
 await page.clock.runFor(6000);
 await expect(page.getByRole('button',{name:'もういちど、みる',exact:true})).toBeVisible();
});
