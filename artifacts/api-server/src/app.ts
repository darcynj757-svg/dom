import { canonicalHost, legacyRedirects } from "./legacy-redirects";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// 301-редиректы со старых URL и склейка www-зеркала (до раздачи статики).
app.use(canonicalHost);
app.use(legacyRedirects);


// Раздача собранного фронтенда, когда сервер публикуется целиком.
const runtimeDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = [
  path.resolve(runtimeDir, "public"),
  path.resolve(process.cwd(), "artifacts/stroy-doma/dist/public"),
  path.resolve(process.cwd(), "../stroy-doma/dist/public"),
  path.resolve(process.cwd(), "dist/public"),
].find((candidate) => fs.existsSync(path.join(candidate, "index.html")));

if (clientDir) {
  const resolvedClientDir = path.resolve(clientDir);
  const crawlerResourceContentTypes: Record<string, string> = {
    "/robots.txt": "text/plain; charset=utf-8",
    "/sitemap.xml": "application/xml; charset=utf-8",
  };
  const pageFileForPath = (requestPath: string) => {
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(requestPath);
    } catch {
      return null;
    }

    const relativePath = decodedPath === "/"
      ? "index.html"
      : path.join(decodedPath.replace(/^\/+|\/+$/g, ""), "index.html");
    const candidate = path.resolve(resolvedClientDir, relativePath);
    const isInsideClient = candidate === resolvedClientDir ||
      candidate.startsWith(`${resolvedClientDir}${path.sep}`);

    if (!isInsideClient || !fs.existsSync(candidate)) return null;
    return candidate;
  };

  // Serve generated nested pages directly for both /route and /route/.
  // express.static's directory handling can otherwise force a trailing slash
  // that disagrees with sitemap and canonical URLs.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path === "/api" || req.path.startsWith("/api/")) return next();

    const contentType = crawlerResourceContentTypes[req.path];
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const pageFile = pageFileForPath(req.path);
    if (!pageFile) return next();
    return res.sendFile(pageFile);
  });

  const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
  const alwaysRevalidate = /(?:^|\/)(?:sw\.js|registerSW\.js|workbox-[^/]+\.js|manifest\.webmanifest|robots\.txt|sitemap\.xml)$/;
  // Content-addressed output (Vite's /assets/*, the versioned GLB, the Draco
  // decoder, fonts) never changes under its own name, so it can be cached for a
  // year. Without this every cold start re-downloaded the 3D model.
  const immutableAsset = /(?:\/assets\/|\.(?:glb|wasm|woff2?)$|\/draco\/)/;

  app.use(
    express.static(resolvedClientDir, {
      redirect: false,
      setHeaders(res, filePath) {
        const normalized = filePath.split(path.sep).join("/");
        if (normalized.endsWith(".html") || alwaysRevalidate.test(normalized)) {
          res.setHeader("Cache-Control", "no-cache");
          return;
        }
        if (immutableAsset.test(normalized)) {
          res.setHeader("Cache-Control", `public, max-age=${ONE_YEAR_SECONDS}, immutable`);
          return;
        }
        res.setHeader("Cache-Control", "public, max-age=86400");
      },
    }),
  );
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path === "/api" || req.path.startsWith("/api/")) return next();

    const notFoundFile = path.join(resolvedClientDir, "404.html");
    if (fs.existsSync(notFoundFile)) {
      return res.status(404).sendFile(notFoundFile);
    }
    return res.status(404).send("Not found");
  });
}

export default app;
