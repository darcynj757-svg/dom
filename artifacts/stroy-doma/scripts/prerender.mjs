#!/usr/bin/env node
/**
 * Generates static HTML for the public routes after the client build.
 *
 * The app remains a Vite SPA in the browser, while crawlers and social
 * previews receive route-specific content, metadata and structured data
 * before JavaScript runs.
 */
import { createServer } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const distRoot = join(appRoot, "dist", "public");
const siteUrl = "https://kedr-tomsk.ru";
const siteName = "Кедр Томск";
const defaultImage = `${siteUrl}/opengraph.jpg`;

const staticSeo = {
  "/": {
    title: "Деревянные дома и бани под ключ в Томске",
    description:
      "Кедр Томск — строительство деревянных домов из профилированного бруса и рубленого бревна с 2001 года. Более 200 объектов по всей России. Бесплатный проект при заказе.",
  },
  "/about": {
    title: "О компании",
    description:
      "Кедр Томск — строим деревянные дома с 2001 года. Более 200 объектов, собственное производство профилированного бруса в Томске, бригады опытных плотников.",
  },
  "/contacts": {
    title: "Контакты",
    description:
      "Свяжитесь с Кедр Томск: +7 (3822) 33-44-39, г. Томск, мкр. Черемошники. Оставьте заявку на строительство деревянного дома.",
  },
  "/services": {
    title: "Услуги",
    description:
      "Полный цикл строительства деревянных домов и бань в Томске: проектирование, фундамент, монтаж сруба, отделка под ключ. Кедр Томск с 2001 года.",
    canonical: "/services",
  },
  "/uslugi": {
    title: "Услуги",
    description:
      "Полный цикл строительства деревянных домов и бань в Томске: проектирование, фундамент, монтаж сруба, отделка под ключ. Кедр Томск с 2001 года.",
    canonical: "/services",
  },
  "/services/profilirovanny-brus": {
    title: "Строительство домов из профилированного бруса в Томске",
    description:
      "Строим дома из профилированного бруса под ключ в Томске и по России. Проектирование, производство, доставка и сборка деревянного дома.",
  },
  "/services/rublenye-doma": {
    title: "Строительство рубленых домов в Томске",
    description:
      "Строительство рубленых домов из отборного бревна под ключ. Ручная рубка, проектирование, доставка и сборка домов в Томске и по России.",
  },
  "/production": {
    title: "Производство",
    description:
      "Собственное производство профилированного бруса, столярных изделий и пиломатериала в Томске. Финский 4-х сторонний станок, до 500 м³ в месяц.",
  },
  "/production/profilirovanny-brus": {
    title: "Производство профилированного бруса",
    description:
      "Собственное производство профилированного бруса в Томске. Кедр, сосна, лиственница. Объём до 500 м³ в месяц. Немецкий профиль, финский станок.",
    canonical: "/production/profilirovanny-brus",
  },
  "/production/stolyarnye-izdeliya": {
    title: "Столярные изделия из дерева в Томске",
    description:
      "Изготавливаем деревянные окна, двери, лестницы и мебель на заказ в Томске. Столярное производство из натуральной древесины.",
  },
  "/production/pilomaterial": {
    title: "Пиломатериалы собственного производства в Томске",
    description:
      "Производим обрезной и необрезной пиломатериал, брус и другие материалы для строительства деревянных домов. Собственное производство в Томске.",
  },
  "/projects": {
    title: "Проекты домов и бань",
    description:
      "Каталог проектов деревянных домов и бань от Кедр Томск. Профилированный брус, рубленое бревно. Площадь от 30 до 350 м². Бесплатный проект при заказе.",
  },
  "/gallery": {
    title: "Галерея",
    description:
      "Фото и видео деревянных домов, бань и беседок, построенных компанией Кедр Томск в Томске и по всей России.",
  },
  "/articles": {
    title: "Статьи и публикации",
    description:
      "Полезные статьи о строительстве деревянных домов и бань от специалистов Кедр Томск: выбор материала, технологии, советы по эксплуатации.",
  },
  "/terms": {
    title: "Условия строительства и оплаты",
    description:
      "Условия проектирования, строительства, оплаты и гарантийного обслуживания деревянных домов и бань компании «Кедр Томск».",
  },
};

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

function getSeo(pathname, projects, articles) {
  if (staticSeo[pathname]) return staticSeo[pathname];

  const projectMatch = pathname.match(/^\/projects\/(\d+)$/);
  if (projectMatch) {
    const project = projects.find((item) => item.id === Number(projectMatch[1]));
    if (project) {
      return {
        title: `${project.title} — ${project.area} м²`,
        description: `${project.title}: ${project.area} м², ${project.floors} эт., ${project.material}. ${project.description.slice(0, 120)}`,
        image: project.imageUrl,
      };
    }
    return { title: "Проект не найден", robots: "noindex, nofollow" };
  }

  const articleMatch = pathname.match(/^\/articles\/(.+)$/);
  if (articleMatch) {
    const article = articles.find((item) => item.slug === articleMatch[1]);
    if (article) {
      return {
        title: article.title,
        description: article.excerpt ?? article.title,
        image: article.image,
      };
    }
    return { title: "Статья не найдена", robots: "noindex, nofollow" };
  }

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

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

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

const sitemap = await readFile(join(appRoot, "public", "sitemap.xml"), "utf8");
const template = await readFile(join(distRoot, "index.html"), "utf8");

const server = await createServer({
  configFile: join(appRoot, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const entry = await server.ssrLoadModule("/src/entry-server.tsx");
  const projectsModule = await server.ssrLoadModule("/src/data/projects.ts");
  const articlesModule = await server.ssrLoadModule("/src/data/articles-meta.ts");
  const routes = [...new Set(routeFromSitemap(sitemap))];

  for (const pathname of routes) {
    const seo = getSeo(pathname, projectsModule.PROJECTS, articlesModule.ARTICLES_META);
    const appHtml = await entry.render(pathname);
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