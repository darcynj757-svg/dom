import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Real project images
import house68Ext1 from "@/assets/houses/house-68-ext-1.png";
import house68Ext2 from "@/assets/houses/house-68-ext-2.png";
import house71Ext1 from "@/assets/houses/house-71-ext-1.png";
import house71Ext2 from "@/assets/houses/house-71-ext-2.png";
import house89Ext1 from "@/assets/houses/house-89-ext-1.png";
import house89Ext2 from "@/assets/houses/house-89-ext-2.png";
import house123Ext from "@/assets/houses/house-123-ext.png";
import house126Ext1 from "@/assets/houses/house-126-ext-1.png";
import house126Ext2 from "@/assets/houses/house-126-ext-2.png";
import house134Ext from "@/assets/houses/house-134-ext.png";
import house143Ext1 from "@/assets/houses/house-143-ext-1.png";
import house143Ext2 from "@/assets/houses/house-143-ext-2.png";
import house159Ext from "@/assets/houses/house-159-ext.png";
import house187Ext1 from "@/assets/houses/house-187-ext-1.png";
import house187Ext2 from "@/assets/houses/house-187-ext-2.png";
import house217Ext from "@/assets/houses/house-217-ext.png";
import house236Ext from "@/assets/houses/house-236-ext.png";
import house251Ext1 from "@/assets/houses/house-251-ext-1.png";
import house251Ext2 from "@/assets/houses/house-251-ext-2.png";
import bath32Ext1 from "@/assets/baths/bath-32-ext-1.png";
import bath32Ext2 from "@/assets/baths/bath-32-ext-2.png";
import bath35Ext1 from "@/assets/baths/bath-35-ext-1.png";
import bath35Ext2 from "@/assets/baths/bath-35-ext-2.png";
import bath167Ext1 from "@/assets/baths/bath-167-ext-1.png";
import bath167Ext2 from "@/assets/baths/bath-167-ext-2.png";

export const GALLERY_ITEMS = [
  { id: 1,  title: "Одноэтажный дом из кругляка 68 м²",         category: "Рубленное бревно",    image: house68Ext1 },
  { id: 2,  title: "Кругляк 68 м² — вид сбоку",                  category: "Рубленное бревно",    image: house68Ext2 },
  { id: 3,  title: "Дом из профбруса 71 м²",                      category: "Профилированный брус", image: house71Ext1 },
  { id: 4,  title: "Профбрус 71 м² — фасад",                      category: "Профилированный брус", image: house71Ext2 },
  { id: 5,  title: "Двухэтажный дом из бруса 89 м²",              category: "Профилированный брус", image: house89Ext1 },
  { id: 6,  title: "Профбрус 89 м² — терраса",                    category: "Профилированный брус", image: house89Ext2 },
  { id: 7,  title: "Дом из профбруса 123 м²",                     category: "Профилированный брус", image: house123Ext },
  { id: 8,  title: "Дом из профбруса 126 м² — вид 1",             category: "Профилированный брус", image: house126Ext1 },
  { id: 9,  title: "Дом из профбруса 126 м² — вид 2",             category: "Профилированный брус", image: house126Ext2 },
  { id: 10, title: "Дом из профбруса 134 м²",                     category: "Профилированный брус", image: house134Ext },
  { id: 11, title: "Двухэтажный дом из бруса 143 м² — вид 1",     category: "Профилированный брус", image: house143Ext1 },
  { id: 12, title: "Двухэтажный дом из бруса 143 м² — вид 2",     category: "Профилированный брус", image: house143Ext2 },
  { id: 13, title: "Дом из бруса 159 м²",                         category: "Рубленное бревно",    image: house159Ext },
  { id: 14, title: "Дом с панорамным остеклением 187 м² — вид 1", category: "Профилированный брус", image: house187Ext1 },
  { id: 15, title: "Дом с панорамным остеклением 187 м² — вид 2", category: "Профилированный брус", image: house187Ext2 },
  { id: 16, title: "Дом из профбруса 217 м²",                     category: "Профилированный брус", image: house217Ext },
  { id: 17, title: "Дом из профбруса 236 м²",                     category: "Профилированный брус", image: house236Ext },
  { id: 18, title: "Коттедж из профбруса 251 м² — вид 1",         category: "Профилированный брус", image: house251Ext1 },
  { id: 19, title: "Коттедж из профбруса 251 м² — вид 2",         category: "Профилированный брус", image: house251Ext2 },
  { id: 20, title: "Баня 32 м² — вид 1",                          category: "Баня",                image: bath32Ext1 },
  { id: 21, title: "Баня 32 м² — вид 2",                          category: "Баня",                image: bath32Ext2 },
  { id: 22, title: "Баня 35 м² — вид 1",                          category: "Баня",                image: bath35Ext1 },
  { id: 23, title: "Баня 35 м² — вид 2",                          category: "Баня",                image: bath35Ext2 },
  { id: 24, title: "Баня 167 м² — вид 1",                         category: "Баня",                image: bath167Ext1 },
  { id: 25, title: "Баня 167 м² — вид 2",                         category: "Баня",                image: bath167Ext2 },
];

const CATEGORIES = ["Все", "Профилированный брус", "Рубленное бревно", "Баня"];

type GalleryItem = (typeof GALLERY_ITEMS)[0];

function MasonryGrid({ items, onOpen }: { items: GalleryItem[]; onOpen: (i: number) => void }) {
  return (
    <div
      style={{
        columns: "var(--masonry-cols, 4)",
        columnGap: "10px",
      }}
      className="[--masonry-cols:2] sm:[--masonry-cols:3] lg:[--masonry-cols:4]"
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className="break-inside-avoid mb-[10px] group relative cursor-pointer rounded-xl overflow-hidden bg-muted"
          onClick={() => onOpen(index)}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-0.5">
              {item.category}
            </span>
            <p className="text-white text-xs md:text-sm font-medium leading-snug">
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Все"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next]);

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

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
      <section className="py-6 border-b border-border bg-background/80 sticky top-[72px] z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-muted/60 border border-border hover:border-foreground/30 hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto self-center text-sm text-muted-foreground tabular-nums">
              {filtered.length} фото
            </span>
          </div>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <MasonryGrid items={filtered} onOpen={openLightbox} />
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums">
              {lightboxIndex + 1} / {filtered.length}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 md:left-6 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-medium">{currentItem.title}</p>
                <p className="text-white/50 text-sm mt-1">{currentItem.category}</p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 md:right-6 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
