import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { FaqBlock } from "@/components/FaqBlock";
import { FAQ_BANI, PRICE_FROM, fmtRub } from "@/data/faq";
import { PROJECTS } from "@/data/projects";
import { ProjectMiniCard } from "@/components/ProjectMiniCard";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

const STEPS = [
  { t: "Замер и проект", d: "Выезжаем на участок, уточняем размеры, планировку парной и моечной, подбираем печь." },
  { t: "Фундамент", d: "Свайно-ростверковый или ленточный — 3–7 дней." },
  { t: "Сруб или коробка", d: "Собираем сруб ручной рубки либо коробку из профилированного бруса — 2–4 недели." },
  { t: "Кровля и окна", d: "Стропильная система, кровля, окна и двери в обсадных коробках." },
  { t: "Парная и отделка", d: "Печь, дымоход, термоизоляция, вагонка, полки, электрика и вода." },
];

const INCLUDED = [
  "Проект и смета",
  "Фундамент",
  "Сруб или брусовая коробка",
  "Кровля и водосток",
  "Окна и двери",
  "Печь и дымоход",
  "Отделка парной и комнаты отдыха",
  "Гарантия 5 лет",
];

export default function ServicesBani() {
  useSeo({
    title: "Бани под ключ в Томске — строительство бань из бруса и бревна",
    description: `Строим бани под ключ в Томске и Томской области: из профилированного бруса от ${fmtRub(PRICE_FROM.bathBrus)} ₽/м², рубленые от ${fmtRub(PRICE_FROM.bathRubleny)} ₽/м². Своё производство, гарантия 5 лет, срок 1,5–3 месяца.`,
  });

  const bathProjects = PROJECTS.filter((p) => p.category === "bath").slice(0, 3);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
              Бани под ключ
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Строительство бань в Томске
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Рубленые бани и бани из профилированного бруса под ключ — от фундамента
              до готовой парной. Лес заготавливаем и обрабатываем сами, поэтому
              держим цену и отвечаем за качество каждого венца.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contacts#form">
                  Рассчитать баню <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/projects">Смотреть проекты</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prices */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Сколько стоит баня
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden mb-4">
              {[
                { label: "Баня из профилированного бруса", value: `от ${fmtRub(PRICE_FROM.bathBrus)} ₽ за м²` },
                { label: "Рубленая баня", value: `от ${fmtRub(PRICE_FROM.bathRubleny)} ₽ за м²` },
                { label: "Фундамент", value: `от ${fmtRub(PRICE_FROM.foundation)} ₽ за м²` },
                { label: "Отделка под ключ", value: `от ${fmtRub(PRICE_FROM.finishing)} ₽ за м²` },
                { label: "Срок строительства", value: "1,5–3 месяца под ключ" },
                { label: "Гарантия", value: "5 лет на сруб и монтаж" },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-col sm:flex-row ${i % 2 === 0 ? "bg-muted/40" : "bg-card"}`}
                >
                  <div className="sm:w-72 px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wide border-b sm:border-b-0 sm:border-r border-border flex-shrink-0">
                    {row.label}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">{row.value}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">
              Цены ориентировочные. Точный расчёт — после консультации и составления сметы.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Included */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Что входит в баню под ключ
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {INCLUDED.map((it) => (
                <li key={it} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Этапы работ
            </h2>
            <ol className="space-y-6">
              {STEPS.map((s, i) => (
                <li key={s.t} className="flex gap-5">
                  <span className="font-serif text-2xl font-bold text-primary w-8 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold mb-1">{s.t}</h3>
                    <p className="text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      {bathProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div {...fade()}>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
                Проекты бань
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bathProjects.map((p) => (
                  <ProjectMiniCard key={p.id} project={p} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <FaqBlock items={FAQ_BANI} title="Вопросы о строительстве бань" />

      {/* CTA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Посчитаем вашу баню
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Оставьте заявку — подберём размер, печь и комплектацию под ваш бюджет.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/contacts#form">
                Получить расчёт <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
