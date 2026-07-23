import { useEffect, useRef, CSSProperties } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Зелёная метка (SVG) — стиль как в Яндекс Картах
const GREEN_ICON = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">
    <path d="M17 0C7.6 0 0 7.6 0 17c0 13 17 27 17 27S34 30 34 17C34 7.6 26.4 0 17 0z"
          fill="#3caa3c" stroke="#2a8a2a" stroke-width="1"/>
    <circle cx="17" cy="17" r="7" fill="white"/>
  </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  popupAnchor: [0, -44],
});

interface MapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
const LAT = 56.5267;
const LON = 84.9354;

export function YandexMap({ className = "", style }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [LAT, LON],
      zoom: 15,
      zoomControl: false,
    });

    // Русскоязычные тайлы OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Зум-контролы слева сверху (как в Яндекс Картах)
    L.control.zoom({ position: "topleft" }).addTo(map);

    // Зелёная метка
    L.marker([LAT, LON], { icon: GREEN_ICON })
      .addTo(map)
      .bindPopup(
        "<b>Кедр Томск</b><br>ул. Профсоюзная, 2/1с12",
        { closeButton: false }
      );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={className} style={style} />;
}
