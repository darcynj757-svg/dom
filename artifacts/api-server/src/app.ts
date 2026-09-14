import fs from "node:fs";
import path from "node:path";
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


// Раздача собранного фронтенда, когда сервер публикуется целиком.
const clientDir = [
  path.resolve(process.cwd(), "artifacts/stroy-doma/dist/public"),
  path.resolve(process.cwd(), "../stroy-doma/dist/public"),
  path.resolve(process.cwd(), "dist/public"),
].find((candidate) => fs.existsSync(path.join(candidate, "index.html")));

if (clientDir) {
  const resolvedClientDir = path.resolve(clientDir);
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
  // express.static's default directory redirect would otherwise force a
  // trailing slash that disagrees with sitemap and canonical URLs.
  app.get(/^\/(?!api\/).*/, (req, res, next) => {
    const pageFile = pageFileForPath(req.path);
    if (!pageFile) return next();
    return res.sendFile(pageFile);
  });

  app.use(express.static(resolvedClientDir, { redirect: false }));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(resolvedClientDir, "index.html"));
  });
}

export default app;
