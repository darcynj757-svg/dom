import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { resolve } from "node:path";
import { dirname } from "node:path";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createServer } from "vite";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptsDir, "..");
const sitemapValidatorPath = resolve(scriptsDir, "check-sitemap.mjs");
const execFileAsync = promisify(execFile);

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
  isAliasRoute,
  isIndexableRoute,
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

test("aliases stay available but are explicitly excluded from indexing", () => {
  const aliases = STATIC_SEO_ROUTES.filter(isAliasRoute);

  assert.deepEqual(
    aliases.map((route) => route.path).sort(),
    ["/uslugi"],
  );
  assert.ok(
    aliases.every(
      (route) =>
        route.indexable === false &&
        route.sitemap === false &&
        !isIndexableRoute(route) &&
        sitemapUrls.includes(`${SEO_SITE.url}${canonicalPath(route)}`),
    ),
    "Every alias must be noindex, excluded from sitemap, and point to a sitemap-listed canonical route",
  );
});

test("every sitemap URL matches the canonical link on its generated page", async () => {
  const outputRoot = await mkdtemp(join(resolve(appRoot, "node_modules"), "sitemap-canonical-"));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kedr-tomsk.ru/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://kedr-tomsk.ru/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;
  const page = (canonical, name) => `<!doctype html>
<html><head><title>${name}</title>
<meta name="description" content="${name} description">
<link rel="canonical" href="${canonical}">
</head><body><h1>Heading</h1></body></html>`;

  try {
    await mkdir(join(outputRoot, "about"), { recursive: true });
    await writeFile(join(outputRoot, "sitemap.xml"), sitemap);
    await writeFile(
      join(outputRoot, "index.html"),
      page("https://kedr-tomsk.ru/", "Home"),
    );
    await writeFile(
      join(outputRoot, "about", "index.html"),
      page("https://kedr-tomsk.ru/about", "About"),
    );

    const validResult = await execFileAsync(
      process.execPath,
      [sitemapValidatorPath, join(outputRoot, "sitemap.xml")],
      { encoding: "utf8" },
    );
    assert.match(validResult.stdout, /Sitemap validation passed for 2 unique route/);

    await writeFile(
      join(outputRoot, "about", "index.html"),
      page("https://kedr-tomsk.ru/services", "About"),
    );
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [sitemapValidatorPath, join(outputRoot, "sitemap.xml")],
        { encoding: "utf8" },
      ),
      (error) => {
        const output = `${error.stdout}\n${error.stderr}`;
        assert.match(
          output,
          /sitemap URL https:\/\/kedr-tomsk\.ru\/about does not match canonical link https:\/\/kedr-tomsk\.ru\/services/,
        );
        return true;
      },
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
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