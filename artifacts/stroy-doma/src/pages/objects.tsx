import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { GALLERY_ITEMS } from "@/data/gallery-data";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

export default function Objects() {
  useSeo({
    title: "Построенные объекты — фото домов и бань в Томске",
    description:
      "Дома и бани, построенные компанией «Кедр Томск»: рубленые срубы и дома из профилированного бруса. Фотографии готовых объектов в Томске и Томской области.",
  });

  const houses = useMemo(() => GALLERY_ITEMS.filter((g) => g.category === "Дома"), []);
  const baths = useMemo(() => GALLERY_ITEMS.filter((g) => g.category === "Бани"), []);

  const groups = [
    {
      key: "houses",
      title: "Построенные дома",
      items: houses,
      text: "Рубленые дома из кругляка и дома из профилированного бруса — от компактных дачных домов до двухэтажных коттеджей с террасами и балконами.",
      link: { href: "/services/profilirovanny-brus", label: "Как мы строим дома" },
    },
    {
      key: "baths",
      title: "Построенные бани",
      items: baths,
      text: "Бани под ключ с парной, комнатой отдыха и террасой. Собираем из бруса и рубленого бревна на собственном производстве.",
      link: { href: "/services/bani", label: "Бани под ключ" },
    },
  ];

  return (
    <div className="pt-20">
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
              Наши работы
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Построенные объекты
            </h1>
            <p className="text-lg text-muted-foreground">
              С 2001 года мы строим деревянные дома и бани в Томске, Томской области
              и отправляем домокомплекты по России. Здесь — фотографии наших готовых
              объектов: {houses.length} домов и {baths.length} бань.
            </p>
          </motion.div>
        </div>
      </section>

      {groups.map((group, gi) => (
        <section
          key={group.key}
          className={`py-16 md:py-24 ${gi % 2 === 1 ? "bg-muted/30" : ""}`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div {...fade()}>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                {group.title}
              </h2>
              <p className="text-muted-foreground max-w-2xl mb-8">{group.text}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {group.items.map((item) => (
                  <figure
                    key={item.id}
                    className="rounded-2xl overflow-hidden border border-border bg-card"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={`${item.title} — объект компании Кедр Томск`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="px-5 py-4">
                      <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.category} · Томская область
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <Link
                href={group.link.href}
                className="text-sm font-semibold text-primary"
              >
                {group.link.label} →
              </Link>
            </motion.div>
          </div>
        </section>
      ))}

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fade()} className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Хотите такой же дом?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Покажем объекты вживую, подберём проект и рассчитаем смету.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contacts#form">
                  Оставить заявку <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/gallery">Вся галерея</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
