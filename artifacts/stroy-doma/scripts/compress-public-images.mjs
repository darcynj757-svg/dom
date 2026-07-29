#!/usr/bin/env node
/**
 * Сжимает все JPG→WebP и пережимает большие WebP в public/images.
 * Затем обновляет ссылки в исходниках src/.
 *
 * Запуск: node scripts/compress-public-images.mjs
 */
import { readdir, stat, unlink, readFile, writeFile } from "node:fs/promises";
import { join, extname, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_IMAGES = join(__dirname, "..", "public", "images");
const SRC_DIR       = join(__dirname, "..", "src");
const DATA_DIR      = join(__dirname, "..", "src", "data");

const JPG_QUALITY  = 82;
const WEBP_QUALITY = 82;
// Пережимаем WebP только если файл > 200 КБ
const WEBP_RECOMPRESS_THRESHOLD = 200 * 1024;

// ── 1. Обходим дерево файлов ──────────────────────────────────────────────
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// ── 2. Конвертируем / сжимаем ─────────────────────────────────────────────
let totalBefore = 0, totalAfter = 0;
let jpgConverted = 0, webpRecompressed = 0;

// Собираем список переименований для замены в исходниках
const renames = []; // { from: "/images/foo.jpg", to: "/images/foo.webp" }

for await (const file of walk(PUBLIC_IMAGES)) {
  const ext  = extname(file).toLowerCase();
  const size = (await stat(file)).size;

  if (ext === ".jpg" || ext === ".jpeg") {
    const webpPath = file.replace(/\.jpe?g$/i, ".webp");
    totalBefore += size;
    await sharp(file).webp({ quality: JPG_QUALITY }).toFile(webpPath);
    const after = (await stat(webpPath)).size;
    totalAfter += after;
    const saved = (((size - after) / size) * 100).toFixed(0);
    console.log(`JPG→WebP  ${relative(PUBLIC_IMAGES, file).padEnd(70)} ${(size/1024).toFixed(0).padStart(6)}KB → ${(after/1024).toFixed(0).padStart(5)}KB  (−${saved}%)`);
    // Удаляем исходный JPG
    await unlink(file);
    // Запоминаем для замены ссылок
    const pubFrom = "/images/" + relative(PUBLIC_IMAGES, file).replace(/\\/g, "/");
    const pubTo   = pubFrom.replace(/\.jpe?g$/i, ".webp");
    renames.push({ from: pubFrom, to: pubTo });
    jpgConverted++;

  } else if (ext === ".webp" && size > WEBP_RECOMPRESS_THRESHOLD) {
    const tmp = file + ".tmp.webp";
    totalBefore += size;
    await sharp(file).webp({ quality: WEBP_QUALITY }).toFile(tmp);
    const after = (await stat(tmp)).size;
    if (after < size) {
      await unlink(file);
      // rename tmp → file
      const { rename } = await import("node:fs/promises");
      await rename(tmp, file);
      totalAfter += after;
      const saved = (((size - after) / size) * 100).toFixed(0);
      console.log(`WebP re   ${relative(PUBLIC_IMAGES, file).padEnd(70)} ${(size/1024).toFixed(0).padStart(6)}KB → ${(after/1024).toFixed(0).padStart(5)}KB  (−${saved}%)`);
      webpRecompressed++;
    } else {
      await unlink(tmp);
      totalAfter += size;
      console.log(`WebP skip ${relative(PUBLIC_IMAGES, file).padEnd(70)} ${(size/1024).toFixed(0).padStart(6)}KB (already optimal)`);
    }
  } else {
    // Всё остальное — считаем как есть
    totalAfter += size;
  }
}

// ── 3. Обновляем ссылки в исходниках ─────────────────────────────────────
if (renames.length > 0) {
  const exts = [".ts", ".tsx", ".css", ".html"];
  async function* walkSrc(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) yield* walkSrc(full);
      else if (exts.includes(extname(entry.name).toLowerCase())) yield full;
    }
  }

  // Также проверяем корневой index.html и данные
  const filesToPatch = [];
  for await (const f of walkSrc(SRC_DIR)) filesToPatch.push(f);
  filesToPatch.push(join(__dirname, "..", "index.html"));

  let patchedFiles = 0;
  for (const file of filesToPatch) {
    let content = await readFile(file, "utf8");
    let changed = false;
    for (const { from, to } of renames) {
      // Экранируем спецсимволы для RegExp
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped, "g");
      if (re.test(content)) {
        content = content.replace(new RegExp(escaped, "g"), to);
        changed = true;
      }
    }
    if (changed) {
      await writeFile(file, content, "utf8");
      console.log(`Patched   ${relative(join(__dirname, ".."), file)}`);
      patchedFiles++;
    }
  }
  console.log(`\nПатчнуто файлов: ${patchedFiles}`);
}

// ── 4. Итог ───────────────────────────────────────────────────────────────
const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
const savedPct = totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0) : 0;
console.log(`
════════════════════════════════════════
 JPG→WebP:        ${jpgConverted} файлов
 WebP пережато:   ${webpRecompressed} файлов
 Было:            ${(totalBefore/1024/1024).toFixed(1)} МБ
 Стало:           ${(totalAfter/1024/1024).toFixed(1)} МБ
 Сэкономлено:     ${savedMB} МБ (−${savedPct}%)
════════════════════════════════════════`);
