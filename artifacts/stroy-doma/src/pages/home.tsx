import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, CalendarClock, Layers, Cog, Timer, Wallet, BadgeCheck, Phone, Calculator, FileSignature, HardHat, BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollHouse from "@/components/3d/ScrollHouse";
import { getGltfPromise } from "@/components/3d/houseLoader";
import { PROJECTS } from "@/data/projects";
import { GALLERY_ITEMS } from "@/pages/gallery";
import { ARTICLES } from "@/data/articles-data";
import heroVideo from "@assets/cedar_log_mansion_flythrough_16s_compressed.mp4";
import ctaVideo from "@assets/generated_videos/profiled-timber-flythrough-v3.mp4";

const STATS = [
  { value: 25, suffix: "", label: "Лет на рынке" },
  { value: 200, suffix: "+", label: "Построенных объектов" },
  { value: 500, suffix: "", label: "М³ бруса в месяц" },
  { value: 30, suffix: "+", label: "Мастеров в команде" },
];

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-5xl md:text-6xl font-black text-primary">
        {value}{suffix}
      </div>
      <div className="mt-2 text-sm md:text-base text-muted-foreground whitespace-nowrap">{label}</div>
    </div>
  );
}

function FeaturedProjectCard({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.id}`}>
        <div className="group relative overflow-hidden rounded-xl md:rounded-2xl glass-card cursor-pointer hover:shadow-xl transition-all duration-500
                        flex flex-row md:flex-col">
          {/* Image — square thumb on mobile, 4/3 on desktop */}
          <div className="w-28 shrink-0 md:w-auto md:aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="p-3 md:p-6 flex flex-col justify-center min-w-0">
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-secondary font-semibold">{project.material}</span>
            <h3 className="mt-0.5 md:mt-2 font-display text-sm md:text-xl font-bold leading-snug line-clamp-2">{project.title}</h3>
            <div className="mt-1 md:mt-3 flex items-center justify-between text-xs md:text-sm text-muted-foreground">
              <span>{project.area} м²</span>
              <span className="font-semibold text-foreground">{project.price}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const houseRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: houseRef, offset: ["start start", "end end"] });
  const [houseProgress, setHouseProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHouseProgress(Math.min(Math.max(v / 0.7, 0), 1));
  });
  const heroSceneOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0.9]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Auto-scroll into the 3D section as soon as the model finishes loading
  useEffect(() => {
    getGltfPromise().then(() => {
      if (houseRef.current && window.scrollY < 100) {
        houseRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, []);

  // ── Home gallery lightbox ──────────────────────────────────────────────────
  // Pool: the 7 items shown in the desktop bento (indices into GALLERY_ITEMS)
  const HOME_BENTO_POOL = [0, 1, 2, 3, 4, 5, 6];
  const [homeLightbox, setHomeLightbox] = useState<number | null>(null); // index into HOME_BENTO_POOL
  const openHomeLightbox = useCallback((galleryIdx: number) => {
    const pos = HOME_BENTO_POOL.indexOf(galleryIdx);
    setHomeLightbox(pos >= 0 ? pos : 0);
  }, []);
  const closeHomeLightbox = useCallback(() => setHomeLightbox(null), []);
  const prevHome = useCallback(() =>
    setHomeLightbox((i) => i === null ? null : (i - 1 + HOME_BENTO_POOL.length) % HOME_BENTO_POOL.length), []);
  const nextHome = useCallback(() =>
    setHomeLightbox((i) => i === null ? null : (i + 1) % HOME_BENTO_POOL.length), []);
  useEffect(() => {
    if (homeLightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeHomeLightbox();
      if (e.key === "ArrowLeft") prevHome();
      if (e.key === "ArrowRight") nextHome();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [homeLightbox, closeHomeLightbox, prevHome, nextHome]);
  const homeLightboxItem = homeLightbox !== null ? GALLERY_ITEMS[HOME_BENTO_POOL[homeLightbox]] : null;

  const FEATURED_IDS = [12, 11, 10, 13, 14, 15]; // Д251, Д187, Д143 + бани
  const featured = FEATURED_IDS
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PROJECTS;

  return (
    <div>
      {/* ── Block 1: 3D House-Build Hero ───────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-[#1c1a17]">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay — heavier at top and bottom, lighter in middle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pt-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-block px-5 py-1.5 rounded-full glass text-white/90 text-xs md:text-sm tracking-[0.25em] font-semibold mb-8"
          >
            Строительство деревянных домов под ключ
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-display font-black text-white leading-[1.05] max-w-6xl"
            style={{ fontSize: "clamp(2rem, 5.6vw, 80px)" }}
          >
            Строим ваш дом из кедра,<br />
            <span className="italic text-amber-300">пока вы строите</span><br />
            свою жизнь
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-7 max-w-lg text-base md:text-lg text-white/75 font-medium"
          >
            Рубленые дома из кругляка и дома из профилированного бруса под ключ — по всей России с 2001 года.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Link href="/projects">
              <div className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-foreground font-bold text-sm hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Смотреть проекты <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/contacts">
              <div className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full glass font-bold text-sm text-white hover:bg-white/20 transition-all duration-200 border border-white/30">
                Оставить заявку
              </div>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs tracking-widest uppercase"
          >
            <span>прокрутите</span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 rounded-full bg-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Block 2: 3D house scroll ────────────────────────────────────────── */}
      <section ref={houseRef} className="relative h-[500vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
            <ScrollHouse progress={houseProgress} />
          </motion.div>
          <div
            className="absolute inset-x-0 top-12 flex flex-col items-center text-center pointer-events-none px-4 z-10"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              Интерактивная 3D-модель
            </span>
            <p className="font-display text-2xl md:text-3xl font-bold text-foreground/80">
              Дом строится на ваших глазах
            </p>
            <p className="mt-1 text-muted-foreground text-sm">прокрутите вниз</p>
          </div>

          {/* Stats overlay — visible from the moment the 3D build starts */}
          <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
            <div className="container mx-auto px-4 md:px-6 pb-8 md:pb-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display text-4xl md:text-5xl font-black text-foreground drop-shadow-sm">
                      {s.value}{s.suffix}
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-muted-foreground whitespace-nowrap">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* gradient fade so stats sit on top of the fade-to-background strip */}
            <div className="h-32 md:h-24 bg-gradient-to-b from-transparent to-background" />
          </div>

        </div>
      </section>

      {/* ── Block 3: Featured projects ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-8 md:mb-12"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">Избранные проекты</span>
            <h2 className="mt-2 md:mt-3 font-display text-2xl md:text-5xl font-black">
              Дома и бани,<br className="hidden md:block" /> которые мы строим
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {featured.map((project, i) => <FeaturedProjectCard key={project.id} project={project} index={i} />)}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/projects">Все проекты <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Block 5: Advantages (redesigned) ───────────────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">Преимущества</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-black">Почему выбирают нас</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: CalendarClock, title: "Более 25 лет опыта", text: "Круглый год строим деревянные дома в Томске, области и по всей России." },
              { icon: Layers, title: "Полный цикл работ", text: "От проекта до готового дома на участке — все этапы под одной ответственностью." },
              { icon: Cog, title: "Современное производство", text: "Точные срубы из профилированного бруса и рубленного бревна на собственной площадке." },
              { icon: Timer, title: "Строгие сроки", text: "Соблюдаем календарные планы в зависимости от материала, этажности и площади дома." },
              { icon: Wallet, title: "Цены ниже рынка", text: "Собственное производство в промзоне Томска позволяет держать смету без роста." },
              { icon: BadgeCheck, title: "100% гарантия", text: "Все обязательства прописаны в договоре — вы защищены на каждом этапе." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative p-7 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-tr-2xl rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 ring-1 ring-primary/20">
                    <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 6: How to start (redesigned timeline) ────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">Процесс</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-black">Как начать строительство</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Свяжитесь с нами — менеджеры договорятся о встрече и предложат типовые и оригинальные решения под ваш участок.
            </p>
          </motion.div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", icon: Phone, title: "Заявка", text: "Позвоните или напишите — обсудим ваши пожелания и ответим на вопросы." },
                { step: "02", icon: Calculator, title: "Расчёт", text: "Сделаем первичный расчёт пиломатериала и стоимости строительных работ." },
                { step: "03", icon: FileSignature, title: "Договор и проект", text: "Заключим договор, подготовим и согласуем техническую документацию." },
                { step: "04", icon: HardHat, title: "Производство и стройка", text: "Изготовим сруб на производстве и приступим к строительству на участке." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 mb-6 relative z-10">
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-primary/20 text-primary text-xs font-bold flex items-center justify-center">{item.step}</span>
                    <item.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Block 7: Gallery preview ────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">Фотогалерея</span>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-black">Реализованные проекты</h2>
              <p className="mt-3 text-muted-foreground max-w-xl">Дома, бани и беседки, построенные нашей компанией по всей России.</p>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              Смотреть все фото <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
          {/* ── Mobile bento (< md): 2 cols, 3 rows (top full-width image hidden)
              Row 1: [0: tall 1×2][1: 1×1]
              Row 2: [0 cont'd   ][2: 1×1]
              Row 3: [3: 1×1    ][4: 1×1]
          */}
          <div
            className="grid md:hidden gap-[10px]"
            style={{
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "repeat(3, 155px)",
            }}
          >
            {([
              { col: "1 / 2", row: "1 / 3", gi: 0 },  // большое, высокое
              { col: "2 / 3", row: "1 / 2", gi: 1 },  // верх-право
              { col: "2 / 3", row: "2 / 3", gi: 2 },  // центр-право
              { col: "1 / 2", row: "3 / 4", gi: 3 },  // низ-лево
              { col: "2 / 3", row: "3 / 4", gi: 4 },  // низ-право
            ] as { col: string; row: string; gi: number }[]).map((span, i) => {
              const item = GALLERY_ITEMS[span.gi];
              return (
                <motion.div
                  key={`mob-${item.id}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{ gridColumn: span.col, gridRow: span.row }}
                  className="group relative overflow-hidden rounded-xl bg-muted cursor-pointer"
                  onClick={() => openHomeLightbox(span.gi)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-medium leading-snug">{item.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* ── Mobile: «Наши работы» button */}
          <div className="mt-10 flex justify-center md:hidden">
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border border-foreground/20 bg-background text-foreground hover:bg-muted gap-2 px-8"
              >
                Наши работы <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* ── Desktop bento (md+): 3 cols
              Row 1: [0: 2×2][1: 1×1]
              Row 2: [0: 2×2][2: 1×1]
              Row 3: [3: 1×2][4: 1×1][5: 1×1]
              Row 4: [3: 1×2][6: 2×1]
          */}
          <div
            className="hidden md:grid grid-cols-3 gap-[10px]"
            style={{ gridTemplateRows: "repeat(4, 230px)" }}
          >
            {([
              { col: "1 / 3", row: "1 / 3" },  // 0 — большое 2×2
              { col: "3 / 4", row: "1 / 2" },  // 1 — 1×1 верх-право
              { col: "3 / 4", row: "2 / 3" },  // 2 — 1×1 середина-право
              { col: "1 / 2", row: "3 / 5" },  // 3 — высокое 1×2 лево
              { col: "2 / 3", row: "3 / 4" },  // 4 — 1×1 центр
              { col: "3 / 4", row: "3 / 4" },  // 5 — 1×1 право
              { col: "2 / 4", row: "4 / 5" },  // 6 — широкое 2×1 низ
            ] as { col: string; row: string }[]).map((span, i) => {
              const item = GALLERY_ITEMS[i];
              return (
                <motion.div
                  key={`desk-${item.id}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  style={{ gridColumn: span.col, gridRow: span.row }}
                  className="group relative overflow-hidden rounded-2xl bg-muted cursor-pointer"
                  onClick={() => openHomeLightbox(i)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] text-white/70 uppercase tracking-widest font-semibold mb-0.5">{item.category}</span>
                    <p className="text-white text-sm font-medium leading-snug">{item.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Block 8: Useful information ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">Полезная информация</span>
              <h2 className="mt-2 md:mt-3 font-display text-2xl md:text-5xl font-black">Статьи и советы</h2>
              <p className="mt-2 md:mt-3 text-muted-foreground text-sm md:text-base max-w-xl">Публикации от наших специалистов для тех, кто планирует строить деревянный дом.</p>
            </div>
            <Link href="/articles" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm md:text-base">
              Все материалы <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {ARTICLES.slice(0, 3).map((article, i) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="block">
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-xl md:rounded-2xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer
                           flex flex-row md:flex-col"
              >
                {/* Image — square thumb on mobile, 16/9 on desktop */}
                <div className="w-24 shrink-0 md:w-auto md:aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 md:p-6 flex flex-col justify-center min-w-0">
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-secondary font-medium">{article.category}</span>
                  <h3 className="mt-0.5 md:mt-2 font-display text-sm md:text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                  <p className="hidden md:block mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                </div>
              </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 9: CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 text-background relative overflow-hidden">
        <video
          src={ctaVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #B69D72 0%, transparent 60%), radial-gradient(circle at 70% 50%, #B69D72 0%, transparent 60%)" }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="font-display font-black text-white max-w-2xl mx-auto" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Готовы начать строительство своего дома?
          </h2>
          <p className="mt-4 text-background/60 max-w-lg mx-auto">
            Оставьте заявку — мы свяжемся с вами и поможем подобрать проект под ваш участок и бюджет.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-10 py-6 text-base font-bold bg-white text-foreground hover:bg-white/90">
            <Link href="/contacts">Оставить заявку</Link>
          </Button>
        </div>
      </section>

      {/* ── Home gallery lightbox ──────────────────────────────────────────── */}
      <AnimatePresence>
        {homeLightboxItem && homeLightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeHomeLightbox}
          >
            <button
              onClick={closeHomeLightbox}
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums">
              {homeLightbox + 1} / {HOME_BENTO_POOL.length}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); prevHome(); }}
              className="absolute left-3 md:left-6 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <motion.div
              key={homeLightboxItem.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={homeLightboxItem.image}
                alt={homeLightboxItem.title}
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-medium">{homeLightboxItem.title}</p>
                <p className="text-white/50 text-sm mt-1">{homeLightboxItem.category}</p>
              </div>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); nextHome(); }}
              className="absolute right-3 md:right-6 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
