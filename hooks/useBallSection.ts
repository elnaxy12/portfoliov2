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
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Set initial state kartu
  useEffect(() => {
    if (!section4Ref.current) return;
    section4Ref.current
      .querySelectorAll<HTMLElement>(".offering-card")
      .forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(16px)";
      });
  }, [section4Ref]);

  // Inject overlay putih ke dalam ballSectionRef
  useEffect(() => {
    if (!ballSectionRef.current) return;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: white;
      opacity: 0;
      pointer-events: none;
      z-index: 50;
      transition: none;
    `;
    ballSectionRef.current.appendChild(overlay);
    overlayRef.current = overlay;

    return () => {
      overlay.remove();
      overlayRef.current = null;
    };
  }, [ballSectionRef]);

  useEffect(() => {
    if (!ballSectionRef.current || !section4Ref.current) return;

    const updateLenisPrevent = () => {
      section4Ref.current?.removeAttribute("data-lenis-prevent");
      section4Ref.current!.style.overflowY = "visible";
      section4Ref.current!.style.maxHeight = "none";
    };

    updateLenisPrevent();
    window.addEventListener("resize", updateLenisPrevent);

    const isMobile = window.innerWidth < 768;

    let maxScale =
      Math.ceil(
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 10,
      ) + 5;

    const handleResize = () => {
      maxScale =
        Math.ceil(
          Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 10,
        ) + 5;
    };
    window.addEventListener("resize", handleResize);

    ScrollTrigger.create({
      trigger: ballSectionRef.current,
      start: "top top",
      end: isMobile ? "+=1400" : "+=1200",
      scrub: isMobile ? 5 : 5,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: {
        snapTo: (value, self) => {
          const threshold = 0.1;
          const direction = self?.direction ?? 1;
          if (direction === 1) return value < threshold ? 0 : 1;
          if (direction === -1) return value > 1 - threshold ? 1 : 0;
          return value < 0.5 ? 0 : 1;
        },
        delay: 0.1,
        duration: { min: 0.8, max: 1.5 },
        ease: "power3.inOut",
      },
      onEnter: () => {
        currentIndex.current = 3;
      },
      onLeave: () => {
        currentIndex.current = 4;
        if (overlayRef.current) {
          overlayRef.current.style.opacity = "0";
        }
        // ✅ Reset counterWrapper supaya tidak nutupin section berikutnya
        const counterWrapper =
          ballSectionRef.current?.querySelector<HTMLElement>(
            "[data-counter-scale]",
          );
        if (counterWrapper) {
          counterWrapper.style.position = "absolute";
          counterWrapper.style.transform = "none";
          counterWrapper.style.inset = "0";
        }

        if (section4Ref.current) {
          section4Ref.current.style.zIndex = "";
          section4Ref.current.style.position = "";
        }
      },
      onEnterBack: () => {
        currentIndex.current = 3;
      },
      onLeaveBack: () => {
        currentIndex.current = 2;
        if (ballSectionRef.current) {
          ballSectionRef.current.style.transform = "none";
        }
        if (overlayRef.current) {
          overlayRef.current.style.opacity = "0";
        }
        // ✅ Reset simpel, tidak pakai scale/originX/originY
        const counterWrapper =
          ballSectionRef.current?.querySelector<HTMLElement>(
            "[data-counter-scale]",
          );
        if (counterWrapper) {
          counterWrapper.style.position = "absolute";
          counterWrapper.style.transform = "none"; // ✅ bukan scale(1/scale)
          counterWrapper.style.inset = "0";
        }
        if (section4Ref.current) {
          section4Ref.current.style.opacity = "0";
          section4Ref.current.style.pointerEvents = "none";
        }
      },

      onUpdate: (self) => {
        const progress = self.progress;

        // ── Zoom viewport ke posisi bola kecil (door knob) ──────────────
        const section = ballSectionRef.current;
        const doorKnob = section?.querySelector<HTMLElement>("[data-doorknob]");

        if (section && doorKnob) {
          const zoomProgress = Math.min(1, progress / 0.65);
          const eased = zoomProgress * zoomProgress * zoomProgress;

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

          const scale = 1 + eased * (maxScale - 1);

          section.style.transformOrigin = `${originX}% ${originY}%`;
          section.style.transform = `scale(${scale}) translateZ(0)`;
          section.style.willChange =
            eased > 0 && eased < 1 ? "transform" : "auto";

          // Counter-scale wrapper supaya section4 tidak ikut membesar
          const counterWrapper = section.querySelector<HTMLElement>(
            "[data-counter-scale]",
          );
          if (counterWrapper) {
            counterWrapper.style.transform = `scale(${1 / scale}) translateZ(0)`;
            counterWrapper.style.transformOrigin = `${originX}% ${originY}%`;
            if (progress >= 0.8) {
              counterWrapper.style.position = "fixed";
              counterWrapper.style.inset = "0";
            } else {
              counterWrapper.style.position = "absolute";
              counterWrapper.style.inset = "0";
            }
          }
        }

        // ── Overlay putih: fade in di progress 0.55 → 0.75 ──────────────
        if (overlayRef.current) {
          // Fade in 0.5→0.7, hold 0.7→0.75, fade out 0.75→0.85
          let overlayOpacity: number;
          if (progress < 0.5) {
            overlayOpacity = 0;
          } else if (progress < 0.7) {
            overlayOpacity = (progress - 0.5) / 0.2;
          } else if (progress < 0.75) {
            overlayOpacity = 1;
          } else if (progress < 0.85) {
            overlayOpacity = 1 - (progress - 0.75) / 0.1;
          } else {
            overlayOpacity = 0;
          }
          overlayRef.current.style.opacity = String(overlayOpacity);
        }

        // ── Section4 fade in + cards (muncul di atas overlay putih) ──────
        if (section4Ref.current) {
          // Reset transform — tidak perlu counter-scale, overlay yang handle transisi
          section4Ref.current.style.transform = "none";
          section4Ref.current.style.transformOrigin = "unset";

          const contentOpacity = progress > 0.8 ? (progress - 0.8) / 0.2 : 0;
          section4Ref.current.style.opacity = String(contentOpacity);

          // Pastikan section4 di atas overlay
          section4Ref.current.style.zIndex = "55";
          section4Ref.current.style.position = "relative";

          const cards =
            section4Ref.current.querySelectorAll<HTMLElement>(".offering-card");

          if (progress > 0.82) {
            section4Ref.current.style.pointerEvents = "auto";
            cards.forEach((card, i) => {
              if (card.dataset.animated) return;
              card.dataset.animated = "1";
              setTimeout(() => {
                card.style.transition =
                  "opacity 0.45s ease, transform 0.45s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 90);
            });

            if (!hasPlayedRef.current) {
              textRevealRef.current?.play();
              hasPlayedRef.current = true;
            }
          } else {
            section4Ref.current.style.pointerEvents = "none";
            textRevealRef.current?.reset();
            hasPlayedRef.current = false;
            cards.forEach((card) => {
              delete card.dataset.animated;
              card.style.transition = "none";
              card.style.opacity = "0";
              card.style.transform = "translateY(16px)";
            });
          }
        }
      },
    });

    return () => {
      window.removeEventListener("resize", updateLenisPrevent);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === ballSectionRef.current)
        .forEach((t) => t.kill());
    };
  }, [ballSectionRef, ballRef, section4Ref, currentIndex]);
}
