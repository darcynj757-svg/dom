import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { Badge } from "@/components/ui/badge";

const FILTER_OPTIONS = [
  { label: "Все проекты", value: "all" },
  { label: "Дома", value: "house" },
  { label: "Профилированный брус", value: "Профилированный брус" },
  { label: "Рубленное бревно", value: "Рубленное бревно" },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = PROJECTS.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "house") return p.category === "house";
    return p.material.includes(activeFilter);
  });

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Наши проекты
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
              Проекты деревянных домов
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Компания «Кедр-Томск» выполняет строительство деревянных домов по
              типовым и индивидуальным проектам любой комплектации.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-muted/60 border border-border text-sm">
              💡 <strong>При заказе строительства</strong> рубленного дома или
              дома из профилированного бруса — <strong>проект бесплатно!</strong>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] z-30 bg-background/90 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="group rounded-2xl overflow-hidden bg-card border border-border cursor-pointer h-full flex flex-col hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden relative bg-muted">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {project.featured && (
                        <Badge className="absolute top-3 left-3 rounded-full">
                          Популярный
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs uppercase tracking-wider text-secondary font-medium">
                        {project.material}
                      </span>
                      <h3 className="mt-2 font-serif text-xl font-medium">
                        {project.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{project.area} м²</span>
                        <span>{project.floors} эт.</span>
                        {project.bedrooms && (
                          <span>{project.bedrooms} спален</span>
                        )}
                      </div>
                      <div className="mt-auto pt-4 font-medium text-primary">
                        {project.price}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
