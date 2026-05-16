"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function ScrollBar({
  lenisRef,
}: {
  lenisRef: React.RefObject<Lenis | null>;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const check = setInterval(() => {
      const lenis = lenisRef.current;
      if (!lenis) return;

      lenis.on("scroll", ({ progress }: { progress: number }) => {
        const thumb = thumbRef.current;
        if (!thumb) return;

        // Update posisi
        const trackHeight = window.innerHeight;
        const thumbHeight = thumb.offsetHeight;
        thumb.style.top = `${progress * (trackHeight - thumbHeight)}px`;

        // Tampilkan
        thumb.style.opacity = "1";

        // Reset fade timer
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = setTimeout(() => {
          thumb.style.opacity = "0";
        }, 1000); // fade setelah 1 detik tidak scroll
      });

      clearInterval(check);
    }, 50);

    return () => {
      clearInterval(check);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
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
          transition: "top 0.1s linear, opacity 0.4s ease",
          opacity: 0, // mulai tersembunyi
        }}
      />
    </div>
  );
}
