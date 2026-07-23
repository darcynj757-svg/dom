/**
 * Downloads all article images from kedr-tomsk.ru,
 * paints over the logo watermark (bottom-right corner),
 * and saves them to artifacts/stroy-doma/public/images/articles/
 */

import sharp from "../node_modules/.pnpm/sharp@0.35.3_@types+node@25.9.4/node_modules/sharp/dist/index.cjs";
import fs from "fs";
import path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";

const DATA_FILE = "artifacts/stroy-doma/src/data/articles-data.ts";
const OUT_DIR = "artifacts/stroy-doma/public/images/articles";

fs.mkdirSync(OUT_DIR, { recursive: true });

// Extract all unique image URLs
const src = fs.readFileSync(DATA_FILE, "utf8");
const urls = [...new Set(src.match(/https:\/\/kedr-tomsk\.ru[^"]+\.(jpg|jpeg|png)/g) || [])];
console.log(`Found ${urls.length} unique images`);

// URL → local filename (flat, use last path segment with a hash prefix to avoid collisions)
function urlToFilename(url) {
  const u = new URL(url);
  // e.g. /assets/cache/images/articles/2017/11/1200x630-foo.cd4.jpg → articles-2017-11-1200x630-foo.cd4.jpg
  const parts = u.pathname.split("/").filter(Boolean).slice(2); // drop "assets/cache"
  return parts.join("-");
}

async function fetchToFile(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf;
}

/**
 * Removes the Kedr-Tomsk logo from the bottom-right corner.
 * Logo occupies roughly the bottom 18% height × right 28% width.
 * Strategy: sample the region directly above the logo (same background),
 * flip vertically, apply minimal blur, blend over the logo area.
 */
async function removeLogo(inputBuf) {
  const meta = await sharp(inputBuf).metadata();
  const { width, height } = meta;

  // Logo region (bottom-right corner)
  const logoW = Math.round(width * 0.28);
  const logoH = Math.round(height * 0.20);
  const logoLeft = width - logoW;
  const logoTop = height - logoH;

  // Source patch: same region, directly ABOVE the logo
  const patchTop = Math.max(0, logoTop - logoH);
  const patchH = logoTop - patchTop;

  // Extract the patch above the logo, flip it vertically so the seam is seamless,
  // apply a tiny blur to soften any texture mismatch
  const patchBuf = await sharp(inputBuf)
    .extract({ left: logoLeft, top: patchTop, width: logoW, height: patchH })
    .flip()                   // vertical flip → texture flows naturally down
    .resize(logoW, logoH)
    .blur(1.5)                // very light blur only
    .toBuffer();

  return sharp(inputBuf)
    .composite([{ input: patchBuf, left: logoLeft, top: logoTop }])
    .jpeg({ quality: 92 })
    .toBuffer();
}

// Build URL → local path map
const urlMap = {}; // originalUrl → "/images/articles/filename"
for (const url of urls) {
  const filename = urlToFilename(url);
  urlMap[url] = `/images/articles/${filename}`;
}

// Download and process in batches of 8
const entries = Object.entries(urlMap);
let done = 0;
const BATCH = 8;

for (let i = 0; i < entries.length; i += BATCH) {
  const batch = entries.slice(i, i + BATCH);
  await Promise.all(
    batch.map(async ([url, localPath]) => {
      const filename = path.basename(localPath);
      const dest = path.join(OUT_DIR, filename);

      if (fs.existsSync(dest)) {
        done++;
        process.stdout.write(`\r[${done}/${entries.length}] (cached) ${filename.slice(0, 60)}`);
        return;
      }

      try {
        const buf = await fetchToFile(url, dest + ".tmp");
        const processed = await removeLogo(buf);
        fs.writeFileSync(dest, processed);
        fs.unlinkSync(dest + ".tmp");
        done++;
        process.stdout.write(`\r[${done}/${entries.length}] ${filename.slice(0, 60)}          `);
      } catch (e) {
        // On error, save original without logo removal
        if (fs.existsSync(dest + ".tmp")) {
          fs.renameSync(dest + ".tmp", dest);
        }
        done++;
        console.error(`\nWARN: ${url} → ${e.message}`);
      }
    })
  );
}

console.log(`\nDone! All images saved to ${OUT_DIR}`);

// Rewrite the data file: replace all kedr-tomsk.ru URLs with local paths
let newSrc = src;
for (const [url, localPath] of Object.entries(urlMap)) {
  newSrc = newSrc.replaceAll(url, localPath);
}
fs.writeFileSync(DATA_FILE, newSrc);
console.log("Updated articles-data.ts with local paths.");
