// Generates favicons from public/logo-icon.png (white logo on transparent bg)
// onto a dark brand square, so the icon is visible on white search results.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "public/logo-icon.png";
const BG = "#1c1a17";

async function square(size, { pad = 0.17, radius = 0.22 } = {}) {
  const inner = Math.round(size * (1 - 2 * pad));
  const logo = await sharp(SRC)
    .trim()
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const r = Math.round(size * radius);
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${BG}"/></svg>`,
  );
  return sharp(bg).composite([{ input: logo, gravity: "center" }]).png({ compressionLevel: 9 }).toBuffer();
}

function ico(pngs) {
  // ICO container with embedded PNG images
  const count = pngs.length;
  const header = Buffer.alloc(6 + 16 * count);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = header.length;
  pngs.forEach(({ size, buf }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(buf.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.buf)]);
}

const out = {};
for (const s of [16, 32, 48, 96, 120, 192, 512]) out[s] = await square(s, s <= 32 ? { pad: 0.1, radius: 0.18 } : {});
await writeFile("public/favicon-96x96.png", out[96]);
await writeFile("public/favicon-120x120.png", out[120]);
await writeFile("public/icon-192.png", out[192]);
await writeFile("public/icon-512.png", out[512]);
// apple-touch-icon: full-bleed square (iOS rounds corners itself)
await writeFile("public/apple-touch-icon.png", await square(180, { pad: 0.16, radius: 0 }));
await writeFile("public/favicon.ico", ico([16, 32, 48].map((size) => ({ size, buf: out[size] }))));
// keep /favicon.svg for old references, but make it the logo instead of the orange square
const b64 = out[192].toString("base64");
await writeFile(
  "public/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="192" height="192" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,${b64}"/></svg>\n`,
);
console.log("ICONS DONE");
