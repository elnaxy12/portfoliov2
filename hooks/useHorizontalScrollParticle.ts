import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// ─────────────────────────────────────────────
// Particle Constants
// ─────────────────────────────────────────────
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
const OFFSCREEN_SIZE = 256;
const LERP_SPEED = 0.06;

// ─────────────────────────────────────────────
// Particle Config
// ─────────────────────────────────────────────
// DESKTOP — naikkan semua size
const PARTICLE_CONFIGS_DESKTOP = [
  { size: 220, offsetY: -22 }, // was 160
  { size: 90, offsetY: 18 }, // was 55
  { size: 180, offsetY: 20 }, // was 120
  { size: 75, offsetY: -18 }, // was 45
  { size: 140, offsetY: 25 }, // was 90
  { size: 110, offsetY: -25 }, // was 70
  { size: 65, offsetY: 12 }, // was 40
];

// MOBILE
const PARTICLE_CONFIGS_MOBILE = [
  { size: 140, offsetY: -10 },
  { size: 60, offsetY: 6 },
  { size: 120, offsetY: 8 },
  { size: 55, offsetY: -6 },
  { size: 95, offsetY: 10 },
  { size: 80, offsetY: -8 },
  { size: 50, offsetY: 5 },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useHorizontalScrollParticle(
  hScrollRef: RefObject<HTMLDivElement | null>,
  hTrackRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  svgRef: RefObject<SVGSVGElement | null>,
  planeUpdateRef: RefObject<((progress: number) => void) | null>,
  currentIndex: RefObject<number>,
  scrollXRef: RefObject<number>,
) {
  // ── Particle canvas animation ────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preload offscreen canvases
    const offscreens: HTMLCanvasElement[] = IMAGE_URLS.map((url, i) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = OFFSCREEN_SIZE;
      offscreen.height = OFFSCREEN_SIZE;
      const img = new Image();
      img.onload = () => {
        const offCtx = offscreen.getContext("2d");
        if (offCtx) offCtx.drawImage(img, 0, 0, OFFSCREEN_SIZE, OFFSCREEN_SIZE);
        offscreenReady[i] = true;
      };
      img.src = url;
      return offscreen;
    });
    const offscreenReady: boolean[] = Array(IMAGE_URLS.length).fill(false);

    let particles: Particle[] = [];
    let rafId: number;
    const prevScrollRef = { current: 0 };

    const initParticles = () => {
      const trackW = hTrackRef.current?.scrollWidth ?? 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (trackW <= vw) {
        requestAnimationFrame(initParticles);
        return;
      }

      const isMobile = vw < 768;
      const PARTICLE_CONFIGS = isMobile
        ? PARTICLE_CONFIGS_MOBILE
        : PARTICLE_CONFIGS_DESKTOP;

      svg.querySelectorAll(".particle-path").forEach((el) => el.remove());

      const waypoints = getWaypoints();
      const rotations = [30, 120, 200, 310, 75, 260, 150];

      particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const config = PARTICLE_CONFIGS[i];
        const pathEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        pathEl.setAttribute("class", "particle-path");
        pathEl.setAttribute("fill", "none");
        pathEl.setAttribute("stroke", "none");
        pathEl.setAttribute("d", buildCatmullRom(waypoints, config.offsetY));
        svg.appendChild(pathEl);

        const totalLen = pathEl.getTotalLength();
        const pt = pathEl.getPointAtLength(0);

        return {
          spawnDelay: i * 0.04,
          offsetY: config.offsetY,
          size: config.size,
          rotation: rotations[i] ?? 0,
          currentX: -config.size,
          currentY: (pt.y / 100) * vh,
          currentOpacity: 0,
          imageIndex: i % IMAGE_URLS.length,
          pathEl,
          totalLen,
        };
      });
    };

    const resize = () => {
      canvas.width = window.innerWidth; // ← selalu viewport width
      canvas.height = window.innerHeight;
      initParticles();
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scroll = scrollXRef.current ?? 0;
      const scrollDelta = scroll - prevScrollRef.current;
      prevScrollRef.current = scroll;
      const isScrollingBack = scrollDelta < -1;

      const vw = canvas.width;
      const vh = canvas.height;
      const trackW = hTrackRef.current?.scrollWidth ?? vw;
      const maxScrollX = trackW - window.innerWidth;
      const scrollProgress = maxScrollX > 0 ? scroll / maxScrollX : 0;

      particles.forEach((p) => {
        const offscreen = offscreens[p.imageIndex];
        const ready = offscreenReady[p.imageIndex];
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

        p.currentOpacity = lerp(p.currentOpacity, targetOpacity, opacitySpeed);
        if (p.currentOpacity < 0.001) return;

        ctx.save();
        ctx.globalAlpha = p.currentOpacity;
        ctx.translate(p.currentX, p.currentY);
        ctx.rotate(((p.rotation + scroll * 0.02) * Math.PI) / 180);
        ctx.drawImage(offscreen, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      svg.querySelectorAll(".particle-path").forEach((el) => el.remove());
    };
  }, [canvasRef, svgRef, hTrackRef, scrollXRef]);

  // ── GSAP horizontal scroll ───────────────────
  useEffect(() => {
    if (!hScrollRef.current || !hTrackRef.current) return;

    const track = hTrackRef.current;
    const getTotalWidth = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -getTotalWidth(),
      ease: "none",
      scrollTrigger: {
        trigger: hScrollRef.current,
        start: "top top",
        end: () => `+=${getTotalWidth() + 800}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          currentIndex.current = 2;
          planeUpdateRef.current?.(0);
        },
        onLeave: () => {
          currentIndex.current = 3;
        },
        onEnterBack: () => {
          currentIndex.current = 2;
          planeUpdateRef.current?.(0);
        },
        onLeaveBack: () => {
          currentIndex.current = 1;
          scrollXRef.current = 0;
        },
        onUpdate: (self) => {
          const progress = Math.min(self.progress, 1);

          // Interpolate background: #9B8EC7 → #BDA6CE
          const r = Math.round(155 + (189 - 155) * progress);
          const g = Math.round(142 + (166 - 142) * progress);
          const b = Math.round(199 + (206 - 199) * progress);

          if (hScrollRef.current) {
            hScrollRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }

          scrollXRef.current = self.progress * getTotalWidth();
          planeUpdateRef.current?.(progress);
        },
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === hScrollRef.current)
        .forEach((t) => t.kill());
    };
  }, [hScrollRef, hTrackRef, planeUpdateRef, currentIndex, scrollXRef]);
}
