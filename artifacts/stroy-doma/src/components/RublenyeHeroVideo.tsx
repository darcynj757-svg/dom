import { useRef } from "react";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";

export function RublenyeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useAutoplayVideo(videoRef);
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d0d] select-none pointer-events-none">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/posters/rublenye-doma-hero.webp"
        ref={(el) => {
          videoRef.current = el;
          if (el) el.setAttribute("fetchpriority", "high");
        }}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={`${import.meta.env.BASE_URL}videos/rublenye-doma-hero-mobile.mp4`} type="video/mp4" media="(max-width: 767px)" />
        <source src={`${import.meta.env.BASE_URL}videos/rublenye-doma-hero.mp4`} type="video/mp4" media="(min-width: 768px)" />
      </video>
    </div>
  );
}
