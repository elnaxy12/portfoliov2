import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

export function useHorizontalScroll(
  hScrollRef: RefObject<HTMLDivElement | null>,
  hTrackRef: RefObject<HTMLDivElement | null>,
  planeUpdateRef: RefObject<((progress: number) => void) | null>,
  currentIndex: RefObject<number>,
  scrollXRef: RefObject<number>,
  lenisRef: RefObject<Lenis | null>, // ← tambah param
) {
  useEffect(() => {
    if (!hScrollRef.current || !hTrackRef.current) return;

    const track = hTrackRef.current;
    const isMobile = window.innerWidth < 768;

    const vp: VisualViewport | null =
      typeof visualViewport !== "undefined" ? visualViewport : null;

    const getVW = () => vp?.width ?? window.innerWidth;
    const getTotalWidth = () => track.scrollWidth - getVW();

    gsap.to(track, {
      x: () => -getTotalWidth(),
      ease: "none",
      scrollTrigger: {
        trigger: hScrollRef.current,
        start: "top top",
        end: () => `+=${getTotalWidth() + (isMobile ? 300 : 800)}`,
        scrub: isMobile ? 0.5 : true,
        pin: true,
        anticipatePin: isMobile ? 0 : 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          currentIndex.current = 2;
          planeUpdateRef.current?.(0);

          // Pause Lenis saat masuk pinned section di mobile
          // agar tidak konflik dengan ScrollTrigger scrub
          if (isMobile) lenisRef.current?.stop();
        },
        onLeave: () => {
          currentIndex.current = 3;

          // Resume Lenis setelah keluar pinned section
          if (isMobile) {
            lenisRef.current?.start();
            // Beri jeda singkat lalu refresh agar ScrollTrigger
            // sections berikutnya terhitung ulang dengan benar
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 50);
          }
        },
        onEnterBack: () => {
          currentIndex.current = 2;
          planeUpdateRef.current?.(0);
          if (isMobile) lenisRef.current?.stop();
        },
        onLeaveBack: () => {
          currentIndex.current = 1;
          scrollXRef.current = 0;
          if (isMobile) {
            lenisRef.current?.start();
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 50);
          }
        },
        onUpdate: (self) => {
          const progress = Math.min(self.progress, 1);

          const r = Math.round(155 + (189 - 155) * progress);
          const g = Math.round(142 + (166 - 142) * progress);
          const b = Math.round(199 + (206 - 199) * progress);

          if (hScrollRef.current) {
            hScrollRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }

          scrollXRef.current = progress * getTotalWidth();
          planeUpdateRef.current?.(progress);

          // Di mobile, saat progress hampir selesai, start lagi Lenis
          // supaya user bisa lanjut scroll ke section berikutnya
          // tanpa harus tunggu onLeave yang kadang terlambat di mobile
          if (isMobile && progress >= 0.98 && lenisRef.current?.isStopped) {
            lenisRef.current.start();
          }
        },
      },
    });

    let vpTimeout: ReturnType<typeof setTimeout>;
    const handleVPResize = () => {
      clearTimeout(vpTimeout);
      vpTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    vp?.addEventListener("resize", handleVPResize);

    return () => {
      clearTimeout(vpTimeout);
      vp?.removeEventListener("resize", handleVPResize);
      // Pastikan Lenis tidak tertinggal dalam state stopped
      lenisRef.current?.start();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === hScrollRef.current)
        .forEach((t) => t.kill());
    };
  }, [
    hScrollRef,
    hTrackRef,
    planeUpdateRef,
    currentIndex,
    scrollXRef,
    lenisRef,
  ]);
}
