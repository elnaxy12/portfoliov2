"use client";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { gsap } from "gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    document.body.style.overflow = "hidden";

    let currentY = 0;
    let targetY = 0;
    let rafId: number;
    const ease = 0.07;

    const container = containerRef.current;
    if (!container) return;

    const setBodyHeight = () => {
      document.body.style.height = container.scrollHeight + "px";
    };
    setBodyHeight();

    const resizeObserver = new ResizeObserver(setBodyHeight);
    resizeObserver.observe(container);

    const handleScroll = () => {
      targetY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // kasih tau ScrollTrigger pakai scroll position custom
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          currentY = value;
        }
        return currentY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    function raf() {
      currentY += (targetY - currentY) * ease;
      if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;

      if (container) {
        container.style.transform = `translateY(${-currentY}px)`;
      }

      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      ScrollTrigger.scrollerProxy(document.body, null as any);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%" }}
    >
      {children}
    </div>
  );
}