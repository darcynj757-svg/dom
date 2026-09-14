import { useEffect } from "react";

/**
 * Mobile browsers usually allow muted autoplay, but the initial play request
 * can race with source selection or be rejected until the first interaction.
 * Keep the poster as the visual fallback and retry only on cheap readiness /
 * interaction events instead of blocking the page on video loading.
 */
export function useAutoplayVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const play = () => {
      if (document.visibilityState === "hidden") return;
      void video.play().catch(() => {});
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") play();
    };

    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("touchstart", play, { once: true, passive: true });
    window.addEventListener("pointerdown", play, { once: true, passive: true });
    play();

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("touchstart", play);
      window.removeEventListener("pointerdown", play);
    };
  }, [videoRef]);
}