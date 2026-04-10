import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis(onScroll?: (scrollY: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  const lenis = new Lenis({
    lerp: isMobile ? 0.14 : 0.08,
    touchMultiplier: isMobile ? 0.8 : 1,
    syncTouch: isMobile,
  });

    lenisRef.current = lenis;

    // sync ke ScrollTrigger
    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();
      onScroll?.(e.scroll);
    });

    // RAF loop (recommended)
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}