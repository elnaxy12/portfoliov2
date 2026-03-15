import { forwardRef } from "react";

const UpperSvg = forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <div
      ref={ref}
      className="sticky bottom-0 w-full overflow-hidden leading-[0] z-50 -mt-20 pointer-events-none"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-10 md:h-20"
      >
        <path d="M0,120 C600,0 600,0 1200,120 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
});

UpperSvg.displayName = "UpperSvg";
export default UpperSvg;
