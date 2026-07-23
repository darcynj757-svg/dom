import { CSSProperties, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface MapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
const LAT = 56.52685;
const LON = 84.9295;
const LABEL = "Кедр Томск<br/>ул. Профсоюзная, 2/1с12";

export function YandexMap({ className = "", style }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: import("leaflet").Map | null = null;

    (async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icon paths broken by bundlers
      // @ts-expect-error — _getIconUrl is private Leaflet internals
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!containerRef.current) return;

      map = L.map(containerRef.current, {
        center: [LAT, LON],
        zoom: 16,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([LAT, LON]).addTo(map).bindPopup(LABEL).openPopup();
    })();

    return () => {
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style }}
    />
  );
}
