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
    description:
      "Размечаем оси дома, подготавливаем грунт и собираем арматурный каркас. После заливки бетон набирает прочность, а основание защищаем от влаги.",
    mobileDescription: "Готовим фундамент, который выдержит дом.",
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
      "После гидроизоляции укладываем лаги и выравниваем плоскость пола. Между ними закладываем утепление, чтобы первый венец дома стоял на сухом и ровном основании.",
    mobileDescription: "Укладываем лаги и утепление, чтобы пол был сухим и тёплым.",
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
      "Каждый венец собираем по проекту, соединяем углы и прокладываем межвенцовый утеплитель. Постепенно появляются комнаты, проёмы, терраса и силуэт дома.",
    mobileDescription: "Собираем стены венец за венцом, создавая тёплый и прочный дом.",
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
      "Устанавливаем стропильную систему, защищаем утеплитель от влаги и монтируем кровельное покрытие. После этого дом закрыт от осадков и готов к инженерным работам.",
    mobileDescription: "Монтируем крышу и защищаем дом от осадков.",
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
  // Keep the construction story visible longer before the camera enters the
  // more dynamic finished-house orbit.
  const BUILD_END = 0.70;
  const buildProgress = Math.min(houseProgress / BUILD_END, 1);
  const activeLayerIndex = Math.min(
    CONSTRUCTION_LAYERS.length - 1,
    Math.floor(buildProgress * CONSTRUCTION_LAYERS.length),
  );

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
      const variant = isMobile ? "mobile" : "desktop";
      const modelFile = isMobile ? "house-mobile.glb" : "house-draco.glb";
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
        <motion.div style={{ opacity: heroSceneOpacity }} className="absolute inset-0">
          {showHouse && mobileModelHint !== null ? (
            <div className="absolute inset-0 z-[5]">
              <Suspense fallback={null}>
                <ScrollHouse
                  progress={houseProgress}
                  mobileHint={mobileModelHint}
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
          hidden md:flex md:inset-x-auto md:right-3 md:top-1/2 md:w-52 md:max-w-none md:-translate-y-1/2
          flex-col gap-2"
        >
          {CONSTRUCTION_LAYERS.map((layer, layerIndex) => {
            const isActive = layerIndex === activeLayerIndex;
            const isBuilt =
              buildProgress >= (layerIndex + 1) / CONSTRUCTION_LAYERS.length;
            const isUpcoming = !isActive && !isBuilt;
            return (
              <div
                key={layer.label}
                  className={`relative w-full bg-background backdrop-blur-sm border rounded-lg px-2.5 py-1.5 shadow-lg transition-all duration-300 md:rounded-xl md:bg-background/90 md:px-2.5 md:py-2 ${
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
                        className={`line-clamp-2 overflow-hidden text-[10px] leading-snug text-foreground/75 transition-all duration-300 md:text-[11px] md:leading-relaxed ${
                        isActive ? "mt-0.5 max-h-8 opacity-100 md:mt-1 md:max-h-12" : "mt-0 max-h-0 opacity-0"
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

        {/* Mobile: show one detailed stage at a time so the house and stats
            keep their own space while the story advances with scroll. */}
        {(() => {
          const layer = CONSTRUCTION_LAYERS[activeLayerIndex];
          const isBuilt =
            buildProgress >= (activeLayerIndex + 1) / CONSTRUCTION_LAYERS.length;
          const progressInLayer = Math.max(
            8,
            Math.min(
              100,
              ((buildProgress * CONSTRUCTION_LAYERS.length - activeLayerIndex) * 100),
            ),
          );
          return (
            <div className="absolute z-[15] inset-x-6 top-[18%] pointer-events-none md:hidden">
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="ml-auto w-full max-w-[360px] rounded-[18px] border-2 border-secondary/65 bg-background/85 px-4 py-3 shadow-lg shadow-secondary/10 backdrop-blur-md"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isBuilt
                        ? "bg-secondary text-secondary-foreground"
                        : "border border-secondary text-secondary"
                    }`}
                  >
                    {isBuilt ? "✓" : activeLayerIndex + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-xl font-black leading-none tracking-tight text-foreground">
                      {layer.label}
                    </div>
                    <div className="mt-1.5 line-clamp-2 text-base font-medium leading-snug text-foreground/75">
                      {layer.mobileDescription}
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary/15">
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
            <div className="grid translate-y-2 grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
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
