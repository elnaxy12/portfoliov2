export function Cloud({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 300 130"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M270,90 
           C290,90 305,75 305,57 
           C305,39 290,24 270,24 
           C268,24 266,24 264,25
           C258,10 243,0 225,0 
           C207,0 192,10 186,25
           C180,20 172,17 163,17
           C143,17 127,33 127,53
           C127,54 127,55 127,56
           C118,52 108,50 97,50
           C70,50 48,70 48,95
           C48,95 48,96 48,96
           C35,98 25,110 25,124
           C25,124 270,124 270,124
           Z"
        fill="white"
      />
    </svg>
  );
}

const clouds = [
  { top: "15%", left: "-5%", width: "180px", opacity: 0.3, flip: false },
  { top: "25%", right: "-3%", width: "140px", opacity: 0.3, flip: true },
  { top: "8%", left: "30%", width: "160px", opacity: 0.3, flip: false },
  { top: "55%", left: "10%", width: "120px", opacity: 0.3, flip: true },
  { top: "40%", right: "15%", width: "200px", opacity: 0.3, flip: false },
  { top: "70%", left: "50%", width: "150px", opacity: 0.3, flip: true },
  { top: "60%", right: "-2%", width: "130px", opacity: 0.3, flip: false },
  { top: "80%", left: "20%", width: "110px", opacity: 0.3, flip: false },
];

export function CloudCluster() {
  return (
    <>
      {clouds.map((c, i) => (
        <Cloud
          key={i}
          style={{
            position: "absolute",
            top: c.top,
            left: c.left,
            right: c.right,
            width: c.width,
            opacity: c.opacity,
            pointerEvents: "none",
            transform: c.flip ? "scaleX(-1)" : undefined,
          }}
        />
      ))}
    </>
  );
}
