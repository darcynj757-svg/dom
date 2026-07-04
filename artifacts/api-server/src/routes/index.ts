import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import contactRequestsRouter from "./contact-requests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(contactRequestsRouter);

export default router;
