// Reproducible movie capture. Requires a running local dev server and ffmpeg.
import { filmDuration, filmFrame } from '../lib/film-motion.ts';
import { chromium } from '@playwright/test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const runtimePath = process.env.MOCOMO_CHROMIUM_PATH;
const browser = await chromium.launch({...(runtimePath ? {executablePath:runtimePath}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
const captureDir = '../browser-runtime/movie-capture';
await mkdir(captureDir,{recursive:true});
const framesDir = `${captureDir}/frames-v2`;
await rm(framesDir,{recursive:true,force:true});
await mkdir(framesDir,{recursive:true});
const context = await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});
const page = await context.newPage();
await page.clock.install({time:new Date('2026-10-10T00:00:00Z')});
await page.goto(`${process.env.MOCOMO_RENDER_URL || 'http://127.0.0.1:3000'}/shorts/first-star`,{waitUntil:'networkidle'});
await page.evaluate(async()=>{await document.fonts.ready;for(const src of ['/characters/moco/performance/parts-v1.webp','/world/scenes-v1.png','/characters/companions-wonder.png']){const im=new Image();im.src=src;await im.decode();}});
await page.clock.pauseAt(new Date('2026-10-10T00:00:10Z'));
await page.getByRole('button',{name:'アニメをみる',exact:true}).click();
await page.clock.runFor(10000);
const rolled = await page.evaluate(() => {
 const stage=document.querySelector('.moco-short').getBoundingClientRect();
 const star=document.querySelector('.short-star').getBoundingClientRect();
 return {x:(star.x+star.width/2-stage.x)/stage.width,y:(star.y+star.height/2-stage.y)/stage.height};
});
if (Math.abs(rolled.x-.68)>.02 || Math.abs(rolled.y-.70)>.02) throw new Error(`Stale film styles: ${JSON.stringify(rolled)}`);
await page.getByRole('button',{name:'はじめから',exact:true,includeHidden:true}).click();
await page.clock.runFor(50);
await page.addStyleTag({content:'.theater-standalone{padding:0;max-width:none;margin:0}.moco-short{width:1280px;height:720px;aspect-ratio:auto;border-radius:0!important;box-shadow:none}.theater-controls,.theater-note,.movie-file-link{display:none!important}nextjs-portal{display:none}'});
await page.evaluate(() => window.scrollTo(0, 0));
// Deterministic capture: wall-clock load cannot stretch or omit story beats.
const fps = 24;
console.log('film timeline and star position verified');
const capture = await context.newCDPSession(page);
for (let frame = 0; frame < Math.ceil((filmDuration + .4) * fps); frame++) {
 if (frame % 120 === 0) {
  const actual = Number(await page.locator('.moco-short').getAttribute('data-frame'));
  // rAF can land one paint before a boundary; reject larger timeline drift.
  const expected = filmFrame(frame / fps);
  if (actual < filmFrame(Math.max(0,frame / fps-.08)) || actual > filmFrame(frame / fps+.08)) throw new Error(`Frame ${frame}: expected scene ${expected}, got ${actual}`);
 }
 const shot = await capture.send('Page.captureScreenshot',{format:'jpeg',quality:90,fromSurface:true,captureBeyondViewport:false});
 await writeFile(`${framesDir}/${String(frame).padStart(4,'0')}.jpg`,Buffer.from(shot.data,'base64'));
 await page.clock.runFor(1000 / fps);
 if (frame % 120 === 0) console.log(`captured ${frame}/${Math.ceil((filmDuration + .4) * fps)}`);
}
await context.close();await browser.close();
await mkdir('public/movies',{recursive:true});
const result=spawnSync('ffmpeg',['-y','-framerate',String(fps),'-i',`${framesDir}/%04d.jpg`,'-an','-c:v','libx264','-preset','slow','-crf','28','-pix_fmt','yuv420p','-movflags','+faststart','public/movies/first-star-v2.mp4'],{encoding:'utf8'});
if(result.status!==0)throw new Error(result.stderr);
console.log('public/movies/first-star-v2.mp4');
