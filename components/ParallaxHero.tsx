"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const text = textRef.current;
    if (!section || !bg || !text) return;

    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bg, {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade out teks hero saat scroll
      gsap.to(text, {
        opacity: 0,
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "40% top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Background parallax layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-center bg-cover scale-125"
        style={{ backgroundImage: "url('images/parallax-hero.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative flex items-center justify-center h-full">
        <h1 ref={textRef} className="text-white text-5xl font-bold">
          Selamat Datang
        </h1>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0] z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-20"
        >
          <path
            d="M0,0 C600,100 600,100 1200,0 L1200,120 L0,120 Z"
            className="fill-black"
          />
        </svg>
      </div>
    </section>
  );
}
