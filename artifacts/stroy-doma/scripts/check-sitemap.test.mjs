import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createServer } from "vite";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptsDir, "..");

async function loadSeoModules() {
  const vite = await createServer({
    root: appRoot,
    configFile: false,
    appType: "custom",
    optimizeDeps: { noDiscovery: true },
  });

  try {
    const [routes, projects, articles] = await Promise.all([
      vite.ssrLoadModule("/src/seo/staticRoutes.ts"),
      vite.ssrLoadModule("/src/data/projects.ts"),
      vite.ssrLoadModule("/src/data/articles-meta.ts"),
    ]);

    return { routes, projects, articles };
  } finally {
    await vite.close();
  }
}

function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const { routes, projects, articles } = await loadSeoModules();
const {
  SEO_SITE,
  STATIC_SEO_ROUTES,
  SITEMAP_ROUTES,
  canonicalPath,
  canonicalUrl,
  createSitemapXml,
} = routes;
const sitemapUrls = sitemapLocs(createSitemapXml());

test("sitemap includes every project and article route", () => {
  const expectedProjectUrls = projects.PROJECTS.map(
    (project) => `${SEO_SITE.url}/projects/${project.id}`,
  );
  const expectedArticleUrls = articles.ARTICLES_META.map(
    (article) => `${SEO_SITE.url}/articles/${article.slug}`,
  );
  const missingUrls = [...expectedProjectUrls, ...expectedArticleUrls].filter(
    (url) => !sitemapUrls.includes(url),
  );

  assert.deepEqual(
    missingUrls,
    [],
    `Sitemap is missing expected URLs: ${missingUrls.join(", ")}`,
  );
});

test("sitemap contains unique canonical URLs and excludes aliases", () => {
  assert.equal(
    new Set(sitemapUrls).size,
    sitemapUrls.length,
    "Sitemap contains duplicate URLs",
  );
  assert.deepEqual(
    sitemapUrls,
    SITEMAP_ROUTES.map(canonicalUrl),
    "Sitemap XML does not match the canonical SEO route registry",
  );

  const nonCanonicalRoutes = SITEMAP_ROUTES.filter(
    (route) => canonicalPath(route) !== route.path,
  );
  assert.deepEqual(
    nonCanonicalRoutes,
    [],
    "Sitemap registry contains non-canonical route aliases",
  );

  const aliasesInSitemap = STATIC_SEO_ROUTES.filter(
    (route) =>
      canonicalPath(route) !== route.path &&
      sitemapUrls.includes(`${SEO_SITE.url}${route.path}`),
  );
  assert.deepEqual(
    aliasesInSitemap,
    [],
    "Sitemap contains non-canonical route aliases",
  );
});

test("static publishing does not rewrite nested routes to the homepage", async () => {
  const artifactConfig = await readFile(
    resolve(appRoot, ".replit-artifact", "artifact.toml"),
    "utf8",
  );

  assert.doesNotMatch(
    artifactConfig,
    /\[\[services\.production\.rewrites\]\]\s*from = "\/\*"\s*to = "\/index\.html"/,
    "static publishing must serve nested index.html files instead of rewriting every path to the homepage",
  );
});