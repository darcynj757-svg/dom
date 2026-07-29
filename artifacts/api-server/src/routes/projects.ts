import { Router, type IRouter } from "express";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  ListProjectsQueryParams,
  ListProjectsResponse,
  GetProjectFiltersResponse,
  GetProjectParams,
  GetProjectResponse,
  GetCompanyStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, material, minArea, maxArea, minPrice, maxPrice, floors, featured } =
    parsed.data;

  const conditions = [];
  if (category != null) conditions.push(eq(projectsTable.category, category));
  if (material != null) conditions.push(eq(projectsTable.material, material));
  if (minArea != null) conditions.push(gte(projectsTable.area, minArea));
  if (maxArea != null) conditions.push(lte(projectsTable.area, maxArea));
  if (minPrice != null) conditions.push(gte(projectsTable.price, minPrice));
  if (maxPrice != null) conditions.push(lte(projectsTable.price, maxPrice));
  if (floors != null) conditions.push(eq(projectsTable.floors, floors));
  if (featured != null) conditions.push(eq(projectsTable.featured, featured));

  const projects = await db
    .select()
    .from(projectsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projectsTable.createdAt));

  res.json(ListProjectsResponse.parse(projects));
});

router.get("/projects/filters", async (_req, res): Promise<void> => {
  const [row] = await db
    .select({
      minArea: sql<number>`min(${projectsTable.area})`,
      maxArea: sql<number>`max(${projectsTable.area})`,
      minPrice: sql<number>`min(${projectsTable.price})`,
      maxPrice: sql<number>`max(${projectsTable.price})`,
      maxFloors: sql<number>`max(${projectsTable.floors})`,
    })
    .from(projectsTable);

  const materialsRows = await db
    .selectDistinct({ material: projectsTable.material })
    .from(projectsTable);

  res.json(
    GetProjectFiltersResponse.parse({
      materials: materialsRows.map((r) => r.material),
      minArea: Number(row?.minArea ?? 0),
      maxArea: Number(row?.maxArea ?? 0),
      minPrice: Number(row?.minPrice ?? 0),
      maxPrice: Number(row?.maxPrice ?? 0),
      maxFloors: Number(row?.maxFloors ?? 0),
    }),
  );
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(GetProjectResponse.parse(project));
});

router.get("/stats", async (_req, res): Promise<void> => {
  const [row] = await db
    .select({ projectsBuilt: sql<number>`count(*)` })
    .from(projectsTable);

  res.json(
    GetCompanyStatsResponse.parse({
      yearsOnMarket: 15,
      projectsBuilt: Number(row?.projectsBuilt ?? 0),
      happyClients: 420,
      teamSize: 38,
    }),
  );
});

export default router;
