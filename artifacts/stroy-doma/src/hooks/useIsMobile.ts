import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  // Keep the first render identical between SSR and the browser. The real
  // viewport value is applied immediately after hydration.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}
