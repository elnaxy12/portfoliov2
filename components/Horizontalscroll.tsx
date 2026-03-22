"use client";

import { forwardRef, useEffect, useRef } from "react";

const PARTICLE_COUNT = 5;
const SVG_URL = "/images/no_bg.svg";
const OFFSCREEN_SIZE = 100;
const PARTICLE_SEED = 42;
const PARALLAX_FACTOR = 0.5;
const SPAWN_OFFSET_X = 120;
/**
 * Kecepatan lerp posisi X — makin kecil makin lambat/smooth.
 * 0.06 = terasa seperti ada bobot/inersia.
 */
const LERP_SPEED = 0.06;

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Particle {
  worldX: number;
  minScreenX: number;
  screenY: number;
  size: number;
  rotation: number;
  /** Posisi X yang sedang dirender — diinterpolasi menuju target */
  currentX: number;
  /** Opacity yang sedang dirender — diinterpolasi */
  currentOpacity: number;
}

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  trackRef: React.RefObject<HTMLDivElement | null>;
  scrollXRef?: React.RefObject<number>;
}

const HorizontalScroll = forwardRef<HTMLDivElement, HorizontalScrollProps>(
  ({ children, className = "", trackRef, scrollXRef }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);
    const offscreenReadyRef = useRef<boolean>(false);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const offscreen = document.createElement("canvas");
      offscreen.width = OFFSCREEN_SIZE;
      offscreen.height = OFFSCREEN_SIZE;
      offscreenRef.current = offscreen;

      const img = new Image();
      img.onload = () => {
        const offCtx = offscreen.getContext("2d");
        if (offCtx) {
          offCtx.drawImage(img, 0, 0, OFFSCREEN_SIZE, OFFSCREEN_SIZE);
          offscreenReadyRef.current = true;
        }
      };
      img.src = SVG_URL;

      const initParticles = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const trackW = trackRef.current?.scrollWidth ?? 0;
        if (trackW <= vw) {
          requestAnimationFrame(initParticles);
          return;
        }

        const maxScrollX = trackW - vw;
        const rng = makeRng(PARTICLE_SEED);

        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
          const baseProgress = (i + 1) / (PARTICLE_COUNT + 1);
          const jitter = (rng() - 0.5) * (1 / (PARTICLE_COUNT + 1)) * 0.6;
          const spawnProgress = Math.min(Math.max(baseProgress + jitter, 0.05), 0.95);
          const spawnScroll = spawnProgress * maxScrollX;

          const worldX = vw + SPAWN_OFFSET_X + spawnScroll * PARALLAX_FACTOR;
          const minScreenX = worldX - maxScrollX * PARALLAX_FACTOR;

          return {
            worldX,
            minScreenX,
            screenY: (0.1 + rng() * 0.8) * vh,
            size: 40 + rng() * rng() * 160, // 40–200px, distribusi skewed ke kecil
            rotation: rng() * 360,
            // Mulai dari luar kanan agar lerp masuk terasa natural
            currentX: vw + SPAWN_OFFSET_X,
            currentOpacity: 0,
          };
        });
      };

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      };
      resize();
      window.addEventListener("resize", resize);

      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (offscreenReadyRef.current && offscreenRef.current) {
          const scroll = scrollXRef?.current ?? 0;
          const vw = canvas.width;

          particlesRef.current.forEach((p) => {
            // Target X: posisi natural tapi tidak melewati minScreenX
            const rawTarget = p.worldX - scroll * PARALLAX_FACTOR;
            const targetX = Math.max(rawTarget, p.minScreenX);

            // Target opacity: 0 saat belum masuk viewport, 1 saat sudah masuk
            const fadeRange = p.size * 3;
            const targetOpacity = rawTarget > vw + p.size
              ? 0 // belum spawn
              : rawTarget > vw - fadeRange
              ? Math.max(1 - (rawTarget - (vw - fadeRange)) / fadeRange, 0)
              : 1;

            // Lerp posisi dan opacity — smooth di semua arah
            p.currentX = lerp(p.currentX, targetX, LERP_SPEED);
            p.currentOpacity = lerp(p.currentOpacity, targetOpacity, LERP_SPEED);

            // Skip render kalau hampir tidak kelihatan
            if (p.currentOpacity < 0.01) return;

            ctx.save();
            ctx.globalAlpha = p.currentOpacity;
            ctx.translate(p.currentX, p.screenY);
            ctx.rotate(((p.rotation + scroll * 0.02) * Math.PI) / 180);
            ctx.drawImage(
              offscreenRef.current!,
              -p.size / 2,
              -p.size / 2,
              p.size,
              p.size,
            );
            ctx.restore();
          });
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", resize);
      };
    }, [trackRef, scrollXRef]);

    return (
      <div
        ref={ref}
        className={`horizontal-scroll-wrapper ${className}`}
        style={{
          overflow: "hidden",
          width: "100vw",
          height: "100vh",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          ref={trackRef}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            height: "100%",
            willChange: "transform",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);

HorizontalScroll.displayName = "HorizontalScroll";

export default HorizontalScroll;