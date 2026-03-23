import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export function useHorizontalScroll(
  hScrollRef: RefObject<HTMLDivElement | null>,
  hTrackRef: RefObject<HTMLDivElement | null>,
  planeUpdateRef: RefObject<((progress: number) => void) | null>,
  currentIndex: RefObject<number>,
  scrollXRef: RefObject<number>, // ← tambah param
) {
  useEffect(() => {
    if (!hScrollRef.current || !hTrackRef.current) return;

    const track = hTrackRef.current;
    const getTotalWidth = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -getTotalWidth(),
      ease: "none",
      scrollTrigger: {
        trigger: hScrollRef.current,
        start: "top top",
        end: () => `+=${getTotalWidth() + 800}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          currentIndex.current = 2;
          planeUpdateRef.current?.(0);
        },
        onLeave: () => {
          currentIndex.current = 3;
        },
        onEnterBack: () => {
          currentIndex.current = 2;
          planeUpdateRef.current?.(0);
        },
        onLeaveBack: () => {
          currentIndex.current = 1;
          scrollXRef.current = 0; // ← reset saat keluar kiri
        },
        onUpdate: (self) => {
          const progress = Math.min(self.progress, 1);

          // Interpolasi #9B8EC7 → #BDA6CE
          const r = Math.round(155 + (189 - 155) * progress); // 9B → BD
          const g = Math.round(142 + (166 - 142) * progress); // 8E → A6
          const b = Math.round(199 + (206 - 199) * progress); // C7 → CE

          if (hScrollRef.current) {
            hScrollRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }

          scrollXRef.current = self.progress * getTotalWidth();
          planeUpdateRef.current?.(progress);
        },
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === hScrollRef.current)
        .forEach((t) => t.kill());
    };
  }, [hScrollRef, hTrackRef, planeUpdateRef, currentIndex, scrollXRef]);
}
