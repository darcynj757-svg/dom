import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_ITEMS, type GalleryItem } from "@/data/gallery-data";

// Re-export for home.tsx compatibility
export { GALLERY_ITEMS };

// Только объекты с загруженными фотографиями (в нужном порядке)
const SHOWCASE_IDS = [43, 42, 41, 40, 51, 50];
const SHOWCASE: GalleryItem[] = SHOWCASE_IDS
  .map((id) => GALLERY_ITEMS.find((i) => i.id === id)!)
  .filter(Boolean);

// ── Fullscreen lightbox ───────────────────────────────────────────────────────

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const stripRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    (strip.children[idx] as HTMLElement)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [idx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/94 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
        <X className="w-5 h-5" />
      </button>

      <button onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/25 rounded-full p-3 md:p-4 transition-colors">
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      <div
        className="flex flex-col items-center w-full max-w-5xl px-16 md:px-24"
        style={{ maxHeight: "calc(100vh - 1rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[idx]}
            src={images[idx]}
            alt={`Фото ${idx + 1}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl object-contain shadow-2xl"
            style={{ maxHeight: images.length > 1 ? "calc(100vh - 180px)" : "calc(100vh - 80px)", maxWidth: "100%", width: "auto" }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <div
            ref={stripRef}
            className="mt-3 flex gap-2 overflow-x-auto w-full justify-center"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                  i === idx ? "ring-2 ring-white scale-105 opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/25 rounded-full p-3 md:p-4 transition-colors">
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </button>
    </motion.div>
  );
}

// ── Expanded photo panel ──────────────────────────────────────────────────────

function PhotoPanel({
  item,
  onOpenPhoto,
}: {
  item: GalleryItem;
  onOpenPhoto: (index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="overflow-hidden col-span-full"
    >
      <div className="bg-muted/50 border border-border rounded-2xl p-4 md:p-6 mb-2">
        {/* Заголовок панели */}
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
          {item.title}
        </p>

        {/* Сетка фото */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {item.images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-muted"
              onClick={() => onOpenPhoto(i)}
            >
              <img
                src={src}
                alt={`${item.title} — фото ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Gallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedItem = SHOWCASE.find((i) => i.id === selectedId) ?? null;

  const handleSelect = (id: number) => {
    const isOpen = selectedId === id;
    setSelectedId(isOpen ? null : id);
    if (!isOpen) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  };

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
              Фото домов, бань и беседок, выполненных нашей компанией. Нажмите на объект, чтобы увидеть все снимки.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid + expand panel */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[8px] md:gap-[10px]">
            {SHOWCASE.map((item) => {
              const isActive = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`group relative cursor-pointer rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 ${
                    isActive ? "ring-2 ring-foreground ring-offset-2" : ""
                  }`}
                  onClick={() => handleSelect(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                    <p className="text-white text-xs md:text-sm font-medium leading-snug">
                      {item.title}
                    </p>
                    <p className="text-white/60 text-[10px] mt-0.5">
                      {item.images.length} фото — нажмите, чтобы раскрыть
                    </p>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                        Открыто ↓
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Expansion panel — spans full width, inserted after grid items */}
            <AnimatePresence>
              {selectedItem && (
                <div ref={panelRef} style={{ gridColumn: "1 / -1" }}>
                  <PhotoPanel
                    item={selectedItem}
                    onOpenPhoto={(index) =>
                      setLightbox({ images: selectedItem.images, index })
                    }
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            initialIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
