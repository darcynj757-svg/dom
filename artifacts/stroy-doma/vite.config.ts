import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  STATIC_SEO_ROUTES,
  SEO_SITE,
  canonicalUrl,
  createSitemapXml,
  isIndexableRoute,
  type StaticSeoRoute,
} from "./src/seo/staticRoutes";

const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function routeUrl(route: StaticSeoRoute) {
  return canonicalUrl(route);
}

function fullTitle(route: StaticSeoRoute) {
  return `${route.title} — ${SEO_SITE.name}`;
}

function staticBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SEO_SITE.name,
    url: SEO_SITE.url,
    logo: `${SEO_SITE.url}/logo-icon.png`,
    image: `${SEO_SITE.url}/opengraph.jpg`,
    telephone: SEO_SITE.phone,
    email: SEO_SITE.email,
    foundingDate: "2001",
    description:
      "Строительство деревянных домов и бань из профилированного бруса и рубленого бревна. Более 200 объектов с 2001 года.",
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_SITE.address.street,
      addressLocality: SEO_SITE.address.city,
      addressRegion: SEO_SITE.address.region,
      addressCountry: SEO_SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SEO_SITE.geo.lat,
      longitude: SEO_SITE.geo.lng,
    },
  };
}

function staticPageSchema(route: StaticSeoRoute, canonicalUrl: string) {
  const schema =
    route.kind === "Article"
      ? {
          "@type": "Article",
          headline: route.h1,
          description: route.description,
          image: route.image ? `${SEO_SITE.url}${route.image}` : undefined,
          author: { "@type": "Organization", name: SEO_SITE.name },
          publisher: { "@type": "Organization", name: SEO_SITE.name },
          mainEntityOfPage: canonicalUrl,
        }
      : {
          "@type": "WebPage",
          name: fullTitle(route),
          headline: route.h1,
          description: route.description,
          mainEntityOfPage: canonicalUrl,
        };

  return {
    "@context": "https://schema.org",
    ...schema,
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", name: SEO_SITE.name, url: SEO_SITE.url },
  };
}

function jsonLdScript(value: unknown, dataAttribute: string) {
  const json = JSON.stringify(value).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json" ${dataAttribute}>${json}</script>`;
}

function seoHead(route: StaticSeoRoute) {
  const canonicalUrl = routeUrl(route);
  const title = fullTitle(route);
  const image = route.image ? `${SEO_SITE.url}${route.image}` : `${SEO_SITE.url}/opengraph.jpg`;

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}">`,
    `<meta name="robots" content="${isIndexableRoute(route) ? "index, follow" : "noindex, follow"}">`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(route.description)}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:type" content="${route.kind === "Article" ? "article" : "website"}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
    jsonLdScript(staticBusinessSchema(), 'data-seo-business-jsonld="true"'),
    jsonLdScript(staticPageSchema(route, canonicalUrl), 'data-seo-page-jsonld="true"'),
  ].join("\n    ");
}

function seoBody(route: StaticSeoRoute) {
  const image = route.image
    ? `<img src="${escapeHtml(route.image)}" alt="${escapeHtml(route.h1)}">`
    : "";
  return `<div id="seo-prerender"><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.description)}</p>${image}</div>`;
}

function staticSeoPages() {
  return {
    name: "static-seo-pages",
    apply: "build" as const,
    enforce: "post" as const,
    async writeBundle() {
      const outputDir = path.resolve(import.meta.dirname, "dist/public");
      const template = await readFile(path.join(outputDir, "index.html"), "utf8");

      for (const route of STATIC_SEO_ROUTES) {
        const html = template
          .replace(/<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/, seoHead(route))
          .replace(/<!-- SEO_BODY_START -->[\s\S]*?<!-- SEO_BODY_END -->/, seoBody(route));
        const routeDir =
          route.path === "/"
            ? outputDir
            : path.join(outputDir, route.path.replace(/^\/|\/$/g, ""));
        await mkdir(routeDir, { recursive: true });
        await writeFile(path.join(routeDir, "index.html"), html);
      }

      await writeFile(path.join(outputDir, "sitemap.xml"), createSitemapXml(), "utf8");
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    staticSeoPages(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        // Cache static assets (JS, CSS, fonts, images) with stale-while-revalidate
        globPatterns: ["**/*.{js,css,woff2,webp,png,svg}"],
        // Don't pre-cache the large GLB — it's fetched on demand
        globIgnores: ["**/*.{glb,mp4,wasm}"],
        runtimeCaching: [
          {
            urlPattern: /\.(?:glb|mp4)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "large-assets",
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: "Kedr Tomsk — Строительство домов и бань",
        short_name: "Kedr Tomsk",
        description: "Строительство деревянных домов и бань из профилированного бруса",
        theme_color: "#1c1a17",
        background_color: "#1c1a17",
        display: "standalone",
        icons: [
          { src: "/logo-icon.png", sizes: "192x192", type: "image/png" },
          { src: "/logo-icon.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom", "three"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Increase chunk warning threshold for three.js which is intentionally large
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — always needed
          "vendor-react": ["react", "react-dom"],
          // Three.js ecosystem — lazy-loaded with 3D pages
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          // Animation library
          "vendor-motion": ["framer-motion"],
          // UI / icon libraries
          "vendor-ui": ["lucide-react"],
          // Routing + data fetching
          "vendor-routing": ["wouter", "@tanstack/react-query"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "three"],
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    headers(ctx) {
      // Never cache HTML — always serve fresh
      if (ctx.filename?.endsWith(".html")) {
        return { "Cache-Control": "no-store" };
      }
      // Hashed assets can be cached forever
      return { "Cache-Control": "public, max-age=31536000, immutable" };
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
