import React, { useEffect, useRef } from "react";

// ─── Topographic canvas logic ────────────────────────────────────────────────

function noise(x: number, y: number, t: number): number {
  const s1 = Math.sin(x * 0.008 + t * 0.3) * Math.cos(y * 0.006 + t * 0.2);
  const s2 = Math.sin(x * 0.013 - y * 0.009 + t * 0.15);
  const s3 = Math.cos(x * 0.005 + y * 0.011 + t * 0.25);
  const s4 = Math.sin((x + y) * 0.007 - t * 0.18);
  return (s1 + s2 + s3 + s4) / 4;
}

function lerp(
  a: number,
  b: number,
  va: number,
  vb: number,
  threshold: number,
): number {
  if (Math.abs(vb - va) < 0.0001) return a;
  return a + ((b - a) * (threshold - va)) / (vb - va);
}

type Point = [number, number];
type SegFn = (
  top: Point,
  bottom: Point,
  left: Point,
  right: Point,
) => [Point, Point][];

const SEG_MAP: Partial<Record<number, SegFn>> = {
  1: (_t, b, l) => [[l, b]],
  2: (_t, b, _l, r) => [[b, r]],
  3: (_t, _b, l, r) => [[l, r]],
  4: (t, _b, _l, r) => [[t, r]],
  5: (t, b, l, r) => [
    [l, t],
    [r, b],
  ],
  6: (t, b) => [[t, b]],
  7: (t, _b, l) => [[l, t]],
  8: (t, _b, l) => [[l, t]],
  9: (t, b) => [[t, b]],
  10: (t, b, l, r) => [
    [l, b],
    [t, r],
  ],
  11: (t, _b, _l, r) => [[t, r]],
  12: (_t, _b, l, r) => [[l, r]],
  13: (_t, b, _l, r) => [[b, r]],
  14: (_t, b, l) => [[l, b]],
};

function drawFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  bgColor: string,
  lineColor: string,
  lineWidth = 0.5,
): void {
  const step = 8;
  const levels = 10;
  const cols = Math.ceil(w / step) + 1;
  const rows = Math.ceil(h / step) + 1;

  const grid: number[][] = Array.from({ length: rows }, (_, j) =>
    Array.from({ length: cols }, (_, i) => noise(i * step, j * step, t)),
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
        const v00 = grid[j][i],
          v10 = grid[j][i + 1];
        const v01 = grid[j + 1][i],
          v11 = grid[j + 1][i + 1];

        const idx =
          (v00 > threshold ? 8 : 0) |
          (v10 > threshold ? 4 : 0) |
          (v11 > threshold ? 2 : 0) |
          (v01 > threshold ? 1 : 0);

        const segFn = SEG_MAP[idx];
        if (!segFn) continue;

        const top: Point = [lerp(x, x + step, v00, v10, threshold), y];
        const bottom: Point = [
          lerp(x, x + step, v01, v11, threshold),
          y + step,
        ];
        const left: Point = [x, lerp(y, y + step, v00, v01, threshold)];
        const right: Point = [x + step, lerp(y, y + step, v10, v11, threshold)];

        for (const [p1, p2] of segFn(top, bottom, left, right)) {
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
        }
      }
    }
    ctx.stroke();
  }
}

// ─── Shape ───────────────────────────────────────────────────────────────────

interface ShapeProps {
  size?: number;
  colorStart?: string;
  colorEnd?: string;
  shape?: "diamond" | "circle" | "rounded";
  top?: number;
  left?: number;
  className?: string;
  useTopographic?: boolean;
  topographicBg?: string;
  topographicLine?: string;
  topographicLineWidth?: number;
  "data-doorknob"?: boolean;
}

const Shape: React.FC<ShapeProps> = ({
  size = 100,
  colorStart = "#f5c0f7",
  colorEnd = "#59d5f9",
  shape = "diamond",
  top = 0,
  left = 0,
  useTopographic = false,
  topographicBg = "#F5F2EC",
  topographicLine = "rgba(0,0,0,0.2)",
  topographicLineWidth = 0.5,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    if (!useTopographic) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderSize = 3000;
    canvas.width = renderSize;
    canvas.height = renderSize;

    const loop = () => {
      tRef.current += 0.008;
      drawFrame(
        ctx,
        renderSize,
        renderSize,
        tRef.current,
        topographicBg,
        topographicLine,
        topographicLineWidth,
      );
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [
    useTopographic,
    size,
    topographicBg,
    topographicLine,
    topographicLineWidth,
  ]);

  let borderRadiusStyle = "0";
  let transformStyle = "";

  switch (shape) {
    case "diamond":
      transformStyle = "rotate(45deg)";
      break;
    case "circle":
      borderRadiusStyle = "50%";
      break;
    case "rounded":
      borderRadiusStyle = "20%";
      break;
  }

  return (
    <div
      {...rest}
      className="relative"
      style={{
        width: size,
        height: size,
        top,
        left,
        transform: transformStyle,
        background: useTopographic
          ? "transparent"
          : `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
        borderRadius: borderRadiusStyle,
        overflow: "hidden",
      }}
    >
      {useTopographic && (
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

// ─── ShapeCluster ─────────────────────────────────────────────────────────────

const ShapeCluster: React.FC = () => {
  return (
    <div
      className="
        fixed left-1/2 -translate-x-1/2 bottom-0
        md:absolute md:left-auto md:translate-x-0 md:top-auto md:translate-y-0 md:mt-0
        bg-gray-950 w-50 h-125 p-6 rounded-t-full overflow-hidden"
    >
      <Shape shape="circle" size={128} top={-30} left={60} />
      <Shape shape="diamond" size={88} top={10} left={-10} />
      <Shape shape="rounded" size={76} top={30} left={80} />
      <Shape shape="diamond" size={60} top={30} left={20} />
      <Shape shape="circle" size={56} top={20} left={110} />

      {/* doorknob — pakai topographic background */}
      <Shape
        shape="circle"
        size={20}
        top={-190}
        left={150}
        useTopographic
        topographicBg="#FFFFFF"
        topographicLine="rgba(0,0,0,0.3)"
        topographicLineWidth={0.5}
        data-doorknob
      />
    </div>
  );
};

export default ShapeCluster;
