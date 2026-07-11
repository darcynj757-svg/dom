import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, ShieldCheck, Sparkles, Users, Building2, Phone, FileText, Truck, Ruler } from "lucide-react";
import ScrollHouse from "@/components/3d/ScrollHouse";
import { PROJECTS } from "@/data/projects";
import heroVideo from "@assets/cedar_log_mansion_flythrough_16s_compressed.mp4";

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
      <div className="font-display text-5xl md:text-6xl font-black text-primary">
        {value}{suffix}
      </div>
      <div className="mt-2 text-sm md:text-base text-muted-foreground">{label}</div>
    </motion.div>
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
        <div className="group relative overflow-hidden rounded-2xl glass-card cursor-pointer hover:shadow-xl transition-all duration-500">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="p-6">
            <span className="text-xs uppercase tracking-wider text-secondary font-semibold">{project.material}</span>
            <h3 className="mt-2 font-display text-xl font-bold">{project.title}</h3>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
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


  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);

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
      <section ref={houseRef} className="relative h-[250vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
            <ScrollHouse progress={houseProgress} />
          </motion.div>
          <motion.div
            style={{ opacity: labelOpacity }}
            className="absolute inset-x-0 top-12 flex flex-col items-center text-center pointer-events-none px-4 z-10"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              Интерактивная 3D-модель
            </span>
            <p className="font-display text-2xl md:text-3xl font-bold text-foreground/80">
              Дом строится на ваших глазах
            </p>
            <p className="mt-1 text-muted-foreground text-sm">прокрутите вниз</p>
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
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
            {STATS.map((s) => <StatCard key={s.label} {...s} />)}
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
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">Избранные проекты</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-black">
              Дома и бани,<br className="hidden md:block" /> которыми мы гордимся
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((project, i) => <FeaturedProjectCard key={project.id} project={project} index={i} />)}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/projects">Все проекты <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Block 5: Advantages ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-5xl font-black">Почему выбирают нас</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Hammer, title: "Более 10 лет опыта", text: "Практически круглый год ведём строительство деревянных домов в Томске, Томской области и за её пределами." },
              { icon: Sparkles, title: "Полный цикл работ", text: "От представления проекта будущего дома до непосредственного строительства на участке — всё под ключ." },
              { icon: ShieldCheck, title: "Современное производство", text: "Актуальное технологичное производство обеспечивает высокую точность и качество срубов из бруса и бревна." },
              { icon: Users, title: "Строгие сроки", text: "Соблюдаем обговоренные сроки в зависимости от материала, этажности дома и его площади." },
              { icon: Building2, title: "Цены ниже рынка", text: "Собственная производственная площадка в промзоне Томска позволяет вести строительство быстро и без роста сметы." },
              { icon: ShieldCheck, title: "100% гарантия", text: "Все обязательства по этапам строительства отражены в официальном договоре." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 6: How to start ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-5xl font-black">Как начать строительство?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Напишите нам или закажите обратный звонок — менеджеры договорятся о личной встрече и предложат типовые и оригинальные решения.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", icon: Phone, title: "Заявка", text: "Свяжитесь с нами по телефону или форме обратной связи." },
              { step: "02", icon: Ruler, title: "Расчёт", text: "Производим первичный расчёт пиломатериала и стоимости работ по вашим пожеланиям." },
              { step: "03", icon: FileText, title: "Договор и проект", text: "Заключаем договор, готовим и согласовываем техническую документацию." },
              { step: "04", icon: Truck, title: "Производство и стройка", text: "Изготавливаем сруб на производстве и начинаем строительство на участке." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden"
              >
                <span className="absolute top-4 right-4 font-display text-4xl font-black text-primary/10">{item.step}</span>
                <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 7: CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #B69D72 0%, transparent 60%), radial-gradient(circle at 70% 50%, #B69D72 0%, transparent 60%)" }} />
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <Sparkles className="w-8 h-8 mx-auto mb-6 text-amber-400" />
          <h2 className="font-display font-black text-white max-w-2xl mx-auto" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Готовы начать строительство своего дома?
          </h2>
          <p className="mt-4 text-background/60 max-w-lg mx-auto">
            Оставьте заявку — мы свяжемся с вами и поможем подобрать проект под ваш участок и бюджет.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-10 py-6 text-base font-bold">
            <Link href="/contacts">Оставить заявку</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
