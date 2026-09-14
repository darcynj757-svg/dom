#!/usr/bin/env node
/**
 * Checks the published site's sitemap URLs directly over HTTPS.
 *
 * Unlike the build-time indexing preflight, this command talks to the live
 * origin and is intended to run after publishing.
 *
 * Usage:
 *   node scripts/check-production-routes.mjs
 *   node scripts/check-production-routes.mjs --base-url https://example.com
 *   node scripts/check-production-routes.mjs --sitemap dist/public/sitemap.xml
 */
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const appRoot = resolve(import.meta.dirname, "..");
const argumentsList = process.argv.slice(2);
const baseUrlArgument = argumentsList.find((argument) => argument.startsWith("--base-url="));
const sitemapArgument = argumentsList.find((argument) => argument.startsWith("--sitemap="));
const siteUrl = normalizeBaseUrl(
  baseUrlArgument?.slice("--base-url=".length) ?? process.env.SITE_URL ?? "https://kedr-tomsk.ru",
);
const sitemapPath = resolve(
  sitemapArgument?.slice("--sitemap=".length) ?? join(appRoot, "dist", "public", "sitemap.xml"),
);

function fail(message) {
  throw new Error(message);
}

function normalizeBaseUrl(value) {
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol)) {
    fail(`base URL must use http or https: ${value}`);
  }
  return url.origin;
}

function parseSitemap(xml) {
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  if (locs.length === 0) fail(`sitemap has no <loc> entries: ${sitemapPath}`);
  return [...new Set(locs)];
}

function resolvePublishedUrl(loc) {
  const sitemapUrl = new URL(loc);
  if (sitemapUrl.pathname === "/" && !sitemapUrl.search && !sitemapUrl.hash) {
    return `${siteUrl}/`;
  }
  return new URL(`${sitemapUrl.pathname}${sitemapUrl.search}${sitemapUrl.hash}`, `${siteUrl}/`).toString();
}

async function checkUrl(url) {
  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { Accept: "text/html" },
    });
  } catch (error) {
    return `${url}: request failed: ${error instanceof Error ? error.message : String(error)}`;
  }

  if (response.status !== 200) {
    return `${url}: expected HTTP 200, received ${response.status}`;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("text/html")) {
    return `${url}: expected Content-Type text/html, received ${contentType || "<missing>"}`;
  }

  return null;
}

async function main() {
  const sitemap = await readFile(sitemapPath, "utf8");
  const sitemapUrls = parseSitemap(sitemap);
  const publishedUrls = sitemapUrls.map(resolvePublishedUrl);
  const failures = [];

  for (const url of publishedUrls) {
    const failure = await checkUrl(url);
    if (failure) failures.push(failure);
  }

  if (failures.length > 0) {
    fail(
      `Published route check failed for ${failures.length}/${publishedUrls.length} URL(s):\n${failures
        .map((failure) => `- ${failure}`)
        .join("\n")}`,
    );
  }

  console.log(
    `Published route check passed: ${publishedUrls.length} sitemap URL(s) returned HTTP 200 HTML from ${siteUrl}.`,
  );
}

main().catch((error) => {
  console.error(`Published route check failed: ${error.message}`);
  process.exitCode = 1;
});