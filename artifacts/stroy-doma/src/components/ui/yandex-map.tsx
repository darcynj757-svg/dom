import { CSSProperties } from "react";

interface YandexMapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
const SRC =
  "https://yandex.ru/map-widget/v1/?ll=84.966279%2C56.481560&z=15&pt=84.966279%2C56.481560%2Cpm2gnm&l=map";

export function YandexMap({ className = "", style }: YandexMapProps) {
  return (
    <iframe
      src={SRC}
      className={className}
      style={{ border: 0, display: "block", ...style }}
      allowFullScreen
      title="Яндекс Карты — Кедр Томск, ул. Профсоюзная 2/1с12"
    />
  );
}
