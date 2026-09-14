#!/usr/bin/env node
/**
 * Generates static HTML for the public routes after the client build.
 *
 * The app remains a Vite SPA in the browser, while crawlers and social
 * previews receive route-specific content, metadata and structured data
 * before JavaScript runs.
 */
import { createServer } from "vite";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const distRoot = join(appRoot, "dist", "public");
const siteUrl = "https://kedr-tomsk.ru";
const siteName = "Кедр Томск";
const defaultImage = `${siteUrl}/opengraph.jpg`;

function rewriteBuiltAssetUrls(html, builtAssets) {
  return html.replace(
    /(?:\/src\/assets\/|\/@fs\/[^"'?]*\/(?:attached_assets|assets)\/)([^"'?]+)(?:\?[^"']*)?/g,
    (match, sourcePath) => {
      const filename = sourcePath.split("/").pop();
      if (!filename) return match;
      const extensionIndex = filename.lastIndexOf(".");
      const stem = extensionIndex === -1 ? filename : filename.slice(0, extensionIndex);
      const extension = extensionIndex === -1 ? "" : filename.slice(extensionIndex);
      const builtName = builtAssets.find(
        (asset) =>
          asset === filename ||
          (asset.startsWith(`${stem}-`) && asset.endsWith(extension)),
      );
      return builtName ? `/assets/${builtName}` : match;
    },
  );
}

const breadcrumbLabels = {
  about: "О компании",
  services: "Строительство",
  uslugi: "Услуги",
  production: "Производство",
  projects: "Проекты",
  gallery: "Галерея",
  articles: "Статьи",
  contacts: "Контакты",
  terms: "Условия",
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setMeta(html, attribute, key, value) {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${escapeRegExp(key)}["'][^>]*>`,
    "i",
  );
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

function setLink(html, rel, href) {
  const tag = `<link rel="${rel}" href="${escapeHtml(href)}" />`;
  const pattern = new RegExp(
    `<link\\s+[^>]*rel=["']${escapeRegExp(rel)}["'][^>]*>`,
    "i",
  );
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

function routeFromSitemap(xml) {
  return [
    ...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g),
  ].map((match) => new URL(match[1]).pathname);
}

function getSeo(pathname, staticRoutes) {
  const route = staticRoutes.find((candidate) => candidate.path === pathname);
  if (route) return route;
  return {
    title: "Страница не найдена",
    description: "Запрошенная страница не найдена.",
    robots: "noindex, nofollow",
  };
}

function getBreadcrumbSchema(pathname, seo) {
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: `${siteUrl}/`,
    },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label =
      breadcrumbLabels[segment] ??
      (pathname.startsWith("/projects/") ? seo.title.split(" — ")[0] : null) ??
      (pathname.startsWith("/articles/") ? seo.title : null) ??
      segment;

    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: label,
      item: `${siteUrl}${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function injectSeo(template, pathname, appHtml, seo) {
  const canonicalPath = seo.canonical ?? pathname;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const fullTitle = `${seo.title} — ${siteName}`;
  const image = seo.image
    ? seo.image.startsWith("http")
      ? seo.image
      : `${siteUrl}${seo.image}`
    : defaultImage;

  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);
  const seoBodyMarker = /<!-- SEO_BODY_START -->[\s\S]*?<!-- SEO_BODY_END -->/i;
  const seoFallback = /<div id="seo-prerender">[\s\S]*?<\/div>/i;
  if (seoBodyMarker.test(html)) {
    html = html.replace(seoBodyMarker, appHtml);
  } else if (seoFallback.test(html)) {
    html = html.replace(seoFallback, appHtml);
  } else {
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  }

  html = setMeta(html, "name", "description", seo.description ?? "");
  html = setMeta(html, "name", "robots", seo.robots ?? "index, follow");
  html = setMeta(html, "property", "og:title", fullTitle);
  html = setMeta(html, "property", "og:description", seo.description ?? "");
  html = setMeta(html, "property", "og:type", pathname.startsWith("/articles/") ? "article" : "website");
  html = setMeta(html, "property", "og:url", canonicalUrl);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "name", "twitter:title", fullTitle);
  html = setMeta(html, "name", "twitter:description", seo.description ?? "");
  html = setMeta(html, "name", "twitter:image", image);
  html = setLink(html, "canonical", canonicalUrl);

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      inLanguage: "ru-RU",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/logo-icon.png`,
    },
  ];
  const breadcrumb = getBreadcrumbSchema(pathname, seo);
  if (breadcrumb) graph.push(breadcrumb);
  const schema = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replaceAll("<", "\\u003c")}</script>`;
  html = html.replace("</head>", `    ${schema}\n  </head>`);

  return html;
}

const sitemap = await readFile(join(distRoot, "sitemap.xml"), "utf8");
const template = await readFile(join(distRoot, "index.html"), "utf8");
const builtAssets = await readdir(join(distRoot, "assets"));

const server = await createServer({
  configFile: join(appRoot, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const entry = await server.ssrLoadModule("/src/entry-server.tsx");
  const staticRoutesModule = await server.ssrLoadModule("/src/seo/staticRoutes.ts");
  const routes = [...new Set(routeFromSitemap(sitemap))];

  for (const pathname of routes) {
    const seo = getSeo(pathname, staticRoutesModule.STATIC_SEO_ROUTES);
    const appHtml = rewriteBuiltAssetUrls(await entry.render(pathname), builtAssets);
    const output = injectSeo(template, pathname, appHtml, seo);
    const outputPath =
      pathname === "/" ? join(distRoot, "index.html") : join(distRoot, pathname.slice(1), "index.html");

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, output, "utf8");
    console.log(`prerendered ${pathname}`);
  }

  console.log(`Generated ${routes.length} static route pages.`);
} finally {
  await server.close();
}