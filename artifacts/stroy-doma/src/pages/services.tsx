import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SERVICES = [
  {
    id: "profbrus",
    title: "Дома из профилированного бруса",
    image: "https://picsum.photos/seed/serv1/800/600",
    description:
      "Компания «Кедр-Томск» предлагает воспользоваться нашими мощностями для строительства своего будущего дома из профилированного бруса естественной влажности. В качестве исходного материала для сруба выступают сибирский кедр, сосна и лиственница. Максимальное сечение на входе — 200×300 мм, где 300 — это толщина стены.",
    price: "от 11 000 ₽/м²",
    highlights: [
      "Собственное производство профилированного бруса",
      "Кедр, сосна, лиственница",
      "Максимальное сечение 200×300 мм",
      "Строительство по всей России",
      "Бесплатный проект при заказе строительства",
    ],
  },
  {
    id: "rubka",
    title: "Рубленные дома",
    image: "https://picsum.photos/seed/serv2/800/600",
    description:
      "Рубленный дом — это дом, построенный из рубленного вручную бревна. Компания «Кедр-Томск» строит дома из рубленного бревна под ключ. В качестве основного материала в производстве мы используем сибирский кедр, сосну и лиственницу. Это натуральный, экологически чистый дом с особой атмосферой.",
    price: "от 13 000 ₽/м²",
    highlights: [
      "Ручная рубка опытными мастерами",
      "Кедр, сосна, лиственница",
      "Подлинный деревянный дом",
      "Строительство по всей России",
      "Гарантия на конструктив",
    ],
  },
];

const ADVANTAGES = [
  "Строим с 2001 года — более 20 лет опыта",
  "Собственное производство в г. Томске",
  "Сибирская древесина с северных участков тайги",
  "Строительство по всей России",
  "Цены от 11 000 ₽ до 16 000 ₽/м² без фундамента",
  "Бесплатный проект при заказе строительства",
  "Расчёт стоимости за 24 часа",
  "Договор с фиксированной ценой",
];

export default function Services() {
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
              Строительство
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
              Загородное строительство деревянных домов
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Компания «Кедр-Томск» предлагает услуги по строительству
              деревянного дома или коттеджа под ключ. Наша специализация —
              строительство деревянных загородных домов по типовым и
              индивидуальным проектам.
            </p>
            <div className="mt-8 p-5 rounded-2xl bg-muted/60 border border-border">
              <p className="text-sm font-medium">
                💡 Постоянно действующая услуга: при заказе строительства
                рубленного дома или дома из профилированного бруса —{" "}
                <strong>проект бесплатно!</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service types */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 space-y-24">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
                  {service.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-4">
                  <div className="font-serif text-2xl font-semibold text-primary">
                    {service.price}
                  </div>
                  <Button asChild className="rounded-full gap-2">
                    <Link href="/contacts">
                      Получить расчёт <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 md:py-24 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-12">
              Почему выбирают нас
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {ADVANTAGES.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="p-5 rounded-2xl border border-border bg-card flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-snug">{item}</span>
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
              Готовы начать строительство?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Расскажите о вашем участке и пожеланиях — мы подберём проект и
              рассчитаем стоимость в течение 24 часов.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 gap-2">
                <Link href="/contacts">
                  Оставить заявку <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link href="/projects">Смотреть проекты</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
