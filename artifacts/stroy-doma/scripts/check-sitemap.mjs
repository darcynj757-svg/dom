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

function getTextElements(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi"))]
    .map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function getMetaDescriptions(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0].match(/\bname\s*=\s*["']description["']/i)
      ? match[0].match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? ""
      : "")
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

  const titles = getTextElements(html, "title");
  if (titles.length !== 1) {
    fail(
      `sitemap URL ${expectedUrl} expected exactly one non-empty title, found ${titles.length}`,
    );
  }

  const descriptions = getMetaDescriptions(html);
  if (descriptions.length !== 1) {
    fail(
      `sitemap URL ${expectedUrl} expected exactly one non-empty meta description, found ${descriptions.length}`,
    );
  }

  const headings = getTextElements(html, "h1");
  if (headings.length !== 1) {
    fail(
      `sitemap URL ${expectedUrl} expected exactly one non-empty H1, found ${headings.length}`,
    );
  }

  return { title: titles[0], description: descriptions[0], h1: headings[0] };
}

async function main() {
  const xml = await readFile(sitemapPath, "utf8");
  if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    fail("sitemap has an invalid or missing urlset namespace");
  }

  const entries = parseUrls(xml);
  const sitemapDirectory = dirname(sitemapPath);
  const paths = [];
  const titles = new Map();
  const descriptions = new Map();
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

    const metadata = await validateCanonical(url.pathname, loc, sitemapDirectory);
    const duplicateTitle = titles.get(metadata.title);
    if (duplicateTitle) {
      fail(
        `sitemap routes ${duplicateTitle} and ${url.pathname} share the same title`,
      );
    }
    titles.set(metadata.title, url.pathname);

    const duplicateDescription = descriptions.get(metadata.description);
    if (duplicateDescription) {
      fail(
        `sitemap routes ${duplicateDescription} and ${url.pathname} share the same meta description`,
      );
    }
    descriptions.set(metadata.description, url.pathname);
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