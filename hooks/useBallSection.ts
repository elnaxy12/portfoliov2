import { useEffect, useRef, RefObject } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { OfferingsHandle } from "../components/Offerings";

export function useBallSection(
  ballSectionRef: RefObject<HTMLDivElement | null>,
  ballRef: RefObject<HTMLDivElement | null>,
  section4Ref: RefObject<HTMLDivElement | null>,
  currentIndex: RefObject<number>,
  textRevealRef: RefObject<OfferingsHandle | null>,
) {
  const hasPlayedRef = useRef(false);

  // INIT OFFERING CARDS
  useEffect(() => {
    if (!section4Ref.current) return;

    section4Ref.current
      .querySelectorAll<HTMLElement>(".offering-card")
      .forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
      });
  }, [section4Ref]);

  useEffect(() => {
    if (!ballSectionRef.current || !section4Ref.current) return;

    const section = ballSectionRef.current;

    const maxScale =
      Math.ceil(
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 10,
      ) + 5;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=1400",
      pin: true,
      pinSpacing: false,
      scrub: 1,

      onEnter: () => {
        currentIndex.current = 3;
      },

      onLeave: () => {
        currentIndex.current = 4;
      },

      onEnterBack: () => {
        currentIndex.current = 3;
      },

      onUpdate: (self) => {
        const p = self.progress;

        const doorKnob = section.querySelector<HTMLElement>("[data-doorknob]");

        // ───── ZOOM ─────
        if (doorKnob) {
          const eased = Math.min(1, p / 0.6) ** 3;

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
          section.style.transform = `scale(${1 + eased * (maxScale - 1)})`;
        }

        // ───── SECTION FADE ─────
        const fadeStart = 0.75;

        section.style.opacity =
          p > fadeStart ? String(1 - (p - fadeStart) / (1 - fadeStart)) : "1";

        // ───── OFFERINGS ─────
        if (!section4Ref.current) return;

        const offerP = p < fadeStart ? 0 : (p - fadeStart) / (1 - fadeStart);

        section4Ref.current.style.opacity = String(offerP);

        section4Ref.current.style.transform = `
          translateY(${40 - offerP * 40}px)
          scale(${0.95 + offerP * 0.05})
        `;

        section4Ref.current.style.filter = `blur(${(1 - offerP) * 8}px)`;
        section4Ref.current.style.pointerEvents =
          offerP > 0.6 ? "auto" : "none";
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.refresh();
    };
  }, [ballSectionRef, section4Ref, currentIndex]);
}
