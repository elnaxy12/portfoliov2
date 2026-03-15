"use client";

import { forwardRef } from "react";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  trackRef: React.RefObject<HTMLDivElement | null>;
}

// Pure wrapper — semua GSAP logic dikontrol dari page.tsx
// supaya ScrollTrigger bisa ngitung posisi yang benar setelah pin section1 selesai
const HorizontalScroll = forwardRef<HTMLDivElement, HorizontalScrollProps>(
  ({ children, className = "", trackRef }, ref) => {
    return (
      <div
        ref={ref}
        className={`horizontal-scroll-wrapper ${className}`}
        style={{
          overflow: "hidden",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            height: "100%",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);

HorizontalScroll.displayName = "HorizontalScroll";

export default HorizontalScroll;
