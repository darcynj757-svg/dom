import { Router, type IRouter, type Request, type Response } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const sendHealth = (_req: Request, res: Response) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
};

// Replit autoscale probes the application mount point by default.
router.get("/", sendHealth);
router.get("/healthz", sendHealth);

export default router;
