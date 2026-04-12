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
      end: "+=1600",
      pin: true,
      pinSpacing: true,
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

        // ───── ZOOM IN (0 - 0.5) ─────
        const zoomInEnd = 0.5;
        // ───── ZOOM OUT + OFFERINGS (0.5 - 1) ─────
        const zoomOutStart = 1;
        // ───── OFFERINGS (0.4 - 0.5) ─────
        const offerStart = 0.5;

        if (doorKnob) {
          let scale;

          if (p <= zoomInEnd) {
            // Zoom in
            const eased = Math.min(1, p / zoomInEnd) ** 3;
            scale = 1 + eased * (maxScale - 1);
          } else {
            // Zoom out
            const outP = (p - zoomOutStart) / (1 - zoomOutStart);
            const eased = Math.min(1, (1 - outP) ** 2);
            scale = 1 + eased * (maxScale - 1);
          }

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

        // ───── OFFERINGS + LATAR PUTIH FADE IN (0.5 - 1) ─────
        if (!section4Ref.current) return;

        const offerP = p < offerStart ? 0 : (p - offerStart) / (1 - offerStart);

        section4Ref.current.style.opacity = String(offerP);
        section4Ref.current.style.transform = `
    translateY(${40 - offerP * 40}px)
    scale(${0.95 + offerP * 0.05})
  `;
        section4Ref.current.style.filter = `blur(${(1 - offerP) * 8}px)`;
        section4Ref.current.style.pointerEvents =
          offerP > 0.6 ? "auto" : "none";

        // ───── OFFERING CARDS STAGGER ─────
        if (offerP > 0.9 && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          section4Ref.current
            .querySelectorAll<HTMLElement>(".offering-card")
            .forEach((card, i) => {
              setTimeout(() => {
                card.style.transition =
                  "opacity 0.5s ease, transform 0.5s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 100);
            });
        }

        if (offerP < 0.5 && hasPlayedRef.current) {
          hasPlayedRef.current = false;
          section4Ref.current
            .querySelectorAll<HTMLElement>(".offering-card")
            .forEach((card) => {
              card.style.transition = "";
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
            });
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.refresh();
    };
  }, [ballSectionRef, section4Ref, currentIndex]);
}
