import { useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * True parallax hook for hero sections.
 *
 * The background wrapper should be:
 *   className="absolute inset-x-0 -top-[15%] h-[130%]"
 *
 * This makes the bg 30% taller than the section (15% overflow top + bottom).
 * On scroll the wrapper translates down by up to 30% of its own height,
 * so the visible crop shifts smoothly — no scale, no zoom distortion.
 *
 * Parallax ratio ≈ 30% of section height / section height = 0.30 (strong & visible).
 */
export function useHeroParallax(): {
  sectionRef: React.RefObject<HTMLElement | null>;
  y: MotionValue<string>;
} {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  return { sectionRef, y };
}
