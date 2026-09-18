import { useRef } from "react";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";

export function ProfbrusHeroVideo() {
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
        poster="/posters/hero-profbrus-gen.webp"
        ref={(el) => {
          videoRef.current = el;
          if (el) el.setAttribute("fetchpriority", "high");
        }}
        src={`${import.meta.env.BASE_URL}videos/hero-compressed.mp4`}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
