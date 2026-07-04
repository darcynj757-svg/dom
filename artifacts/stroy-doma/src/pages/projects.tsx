import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProjectFilters, useListProjects } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { assetUrl } from "@/lib/utils";

type Category = "house" | "bathhouse" | "all";

export default function Projects() {
  const { data: filters } = useGetProjectFilters();
  const [category, setCategory] = useState<Category>("all");
  const [material, setMaterial] = useState<string>("all");
  const [floors, setFloors] = useState<string>("all");
  const [areaRange, setAreaRange] = useState<[number, number] | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  const effectiveAreaRange = areaRange ?? [filters?.minArea ?? 0, filters?.maxArea ?? 500];
  const effectivePriceRange = priceRange ?? [filters?.minPrice ?? 0, filters?.maxPrice ?? 10000000];

  const { data: projects, isLoading } = useListProjects({
    category: category === "all" ? undefined : category,
    material: material === "all" ? undefined : material,
    floors: floors === "all" ? undefined : Number(floors),
    minArea: effectiveAreaRange[0],
    maxArea: effectiveAreaRange[1],
    minPrice: effectivePriceRange[0],
    maxPrice: effectivePriceRange[1],
  });

  const hasActiveFilters =
    category !== "all" || material !== "all" || floors !== "all" || areaRange !== null || priceRange !== null;

  function resetFilters() {
    setCategory("all");
    setMaterial("all");
    setFloors("all");
    setAreaRange(null);
    setPriceRange(null);
  }

  const materials = useMemo(() => filters?.materials ?? [], [filters]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mb-12"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
          Каталог
        </span>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
          Проекты домов и бань
        </h1>
        <p className="mt-4 text-muted-foreground">
          Выберите готовый проект или используйте его как основу для индивидуального решения.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <aside className="space-y-8 lg:sticky lg:top-24 self-start">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium">Фильтры</h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" /> Сбросить
              </button>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Тип объекта</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Все" },
                { value: "house", label: "Дома" },
                { value: "bathhouse", label: "Бани" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCategory(opt.value as Category)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    category === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground/70 hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Материал</label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любой материал</SelectItem>
                {materials.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Этажность</label>
            <Select value={floors} onValueChange={setFloors}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любая</SelectItem>
                <SelectItem value="1">1 этаж</SelectItem>
                <SelectItem value="2">2 этажа</SelectItem>
                <SelectItem value="3">3 этажа</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                Площадь: {effectiveAreaRange[0]}–{effectiveAreaRange[1]} м²
              </label>
              <Slider
                min={filters.minArea}
                max={filters.maxArea}
                step={5}
                value={effectiveAreaRange}
                onValueChange={(v) => setAreaRange([v[0], v[1]])}
              />
            </div>
          )}

          {filters && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                Бюджет: {effectivePriceRange[0].toLocaleString("ru-RU")}–
                {effectivePriceRange[1].toLocaleString("ru-RU")} ₽
              </label>
              <Slider
                min={filters.minPrice}
                max={filters.maxPrice}
                step={50000}
                value={effectivePriceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]])}
              />
            </div>
          )}
        </aside>

        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Загрузка..." : `Найдено: ${projects?.length ?? 0}`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {(projects ?? []).map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <Link href={`/projects/${project.id}`}>
                    <div className="group rounded-2xl overflow-hidden bg-card border border-border cursor-pointer h-full flex flex-col">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={assetUrl(project.imageUrl)}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {project.featured && (
                          <Badge className="absolute top-3 left-3 rounded-full">Хит</Badge>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-xs uppercase tracking-wider text-secondary font-medium">
                          {project.category === "house" ? "Дом" : "Баня"} · {project.material}
                        </span>
                        <h3 className="mt-2 font-serif text-xl font-medium">{project.title}</h3>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{project.area} м²</span>
                          <span>{project.floors} эт.</span>
                          <span>{project.bedrooms} спален</span>
                        </div>
                        <div className="mt-auto pt-4 font-medium">
                          от {project.price.toLocaleString("ru-RU")} ₽
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!isLoading && (projects ?? []).length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              По вашим фильтрам проектов не найдено. Попробуйте изменить параметры.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
