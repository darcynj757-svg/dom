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
        poster={`${import.meta.env.BASE_URL}posters/profiled-timber-flythrough.webp`}
        ref={(element) => {
          videoRef.current = element;
          if (element) element.setAttribute("fetchpriority", "high");
        }}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source
          src={`${import.meta.env.BASE_URL}videos/profiled-timber-flythrough-mobile-v2.mp4`}
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <source
          src={`${import.meta.env.BASE_URL}videos/profiled-timber-flythrough.mp4`}
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <img
          src={`${import.meta.env.BASE_URL}posters/profiled-timber-flythrough.webp`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>
    </div>
  );
}
