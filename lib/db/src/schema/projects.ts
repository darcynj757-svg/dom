import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category", { enum: ["house", "bathhouse"] }).notNull(),
  material: text("material").notNull(),
  area: numeric("area", { mode: "number" }).notNull(),
  floors: integer("floors").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  price: numeric("price", { mode: "number" }).notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  imageUrl: text("image_url").notNull(),
  gallery: text("gallery").array().notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
