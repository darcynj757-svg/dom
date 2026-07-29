import { CSSProperties } from "react";

interface GoogleMapProps {
  className?: string;
  style?: CSSProperties;
}

// Кедр Томск — мкр. Черемошники, ул. Профсоюзная, 2/1с12
const LAT = 56.5279;
const LON = 84.9317;

const SRC =
  `https://maps.google.com/maps?q=${LAT},${LON}&hl=ru&z=16&output=embed`;

export function GoogleMap({ className = "", style }: GoogleMapProps) {
  return (
    <div className={className} style={style}>
      <iframe
        src={SRC}
        style={{ border: 0, display: "block", width: "100%", height: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps — Кедр Томск, ул. Профсоюзная 2/1с12"
      />
    </div>
  );
}
