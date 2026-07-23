import { useEffect, useRef, CSSProperties } from "react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface YandexMapProps {
  lat?: number;
  lon?: number;
  zoom?: number;
  className?: string;
  style?: CSSProperties;
}

export function YandexMap({
  lat = 56.48156,
  lon = 84.96628,
  zoom = 15,
  className = "",
  style,
}: YandexMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let destroyed = false;

    function initMap() {
      if (destroyed || !containerRef.current) return;

      const map = new window.ymaps.Map(containerRef.current, {
        center: [lat, lon],
        zoom,
        controls: ["zoomControl", "typeSelector", "fullscreenControl"],
      });

      const placemark = new window.ymaps.Placemark(
        [lat, lon],
        { hintContent: "Кедр Томск", balloonContent: "Томск, мкр. Черемошники, ул. Профсоюзная, 2/1с12" },
        { preset: "islands#greenDotIconWithCaption", iconCaption: "Кедр Томск" }
      );

      map.geoObjects.add(placemark);
      mapRef.current = map;
    }

    if (window.ymaps) {
      window.ymaps.ready(initMap);
      return;
    }

    const scriptId = "yandex-maps-api";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_KEY ?? "";
      script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${apiKey ? `&apikey=${apiKey}` : ""}`;
      script.async = true;
      document.head.appendChild(script);
    }

    const onLoad = () => {
      if (!destroyed) window.ymaps.ready(initMap);
    };
    script.addEventListener("load", onLoad);

    return () => {
      destroyed = true;
      script?.removeEventListener("load", onLoad);
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [lat, lon, zoom]);

  return <div ref={containerRef} className={className} style={style} />;
}
