import {test,expect} from '@playwright/test';
test('home toys produce distinct reactions, serialize touches and do not create memories or audio',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const Original=window.AudioContext;const contexts:AudioContext[]=[];Object.assign(window,{qaMusicContexts:contexts});window.AudioContext=class extends Original{constructor(){super();contexts.push(this);}};});
 await page.setViewportSize({width:390,height:844});await page.goto('/');const interaction=page.locator('.home-interaction');const before=await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'));
 const cases=[['雲を、ぽんっ','laugh','雲が、くすぐったい'],['モコモに星をみせる','thanks','見せてくれて'],['モコモに風をおくる','tickle','ほっぺに風']];
 for(const[label,mood,text]of cases){await page.getByRole('button',{name:label,exact:true}).click();await expect(interaction).toHaveAttribute('data-phase','notice');await expect(interaction.locator('.moco')).toHaveAttribute('data-mood','listen');await expect(interaction).toHaveAttribute('data-phase','react');await expect(interaction.locator('.moco')).toHaveAttribute('data-mood',mood);await expect(page.locator('.moco-reply')).toContainText(text);await expect(page.getByRole('button',{name:'モコモに星をみせる',exact:true})).toBeDisabled();
  expect(await interaction.locator('.moco').evaluate(async e=>{const url=getComputedStyle(e).backgroundImage.match(/url\(["']?(.*?)["']?\)/)![1];const im=new Image();im.src=url;await im.decode();return im.naturalWidth===im.naturalHeight&&im.naturalWidth>=1024;})).toBe(true);
  if(mood==='thanks')await page.screenshot({path:'test-results/mocomo-home-thanks.png'});await expect(interaction).toHaveAttribute('data-phase','idle');
 }
 expect(await page.evaluate(()=>(window as unknown as {qaMusicContexts:AudioContext[]}).qaMusicContexts.length)).toBe(0);expect(await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'))).toBe(before);
 await page.getByRole('button',{name:'雲を、ぽんっ',exact:true}).click();await page.getByRole('button',{name:/えほん BOOK/}).click();await page.getByRole('button',{name:/きょう TODAY/}).click();await expect(page.locator('.home-interaction')).toHaveAttribute('data-phase','idle');
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const bounds=await page.locator('.home-touch-toys button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,x:r.x,right:r.right};}));for(const b of bounds){expect(b.w).toBeGreaterThanOrEqual(60);expect(b.h).toBeGreaterThanOrEqual(64);expect(b.x).toBeGreaterThanOrEqual(0);expect(b.right).toBeLessThanOrEqual(width);}}
 expect(errors).toEqual([]);
});
test('friends respond with their own motions; reduced motion and quiet mode keep all toys usable',async({page})=>{
 await page.goto('/');const names=['スイ','レン','ルナ'];const motions:string[]=[];
 for(const name of names){await page.getByRole('button',{name:`${name}をみつける`,exact:true}).click();motions.push(await page.locator('.cloud-friend.is-found .home-friend-actor').evaluate(e=>getComputedStyle(e).animationName));}
 expect(new Set(motions).size).toBe(3);expect(motions.every(v=>v!=='none')).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'モコモに風をおくる',exact:true}).click();await expect(page.locator('.home-interaction')).toHaveAttribute('data-phase','react');expect(await page.locator('.home-touch-moco').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');await expect(page.locator('.home-interaction')).toHaveAttribute('data-phase','idle');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:/おうち FAMILY/}).click();await page.getByRole('button',{name:'私は保護者です'}).click();await page.getByRole('switch',{name:/動きをひかえめに/}).click();await page.getByRole('button',{name:/きょう TODAY/}).click();await page.getByRole('button',{name:'モコモに星をみせる',exact:true}).click();await expect(page.locator('.home-touch-moco')).toHaveAttribute('data-mood','thanks');expect(await page.locator('.home-touch-moco').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');await expect(page.locator('.moco-reply')).toContainText('ありがとう');
});
