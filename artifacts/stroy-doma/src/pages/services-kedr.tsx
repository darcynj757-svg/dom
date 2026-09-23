import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { FaqBlock } from "@/components/FaqBlock";
import { FAQ_KEDR } from "@/data/faq";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

const ADVANTAGES = [
  { t: "Плотная смолистая древесина", d: "Кедр меньше растрескивается и деформируется, чем сосна, и дольше сохраняет геометрию венца." },
  { t: "Стойкость к влаге и гниению", d: "Природные смолы защищают древесину, поэтому кедр хорошо ведёт себя в бане и во влажном климате." },
  { t: "Тепло и микроклимат", d: "Низкая теплопроводность и фитонциды кедра создают в доме ровный тёплый микроклимат и характерный аромат." },
  { t: "Фактура", d: "Розовато-медовый оттенок и выразительная текстура — кедровой стене не нужна дополнительная отделка." },
];

export default function ServicesKedr() {
  useSeo({
    title: "Дома из кедра под ключ в Томске — кедровые срубы и брус",
    description:
      "Строим дома и бани из сибирского кедра: рубленые срубы ручной рубки и профилированный брус из кедра. Собственное производство в Томске, доставка по России, гарантия 5 лет.",
  });

  return (
    <div className="pt-20">
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
              Сибирский кедр
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Дома и бани из кедра
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Кедр — самый тёплый и долговечный материал сибирского леса. Мы рубим из
              кедрового бревна вручную и делаем профилированный брус из кедра на
              собственном производстве в Томске.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contacts#form">
                  Получить расчёт <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/projects">Проекты домов</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Почему кедр
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {ADVANTAGES.map((a) => (
                <div key={a.t}>
                  <div className="flex items-start gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <h3 className="font-semibold">{a.t}</h3>
                  </div>
                  <p className="text-muted-foreground pl-8">{a.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Два способа построить из кедра
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/services/rublenye-doma"
                className="block rounded-2xl border border-border p-6 hover:border-primary transition-colors"
              >
                <h3 className="font-serif text-xl font-bold mb-2">Рубленый кедр</h3>
                <p className="text-muted-foreground mb-4">
                  Ручная рубка кедрового бревна: сохраняется плотный внешний слой
                  древесины, каждый сруб индивидуален.
                </p>
                <span className="text-sm font-semibold text-primary">
                  Подробнее о рубленых домах →
                </span>
              </Link>
              <Link
                href="/services/profilirovanny-brus"
                className="block rounded-2xl border border-border p-6 hover:border-primary transition-colors"
              >
                <h3 className="font-serif text-xl font-bold mb-2">Брус из кедра</h3>
                <p className="text-muted-foreground mb-4">
                  Профилированный брус камерной или естественной сушки — ровные стены,
                  быстрая сборка, минимум отделки.
                </p>
                <span className="text-sm font-semibold text-primary">
                  Подробнее о домах из бруса →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FaqBlock items={FAQ_KEDR} title="Вопросы о кедровых домах" />

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Рассчитаем дом из кедра
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Пришлём смету по вашему проекту и покажем лес, из которого будем строить.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/contacts#form">
                Оставить заявку <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
