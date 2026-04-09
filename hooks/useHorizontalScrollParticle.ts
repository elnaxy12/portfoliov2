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
const OFFSCREEN_SIZE = 480;
const LERP_SPEED = 0.06;
const SPAWN_DELAY_DESKTOP = 0.08;
const SPAWN_DELAY_MOBILE = 0.12;

// ─────────────────────────────────────────────
// Particle Config
// ─────────────────────────────────────────────
// DESKTOP
const PARTICLE_CONFIGS_DESKTOP = [
  { size: 600, offsetY: -25 },
  { size: 280, offsetY: 20 },
  { size: 520, offsetY: 25 },
  { size: 240, offsetY: -20 },
  { size: 460, offsetY: 10 },
  { size: 380, offsetY: -30 },
  { size: 200, offsetY: 15 },
];

// MOBILE
const PARTICLE_CONFIGS_MOBILE = [
  { size: 300, offsetY: -25 },
  { size: 200, offsetY: 20 },
  { size: 280, offsetY: 25 },
  { size: 160, offsetY: -20 },
  { size: 240, offsetY: 30 },
  { size: 200, offsetY: -30 },
  { size: 140, offsetY: 15 },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getWaypoints() {
  const isMobile = window.innerWidth < 768;
  return [
    { x: -50, y: 50 },
    { x: isMobile ? 100 : 50, y: 50 },
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
  setWindProgress: (p: number) => void,
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
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;
      const rawTrackW = hTrackRef.current?.scrollWidth ?? 0;

      if (!isMobile && rawTrackW === 0) {
        requestAnimationFrame(initParticles);
        return;
      }

      const PARTICLE_CONFIGS = isMobile
        ? PARTICLE_CONFIGS_MOBILE
        : PARTICLE_CONFIGS_DESKTOP;

      svg.querySelectorAll(".particle-path").forEach((el) => el.remove());

      const waypoints = getWaypoints();
      const rotations = [50, 120, 200, 310, 10, 0, 150];

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

        const pt = totalLen > 0 ? pathEl.getPointAtLength(0) : { x: 0, y: 50 };

        return {
          spawnDelay: i * (isMobile ? SPAWN_DELAY_MOBILE : SPAWN_DELAY_DESKTOP),
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      if (currentIndex.current < 1 || currentIndex.current > 3) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafId = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scroll = scrollXRef.current ?? 0;
      const scrollDelta = scroll - prevScrollRef.current;
      prevScrollRef.current = scroll;
      const isScrollingBack = scrollDelta < -1;

      const vw = canvas.width;
      const vh = canvas.height;
      const isMobile = vw < 768;
      const trackW = hTrackRef.current?.scrollWidth ?? vw;
      const effectiveWidth = isMobile ? vw : trackW;
      const maxScrollX = isMobile ? vw : trackW > vw ? trackW - vw : vw;
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

        if (!isFinite(len) || len < 0) return;

        const clampedLen = Math.min(len, p.totalLen);
        const pt = p.pathEl.getPointAtLength(clampedLen);

        const targetX = (pt.x / 100) * effectiveWidth;
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
    const isMobile = window.innerWidth < 768;

    const getHorizontalWidth = () =>
      isMobile
        ? window.innerWidth * 1.5
        : track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: hScrollRef.current,
          start: "top top",
          end: () => `+=${getHorizontalWidth()}`,
          scrub: 3,
          pin: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onEnter: () => {
            currentIndex.current = 2;
            planeUpdateRef.current?.(0);
          },
          onLeave: () => {
            currentIndex.current = 3;
            gsap.set(track, { x: -getHorizontalWidth() });
          },
          onEnterBack: () => {
            currentIndex.current = 2;
          },
          onLeaveBack: () => {
            currentIndex.current = 1;
            scrollXRef.current = 0;
          },
          onUpdate: (self) => {
            const horizontalWidth = getHorizontalWidth();

            const horizontalProgress = Math.min(self.progress, 1);

            if (horizontalWidth > 0) {
              gsap.set(track, { x: -horizontalWidth * horizontalProgress });
            }

            const r = Math.round(155 + (189 - 155) * horizontalProgress);
            const g = Math.round(142 + (166 - 142) * horizontalProgress);
            const b = Math.round(199 + (206 - 199) * horizontalProgress);
            if (hScrollRef.current) {
              hScrollRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            }
            scrollXRef.current = isMobile
              ? self.progress * window.innerWidth
              : horizontalProgress * horizontalWidth;
            planeUpdateRef.current?.(horizontalProgress);
            setWindProgress(horizontalProgress);
          },
        },
      });
    }, hScrollRef);

    return () => ctx.revert();
  }, [hScrollRef, hTrackRef, planeUpdateRef, currentIndex, scrollXRef]);
}
