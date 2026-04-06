import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

export function useLenis(onScroll?: (scrollX: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      lerp: isMobile ? 0.12 : 0.05,
      wheelMultiplier: 0.6,
      touchMultiplier: isMobile ? 1.5 : 1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !isMobile,
      eventsTarget: window,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", (e: any) => {
      onScroll?.(e.scroll);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
