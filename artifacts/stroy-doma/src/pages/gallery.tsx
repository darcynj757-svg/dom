import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryItem } from "@/data/gallery-data";

// Re-export for home.tsx compatibility
export { GALLERY_ITEMS };

function MasonryGrid({ items, onOpen }: { items: GalleryItem[]; onOpen: (i: number) => void }) {
  const COLS = 3;
  const remainder = items.length % COLS;

  const getSpan = (index: number): number => {
    if (remainder === 0) return 1;
    const lastRowStart = items.length - remainder;
    if (index < lastRowStart) return 1;
    const posInLastRow = index - lastRowStart;
    if (remainder === 1) return 3;
    if (remainder === 2) return posInLastRow === 0 ? 2 : 1;
    return 1;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-[8px] md:gap-[10px]">
      {items.map((item, index) => {
        const span = getSpan(index);
        return (
          <div
            key={item.id}
            style={{ gridColumn: `span ${span}` }}
            className="group relative cursor-pointer rounded-xl overflow-hidden bg-muted aspect-[4/3]"
            onClick={() => onOpen(index)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        );
      })}
    </div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("Все");
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

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

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
              Наши работы
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Фото домов, бань и беседок, выполненных нашей компанией. Дома
              рубленные и из профилированного бруса, бани, беседки — всё под ключ.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter — sticky */}
      <section className="py-4 border-b border-border bg-background/80 sticky top-[72px] z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2 items-center">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setLightboxIndex(null); }}
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

      {/* Grid */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MasonryGrid items={filtered} onOpen={openLightbox} />
            </motion.div>
          </AnimatePresence>
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
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums select-none">
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
              transition={{ duration: 0.2 }}
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
