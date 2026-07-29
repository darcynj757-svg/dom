import { useState } from "react";
import { RublenyeHeroVideo } from "@/components/RublenyeHeroVideo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

import imgHouse from "@assets/a9bf52e2-583c-4a79-930b-772b49ec93f2_1784949661348.webp";
import imgRusChashaCorner from "@assets/8abdab99-deae-44ff-870c-ba53579ed2c0_1784949661348.webp";
import imgLogsSnow from "@assets/03dc6c62-5b6d-4c88-84c3-8e22198534f0_1784949661348.webp";
import imgCanCorner from "@assets/4e2c5749-5a85-4617-8b17-e72d85701c2f_1784949661348.webp";
import imgCanWall from "@assets/4ca0b6c6-9f8d-49d4-abd8-03bd7b299278_1784949661347.webp";
import imgProchnost from "@assets/fe1cf28b-2493-465b-a22f-7f16f2092aa4_1784950376672.webp";
import imgEnergo from "@assets/759f0b40-c543-43bc-b2fc-0e032748718b_1784950376671.webp";
import imgLogStack from "@/assets/generated_images/rubleniy-dom-modern.webp";
import imgLogPeel from "@assets/8aa02e43-c092-4d33-8430-a8cededf3638_1784949661339.webp";
import imgInterior from "@assets/e7de09f7-f02c-4474-be26-a58b6542179e_1784949661347.webp";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

const ADVANTAGES = [
  "Ручная рубка — защитный слой древесины сохраняется",
  "Угловые соединения прочнее, чем у промышленного бревна",
  "Сибирский кедр, сосна и лиственница — лучший материал",
  "Идеальный микроклимат: фильтрация воздуха и теплосбережение",
  "Диаметр бревна 280–500 мм — максимальная теплоёмкость",
  "Строим дома и бани под ключ",
];

const PRICES = [
  { label: "Дизайн-проект дома", value: "от 150 руб/м² по площади пола" },
  { label: "Материал", value: "кедр, сосна, лиственница" },
  { label: "Диаметр бревна", value: "280–500 мм" },
  { label: "Цена под ключ", value: "от 11 000 до 14 000 руб/м² без фундамента и кровельного материала" },
];

