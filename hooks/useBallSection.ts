import { useEffect, RefObject } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export function useBallSection(
  ballSectionRef: RefObject<HTMLDivElement | null>,
  ballRef: RefObject<HTMLDivElement | null>,
  section4Ref: RefObject<HTMLDivElement | null>,
  currentIndex: RefObject<number>,
) {
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

    // ✅ Hitung maxScale sekali, bukan tiap frame
    let maxScale =
      Math.ceil(
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 8,
      ) + 10;

    const handleResize = () => {
      maxScale =
        Math.ceil(
          Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 8,
        ) + 10;
    };
    window.addEventListener("resize", handleResize);

    const ballConfigs = [
      { selector: '[data-ball="1"]', start: 0.1, peak: 0.25 },
      { selector: '[data-ball="2"]', start: 0.12, peak: 0.45 },
      { selector: '[data-ball="3"]', start: 0.13, peak: 0.65 },
      { selector: '[data-ball="4"]', start: 0.14, peak: 0.65 },
      { selector: '[data-ball="5"]', start: 0.15, peak: 0.65 },
      { selector: '[data-ball="6"]', start: 0.16, peak: 0.65 },
    ];
    const maxOpacity = [0.8, 0.9, 1];

    ScrollTrigger.create({
      trigger: ballSectionRef.current,
      start: "top top",
      end: isMobile ? "+=800" : "+=1200",
      scrub: isMobile ? 0.8 : 1, // ✅ 0.3 → 0.8 di mobile, kurangi frekuensi update
      pin: true,
      pinSpacing: true,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      onEnter: () => {
        currentIndex.current = 3;
      },
      onLeave: () => {
        currentIndex.current = 4;
      },
      onEnterBack: () => {
        currentIndex.current = 3;
      },
      onLeaveBack: () => {
        currentIndex.current = 2;
      },
      onUpdate: (self) => {
        const progress = self.progress;

        ballConfigs.forEach(({ selector, start, peak }, i) => {
          const el =
            ballSectionRef.current?.querySelector<HTMLElement>(selector);
          if (!el) return;

          const localP = Math.max(
            0,
            Math.min(1, (progress - start) / (peak - start)),
          );

          // ✅ Aktifkan will-change hanya saat animasi berlangsung
          if (localP > 0 && localP < 1) {
            el.style.willChange = "transform, opacity";
          } else {
            el.style.willChange = "auto";
          }

          el.style.opacity = String(localP * maxOpacity[i]);
          el.style.transform = `translate(-50%, -50%) translateZ(0) scale(${localP * maxScale})`;
        });

        if (section4Ref.current) {
          const contentOpacity = progress > 0.8 ? (progress - 0.8) / 0.2 : 0;
          section4Ref.current.style.opacity = String(contentOpacity);

          const cards =
            section4Ref.current.querySelectorAll<HTMLElement>(".offering-card");

          if (progress > 0.82) {
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
          } else {
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
