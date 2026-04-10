import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger)

export function useLenis(onScroll?: (scrollX: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);
  const onScrollRef = useRef(onScroll); 

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      lerp: isMobile ? 0.07 : 0.05,
      wheelMultiplier: 0.6,
      touchMultiplier: isMobile ? 1.5 : 1,
      easing: (t) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      eventsTarget: window,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update()
      onScrollRef.current?.(e.scroll)
    })

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker); 
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}