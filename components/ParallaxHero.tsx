"use client";

import { useEffect, useRef } from "react";

export default function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${scroll * 0.4}px, 0)`;
      }
    };

    const smoothScroll = () => {
      handleScroll();
      requestAnimationFrame(smoothScroll);
    };

    smoothScroll();
  }, []);

  return (
    <section
      className="relative h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('images/parallax-hero.jpg')" }}
    >
      <div className="flex items-center justify-center h-full">
        <h1 className="text-white text-5xl font-bold">Selamat Datang</h1>
      </div>

      <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
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
