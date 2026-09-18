/**
 * Isolated scroll-driven 3D house section.
 *
 * Extracted from home.tsx so that the high-frequency setHouseProgress
 * state updates on every scroll frame only re-render THIS component,
 * not the entire Home page (which is 800+ lines of JSX).
 */
import { useRef, useState, useEffect, useCallback, Suspense, lazy } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

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
    description:
      "Размечаем участок, готовим грунт, собираем арматуру и заливаем прочное основание.",
    mobileDescription: "Готовим прочное основание, защищаем его от влаги и подготавливаем к монтажу дома.",
    side: "left" as const,
    from: 0.04,
    to: 0.17,
    y: "66%",
    // стрелка направлена вправо-вверх к каменному цоколю модели
    ax: 44, ay: -18,
  },
  {
    label: "Лаги пола",
    description:
      "Защищаем фундамент от влаги, укладываем лаги и утепляем пол.",
    mobileDescription: "Укладываем лаги и утепление, чтобы пол был тёплым, ровным и защищённым от влаги.",
    side: "right" as const,
    from: 0.14,
    to: 0.26,
    y: "56%",
    // стрелка направлена вниз к уровню пола
    ax: 44, ay: 30,
  },
  {
    label: "Стены",
    description:
      "Собираем стены венец за венцом, соединяем углы и формируем проёмы.",
    mobileDescription: "Собираем стены венец за венцом, проверяем соединения и формируем будущие комнаты.",
    side: "left" as const,
    from: 0.22,
    to: 0.42,
    y: "42%",
    // стрелка почти горизонтально — стены по центру модели
    ax: 44, ay: 14,
  },
  {
    label: "Кровля",
    description:
      "Монтируем стропила, утепляем кровлю и защищаем дом от осадков.",
    mobileDescription: "Монтируем кровлю и надёжно защищаем дом от дождя, снега и сильного ветра на весь срок службы.",
    side: "right" as const,
    from: 0.37,
    to: 0.52,
    y: "26%",
    // стрелка направлена вверх-влево к крыше
    ax: 44, ay: -8,
  },
  {
    label: "Крыша",
    description:
      "Укладываем покрытие, ставим водостоки и проверяем все узлы.",
    mobileDescription: "Устанавливаем покрытие и водостоки, чтобы дом был защищён от осадков в любую погоду.",
    side: "left" as const,
    from: 0.49,
    to: 0.64,
    y: "20%",
    ax: 44, ay: -12,
  },
  {
    label: "Отделка",
    description:
      "Проверяем соединения, выполняем отделку и готовим дом к заселению.",
    mobileDescription: "Проверяем детали, выполняем отделку и готовим дом к заселению.",
    side: "right" as const,
    from: 0.61,
    to: 0.78,
    y: "30%",
    ax: 44, ay: 10,
  },
  {
    label: "Готово",
    description:
      "Дом готов к жизни: тёплый, надёжный и рассчитан на долгие годы.",
    mobileDescription: "Дом готов к жизни — тёплый, надёжный и рассчитанный на долгие годы.",
    side: "left" as const,
    from: 0.76,
    to: 0.98,
    y: "38%",
    ax: 44, ay: 4,
  },
] as const;

// Keep the story milestones aligned with what the model visibly reveals.
// The dark roof starts fading in at 70% inside ScrollHouse's final orbit.
const CONSTRUCTION_STAGE_STARTS = [0, 0.12, 0.24, 0.40, 0.70, 0.80, 0.90] as const;
const CONSTRUCTION_STAGE_ENDS = [0.12, 0.24, 0.40, 0.70, 0.80, 0.90, 0.96] as const;

function layerOpacity(p: number, from: number, to: number) {
  const fi = Math.min(1, Math.max(0, (p - from) / 0.04));
  const fo = Math.min(1, Math.max(0, (to - p) / 0.04));
  return fi * fo;
}

