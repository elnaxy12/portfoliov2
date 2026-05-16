"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function ScrollBar({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = setInterval(() => {
      const lenis = lenisRef.current;
      if (!lenis) return;

      lenis.on("scroll", ({ progress }: { progress: number }) => {
        if (thumbRef.current) {
          const trackHeight = window.innerHeight;
          const thumbHeight = thumbRef.current.offsetHeight;
          thumbRef.current.style.top = `${progress * (trackHeight - thumbHeight)}px`;
        }
      });

      clearInterval(check);
    }, 50);

    return () => clearInterval(check);
  }, [lenisRef]);

  return (
    <div
      style={{
        position: "fixed",
        right: "4px",
        top: 0,
        width: "3px",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        ref={thumbRef}
        style={{
          position: "absolute",
          width: "6px",
          height: "6%",
          backgroundColor: "rgb(44, 44, 44)",
          borderRadius: "99px",
          transition: "top 0.1s linear",
        }}
      />
    </div>
  );
}