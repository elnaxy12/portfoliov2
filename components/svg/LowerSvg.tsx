import { forwardRef } from "react";

const LowerSvg = forwardRef<SVGSVGElement>((_, ref) => {
  return (
    <div
      className="absolute top-0 w-full overflow-hidden leading-[0] z-50 pointer-events-none"
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
        className="relative block w-full h-10 md:h-20"
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{
          display: "block",
          width: "100%",
          height: "120px",
          transform: "rotate(180deg)",
        }}
      >
        <path
          d="M0,120 C720,0 720,0 1440,120 L1440,120 L0,120 Z"
          fill="#ffffff"
        />{" "}
      </svg>
    </div>
  );
});

LowerSvg.displayName = "LowerSvg";
export default LowerSvg;
