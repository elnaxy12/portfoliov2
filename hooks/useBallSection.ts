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
      // Tidak perlu bedain mobile/desktop, biarkan Lenis handle semua
      section4Ref.current?.removeAttribute("data-lenis-prevent");
      section4Ref.current!.style.overflowY = "visible";
      section4Ref.current!.style.maxHeight = "none";
    };

    // 👇 jalankan pertama kali
    updateLenisPrevent();

    // 👇 handle resize
    window.addEventListener("resize", updateLenisPrevent);

    const isMobile = window.innerWidth < 768;

    ScrollTrigger.create({
      trigger: ballSectionRef.current,
      start: "top top",
      end: isMobile ? "+=800" : "+=1200",
      scrub: isMobile ? 0.3 : 1,
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
        if (!ballRef.current) return;

        const progress = self.progress;

        // Hitung jarak dari posisi ball ke pojok terjauh
        const ballX = window.innerWidth / 2;
        const ballY = window.innerHeight * 0.75; // bottom 25% = top 75%

        const distToCorner = Math.max(
          Math.sqrt(ballX ** 2 + ballY ** 2), // pojok kiri atas
          Math.sqrt((window.innerWidth - ballX) ** 2 + ballY ** 2), // pojok kanan atas
          Math.sqrt(ballX ** 2 + (window.innerHeight - ballY) ** 2), // pojok kiri bawah
          Math.sqrt(
            (window.innerWidth - ballX) ** 2 +
              (window.innerHeight - ballY) ** 2,
          ), // pojok kanan bawah
        );

        const ballRadius = 10; // setengah dari width/height ball (20px)
        const maxScale = Math.ceil(distToCorner / ballRadius) + 2;

        ballRef.current.style.transform = `translate(-50%, 50%) scale(${1 + progress * maxScale})`;

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

      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === ballSectionRef.current)
        .forEach((t) => t.kill());
    };
  }, [ballSectionRef, ballRef, section4Ref, currentIndex]);
}
