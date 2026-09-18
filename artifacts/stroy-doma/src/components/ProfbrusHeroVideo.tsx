import { useRef } from "react";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import profbrusHeroVideo from "@assets/cedar_log_mansion_flythrough_16s_compressed.mp4";

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
        src={profbrusHeroVideo}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
