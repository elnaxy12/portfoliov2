"use client";

import { useRef, RefObject } from "react";
import { useScrollTextAnimation } from "../hooks/useScrollTextAnimation";

interface ScrollTextOverlayProps {
  scrollXRef: RefObject<number>;
  trackRef: RefObject<HTMLDivElement | null>;
  headlineText?: React.ReactNode;
  text1In?: number;
  text1Full?: number;
}

export function ScrollTextOverlay({
  scrollXRef,
  trackRef,
  headlineText = "Teks awal kamu",
  text1In,
  text1Full,
}: ScrollTextOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // ✅ Hanya pakai text1
  useScrollTextAnimation({
    scrollXRef,
    trackRef,
    textRef: overlayRef,
    text1In,
    text1Full,
  });

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {/* 🔹 TEXT 1 */}
      <div
        className="scroll-text-1 text-6xl pl-4 flex items-center justify-center"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          margin: 0,
          fontWeight: 500,
          color: "white",
        }}
      >
        {headlineText}
      </div>
    </div>
  );
}
