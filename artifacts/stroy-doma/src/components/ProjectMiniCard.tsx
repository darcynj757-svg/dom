import { Link } from "wouter";
import type { Project } from "@/data/projects";

/** Компактная карточка проекта для перелинковки (статьи, похожие проекты). */
export function ProjectMiniCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="group h-full rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={project.imageUrl}
            alt={`${project.title} — ${project.area} м², ${project.material.toLowerCase()}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <span className="text-xs uppercase tracking-wider text-secondary font-medium">
            {project.material}
          </span>
          <h3 className="mt-1.5 font-serif text-base font-bold leading-snug group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {project.area} м² · {project.floors} эт.
          </p>
        </div>
      </div>
    </Link>
  );
}
