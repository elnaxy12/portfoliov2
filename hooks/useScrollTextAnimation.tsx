import { useEffect, RefObject } from "react";

interface UseScrollTextAnimationOptions {
  scrollXRef: RefObject<number>;
  trackRef: RefObject<HTMLDivElement | null>;
  textRef: RefObject<HTMLDivElement | null>;
  text2In?: number; // default 0.5
  text2Full?: number; // default 0.65
}

export function useScrollTextAnimation({
  scrollXRef,
  trackRef,
  textRef,
  text2In = 0.5,
  text2Full = 0.65,
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

      // Text 2: fade in dari text2In → text2Full
      const op2 =
        progress <= text2In
          ? 0
          : progress >= text2Full
            ? 1
            : invlerp(text2In, text2Full, progress);

      // Text 1: fade out bersamaan saat text2 masuk
      const op1 = 1 - op2;

      const t1 = el.querySelector<HTMLElement>(".scroll-text-1");
      const t2 = el.querySelector<HTMLElement>(".scroll-text-2");

      if (t1) {
        t1.style.opacity = String(op1);
        t1.style.transform = `translateY(${(1 - op1) * 12}px)`;
      }
      if (t2) {
        t2.style.opacity = String(op2);
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [scrollXRef, trackRef, textRef, text2In, text2Full]);
}