function ImmediateFoundation({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-[2] overflow-hidden transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 56%, rgba(210, 202, 190, 0.38), rgba(255, 255, 255, 0) 48%)",
      }}
    >
      <svg
        viewBox="0 0 800 500"
        className="absolute left-1/2 top-[58%] w-[min(96vw,900px)] -translate-x-1/2 -translate-y-1/2"
      >
        <defs>
          <linearGradient id="foundation-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ddd8cf" />
            <stop offset="1" stopColor="#aaa298" />
          </linearGradient>
          <linearGradient id="foundation-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#aaa299" />
            <stop offset="1" stopColor="#817a72" />
          </linearGradient>
          <filter id="foundation-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#554c43" floodOpacity="0.28" />
          </filter>
        </defs>
        <g opacity="0.38" stroke="#aa9e90" strokeWidth="1">
          <path d="M55 380 400 220 745 380 400 492Z" fill="none" />
          <path d="M125 402 400 274 675 402" fill="none" />
          <path d="M200 426 400 333 600 426" fill="none" />
          <path d="M275 450 400 392 525 450" fill="none" />
          <path d="M150 336 400 492M250 290 500 450M350 244 600 426M450 244 675 402M550 290 745 380" />
        </g>
        <g filter="url(#foundation-shadow)">
          <path d="M205 320 405 228 610 324 400 422Z" fill="url(#foundation-top)" />
          <path d="M205 320 400 422 400 470 205 366Z" fill="url(#foundation-front)" />
          <path d="M400 422 610 324 610 370 400 470Z" fill="#918980" />
          <path
            d="M283 320 405 264 530 322 400 382Z"
            fill="#7d766e"
            opacity="0.7"
          />
          <path
            d="M304 319 405 273 509 322 400 372Z"
            fill="#f5f1e9"
            opacity="0.92"
          />
        </g>
      </svg>
    </div>
  );
}

