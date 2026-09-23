import { Link } from "wouter";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { FaqBlock } from "@/components/FaqBlock";
import { FAQ_KEDR } from "@/data/faq";
import imgKedrHouse from "@/assets/gallery/house-log-lake-1.webp";
import imgKedrDetail from "@/assets/gallery/house-log-lake-3.webp";
import imgKedrInterior from "@/assets/gallery/house-log-lake-5.webp";

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
  const { sectionRef, y } = useHeroParallax();

  useSeo({
    title: "Дома из кедра под ключ в Томске — кедровые срубы и брус",
    description:
      "Строим дома и бани из сибирского кедра: рубленые срубы ручной рубки и профилированный брус из кедра. Собственное производство в Томске, доставка по России, гарантия 5 лет.",
  });

  return (
    <div>
      {/* ── Hero ── */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform" style={{ y }}>
          <img src={`${import.meta.env.BASE_URL}posters/kedr-house-hero.webp`} alt="Дом из сибирского кедра" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 pt-28 md:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="block text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium mb-4">
              Сибирский кедр
            </span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Дома и бани из кедра
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Тёплый и долговечный материал сибирского леса. Рубим кедровое
              бревно вручную и производим профилированный брус в Томске —
              от заготовки до готового дома под ключ.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Intro + advantages ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fade()}>
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
                Материал
              </span>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Почему выбирают кедр
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                Кедровая древесина сочетает выразительную фактуру, природную
                защиту и мягкий микроклимат. Она подходит и для дома, и для бани,
                а натуральная поверхность красиво стареет без лишней отделки.
              </p>
              <ul className="space-y-4">
                {ADVANTAGES.map((a) => (
                  <li key={a.t} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{a.t}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{a.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fade(0.15)}>
              <img src={imgKedrHouse} alt="Дом из кедрового бревна у озера" className="w-full rounded-2xl object-cover aspect-[4/3] shadow-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Two technologies ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Технология
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
              Два способа построить из кедра
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <motion.div {...fade(0.1)} className="relative rounded-2xl overflow-hidden min-h-[360px]">
              <img src={imgKedrDetail} alt="Ручная рубка кедрового бревна" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end">
                <div className="p-7 md:p-10">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">Рубленый кедр</h3>
                  <p className="text-white/75 leading-relaxed mb-5">
                    Ручная рубка кедрового бревна сохраняет плотный внешний слой
                    древесины и делает каждый сруб индивидуальным.
                  </p>
                  <Link href="/services/rublenye-doma" className="text-sm font-semibold text-yellow-300 hover:text-yellow-200 transition-colors">
                    Подробнее о рубленых домах →
                  </Link>
                </div>
              </div>
            </motion.div>
            <motion.div {...fade(0.2)} className="rounded-2xl border border-border bg-muted/30 p-7 md:p-10 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium mb-4">Точная геометрия</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">Брус из кедра</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Профилированный брус естественной или камерной сушки даёт ровные
                стены, быструю сборку и минимум отделки.
              </p>
              <Link href="/services/profilirovanny-brus" className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                Подробнее о домах из бруса →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Microclimate ── */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="relative rounded-2xl overflow-hidden">
            <img src={imgKedrInterior} alt="Деревянный дом из кедра" className="w-full object-cover h-[48vh] md:h-[62vh]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-end">
              <div className="p-8 md:p-16 max-w-3xl">
                <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-medium">Микроклимат</span>
                <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Живой воздух и тепло натурального дерева
                </h2>
                <p className="text-white/75 text-base leading-relaxed">
                  Стены из кедра поддерживают комфортную влажность, сохраняют
                  тепло зимой и прохладу летом, наполняя дом характерным хвойным ароматом.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FaqBlock items={FAQ_KEDR} title="Вопросы о кедровых домах" />

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Рассчитаем дом из кедра</h2>
            <p className="text-muted-foreground mb-8 text-lg">Пришлём смету по вашему проекту и покажем лес, из которого будем строить.</p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/contacts#form">Оставить заявку <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
