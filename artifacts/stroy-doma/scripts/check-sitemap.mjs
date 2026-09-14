#!/usr/bin/env node
/**
 * Validates the generated sitemap's URL composition and XML structure.
 *
 * The route registry is the source of truth for generation; this check guards
 * the published artifact against duplicates, aliases, malformed URLs, and
 * accidentally indexable private/legal pages.
 */
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const appRoot = resolve(import.meta.dirname, "..");
const sitemapPath = resolve(
  process.argv.slice(2).find((argument) => argument !== "--") ??
    join(appRoot, "dist", "public", "sitemap.xml"),
);
const siteUrl = "https://kedr-tomsk.ru";
const disallowedSitemapPaths = new Set(["/terms"]);

function fail(message) {
  throw new Error(message);
}

function parseUrls(xml) {
  const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
    (match) => match[1],
  );
  if (urlBlocks.length === 0) fail("sitemap has no <url> entries");

  return urlBlocks.map((block, index) => {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const changefreq = block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1]?.trim();
    const priority = block.match(/<priority>([^<]+)<\/priority>/)?.[1]?.trim();

    if (!loc) fail(`sitemap entry ${index + 1} is missing <loc>`);
    if (!changefreq) fail(`sitemap entry ${index + 1} is missing <changefreq>`);
    if (!priority) fail(`sitemap entry ${index + 1} is missing <priority>`);

    return { loc, changefreq, priority };
  });
}

function getAttribute(tag, attribute) {
  return tag.match(
    new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, "i"),
  )?.[1];
}

function getCanonicalLinks(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) =>
      getAttribute(tag, "rel")
        ?.toLowerCase()
        .split(/\s+/)
        .includes("canonical"),
    )
    .map((tag) => getAttribute(tag, "href"))
    .filter(Boolean);
}

async function validateCanonical(pathname, expectedUrl, sitemapDirectory) {
  const htmlPath = join(
    sitemapDirectory,
    pathname === "/" ? "index.html" : pathname.slice(1),
    ...(pathname === "/" ? [] : ["index.html"]),
  );
  let html;
  try {
    html = await readFile(htmlPath, "utf8");
  } catch {
    fail(`sitemap URL ${expectedUrl} has no generated HTML file: ${htmlPath}`);
  }

  const canonicalLinks = getCanonicalLinks(html);
  if (canonicalLinks.length !== 1) {
    fail(
      `sitemap URL ${expectedUrl} expected exactly one canonical link, found ${canonicalLinks.length}`,
    );
  }
  if (canonicalLinks[0] !== expectedUrl) {
    fail(
      `sitemap URL ${expectedUrl} does not match canonical link ${canonicalLinks[0]}`,
    );
  }
}

async function main() {
  const xml = await readFile(sitemapPath, "utf8");
  if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    fail("sitemap has an invalid or missing urlset namespace");
  }

  const entries = parseUrls(xml);
  const sitemapDirectory = dirname(sitemapPath);
  const paths = [];
  for (const [index, { loc }] of entries.entries()) {
    let url;
    try {
      url = new URL(loc);
    } catch {
      fail(`sitemap entry ${index + 1} has an invalid URL: ${loc}`);
    }

    if (url.origin !== siteUrl) {
      fail(`sitemap entry ${index + 1} uses an unexpected origin: ${loc}`);
    }
    if (url.search || url.hash) {
      fail(`sitemap entry ${index + 1} must not contain query or hash: ${loc}`);
    }
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      fail(`sitemap entry ${index + 1} has a trailing slash: ${loc}`);
    }
    if (disallowedSitemapPaths.has(url.pathname)) {
      fail(`sitemap contains a disallowed path: ${url.pathname}`);
    }

    await validateCanonical(url.pathname, loc, sitemapDirectory);
    paths.push(url.pathname);
  }

  const uniquePaths = new Set(paths);
  if (uniquePaths.size !== paths.length) {
    const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
    fail(`sitemap contains duplicate paths: ${[...new Set(duplicates)].join(", ")}`);
  }

  console.log(
    `Sitemap validation passed for ${entries.length} unique route(s) from ${sitemapPath}.`,
  );
}

main().catch((error) => {
  console.error(`Sitemap validation failed: ${error.message}`);
  process.exitCode = 1;
});