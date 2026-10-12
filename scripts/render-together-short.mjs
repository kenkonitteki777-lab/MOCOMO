// Fixed-clock capture of the new connected contact shot. Requires next start + ffmpeg. Run with node --import tsx.
import { togetherDuration, togetherFrame } from '../lib/together-motion.ts';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const browser = await chromium.launch({ executablePath: process.env.MOCOMO_CHROMIUM_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 960 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.clock.install({ time: new Date('2026-10-12T00:00:00Z') });
await page.goto(`${process.env.MOCOMO_RENDER_URL || 'http://127.0.0.1:3022'}/shorts/together`, { waitUntil: 'networkidle' });
await page.evaluate(async () => { await document.fonts.ready; for (const src of ['/characters/together/hold-v1.webp', '/world/films/first-star-v1.webp']) { const im = new Image(); im.src = src; await im.decode(); } });
await page.clock.pauseAt(new Date('2026-10-12T01:00:00Z'));
await page.addStyleTag({ content: '.together-theater{max-width:none;padding:0;margin:0}.together-theater>:not(.together-short){display:none!important}.together-short{width:1280px;height:960px;aspect-ratio:auto;border-radius:0;box-shadow:none}' });
await page.getByRole('button', { name: 'ふたりを、みる', includeHidden: true }).evaluate(e => e.click());
await page.evaluate(() => window.scrollTo(0, 0));
const frames = `../browser-runtime/together-frames-${Date.now()}`;
await mkdir(frames, { recursive: true });
const capture = await context.newCDPSession(page), fps = 24, count = Math.ceil((togetherDuration + .4) * fps);
for (let i = 0; i < count; i++) {
  if (i % 48 === 0) {
    const frame = Number(await page.locator('.together-short').getAttribute('data-frame'));
    if (frame < togetherFrame(Math.max(0, i / fps - .08)) || frame > togetherFrame(i / fps + .08)) throw Error(`Timeline drift at frame ${i}`);
    console.log(`captured ${i}/${count}`);
  }
  const shot = await capture.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, fromSurface: true, captureBeyondViewport: false });
  await writeFile(`${frames}/${String(i).padStart(4, '0')}.jpg`, Buffer.from(shot.data, 'base64'));
  await page.clock.runFor(1000 / fps);
}
await context.close(); await browser.close();
await mkdir('public/movies', { recursive: true });
const result = spawnSync('ffmpeg', ['-y', '-framerate', '24', '-i', `${frames}/%04d.jpg`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'public/movies/together-v1.mp4'], { encoding: 'utf8' });
if (result.status !== 0) throw Error(result.stderr);
console.log('public/movies/together-v1.mp4');
