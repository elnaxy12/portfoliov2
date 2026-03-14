"use client";

import { useEffect, useRef } from "react";

interface DropZoomProps {
  progress?: number; // 0 → 1, dikontrol dari luar
}

export default function DropZoom({ progress = 0 }: DropZoomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function ease(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  function easeOut(t: number) {
    return 1 - Math.pow(1 - t, 4);
  }
  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
  }

  function draw(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    p: number,
  ) {
    const CX = W / 2;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    if (p < 0.45) {
      const fp = ease(clamp(p / 0.45, 0, 1));
      const tipY = fp * (H + 20);
      const tailLen = 22 + fp * 8;

      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(CX, Math.max(0, tipY - tailLen));
      ctx.lineTo(CX, Math.min(tipY, H));
      ctx.stroke();

      if (tipY < H + 10) {
        ctx.beginPath();
        ctx.arc(CX, tipY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fill();
      }

      if (fp > 0.88) {
        const sp = (fp - 0.88) / 0.12;
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 5) * i - Math.PI * 0.4;
          const dist = sp * 22;
          const sx = CX + Math.cos(angle) * dist;
          const sy = H - 4 + Math.sin(angle) * dist * 0.4;
          ctx.beginPath();
          ctx.arc(sx, sy, 2 * (1 - sp), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - sp)})`;
          ctx.fill();
        }
      }
    } else {
      const zp = easeOut(clamp((p - 0.45) / 0.55, 0, 1));
      const maxR = Math.sqrt(CX * CX + H * H) * 1.8;
      const r = zp * maxR;

      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, H, r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();
    }
  }

  // init canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    draw(ctx, canvas.width, canvas.height, 0);
  }, []);

  // update tiap kali progress berubah
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx, canvas.width, canvas.height, progress);
  }, [progress]);

  return (
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
  );
}
