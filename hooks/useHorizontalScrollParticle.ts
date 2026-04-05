import { useEffect, RefObject } from "react";
import { gsap } from "gsap";

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
const PAUSE_AFTER_SCROLL = 200;
const MOBILE_PAUSE = 1500;

const PARTICLE_CONFIGS_DESKTOP = [
  { size: 600, offsetY: -25 },
  { size: 280, offsetY: 20 },
  { size: 520, offsetY: 25 },
  { size: 240, offsetY: -20 },
  { size: 460, offsetY: 10 },
  { size: 380, offsetY: -30 },
  { size: 200, offsetY: 15 },
];

const PARTICLE_CONFIGS_MOBILE = [
  { size: 300, offsetY: -25 },
  { size: 200, offsetY: 20 },
  { size: 280, offsetY: 25 },
  { size: 160, offsetY: -20 },
  { size: 240, offsetY: 30 },
  { size: 200, offsetY: -30 },
  { size: 140, offsetY: 15 },
];

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

interface Particle {
  spawnDelay: number;
  size: number;
  rotation: number;
  imageIndex: number;
  pathEl: SVGPathElement;
  totalLen: number;
}

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
  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preload images
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

    const initParticles = () => {
      const vw = window.innerWidth;
      const isMobile = vw < 768;
      const rawTrackW = hTrackRef.current?.scrollWidth ?? 0;

      if (!isMobile && rawTrackW === 0) {
        requestAnimationFrame(initParticles);
        return;
      }

      const CONFIGS = isMobile
        ? PARTICLE_CONFIGS_MOBILE
        : PARTICLE_CONFIGS_DESKTOP;
      const rotations = [50, 120, 200, 310, 10, 0, 150];
      const waypoints = [
        { x: -50, y: 50 },
        { x: 50, y: 50 },
      ];

      svg.querySelectorAll(".particle-path").forEach((el) => el.remove());

      particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const config = CONFIGS[i];
        const pathEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        pathEl.setAttribute("class", "particle-path");
        pathEl.setAttribute("fill", "none");
        pathEl.setAttribute("stroke", "none");
        pathEl.setAttribute("d", buildCatmullRom(waypoints, config.offsetY));
        svg.appendChild(pathEl);

        return {
          spawnDelay: i * 0.08,
          size: config.size,
          rotation: rotations[i] ?? 0,
          imageIndex: i % IMAGE_URLS.length,
          pathEl,
          totalLen: pathEl.getTotalLength(),
        };
      });
    };

    // Canvas resize
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // Draw dipanggil langsung dari onUpdate GSAP — tidak ada RAF loop
    const draw = (progress: number) => {
      const vw = canvas.width;
      const vh = canvas.height;
      const isMobile = vw < 768;
      const trackW = hTrackRef.current?.scrollWidth ?? vw;
      const effectiveWidth = isMobile ? vw : trackW;
      const scroll = progress * effectiveWidth;

      ctx.clearRect(0, 0, vw, vh);

      particles.forEach((p) => {
        if (!offscreenReady[p.imageIndex] || p.totalLen === 0) return;

        const particleProgress = Math.min(
          Math.max(progress - p.spawnDelay, 0),
          0.9998,
        );
        const pt = p.pathEl.getPointAtLength(p.totalLen * particleProgress);

        const x = (pt.x / 100) * effectiveWidth;
        const y = (pt.y / 100) * vh;

        // Fade in saat masuk dari kiri
        const fadeRange = p.size * 3;
        const opacity =
          x > vw + p.size
            ? 0
            : x < -p.size - fadeRange
              ? 0
              : x < -p.size
                ? Math.max((x + p.size + fadeRange) / fadeRange, 0)
                : 1;

        if (opacity < 0.001) return;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y);
        ctx.rotate(((p.rotation + scroll * 0.02) * Math.PI) / 180);
        ctx.drawImage(
          offscreens[p.imageIndex],
          -p.size / 2,
          -p.size / 2,
          p.size,
          p.size,
        );
        ctx.restore();
      });
    };

    const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    initParticles();

    // Expose draw ke luar supaya bisa dipanggil dari GSAP effect
    (canvas as any).__drawParticles = draw;
    (canvas as any).__clearParticles = clearCanvas;

    return () => {
      window.removeEventListener("resize", resize);
      svg.querySelectorAll(".particle-path").forEach((el) => el.remove());
      delete (canvas as any).__drawParticles;
      delete (canvas as any).__clearParticles;
    };
  }, [canvasRef, svgRef, hTrackRef]);

  // ── GSAP horizontal scroll ───────────────────
  useEffect(() => {
    if (!hScrollRef.current || !hTrackRef.current) return;

    const track = hTrackRef.current;
    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 768;

    const getHorizontalWidth = () =>
      isMobile ? 0 : track.scrollWidth - window.innerWidth;

    const getTotalEnd = () =>
      isMobile ? MOBILE_PAUSE : getHorizontalWidth() + PAUSE_AFTER_SCROLL;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: hScrollRef.current,
          start: "top top",
          end: () =>
            isMobile
              ? `+=${MOBILE_PAUSE}`
              : `+=${getHorizontalWidth() + PAUSE_AFTER_SCROLL}`,
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
            const totalEnd = getTotalEnd();

            const horizontalProgress =
              horizontalWidth > 0
                ? Math.min(self.progress * (totalEnd / horizontalWidth), 1)
                : self.progress;

            if (horizontalWidth > 0) {
              gsap.set(track, { x: -horizontalWidth * horizontalProgress });
            }

            const r = Math.round(155 + (189 - 155) * horizontalProgress);
            const g = Math.round(142 + (166 - 142) * horizontalProgress);
            const b = Math.round(199 + (206 - 199) * horizontalProgress);
            if (hScrollRef.current) {
              hScrollRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            }

            scrollXRef.current =
              horizontalProgress *
              (horizontalWidth > 0 ? horizontalWidth : window.innerWidth);

            // Panggil draw langsung — tidak ada RAF, tidak ada tick
            (canvas as any)?.__drawParticles?.(horizontalProgress);

            planeUpdateRef.current?.(horizontalProgress);
            setWindProgress(horizontalProgress);
          },
        },
      });
    }, hScrollRef);

    return () => ctx.revert();
  }, [
    hScrollRef,
    hTrackRef,
    canvasRef,
    planeUpdateRef,
    currentIndex,
    scrollXRef,
  ]);
}
