"use client";
import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UpperSvg from "../components/svg/UpperSvg";
import LowerSvg from "../components/svg/LowerSvg";
import ParallaxHero from "../components/ParallaxHero";
import PaperPlaneScene from "../components/Paperplanescene";
import HorizontalScroll from "../components/Horizontalscroll";

import { useBallAnimation } from "../hooks/useBallAnimation";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const section1Ref = useRef<HTMLDivElement>(null);
  const ballSectionRef = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { ballRef, updateBall } = useBallAnimation();

  const planeUpdateRef = useRef<((progress: number) => void) | null>(null);

  const handlePlaneReady = useCallback((update: (progress: number) => void) => {
    planeUpdateRef.current = update;
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      eventsTarget: window,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const sections = gsap.utils.toArray<HTMLElement>(".section-panel");

    const scrollToSection = (index: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      currentIndex.current = index;

      lenis.scrollTo(sections[index] as HTMLElement, {
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (currentIndex.current !== 0) return;
      e.preventDefault();
      if (e.deltaY > 50) {
        scrollToSection(1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    sections.forEach((el) => {
      const title = el.querySelector(".sesi-title");
      if (!title) return;

      gsap.fromTo(
        title,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    // Section 1: hitam → putih
    if (section1Ref.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section1Ref.current,
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
            requestAnimationFrame(() => {
              if (waveRef.current) {
                waveRef.current.classList.remove("wave-absolute");
                waveRef.current.classList.add("wave-sticky");
              }
            });
          },

          onEnterBack: () => {
            currentIndex.current = 1;
            requestAnimationFrame(() => {
              if (waveRef.current) {
                waveRef.current.classList.remove("wave-absolute");
                waveRef.current.classList.add("wave-sticky");
              }
            });
          },

          onLeave: () => {
            currentIndex.current = 2;
            requestAnimationFrame(() => {
              if (waveRef.current) {
                waveRef.current.classList.remove("wave-sticky");
                waveRef.current.classList.add("wave-absolute");
              }
            });
          },

          onLeaveBack: () => {
            currentIndex.current = 0;
            requestAnimationFrame(() => {
              if (waveRef.current) {
                waveRef.current.classList.remove("wave-sticky");
                waveRef.current.classList.add("wave-absolute");
              }
            });
            document.documentElement.style.setProperty(
              "--wave-color",
              "#000000",
            );
          },

          onUpdate: (self) => {},
        },
      });

      tl.to(section1Ref.current, {
        backgroundColor: "#ffffff",
        ease: "none",
      }).to(
        section1Ref.current.querySelector(".sesi-title"),
        { color: "#000000", ease: "none" },
        "<",
      );
    }

    // Section 2: Horizontal scroll + paper plane
    if (hScrollRef.current && hTrackRef.current) {
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
    }

    // Section 3 + 4: Ball putih membesar, lalu konten technologies muncul
    if (ballSectionRef.current) {
      ScrollTrigger.create({
        trigger: ballSectionRef.current,
        start: "top top",
        end: "+=1200",
        scrub: 2,
        pin: true,
        anticipatePin: 1,
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

          // Scale ball hingga memenuhi seluruh layar
          const maxScale =
            Math.ceil(
              Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 20,
            ) + 5;

          const scale = 1 + progress * maxScale;
          ballRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;

          // Fade-in konten section4 di 80% terakhir
          if (section4Ref.current) {
            const contentOpacity = progress > 0.8 ? (progress - 0.8) / 0.2 : 0;
            section4Ref.current.style.opacity = String(contentOpacity);
          }
        },
      });
    }

    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [updateBall]);

  return (
    <div>
      {/* Section 0: Hero */}
      <div className="section-panel h-screen bg-black relative">
        <ParallaxHero />
        <Sidebar />
        <Navbar />
        <UpperSvg ref={waveRef} />
      </div>

      {/* Section 1: scroll → hitam ke putih */}
      <div
        ref={section1Ref}
        className="section-panel h-screen flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <h1
          className="sesi-title text-base md:text-base text-justify px-10 md:px-50 leading-loose"
          style={{ color: "#ffffff" }}
        >
          "Hello everyone, my name is Gilang Arya. I am a Full Stack Developer
          who is passionate about building modern web applications. I have
          experience working with technologies such as JavaScript, React,
          Next.js, and backend development, allowing me to develop both frontend
          interfaces and backend systems. I enjoy creating interactive user
          experiences and building scalable web systems. One of the projects
          I've worked on is an online shop website with product filtering,
          category systems, and shopping cart features. I'm always excited to
          learn new technologies and improve my skills in full stack
          development."
        </h1>
      </div>

      {/* Section 2: Horizontal scroll + paper plane */}
      <div className="section-panel relative bg-black">
        <LowerSvg />
      </div>

      <div ref={hScrollRef} className="section-panel bg-black">
        <HorizontalScroll trackRef={hTrackRef}>
          <PaperPlaneScene trackRef={hTrackRef} onReady={handlePlaneReady} />
          <div
            className="flex"
            style={{
              minWidth: "300vw",
              height: "100vh",
              paddingBottom: "120px",
            }}
          ></div>
        </HorizontalScroll>
      </div>

      {/* Section 3: Ball putih membesar */}
      <div
        ref={ballSectionRef}
        className="section-panel h-[1px]"
        style={{
          backgroundColor: "#000000",
          position: "relative",
          zIndex: 100,
        }}
      />

      {/* Section 3: Ball putih membesar */}
      <div
        ref={ballSectionRef}
        className="section-panel h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#000000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ball sekaligus jadi background Section 4 */}
        <div
          ref={ballRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ffffff",
            transform: "translate(-50%, -50%) scale(1)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Konten Section 4 — muncul saat ball sudah memenuhi layar */}
        <div
          ref={section4Ref}
          style={{
            position: "relative",
            zIndex: 3,
            opacity: 0,
          }}
        >
          <p className="text-black text-4xl">Capek;|</p>
        </div>
      </div>
    </div>
  );
}
