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

    const t1 = el.querySelector<HTMLElement>(".scroll-text-1");
    if (t1) {
      t1.style.opacity = "1";
      t1.style.transform = "translateY(0px)";
    }
  }, [textRef]);
}
