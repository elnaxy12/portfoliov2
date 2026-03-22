import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export function useHorizontalScroll(
  hScrollRef: RefObject<HTMLDivElement | null>,
  hTrackRef: RefObject<HTMLDivElement | null>,
  planeUpdateRef: RefObject<((progress: number) => void) | null>,
  currentIndex: RefObject<number>,
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
        },
        onUpdate: (self) => {
          planeUpdateRef.current?.(Math.min(self.progress, 1));
        },
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === hScrollRef.current)
        .forEach((t) => t.kill());
    };
  }, [hScrollRef, hTrackRef, planeUpdateRef, currentIndex]);
}
