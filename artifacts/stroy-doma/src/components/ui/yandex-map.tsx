import { CSSProperties, useEffect, useRef, useState } from "react";

interface MapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
const PIN_LON = 84.9317;
const PIN_LAT = 56.5279;

// Правый берег р. Томь у Черемошников (оценка по скриншотам)
const RIVER_SHORE_LON = 84.9261;
// Целевая доля ширины карты от левого края до берега реки
const RIVER_FRAC = 0.15;

// При z=16 и широте 56°N: ~1.336 м/пиксель → в градусах долготы
const DEG_LON_PER_PX = 1.336 / 62_000; // ≈ 2.155e-5 °/px

function buildSrc(widthPx: number): string {
  // Рассчитываем центр карты так, чтобы берег реки оказался
  // на RIVER_FRAC от левого края при любой ширине.
  const totalLon = widthPx * DEG_LON_PER_PX;
  const leftEdge = RIVER_SHORE_LON - RIVER_FRAC * totalLon;
  const centerLon = (leftEdge + 0.5 * totalLon).toFixed(6);

  return (
    "https://yandex.ru/map-widget/v1/" +
    `?ll=${centerLon}%2C${PIN_LAT}` +
    "&z=16" +
    `&pt=${PIN_LON}%2C${PIN_LAT}%2Cpm2bl` +
    "&l=map&lang=ru_RU&nopan=1&nozoom=1&noselect=1"
  );
}

export function YandexMap({ className = "", style }: MapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const w = el.offsetWidth;
      if (w > 0) setSrc(buildSrc(w));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className} style={style}>
      {src && (
        <iframe
          key={src}
          src={src}
          style={{ border: 0, display: "block", width: "100%", height: "100%" }}
          allowFullScreen
          title="Яндекс Карты — Кедр Томск, ул. Профсоюзная 2/1с12"
        />
      )}
    </div>
  );
}
