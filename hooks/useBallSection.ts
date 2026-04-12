import { useEffect, RefObject } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

export function useBallSection(
  ballSectionRef: RefObject<HTMLDivElement | null>,
  ballRef: RefObject<HTMLDivElement | null>,
  offeringsRef: RefObject<HTMLDivElement | null>,
  lenisRef: RefObject<Lenis | null>,
  currentIndex: RefObject<number>,
) {
  useEffect(() => {
    if (!ballSectionRef.current) return;

    const section = ballSectionRef.current;

    const maxScale =
      Math.ceil(
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 10,
      ) + 5;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=1000",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      snap: {
        snapTo: 1, 
        duration: 0.5,
        ease: "power2.inOut",
      },

      onEnter: () => {
        currentIndex.current = 3;
      },

      onLeave: () => {
        currentIndex.current = 4;
        if (!offeringsRef.current || !lenisRef.current) return;

        setTimeout(() => {
          lenisRef.current?.scrollTo(offeringsRef.current!, {
            duration: 1.2,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
          });
        }, 100);
      },

      onEnterBack: () => {
        currentIndex.current = 3;
      },

      onUpdate: (self) => {
        const p = self.progress;
        const doorKnob = section.querySelector<HTMLElement>("[data-doorknob]");

        if (doorKnob) {
          const eased = Math.min(1, p) ** 2;
          const scale = 1 + eased * (maxScale - 1);

          const sectionRect = section.getBoundingClientRect();
          const knobRect = doorKnob.getBoundingClientRect();

          const originX =
            ((knobRect.left + knobRect.width / 2 - sectionRect.left) /
              sectionRect.width) *
            100;

          const originY =
            ((knobRect.top + knobRect.height / 2 - sectionRect.top) /
              sectionRect.height) *
            100;

          section.style.transformOrigin = `${originX}% ${originY}%`;
          section.style.transform = `scale(${scale})`;
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.refresh();
    };
  }, [ballSectionRef, offeringsRef, lenisRef, currentIndex]);
}
