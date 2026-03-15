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
      <div
        ref={bgRef}
        className="absolute inset-0 bg-center bg-cover scale-125"
        style={{ backgroundImage: "url('images/parallax-hero.jpg')" }}
      />

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
