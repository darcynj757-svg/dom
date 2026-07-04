import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, ShieldCheck, Sparkles, Users, Play } from "lucide-react";
import ScrollHouse from "@/components/3d/ScrollHouse";
import { PROJECTS } from "@/data/projects";

// ─── Stats (static) ────────────────────────────────────────────────────────────
const STATS = [
  { value: 25, suffix: " лет", label: "на рынке" },
  { value: 200, suffix: "+", label: "построенных объектов" },
  { value: 500, suffix: "", label: "м³ бруса в месяц" },
  { value: 30, suffix: "+", label: "мастеров в команде" },
];

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="font-serif text-4xl md:text-5xl font-semibold text-primary">
        {value}
        {suffix}
      </div>
      <div className="mt-2 text-sm md:text-base text-muted-foreground">{label}</div>
    </motion.div>
  );
}

// ─── Featured project card ──────────────────────────────────────────────────────
function FeaturedProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.id}`}>
        <div className="group relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="p-6">
            <span className="text-xs uppercase tracking-wider text-secondary font-medium">
              {project.material}
            </span>
            <h3 className="mt-2 font-serif text-xl font-medium">{project.title}</h3>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>{project.area} м²</span>
              <span className="font-medium text-foreground">{project.price}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────────
export default function Home() {
  // 3D house scroll
  const houseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: houseRef,
    offset: ["start start", "end end"],
  });
  const [houseProgress, setHouseProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHouseProgress(Math.min(Math.max(v / 0.7, 0), 1));
  });
  const heroSceneOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0.9]);

  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      {/* ── Block 1: Video hero ─────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://picsum.photos/seed/construction/1920/1080"
        >
          {/* Aerial view of wooden house construction framing */}
          <source
            src="https://videos.pexels.com/video-files/17506765/17506765-uhd_2560_1440_24fps.mp4"
            type="video/mp4"
          />
          {/* Fallback: time-lapse construction */}
          <source
            src="https://videos.pexels.com/video-files/5348784/5348784-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Text content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 font-medium mb-5"
          >
            Строительство деревянных домов под ключ
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium max-w-4xl leading-[1.08] text-white"
          >
            Дом из кедра — надёжно,{" "}
            <span className="text-amber-300">в срок, с гарантией</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-xl text-base md:text-lg text-white/80"
          >
            От фундамента до крыши. Рубленные дома и дома из профилированного
            бруса по всей России с 2001 года.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 bg-white text-foreground hover:bg-white/90"
            >
              <Link href="/projects">
                Смотреть проекты <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-white/50 text-white hover:bg-white/10 hover:text-white hover:border-white"
            >
              <Link href="/contacts">Оставить заявку</Link>
            </Button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs"
          >
            <span>прокрутите вниз</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 rounded-full bg-white/50" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Block 2: 3D house scroll ────────────────────────────────────────── */}
      <section ref={houseRef} className="relative h-[250vh]">
        <div className="sticky top-[64px] md:top-[72px] h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] overflow-hidden">
          <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
            <ScrollHouse progress={houseProgress} />
          </motion.div>
          {/* Label */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]) }}
            className="absolute inset-x-0 top-10 flex flex-col items-center text-center pointer-events-none px-4"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Интерактивная 3D-модель
            </span>
            <p className="mt-2 font-serif text-xl md:text-2xl text-foreground/80">
              Дом строится на ваших глазах — прокрутите вниз
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Block 3: Stats ──────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 bg-background py-20 md:py-28 border-t border-border"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Block 4: Featured projects ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Избранные проекты
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-medium">
              Дома и бани, которыми мы гордимся
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((project, i) => (
              <FeaturedProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/projects">
                Все проекты <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Block 5: Advantages ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: Hammer,
                title: "Строим под ключ",
                text: "От проекта и фундамента до финальной отделки — без подрядчиков-посредников.",
              },
              {
                icon: ShieldCheck,
                title: "Гарантия качества",
                text: "Официальный договор, фиксированная смета и гарантия на конструктив до 10 лет.",
              },
              {
                icon: Users,
                title: "Своя бригада",
                text: "Опытные мастера в штате — никаких случайных субподрядчиков на вашем участке.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 6: CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-6 text-secondary" />
          <h2 className="font-serif text-3xl md:text-5xl font-medium max-w-2xl mx-auto">
            Готовы начать строительство своего дома?
          </h2>
          <p className="mt-4 text-background/70 max-w-lg mx-auto">
            Оставьте заявку — мы свяжемся с вами и поможем подобрать проект под
            ваш участок и бюджет.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <Link href="/contacts">Оставить заявку</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
