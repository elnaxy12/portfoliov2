"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Observer } from "gsap/dist/Observer";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import UpperSvg from "../components/svg/UpperSvg";
import LowerSvg from "../components/svg/LowerSvg";

import ParallaxHero from "../components/ParallaxHero";
import HorizontalScroll from "../components/Horizontalscroll";

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

export default function Home() {
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const section1Ref = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section-panel");

    const observer = Observer.create({
      type: "wheel,touch",
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onUp: () => {
        if (currentIndex.current === 0 && !isAnimating.current) {
          isAnimating.current = true;
          currentIndex.current = 1;

          gsap.to(window, {
            scrollTo: { y: sections[1], autoKill: false },
            duration: 1,
            ease: "power3.inOut",
            onComplete: () => {
              isAnimating.current = false;
              observer.disable();
            },
          });
        }
      },
      onDown: () => {
        if (currentIndex.current === 1 && !isAnimating.current) {
          isAnimating.current = true;
          currentIndex.current = 0;

          gsap.to(window, {
            scrollTo: { y: sections[0], autoKill: false },
            duration: 1,
            ease: "power3.inOut",
            onComplete: () => {
              isAnimating.current = false;
            },
          });
        }

        // ← tambah ini: dari section horizontal scroll balik ke section wave
        if (currentIndex.current === 2 && !isAnimating.current) {
          isAnimating.current = true;
          currentIndex.current = 1;

          gsap.to(window, {
            scrollTo: { y: sections[1], autoKill: false },
            duration: 1,
            ease: "power3.inOut",
            onComplete: () => {
              isAnimating.current = false;
            },
          });
        }
      },
    });

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
      let canSnapBack = false;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top top",
          end: "+=3000",
          scrub: true,
          pin: true,
          anticipatePin: 1,

          onEnter: () => {
            if (waveRef.current) {
              waveRef.current.style.position = "sticky";
              waveRef.current.style.bottom = "0";
              waveRef.current.style.left = "0";
              waveRef.current.style.width = "100%";
              waveRef.current.style.zIndex = "50";
            }
          },

          onEnterBack: () => {
            if (waveRef.current) {
              waveRef.current.style.position = "sticky";
              waveRef.current.style.bottom = "0";
              waveRef.current.style.left = "0";
              waveRef.current.style.width = "100%";
              waveRef.current.style.zIndex = "50";
            }
          },

          onLeave: () => {
            if (waveRef.current) {
              waveRef.current.style.position = "absolute";
              waveRef.current.style.zIndex = "10";
            }
          },

          onLeaveBack: () => {
            if (waveRef.current) {
              waveRef.current.style.position = "absolute";
              waveRef.current.style.zIndex = "10";
            }
            document.documentElement.style.setProperty(
              "--wave-color",
              "#000000",
            );
            observer.enable();
            currentIndex.current = 0;
          },

          onUpdate: (self) => {
            const value = Math.round(self.progress * 255);
            const hex = value.toString(16).padStart(2, "0");
            document.documentElement.style.setProperty(
              "--wave-color",
              `#${hex}${hex}${hex}`,
            );
            if (self.progress >= 0.99) canSnapBack = true;
            if (self.progress <= 0.01 && canSnapBack) {
              canSnapBack = false;
              observer.enable();
              currentIndex.current = 0;
              gsap.to(window, {
                scrollTo: { y: 0, autoKill: false },
                duration: 1,
                ease: "power3.inOut",
                onComplete: () => {
                  isAnimating.current = false;
                },
              });
            }
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

    // Horizontal scroll — setup SETELAH section1 supaya posisi benar
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
          onEnter: () => observer.disable(),
          onLeave: () => {
            observer.enable();
            currentIndex.current = 2; // ← tandai sudah di section terakhir
          },
          onEnterBack: () => {
            observer.disable();
            currentIndex.current = 2; // ← tambah ini
          },
          onLeaveBack: () => {
            observer.enable();
            currentIndex.current = 1; // ← tambah ini
          },
        },
      });
    }

    setTimeout(() => ScrollTrigger.refresh(), 100);
    
    return () => {
      observer.kill();
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

      <div className="section-panel relative bg-black">
        <LowerSvg />
        <HorizontalScroll ref={hScrollRef} trackRef={hTrackRef}>
          <div style={{ minWidth: "100vw", height: "100vh" }}>Slide 1</div>
          <div style={{ minWidth: "100vw", height: "100vh" }}>Slide 2</div>
          <div style={{ minWidth: "100vw", height: "100vh" }}>Slide 3</div>
        </HorizontalScroll>
      </div>
    </div>
  );
}
