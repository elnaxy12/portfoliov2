import { useEffect, useRef, CSSProperties, ReactNode } from "react";

type Point = [number, number];
type Segment = [Point, Point];
type SegFn = (top: Point, bottom: Point, left: Point, right: Point) => Segment[];

interface DrawOptions {
  step: number;
  levels: number;
  bgColor: string;
  lineColor: string;
  lineWidth: number;
}

export interface TopographicBackgroundProps {
  bgColor?: string;
  lineColor?: string;
  lineWidth?: number;
  step?: number;
  levels?: number;
  speed?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

function noise(x: number, y: number, t: number): number {
  const s1 = Math.sin(x * 0.008 + t * 0.3) * Math.cos(y * 0.006 + t * 0.2);
  const s2 = Math.sin(x * 0.013 - y * 0.009 + t * 0.15);
  const s3 = Math.cos(x * 0.005 + y * 0.011 + t * 0.25);
  const s4 = Math.sin((x + y) * 0.007 - t * 0.18);
  return (s1 + s2 + s3 + s4) / 4;
}

function lerp(a: number, b: number, va: number, vb: number, threshold: number): number {
  if (Math.abs(vb - va) < 0.0001) return a;
  return a + (b - a) * (threshold - va) / (vb - va);
}

const SEG_MAP: Partial<Record<number, SegFn>> = {
  1:  (t, b, l, r) => [[l, b]],
  2:  (t, b, l, r) => [[b, r]],
  3:  (t, b, l, r) => [[l, r]],
  4:  (t, b, l, r) => [[t, r]],
  5:  (t, b, l, r) => [[l, t], [r, b]],
  6:  (t, b, l, r) => [[t, b]],
  7:  (t, b, l, r) => [[l, t]],
  8:  (t, b, l, r) => [[l, t]],
  9:  (t, b, l, r) => [[t, b]],
  10: (t, b, l, r) => [[l, b], [t, r]],
  11: (t, b, l, r) => [[t, r]],
  12: (t, b, l, r) => [[l, r]],
  13: (t, b, l, r) => [[b, r]],
  14: (t, b, l, r) => [[l, b]],
};

function drawFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  options: DrawOptions
): void {
  const { step, levels, bgColor, lineColor, lineWidth } = options;
  const cols = Math.ceil(w / step) + 1;
  const rows = Math.ceil(h / step) + 1;

  const grid: number[][] = Array.from({ length: rows }, (_, j) =>
    Array.from({ length: cols }, (_, i) => noise(i * step, j * step, t))
  );

  ctx.clearRect(0, 0, w, h);
  if (bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (let l = 0; l < levels; l++) {
    const threshold = -0.9 + (l / levels) * 1.8;
    ctx.beginPath();

    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const x = i * step;
        const y = j * step;
        const v00 = grid[j][i];
        const v10 = grid[j][i + 1];
        const v01 = grid[j + 1][i];
        const v11 = grid[j + 1][i + 1];

        const idx =
          (v00 > threshold ? 8 : 0) |
          (v10 > threshold ? 4 : 0) |
          (v11 > threshold ? 2 : 0) |
          (v01 > threshold ? 1 : 0);

        const segFn = SEG_MAP[idx];
        if (!segFn) continue;

        const top:    Point = [lerp(x, x + step, v00, v10, threshold), y];
        const bottom: Point = [lerp(x, x + step, v01, v11, threshold), y + step];
        const left:   Point = [x, lerp(y, y + step, v00, v01, threshold)];
        const right:  Point = [x + step, lerp(y, y + step, v10, v11, threshold)];

        const segs = segFn(top, bottom, left, right);
        for (const [p1, p2] of segs) {
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
        }
      }
    }
    ctx.stroke();
  }
}

export default function TopographicBackground({
  bgColor = "#F5F2EC",
  lineColor = "rgba(60,50,35,0.18)",
  lineWidth = 1.1,
  step = 8,
  levels = 10,
  speed = 0.008,
  style = {},
  children,
}: TopographicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const options: DrawOptions = { step, levels, bgColor, lineColor, lineWidth };

    const loop = () => {
      tRef.current += speed;
      drawFrame(ctx, canvas.width, canvas.height, tRef.current, options);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [bgColor, lineColor, lineWidth, step, levels, speed]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {children && (
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      )}
    </div>
  );
}