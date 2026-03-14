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
  const section1Ref = useRef<HTMLDivElement>(null);

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

    // Transisi warna Section 1
    if (section1Ref.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top top",
          end: "+=600",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          // ✅ Matikan Observer saat pin aktif, nyalakan lagi setelah selesai
          onEnter: () => observer.disable(),
          onLeave: () => {
            observer.enable();
            currentIndex.current = 2; // lanjut ke section berikutnya
          },
          onEnterBack: () => observer.disable(),

          onLeaveBack: () => {
            observer.enable();
            currentIndex.current = 0; // balik ke hero
          },
        },
      });

      tl.to(section1Ref.current, {
        backgroundColor: "#ffffff",
        ease: "none",
      }).to(
        section1Ref.current.querySelector(".sesi-title"),
        {
          color: "#000000",
          ease: "none",
        },
        "<",
      );
    }

    return () => {
      observer.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Section 0: Hero */}
      <div className="section-panel h-screen bg-black">
        <ParallaxHero />
        <Sidebar />
        <Navbar />
      </div>

      {/* Section 1: scroll → hitam ke putih */}
      <div
        ref={section1Ref}
        className="section-panel h-screen flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <h1
          className="sesi-title text-xs md:text-base text-justify px-10 md:px-50 leading-loose"
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
    </div>
  );
}
