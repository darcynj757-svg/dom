import { chromium } from 'playwright';
import fs from 'node:fs/promises';
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
if (canvasInfo.width !== 1280 || canvasInfo.height !== 720) throw new Error(`Expected 1280x720 canvas, got ${canvasInfo.width}x${canvasInfo.height}`);
console.log(`canvas ${canvasInfo.width}x${canvasInfo.height}; requesting 450 explicit frames`);

const webmBase64 = await page.evaluate(async () => {
  const canvas = document.querySelector('[data-house-test-stage] canvas');
  if (!canvas) throw new Error('3D canvas not found');
  const setter = window.__KEDR_HOUSE_SCROLL_TEST_SET_PROGRESS__;
  if (!setter) throw new Error('Progress setter is not available');
  const stream = canvas.captureStream(0);
  const track = stream.getVideoTracks()[0];
  if (!track || typeof track.requestFrame !== 'function') throw new Error('Manual canvas frame capture is not supported');
  const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) throw new Error('MediaRecorder WebM is not supported');
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10_000_000 });
  const chunks = [];
  recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
  const stopped = new Promise((resolve, reject) => {
    recorder.onerror = () => reject(recorder.error || new Error('Recorder failed'));
    recorder.onstop = async () => {
      const bytes = new Uint8Array(await new Blob(chunks, { type: mimeType }).arrayBuffer());
      let binary = '';
      for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
      resolve({ mimeType, bytes: bytes.length, base64: btoa(binary) });
    };
  });
  recorder.start();
  for (let index = 0; index < 450; index += 1) {
    setter(index / 449);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    track.requestFrame();
  }
  await new Promise((resolve) => setTimeout(resolve, 120));
  recorder.stop();
  return stopped;
});
await fs.writeFile('/tmp/house-scroll-test-explicit.webm', Buffer.from(webmBase64.base64, 'base64'));
console.log(JSON.stringify({ mimeType: webmBase64.mimeType, bytes: webmBase64.bytes }));
await browser.close();
