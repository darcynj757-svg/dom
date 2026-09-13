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
  app.use(express.static(clientDir));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
}

export default app;
