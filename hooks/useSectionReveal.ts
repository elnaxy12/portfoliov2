import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseSectionRevealOptions {
  selector?: string;
  stagger?: number;
  duration?: number;
  yOffset?: number;
  start?: string;
  end?: string;
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
    end = "top 10%",
  } = options;

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll<HTMLElement>(selector);
    if (!cards.length) return;

    gsap.set(cards, {
      opacity: 0,
      y: yOffset,
      clipPath: "inset(100% 0% 0% 0%)",
    });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start,
      end,                        // ← threshold untuk onLeaveBack
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
      onLeaveBack: () => {        // ← scroll balik ke atas, reset
        gsap.set(cards, {
          opacity: 0,
          y: yOffset,
          clipPath: "inset(100% 0% 0% 0%)",
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.set(cards, { clearProps: "all" });
    };
  }, [sectionRef, selector, stagger, duration, yOffset, start, end]);
}