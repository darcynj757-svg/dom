import { CSSProperties } from "react";

interface MapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
// Google Maps embed — работает на любом домене без ключа
const SRC =
  "https://maps.google.com/maps?q=56.5267,84.9354&z=15&output=embed&hl=ru&ll=56.5267,84.9354";

export function YandexMap({ className = "", style }: MapProps) {
  return (
    <iframe
      src={SRC}
      className={className}
      style={{ border: 0, display: "block", ...style }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Карта — Кедр Томск, ул. Профсоюзная 2/1с12"
    />
  );
}
