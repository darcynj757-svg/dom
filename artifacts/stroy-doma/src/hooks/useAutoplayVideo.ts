import { useEffect } from "react";

type AutoplayOptions = {
  /**
   * On phones, hold the hero video download until the 3D house model has
   * arrived (or a short timeout passes). The poster is visible meanwhile, and
   * the model below the hero gets the whole mobile connection.
   */
  deferOnMobileUntilHouse?: boolean;
};

const MOBILE_VIDEO_FALLBACK_MS = 5000;

/**
 * Mobile browsers usually allow muted autoplay, but the initial play request
 * can race with source selection or be rejected until the first interaction.
 * Keep the poster as the visual fallback and retry only on cheap readiness /
 * interaction events instead of blocking the page on video loading.
 */
export function useAutoplayVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: AutoplayOptions = {},
) {
  const deferOnMobile = options.deferOnMobileUntilHouse ?? false;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    let enabled = false;
    let fallbackTimer: number | undefined;

    const play = () => {
      if (!enabled) return;
      if (document.visibilityState === "hidden") return;
      void video.play().catch(() => {});
    };

    const enable = () => {
      if (enabled) return;
      enabled = true;
      window.removeEventListener("house-model-loaded", enable);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (video.preload === "none") video.preload = "auto";
      play();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") play();
    };

    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("touchstart", play, { passive: true });
    window.addEventListener("pointerdown", play, { passive: true });

    const houseAlreadyLoaded = Boolean(
      (window as unknown as { __houseModelLoaded?: boolean }).__houseModelLoaded,
    );
    if (deferOnMobile && window.innerWidth < 768 && !houseAlreadyLoaded) {
      window.addEventListener("house-model-loaded", enable);
      fallbackTimer = window.setTimeout(enable, MOBILE_VIDEO_FALLBACK_MS);
    } else {
      enable();
    }

    return () => {
      window.removeEventListener("house-model-loaded", enable);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("touchstart", play);
      window.removeEventListener("pointerdown", play);
    };
  }, [videoRef, deferOnMobile]);
}
