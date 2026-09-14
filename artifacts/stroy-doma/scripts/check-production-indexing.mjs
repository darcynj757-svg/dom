#!/usr/bin/env node
/**
 * Pre-publication guard for robots.txt and sitemap.xml.
 *
 * This validates the generated public artifact, so a build cannot publish
 * stale robots rules or a sitemap pointing at the wrong domain.
 */
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const appRoot = resolve(import.meta.dirname, "..");
const outputRoot = resolve(
  process.argv.slice(2).find((argument) => argument !== "--") ??
    join(appRoot, "dist", "public"),
);
const siteUrl = "https://kedr-tomsk.ru";
const sitemapUrl = `${siteUrl}/sitemap.xml`;

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

async function main() {
  const robotsPath = join(outputRoot, "robots.txt");
  const sitemapPath = join(outputRoot, "sitemap.xml");
  const [robots, sitemap] = await Promise.all([
    readFile(robotsPath, "utf8"),
    readFile(sitemapPath, "utf8"),
  ]);

  const robotsLines = robots
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  assert(
    robotsLines.includes("User-agent: *"),
    "robots.txt must define a wildcard User-agent",
  );
  assert(
    robotsLines.includes("Allow: /"),
    "robots.txt must allow the public site root",
  );
  assert(
    robotsLines.includes("Disallow: /terms"),
    "robots.txt must disallow /terms",
  );
  assert(
    !robotsLines.includes("Disallow: /"),
    "robots.txt must not disallow the entire site",
  );
  assert(
    robotsLines.includes(`Sitemap: ${sitemapUrl}`),
    `robots.txt must reference ${sitemapUrl}`,
  );

  assert(
    sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
    "sitemap.xml must contain the standard urlset namespace",
  );
  const locs = parseSitemapLocs(sitemap);
  assert(locs.length > 0, "sitemap.xml must contain at least one URL");
  assert(
    new Set(locs).size === locs.length,
    "sitemap.xml must not contain duplicate URLs",
  );
  for (const loc of locs) {
    let url;
    try {
      url = new URL(loc);
    } catch {
      fail(`sitemap.xml contains an invalid URL: ${loc}`);
    }
    assert(url.origin === siteUrl, `sitemap.xml contains an unexpected origin: ${loc}`);
    assert(!url.search && !url.hash, `sitemap.xml URL must not contain query or hash: ${loc}`);
    assert(
      url.pathname === "/" || !url.pathname.endsWith("/"),
      `sitemap.xml URL must not have a trailing slash: ${loc}`,
    );
    assert(
      url.pathname !== "/terms",
      "sitemap.xml must not include the disallowed /terms page",
    );
  }

  console.log(
    `Production indexing preflight passed for ${outputRoot}: robots.txt and ${locs.length} sitemap URL(s).`,
  );
}

main().catch((error) => {
  console.error(`Production indexing preflight failed: ${error.message}`);
  process.exitCode = 1;
});