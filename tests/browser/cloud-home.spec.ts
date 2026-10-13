import {test,expect} from '@playwright/test';
test('cloud-home places open all five games and the picture-book shelf without inventing memories',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const home=page.getByRole('region',{name:'モコモの雲のおうち',exact:true});await expect(home).toBeVisible();
 const art=home.locator('.cloud-home-art');expect(await art.evaluate(async e=>{const image=e as HTMLImageElement;await image.decode();return image.naturalWidth===1536&&image.naturalHeight===1024;})).toBe(true);
 await expect(art).toHaveAttribute('src','/world/cloud-folds-v2.webp');await expect(home.locator('.cloud-home-map')).toHaveAttribute('data-world','cloud-folds-v2');await expect(home.locator('.cloud-map-mascot .cloud-moco')).toHaveAttribute('data-master','approved-cloud-side-palms-v4');
 const before=await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'));
 for(const width of[320,390,760,1440]){
  await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const rects=await home.locator('.cloud-place').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
  expect(rects).toHaveLength(6);for(const r of rects){expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);}
  const friends=await home.locator('.cloud-friend').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));for(const r of friends){expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);}
  for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];expect(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y).toBe(true);}
 }
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/mocomo-cloud-home-mobile.png',fullPage:true});
 const destinations=[['にじのアトリエ','にじの道'],['雲のキッチン','もぐもぐキッチン'],['ふわふわの丘','もこもこジャンプ'],['星の庭','ひみつさがし'],['おやすみの雲','ほっとタイム']];
 for(const[place,game]of destinations){await home.getByRole('button',{name:new RegExp(place)}).click();await expect(page.getByRole('heading',{name:game,exact:true})).toBeVisible();await page.getByRole('button',{name:/きょう TODAY/}).click();await expect(home).toBeVisible();}
 await home.getByRole('button',{name:/えほんのおへや/}).click();await expect(page.getByRole('group',{name:'読む絵本をえらぶ'})).toBeVisible();await page.getByRole('button',{name:/モコモとスイのおはなし/}).click();await expect(page.getByRole('article',{name:'ほしを、まんなかに'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'))).toBe(before);
});

test('new home cloud friends can be found, enter their places, and use quiet mode',async({page})=>{
 await page.goto('/');const home=page.getByRole('region',{name:'モコモの雲のおうち',exact:true});const before=await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'));
 for(const name of ['スイ','レン','ルナ']){await home.getByRole('button',{name:`${name}をみつける`,exact:true}).click();await expect(home.locator('.friend-found-message')).toContainText(`${name}、みつけた。`);await expect(home.getByRole('button',{name:`${name}がかくれる`,exact:true})).toHaveAttribute('aria-pressed','true');}
 await home.getByRole('button',{name:/ルナとあそびへ/}).click();await expect(page.getByRole('heading',{name:'ほっとタイム',exact:true})).toBeVisible();await page.getByRole('button',{name:/きょう TODAY/}).click();await page.emulateMedia({reducedMotion:'reduce'});expect(await home.locator('.cloud-map-mascot .cloud-moco-body').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');expect(await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'))).toBe(before);
 await home.getByRole('link',{name:/くものむこうへ/}).click();await expect(page).toHaveURL(/world\/cloud-folds/);
});
