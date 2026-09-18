import profbrusHeroVideo from "@assets/generated_videos/profiled-timber-flythrough-v2.mp4";

export function ProfbrusHeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d0d] select-none pointer-events-none">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/posters/hero-profbrus-gen.webp"
        src={profbrusHeroVideo}
        className="absolute inset-0 w-full h-full object-cover"
      >
      </video>
    </div>
  );
}
