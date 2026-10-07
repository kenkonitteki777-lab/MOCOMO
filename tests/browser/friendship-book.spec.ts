import {test,expect} from '@playwright/test';
test('six illustrated story pages show the emotional arc without adding fictional memories',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.getByRole('button',{name:/えほん BOOK/}).click();
 await page.getByRole('button',{name:/モコモとスイのおはなし/}).click();
 const book=page.getByRole('article',{name:'ほしを、まんなかに'});
 await expect(book.getByText('1 / 6',{exact:true})).toBeVisible();
 const expected=['はじめての、こんにちは','ふたりで、みつけた','ぼくも、もちたい','いえない、ことば','もういちど、いっしょに','ほしを、まんなかに'];
 const sources:string[]=[];
 for(let i=0;i<6;i++){
  await expect(book.locator('.story-title')).toHaveText(expected[i]);
  const img=book.getByRole('img');await expect(img).toBeVisible();
  const loaded=await img.evaluate(async element=>{const im=element as HTMLImageElement;await im.decode();return {width:im.naturalWidth,src:im.getAttribute('src')};});
  expect(loaded.width).toBeGreaterThanOrEqual(1024);sources.push(loaded.src!);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(i===3){await expect(book.locator('.friendship-text')).toContainText('「ごめんね」が、胸のなか');await page.screenshot({path:'test-results/mocomo-story-remorse.png',fullPage:true});}
  if(i<5)await book.getByRole('button',{name:'おはなしの次のページ'}).click();
 }
 expect(new Set(sources).size).toBe(6);
 await expect(book.getByRole('button',{name:'おはなしの次のページ'})).toBeDisabled();
 await expect(book.locator('.friendship-text')).toContainText('スイを見た');
 await page.screenshot({path:'test-results/mocomo-story-ending.png',fullPage:true});
 await book.getByRole('button',{name:'はじめから、もういちど'}).click();await expect(book.getByText('1 / 6',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/きみの記憶の絵本/}).click();await expect(page.getByText('まっさらなページ。',{exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:/えほん BOOK/}).click();await expect(page.getByText('まっさらなページ。',{exact:true})).toBeVisible();
});
