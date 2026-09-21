#!/usr/bin/env node
/**
 * Guards the mobile first-screen budget without adding a browser dependency.
 *
 * The check intentionally covers the build artifacts that control first paint:
 * critical HTML/CSS/entry JS, the poster and hero video, plus the
 * invariants that keep below-the-fold 3D assets out of the initial document.
 */
import { readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const appRoot = resolve(import.meta.dirname, "..");
const outputRoot = resolve(
  process.argv.slice(2).find((argument) => argument !== "--") ??
    join(appRoot, "dist", "public"),
);
const indexPath = join(outputRoot, "index.html");

const budget = {
  htmlBytes: 150_000,
  cssBytes: 180_000,
  entryJsBytes: 160_000,
  heroPosterBytes: 600_000,
  heroVideoBytes: 7_000_000,
  mobileHouseModelBytes: 1_600_000,
};

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function getAssetPath(html, pattern, label) {
  const match = html.match(pattern);
  if (!match?.[1]) fail(`first-screen budget could not find ${label}`);
  return match[1];
}

function localAssetPath(assetPath) {
  const pathname = assetPath.split(/[?#]/, 1)[0];
  assert(pathname.startsWith("/"), `asset path must be root-relative: ${assetPath}`);
  return join(outputRoot, pathname.slice(1));
}

async function assertFileBudget(assetPath, label, maxBytes) {
  const filePath = localAssetPath(assetPath);
  let size;
  try {
    size = (await stat(filePath)).size;
  } catch {
    fail(`${label} is missing from the production output: ${assetPath}`);
  }
  assert(
    size <= maxBytes,
    `${label} is ${size} bytes, above the ${maxBytes}-byte budget`,
  );
  return size;
}

async function main() {
  const html = await readFile(indexPath, "utf8");
  const htmlSize = Buffer.byteLength(html);
  assert(
    htmlSize <= budget.htmlBytes,
    `initial HTML is ${htmlSize} bytes, above the ${budget.htmlBytes}-byte budget`,
  );

  const entryJs = getAssetPath(
    html,
    /<script\b[^>]*type="module"[^>]*src="([^"]+)"/i,
    "the module entry",
  );
  const css = getAssetPath(
    html,
    /<link\b[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/i,
    "the local stylesheet",
  );
  const heroPoster = "/posters/cedar_log_mansion_flythrough_16s_compressed.webp";
  const heroVideo = "/videos/hero-mobile-1080.mp4";
  const mobileHouseModel = "/house-v2.glb";

  const [entryJsSize, cssSize, heroPosterSize, heroVideoSize, mobileHouseModelSize] =
    await Promise.all([
      assertFileBudget(entryJs, "entry JavaScript", budget.entryJsBytes),
      assertFileBudget(css, "critical CSS", budget.cssBytes),
      assertFileBudget(heroPoster, "mobile hero poster", budget.heroPosterBytes),
      assertFileBudget(
        heroVideo,
        "hero video",
        budget.heroVideoBytes,
      ),
      assertFileBudget(
        mobileHouseModel,
        "mobile 3D house model",
        budget.mobileHouseModelBytes,
      ),
    ]);

  assert(
    html.includes(`<link rel="preload" as="image" href="${heroPoster}"`),
    `mobile hero poster must be preloaded: ${heroPoster}`,
  );
  assert(
    /<video\b[^>]*poster="\/posters\/cedar_log_mansion_flythrough_16s_compressed\.webp"[^>]*preload="(?:metadata|none)"/i.test(
      html,
    ),
    "hero video must use metadata or deferred (none) preload",
  );
  assert(
    /<source\b[^>]*src="\/videos\/hero-mobile-1080\.mp4"[^>]*media="\(max-width: 767px\)"/i.test(
      html,
    ),
    "hero video must expose the high-quality mobile source",
  );
  assert(
    !/<video\b[^>]*preload="auto"/i.test(html),
    "initial HTML must not eagerly preload a video",
  );
  assert(
    !/(?:house(?:-draco)?\.glb|\/draco\/)/i.test(html),
    "initial HTML must not reference 3D GLB or Draco assets",
  );

  console.log(
    [
      "First-screen mobile budget passed:",
      `HTML=${htmlSize}B/${budget.htmlBytes}B`,
      `CSS=${cssSize}B/${budget.cssBytes}B`,
      `entry-js=${entryJsSize}B/${budget.entryJsBytes}B`,
      `poster=${heroPosterSize}B/${budget.heroPosterBytes}B`,
      `hero-video=${heroVideoSize}B/${budget.heroVideoBytes}B`,
      `mobile-3d=${mobileHouseModelSize}B/${budget.mobileHouseModelBytes}B`,
    ].join(" "),
  );
}

main().catch((error) => {
  console.error(`First-screen mobile budget failed: ${error.message}`);
  process.exitCode = 1;
});