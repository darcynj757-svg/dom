import { Link } from "wouter";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ProductionNav } from "@/components/ProductionNav";
import pilomaterialImg from "@assets/service-pilomaterial.webp";
import imgObreznoj from "@assets/be42dca7-90a5-42d1-af0d-0cabca5da2eb_1784946798699.webp";
import imgNeobreznoj from "@assets/1dec6e3b-8c18-4da4-a54f-c449149d3d5c_1784946798700.webp";
import imgBrusy from "@assets/a43c1b55-9c69-423d-ac20-d20aa342fb03_1784946798700.webp";
import imgOpilki from "@assets/a23e7cfd-de84-4bc5-9c8a-088dab308d48_1784946798699.webp";
import imgStruzhka from "@assets/021589dd-c851-429b-91e3-1995542a6690_1784946798699.webp";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

const SPECS = [
  { label: "Пиломатериал", value: <>до 1 000 м<sup>3</sup> в месяц</> },
  { label: "Стружка, опилки", value: <>до 2 000 м<sup>3</sup> в месяц</> },
  { label: "Материал", value: "Сосна, кедр, осина, берёза" },
  { label: "Цена", value: <>от 9 500 руб/м<sup>3</sup></> },
];

const ADVANTAGES = [
  "Собственные ленточные пилорамы в Томске",
  "Башенные краны и ж/д подъездные пути на территории",
  "Отгрузка автотранспортом или в вагоны",
  "Сибирские породы: сосна, кедр, осина, берёза",
  "Стабильный объём и точные сроки",
  "Поставки по всей России",
];

const TYPES = [
  {
    title: "Обрезной пиломатериал",
    image: imgObreznoj,
    description:
      "Пиломатериал прямоугольного сечения, обработанный с двух или четырёх сторон. Может иметь небольшой обзол. При выборе важны сорт дерева, влажность и чистота материала — от этого зависит износостойкость и допустимая нагрузка.",
  },
  {
    title: "Необрезной пиломатериал",
    image: imgNeobreznoj,
    description:
      "Пиломатериал с неопиленными или частично опиленными кромками, с обзолом. Края спилены частично, в местах кромки часто присутствует кора. Более низкая стоимость — используется там, где высокие требования к виду не нужны.",
  },
];

export default function ProductionPilomaterial() {
  const { sectionRef, y } = useHeroParallax();
  return (
    <div>
      {/* ── Hero ── */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform" style={{ y }}>
          <img
            src={pilomaterialImg}
            alt="Пиломатериал"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 pt-28 md:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="block text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium mb-4">
              Производство
            </span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Пиломатериал
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Обрезной и необрезной пиломатериал из сибирских пород. Собственные
              пилорамы и ж/д пути — отгрузка по всей России.
            </p>
          </motion.div>
        </div>
      </section>

      <ProductionNav current="pilomaterial" />

      {/* ── Intro + advantages ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fade()}>
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
                От производителя
              </span>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Пиломатериал напрямую с завода
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                Собственная производственная база с ленточными пилорамами, башенными
                кранами и железнодорожными подъездными путями позволяет обеспечивать
                стабильный объём и точные сроки отгрузки. Работаем с сибирскими
                породами — сосной, кедром, осиной и берёзой.
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

            <motion.div {...fade(0.15)} className="relative rounded-2xl overflow-hidden">
              <img
                src={imgBrusy}
                alt="Брусья пиломатериал"
                loading="lazy"
                className="w-full object-cover aspect-[4/3] rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Виды — крупные плитки ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Виды
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
              Виды пиломатериала
            </h2>
          </motion.div>

          <div className="space-y-5">
            {TYPES.map((type, i) => (
              <motion.div
                key={type.title}
                {...fade(i * 0.08)}
                className="rounded-3xl overflow-hidden border border-border shadow-sm"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[420px] ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                  <div className="relative overflow-hidden group lg:[direction:ltr]">
                    <img
                      src={type.image}
                      alt={type.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <div className="lg:[direction:ltr] flex flex-col justify-center px-8 py-12 md:px-12 lg:px-16 bg-card">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-5">
                      {type.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {type.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Побочная продукция — full-bleed ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Побочная продукция
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Стружка и опилки
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { img: imgOpilki, label: "Опилки", desc: "Подходят для мульчирования, животноводства и биотоплива." },
              { img: imgStruzhka, label: "Стружка", desc: "Используется в производстве ДСП, для подстилки и теплоизоляции." },
            ].map((item, i) => (
              <motion.div key={item.label} {...fade(i * 0.1)} className="rounded-3xl overflow-hidden border border-border shadow-sm">
                <img src={item.img} alt={item.label} loading="lazy" className="w-full object-cover aspect-[16/7]" />
                <div className="px-8 py-6 bg-card">
                  <h3 className="font-serif text-xl font-bold mb-2">{item.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Характеристики ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Стоимость
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Купить пиломатериал
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden mb-5">
              {SPECS.map((row, i) => (
                <div key={row.label} className={`flex flex-col sm:flex-row ${i % 2 === 0 ? "bg-muted/40" : "bg-card"}`}>
                  <div className="sm:w-56 px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wide border-b sm:border-b-0 sm:border-r border-border flex-shrink-0">
                    {row.label}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">{row.value}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">
              Цена зависит от объёма заказа и породы древесины. Уточняйте актуальную стоимость у менеджера.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Оформить заказ на пиломатериал
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Уточним объём, породу и сроки — рассчитаем стоимость и организуем отгрузку.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contacts#form">
                  Отправить заявку <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
