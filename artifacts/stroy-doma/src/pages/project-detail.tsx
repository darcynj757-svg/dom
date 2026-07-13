import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { getProjectById } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const project = getProjectById(id);
  const [activeImage, setActiveImage] = useState(0);
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      setForm({ name: "", phone: "", message: "" });
    }, 800);
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mb-4">Проект не найден.</p>
        <Button asChild variant="outline">
          <Link href="/projects">Ко всем проектам</Link>
        </Button>
      </div>
    );
  }

  const images =
    project.gallery.length > 0
      ? [project.imageUrl, ...project.gallery]
      : [project.imageUrl];
  const plans = project.plans ?? [];
  const allImages = [...images, ...plans];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Ко всем проектам
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
        {/* Images */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-muted"
          >
            <img
              src={allImages[activeImage]}
              alt={project.title}
              className={`w-full h-full ${
                activeImage < images.length ? "object-cover" : "object-contain bg-white"
              }`}
            />
          </motion.div>
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors bg-muted ${
                    activeImage === i
                      ? "border-primary"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className={`w-full h-full ${
                      i < images.length ? "object-cover" : "object-contain bg-white"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
          {plans.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Последние {plans.length} {plans.length === 1 ? "фото" : "фото"} —
              планировка{plans.length > 1 ? " этажей" : ""} с указанием площади
              помещений.
            </p>
          )}
        </div>

        {/* Details */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              {project.material}
            </span>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-medium">
              {project.title}
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            {/* Specs */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { label: "Площадь", value: `${project.area} м²` },
                { label: "Этажей", value: String(project.floors) },
                project.bedrooms
                  ? { label: "Спален", value: String(project.bedrooms) }
                  : null,
                { label: "Материал", value: project.material },
              ]
                .filter(Boolean)
                .map((spec) => (
                  <div
                    key={spec!.label}
                    className="p-4 rounded-xl border border-border bg-muted/40"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {spec!.label}
                    </div>
                    <div className="font-medium text-sm">{spec!.value}</div>
                  </div>
                ))}
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-2">
              {project.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {project.price && (
              <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="text-sm text-muted-foreground">
                  Стоимость строительства
                </div>
                <div className="font-serif text-2xl font-semibold text-primary mt-1">
                  {project.price}
                </div>
              </div>
            )}

            {/* Form */}
            <div className="mt-8 p-6 rounded-2xl border border-border bg-card">
              <h2 className="font-serif text-xl font-medium mb-4">
                Оформить заявку на расчёт проекта
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Ваше имя"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  placeholder="Телефон"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Textarea
                  placeholder="Комментарий (необязательно)"
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  className="w-full rounded-full"
                  disabled={isPending}
                >
                  {isPending ? "Отправка..." : "Отправить заявку"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
