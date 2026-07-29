import { Link } from "wouter";
import { motion } from "framer-motion";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ProductionNav } from "@/components/ProductionNav";
import stolyarImg from "@assets/service-stolyar.webp";
import imgOkna from "@assets/173017b4-cdfd-43a0-9824-03cbb196a96a_1784946058715.webp";
import imgDveri from "@assets/31740c1f-d8fd-4ff6-a257-53f608251839_1784946058714.webp";
import imgLestnitsy from "@assets/ebae3ced-6579-4e4f-8128-19de972fc245_копия_1784946058715.webp";
import imgPoly from "@assets/18a60efc-2f70-4a7f-a572-e150bd4aa961_1784946058716.webp";
import imgMebel from "@assets/e061ba1e-b3dd-4565-ac3d-fae2c23fc4d4_1784946058716.webp";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

const ITEMS = [
  {
    num: "01",
    title: "Деревянные окна",
    image: imgOkna,
    description:
      "Деревянные окна легко адаптируются к любому дизайну интерьера и создают уютную атмосферу. В отличие от алюминиевых и пластиковых аналогов, изготавливаются по индивидуальному проекту — без ограничений по форме и стилю.",
  },
  {
    num: "02",
    title: "Деревянные двери",
    image: imgDveri,
    description:
      "Каждая дверь создаётся по индивидуальным размерам и пожеланиям заказчика. Массив кедра, сосны или лиственницы обеспечивает долговечность и экологичность изделия.",
  },
  {
    num: "03",
    title: "Деревянные лестницы",
    image: imgLestnitsy,
    description:
      "Лестница по индивидуальному проекту с учётом планировки помещения — не просто функциональный элемент, но и украшение дома. Изготавливаем маршевые, винтовые и комбинированные конструкции.",
  },
  {
    num: "04",
    title: "Деревянные полы",
    image: imgPoly,
    description:
      "Напольные покрытия из массива дерева. Натуральный материал создаёт здоровый микроклимат в доме и прекрасно сочетается с любым интерьером.",
  },
  {
    num: "05",
    title: "Мебель для вашего дома",
    image: imgMebel,
    description:
      "Изготавливаем мебель по индивидуальным размерам и эскизам из сибирского кедра, сосны и лиственницы. Каждое изделие создаётся с учётом особенностей вашего пространства.",
  },
];

export default function ProductionStolyar() {
  const { sectionRef, y } = useHeroParallax();
  return (
    <div>
      {/* ── Hero ── */}
      <section ref={sectionRef as React.RefObject<HTMLElement>} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform" style={{ y }}>
          <img
            src={stolyarImg}
            alt="Столярное производство"
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
              Столярные изделия
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Окна, двери, лестницы, полы и мебель — изготавливаем по
              индивидуальным проектам из сибирского кедра, сосны и лиственницы.
            </p>
          </motion.div>
        </div>
      </section>

      <ProductionNav current="stolyar" />

      {/* ── Intro ── */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl text-muted-foreground leading-relaxed text-lg"
          >
            Выбирая дерево в качестве главного материала для внутреннего убранства,
            вы получаете бесконечные возможности для интерьерных решений. В отличие
            от алюминиевых и пластиковых аналогов, деревянные изделия адаптируются
            к любому дизайну и создают уютную атмосферу — без ограничений по форме и стилю.
          </motion.p>
        </div>
      </section>

      {/* ── Изделия — крупные плитки ── */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()}>
            <span className="text-xs uppercase tracking-[0.3em] text-yellow-600 font-medium">
              Ассортимент
            </span>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
              Что мы изготавливаем
            </h2>
          </motion.div>

          <div className="space-y-5">
            {ITEMS.map((item, i) => (
              <motion.div
                key={item.num}
                {...fade(i * 0.07)}
                className="rounded-3xl overflow-hidden border border-border shadow-sm"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[420px] ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                  {/* Image */}
                  <div className="relative overflow-hidden group lg:[direction:ltr]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-5 left-5 bg-background/85 backdrop-blur-sm text-foreground text-xs font-mono font-bold px-3 py-1.5 rounded-lg z-10">
                      {item.num}
                    </span>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  {/* Text */}
                  <div className="lg:[direction:ltr] flex flex-col justify-center px-8 py-12 md:px-12 lg:px-16 bg-card">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-5">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base mb-8">
                      {item.description}
                    </p>
                    <Link
                      href={`/contacts?from=${encodeURIComponent(item.title)}#form`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group/link self-start border-b border-border hover:border-foreground pb-1"
                    >
                      Заказать
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Оформить индивидуальный заказ
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Расскажите о вашем проекте — подберём материал, рассчитаем стоимость
              и согласуем сроки изготовления.
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
