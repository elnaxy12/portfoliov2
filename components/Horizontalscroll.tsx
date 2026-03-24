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
const LERP_SPEED = 0.06;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getWaypoints() {
  return [
    { x: -3, y: 50 },
    { x: 15, y: 48 },
    { x: 30, y: 52 },
    { x: 50, y: 47 },
    { x: 70, y: 51 },
    { x: 85, y: 49 },
    { x: 103, y: 50 },
  ];
}

function buildCatmullRom(pts: { x: number; y: number }[], offsetY = 0) {
  const shifted = pts.map((p) => ({ x: p.x, y: p.y + offsetY }));
  let d = `M ${shifted[0].x} ${shifted[0].y}`;
  for (let i = 1; i < shifted.length; i++) {
    const p0 = shifted[Math.max(i - 2, 0)];
    const p1 = shifted[i - 1];
    const p2 = shifted[i];
    const p3 = shifted[Math.min(i + 1, shifted.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// Konfigurasi manual per partikel: size dan posisi Y
// offsetY: negatif = atas, positif = bawah (dalam unit viewBox 0-100)
// ✅ Tidak pakai window di sini — aman untuk SSR
const PARTICLE_CONFIGS_MOBILE = [
  { size: 60, offsetY: -8 }, // besar, atas
  { size: 30, offsetY: 8 }, // kecil, bawah
  { size: 50, offsetY: 10 }, // besar, bawah
  { size: 25, offsetY: -8 }, // kecil, atas
  { size: 40, offsetY: 12 }, // sedang, bawah
  { size: 35, offsetY: -10 }, // sedang, atas
  { size: 20, offsetY: 6 }, // kecil, sedikit bawah
];

const PARTICLE_CONFIGS_DESKTOP = [
  { size: 160, offsetY: -22 },
  { size: 55, offsetY: 18 },
  { size: 120, offsetY: 20 },
  { size: 45, offsetY: -18 },
  { size: 90, offsetY: 25 },
  { size: 70, offsetY: -25 },
  { size: 40, offsetY: 12 },
];

interface Particle {
  spawnDelay: number;
  offsetY: number;
  size: number;
  rotation: number;
  currentX: number;
  currentY: number;
  currentOpacity: number;
  imageIndex: number;
  pathEl: SVGPathElement;
  totalLen: number;
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
    const svgRef = useRef<SVGSVGElement>(null);
    const offscreensRef = useRef<HTMLCanvasElement[]>([]);
    const offscreenReadyRef = useRef<boolean[]>(
      Array(IMAGE_URLS.length).fill(false),
    );
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);
    const prevScrollRef = useRef<number>(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      const svg = svgRef.current;
      if (!canvas || !svg) return;
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
        const trackW = trackRef.current?.scrollWidth ?? 0;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (trackW <= vw) {
          requestAnimationFrame(initParticles);
          return;
        }

        // ✅ window diakses di sini — aman karena sudah dalam useEffect (browser only)
        const isMobile = vw < 768;
        const PARTICLE_CONFIGS = isMobile
          ? PARTICLE_CONFIGS_MOBILE
          : PARTICLE_CONFIGS_DESKTOP;

        svg.querySelectorAll(".particle-path").forEach((el) => el.remove());

        const waypoints = getWaypoints();
        // rotasi random tapi deterministic per index
        const rotations = [30, 120, 200, 310, 75, 260, 150];

        particlesRef.current = Array.from(
          { length: PARTICLE_COUNT },
          (_, i) => {
            const config = PARTICLE_CONFIGS[i];
            const spawnDelay = i * 0.04;

            const pathEl = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path",
            );
            pathEl.setAttribute("class", "particle-path");
            pathEl.setAttribute("fill", "none");
            pathEl.setAttribute("stroke", "none");
            pathEl.setAttribute(
              "d",
              buildCatmullRom(waypoints, config.offsetY),
            );
            svg.appendChild(pathEl);

            const totalLen = pathEl.getTotalLength();
            const pt = pathEl.getPointAtLength(0);
            const initY = (pt.y / 100) * vh;

            return {
              spawnDelay,
              offsetY: config.offsetY,
              size: config.size,
              rotation: rotations[i] ?? 0,
              currentX: -config.size,
              currentY: initY,
              currentOpacity: 0,
              imageIndex: i % IMAGE_URLS.length,
              pathEl,
              totalLen,
            };
          },
        );
      };

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (svg && trackRef.current) {
          svg.style.width = `${trackRef.current.scrollWidth}px`;
          svg.style.height = `${window.innerHeight}px`;
        }
        initParticles();
      };
      resize();
      window.addEventListener("resize", resize);

      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scroll = scrollXRef?.current ?? 0;
        const prevScroll = prevScrollRef.current;
        const scrollDelta = scroll - prevScroll;
        prevScrollRef.current = scroll;

        const isScrollingBack = scrollDelta < -1;
        const vw = canvas.width;
        const vh = canvas.height;
        const trackW = trackRef.current?.scrollWidth ?? vw;
        const maxScrollX = trackW - vw;
        const scrollProgress = maxScrollX > 0 ? scroll / maxScrollX : 0;

        particlesRef.current.forEach((p) => {
          const offscreen = offscreensRef.current[p.imageIndex];
          const ready = offscreenReadyRef.current[p.imageIndex];
          if (!ready || !offscreen || p.totalLen === 0) return;

          const particleProgress = Math.min(
            Math.max(scrollProgress - p.spawnDelay, 0),
            0.9998,
          );

          const len = p.totalLen * particleProgress;
          const pt = p.pathEl.getPointAtLength(len);

          const targetX = (pt.x / 100) * trackW;
          const targetY = (pt.y / 100) * vh;

          const diffX = targetX - p.currentX;
          const isSnapBack = isScrollingBack && diffX > p.size * 3;

          if (isSnapBack) {
            p.currentX = targetX;
            p.currentY = targetY;
          } else {
            p.currentX = lerp(p.currentX, targetX, LERP_SPEED);
            p.currentY = lerp(p.currentY, targetY, LERP_SPEED);
          }

          const fadeRange = p.size * 3;
          const targetOpacity =
            p.currentX > vw + p.size
              ? 0
              : p.currentX < -p.size - fadeRange
                ? 0
                : p.currentX < -p.size
                  ? Math.max((p.currentX + p.size + fadeRange) / fadeRange, 0)
                  : 1;

          const opacitySpeed = isSnapBack
            ? 1
            : targetOpacity > p.currentOpacity
              ? LERP_SPEED * 3
              : LERP_SPEED;

          p.currentOpacity = lerp(
            p.currentOpacity,
            targetOpacity,
            opacitySpeed,
          );

          if (p.currentOpacity < 0.001) return;

          ctx.save();
          ctx.globalAlpha = p.currentOpacity;
          ctx.translate(p.currentX, p.currentY);
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
        svg.querySelectorAll(".particle-path").forEach((el) => el.remove());
      };
    }, [trackRef, scrollXRef]);

    return (
      <div
        ref={ref}
        className={`horizontal-scroll-wrapper ${className}`}
        style={{
          overflow: "hidden",
          minWidth: "300vw",
          height: "100vh",
          position: "relative",
        }}
      >
        <svg
          ref={svgRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            visibility: "hidden",
            zIndex: -1,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        />

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
