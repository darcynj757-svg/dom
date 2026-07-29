/**
 * Isolated scroll-driven 3D house section.
 *
 * Extracted from home.tsx so that the high-frequency setHouseProgress
 * state updates on every scroll frame only re-render THIS component,
 * not the entire Home page (which is 800+ lines of JSX).
 */
import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { getGltfPromise } from "@/components/3d/houseLoader";

const ScrollHouse = lazy(() => import("@/components/3d/ScrollHouse"));

const STATS = [
  { value: 25, suffix: "", label: "Лет на рынке" },
  { value: 200, suffix: "+", label: "Построенных объектов" },
  { value: 500, suffix: "", label: "М³ бруса в месяц" },
  { value: 30, suffix: "+", label: "Мастеров в команде" },
];

const CONSTRUCTION_LAYERS = [
  {
    label: "Фундамент",
    sub: "Монолитный ж/б ленточный",
    detail: "Глубина 1,8 м · арматура ø12 мм",
    side: "left" as const,
    from: 0.04,
    to: 0.17,
    y: "66%",
    // стрелка направлена вправо-вверх к каменному цоколю модели
    ax: 44, ay: -18,
  },
  {
    label: "Лаги пола",
    sub: "Лиственница 50×200 мм",
    detail: "Шаг 600 мм · антисептик",
    side: "right" as const,
    from: 0.14,
    to: 0.26,
    y: "56%",
    // стрелка направлена вниз к уровню пола
    ax: 44, ay: 30,
  },
  {
    label: "Стены",
    sub: "Профилированный брус 150×200 мм",
    detail: "Кедр сибирский · межвенцовый утеплитель",
    side: "left" as const,
    from: 0.22,
    to: 0.42,
    y: "42%",
    // стрелка почти горизонтально — стены по центру модели
    ax: 44, ay: 14,
  },
  {
    label: "Кровля",
    sub: "Металлочерепица Monterrey",
    detail: "Обрешётка 25×100 мм · гидробарьер",
    side: "right" as const,
    from: 0.37,
    to: 0.52,
    y: "26%",
    // стрелка направлена вверх-влево к крыше
    ax: 44, ay: -8,
  },
] as const;

function layerOpacity(p: number, from: number, to: number) {
  const fi = Math.min(1, Math.max(0, (p - from) / 0.04));
  const fo = Math.min(1, Math.max(0, (to - p) / 0.04));
  return fi * fo;
}

export default function ScrollHouseBlock() {
  const houseRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: houseRef, offset: ["start start", "end end"] });
  const [houseProgress, setHouseProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHouseProgress(Math.min(Math.max(v, 0), 1));
  });
  const heroSceneOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0.9]);

  // Kick off the GLB download immediately on mount — by the time the user
  // scrolls to the 3D section (especially on mobile) the file will be ready.
  useEffect(() => {
    getGltfPromise();
  }, []);

  // Mount the Canvas once the section is close — large margin so WebGL context
  // is created before the user actually reaches the section.
  const [showHouse, setShowHouse] = useState(false);
  useEffect(() => {
    const el = houseRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowHouse(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={houseRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
          {showHouse && (
            <Suspense fallback={null}>
              <ScrollHouse progress={houseProgress} />
            </Suspense>
          )}
        </motion.div>
        <div
          className="absolute inset-x-0 top-12 flex flex-col items-center text-center pointer-events-none px-4 z-10"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
            Интерактивная 3D-модель
          </span>
          <p className="font-display text-2xl md:text-3xl font-bold text-foreground/80">
            Дом строится на ваших глазах
          </p>
          <p className="mt-1 text-muted-foreground text-sm">прокрутите вниз</p>
        </div>

        {/* ── Construction layer annotations — fixed panel ───────────────── */}
        {/* Desktop: vertical column on the right; Mobile: 2×2 grid above stats */}
        <div className="absolute z-[15] pointer-events-none
          right-3 top-1/2 -translate-y-1/2 flex-col gap-2 hidden md:flex"
          aria-hidden="true"
        >
          {CONSTRUCTION_LAYERS.map((layer) => {
            const isActive = houseProgress >= layer.from && houseProgress <= layer.to + 0.1;
            return (
              <div
                key={layer.label}
                className={`bg-background/90 backdrop-blur-sm border rounded-2xl px-3 py-2.5 shadow-lg transition-all duration-300 w-52 ${
                  isActive
                    ? "border-secondary/60 shadow-secondary/10"
                    : "border-border/50 opacity-50"
                }`}
              >
                <div className="font-display text-sm font-bold text-foreground leading-tight">
                  {layer.label}
                </div>
                <div className="text-xs text-secondary font-semibold mt-0.5">
                  {layer.sub}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {layer.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: single card above the house, swaps on scroll */}
        {(() => {
          // Stretch cards evenly across the full scroll (0 → 0.95),
          // so each of the 4 cards occupies ~25% of scroll instead of
          // the narrow build-animation windows used on desktop.
          const TOTAL = 0.95;
          const normalised = Math.min(houseProgress / TOTAL, 1);
          const bestIdx = Math.min(
            CONSTRUCTION_LAYERS.length - 1,
            Math.floor(normalised * CONSTRUCTION_LAYERS.length),
          );
          const layer = CONSTRUCTION_LAYERS[bestIdx];
          const isVisible = houseProgress > 0.01;
          return (
            <div
              className="absolute z-[15] pointer-events-none inset-x-0 flex justify-center md:hidden"
              style={{ top: "21%" }}
              aria-hidden="true"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={bestIdx}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10, scale: isVisible ? 1 : 0.97 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="mx-6 w-full max-w-[280px] bg-background/90 backdrop-blur-sm border border-secondary/60 shadow-lg shadow-secondary/10 rounded-2xl px-4 py-3"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    <span className="font-display text-sm font-bold text-foreground leading-tight">
                      {layer.label}
                    </span>
                  </div>
                  <div className="text-xs text-secondary font-semibold mt-0.5 pl-3.5">
                    {layer.sub}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 pl-3.5">
                    {layer.detail}
                  </div>
                  {/* progress dots */}
                  <div className="flex gap-1 mt-2 pl-3.5">
                    {CONSTRUCTION_LAYERS.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === bestIdx ? "w-4 bg-secondary" : "w-1 bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })()}

        {/* Stats overlay */}
        <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
          <div className="container mx-auto px-4 md:px-6 pb-2 md:pb-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {STATS.map((s) => {
                const countProgress = Math.min(1, Math.max(0, houseProgress / 0.9));
                const displayed = Math.round(s.value * countProgress);
                return (
                  <div key={s.label} className="text-center">
                    <div className="font-display text-5xl md:text-6xl font-black text-foreground drop-shadow-sm">
                      {displayed}{countProgress >= 1 ? s.suffix : ""}
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-muted-foreground whitespace-nowrap">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-20 md:h-14 bg-gradient-to-b from-transparent to-background" />
        </div>

      </div>
    </section>
  );
}
