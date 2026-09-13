import { useEffect } from "react";

const SITE_NAME = "Кедр Томск";
const SITE_URL = "https://kedr-tomsk.ru";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

/** Находит или создаёт мета-тег и устанавливает content */
function setMeta(selector: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const match = selector.match(/\[(\w[^=]*)="([^"]+)"\]/);
    if (match) el.setAttribute(match[1], match[2]);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Находит или создаёт link-тег и устанавливает href */
function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(value: unknown) {
  let el = document.querySelector<HTMLScriptElement>(
    'script[data-seo-page-jsonld="true"]',
  );
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.seoPageJsonld = "true";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(value);
}

export function useSeo({
  title,
  description,
  image,
  canonical,
  robots,
}: {
  title: string;
  description?: string;
  /** Абсолютный URL или путь вида /images/… — будет дополнен SITE_URL */
  image?: string;
  /** Канонический путь вида /projects/123 — используется для дублирующихся маршрутов */
  canonical?: string;
  /** Управляет индексацией страницы, например "noindex, nofollow" для 404 */
  robots?: string;
}) {
  useEffect(() => {
    const prevTitle = document.title;

    const fullTitle = title
      ? `${title} — ${SITE_NAME}`
      : `${SITE_NAME} — деревянные дома под ключ в Томске`;

    document.title = fullTitle;

    const ogImage = image
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image}`
      : DEFAULT_OG_IMAGE;

    const canonicalUrl = canonical
      ? `${SITE_URL}${canonical}`
      : `${SITE_URL}${window.location.pathname}`;

    // ── Базовые мета-теги ───────────────────────────────────────────────────
    if (description) setMeta('meta[name="description"]', description);
    setMeta('meta[name="robots"]', robots ?? "index, follow");

    // ── Open Graph ──────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]', fullTitle);
    if (description) setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:url"]', canonicalUrl);

    // ── Twitter Card ────────────────────────────────────────────────────────
    setMeta('meta[name="twitter:title"]', fullTitle);
    if (description) setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);

    // ── Canonical ────────────────────────────────────────────────────────────
    setLink("canonical", canonicalUrl);

    // Static builds already contain this schema in the initial HTML. Keep the
    // same node up to date when the user navigates without a full reload.
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: fullTitle,
      headline: title,
      description,
      url: canonicalUrl,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    });

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, image, canonical, robots]);
}
