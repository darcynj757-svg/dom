import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { getProjectById } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, User, Phone, MessageSquare, Send, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { submitForm } from "@/lib/submitForm";
import { useSeo } from "@/hooks/useSeo";

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const project = getProjectById(id);
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  useSeo(
    project
      ? {
          title: `${project.title} — ${project.area} м²`,
          description: `${project.title}: ${project.area} м², ${project.floors} эт., ${project.material}. ${project.description.slice(0, 120)}`,
        }
      : { title: "Проект не найден" }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("pending");
    setErrorMsg("");
    try {
      await submitForm({
        name: form.name,
        phone: form.phone,
        message: form.message,
        subject: project
          ? `Заявка по проекту ${project.title} (${project.area} м²)`
          : "Заявка по проекту",
      });
      setStatus("success");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ошибка отправки");
    }
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
    <div>
      {/* Sticky back button — always visible while scrolling */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Ко всем проектам
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-8 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
        {/* Images */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-muted"
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
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-black">
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
            <div className="mt-8 rounded-2xl overflow-hidden border border-primary/20 shadow-md">
              {/* Header strip */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-white leading-tight">
                      Оформить заявку на расчёт
                    </h2>
                    <div className="flex items-center gap-1 mt-1">
                      <Tag className="w-3 h-3 text-white/60 flex-shrink-0" />
                      <p className="text-white/70 text-xs">{project.title}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="bg-card px-6 py-5">
                {/* Messenger shortcuts */}
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">
                    Написать напрямую
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href="https://wa.me/73822334439"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 hover:bg-[#25D366]/10 hover:border-[#25D366]/40 transition-all duration-200 py-2.5 text-xs font-medium group"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#25D366] flex-shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-foreground/80 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
                    </a>

                    <a
                      href="https://t.me/+73822334439"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 hover:bg-[#229ED9]/10 hover:border-[#229ED9]/40 transition-all duration-200 py-2.5 text-xs font-medium group"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#229ED9] flex-shrink-0">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      <span className="text-foreground/80 group-hover:text-[#229ED9] transition-colors">Telegram</span>
                    </a>

                    <a
                      href="https://max.ru/kedrtomsk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 hover:bg-[#5B5FEF]/10 hover:border-[#5B5FEF]/40 transition-all duration-200 py-2.5 text-xs font-medium group"
                    >
                      <img src="/max-icon.webp" alt="Макс" className="w-3.5 h-3.5 object-contain rounded-sm flex-shrink-0" />
                      <span className="text-foreground/80 group-hover:text-[#5B5FEF] transition-colors">Макс</span>
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">или заполните форму</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Ваше имя"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="+7 (___) ___-__-__"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                  {/* Comment */}
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      placeholder="Комментарий (необязательно)"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="pl-9 resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-destructive text-xs p-3 rounded-lg bg-destructive/10">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errorMsg || "Не удалось отправить. Позвоните: +7 (3822) 33-44-39"}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-full font-bold tracking-wide"
                    disabled={status === "pending"}
                  >
                    {status === "pending" ? "Отправка..." : "Отправить заявку"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Нажимая кнопку, вы соглашаетесь с&nbsp;
                    <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
                      политикой конфиденциальности
                    </Link>
                  </p>
                </form>
                {status === "success" && (
                  <div className="mt-3 flex items-center gap-2 text-green-700 text-sm p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Заявка отправлена! Свяжемся с вами в течение 24 часов.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
}
