import {test,expect} from '@playwright/test';
test('cast artwork, food play and illustrated story preserve the actual choices',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/せかい WORLD/}).click();
 await expect(page.locator('.friends .companion')).toHaveCount(9);
 await expect(page.getByRole('button',{name:/ピノ/})).toBeVisible();
 const companionImage=await page.locator('.friends .companion-art').first().evaluate(async e=>{const im=new Image();im.src=getComputedStyle(e).backgroundImage.slice(5,-2);await im.decode();return im.naturalWidth>0;});expect(companionImage).toBe(true);
 await page.getByRole('button',{name:/ピノ/}).click();await expect(page.getByRole('status')).toContainText('保存');
 await page.getByRole('button',{name:/あそぶ PLAY/}).click();await page.getByRole('button',{name:/もぐもぐキッチン/}).click();
 await expect(page.getByRole('button',{name:'この時間を、記憶に'})).toBeDisabled();
 await page.getByRole('button',{name:/おにぎり/}).click();await page.getByRole('button',{name:'お皿にのせる'}).click();await page.getByRole('button',{name:'いっしょに、いただきます'}).click();
 await expect(page.getByRole('img',{name:'トト・わくわく',exact:true})).toBeVisible();
 const excited=await page.locator('.play-companion .companion-art').evaluate(async e=>{const im=new Image();im.src=getComputedStyle(e).backgroundImage.slice(5,-2);await im.decode();return im.src.endsWith('companions-wonder.png');});expect(excited).toBe(true);
 await page.getByRole('button',{name:'この時間を、記憶に'}).click();
 await page.getByRole('button',{name:/えほん BOOK/}).click();await expect(page.getByText('1 / 2')).toBeVisible();
 await expect(page.locator('.book-illustration')).toHaveAttribute('data-scene','home');
 await page.getByRole('button',{name:'次のページ'}).click();await expect(page.locator('.book-illustration')).toHaveAttribute('data-scene','kitchen');
 await expect(page.locator('.story-copy')).toContainText('おにぎり');await expect(page.getByRole('img',{name:'トト・わくわく',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'いっしょに、おはなしする'}).click();await expect(page.getByText('だれと、いっしょに食べたい？')).toBeVisible();
 await page.screenshot({path:'test-results/mocomo-illustrated-book.png',fullPage:true});
 await page.reload();await page.getByRole('button',{name:/えほん BOOK/}).click();await page.getByRole('button',{name:'2ページへ'}).click();await expect(page.locator('.story-copy')).toContainText('おにぎり');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('rainbow supports separate bands and quiet play remains optional',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.goto('/');await page.getByRole('button',{name:/にじの道/}).click();
 await page.getByRole('button',{name:'虹の2番目の色'}).click();await page.getByRole('button',{name:'みどり',exact:true}).click();
 await expect(page.getByRole('img',{name:/ももいろ、みどり、そらいろの虹/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/mocomo-rainbow-play.png',fullPage:true});
});

test('jump and rest trigger the companion expressions',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/もこもこジャンプ/}).click();
 await expect(page.getByRole('img',{name:'レン',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'もこもとジャンプ'}).click();await expect(page.getByRole('img',{name:'レン・わくわく',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'← あそびをえらぶ'}).click();await page.getByRole('button',{name:/ほっとタイム/}).click();
 await expect(page.getByRole('img',{name:'ルナ・ひとやすみ',exact:true})).toBeVisible();
 const rested=await page.locator('.play-companion .companion-art').evaluate(async e=>{const im=new Image();im.src=getComputedStyle(e).backgroundImage.slice(5,-2);await im.decode();return im.src.endsWith('companions-rest.png');});expect(rested).toBe(true);
});
