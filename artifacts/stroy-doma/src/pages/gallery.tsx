import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryItem } from "@/data/gallery-data";

// Re-export for home.tsx compatibility
export { GALLERY_ITEMS };

// ── Grid ─────────────────────────────────────────────────────────────────────

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
        const hasMore = item.images.length > 1;
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
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-0.5">
                {item.category}
              </span>
              <p className="text-white text-xs md:text-sm font-medium leading-snug">
                {item.title}
              </p>
            </div>
            {/* «Ещё фото» бейдж */}
            {hasMore && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <Images className="w-3 h-3" />
                <span>{item.images.length}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

interface LightboxProps {
  item: GalleryItem;
  itemIndex: number;
  total: number;
  onClose: () => void;
  onPrevItem: () => void;
  onNextItem: () => void;
}

function Lightbox({ item, itemIndex, total, onClose, onPrevItem, onNextItem }: LightboxProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  // Сбрасываем на первое фото при смене объекта
  useEffect(() => {
    setPhotoIndex(0);
  }, [item.id]);

  // Прокручиваем стрип к активной миниатюре
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.children[photoIndex] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [photoIndex]);

  const prevPhoto = useCallback(() => {
    setPhotoIndex((i) => (i - 1 + item.images.length) % item.images.length);
  }, [item.images.length]);

  const nextPhoto = useCallback(() => {
    setPhotoIndex((i) => (i + 1) % item.images.length);
  }, [item.images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prevPhoto, nextPhoto]);

  const hasStrip = item.images.length > 1;
  const currentSrc = item.images[photoIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Закрыть */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Счётчик фото + навигация по объектам */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 select-none">
        <button
          onClick={(e) => { e.stopPropagation(); onPrevItem(); }}
          className="text-white/40 hover:text-white/80 transition-colors text-xs flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" />
          <span className="hidden md:inline">объект</span>
        </button>
        <span className="text-white/50 text-sm tabular-nums">
          {hasStrip ? `${photoIndex + 1} / ${item.images.length}` : `${itemIndex + 1} / ${total}`}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onNextItem(); }}
          className="text-white/40 hover:text-white/80 transition-colors text-xs flex items-center gap-1"
        >
          <span className="hidden md:inline">объект</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Большие стрелки — листать фото текущего дома */}
      <button
        onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/25 rounded-full p-2.5 md:p-4 z-10"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Центральная зона */}
      <div
        className="flex flex-col items-center w-full max-w-5xl px-16 md:px-24"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Главное фото */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSrc}
            src={currentSrc}
            alt={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl object-contain shadow-2xl"
            style={{
              maxHeight: hasStrip ? "calc(100vh - 210px)" : "calc(100vh - 140px)",
              maxWidth: "100%",
              width: "auto",
            }}
          />
        </AnimatePresence>

        {/* Подпись */}
        <div className="mt-3 text-center shrink-0">
          <p className="text-white font-medium text-sm md:text-base">{item.title}</p>
        </div>

        {/* Стрип миниатюр */}
        {hasStrip && (
          <div
            ref={stripRef}
            className="mt-3 flex gap-2 overflow-x-auto scroll-smooth w-full justify-center"
            style={{ scrollbarWidth: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.images.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setPhotoIndex(i); }}
                className={`shrink-0 w-14 h-14 md:w-18 md:h-18 rounded-lg overflow-hidden transition-all duration-200 ${
                  i === photoIndex
                    ? "ring-2 ring-white opacity-100 scale-105"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <img src={src} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Большая стрелка вправо */}
      <button
        onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/25 rounded-full p-2.5 md:p-4 z-10"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </button>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("Все");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Все"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevItem = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const nextItem = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

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
              {filtered.length} объектов
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
          <Lightbox
            key={lightboxIndex}
            item={currentItem}
            itemIndex={lightboxIndex}
            total={filtered.length}
            onClose={closeLightbox}
            onPrevItem={prevItem}
            onNextItem={nextItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
