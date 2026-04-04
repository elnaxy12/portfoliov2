export function Cloud({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 2933.3333 2933.3333"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="m 7990.97,18953.8 c -116.45,0 -229.65,-13.9 -338.17,-39.7 -165.84,636.2 -744.31,1105.9 -1432.5,1105.9 -220.99,0 -430.62,-48.5 -618.95,-135.4 -321.45,335.7 -774.05,544.7 -1275.48,544.7 -876.47,0 -1603.66,-638.5 -1742.06,-1475.8 -793.02,-10.2 -1432.78,-656.1 -1432.78,-1451.5 0,-801.8 649.98,-1451.8 1451.76,-1451.8 36.44,0 72.56,1.4 108.32,4 207.77,-547.6 737.24,-936.9 1357.72,-936.9 345.35,0 662.46,120.6 911.67,322 243.32,-144 527.19,-226.8 830.45,-226.8 678.52,0 1260.32,413.9 1506.76,1003.1 201.24,-105.6 430.25,-165.4 673.26,-165.4 801.78,0 1451.76,650 1451.76,1451.8 0,801.8 -649.98,1451.8 -1451.76,1451.8"
        fill="white"
        transform="matrix(0.13333333,0,0,-0.13333333,0,2933.3333)"
      />
    </svg>
  );
}

const clouds = [
  { top: "5%", left: "-8%", width: "200px", opacity: 1, flip: false },
  { top: "10%", right: "-5%", width: "170px", opacity: 1, flip: true },
  { top: "30%", left: "-3%", width: "150px", opacity: 1, flip: false },
  { top: "20%", left: "35%", width: "180px", opacity: 1, flip: true },
  { top: "50%", right: "-8%", width: "160px", opacity: 1, flip: false },
  { top: "45%", left: "5%", width: "130px", opacity: 1, flip: true },
  { top: "70%", left: "40%", width: "190px", opacity: 1, flip: false },
  { top: "75%", right: "5%", width: "140px", opacity: 1, flip: true },
];

export function CloudClusterDoor() {
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