export default function ServicesRublenye() {
  const { sectionRef, y } = useHeroParallax();
  const [tab, setTab] = useState<"rus" | "can">("rus");

  return (
    <div>
      {/* ── Hero ── */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform" style={{ y }}>
          <RublenyeHeroVideo />
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
              Строительство
            </span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Рубленные дома из бревна
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Рубленый дом — не просто стены, а живой материал, который
              дышит и держит тепло без утеплителей. Кедр, сосна, лиственница
              из Сибири — собственная заготовка, рубка вручную, сдача под ключ.
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
                Почему выбирают рубленный дом
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                Рубленный дом — это дом из бревна, обработанного вручную
                топором. Ручная обработка «прессует» поры древесины и сохраняет
                защитный слой — заболонь. Это даёт бревну долговечность,
                которой нет у промышленного материала.
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

            <motion.div {...fade(0.15)}>
              <img
                src={imgLogStack}
                alt="Сибирский лес — лучший материал"
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Технология — full-bleed + tabs ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Технология рубки
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Как мы строим
            </h2>

            {/* Tab switcher */}
            <div className="flex border-b border-border mb-10">
              <button
                onClick={() => setTab("rus")}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === "rus"
                    ? "border-yellow-600 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Русская чаша
              </button>
              <button
                onClick={() => setTab("can")}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === "can"
                    ? "border-yellow-600 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Канадская чаша
              </button>
            </div>
          </motion.div>

          {/* ── Русская чаша ── */}
          {tab === "rus" && (
            <div className="space-y-12">
              {/* Large hero image */}
              <motion.div
                key="rus-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <img
                  src={imgRusChashaCorner}
                  alt="Рубка в русскую чашу — угловое соединение"
                  className="w-full object-cover h-[50vh] md:h-[60vh]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent flex items-center">
                  <div className="px-8 md:px-16 max-w-xl">
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                      Русская чаша
                    </h3>
                    <p className="text-white/80 leading-relaxed text-base">
                      Полукруглый паз — чаша верхнего бревна плотно прилегает
                      ко всей поверхности нижнего. Углы дома защищены
                      выступающими концами брёвен от осадков.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Details grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <motion.div {...fade(0.1)}>
                  <div className="rounded-2xl border border-border overflow-hidden mb-6">
                    {[
                      { label: "Материал", value: "деревянное бревно" },
                      { label: "Паз", value: "полукруглый, ширина 13–14 см" },
                      { label: "Рубка", value: "с остатком — «в обло»" },
                    ].map((row, i) => (
                      <div
                        key={row.label}
                        className={`flex flex-col sm:flex-row ${
                          i % 2 === 0 ? "bg-muted/40" : "bg-card"
                        }`}
                      >
                        <div className="sm:w-36 px-5 py-4 text-xs font-bold text-foreground border-b sm:border-b-0 sm:border-r border-border flex-shrink-0">
                          {row.label}
                        </div>
                        <div className="flex-1 px-5 py-4 text-sm text-muted-foreground">
                          {row.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Применяя русскую чашу, мы получаем ширину паза 13–14 см,
                    что после дополнительного утепления позволяет сохранять
                    максимум тепла. Профессионалы говорят, что русская чаша
                    даёт одни из самых тёплых углов рубленого дома.
                  </p>
                </motion.div>

                <motion.div {...fade(0.15)} className="relative rounded-2xl overflow-hidden">
                  <img
                    src={imgLogsSnow}
                    alt="Угол рубленного дома — вид снаружи"
                    className="w-full object-cover aspect-[4/3] rounded-2xl"
                  />
                </motion.div>
              </div>
            </div>
          )}

          {/* ── Канадская чаша ── */}
          {tab === "can" && (
            <div className="space-y-12">
              {/* Large hero image */}
              <motion.div
                key="can-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <img
                  src={imgCanCorner}
                  alt="Канадская чаша — угловое соединение"
                  className="w-full object-cover h-[50vh] md:h-[60vh]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent flex items-center">
                  <div className="px-8 md:px-16 max-w-xl">
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                      Канадская чаша
                    </h3>
                    <p className="text-white/80 leading-relaxed text-base">
                      Трапециевидный паз обеспечивает самозаклинивание при
                      усадке. Бревна смыкаются плотнее с каждым годом —
                      дом становится прочнее и теплее.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 3 преимущества */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    img: imgCanWall,
                    title: "Без щелей",
                    text: "Высокоточная подгонка бревна — стены выглядят сплошным массивом, утеплитель не виден.",
                  },
                  {
                    img: imgProchnost,
                    title: "Прочность",
                    text: "Угловые соединения подогнаны с точностью до миллиметра. Дом устойчив десятилетиями.",
                  },
                  {
                    img: imgEnergo,
                    title: "Энергоэффективность",
                    text: "Трапециевидная чаша исключает продувание. Дом потребляет меньше топлива на отопление.",
                  },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    {...fade(i * 0.1)}
                    className="rounded-2xl overflow-hidden border border-border bg-card"
                  >
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full object-cover aspect-[4/3]"
                    />
                    <div className="p-5">
                      <h4 className="font-serif text-xl font-medium mb-2">{card.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{card.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* ── Экологичность — full-bleed ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fade(0.1)}>
              <img
                src={imgLogPeel}
                alt="Экологичная обработка бревна"
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-xl"
              />
            </motion.div>

            <motion.div {...fade()}>
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
                Экологичность
              </span>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Природный материал без химии
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Естественный защитный слой сохраняется, потому что с бревна
                  снимается только первый внешний слой. Такой способ обработки
                  увеличивает срок службы и защищает от ветра и перепадов
                  температуры.
                </p>
                <p>
                  Северный лес — один из самых чистых в мире. Из-за жёсткого
                  климата Сибири деревья реже поражаются грибком и плесенью.
                  Мелкослойная структура обеспечивает выдающееся теплосбережение.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Микроклимат — full-bleed ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="relative rounded-2xl overflow-hidden">
            <img
              src={imgInterior}
              alt="Интерьер рубленного дома с камином"
              className="w-full object-cover h-[55vh] md:h-[65vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
              <div className="p-8 md:p-16 max-w-3xl">
                <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium">
                  Микроклимат
                </span>
                <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Живительная прохлада летом. Уютное тепло зимой.
                </h2>
                <p className="text-white/75 text-base leading-relaxed">
                  Защитный слой дерева участвует в фильтрации воздуха. Стены
                  «дышат» — создаётся микроклимат, труднодостижимый в домах
                  из любых других материалов.
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
              Цены на строительство рубленных домов
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
              Хотите рубленный дом?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Оставьте заявку — рассчитаем стоимость и подберём оптимальную
              технологию рубки под ваш проект.
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
