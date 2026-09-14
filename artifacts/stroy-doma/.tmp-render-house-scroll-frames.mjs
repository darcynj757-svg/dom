import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const frameDir = '/tmp/house-scroll-frames';
await fs.rm(frameDir, { recursive: true, force: true });
await fs.mkdir(frameDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: '/repl/tools/bin/chromium',
  args: ['--use-gl=swiftshader', '--disable-gpu-sandbox', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
page.on('console', (msg) => { if (msg.type() === 'error') console.error('[browser]', msg.text()); });
page.on('pageerror', (error) => console.error('[pageerror]', error.message));
await page.goto('http://127.0.0.1:19912/__stroy-doma/house-scroll-test', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForSelector('[data-house-test-stage]', { state: 'attached', timeout: 120000 });
await page.waitForFunction(() => Boolean(document.querySelector('[data-house-test-stage] canvas')), null, { timeout: 120000 });
await page.waitForSelector('[data-house-model-ready="true"]', { state: 'attached', timeout: 120000 });

await page.evaluate(() => {
  const stage = document.querySelector('[data-house-test-stage]');
  if (!stage) throw new Error('Test stage not found');
  Object.assign(stage.style, {
    position: 'fixed', left: '0px', top: '0px', right: 'auto', bottom: 'auto',
    width: '1280px', height: '720px', maxWidth: 'none', aspectRatio: 'auto',
    borderRadius: '0px', border: '0px', zIndex: '9999',
  });
});
await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const canvasInfo = await page.locator('[data-house-test-stage] canvas').evaluate((canvas) => ({ width: canvas.width, height: canvas.height }));
if (canvasInfo.width !== 1280 || canvasInfo.height !== 720) {
  throw new Error(`Expected a 1280x720 WebGL canvas, got ${canvasInfo.width}x${canvasInfo.height}`);
}
console.log(`canvas ${canvasInfo.width}x${canvasInfo.height}; rendering 450 source frames`);

for (let index = 0; index < 450; index += 1) {
  const progress = index / 449;
  await page.evaluate((value) => {
    const setter = window.__KEDR_HOUSE_SCROLL_TEST_SET_PROGRESS__;
    if (!setter) throw new Error('Progress setter is not available');
    setter(value);
  }, progress);
  await page.evaluate(() => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  const dataUrl = await page.locator('[data-house-test-stage] canvas').evaluate((canvas) => canvas.toDataURL('image/png'));
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  await fs.writeFile(path.join(frameDir, `${String(index + 1).padStart(6, '0')}.png`), Buffer.from(base64, 'base64'));
  if ((index + 1) % 50 === 0) console.log(`frame ${index + 1}/450 progress=${progress.toFixed(4)}`);
}
await browser.close();
