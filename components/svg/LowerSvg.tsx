// LowerSvg.tsx
import { forwardRef } from "react";

const LowerSvg = forwardRef<SVGSVGElement>((_, ref) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        lineHeight: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "120px" }}
      >
        <path
          d="M0,0 C360,120 1080,120 1440,0 L1440,120 L0,120 Z"
          fill="#000000"
        />
      </svg>
    </div>
  );
});

LowerSvg.displayName = "LowerSvg";
export default LowerSvg;