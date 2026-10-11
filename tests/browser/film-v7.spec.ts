import {test,expect} from '@playwright/test';

test('every cut preserves both faces and connected shoulders at phone, landscape and desktop sizes',async({page})=>{
 test.setTimeout(90000);
 await page.goto('/shorts/first-star');
 await page.getByRole('button',{name:'アニメをみる',exact:true}).click();
 await expect(page.getByRole('button',{name:'いったん、とめる',exact:true})).toBeVisible();
 const slider=page.getByRole('slider',{name:'おはなしの再生位置'});
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:900});
  for(const time of [4.4,4.5,6.9,7,13.3,13.4,14.3,15.3,15.4,18.6,20.9,21,22.1]){
   await slider.fill(String(time));
   const state=await page.evaluate(()=>{
    const bounds=document.querySelector('.moco-short')!.getBoundingClientRect();
    const contained=Array.from(document.querySelectorAll('.character-face-detail')).every(el=>{const r=el.getBoundingClientRect();return r.left>bounds.left&&r.right<bounds.right&&r.top>bounds.top&&r.bottom<bounds.bottom;});
    const p=(s:string,x:number,y:number)=>new DOMPoint(x,y).matrixTransform((document.querySelector(s) as SVGGraphicsElement).getScreenCTM()!);
    const dist=(a:DOMPoint,b:DOMPoint)=>Math.hypot(a.x-b.x,a.y-b.y);
    return {contained,overflow:document.documentElement.scrollWidth>innerWidth,gaps:[dist(p('.performer-hand-left',143,327),p('.performer-body',143,327)),dist(p('.performer-hand-right',257,327),p('.performer-body',257,327)),dist(p('.sui-hand-left',110,327),p('.sui-body',110,327)),dist(p('.sui-hand-right',210,327),p('.sui-body',210,327))]};
   });
   expect(state.contained,`${width}px at ${time}s`).toBe(true);expect(state.overflow).toBe(false);expect(Math.max(...state.gaps)).toBeLessThan(1);
  }
 }
 await slider.fill('5.5');
 const starClear=await page.evaluate(()=>{const star=document.querySelector('.short-star')!.getBoundingClientRect(),face=document.querySelector('.short-moco .character-face-detail')!.getBoundingClientRect();return star.left>face.right+3;});expect(starClear).toBe(true);
 await page.setViewportSize({width:844,height:390});await slider.fill('14.3');
 await page.screenshot({path:'test-results/film-v7-landscape.png'});
 await page.setViewportSize({width:390,height:844});await slider.fill('14.3');await page.screenshot({path:'test-results/film-v7-phone.png'});
 await page.setViewportSize({width:1280,height:820});
 for(const [time,name] of [[5.5,'discovery'],[14.3,'handover'],[18.6,'together'],[22.3,'light']] as const){await slider.fill(String(time));await page.screenshot({path:`test-results/film-v7-${name}.png`});}
 const style=await page.locator('.moco-short').getAttribute('style');await page.waitForTimeout(200);expect(await page.locator('.moco-short').getAttribute('style')).toBe(style);
 await expect(page.locator('.movie-file-link')).toHaveAttribute('href','/movies/first-star-v7.mp4');
});
