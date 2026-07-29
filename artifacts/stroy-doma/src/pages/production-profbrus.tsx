import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ProductionNav } from "@/components/ProductionNav";
import { useSeo } from "@/hooks/useSeo";
import brusBillet from "@assets/eeebd8ef-a15c-4f1a-971c-e4195c43afb3_1784923816103.webp";
import brusProcess from "@assets/d13c2666-2783-43a9-a48a-c5d61c98e3df_1784923816103.webp";
import brusStack from "@assets/f51883c1-98dd-4cb9-89a4-dfc8e2a6c040_1784923816103.webp";
import brusMachine from "@assets/3d89f796-f08d-4bdf-bc6d-ece62f2f2e26_1784923816104.webp";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

const SPECS = [
  { label: "Размер", value: "min 150×150 мм — max 200×300 мм" },
  { label: "Станок, профиль", value: "немецкий профиль, финский 4-х сторонний станок" },
  { label: "Объёмы", value: <>до 500 м<sup>3</sup> в месяц</> },
  { label: "Материал", value: "кедр, сосна, лиственница" },
  { label: "Дополнительно", value: "обработка антисептиком" },
];

const PRICES = [
  { label: "Профилированный брус — Сосна", value: <>от 13 500 руб/м<sup>3</sup></> },
  { label: "Профилированный брус — Кедр", value: <>от 14 500 руб/м<sup>3</sup></> },
];

const STEPS = [
  {
    image: brusStack,
    title: "Сортировка",
    text: "Первый этап — сортировка прямоугольного бруса по входному размеру сечения с учётом дефектов: обзол, синева, поражение жучком. Сырьё, не подходящее по качеству, отбраковывается. Затем брус группируется по размеру сечения и ждёт очереди на профилирование.",
  },
  {
    image: brusProcess,
    title: "Строгание",
    text: "Формирование профиля бруса на станке — вся операция за один проход. При заказе с антисептической обработкой готовый брус антисептируется непосредственно после профилирования.",
  },
  {
    image: brusBillet,
    title: "Отгрузка",
    text: "При заказе профилированного бруса осуществляется отгрузка готовой партии заказчику. Если выполняется проект, брус дополнительно проходит торцевание и нарезку чашек.",
  },
];

const ADVANTAGES = [
  "Собственная производственная база в Томске",
  "Зимний заготовленный лес — меньше трещин и усадки",
  "Немецкий профиль на финском 4-х стороннем станке",
  "Антисептирование по запросу",
  "Конкурентная цена без посредников",
  "Отгрузка по всей России",
];

export default function ProductionProfBrus() {
  const [location] = useLocation();
  // /production и /production/profilirovanny-brus рендерят один компонент —
  // canonical указывает на канонический URL чтобы избежать дублированного контента
  useSeo({
    title: "Производство профилированного бруса",
    description: "Собственное производство профилированного бруса в Томске. Кедр, сосна, лиственница. Объём до 500 м³ в месяц. Немецкий профиль, финский станок.",
    canonical: "/production/profilirovanny-brus",
  });
  const { sectionRef, y } = useHeroParallax();
  return (
    <div>
      {/* ── Hero ── */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform" style={{ y }}>
          <img
            src={brusStack}
            alt="Профилированный брус — производство"
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
              Профилированный брус
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Производим из сибирского кедра, сосны и лиственницы на собственной
              базе в Томске. Немецкий профиль, финский станок — без посредников.
            </p>
          </motion.div>
        </div>
      </section>

      <ProductionNav current="profbrus" />

      {/* ── Intro + advantages ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fade()}>
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
                От производителя
              </span>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Почему стоит покупать у нас
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                Наличие собственной производственной базы гарантирует высокое качество
                продукта, точные сроки изготовления и более низкие цены. Организации
                без собственных мощностей — просто перекупщики.
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
                src={brusMachine}
                alt="Станок профилирования"
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Этапы производства ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Технология
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-12">
              Производство профилированного бруса
            </h2>
          </motion.div>

          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                {...fade(i * 0.08)}
                className="rounded-3xl overflow-hidden border border-border shadow-sm"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[420px] ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                  <div className="relative overflow-hidden lg:[direction:ltr]">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="absolute top-5 left-5 bg-background/85 backdrop-blur-sm text-foreground text-xs font-mono font-bold px-3 py-1.5 rounded-lg z-10">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="lg:[direction:ltr] flex flex-col justify-center px-8 py-12 md:px-12 lg:px-16 bg-card">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold mb-5">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">{step.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Характеристики + цена ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div {...fade()}>
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
                Характеристики
              </span>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
                Купить профилированный брус
              </h2>
              <div className="rounded-2xl border border-border overflow-hidden">
                {SPECS.map((row, i) => (
                  <div key={row.label} className={`flex flex-col sm:flex-row ${i % 2 === 0 ? "bg-muted/40" : "bg-card"}`}>
                    <div className="sm:w-52 px-5 py-4 text-xs font-semibold text-foreground uppercase tracking-wide border-b sm:border-b-0 sm:border-r border-border flex-shrink-0">
                      {row.label}
                    </div>
                    <div className="flex-1 px-5 py-4 text-sm text-muted-foreground">{row.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fade(0.1)}>
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
                Стоимость
              </span>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
                Цена
              </h2>
              <div className="rounded-2xl border border-border overflow-hidden mb-5">
                {PRICES.map((row, i) => (
                  <div key={row.label} className={`flex flex-col sm:flex-row ${i % 2 === 0 ? "bg-muted/40" : "bg-card"}`}>
                    <div className="sm:w-52 px-5 py-4 text-xs font-semibold text-foreground uppercase tracking-wide border-b sm:border-b-0 sm:border-r border-border flex-shrink-0">
                      {row.label}
                    </div>
                    <div className="flex-1 px-5 py-4 text-sm text-muted-foreground">{row.value}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic mb-1">Цена за 1 м³ по входному размеру</p>
              <p className="text-sm text-muted-foreground italic">Производство — только по предварительному заказу и предоплате. Срок от одной недели.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Оформить заказ на брус
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Расскажите о вашем проекте — рассчитаем объём, согласуем сроки и цену.
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
