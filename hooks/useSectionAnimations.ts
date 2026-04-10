import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";
import { RefObject } from "react";

export function useSectionAnimations(
  lenisRef: RefObject<Lenis | null>,
  currentIndex: RefObject<number>,
  isAnimating: RefObject<boolean>,
) {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section-panel");
    const touchStartY = { current: 0 };

    const scrollToSection = (index: number) => {
      if (isAnimating.current || !lenisRef.current) return;
      isAnimating.current = true;
      currentIndex.current = index;

      lenisRef.current.scrollTo(sections[index], {
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (currentIndex.current !== 0) return;
      e.preventDefault();
      if (e.deltaY > 50) scrollToSection(1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (currentIndex.current !== 0) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (diff > 50) scrollToSection(1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    sections.forEach((el) => {
      const title = el.querySelector(".sesi-title");
      if (!title) return;

      gsap.fromTo(
        title,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [lenisRef, currentIndex, isAnimating]);
}