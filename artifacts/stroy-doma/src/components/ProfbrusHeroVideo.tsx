import { useRef } from "react";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import profbrusHeroPoster from "@assets/a404eeaf-94f9-41b7-a6a4-ed9de3b003e7_1784948204328.webp";
import profbrusHeroVideo from "@assets/generated_videos/profbrus-hero-house-orbit.mp4";

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
        poster={profbrusHeroPoster}
        ref={(el) => {
          videoRef.current = el;
          if (el) el.setAttribute("fetchpriority", "high");
        }}
        src={profbrusHeroVideo}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
