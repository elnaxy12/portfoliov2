"use client";

import { forwardRef } from "react";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  trackRef: React.RefObject<HTMLDivElement | null>;
}

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
          position: "relative",
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            height: "100%",
            willChange: "transform",
            position: "relative", // ← wajib agar plane bisa absolute di sini
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
