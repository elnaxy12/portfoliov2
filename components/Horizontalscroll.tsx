"use client";

import { forwardRef, useEffect, useRef } from "react";

const PARTICLE_COUNT = 7;
const IMAGE_URLS = [
  "/images/particle/052742596094-removebg-preview.png",
  "/images/particle/123420032209-removebg-preview.png",
  "/images/particle/240223511521-removebg-preview.png",
  "/images/particle/361243699730-removebg-preview.png",
  "/images/particle/772827860851-removebg-preview.png",
  "/images/particle/913522419108-removebg-preview.png",
  "/images/particle/939383347672-removebg-preview.png",
];

const OFFSCREEN_SIZE = 100;
const PARTICLE_SEED = 42;
const PARALLAX_FACTOR = 0.5;
const SPAWN_OFFSET_X = 120;
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
  screenY: number;
  size: number;
  rotation: number;
  currentX: number;
  currentOpacity: number;
  imageIndex: number;
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
    const offscreensRef = useRef<HTMLCanvasElement[]>([]);
    const offscreenReadyRef = useRef<boolean[]>(
      Array(IMAGE_URLS.length).fill(false),
    );
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      offscreensRef.current = IMAGE_URLS.map((url, i) => {
        const offscreen = document.createElement("canvas");
        offscreen.width = OFFSCREEN_SIZE;
        offscreen.height = OFFSCREEN_SIZE;

        const img = new Image();
        img.onload = () => {
          const offCtx = offscreen.getContext("2d");
          if (offCtx) {
            offCtx.drawImage(img, 0, 0, OFFSCREEN_SIZE, OFFSCREEN_SIZE);
            offscreenReadyRef.current[i] = true;
          }
        };
        img.src = url;

        return offscreen;
      });

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

        particlesRef.current = Array.from(
          { length: PARTICLE_COUNT },
          (_, i) => {
            const baseProgress = (i + 1) / (PARTICLE_COUNT + 1);
            const jitter = (rng() - 0.5) * (1 / (PARTICLE_COUNT + 1)) * 0.6;
            const spawnProgress = Math.min(
              Math.max(baseProgress + jitter, 0.05),
              0.95,
            );
            const spawnScroll = spawnProgress * maxScrollX;

            const worldX = vw + SPAWN_OFFSET_X + spawnScroll * PARALLAX_FACTOR;
            const imageIndex = i % IMAGE_URLS.length;

            return {
              worldX,
              screenY: (0.1 + rng() * 0.8) * vh,
              size: 40 + rng() * rng() * 160,
              rotation: rng() * 360,
              currentX: vw + SPAWN_OFFSET_X,
              currentOpacity: 0,
              imageIndex,
            };
          },
        );
      };

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      };
      resize();
      window.addEventListener("resize", resize);

      const tick = () => {
        console.log("scrollX:", scrollXRef?.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scroll = scrollXRef?.current ?? 0;
        const vw = canvas.width;

        particlesRef.current.forEach((p) => {
          const offscreen = offscreensRef.current[p.imageIndex];
          const ready = offscreenReadyRef.current[p.imageIndex];
          if (!ready || !offscreen) return;

          const targetX = p.worldX - scroll * PARALLAX_FACTOR;

          // Fade in dari kanan, fade out ke kiri
          const fadeRange = p.size * 3;
          const targetOpacity =
            targetX > vw + p.size
              ? 0 // belum masuk dari kanan
              : targetX > vw - fadeRange
                ? Math.max(1 - (targetX - (vw - fadeRange)) / fadeRange, 0) // fade in kanan
                : targetX < -p.size - fadeRange
                  ? 0 // sudah jauh di luar kiri
                  : targetX < -p.size
                    ? Math.max((targetX + p.size + fadeRange) / fadeRange, 0) // fade out kiri
                    : 1;

          p.currentX = lerp(p.currentX, targetX, LERP_SPEED);

          // Fade in lebih cepat saat scroll balik ke kanan
          const opacitySpeed =
            targetOpacity > p.currentOpacity ? LERP_SPEED * 3 : LERP_SPEED;
          p.currentOpacity = lerp(
            p.currentOpacity,
            targetOpacity,
            opacitySpeed,
          );

          // Threshold kecil supaya partikel tidak "mati" saat scroll balik
          if (p.currentOpacity < 0.001) return;

          ctx.save();
          ctx.globalAlpha = p.currentOpacity;
          ctx.translate(p.currentX, p.screenY);
          ctx.rotate(((p.rotation + scroll * 0.02) * Math.PI) / 180);
          ctx.drawImage(offscreen, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });

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
