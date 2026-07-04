import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetProject, useCreateContactRequest } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { assetUrl } from "@/lib/utils";

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: project, isLoading } = useGetProject(id);
  const [activeImage, setActiveImage] = useState(0);
  const { toast } = useToast();

  const mutation = useCreateContactRequest();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(
      { data: { name: form.name, phone: form.phone, message: form.message || null, projectId: id } },
      {
        onSuccess: () => {
          toast({ title: "Заявка отправлена", description: "Мы свяжемся с вами в ближайшее время." });
          setForm({ name: "", phone: "", message: "" });
        },
      },
    );
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Загрузка...</div>;
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

  const images = project.gallery.length > 0 ? project.gallery : [project.imageUrl];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Ко всем проектам
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden mb-4"
          >
            <img src={assetUrl(images[activeImage])} alt={project.title} className="w-full h-full object-cover" />
          </motion.div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-primary" : "border-transparent opacity-70"
                  }`}
                >
                  <img src={assetUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              {project.category === "house" ? "Дом" : "Баня"} · {project.material}
            </span>
            <h1 className="mt-3 font-serif text-3xl md:text-4xl font-medium">{project.title}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>

            <div className="mt-8 grid grid-cols-3 gap-6 py-6 border-y border-border">
              <div>
                <div className="text-2xl font-serif font-medium">{project.area}</div>
                <div className="text-xs text-muted-foreground mt-1">м² площади</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-medium">{project.floors}</div>
                <div className="text-xs text-muted-foreground mt-1">этажа</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-medium">{project.bedrooms}</div>
                <div className="text-xs text-muted-foreground mt-1">спален</div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-serif text-lg font-medium mb-4">Особенности проекта</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:sticky lg:top-24 self-start"
        >
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="text-sm text-muted-foreground">Стоимость от</div>
            <div className="font-serif text-3xl font-medium mt-1">
              {project.price.toLocaleString("ru-RU")} ₽
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit" className="w-full rounded-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Отправка..." : "Оставить заявку на проект"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
