import {test,expect} from '@playwright/test';

test('seek, turn, soft contact and dedicated framing stay attached and freeze together',async({page})=>{
 test.setTimeout(60000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/shorts/first-star');
 await page.evaluate(async()=>{for(const src of ['/characters/moco/performance/parts-v1.webp','/characters/sui/performance/parts-v1.webp']){const im=new Image();im.src=src;await im.decode();}});
 const timeline=page.getByRole('slider',{name:'おはなしの再生位置'});
 await timeline.fill('14.3');
 await expect(page.locator('.short-star')).toHaveAttribute('data-owner','shared');
 await expect(page.locator('.moco-short')).toHaveAttribute('data-shot','handover');
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:900});
  const geometry=await page.evaluate(()=>{
   const point=(s:string,x:number,y:number)=>new DOMPoint(x,y).matrixTransform((document.querySelector(s) as SVGGraphicsElement).getScreenCTM()!);
   const m=point('.short-moco .performer-palm-skin',273,340),s=point('.sui-palm-skin',94,327);
   const r=document.querySelector('.short-star')!.getBoundingClientRect();
   const stage=document.querySelector('.moco-short')!.getBoundingClientRect();
   return {gap:Math.hypot(m.x-s.x,m.y-s.y),star:Math.hypot(m.x-r.x-r.width/2,m.y-r.y-r.height/2),faces:Array.from(document.querySelectorAll('.character-face-detail')).every(el=>{const f=el.getBoundingClientRect();return f.left>stage.left&&f.right<stage.right&&f.top>stage.top&&f.bottom<stage.bottom;}),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  expect(geometry.gap).toBeLessThan(2);expect(geometry.star).toBeLessThan(2);expect(geometry.faces).toBe(true);expect(geometry.overflow).toBe(false);
 }
 const pose=await page.locator('.moco-short').getAttribute('style');await page.waitForTimeout(150);expect(await page.locator('.moco-short').getAttribute('style')).toBe(pose);
 await page.setViewportSize({width:1280,height:820});await page.screenshot({path:'test-results/film-v6-contact.png'});
 await timeline.fill('12.5');
 expect(await page.locator('.moco-short').evaluate(el=>Number((el as HTMLElement).style.getPropertyValue('--film-turn')))).toBeGreaterThan(.5);
 expect(await page.locator('.moco-short').evaluate(el=>Number((el as HTMLElement).style.getPropertyValue('--film-suiTurn')))).toBeLessThan(-.5);
 await page.screenshot({path:'test-results/film-v6-turn.png'});
 await timeline.fill('18.6');await expect(page.locator('.moco-short')).toHaveAttribute('data-shot','together');await page.screenshot({path:'test-results/film-v6-together.png'});
 await timeline.fill('23.8');await page.getByRole('button',{name:'つづきを、みる',exact:true}).click();await expect(page.getByRole('button',{name:'もういちど、みる',exact:true})).toBeVisible();
 await timeline.fill('0');await timeline.focus();await timeline.press('ArrowRight');await expect(timeline).toHaveValue('0.1');
 await expect(page.locator('.movie-file-link')).toHaveAttribute('href','/movies/first-star-v7.mp4');
 expect(errors).toEqual([]);
});

test('quiet film remains static and seeking does not start motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/shorts/first-star');await page.getByRole('button',{name:'アニメをみる',exact:true}).click();await page.getByRole('slider').fill('14.3');
 const pose=await page.locator('.moco-short').getAttribute('style');await page.waitForTimeout(200);expect(await page.locator('.moco-short').getAttribute('style')).toBe(pose);
 expect(await page.locator('.moco-short').evaluate(el=>Number((el as HTMLElement).style.getPropertyValue('--film-contact')))).toBe(0);
 await expect(page.getByRole('button',{name:'つづきを、みる',exact:true})).toBeVisible();
});
