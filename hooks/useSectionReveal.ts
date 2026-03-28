import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

interface UseSectionRevealOptions {
  /** CSS selector untuk card/item yang di-animate. Default: ".reveal-card" */
  selector?: string;
  /** Delay stagger antar item dalam detik. Default: 0.08 */
  stagger?: number;
  /** Durasi animasi tiap item dalam detik. Default: 0.55 */
  duration?: number;
  /** Jarak translateY awal dalam px. Default: 24 */
  yOffset?: number;
  /** ScrollTrigger start position. Default: "top 85%" */
  start?: string;
}

export function useSectionReveal(
  sectionRef: RefObject<HTMLElement | null>,
  options: UseSectionRevealOptions = {},
) {
  const {
    selector = ".reveal-card",
    stagger = 0.08,
    duration = 0.55,
    yOffset = 24,
    start = "top 85%",
  } = options;

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll<HTMLElement>(selector);
    if (!cards.length) return;

    // Set initial state
    gsap.set(cards, {
      opacity: 0,
      y: yOffset,
      clipPath: "inset(100% 0% 0% 0%)",
    });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start,
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration,
          stagger,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.set(cards, { clearProps: "all" });
    };
  }, [sectionRef, selector, stagger, duration, yOffset, start]);
}
