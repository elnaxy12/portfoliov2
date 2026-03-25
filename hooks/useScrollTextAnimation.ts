import { useEffect, RefObject } from "react";

interface UseScrollTextAnimationOptions {
  scrollXRef: RefObject<number>;
  trackRef: RefObject<HTMLDivElement | null>;
  textRef: RefObject<HTMLDivElement | null>;
  // range kapan text-1 muncul
  text1In?: number; // default 0.1
  text1Full?: number; // default 0.8
}

export function useScrollTextAnimation({
  scrollXRef,
  trackRef,
  textRef,
  text1In = 0.1,
  text1Full = 0.8,
}: UseScrollTextAnimationOptions) {
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let raf: number;

    const clamp = (v: number, min = 0, max = 1) =>
      Math.min(Math.max(v, min), max);
    const invlerp = (a: number, b: number, v: number) =>
      clamp((v - a) / (b - a));

    const update = () => {
      const scrollX = scrollXRef.current ?? 0;
      const maxScroll =
        (trackRef.current?.scrollWidth ?? 0) - window.innerWidth;
      const progress = maxScroll > 0 ? clamp(scrollX / maxScroll) : 0;

      // Text 1: fade in → full, tanpa fade out
      let op1 = 0;
      if (progress < text1In) {
        op1 = invlerp(0, text1In, progress);
      } else {
        op1 = 1;
      }

      const t1 = el.querySelector<HTMLElement>(".scroll-text-1");
      if (t1) {
        t1.style.opacity = String(op1);
        t1.style.transform = `translateY(${(1 - op1) * 12}px)`;
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [scrollXRef, trackRef, textRef, text1In, text1Full]);
}
