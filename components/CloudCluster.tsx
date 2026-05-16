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
  {
    top: "15%",
    left: "-5%",
    width: "180px",
    opacity: 1,
    flip: false,
    duration: 18,
    delay: 0,
  },
  {
    top: "25%",
    right: "-3%",
    width: "140px",
    opacity: 1,
    flip: true,
    duration: 22,
    delay: 3,
  },
  {
    top: "8%",
    left: "30%",
    width: "160px",
    opacity: 1,
    flip: false,
    duration: 15,
    delay: 6,
  },
  {
    top: "55%",
    left: "10%",
    width: "120px",
    opacity: 1,
    flip: true,
    duration: 20,
    delay: 1,
  },
  {
    top: "40%",
    right: "15%",
    width: "200px",
    opacity: 1,
    flip: false,
    duration: 25,
    delay: 8,
  },
  {
    top: "70%",
    left: "50%",
    width: "150px",
    opacity: 1,
    flip: true,
    duration: 17,
    delay: 4,
  },
  {
    top: "60%",
    right: "-2%",
    width: "130px",
    opacity: 1,
    flip: false,
    duration: 21,
    delay: 2,
  },
  {
    top: "80%",
    left: "20%",
    width: "110px",
    opacity: 1,
    flip: false,
    duration: 19,
    delay: 7,
  },
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
            animation: `${c.flip ? "cloudDriftFlip" : "cloudDrift"} ${c.duration}s ease-in-out ${c.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}
