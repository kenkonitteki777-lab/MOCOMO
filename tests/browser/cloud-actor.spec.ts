import {test,expect} from '@playwright/test';
import {mocoFeelings} from '../../lib/moco-performance';

test('approved cloud face blends, all feelings remain inside the body, and reduced motion settles immediately',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'no-preference'});await page.clock.install({time:new Date('2026-10-12T00:00:00Z')});
 await page.goto('/shorts/first-star');await page.clock.pauseAt(new Date('2026-10-12T01:00:00Z'));
 await page.getByRole('button',{name:'モコモのきもちで、あそぶ',exact:true}).click();
 const actor=page.locator('.cloud-moco');await expect(actor).toHaveAttribute('data-master','approved-cloud-v3');
 expect(await actor.locator('image').evaluate(async e=>{const im=new Image();im.src=e.getAttribute('href')!;await im.decode();return im.naturalWidth===1254&&im.naturalHeight===1254;})).toBe(true);
 await page.getByRole('button',{name:'うれしい',exact:true}).click();await expect(actor).toHaveAttribute('data-face-state','blending');await page.clock.runFor(150);
 const middle=Number(await actor.locator('.character-face-detail').getAttribute('data-mouth-open'));expect(middle).toBeGreaterThan(0);expect(middle).toBeLessThan(20);
 await page.clock.runFor(400);await expect(actor.locator('.character-face-detail')).toHaveAttribute('data-mouth-open','20');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const[,name]of mocoFeelings){await page.getByRole('button',{name,exact:true}).click();await expect(page.getByRole('img',{name:`モコモ・${name}`,exact:true})).toBeVisible();expect(await actor.locator('.cloud-moco-body').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
  for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:844});const contained=await actor.evaluate(e=>{const a=e.getBoundingClientRect(),f=e.querySelector('.character-face-detail')!.getBoundingClientRect();return f.left>=a.left&&f.right<=a.right&&f.top>=a.top&&f.bottom<=a.bottom&&document.documentElement.scrollWidth<=innerWidth;});expect(contained).toBe(true);}}
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'ほっとする',exact:true}).click();await actor.scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/cloud-actor-calm.png'});
 await page.getByRole('button',{name:'うれしい',exact:true}).click();await actor.scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/cloud-actor-joy.png'});expect(errors).toEqual([]);
});
