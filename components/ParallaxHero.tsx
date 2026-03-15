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
    if (!section || !bg || !text ) return;

    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bg, {
        yPercent: 60,
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
      <video
        ref={bgRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-125"
      >
        <source src="/videos/parallax-hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative flex items-center justify-center h-full px-4">
        <div
          ref={textRef}
          className="text-white flex flex-col items-center text-center gap-2"
        >
          <p className="text-base">Hi!, I'm Gilang Arya Leksana</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Full-Stack Developer
          </h1>
        </div>
      </div>
    </section>
  );
}
