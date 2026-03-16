"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import Lenis from "lenis";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UpperSvg from "../components/svg/UpperSvg";
import LowerSvg from "../components/svg/LowerSvg";
import ParallaxHero from "../components/ParallaxHero";
import PaperPlaneScene from "../components/Paperplanescene";
import HorizontalScroll from "../components/Horizontalscroll";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const section1Ref = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const planeUpdateRef = useRef<((progress: number) => void) | null>(null);
  const [arrived, setArrived] = useState(false);
  const arrivedRef = useRef(false);

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

    if (section1Ref.current) {
      let lastColorValue = -1;

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

          onUpdate: (self) => {
            const value = Math.round(self.progress * 255);
            if (value === lastColorValue) return;
            lastColorValue = value;
            const hex = value.toString(16).padStart(2, "0");
            document.documentElement.style.setProperty(
              "--wave-color",
              `#${hex}${hex}${hex}`,
            );
          },
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

    if (hScrollRef.current && hTrackRef.current) {
      const track = hTrackRef.current;
      const getTotalWidth = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getTotalWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: hScrollRef.current,
          start: "top top",
          end: () => `+=${getTotalWidth()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            currentIndex.current = 2;
          },
          onLeave: () => {
            currentIndex.current = 2;
          },
          onEnterBack: () => {
            currentIndex.current = 2;
          },
          onLeaveBack: () => {
            currentIndex.current = 1;
          },

          onUpdate: (self) => {
            planeUpdateRef.current?.(self.progress);

            if (self.progress >= 0.98 && !arrivedRef.current) {
              arrivedRef.current = true;
              setTimeout(() => setArrived(true), 400);
            }
            if (self.progress < 0.95 && arrivedRef.current) {
              arrivedRef.current = false;
              setArrived(false);
            }
          },
        },
      });
    }

    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div>
      {/* Welcome Text Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 50,
          opacity: arrived ? 1 : 0,
          transition: "opacity 1.4s ease",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "white",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 200,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Welcome
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
              letterSpacing: "0.5em",
              marginTop: "1rem",
              textTransform: "uppercase",
            }}
          >
            To My Website Visitors
          </p>
        </div>
      </div>

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

      {/* Section 2: Horizontal scroll */}
      <div ref={hScrollRef} className="section-panel relative bg-black">
        <LowerSvg />
        <HorizontalScroll trackRef={hTrackRef}>
          <PaperPlaneScene trackRef={hTrackRef} onReady={handlePlaneReady} />
          <div
            className="flex justify-end items-end text-white"
            style={{ minWidth: "300vw", height: "100vh" }}
          ></div>
        </HorizontalScroll>
      </div>
    </div>
  );
}
