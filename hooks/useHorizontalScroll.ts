import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export function useHorizontalScroll(
  hScrollRef: RefObject<HTMLDivElement | null>,
  hTrackRef: RefObject<HTMLDivElement | null>,
  planeUpdateRef: RefObject<((progress: number) => void) | null>,
  currentIndex: RefObject<number>,
  scrollXRef: RefObject<number>,
) {
  useEffect(() => {
    if (!hScrollRef.current || !hTrackRef.current) return;

    const track = hTrackRef.current;

    // Tunggu layout settled sebelum kalkulasi width
    const init = () => {
      const getTotalWidth = () => track.scrollWidth - window.innerWidth;

      if (getTotalWidth() <= 0) {
        requestAnimationFrame(init);
        return;
      }

      gsap.to(track, {
        x: () => -getTotalWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: hScrollRef.current,
          start: "top top",
          end: () => `+=${getTotalWidth() + 800}`,
          scrub: true,
          pin: true,
          anticipatePin: 0, // ← matikan di semua device
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
            scrollXRef.current = 0;
          },
          onUpdate: (self) => {
            const progress = Math.min(self.progress, 1);

            const r = Math.round(155 + (189 - 155) * progress);
            const g = Math.round(142 + (166 - 142) * progress);
            const b = Math.round(199 + (206 - 199) * progress);

            if (hScrollRef.current) {
              hScrollRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            }

            scrollXRef.current = self.progress * getTotalWidth();
            planeUpdateRef.current?.(progress);
          },
        },
      });
    };

    // Delay kecil untuk pastikan DOM settled di mobile
    const timeout = setTimeout(init, 100);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === hScrollRef.current)
        .forEach((t) => t.kill());
    };
  }, [hScrollRef, hTrackRef, planeUpdateRef, currentIndex, scrollXRef]);
}
