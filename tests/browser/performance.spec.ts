import {test,expect} from '@playwright/test';

test('independent facial parts expose twelve feelings and a controlled short story without memories',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:new Date('2026-10-10T00:00:00Z')});await page.goto('/shorts/first-star');await page.clock.pauseAt(new Date('2026-10-10T01:00:00Z'));
 await page.getByRole('button',{name:'モコモのきもちで、あそぶ',exact:true}).click();
 const options=page.getByRole('group',{name:'モコモのきもち'}).getByRole('button');await expect(options).toHaveCount(12);
 for(const label of ['うれしい','こまった','さびしい','なきそう','むっとする','てれる','とくい','ねむい','いたずら']){await page.getByRole('button',{name:label,exact:true}).click();await expect(page.getByRole('img',{name:`モコモ・${label}`,exact:true})).toBeVisible();}
 await page.getByRole('button',{name:'こまった',exact:true}).click();await page.screenshot({path:'test-results/moco-performance-confused.png'});
 const decoded=await page.locator('.performing-moco image').first().evaluate(async e=>{const im=new Image();im.src=e.getAttribute('href')!;await im.decode();return im.naturalWidth>0;});expect(decoded).toBe(true);
 const paths=await page.locator('.performer-face').innerHTML();await page.getByRole('button',{name:'うれしい',exact:true}).click();expect(await page.locator('.performer-face').innerHTML()).not.toBe(paths);
 await page.getByRole('button',{name:'アニメをみる',exact:true}).click();await page.clock.runFor(2100);await expect(page.locator('.moco-short')).toHaveAttribute('data-frame','1');
 await page.getByRole('button',{name:'いったん、とめる',exact:true}).click();const paused=await page.locator('.moco-short').getAttribute('data-frame');
 await expect(page.getByRole('button',{name:'つづきを、みる',exact:true})).toBeVisible();
 await page.clock.runFor(2300);await expect(page.locator('.moco-short')).toHaveAttribute('data-frame',paused!);
 await page.getByRole('button',{name:'つづきを、みる',exact:true}).click();await page.clock.runFor(22000);await expect(page.locator('.moco-short')).toHaveAttribute('data-frame','8');await expect(page.getByRole('button',{name:'もういちど、みる',exact:true})).toBeVisible({timeout:4000});
 expect(await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'))).toBe(null);expect(errors).toEqual([]);
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});

test('shelf opens and closes movie safely; quiet mode stops movement but preserves feelings',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/えほん BOOK/}).click();
 await page.getByRole('button',{name:/モコモのちいさなアニメ/}).click();const modal=page.getByRole('dialog',{name:'モコモのちいさなアニメ',exact:true});await expect(modal).toBeVisible();
 await modal.getByRole('button',{name:'アニメをみる',exact:true}).click();await expect(modal.locator('.moco-short')).toHaveAttribute('data-frame','1',{timeout:4500});
 await modal.getByRole('button',{name:'絵本だなにもどる'}).click();await expect(modal).not.toBeVisible();
 await page.getByRole('button',{name:/モコモのちいさなアニメ/}).click();await expect(modal.locator('.moco-short')).toHaveAttribute('data-frame','0');
 await page.emulateMedia({reducedMotion:'reduce'});await modal.getByRole('button',{name:'モコモのきもちで、あそぶ',exact:true}).click();await modal.getByRole('button',{name:'うれしい',exact:true}).click();
 expect(await modal.locator('.performer-head').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');await expect(modal.getByRole('img',{name:'モコモ・うれしい'})).toBeVisible();
 await page.screenshot({path:'test-results/moco-movie-mobile.png'});await page.keyboard.press('Escape');await expect(modal).not.toBeVisible();
});
