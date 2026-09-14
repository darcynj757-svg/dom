import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptPath = new URL("./check-production-indexing.mjs", import.meta.url);

const validRobots = `User-agent: *
Allow: /
Disallow: /terms

Sitemap: https://kedr-tomsk.ru/sitemap.xml
`;

function validSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

async function createArtifact({ sitemap, robots = validRobots, pages = [] }) {
  const outputRoot = await mkdtemp(join(tmpdir(), "stroy-doma-indexing-"));
  await writeFile(join(outputRoot, "robots.txt"), robots);
  await writeFile(join(outputRoot, "sitemap.xml"), sitemap);
  for (const pathname of pages) {
    const pagePath = join(
      outputRoot,
      pathname === "/" ? "index.html" : pathname.slice(1),
      ...(pathname === "/" ? [] : ["index.html"]),
    );
    await mkdir(join(pagePath, ".."), { recursive: true });
    await writeFile(pagePath, "<!doctype html><html><body>ok</body></html>");
  }
  return outputRoot;
}

async function runCheck(outputRoot) {
  try {
    return await execFileAsync(process.execPath, [scriptPath.pathname, outputRoot]);
  } catch (error) {
    return error;
  }
}

test("production indexing preflight checks every sitemap URL over HTTP", async () => {
  const urls = [
    "https://kedr-tomsk.ru/",
    "https://kedr-tomsk.ru/projects/1",
    "https://kedr-tomsk.ru/articles/example",
  ];
  const outputRoot = await createArtifact({
    sitemap: validSitemap(urls),
    pages: ["/", "/projects/1", "/articles/example"],
  });

  try {
    const result = await runCheck(outputRoot);
    assert.equal(result.stderr, "");
    assert.match(result.stdout, /HTTP 200/);
    assert.match(result.stdout, /1 project, 1 article/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("production indexing preflight requires crawler-friendly content types", async () => {
  const outputRoot = await createArtifact({
    sitemap: validSitemap(["https://kedr-tomsk.ru/"]),
    pages: ["/"],
  });

  try {
    const result = await runCheck(outputRoot);
    assert.equal(result.stderr, "");
    assert.match(result.stdout, /HTTP 200/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("production indexing preflight rejects malformed XML", async () => {
  const outputRoot = await createArtifact({
    sitemap:
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://kedr-tomsk.ru/</loc></urlset>',
    pages: ["/"],
  });

  try {
    const result = await runCheck(outputRoot);
    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /not well-formed XML/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("production indexing preflight reports the exact unavailable URL", async () => {
  const missingUrl = "https://kedr-tomsk.ru/projects/missing";
  const outputRoot = await createArtifact({
    sitemap: validSitemap([missingUrl]),
  });

  try {
    const result = await runCheck(outputRoot);
    assert.notEqual(result.exitCode, 0);
    assert.match(
      result.stderr,
      new RegExp(`HTTP check failed for ${missingUrl}: expected 200, received 404`),
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("production indexing preflight reports every unavailable sitemap URL", async () => {
  const missingUrls = [
    "https://kedr-tomsk.ru/projects/missing-one",
    "https://kedr-tomsk.ru/articles/missing-two",
  ];
  const outputRoot = await createArtifact({
    sitemap: validSitemap(missingUrls),
  });

  try {
    const result = await runCheck(outputRoot);
    assert.notEqual(result.exitCode, 0);
    for (const missingUrl of missingUrls) {
      assert.match(
        result.stderr,
        new RegExp(`HTTP check failed for ${missingUrl}: expected 200, received 404`),
      );
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("production indexing preflight rejects multiple sitemap directives", async () => {
  const outputRoot = await createArtifact({
    sitemap: validSitemap(["https://kedr-tomsk.ru/"]),
    robots: `${validRobots}Sitemap: https://example.com/other.xml\n`,
    pages: ["/"],
  });

  try {
    const result = await runCheck(outputRoot);
    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /exactly one Sitemap directive, found 2/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});