import { CSSProperties } from "react";

interface MapProps {
  className?: string;
  style?: CSSProperties;
}

// Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12
// Яндекс.Карты — iframe-виджет, не требует API-ключа
const SRC =
  "https://yandex.ru/map-widget/v1/?ll=84.929500%2C56.526850&z=16&pt=84.929500%2C56.526850%2Cpm2rdm&l=map&lang=ru_RU";

export function YandexMap({ className = "", style }: MapProps) {
  return (
    <iframe
      src={SRC}
      className={className}
      style={{ border: 0, display: "block", ...style }}
      allowFullScreen
      title="Яндекс.Карты — Кедр Томск, ул. Профсоюзная 2/1с12"
    />
  );
}
