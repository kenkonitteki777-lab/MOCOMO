import {test,expect} from '@playwright/test';
test('Pino reacts to colors and touch; audio is opt-in, closes on exit; real palette survives saving',async({page})=>{
 await page.addInitScript(()=>{const Original=window.AudioContext;const contexts:AudioContext[]=[];Object.assign(window,{pinoContexts:contexts});window.AudioContext=class extends Original{constructor(){super();contexts.push(this);}};});
 await page.goto('/');await page.getByRole('button',{name:/にじの道/}).click();
 expect(await page.evaluate(()=>(window as unknown as {pinoContexts:AudioContext[]}).pinoContexts.length)).toBe(0);
 await page.getByRole('button',{name:'虹の2番目の色'}).click();await page.getByRole('button',{name:'みどり',exact:true}).click();
 await expect(page.getByRole('img',{name:'ピノ・わくわく',exact:true})).toBeVisible();await expect(page.getByRole('img',{name:'ももいろ、みどり、そらいろの虹'})).toBeVisible();
 await page.getByRole('button',{name:'ぴのに、こんにちは'}).click();await expect(page.locator('.game-caption')).toContainText('きみの色も、すき');
 expect(await page.evaluate(()=>localStorage.getItem('mocomo.guest.memories.v1'))).toBeNull();
 await page.getByRole('button',{name:'音をつける',exact:true}).click();await expect(page.getByRole('button',{name:'音をとめる'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'虹を、ふわっと奏でる'}).click();await expect(page.locator('.game-caption')).toContainText('音になった');
 await page.getByRole('button',{name:'空をかえる · ひる'}).click();await expect(page.locator('.pino-stage')).toHaveClass(/pino-sky-1/);
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/pino-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'この時間を、記憶に'}).dblclick();await expect(page.getByRole('heading',{name:'きみの虹が、できたね。'})).toBeVisible();
 expect(await page.evaluate(()=>(window as unknown as {pinoContexts:AudioContext[]}).pinoContexts.every(c=>c.state==='closed'))).toBe(true);
 const memories=await page.evaluate(()=>JSON.parse(localStorage.getItem('mocomo.guest.memories.v1')!));expect(memories).toHaveLength(1);expect(memories[0].payload.colors).toEqual(['ももいろ','みどり','そらいろ']);expect(memories[0].payload.sky).toBe('こさめ');
 await page.getByRole('button',{name:'もういちど、色であそぶ'}).click();await page.getByRole('button',{name:'音をつける',exact:true}).click();await page.getByRole('button',{name:'きょうは、ここまで'}).click();
 expect(await page.evaluate(()=>(window as unknown as {pinoContexts:AudioContext[]}).pinoContexts.every(c=>c.state==='closed'))).toBe(true);
});
test('quiet settings and motion reduction keep Pino touch usable without animation or unsolicited audio',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:/にじの道/}).click();await page.getByRole('button',{name:'そらいろ',exact:true}).click();expect(await page.locator('.pino-friend').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 await page.getByRole('button',{name:/おうち FAMILY/}).click();await page.getByRole('button',{name:'私は保護者です'}).click();await page.getByRole('switch').click();await page.getByRole('button',{name:/あそぶ PLAY/}).click();await page.getByRole('button',{name:/にじの道/}).click();await expect(page.getByRole('button',{name:'音をつける',exact:true})).toBeDisabled();await page.getByRole('button',{name:'きいろ',exact:true}).click();await expect(page.getByRole('img',{name:'きいろ、きいろ、そらいろの虹'})).toBeVisible();
});
