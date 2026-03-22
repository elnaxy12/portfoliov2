import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export function useSection1(
  section1Ref: RefObject<HTMLDivElement | null>,
  waveRef: RefObject<HTMLDivElement | null>,
  currentIndex: RefObject<number>,
) {
  useEffect(() => {
    if (!section1Ref.current) return;

    const el = section1Ref.current;

    const setWave = (isSticky: boolean) => {
      requestAnimationFrame(() => {
        if (!waveRef.current) return;
        waveRef.current.classList.toggle("wave-sticky", isSticky);
        waveRef.current.classList.toggle("wave-absolute", !isSticky);
      });
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=600",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: [0, 1],
          directional: true,
          duration: { min: 0.3, max: 0.8 },
          ease: "power3.inOut",
          inertia: false,
        },
        onEnter: () => {
          currentIndex.current = 1;
          setWave(true);
        },
        onEnterBack: () => {
          currentIndex.current = 1;
          setWave(true);
        },
        onLeave: () => {
          currentIndex.current = 2;
          setWave(false);
        },
        onLeaveBack: () => {
          currentIndex.current = 0;
          setWave(false);
          document.documentElement.style.setProperty("--wave-color", "#000000");
        },
      },
    });

    tl.to(el, { backgroundColor: "#ffffff", ease: "none" }).to(
      el.querySelector(".sesi-title"),
      { color: "#000000", ease: "none" },
      "<",
    );

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === el)
        .forEach((t) => t.kill());
    };
  }, [section1Ref, waveRef, currentIndex]);
}
