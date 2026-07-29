import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ShieldCheck, Hammer, Clock, TreePine, Layers, Truck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import ctaVideo from "@assets/generated_videos/profiled-timber-flythrough-v3.mp4";
import prod1 from "@/assets/about/production-1.webp";
import prod2 from "@/assets/about/production-2.webp";
import prod3 from "@/assets/about/production-3.webp";
import prod4 from "@/assets/about/production-4.webp";
import prod5 from "@/assets/about/production-5.webp";
import prod6 from "@/assets/about/production-6.webp";
import prod7 from "@/assets/about/production-7.webp";
import prod8 from "@/assets/about/production-8.webp";

const TIMELINE = [
  { year: "2001", text: "Основана компания «Кедр-Томск», первые объекты в Томской области." },
  { year: "2005", text: "Запущено собственное производство профилированного бруса." },
  { year: "2010", text: "Установлен финский 4-х сторонний станок — мощность до 500 м³ в месяц." },
  { year: "2015", text: "Начали строить по всей России, включая западные регионы." },
  { year: "2022", text: "Более 200 построенных объектов — дома, коттеджи, бани, беседки." },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Надёжность",
    text: "Работаем по договору с фиксированной сметой и гарантией на конструктив.",
  },
  {
    icon: Hammer,
    title: "Мастерство",
    text: "Собственная бригада опытных плотников со средним стажем от 10 лет.",
  },
  {
    icon: Clock,
    title: "Сроки",
    text: "Строим дом под ключ в оптимальные сроки. Чёткий график — без задержек.",
  },
  {
    icon: TreePine,
    title: "Качество материалов",
    text: "Кедр, сосна и лиственница с северных участков тайги Томской области.",
  },
];

const EQUIPMENT = [
  { icon: Layers, label: "Ленточная пилорама" },
  { icon: Hammer, label: "Финский 4-х сторонний станок" },
  { icon: Truck, label: "Грузовой автотранспорт с манипуляторами" },
  { icon: ShieldCheck, label: "Два башенных крана" },
];

const STATS = [
  { value: "25+", label: "лет на рынке" },
  { value: "200+", label: "объектов построено" },
  { value: "500", label: "м³ бруса в месяц" },
  { value: "3", label: "породы сибирского дерева" },
];

