/**
 * Isolated scroll-driven 3D house section.
 *
 * Extracted from home.tsx so that the high-frequency setHouseProgress
 * state updates on every scroll frame only re-render THIS component,
 * not the entire Home page (which is 800+ lines of JSX).
 */
import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

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
    sub: "Готовим надёжное основание",
    detail: "Размечаем участок · армируем · заливаем бетон",
    side: "left" as const,
    from: 0.04,
    to: 0.17,
    y: "66%",
    // стрелка направлена вправо-вверх к каменному цоколю модели
    ax: 44, ay: -18,
  },
  {
    label: "Лаги пола",
    sub: "Собираем основание пола",
    detail: "Гидроизоляция · лаги · утепление · черновой пол",
    side: "right" as const,
    from: 0.14,
    to: 0.26,
    y: "56%",
    // стрелка направлена вниз к уровню пола
    ax: 44, ay: 30,
  },
  {
    label: "Стены",
    sub: "Поднимаем стены венец за венцом",
    detail: "Собираем сруб · утепляем стыки · проверяем геометрию",
    side: "left" as const,
    from: 0.22,
    to: 0.42,
    y: "42%",
    // стрелка почти горизонтально — стены по центру модели
    ax: 44, ay: 14,
  },
  {
    label: "Кровля",
    sub: "Закрываем дом от непогоды",
    detail: "Стропила · обрешётка · утепление · кровельное покрытие",
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

function FoundationFallback({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 z-[4] pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-[53%] h-24 w-[min(78vw,460px)] -translate-x-1/2 -translate-y-1/2 [perspective:700px] md:top-[55%] md:h-32 md:w-[min(52vw,560px)]">
        <div className="absolute inset-x-[5%] bottom-0 h-[68%] -skew-x-[10deg] rounded-[3px] bg-[#26343d] shadow-[0_18px_22px_rgba(39,49,54,0.18)] [transform:rotateX(54deg)_rotateZ(-2deg)] md:h-[74%]" />
        <div className="absolute left-[2%] top-[13%] h-[28%] w-[28%] rounded-[2px] bg-[#c8a769] shadow-[0_8px_10px_rgba(118,91,42,0.12)] [transform:rotateX(54deg)_rotateZ(-2deg)]" />
        <div className="absolute right-[7%] top-[21%] h-[21%] w-[18%] rounded-[2px] bg-[#c8a769] shadow-[0_8px_10px_rgba(118,91,42,0.12)] [transform:rotateX(54deg)_rotateZ(-2deg)]" />
        <div className="absolute left-1/2 top-[25%] h-[20%] w-[16%] -translate-x-1/2 rounded-[2px] bg-[#b89455] [transform:rotateX(54deg)_rotateZ(-2deg)]" />
      </div>
    </div>
  );
}

export default function ScrollHouseBlock() {
  const houseRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: houseRef, offset: ["start start", "end end"] });
  const [houseProgress, setHouseProgress] = useState(0);
  const [houseReady, setHouseReady] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHouseProgress(Math.min(Math.max(v, 0), 1));
  });
  const heroSceneOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0.9]);
  const BUILD_END = 0.5;
  const buildProgress = Math.min(houseProgress / BUILD_END, 1);
  const activeLayerIndex = Math.min(
    CONSTRUCTION_LAYERS.length - 1,
    Math.floor(buildProgress * CONSTRUCTION_LAYERS.length),
  );

  // Warm the lazy 3D chunk, decoder, and model cache after Hero has mounted.
  // The Canvas itself still mounts only when the user enters the block, so
  // Hero does not pay for a second visible WebGL surface.
  const [showHouse, setShowHouse] = useState(false);
  useEffect(() => {
    const el = houseRef.current;
    if (!el) return;
    let preloadStarted = false;
    let mounted = false;

    const preloadHouse = () => {
      if (preloadStarted) return;
      preloadStarted = true;
      // Mount the Canvas while the 3D section is still below the viewport.
      // Preloading only the GLB is not enough: WebGL context creation and
      // Suspense resolution can still cause a blank grid at the transition.
      setShowHouse(true);
      void import("@/components/3d/ScrollHouse").then(({ preloadHouseModel }) => {
        preloadHouseModel(window.innerWidth < 768);
      });
    };

    const activateHouse = () => {
      if (window.scrollY <= 0) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200) return;

      if (!preloadStarted && rect.top <= window.innerHeight * 2) {
        preloadHouse();
      }

       if (!mounted && rect.top <= window.innerHeight * 0.9) {
        mounted = true;
        setShowHouse(true);
        observer.disconnect();
        window.removeEventListener("scroll", activateHouse);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) activateHouse();
      },
      { rootMargin: "200% 0px 100% 0px" },
    );
    observer.observe(el);
    window.addEventListener("scroll", activateHouse, { passive: true });
    // Start preparing the model after the Hero's first effect/paint. This
    // makes the first 3D frame ready before a normal user reaches the block.
    const preloadTimer = window.setTimeout(preloadHouse, 0);
    return () => {
      window.clearTimeout(preloadTimer);
      observer.disconnect();
      window.removeEventListener("scroll", activateHouse);
    };
  }, []);

  return (
    <section
      ref={houseRef}
      data-first-screen-3d
      className="relative h-[500vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
          <FoundationFallback visible={!houseReady} />
          {showHouse ? (
            <div className="absolute inset-0 z-[5]">
              <Suspense fallback={null}>
                <ScrollHouse
                  progress={houseProgress}
                  onReady={() => setHouseReady(true)}
                />
              </Suspense>
            </div>
          ) : null}
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
        {/* The same progressive construction map stays visible on desktop and mobile. */}
        <div className="absolute z-[15] pointer-events-none
          inset-x-6 top-[17%] flex max-w-[420px] ml-auto flex-col gap-2
          md:inset-x-auto md:right-3 md:top-1/2 md:w-52 md:max-w-none md:-translate-y-1/2"
        >
          {CONSTRUCTION_LAYERS.map((layer, layerIndex) => {
            const isActive = layerIndex === activeLayerIndex;
            const isBuilt =
              buildProgress >= (layerIndex + 1) / CONSTRUCTION_LAYERS.length;
            const isUpcoming = !isActive && !isBuilt;
            return (
              <div
                key={layer.label}
                  className={`relative w-full bg-background/90 backdrop-blur-sm border rounded-2xl px-3 py-2.5 shadow-lg transition-all duration-300 ${
                  isActive
                     ? "border-secondary shadow-secondary/25 scale-[1.03]"
                     : isUpcoming
                       ? "border-border/50 opacity-45"
                       : "border-secondary/35 opacity-85"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                      isBuilt
                        ? "bg-secondary text-secondary-foreground"
                        : isActive
                          ? "border border-secondary text-secondary"
                          : "border border-border text-muted-foreground"
                    }`}
                  >
                    {isBuilt ? "✓" : layerIndex + 1}
                  </span>
                  <div className="min-w-0">
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
                </div>
                {isActive ? (
                  <div className="absolute inset-x-3 -bottom-px h-0.5 overflow-hidden rounded-full bg-secondary/20">
                    <div
                      className="h-full rounded-full bg-secondary transition-[width] duration-150"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.min(
                            100,
                            ((buildProgress * CONSTRUCTION_LAYERS.length -
                              layerIndex) *
                              100),
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

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
