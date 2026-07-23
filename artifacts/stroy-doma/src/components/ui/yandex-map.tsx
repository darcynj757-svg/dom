import { CSSProperties } from "react";

interface MapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1 стр.2
// Google Maps embed — работает без ключа на любом домене
const SRC =
  "https://maps.google.com/maps?q=56.52685,84.9295&z=16&output=embed&hl=ru";

export function YandexMap({ className = "", style }: MapProps) {
  return (
    <iframe
      src={SRC}
      className={className}
      style={{ border: 0, display: "block", ...style }}
      allowFullScreen
      title="2GIS — Кедр Томск, ул. Профсоюзная 2/1 стр.2"
    />
  );
}
