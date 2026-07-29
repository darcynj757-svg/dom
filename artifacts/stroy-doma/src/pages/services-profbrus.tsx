import { Link } from "wouter";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { ProfbrusHeroVideo } from "@/components/ProfbrusHeroVideo";
import imgHouseWinter from "@assets/a404eeaf-94f9-41b7-a6a4-ed9de3b003e7_1784948204328.webp";
import imgTimberSection from "@assets/generated_images/profbrus-material-hero.webp";
import imgInterior from "@assets/9755231b-2745-41bb-afb1-7fb8016ce68e_1784948204327.webp";
import imgMill from "@assets/17ee88fd-8e9c-458e-8404-ca0e53c9ee01_1784948204326.webp";
import imgConstruction from "@assets/55c29421-0abb-4eda-9e7a-e8de036b8aea_1784948204327.webp";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

const ADVANTAGES = [
  "Быстрый монтаж — дом готов за один сезон",
  "Гладкая поверхность не требует внутренней отделки",
  "Низкая теплопроводность — тепло зимой, прохладно летом",
  "Экологичный материал без токсичных клеёв",
  "Конкурентная цена благодаря собственному производству",
  "Материал: сибирский кедр, сосна, лиственница",
];

const PRICES = [
  { label: "Дизайн-проект дома", value: "от 150 руб/м² по площади пола" },
  { label: "Материал", value: "кедр, сосна, лиственница" },
  { label: "Укладка бруса на джут", value: "от 150 руб м/п" },
  { label: "Шлифовка, пропитка", value: "от 500 руб/м²" },
  { label: "Цена под ключ", value: "от 11 000 до 14 000 руб/м² без фундамента и кровельного материала" },
];

export default function ServicesProfBrus() {
  const { sectionRef, y } = useHeroParallax();
  return (
    <div>
      {/* ── Hero ── */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <ProfbrusHeroVideo />
        <div className="absolute inset-0 z-0 bg-black/30 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 pt-28 md:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="block text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium mb-4">
              Строительство
            </span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Дома из профилированного бруса
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Собственный пиломатериал из сибирской сосны, лиственницы и кедра —
              прямо с нашего производства в Томске. Никаких посредников:
              честная цена и полная ответственность за каждый венец.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Intro + advantages ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fade()}>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Почему выбирают профилированный брус
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                Компания «Кедр-Томск» предлагает строительство домов из
                профилированного бруса естественной влажности. Максимальное
                сечение — 200×300 мм. Во время обработки мы достигаем высокой
                степени чистоты поверхности, поэтому отделочные работы
                зачастую не нужны.
              </p>
              <ul className="space-y-3">
                {ADVANTAGES.map((adv) => (
                  <li key={adv} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-snug">{adv}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Large image */}
            <motion.div {...fade(0.15)} className="relative">
              <img
                src={imgHouseWinter}
                alt="Дом из профилированного бруса зимой"
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Материал — full-bleed ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Материал
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
              Зимний лес — лучшее сырьё
            </h2>
          </motion.div>

          {/* Full-width image */}
          <motion.div {...fade(0.1)} className="relative mb-12 rounded-2xl overflow-hidden">
            <img
              src={imgTimberSection}
              alt="Профилированный брус в разрезе"
              className="w-full object-cover h-[50vh] md:h-[60vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
              <div className="px-8 md:px-16 max-w-lg">
                <p className="text-white text-xl md:text-2xl font-serif leading-snug">
                  Для производства бруса мы используем зимний лес — он имеет
                  улучшенные эксплуатационные параметры и минимальный риск трещин.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <motion.p {...fade(0.15)} className="text-muted-foreground leading-relaxed text-base">
              Дерево, заготовленное в зимний период, будет иметь более
              улучшенные эксплуатационные параметры по сравнению с материалом,
              который заготовили в тёплый период. При таком подходе риски
              появления усадочных трещин, а также поражение насекомыми стремятся
              к минимальным показателям.
            </motion.p>
            <motion.p {...fade(0.2)} className="text-muted-foreground leading-relaxed text-base">
              После обработки антисептическими материалами исключается развитие
              гнилостных процессов в дереве. Все элементы для вашего дома мы
              производим на собственной базе, оснащённой современными
              деревообрабатывающими станками.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Экологичность — image right ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fade(0.1)} className="order-2 lg:order-1">
              <img
                src={imgInterior}
                alt="Интерьер дома из профилированного бруса"
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-xl"
              />
            </motion.div>

            <motion.div {...fade()} className="order-1 lg:order-2">
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
                Экологичность
              </span>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Живой воздух в каждом доме
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Брус экологичен — его производят из массива дерева без
                  токсичных клеёв. Брус естественной влажности годами испускает
                  летучие вещества, которые являются натуральными антисептиками
                  и благотворно влияют на дыхательные пути.
                </p>
                <p>
                  Стены «дышат» и создают практически идеальный микроклимат.
                  Это обеспечивает наилучший воздушный обмен и поддерживает
                  оптимальную влажность внутри. Летом — прохладно, зимой —
                  быстро прогревается и долго держит тепло.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Производство — full-bleed ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="relative rounded-2xl overflow-hidden">
            <img
              src={imgMill}
              alt="Производство профилированного бруса"
              className="w-full object-cover h-[55vh] md:h-[65vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
              <div className="p-8 md:p-16 max-w-3xl">
                <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium">
                  Собственное производство
                </span>
                <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Своя площадка с ж/д путями в Томске
                </h2>
                <p className="text-white/75 text-base leading-relaxed">
                  Наша производственная база с железнодорожными путями в черте
                  города позволяет снизить издержки и держать конкурентные цены.
                  Качество формируется на каждом этапе — от заготовки до сдачи
                  объекта.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Цена ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Стоимость
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Цены на строительство из профилированного бруса
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden mb-4">
              {PRICES.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-col sm:flex-row ${
                    i % 2 === 0 ? "bg-muted/40" : "bg-card"
                  }`}
                >
                  <div className="sm:w-72 px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wide border-b sm:border-b-0 sm:border-r border-border flex-shrink-0">
                    {row.label}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">
              Окончательная цена формируется после составления сметы.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Готовы начать строительство?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Оставьте заявку — рассчитаем стоимость и подберём проект
              под ваш участок и бюджет.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contacts#form">
                  Получить расчёт <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
