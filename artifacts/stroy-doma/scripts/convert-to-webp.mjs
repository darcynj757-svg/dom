#!/usr/bin/env node
// Converts every PNG in src/assets to WebP (quality 82) and prints size savings.
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "src", "assets");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (extname(entry.name).toLowerCase() === ".png") yield full;
  }
}

let totalBefore = 0, totalAfter = 0, count = 0;

for await (const png of walk(ASSETS_DIR)) {
  const webp = png.replace(/\.png$/i, ".webp");
  const before = (await stat(png)).size;
  await sharp(png).webp({ quality: 82 }).toFile(webp);
  const after = (await stat(webp)).size;
  totalBefore += before;
  totalAfter += after;
  count++;
  const saved = (((before - after) / before) * 100).toFixed(0);
  console.log(`✓ ${png.split("/src/assets/")[1]}  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (−${saved}%)`);
}

console.log(`\nDone: ${count} files  |  ${(totalBefore/1024/1024).toFixed(1)} MB → ${(totalAfter/1024/1024).toFixed(1)} MB  (saved ${((totalBefore-totalAfter)/1024/1024).toFixed(1)} MB)`);
