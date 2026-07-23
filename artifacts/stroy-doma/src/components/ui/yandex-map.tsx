import { CSSProperties } from "react";

interface MapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
const SRC =
  "https://maps.google.com/maps?q=56.481560,84.966279&z=15&output=embed&hl=ru";

export function YandexMap({ className = "", style }: MapProps) {
  return (
    <iframe
      src={SRC}
      className={className}
      style={{ border: 0, display: "block", ...style }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Maps — Кедр Томск, ул. Профсоюзная 2/1с12"
    />
  );
}
