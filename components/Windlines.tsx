import { useEffect, useRef } from "react";

interface WindLinesProps {
  scrollProgress: number;
  style?: React.CSSProperties;
  className?: string;
}

interface Line {
  yFraction: number;
  delay: number;
  opacity: number;
  thick: number;
  amp: number;
  freq: number;
  phaseOff: number;
}

const LINES: Line[] = [
  {
    yFraction: 0.15,
    delay: 0.0,
    opacity: 0.18,
    thick: 0.7,
    amp: 0.28,
    freq: 0.8,
    phaseOff: 0.0,
  },
  {
    yFraction: 0.28,
    delay: 0.05,
    opacity: 0.28,
    thick: 0.9,
    amp: 0.36,
    freq: 0.7,
    phaseOff: 1.2,
  },
  {
    yFraction: 0.4,
    delay: 0.1,
    opacity: 0.4,
    thick: 1.1,
    amp: 0.44,
    freq: 0.6,
    phaseOff: 2.1,
  },
  {
    yFraction: 0.52,
    delay: 0.14,
    opacity: 0.5,
    thick: 1.3,
    amp: 0.5,
    freq: 0.55,
    phaseOff: 0.5,
  },
  {
    yFraction: 0.63,
    delay: 0.18,
    opacity: 0.38,
    thick: 1.0,
    amp: 0.42,
    freq: 0.65,
    phaseOff: 1.8,
  },
  {
    yFraction: 0.75,
    delay: 0.22,
    opacity: 0.22,
    thick: 0.7,
    amp: 0.32,
    freq: 0.75,
    phaseOff: 0.9,
  },
  {
    yFraction: 0.85,
    delay: 0.26,
    opacity: 0.14,
    thick: 0.6,
    amp: 0.22,
    freq: 0.9,
    phaseOff: 2.6,
  },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function WindLines({
  scrollProgress,
  style,
  className,
}: WindLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    targetRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0,
      H = 0;

    const BASE = "255,255,255";
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * devicePixelRatio;
      canvas!.height = H * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function drawFrame() {
      progressRef.current += (targetRef.current - progressRef.current) * 0.08;
      const sp = progressRef.current;

      ctx.clearRect(0, 0, W, H);

      for (const ln of LINES) {
        const raw = (sp - ln.delay) / (1 - ln.delay);
        const t = Math.min(1, Math.max(0, raw));
        const progress = easeOut(t);
        if (progress <= 0) continue;

        // reveal dari 0 sampai W penuh (pojok kanan)
        const revealX = W * progress;
        const segs = Math.ceil(revealX / 3);
        if (segs < 2) continue;

        const grad = ctx.createLinearGradient(0, 0, revealX, 0);
        grad.addColorStop(0, `rgba(${BASE},0)`);
        grad.addColorStop(0.04, `rgba(${BASE},${ln.opacity})`);
        grad.addColorStop(0.92, `rgba(${BASE},${ln.opacity})`);
        grad.addColorStop(1, `rgba(${BASE},0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = ln.thick;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let s = 0; s <= segs; s++) {
          const x = (s / segs) * revealX;
          // norm pakai W bukan revealX — gelombang penuh tetap konsisten
          const norm = x / W;
          const y =
            H * ln.yFraction +
            Math.sin(norm * Math.PI * 2 * ln.freq + ln.phaseOff) * ln.amp * H;
          s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(drawFrame);
    }

    resize();
    drawFrame();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        ...style,
      }}
      className={className}
    />
  );
}
