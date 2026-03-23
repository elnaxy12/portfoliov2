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
    const isMobile = window.innerWidth < 768;

    // Gunakan visualViewport width di mobile agar tidak berubah saat address bar hide/show
    const getVW = () =>
      (typeof visualViewport !== "undefined" ? visualViewport.width : null) ??
      window.innerWidth;

    const getTotalWidth = () => track.scrollWidth - getVW();

    gsap.to(track, {
      x: () => -getTotalWidth(),
      ease: "none",
      scrollTrigger: {
        trigger: hScrollRef.current,
        start: "top top",
        // Di mobile kurangi extra scroll agar tidak terlalu panjang
        end: () => `+=${getTotalWidth() + (isMobile ? 300 : 800)}`,
        scrub: isMobile ? 0.5 : true, // sedikit smoothing di mobile
        pin: true,
        anticipatePin: isMobile ? 0 : 1, // matikan di mobile — penyebab jump
        invalidateOnRefresh: true,
        // Refresh ScrollTrigger saat visualViewport resize (address bar mobile)
        onRefresh: () => {
          ScrollTrigger.refresh();
        },
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

          // Interpolasi #9B8EC7 → #BDA6CE
          const r = Math.round(155 + (189 - 155) * progress);
          const g = Math.round(142 + (166 - 142) * progress);
          const b = Math.round(199 + (206 - 199) * progress);

          if (hScrollRef.current) {
            hScrollRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }

          scrollXRef.current = progress * getTotalWidth();
          planeUpdateRef.current?.(progress);
        },
      },
    });

    // Di mobile: refresh ScrollTrigger saat visualViewport berubah
    // (misalnya address bar browser muncul/sembunyi)
    let vpTimeout: ReturnType<typeof setTimeout>;
    const handleVPResize = () => {
      clearTimeout(vpTimeout);
      vpTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    if (typeof visualViewport !== "undefined") {
      visualViewport.addEventListener("resize", handleVPResize);
    }

    return () => {
      clearTimeout(vpTimeout);
      if (typeof visualViewport !== "undefined") {
        visualViewport.removeEventListener("resize", handleVPResize);
      }
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === hScrollRef.current)
        .forEach((t) => t.kill());
    };
  }, [hScrollRef, hTrackRef, planeUpdateRef, currentIndex, scrollXRef]);
}
