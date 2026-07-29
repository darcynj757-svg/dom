import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, TreePine } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import brusBillet from "@assets/eeebd8ef-a15c-4f1a-971c-e4195c43afb3_1784922796788.webp";
import brusProcess from "@assets/d13c2666-2783-43a9-a48a-c5d61c98e3df_1784922796788.webp";
import brusStack from "@assets/f51883c1-98dd-4cb9-89a4-dfc8e2a6c040_1784922796788.webp";
import brusMachine from "@assets/3d89f796-f08d-4bdf-bc6d-ece62f2f2e26_1784922796789.webp";
import pilomaterialImg from "@assets/service-pilomaterial.webp";

const BRUS_STEPS = [
  {
    image: brusBillet,
    title: "Сортировка",
    text: "Первый этап — сортировка прямоугольного бруса по входному размеру сечения, с учётом всяческих дефектов: наличие обзола, синевы, поражения жучком. Сырьё, не подходящее по качеству, отбраковывается. Далее происходит формирование бруса по группам с учётом размера сечения.",
  },
  {
    image: brusProcess,
    title: "Строгание",
    text: "Производится формирование профиля бруса на станке. Вся операция совершается за один проход. При заказе обработки антисептиком производится антисептирование готового бруса.",
  },
  {
    image: brusStack,
    title: "Отгрузка",
    text: "При заказе собственно профилированного бруса осуществляется отгрузка готовой партии заказчику. Если выполняется проект, то брус проходит торцевание и нарезку чашек.",
  },
  {
    image: brusMachine,
    title: "Оборудование",
    text: "Профилирование выполняется на финском 4-х стороннем станке с немецким профилем. Мощности производства позволяют выпускать до 500 м³ профилированного бруса в месяц из кедра, сосны и лиственницы.",
  },
];

const BRUS_SPECS = [
  { label: "Размер сечения", value: "min 150×150 мм — max 200×300 мм" },
  { label: "Станок / профиль", value: "Финский 4-х сторонний, немецкий профиль" },
  { label: "Объёмы", value: "до 500 м³ в месяц" },
  { label: "Материал", value: "Кедр, сосна, лиственница" },
  { label: "Дополнительно", value: "Обработка антисептиком" },
];

const OTHER_SECTIONS = [
  {
    icon: Layers,
    title: "Пиломатериал",
    description:
      "Компания «Кедр-Томск» производит обрезной и необрезной пиломатериал. Купить произведённый нами пиломатериал по конкурентной цене в г. Томске и области.",
    image: pilomaterialImg,
    details: ["Обрезной и необрезной пиломатериал", "Отгрузка в любую точку России", "Наличие ж/д подъездных путей"],
    href: "/production/pilomaterial",
  },
];

const EQUIPMENT = [
  "Ленточная пилорама",
  "Финский 4-х сторонний станок",
  "Два башенных крана",
  "Грузовой автотранспорт с манипуляторами",
  "Ж/д подъездные пути",
  "Собственный парк спецтехники",
];

export default function Production() {
  useSeo({
    title: "Производство",
    description: "Собственное производство профилированного бруса, столярных изделий и пиломатериала в Томске. Финский 4-х сторонний станок, до 500 м³ в месяц.",
  });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="py-20 md:py-28 border-b border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            style={{ y: heroY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Производство
            </span>
            <h1 className="mt-3 font-serif text-2xl md:text-4xl lg:text-5xl font-black">
              Собственное производство в г. Томске
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Компания «Кедр-Томск» предлагает продукцию собственного
              производства. Мы изготавливаем пиломатериал различного назначения,
              а также детали внутренней и внешней отделки деревянных домов.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Профилированный брус ── */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
              <TreePine className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Профилированный брус
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">
              Профилированный брус — это высокотехнологичный строительный материал,
              изготовленный на специальном станке и имеющий определённый профиль.
              Компания «Кедр-Томск» производит профилированный брус естественной
              влажности из массива дерева. Наличие собственной производственной базы
              гарантирует высокое качество продукта, точные сроки изготовления и
              конкурентные цены.
            </p>
          </motion.div>

          {/* Specs table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
          >
            {BRUS_SPECS.map((spec) => (
              <div key={spec.label} className="p-5 rounded-2xl border border-border bg-card">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  {spec.label}
                </p>
                <p className="font-medium text-sm">{spec.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Process steps — image left, text right */}
          <h3 className="font-serif text-2xl font-bold mb-8 text-muted-foreground">
            Производство профилированного бруса
          </h3>
          <div className="space-y-8">
            {BRUS_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col sm:flex-row gap-6 items-start"
              >
                {/* Image */}
                <div className="w-full sm:w-56 flex-shrink-0">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Text */}
                <div className="flex-1 pt-1">
                  <h4 className="font-serif text-xl font-medium mb-2">{step.title}</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="rounded-full gap-2">
              <Link href="/production/profilirovanny-brus">
                Подробнее о профилированном брусе <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link href="/contacts#form">
                Оставить заявку <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Other production sections ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 space-y-20">
          {OTHER_SECTIONS.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
                  <section.icon className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  {section.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {section.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <Link href={section.href}>
                    Узнать подробнее <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Equipment */}
      <section className="py-20 md:py-24 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Производственное оборудование
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
              На нашей производственной площадке в г. Томске работают
              современные линии, обеспечивающие оперативное выполнение заказов
              и возможность отгрузки в любую точку России.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {EQUIPMENT.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                  <span className="font-medium text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Заказать продукцию
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Свяжитесь с нами для получения коммерческого предложения и
              расчёта стоимости.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 gap-2">
              <Link href="/contacts#form">
                Оставить заявку <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
