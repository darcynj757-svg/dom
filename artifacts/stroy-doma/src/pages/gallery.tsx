import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { GALLERY_ITEMS, type GalleryItem } from "@/data/gallery-data";
import { useSeo } from "@/hooks/useSeo";

// Re-export for home.tsx compatibility
export { GALLERY_ITEMS };

// Только объекты с загруженными фотографиями (в нужном порядке)
const SHOWCASE_IDS = [44, 43, 42, 41, 40, 51, 50];
const SHOWCASE: GalleryItem[] = SHOWCASE_IDS
  .map((id) => GALLERY_ITEMS.find((i) => i.id === id)!)
  .filter(Boolean);

// ── YouTube video data ────────────────────────────────────────────────────────

const SHORTS_IDS = [
  "-2hH6AgmUDE", "3njCKpzN0z4", "5PwUXGhpaC4", "7kTqbE-WztU",
  "_8h-XPBvrPk", "8QFB1sZJ_Ro", "9tYfb3VAP2w", "c5K-CE8wa3o",
  "cqkY98_9JFQ", "cyiJiutUBEs", "DfTRIGzK1DU", "DhxEc-6Y1wc",
  "f0Uz-wpQkCk", "F5BufKcV2EE", "grE36AP2-sQ", "_GsLmit-GRc",
  "gxhF2zQcPhc", "HHE_WkLjq2E", "HpxWEV3qtn8", "I919MZwLz-0",
  "i_fpJ3OLgRY", "inVHkMAjLms", "Kq3eTCdK_Z4", "krzWvPXmNJI",
  "Lcd4gEU-Ubw", "LTWzTGRy10c", "m23lCwkRpEs", "mcZicAQY6mc",
  "MUIHE5vISAc", "nnVUTO3gpBc", "OkAA5FIA1G8", "OvSs4JvwQPw",
  "pk9iGB1RRlI", "pO-Urw24U5c", "s9Ep3MO_5IA", "sWEP8ChvcrQ",
  "tv_X4KYls6E", "Uo0uBsdcBwg", "US49LmuW93s", "uXORKfV-TRs",
  "VfrCADXjuGs", "W7TQO9Dk0eU", "XqPWfOYCsoE", "Z5JKpIR6NNs",
];

const VIDEOS_IDS = ["x6RkIS8cZQQ"];

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// ── Video player modal ────────────────────────────────────────────────────────

function VideoModal({ videoId, isShort, onClose }: { videoId: string; isShort: boolean; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const embedSrc = isShort
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className={`w-full relative rounded-2xl overflow-hidden shadow-2xl ${isShort ? "max-w-sm" : "max-w-4xl"}`}
        style={{ aspectRatio: isShort ? "9/16" : "16/9" }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={embedSrc}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
}

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
      className="overflow-hidden"
    >
      <div className="bg-muted/50 border border-border rounded-2xl p-4 md:p-6 mt-3 mb-2">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-4">
          {item.title}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
          {item.images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-white"
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

// ── Video gallery tab ─────────────────────────────────────────────────────────

function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; isShort: boolean } | null>(null);

  return (
    <div className="py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6">

        {/* Regular videos */}
        {VIDEOS_IDS.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-6">Видео</h2>
            <div className="grid grid-cols-1 gap-4">
              {VIDEOS_IDS.map((id) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setActiveVideo({ id, isShort: false })}
                  className="group relative rounded-2xl overflow-hidden bg-black focus:outline-none focus:ring-2 focus:ring-foreground"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={ytThumb(id)}
                    alt="Видео"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 group-hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all duration-200 group-hover:scale-110">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Shorts */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-6">
            Shorts · {SHORTS_IDS.length} видео
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {SHORTS_IDS.map((id, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                onClick={() => setActiveVideo({ id, isShort: true })}
                className="group relative rounded-xl overflow-hidden bg-black focus:outline-none focus:ring-2 focus:ring-foreground"
                style={{ aspectRatio: "9/16" }}
              >
                <img
                  src={ytThumb(id)}
                  alt={`Short ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-60"
                  loading="lazy"
                />
                {/* Shorts badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                  <span className="text-white text-[10px] font-semibold tracking-wide">Shorts</span>
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/25 backdrop-blur-sm rounded-full p-3">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            videoId={activeVideo.id}
            isShort={activeVideo.isShort}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Gallery() {
  useSeo({
    title: "Галерея",
    description: "Фото и видео деревянных домов, бань и беседок, построенных компанией Кедр Томск в Томске и по всей России.",
  });
  const [tab, setTab] = useState<"photo" | "video">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#video") return "video";
    return "photo";
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.location.hash = tab === "video" ? "#video" : "#photo";
  }, [tab]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#video") setTab("video");
      else if (hash === "#photo") setTab("photo");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleSelect = (id: number) => {
    const isOpen = selectedId === id;
    setSelectedId(isOpen ? null : id);
    if (!isOpen) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  };

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div>
      {/* Hero + tabs */}
      <section ref={heroRef} className="pt-28 pb-8 md:pt-36 md:pb-10 border-b border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            style={{ y: heroY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">
              Галерея
            </span>
            <h1 className="mt-3 font-serif text-2xl md:text-4xl lg:text-5xl font-black">
              Наши работы
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Фото и видео домов, бань и беседок, выполненных нашей компанией.
            </p>
          </motion.div>

          {/* Tab switcher */}
          <div className="mt-8 flex gap-2">
            <button
              onClick={() => setTab("photo")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                tab === "photo"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Фотогалерея
            </button>
            <button
              onClick={() => setTab("video")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                tab === "video"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Видеогалерея
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === "video" ? "bg-white/20" : "bg-foreground/10"}`}>
                {SHORTS_IDS.length + VIDEOS_IDS.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {tab === "photo" ? (
          <motion.div
            key="photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Photo accordion list */}
            <section className="py-10 md:py-14">
              <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="flex flex-col gap-3">
                  {SHOWCASE.map((item) => {
                    const isActive = selectedId === item.id;
                    return (
                      <div key={item.id}>
                        <div
                          className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                            isActive ? "ring-2 ring-foreground ring-offset-2" : ""
                          }`}
                          style={{ aspectRatio: "16/7" }}
                          onClick={() => handleSelect(item.id)}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent flex flex-col justify-end p-5 md:p-7">
                            <p className="text-white text-base md:text-xl font-semibold leading-snug">
                              {item.title}
                            </p>
                            <p className="text-white/60 text-xs md:text-sm mt-1">
                              {item.images.length} фото · нажмите, чтобы {isActive ? "скрыть" : "раскрыть"}
                            </p>
                          </div>
                          <div className={`absolute top-4 right-4 bg-black/40 rounded-full p-2 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isActive && (
                            <div ref={panelRef}>
                              <PhotoPanel
                                item={item}
                                onOpenPhoto={(index) =>
                                  setLightbox({ images: item.images, index })
                                }
                              />
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <AnimatePresence>
              {lightbox && (
                <Lightbox
                  images={lightbox.images}
                  initialIndex={lightbox.index}
                  onClose={() => setLightbox(null)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <VideoGallery />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
