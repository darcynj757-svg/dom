import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Строительство рубленного дома — Москва",
    category: "Рубленное бревно",
    image: "https://picsum.photos/seed/gal1/800/600",
  },
  {
    id: 2,
    title: "Рубленный дом из кедра — Москва",
    category: "Рубленное бревно",
    image: "https://picsum.photos/seed/gal2/800/600",
  },
  {
    id: 3,
    title: "Дом из профилированного бруса — Новосибирск",
    category: "Профилированный брус",
    image: "https://picsum.photos/seed/gal3/800/600",
  },
  {
    id: 4,
    title: "Строительство деревянного дома",
    category: "Профилированный брус",
    image: "https://picsum.photos/seed/gal4/800/600",
  },
  {
    id: 5,
    title: "Деревянная баня под ключ",
    category: "Баня",
    image: "https://picsum.photos/seed/gal5/800/600",
  },
  {
    id: 6,
    title: "Беседка из лиственницы",
    category: "Беседка",
    image: "https://picsum.photos/seed/gal6/800/600",
  },
  {
    id: 7,
    title: "Двухэтажный дом из профбруса — Томск",
    category: "Профилированный брус",
    image: "https://picsum.photos/seed/gal7/800/600",
  },
  {
    id: 8,
    title: "Рубленный коттедж — Томская область",
    category: "Рубленное бревно",
    image: "https://picsum.photos/seed/gal8/800/600",
  },
  {
    id: 9,
    title: "Дом с мансардой из кедра",
    category: "Рубленное бревно",
    image: "https://picsum.photos/seed/gal9/800/600",
  },
  {
    id: 10,
    title: "Баня с верандой",
    category: "Баня",
    image: "https://picsum.photos/seed/gal10/800/600",
  },
  {
    id: 11,
    title: "Одноэтажный дом 68 м²",
    category: "Профилированный брус",
    image: "https://picsum.photos/seed/gal11/800/600",
  },
  {
    id: 12,
    title: "Каркасная беседка",
    category: "Беседка",
    image: "https://picsum.photos/seed/gal12/800/600",
  },
];

const CATEGORIES = ["Все", "Профилированный брус", "Рубленное бревно", "Баня", "Беседка"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [lightbox, setLightbox] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  const filtered =
    activeCategory === "Все"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

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
              Фотогалерея
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium">
              Деревянные дома и бани под ключ — фото
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Фото домов, бань и беседок, выполненных нашей компанией: дома
              рубленные и дома из профилированного бруса, бани, беседки.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-border bg-muted/30 sticky top-[72px] z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group cursor-pointer"
                  onClick={() => setLightbox(item)}
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                      {item.category}
                    </span>
                    <p className="mt-1 font-medium text-sm leading-snug group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={lightbox.image}
                alt={lightbox.title}
                className="w-full rounded-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-medium">{lightbox.title}</p>
                <p className="text-white/60 text-sm mt-1">{lightbox.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
