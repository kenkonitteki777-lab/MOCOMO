import {test,expect} from '@playwright/test';
test('garden reflects actual choices, keeps history compact and connects introductions to play',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('mocomo.guest.memories.v1',JSON.stringify(Array.from({length:35},(_,i)=>({id:String(i),event_type:i===33?'CREATE':i===34?'DISCOVER':'MEET',game_id:i===33?'rainbow':i===34?'seek':null,character_id:i===33?'pino':i===34?'sui':'moco',payload:i===33?{colors:['みどり','そらいろ','きいろ']} :i===34?{item:'はっぱ'}:{},occurred_at:'2026-10-07T00:00:00Z'})))));
 await page.goto('/');await page.getByRole('button',{name:/せかい WORLD/}).click();
 await expect(page.getByRole('img',{name:'みどり、そらいろ、きいろの庭の虹'})).toBeVisible();
 await expect(page.getByRole('img',{name:'庭のはっぱ'})).toBeVisible();await expect(page.getByRole('img',{name:'庭の星'})).toHaveCount(0);
 await expect(page.locator('.garden-place[data-grown="true"]')).toHaveCount(2);
 await expect(page.locator('.garden-history')).not.toHaveAttribute('open','');
 await page.getByRole('button',{name:'ピノ',exact:true}).click();await expect(page.getByRole('article',{name:'ピノの紹介'})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('mocomo.guest.memories.v1')!).length)).toBe(35);
 await page.locator('.garden-history summary').click();await expect(page.locator('.garden-history li')).toHaveCount(5);await page.getByRole('button',{name:'前の記憶',exact:true}).click();await expect(page.locator('.history-controls')).toContainText('2 / 7');await page.locator('.garden-history summary').click();
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/garden-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'ピノと、あそぶ',exact:true}).click();await expect(page.getByRole('heading',{name:'にじの道',exact:true})).toBeVisible();
});
