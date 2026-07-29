import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PROJECTS } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Ruler, Layers, BedDouble, FileText, ArrowUpDown } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";


const FILTER_OPTIONS = [
  { label: "Все проекты", value: "all" },
  { label: "Дома", value: "house" },
  { label: "Бани", value: "bath" },
  { label: "Профилированный брус", value: "Профилированный брус" },
  { label: "Брус из кругляка", value: "кругляк" },
];

const SORT_OPTIONS = [
  { label: "По умолчанию", value: "default" },
  { label: "Площадь: меньше", value: "area_asc" },
  { label: "Площадь: больше", value: "area_desc" },
  { label: "Цена: дешевле", value: "price_asc" },
  { label: "Цена: дороже", value: "price_desc" },
];

const MIN_AREA = Math.min(...PROJECTS.map((p) => p.area));
const MAX_AREA = Math.max(...PROJECTS.map((p) => p.area));

function parsePrice(s?: string): number {
  if (!s) return 0;
  return parseInt(s.replace(/\D/g, ""), 10) || 0;
}

export default function Projects() {
  const { sectionRef, y } = useHeroParallax();
  useSeo({
    title: "Проекты домов и бань",
    description: "Каталог проектов деревянных домов и бань от Кедр Томск. Профилированный брус, рубленое бревно. Площадь от 30 до 350 м². Бесплатный проект при заказе.",
  });

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [areaRange, setAreaRange] = useState<[number, number]>([MIN_AREA, MAX_AREA]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = PROJECTS.filter((p) => {
      // Category filter
      if (activeFilter === "house" && p.category !== "house") return false;
      if (activeFilter === "bath" && p.category !== "bath") return false;
      if (activeFilter === "кругляк" &&
        !p.material.toLowerCase().includes("бревно") &&
        !p.material.toLowerCase().includes("кругляк") &&
        p.material !== "Брус") return false;
      if (activeFilter === "Профилированный брус" &&
        !p.material.includes("Профилированный брус")) return false;
      // Area range filter
      if (p.area < areaRange[0] || p.area > areaRange[1]) return false;
      return true;
    });

    // Sort
    if (sortBy === "area_asc") list = [...list].sort((a, b) => a.area - b.area);
    if (sortBy === "area_desc") list = [...list].sort((a, b) => b.area - a.area);
    if (sortBy === "price_asc") list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sortBy === "price_desc") list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return list;
  }, [activeFilter, sortBy, areaRange]);

  const isMobile = useIsMobile();
  return (
    <div>
      {/* Hero */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative overflow-hidden border-b border-border py-20 md:py-28">
        {/* Background video */}
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[15%] h-[130%]">
          {isMobile ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url(/posters/projects-hero.webp)" }}
            />
          ) : (
            <video
              src={`${import.meta.env.BASE_URL}videos/projects-hero.mp4`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/posters/projects-hero.webp"
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Text content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium">
              Наши проекты
            </span>
            <h1 className="mt-3 font-serif text-2xl md:text-4xl lg:text-5xl font-black text-white">
              Проекты деревянных домов и бань
            </h1>
            <p className="mt-6 text-white/80 leading-relaxed text-lg">
              Компания «Кедр-Томск» выполняет строительство деревянных домов и
              бань по типовым и индивидуальным проектам любой комплектации.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/20 text-sm text-white">
              💡 <strong>При заказе строительства</strong> рубленного дома или
              дома из профилированного бруса — <strong>проект бесплатно!</strong>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] z-30 bg-background/90 backdrop-blur-md border-b border-border py-3">
        <div className="container mx-auto px-4 md:px-6">
          {/* Row 1: category filters + toggle + sort */}
          <div className="flex flex-wrap items-center gap-2">
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

            <div className="flex-1" />

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-muted rounded-full px-3 py-1.5 border-none outline-none cursor-pointer font-medium text-foreground/80"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Expand area filter */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                showFilters || areaRange[0] !== MIN_AREA || areaRange[1] !== MAX_AREA
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted text-foreground/80"
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              Площадь
              {(areaRange[0] !== MIN_AREA || areaRange[1] !== MAX_AREA) && (
                <span className="text-xs">
                  {areaRange[0]}–{areaRange[1]} м²
                </span>
              )}
            </button>
          </div>

          {/* Row 2: area range (collapsible) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1 flex items-center gap-4">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {areaRange[0]} м²
                  </span>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="relative h-5 flex items-center">
                      {/* Track */}
                      <div className="absolute left-0 right-0 h-1.5 bg-muted rounded-full" />
                      {/* Active range fill */}
                      <div
                        className="absolute h-1.5 bg-primary rounded-full pointer-events-none"
                        style={{
                          left: `${((areaRange[0] - MIN_AREA) / (MAX_AREA - MIN_AREA)) * 100}%`,
                          right: `${100 - ((areaRange[1] - MIN_AREA) / (MAX_AREA - MIN_AREA)) * 100}%`,
                        }}
                      />
                      {/* Min thumb */}
                      <input
                        type="range"
                        min={MIN_AREA}
                        max={MAX_AREA}
                        step={5}
                        value={areaRange[0]}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v < areaRange[1]) setAreaRange([v, areaRange[1]]);
                        }}
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                        style={{ zIndex: areaRange[0] > MAX_AREA - 20 ? 5 : 3 }}
                      />
                      {/* Max thumb */}
                      <input
                        type="range"
                        min={MIN_AREA}
                        max={MAX_AREA}
                        step={5}
                        value={areaRange[1]}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v > areaRange[0]) setAreaRange([areaRange[0], v]);
                        }}
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                        style={{ zIndex: 4 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {areaRange[1]} м²
                  </span>
                  {(areaRange[0] !== MIN_AREA || areaRange[1] !== MAX_AREA) && (
                    <button
                      onClick={() => setAreaRange([MIN_AREA, MAX_AREA])}
                      className="text-xs text-primary hover:text-primary/70 transition-colors whitespace-nowrap"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {project.featured && (
                          <Badge className="rounded-full">Популярный</Badge>
                        )}
                      </div>
                      {project.plans && project.plans.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute top-3 right-3 rounded-full gap-1"
                        >
                          <FileText className="w-3 h-3" /> Есть планировка
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs uppercase tracking-wider text-secondary font-medium">
                        {project.material}
                      </span>
                      <h3 className="mt-2 font-serif text-xl font-bold">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Ruler className="w-3.5 h-3.5" /> {project.area} м²
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" /> {project.floors} эт.
                        </span>
                        {project.bedrooms && (
                          <span className="inline-flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5" /> {project.bedrooms} спален
                          </span>
                        )}
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-medium text-primary">
                          {project.price}
                        </span>
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
