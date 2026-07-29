import { useIsMobile } from "@/hooks/useIsMobile";

export function ProfbrusHeroVideo() {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d0d] select-none pointer-events-none">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/posters/hero-profbrus-gen.webp"
        ref={(el) => { if (el) el.setAttribute('fetchpriority', 'high'); }}
        className="absolute inset-0 w-full h-full object-cover"
        src={`${import.meta.env.BASE_URL}videos/hero-profbrus-gen.mp4`}
      />
    </div>
  );
}
