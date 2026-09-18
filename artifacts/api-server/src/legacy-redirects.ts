import type { NextFunction, Request, Response } from "express";

/**
 * 301-редиректы со старой структуры сайта (до редизайна) на новую.
 * Старые URL остаются в индексе Яндекса и Google и собирают внешние ссылки —
 * без редиректов этот вес теряется на 404.
 */
const EXACT_REDIRECTS: Record<string, string> = {
  "/galereya": "/gallery",
  "/fotogalereya-proektov": "/gallery",
  "/stroitelstvo-domov-pod-klyuch": "/services",
  "/stroitelstvo-domov-pod-klyuch/doma-iz-brusa": "/services/profilirovanny-brus",
  "/stroitelstvo-domov-pod-klyuch/stroitelstvo-rublennyix-domov":
    "/services/rublenye-doma",
  "/zagorodnoe-stroitelstvo-derevyannyh-domov": "/services",
  "/zagorodnoe-stroitelstvo-derevyannyh-domov/stroitelstvo-domov-iz-profilirovannogo-brusa":
    "/services/profilirovanny-brus",
  "/zagorodnoe-stroitelstvo-derevyannyh-domov/stroitelstvo-rublennyix-domov":
    "/services/rublenye-doma",
  "/kontakty": "/contacts",
  "/o-kompanii": "/about",
  "/o-nas": "/about",
  "/proekty": "/projects",
  "/stati": "/articles",
  "/novosti": "/articles",
  "/index.php": "/",
  "/index.html": "/",
};

const PREFIX_REDIRECTS: Array<[string, string]> = [
  ["/galereya/", "/gallery"],
  ["/fotogalereya-proektov/", "/gallery"],
  ["/zagorodnoe-stroitelstvo-derevyannyh-domov/", "/services"],
  ["/stroitelstvo-domov-pod-klyuch/", "/services"],
];

function decodePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function legacyRedirects(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  const pathname = decodePath(req.path);
  if (pathname === "/api" || pathname.startsWith("/api/")) return next();

  const questionMark = req.originalUrl.indexOf("?");
  const query = questionMark === -1 ? "" : req.originalUrl.slice(questionMark);

  const redirect = (target: string): void => {
    res.set("Cache-Control", "public, max-age=3600");
    res.redirect(301, `${target}${query}`);
  };

  if (pathname.startsWith("/stati/")) {
    const slug = pathname.slice("/stati/".length).replace(/\/+$/, "");
    return redirect(slug ? `/articles/${slug}` : "/articles");
  }

  const exact = EXACT_REDIRECTS[pathname];
  if (exact) return redirect(exact);

  for (const [from, to] of PREFIX_REDIRECTS) {
    if (pathname.startsWith(from)) return redirect(to);
  }

  return next();
}

/** Склейка зеркал: www.kedr-tomsk.ru -> kedr-tomsk.ru (главное зеркало в Яндексе). */
export function canonicalHost(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const host = req.headers.host;
  if (!host || !host.toLowerCase().startsWith("www.")) return next();
  res.set("Cache-Control", "public, max-age=3600");
  return res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
}
