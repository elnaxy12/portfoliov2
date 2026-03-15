export default function LowerSvg() {
  return (
    <div className="absolute top-0 w-full overflow-hidden leading-[0] z-50 pointer-events-none bg-black">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-10 md:h-20"
        style={{ transform: "rotate(180deg)" }}
      >
        <path
          d="M0,120 C600,0 600,0 1200,120 L1200,120 L0,120 Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