export default function ScrollHouseBlock() {
  const houseRef = useRef<HTMLDivElement>(null);
  const [houseModelReady, setHouseModelReady] = useState(false);
  const handleHouseModelReady = useCallback(() => {
    setHouseModelReady(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: houseRef, offset: ["start start", "end end"] });
  // Keep the scroll-linked scene on a MotionValue so the 3D canvas can update
  // on the render loop without forcing this whole block through React on every
  // wheel/touch event.
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });
  const [houseProgress, setHouseProgress] = useState(0);
  const renderedProgressRef = useRef(0);
  const pendingProgressRef = useRef(0);
  const progressFrameRef = useRef<number | null>(null);
  useMotionValueEvent(smoothScrollProgress, "change", (v) => {
    pendingProgressRef.current = v;
    if (progressFrameRef.current !== null) return;

    progressFrameRef.current = requestAnimationFrame(() => {
      progressFrameRef.current = null;
      const nextProgress = Math.min(Math.max(pendingProgressRef.current, 0), 1);
      // The detailed stage UI does not need sub-pixel scroll updates. Capping
      // these React updates keeps the card text responsive without competing
      // with the WebGL render loop.
      if (
        Math.abs(nextProgress - renderedProgressRef.current) < 0.003 &&
        nextProgress !== 0 &&
        nextProgress !== 1
      ) {
        return;
      }
      renderedProgressRef.current = nextProgress;
      setHouseProgress(nextProgress);
    });
  });
  useEffect(() => {
    const initialProgress = Math.min(Math.max(smoothScrollProgress.get(), 0), 1);
    renderedProgressRef.current = initialProgress;
    setHouseProgress(initialProgress);
  }, [smoothScrollProgress]);
  useEffect(() => {
    return () => {
      if (progressFrameRef.current !== null) {
        cancelAnimationFrame(progressFrameRef.current);
      }
    };
  }, []);
  const heroSceneOpacity = useTransform(smoothScrollProgress, [0.92, 1], [1, 0.9]);
  const nextStageIndex = CONSTRUCTION_STAGE_STARTS.findIndex(
    (stageStart) => houseProgress < stageStart,
  );
  const activeLayerIndex =
    nextStageIndex === -1
      ? CONSTRUCTION_LAYERS.length - 1
      : Math.max(0, nextStageIndex - 1);

  // Warm the lazy 3D chunk, decoder, and model cache after Hero has mounted.
  // The Canvas itself still mounts only when the user enters the block, so
  // Hero does not pay for a second visible WebGL surface.
  const [showHouse, setShowHouse] = useState(false);
  const [mobileModelHint, setMobileModelHint] = useState<boolean | null>(null);
  useEffect(() => {
    const el = houseRef.current;
    if (!el) return;
    let preloadStarted = false;
    let mounted = false;

    const preloadHouse = () => {
      if (preloadStarted) return;
      preloadStarted = true;
      const isMobile = window.innerWidth < 768;
      const variant = "optimized";
      const modelFile = "house-mobile.glb";
      const modelUrl = `${import.meta.env.BASE_URL}${modelFile}`.replace(
        /([^:])\/\//g,
        "$1/",
      );
      if (!document.querySelector(`link[data-house-model-preload="${variant}"]`)) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "fetch";
        link.crossOrigin = "anonymous";
        link.href = modelUrl;
        link.dataset.houseModelPreload = variant;
        document.head.appendChild(link);
      }
      // Mount the Canvas while the 3D section is still below the viewport.
      // Preloading only the GLB is not enough: WebGL context creation and
      // Suspense resolution can still cause a blank grid at the transition.
      setMobileModelHint(isMobile);
      setShowHouse(true);
      void import("@/components/3d/ScrollHouse").then(({ preloadHouseModel }) => {
        preloadHouseModel(isMobile);
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
        <ImmediateFoundation visible={!houseModelReady} />
        <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
          {showHouse && mobileModelHint !== null ? (
            <div className="absolute inset-0 z-[5]">
              <Suspense fallback={null}>
                <ScrollHouse
                  progress={smoothScrollProgress}
                  mobileHint={mobileModelHint}
                  onReady={handleHouseModelReady}
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
        {/* Desktop: the full progressive map stays visible in the right column. */}
        <div className="absolute z-[15] pointer-events-none
          hidden md:flex md:inset-x-auto md:right-3 md:top-1/2 md:w-60 md:max-w-none md:-translate-y-1/2
          flex-col gap-2"
        >
          {CONSTRUCTION_LAYERS.map((layer, layerIndex) => {
            const isActive = layerIndex === activeLayerIndex;
            const isBuilt = houseProgress >= CONSTRUCTION_STAGE_ENDS[layerIndex];
            const isUpcoming = !isActive && !isBuilt;
            return (
              <div
                key={layer.label}
                  className={`relative w-full bg-background backdrop-blur-sm border rounded-lg px-2.5 py-1.5 shadow-lg transition-all duration-300 md:rounded-xl md:bg-background/90 md:px-3 md:py-2.5 ${
                  isActive
                     ? "border-secondary shadow-secondary/25 scale-[1.03]"
                     : isUpcoming
                       ? "border-border/50 opacity-45"
                       : "border-secondary/35 opacity-85"
                }`}
              >
                <div className="flex items-start gap-1.5">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold transition-colors ${
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
                    <div className="font-display text-[11px] font-bold text-foreground leading-tight md:text-xs">
                      {layer.label}
                    </div>
                    <div
                        className={`line-clamp-3 overflow-hidden text-[10px] leading-snug text-foreground/75 transition-all duration-300 md:text-[11px] md:leading-relaxed ${
                        isActive ? "mt-0.5 max-h-8 opacity-100 md:mt-1 md:max-h-16" : "mt-0 max-h-0 opacity-0"
                      }`}
                    >
                      {layer.description}
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
                            ((houseProgress - CONSTRUCTION_STAGE_STARTS[layerIndex]) /
                              (CONSTRUCTION_STAGE_ENDS[layerIndex] -
                                CONSTRUCTION_STAGE_STARTS[layerIndex])) *
                              100,
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

        {/* Mobile: show one detailed stage at a time so the house and stats
            keep their own space while the story advances with scroll. */}
        {(() => {
          const layer = CONSTRUCTION_LAYERS[activeLayerIndex];
          const isBuilt =
            houseProgress >= CONSTRUCTION_STAGE_ENDS[activeLayerIndex];
          const stageStart = CONSTRUCTION_STAGE_STARTS[activeLayerIndex];
          const stageEnd = CONSTRUCTION_STAGE_ENDS[activeLayerIndex];
          const progressInLayer = Math.max(
            8,
            Math.min(
              100,
              ((houseProgress - stageStart) / (stageEnd - stageStart)) * 100,
            ),
          );
          return (
            <div className="absolute z-[15] inset-x-0 top-[22%] flex justify-center px-4 pointer-events-none md:hidden">
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full max-w-[360px] rounded-2xl border-2 border-secondary/65 bg-background/90 px-3.5 py-2.5 shadow-lg shadow-secondary/10 backdrop-blur-md"
              >
                <div className="flex items-start justify-center gap-2 text-left">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isBuilt
                        ? "bg-secondary text-secondary-foreground"
                        : "border border-secondary text-secondary"
                    }`}
                  >
                    {isBuilt ? "✓" : activeLayerIndex + 1}
                  </span>
                  <div className="min-w-0 text-left">
                    <div className="font-display text-lg font-black leading-none tracking-tight text-foreground">
                      {layer.label}
                    </div>
                    <div className="mt-1 line-clamp-3 text-sm font-medium leading-5 text-foreground/75">
                      {layer.mobileDescription}
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-secondary/15">
                  <div
                    className="h-full rounded-full bg-secondary transition-[width] duration-150"
                    style={{ width: `${progressInLayer}%` }}
                  />
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* Stats overlay */}
        <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
          <div className="container mx-auto px-4 md:px-6 pb-2 md:pb-2">
            <div className="grid translate-y-4 grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
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
