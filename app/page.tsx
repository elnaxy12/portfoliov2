"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Observer } from "gsap/dist/Observer";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ParallaxHero from "../components/ParallaxHero";

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

export default function Home() {
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section-panel");

    const goToSection = (index: number) => {
      if (isAnimating.current || index < 0 || index >= sections.length) return;
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

    const observer = Observer.create({
      type: "wheel,touch",
      wheelSpeed: -1,
      onDown: () => goToSection(currentIndex.current - 1),
      onUp: () => goToSection(currentIndex.current + 1),
      tolerance: 10,
      preventDefault: true,
    });

    // Animasi fade-up tiap section
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

    return () => {
      observer.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="bg-black overflow-hidden">
      <aside className="w-64 fixed z-50">
        <Sidebar />
      </aside>

      {/* Section 0: Hero */}
      <div className="section-panel">
        <ParallaxHero />
        <Navbar />
      </div>

      {/* Section 1 */}
      <div className="section-panel h-screen flex items-center justify-center">
        <h1 className="sesi-title text-white text-5xl font-bold">Sesi 1</h1>
      </div>

      {/* Section 2 */}
      <div className="section-panel h-screen flex items-center justify-center">
        <h1 className="sesi-title text-white text-5xl font-bold">Sesi 2</h1>
      </div>
    </div>
  );
}
