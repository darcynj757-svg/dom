import { useRef } from "react";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import profbrusHeroPoster from "@assets/generated_images/profbrus-modern-house-hero.png";
import profbrusHeroVideo from "@assets/generated_videos/profbrus-modern-house-hero.mp4";

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
