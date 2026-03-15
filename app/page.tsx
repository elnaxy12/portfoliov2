"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import Lenis from "lenis";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UpperSvg from "../components/svg/UpperSvg";
import LowerSvg from "../components/svg/LowerSvg";
import ParallaxHero from "../components/ParallaxHero";
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

  useEffect(() => {
    // ✅ Lenis selalu jalan — jangan stop/start manual
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      eventsTarget: window,
    });
    lenisRef.current = lenis;

    // ✅ Sync Lenis → ScrollTrigger
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const sections = gsap.utils.toArray<HTMLElement>(".section-panel");

    const scrollToSection = (index: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      currentIndex.current = index;

      gsap.to(window, {
        scrollTo: { y: sections[index], autoKill: false },
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    };

    // ✅ Wheel handler untuk section 0 saja
    const handleWheel = (e: WheelEvent) => {
      if (currentIndex.current !== 0) return;
      e.preventDefault();

      if (e.deltaY > 0) {
        scrollToSection(1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    // Fade-up tiap section
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

    // Transisi warna Section 1 + wave
    if (section1Ref.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top top",
          end: "+=3000",
          scrub: true,
          pin: true,
          anticipatePin: 1,

          snap: {
            snapTo: [0, 1],
            duration: { min: 0.3, max: 0.8 },
            ease: "power3.inOut",
            inertia: false,
          },

          onEnter: () => {
            currentIndex.current = 1;
            if (waveRef.current) {
              waveRef.current.style.position = "sticky";
              waveRef.current.style.bottom = "0";
              waveRef.current.style.left = "0";
              waveRef.current.style.width = "100%";
              waveRef.current.style.zIndex = "50";
            }
          },

          onEnterBack: () => {
            currentIndex.current = 1;
            if (waveRef.current) {
              waveRef.current.style.position = "sticky";
              waveRef.current.style.bottom = "0";
              waveRef.current.style.left = "0";
              waveRef.current.style.width = "100%";
              waveRef.current.style.zIndex = "50";
            }
          },

          onLeave: () => {
            currentIndex.current = 2;
            if (waveRef.current) {
              waveRef.current.style.position = "absolute";
              waveRef.current.style.zIndex = "10";
            }
          },

          onLeaveBack: () => {
            currentIndex.current = 0;
            if (waveRef.current) {
              waveRef.current.style.position = "absolute";
              waveRef.current.style.zIndex = "10";
            }
            document.documentElement.style.setProperty(
              "--wave-color",
              "#000000",
            );
          },

          onUpdate: (self) => {
            const value = Math.round(self.progress * 255);
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

    // Horizontal scroll
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
          scrub: 1,
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
          <div className="flex justify-end items-end text-white" style={{ minWidth: "100vw", height: "100vh" }}>
            <p>Slide 1</p>
          </div>
          <div className="flex justify-end items-end text-white" style={{ minWidth: "100vw", height: "100vh" }}>
            <p>Slide 2</p>
          </div>
          <div className="flex justify-end items-end text-white" style={{ minWidth: "100vw", height: "100vh" }}>
            <p>Slide 2</p>
          </div>
        </HorizontalScroll>
      </div>
    </div>
  );
}
