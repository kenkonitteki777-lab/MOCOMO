import {test,expect} from '@playwright/test';
test('new-design handover stays attached to the bodies and shared star at every contact sample',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/shorts/handover',{waitUntil:'networkidle'});
 const stage=page.locator('.handover-short'),slider=page.getByRole('slider',{name:'ふたりのおはなしの再生位置'});await expect(stage).toHaveAttribute('data-master','cloud-handover-v1');
 await page.evaluate(async()=>{for(const src of ['/characters/moco/performance/rig-body-v4.webp','/characters/sui/performance/rig-body-v3.webp']){const im=new Image();im.src=src;await im.decode();}});
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:844});for(const t of ['0','2.7','4.3','5.1','6.1','6.4','7.5','9']){
  await slider.fill(t);
  const r=await stage.evaluate(e=>{
   const point=(el:SVGGraphicsElement,x:number,y:number)=>new DOMPoint(x,y).matrixTransform(el.getScreenCTM()!);
   const star=e.querySelector('.handover-star') as SVGGraphicsElement,s=point(star,0,0),unit=point(star,1,0).x-s.x;
   const errors=[];
   for(const c of ['moco','sui']){const body=e.querySelector(`.handover-${c}-body`) as SVGGraphicsElement,arms=e.querySelector(`.handover-${c}-arms`) as SVGGraphicsElement;const a=point(body,0,0),b=point(arms,0,0);errors.push(Math.hypot(a.x-b.x,a.y-b.y));}
   const state=e.getAttribute('data-contact');for(const c of state==='shared'?['moco','sui']:state==='moco'?['moco']:[]){const palm=e.querySelector(`[data-hand="${c}-support"] .handover-palm`) as SVGEllipseElement,a=point(palm,Number(palm.getAttribute('cx')),Number(palm.getAttribute('cy')));errors.push(Math.hypot(a.x-s.x-(c==='moco'?-32:32)*unit,a.y-s.y-13*unit));}
   const box=e.getBoundingClientRect();return {max:Math.max(...errors),fits:Array.from(e.querySelectorAll('.character-face-detail')).every(f=>{const r=f.getBoundingClientRect();return r.left>=box.left&&r.right<=box.right&&r.top>=box.top&&r.bottom<=box.bottom;}),overflow:document.documentElement.scrollWidth>innerWidth};
  });expect(r.max).toBeLessThan(.05);expect(r.fits).toBe(true);expect(r.overflow).toBe(false);
 }}
 await page.setViewportSize({width:390,height:844});await slider.fill('5');await stage.scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/handover-shared.png'});await slider.fill('9.5');await page.screenshot({path:'test-results/handover-received.png'});
 await page.getByRole('button',{name:'動きをひかえめに'}).click();await slider.fill('5');await expect(stage).toHaveAttribute('data-contact','shared');await page.emulateMedia({reducedMotion:'reduce'});await expect(page.getByRole('button',{name:'動きをひかえめに'})).toBeDisabled();await expect(page.locator('.movie-file-link')).toHaveAttribute('href','/movies/handover-v2.mp4');
 const video=await page.evaluate(()=>new Promise<{duration:number;width:number;height:number;readyState:number}>((resolve,reject)=>{const v=document.createElement('video');v.preload='auto';v.onloadeddata=()=>resolve({duration:v.duration,width:v.videoWidth,height:v.videoHeight,readyState:v.readyState});v.onerror=()=>reject(Error('MP4 cannot decode'));v.src='/movies/handover-v2.mp4';document.body.append(v);v.load();}));expect(video.duration).toBeCloseTo(10.416667,2);expect(video.width).toBe(1280);expect(video.readyState).toBeGreaterThanOrEqual(2);expect(errors).toEqual([]);
});

test('handover plays, freezes body hands and star together, resumes and replays without memories',async({page})=>{
 await page.clock.install({time:new Date('2026-10-13T00:00:00Z')});await page.goto('/shorts/handover',{waitUntil:'networkidle'});await page.clock.pauseAt(new Date('2026-10-13T01:00:00Z'));
 await page.getByRole('button',{name:'ふたりを、みる',exact:true}).click();await page.clock.runFor(5100);await expect(page.locator('.handover-short')).toHaveAttribute('data-contact','shared');await page.getByRole('button',{name:'いったん、とめる'}).click();
 const snapshot=()=>page.locator('.handover-short').evaluate(e=>Array.from(e.querySelectorAll('g[transform],.face-mouth,.handover-palm')).map(n=>[n.getAttribute('transform'),n.getAttribute('d'),n.getAttribute('cx'),n.getAttribute('cy')]));const held=await snapshot();const blink=()=>page.locator('.handover-short .performer-blink').first().evaluate(e=>({animation:getComputedStyle(e).animationName,transform:getComputedStyle(e).transform}));const heldBlink=await blink();expect(heldBlink.animation).toBe('none');await page.clock.runFor(2000);expect(await snapshot()).toEqual(held);expect(await blink()).toEqual(heldBlink);
 await page.getByRole('button',{name:'つづきを、みる'}).click();await page.clock.runFor(6000);await expect(page.getByRole('button',{name:'もういちど、みる'})).toBeVisible();await expect(page.locator('.handover-short')).toHaveAttribute('data-contact','moco');await page.getByRole('button',{name:'もういちど、みる'}).click();await page.clock.runFor(100);await expect(page.locator('.handover-short')).toHaveAttribute('data-contact','sui');expect(await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'))).toBeNull();
});
