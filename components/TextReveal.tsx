import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { gsap } from "gsap";

export interface TextRevealHandle {
  play: () => void;
  reset: () => void;
}

const TextReveal = forwardRef<
  TextRevealHandle,
  {
    lines: string[];
    duration?: number;
    stagger?: number;
    bgColor?: string;
  }
>(({ lines, duration = 0.5, stagger = 0.15, bgColor = "#C0DD97" }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    play() {
      const els = containerRef.current?.querySelectorAll<HTMLElement>(".tr-bg");
      if (!els?.length) return;
      gsap.set(els, { scaleX: 0, transformOrigin: "left center", xPercent: 0 });
      gsap.to(els, {
        keyframes: [
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration,
            ease: "power2.inOut",
          },
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration,
            ease: "power2.inOut",
          },
        ],
        stagger,
      });
    },
    reset() {
      const els = containerRef.current?.querySelectorAll<HTMLElement>(".tr-bg");
      if (!els?.length) return;
      gsap.set(els, { scaleX: 0 });
    },
  }));

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        alignItems: "center",
        // justifyContent: "flex-center",
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
          }}
        >
          <span style={{ display: "block" }}>{line}</span>
          <div
            className="tr-bg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: bgColor,
              pointerEvents: "none",
              transform: "scaleX(0)",
            }}
          />
        </div>
      ))}
    </div>
  );
});

export default TextReveal;
