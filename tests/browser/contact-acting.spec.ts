import {test,expect} from '@playwright/test';
test('both palms support one star while shoulders stay connected through the soft body transform',async({page})=>{
 await page.clock.install({time:new Date('2026-10-11T00:00:00Z')});await page.goto('/shorts/first-star');
 await page.clock.pauseAt(new Date('2026-10-11T01:00:00Z'));await page.getByRole('button',{name:'アニメをみる',exact:true}).click();
 await page.clock.runFor(14300);await page.getByRole('button',{name:'いったん、とめる',exact:true}).click();
 await expect(page.locator('.short-star')).toHaveAttribute('data-owner','shared');
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:900});
  const gaps=await page.evaluate(()=>{
   const point=(selector:string,x:number,y:number)=>new DOMPoint(x,y).matrixTransform((document.querySelector(selector) as SVGGraphicsElement).getScreenCTM()!);
   const moco=point('.short-moco .performer-palm-right',273,340),sui=point('.sui-palm-left',94,327);
   const r=document.querySelector('.short-star')!.getBoundingClientRect(), star={x:r.x+r.width/2,y:r.y+r.height/2};
   const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
   return [distance(moco,sui),distance(moco,star),distance(point('.short-moco .performer-hand-right',257,327),point('.short-moco .performer-body',257,327)),distance(point('.sui-hand-left',110,327),point('.sui-body',110,327))];
  });
  expect(Math.max(...gaps)).toBeLessThan(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 const frozen=await page.locator('.moco-short').getAttribute('style');await page.clock.runFor(1000);expect(await page.locator('.moco-short').getAttribute('style')).toBe(frozen);
 await page.screenshot({path:'test-results/contact-acting.png'});
 await page.getByRole('button',{name:'つづきを、みる',exact:true}).click();await page.clock.runFor(6700);
 const before=await page.locator('.moco-short').getAttribute('style');await page.clock.runFor(250);expect(await page.locator('.moco-short').getAttribute('style')).not.toBe(before);
 const squashGaps=await page.evaluate(()=>{
  const point=(selector:string,x:number,y:number)=>new DOMPoint(x,y).matrixTransform((document.querySelector(selector) as SVGGraphicsElement).getScreenCTM()!);
  const hand=point('.short-moco .performer-palm-right',273,340),r=document.querySelector('.short-star')!.getBoundingClientRect();
  const shoulder=point('.short-moco .performer-hand-right',257,327),body=point('.short-moco .performer-body',257,327);
  return [Math.hypot(hand.x-r.x-r.width/2,hand.y-r.y-r.height/2),Math.hypot(shoulder.x-body.x,shoulder.y-body.y)];
 });expect(Math.max(...squashGaps)).toBeLessThan(2);
 await page.getByRole('button',{name:'いったん、とめる',exact:true}).click();const settled=await page.locator('.moco-short').getAttribute('style');await page.clock.runFor(500);expect(await page.locator('.moco-short').getAttribute('style')).toBe(settled);
});
