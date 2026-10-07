import {test,expect} from '@playwright/test';
test('a complete hop cannot restart on repeated input, turns belong to the right character, real choices connect to the story',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:/もこもこジャンプ/}).click();
 const moco=page.getByRole('button',{name:'もこもとジャンプ',exact:true}),ren=page.getByRole('button',{name:'レンとジャンプ',exact:true}),save=page.getByRole('button',{name:'この時間を、記憶に',exact:true});
 await expect(ren).toBeDisabled();await expect(save).toBeDisabled();
 await moco.press('Enter');await expect(moco).toBeDisabled();await expect(save).toBeDisabled();await moco.press('Enter');
 await expect(ren).toBeEnabled();await expect(moco).toBeDisabled();await ren.click();await expect(moco).toBeEnabled();
 await save.click();const events=await page.evaluate(()=>JSON.parse(localStorage.getItem('mocomo.guest.memories.v1')??'[]'));expect(events).toHaveLength(1);expect(events[0].payload).toMatchObject({jumps:1,sharedHops:1,companion:'ren'});
 await page.getByRole('button',{name:'レンのおはなしを読む',exact:true}).click();const book=page.getByRole('article',{name:'まって、いっしょに',exact:true});await expect(book).toBeVisible();
 for(let i=0;i<6;i++){const im=book.getByRole('img');expect(await im.evaluate(async e=>{await (e as HTMLImageElement).decode();return (e as HTMLImageElement).naturalWidth;})).toBe(1536);if(i<5)await book.getByRole('button',{name:'おはなしの次のページ'}).click();}
 await expect(book.locator('.friendship-text')).toContainText('「まって」も言える');await page.screenshot({path:'test-results/mocomo-ren-ending.png',fullPage:true});
 await book.getByRole('button',{name:'レンと、ふわふわの丘へ',exact:true}).click();await expect(page.getByRole('heading',{name:'もこもこジャンプ',exact:true})).toBeVisible();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('mocomo.guest.memories.v1')??'[]').length)).toBe(1);
});
test('each book restores its own page, malformed bookmarks and motion reduction are safe',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:/えほん BOOK/}).click();await page.getByRole('button',{name:/モコモとレンのおはなし/}).click();const book=page.getByRole('article',{name:'まって、いっしょに',exact:true});
 await book.getByRole('button',{name:'おはなしの4ページへ',exact:true}).click();await page.reload();await page.getByRole('button',{name:/えほん BOOK/}).click();await page.getByRole('button',{name:/モコモとレンのおはなし/}).click();await expect(book.locator('.story-title')).toHaveText('ふりむいたレン');
 await page.getByRole('button',{name:/モコモとスイのおはなし/}).click();await expect(page.getByRole('article',{name:'ほしを、まんなかに'}).locator('.story-title')).toHaveText('はじめての、こんにちは');
 await page.getByRole('button',{name:/モコモとレンのおはなし/}).click();await page.getByRole('button',{name:'絵本にひたる · 大きく読む'}).click();const reader=page.getByRole('dialog');await expect(reader.getByText('4 / 6',{exact:true})).toBeVisible();await reader.getByRole('button',{name:'大きな絵本の次のページ'}).click();await reader.getByRole('button',{name:'絵本にもどる',exact:true}).click();await expect(book.locator('.story-title')).toHaveText('まって、っていってもいい？');
 for(const width of[320,390,760,1440]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.locator('.route-toolbar').getByRole('button',{name:'モコモの世界にもどる',exact:true}).click();await page.getByRole('button',{name:/もこもこジャンプ/}).click();const moco=page.getByRole('button',{name:'もこもとジャンプ',exact:true});await moco.click();await expect(page.getByRole('button',{name:'レンとジャンプ'})).toBeEnabled();expect(await moco.evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 await page.screenshot({path:'test-results/mocomo-ren-jump.png',fullPage:true});
 await page.evaluate(()=>localStorage.setItem('mocomo.reading.v1:guest:',JSON.stringify({'ren-wait-v1':999,'sui-star-v1':-1})));await page.reload();await page.getByRole('button',{name:/えほん BOOK/}).click();await page.getByRole('button',{name:/モコモとレンのおはなし/}).click();await expect(book.locator('.story-title')).toHaveText('ふわふわの丘で');
});
