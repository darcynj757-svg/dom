import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Hammer, TreePine } from "lucide-react";

const PRODUCTION_SECTIONS = [
  {
    icon: TreePine,
    title: "Профилированный брус",
    href: "/production/profilirovanny-brus",
    description:
      "Профилированный брус — высокотехнологичный строительный материал, изготовленный на финском 4-х стороннем станке. Производим до 500 м³ в месяц. Кедр, сосна, лиственница.",
    image: "https://picsum.photos/seed/profbrus/800/600",
    details: ["До 500 м³ профилированного бруса в месяц", "Естественная влажность из массива дерева", "Максимальное сечение 200×300 мм"],
  },
  {
    icon: Hammer,
    title: "Столярные изделия",
    href: "/production/stolyarnyie-izdeliya",
    description:
      "В компании «Кедр-Томск» вы можете оформить индивидуальный заказ на изготовление деревянных окон, дверей, лестниц, полов и мебели на заказ в г. Томске.",
    image: "https://picsum.photos/seed/stolyar/800/600",
    details: ["Деревянные окна на заказ", "Деревянные двери и лестницы", "Деревянные полы и мебель"],
  },
  {
    icon: Layers,
    title: "Пиломатериал",
    href: "/production/pilomaterial",
    description:
      "Компания «Кедр-Томск» производит обрезной и необрезной пиломатериал. Купить произведённый нами пиломатериал по конкурентной цене в г. Томске и области.",
    image: "https://picsum.photos/seed/pilomatr/800/600",
    details: ["Обрезной и необрезной пиломатериал", "Отгрузка в любую точку России", "Наличие ж/д подъездных путей"],
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
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Производство
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
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

      {/* Production sections */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 space-y-20">
          {PRODUCTION_SECTIONS.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
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
                <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
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
                  <Link href="/contacts">
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
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
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
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
              Заказать продукцию
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Свяжитесь с нами для получения коммерческого предложения и
              расчёта стоимости.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 gap-2">
              <Link href="/contacts">
                Оставить заявку <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
