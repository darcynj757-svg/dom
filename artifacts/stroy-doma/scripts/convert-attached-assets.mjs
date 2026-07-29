#!/usr/bin/env node
import { createRequire } from "node:module";
import { readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "attached_assets");
const files = await readdir(dir);
const pngs = files.filter(f => f.endsWith(".png"));

let done = 0, skipped = 0;
for (const f of pngs) {
  const src = join(dir, f);
  const dst = join(dir, f.replace(/\.png$/, ".webp"));
  try { await stat(dst); skipped++; continue; } catch {}
  try {
    await sharp(src).webp({ quality: 82 }).toFile(dst);
    done++;
    process.stdout.write(`\r✓ ${done} converted...`);
  } catch (e) {
    console.log(`\n⚠ skipped ${f}: ${e.message}`);
  }
}
console.log(`\nDone: ${done} converted, ${skipped} already existed.`);
