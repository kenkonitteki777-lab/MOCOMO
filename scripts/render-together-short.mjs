// Fixed-clock capture of the new connected contact shot. Requires next start + ffmpeg. Run with node --import tsx.
import { togetherDuration, togetherFrame } from '../lib/together-motion.ts';
import { handoverDuration, handoverFrame } from '../lib/handover-motion.ts';
const handover=process.env.MOCOMO_RENDER_HANDOVER==='1';
const duration=handover?handoverDuration:togetherDuration, frameAt=handover?handoverFrame:togetherFrame;
const route=handover?'handover':'together';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const browser = await chromium.launch({ executablePath: process.env.MOCOMO_CHROMIUM_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 960 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.clock.install({ time: new Date('2026-10-12T00:00:00Z') });
await page.goto(`${process.env.MOCOMO_RENDER_URL || 'http://127.0.0.1:3022'}/shorts/${route}`, { waitUntil: 'networkidle' });
await page.evaluate(async (sources) => { await document.fonts.ready; for (const src of sources) { const im = new Image(); im.src = src; await im.decode(); } }, handover?['/characters/moco/performance/rig-body-v4.webp','/characters/sui/performance/rig-body-v3.webp','/characters/moco/performance/cloud-body-v3.webp','/characters/sui/performance/soft-body-v2.webp','/world/films/first-star-v1.webp']:['/characters/together/hold-v1.webp','/world/films/first-star-v1.webp']);
await page.clock.pauseAt(new Date('2026-10-12T01:00:00Z'));
await page.addStyleTag({ content: '.together-theater{max-width:none;padding:0;margin:0}.together-theater>:not(.together-short){display:none!important}.together-short{width:1280px;height:960px;aspect-ratio:auto;border-radius:0;box-shadow:none}' });
await page.getByRole('button', { name: 'ふたりを、みる', includeHidden: true }).evaluate(e => e.click());
await page.evaluate(() => window.scrollTo(0, 0));
const frames = `../browser-runtime/${route}-frames-${Date.now()}`;
await mkdir(frames, { recursive: true });
const capture = await context.newCDPSession(page), fps = 24, count = Math.ceil((duration + .4) * fps);
for (let i = 0; i < count; i++) {
  if (i % 48 === 0) {
    const frame = Number(await page.locator('.together-short').getAttribute('data-frame'));
    if (frame < frameAt(Math.max(0, i / fps - .08)) || frame > frameAt(i / fps + .08)) throw Error(`Timeline drift at frame ${i}`);
    console.log(`captured ${i}/${count}`);
  }
  const shot = await capture.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, fromSurface: true, captureBeyondViewport: false });
  await writeFile(`${frames}/${String(i).padStart(4, '0')}.jpg`, Buffer.from(shot.data, 'base64'));
  await page.clock.runFor(1000 / fps);
}
await context.close(); await browser.close();
await mkdir('public/movies', { recursive: true });
const result = spawnSync('ffmpeg', ['-y', '-framerate', '24', '-i', `${frames}/%04d.jpg`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', handover?'28':'23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `public/movies/${route}-${handover?"v3":"v1"}.mp4`], { encoding: 'utf8' });
if (result.status !== 0) throw Error(result.stderr);
console.log(`public/movies/${route}-${handover?"v3":"v1"}.mp4`);
