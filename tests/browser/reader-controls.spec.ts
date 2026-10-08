import {test,expect} from '@playwright/test';
test('home theme is opt-in, stops on navigation, and reader controls stay thumb-sized in both orientations',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const Original=window.AudioContext;const contexts:AudioContext[]=[];Object.assign(window,{qaMusicContexts:contexts});window.AudioContext=class extends Original{constructor(){super();contexts.push(this);}};});
 await page.setViewportSize({width:320,height:740});await page.goto('/');
 await expect(page.getByRole('button',{name:'モコモソングをきく'})).toBeVisible();
 expect(await page.evaluate(()=>(window as unknown as {qaMusicContexts:AudioContext[]}).qaMusicContexts.length)).toBe(0);
 await page.getByRole('button',{name:'モコモソングをきく'}).click();await expect(page.getByRole('button',{name:'モコモソングをとめる'})).toHaveAttribute('aria-pressed','true');
 expect(await page.evaluate(()=>(window as unknown as {qaMusicContexts:AudioContext[]}).qaMusicContexts[0].state)).toBe('running');
 await page.getByLabel('モコモソングの音の設定',{exact:true}).click();const homeSlider=page.getByRole('slider',{name:'モコモソングの音量'});await homeSlider.focus();await homeSlider.press('Home');await expect(homeSlider).toHaveValue('0');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:/えほん BOOK/}).click();expect(await page.evaluate(()=>(window as unknown as {qaMusicContexts:AudioContext[]}).qaMusicContexts[0].state)).toBe('closed');
 await page.getByRole('button',{name:/モコモとピノのおはなし/}).click();const normalNext=page.getByRole('button',{name:'おはなしの次のページ'});const normalBox=await normalNext.boundingBox();expect(normalBox!.height).toBeGreaterThanOrEqual(56);expect(normalBox!.width).toBeGreaterThanOrEqual(90);
 await normalNext.click();await expect(page.locator('.story-title')).toHaveText('ちいさな、にじ');await page.getByRole('button',{name:'絵本にひたる · 大きく読む'}).click();const reader=page.getByRole('dialog');
 for(const viewport of [{width:320,height:740},{width:390,height:844},{width:844,height:390},{width:667,height:375}]){
  await page.setViewportSize(viewport);const next=reader.getByRole('button',{name:'大きな絵本の次のページ'});const prev=reader.getByRole('button',{name:'大きな絵本の前のページ'});
  for(const button of [next,prev]){const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(52);expect(box!.width).toBeGreaterThanOrEqual(90);expect(box!.y+box!.height).toBeLessThanOrEqual(viewport.height);}
  expect(await reader.evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth})),JSON.stringify(viewport)).toEqual({width:viewport.width,scroll:viewport.width});
  await reader.getByLabel('絵本の音の設定',{exact:true}).click();const panel=reader.locator('.music-settings-panel');const bounds=await panel.boundingBox();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width);await reader.getByLabel('絵本の音の設定',{exact:true}).click();
 }
 await reader.getByRole('button',{name:'BGMをきく'}).click();await reader.getByRole('button',{name:'大きな絵本の次のページ'}).click();await expect(reader.getByText('3 / 8',{exact:true})).toBeVisible();
 await page.screenshot({path:'test-results/reader-controls-landscape.png'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/reader-controls-portrait.png'});
 await reader.getByRole('button',{name:'絵本にもどる',exact:true}).click();expect(await page.evaluate(()=>(window as unknown as {qaMusicContexts:AudioContext[]}).qaMusicContexts.every(c=>c.state==='closed'))).toBe(true);
 await page.getByRole('button',{name:/きょう TODAY/}).click();await expect(page.getByRole('button',{name:'モコモソングをきく'})).toHaveAttribute('aria-pressed','false');expect(errors).toEqual([]);
});