export default function About() {
  useSeo({
    title: "О компании",
    description: "Кедр Томск — строим деревянные дома с 2001 года. Более 200 объектов, собственное производство профилированного бруса в Томске, бригады опытных плотников.",
  });
  const isMobile = useIsMobile();
  const ctaVideoRef = useRef<HTMLVideoElement>(null);
  const { sectionRef, y } = useHeroParallax();

  useEffect(() => {
    const el = ctaVideoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.preload = "auto";
          el.load();
          el.play().catch(() => {});
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero with video background */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[70vh] flex items-start border-b border-border overflow-hidden">
        {/* Video background */}
        <motion.div className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform" style={{ y }}>
          {isMobile ? (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url(/posters/kedr-house-hero.webp)" }}
            />
          ) : (
            <video
              src="/videos/kedr-house-hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/posters/kedr-house-hero.webp"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </motion.div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 pt-48 md:pt-64 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              О компании
            </span>
            <h1 className="mt-3 font-serif text-2xl md:text-4xl lg:text-5xl font-black text-white"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
              Дома из сибирского кедра — тепло, которое служит веками
            </h1>
            <p className="mt-6 text-white leading-relaxed text-base md:text-lg max-w-xl"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              Строим деревянные дома и бани в Томске и по всей России с 2001 года. Более 200 объектов — от коттеджей до беседок. Собственное производство бруса и опытные бригады плотников.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="font-display text-5xl md:text-6xl font-black text-primary">
                  {s.value}
                </div>
                <div className="mt-3 text-sm font-semibold text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="py-20 md:py-28 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-10"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Процесс строительства
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold">
              Как мы строим дома из кругляка
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Рубленые дома из сибирского кедра и сосны — наш главный профиль.
              Посмотрите, как мы возводим сруб ручной рубки от заготовки бревна до готового объекта.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border"
            style={{ aspectRatio: "16/9" }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/x6RkIS8cZQQ?rel=0&modestbranding=1&color=white"
              title="Строительство рубленого дома из бревна ручной рубки"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-6 justify-center"
          >
            {[
              "Ручная рубка",
              "Кедр и сосна",
              "Сибирский лес",
              "Строительство под ключ",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About text */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Качество — главная цель
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Компания «Кедр-Томск» получает качественный пиломатериал с
                  северных участков тайги Томской области, что гарантирует
                  качество используемой нами древесины.
                </p>
                <p>
                  Кедр, сосна и лиственница — при строительстве домов мы
                  выбираем эти породы древесины за их выдающиеся качества и как
                  прошедшие проверку временем.
                </p>
                <p>
                  Основной вид деятельности — строительство домов и производство
                  профилированного бруса. Наши мастера строят по всей Сибири и
                  России. Накопленные знания в области строительства деревянных
                  сооружений — залог качества и успешного претворения в жизнь
                  самых смелых замыслов наших заказчиков.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Производственные мощности
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                <p>
                  Собственное производство в черте г. Томска и наличие ж/д
                  подъездных путей обеспечивают оперативное выполнение заказов и
                  возможность отгрузки пиломатериала в любую точку России.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EQUIPMENT.map((eq) => (
                  <div
                    key={eq.label}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
                  >
                    <eq.icon className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm font-medium">{eq.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Production photo gallery */}
      <section className="py-20 md:py-28 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">Наше производство</span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold max-w-2xl">
              Собственный производственный комплекс в Томске
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
              Производственная база компании расположена в промышленной зоне г. Томска и оснащена современным деревообрабатывающим оборудованием. Наличие железнодорожных подъездных путей и грузовой техники с манипуляторами позволяет принимать сырьё и отгружать готовый пиломатериал в любую точку России без посредников.
            </p>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ gridTemplateRows: "auto" }}>
            {/* Large left */}
            <motion.div
              className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: "4/3" }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={prod1} alt="Производственная площадка" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white text-sm font-medium">Производственная площадка</span>
            </motion.div>

            {[
              { img: prod7, label: "Сибирский кедр и сосна" },
              { img: prod5, label: "Финский 4-сторонний станок" },
              { img: prod2, label: "Грузовой транспорт с манипулятором" },
              { img: prod3, label: "Ж/д подъездные пути" },
            ].map(({ img, label }, i) => (
              <motion.div
                key={label}
                className="relative overflow-hidden rounded-xl md:rounded-2xl"
                style={{ aspectRatio: "4/3" }}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i + 1) * 0.07 }}
              >
                <img src={img} alt={label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Second row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
            {[
              { img: prod4, label: "Башенные краны на площадке" },
              { img: prod6, label: "Склад готового пиломатериала" },
              { img: prod8, label: "Офис и дипломы компании" },
            ].map(({ img, label }, i) => (
              <motion.div
                key={label}
                className="relative overflow-hidden rounded-xl md:rounded-2xl"
                style={{ aspectRatio: "4/3" }}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <img src={img} alt={label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-12">
            Наши принципы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-6 p-8 rounded-2xl border border-border bg-card"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <v.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-12">
            История компании
          </h2>
          <div className="relative border-l-2 border-border pl-8 space-y-10">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[2.65rem] top-0.5 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                <div className="font-serif text-2xl font-semibold text-primary mb-1">
                  {item.year}
                </div>
                <p className="text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 text-background relative overflow-hidden">
        {!isMobile && (
          <video
            ref={ctaVideoRef}
            src={ctaVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/posters/profiled-timber-flythrough-v3.webp"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {isMobile && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url(/posters/profiled-timber-flythrough-v3.webp)" }}
          />
        )}
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #B69D72 0%, transparent 60%), radial-gradient(circle at 70% 50%, #B69D72 0%, transparent 60%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 md:px-6 text-center relative z-10"
        >
          <h2 className="font-display font-black text-white max-w-2xl mx-auto" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Готовы построить дом вашей мечты?
          </h2>
          <p className="mt-4 text-background/60 max-w-lg mx-auto">
            Оставьте заявку — мы свяжемся с вами, проконсультируем и подберём проект под ваш бюджет.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-10 py-6 text-base font-bold bg-white text-foreground hover:bg-white/90">
            <Link href="/contacts#form">Оставить заявку</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
