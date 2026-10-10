import {test,expect} from '@playwright/test';
test('clear returns preserve the home entrance, character touch and friend discovery do not fabricate memories',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const home=page.getByRole('region',{name:'モコモの雲のおうち',exact:true});
 const moco=page.getByRole('button',{name:'モコモにさわる',exact:true});await expect(moco).toBeVisible();
 const rect=await moco.boundingBox();expect(rect!.width).toBeGreaterThanOrEqual(160);expect(rect!.y+rect!.height).toBeLessThan(844);
 const before=await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'));
 await moco.click();await expect(moco).toHaveAttribute('aria-pressed','true');await expect(home.locator('.moco-reply')).toContainText('会えて、うれしい');
 await page.screenshot({path:'test-results/mocomo-brand-touch.png'});
 const sui=page.getByRole('button',{name:'スイをみつける',exact:true});await sui.click();await expect(home.locator('.friend-found-message')).toContainText('スイ、みつけた。');
 await page.getByRole('button',{name:'スイと絵本へ',exact:true}).click();await expect(page.locator('.current-place')).toHaveText('絵本だな');
 await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);
 await page.locator('.route-toolbar').getByRole('button',{name:'モコモの世界にもどる',exact:true}).click();await expect(page.locator('#cloud-friend-sui')).toBeFocused();
 const jump=page.locator('#cloud-place-jump');await jump.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const scroll=await page.evaluate(()=>window.scrollY);await jump.click();await expect(page.getByRole('heading',{name:'もこもこジャンプ',exact:true})).toBeVisible();await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);
 await page.locator('.route-toolbar').getByRole('button',{name:'モコモの世界にもどる',exact:true}).click();await expect(jump).toBeFocused();await expect.poll(()=>page.evaluate(saved=>Math.abs(window.scrollY-saved),scroll)).toBeLessThanOrEqual(1);
 await home.getByRole('button',{name:'絵本をえらぶ',exact:true}).click();await page.getByRole('button',{name:/モコモとスイのおはなし/}).click();await page.getByRole('button',{name:'絵本にひたる · 大きく読む'}).click();
 const reader=page.getByRole('dialog',{name:'絵本にひたるモード'});await reader.getByText('よみかた',{exact:true}).click();await reader.getByRole('button',{name:'モコモの世界にもどる',exact:true}).click();await expect(reader).toHaveCount(0);await expect(home).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'))).toBe(before);
 for(const width of[320,390,760,1440]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const boxes=await home.locator('.cloud-place,.cloud-friend').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];expect(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y).toBe(true);}}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/mocomo-usability-mobile.png',fullPage:true});
});
