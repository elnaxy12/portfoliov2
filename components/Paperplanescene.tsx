"use client";

import { useEffect, useRef, useCallback } from "react";

function getWaypoints() {
  const aspect = window.innerWidth / window.innerHeight;
  const amp = Math.min(aspect / 1.78, 1);

  const base = [
    { x: -3, y: 55 },
    { x: 8, y: 45 },
    { x: 18, y: 62 },
    { x: 28, y: 30 },
    { x: 38, y: 58 },
    { x: 50, y: 25 },
    { x: 62, y: 50 },
    { x: 72, y: 22 },
    { x: 82, y: 48 },
    { x: 92, y: 28 },
    { x: 103, y: 42 },
  ];

  const centerY = 42;
  return base.map((pt) => ({
    x: pt.x,
    y: centerY + (pt.y - centerY) * amp,
  }));
}

function buildCatmullRom(pts: { x: number; y: number }[]) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(i - 2, 0)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(i + 1, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

interface PaperPlaneSceneProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  onReady: (update: (progress: number) => void) => void;
}

export default function PaperPlaneScene({
  trackRef,
  onReady,
}: PaperPlaneSceneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  const measureRef = useRef<SVGPathElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const glowRef = useRef<SVGPathElement | null>(null);
  const planeGRef = useRef<SVGGElement | null>(null);
  const totalLenRef = useRef<number>(0);

  const update = useCallback(
    (progress: number) => {
      const plane = planeRef.current;
      const track = trackRef.current;
      const measureEl = measureRef.current;
      const trailEl = trailRef.current;
      const glowEl = glowRef.current;
      const planeG = planeGRef.current;

      if (!plane || !track || !measureEl || !trailEl || !glowEl || !planeG)
        return;

      const totalLen = totalLenRef.current;
      if (totalLen === 0) return;

      const len = Math.min(totalLen * progress, totalLen * 0.9998);
      const pt = measureEl.getPointAtLength(len);
      const pt2 = measureEl.getPointAtLength(
        Math.min(len + 0.3, totalLen * 0.9998),
      );

      const trackW = track.scrollWidth;
      const trackH = track.clientHeight;

      plane.style.left = `${(pt.x / 100) * trackW}px`;
      plane.style.top = `${(pt.y / 100) * trackH}px`;

      const scaleX = trackW / 100;
      const scaleY = trackH / 100;
      const dx = (pt2.x - pt.x) * scaleX;
      const dy = (pt2.y - pt.y) * scaleY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;

      planeG.style.transform = `rotate(${angle}deg)`;

      const offset = totalLen * (1 - progress);
      trailEl.style.strokeDashoffset = String(offset);
      glowEl.style.strokeDashoffset = String(offset);
    },
    [trackRef],
  );

  useEffect(() => {
    const svg = svgRef.current;
    const track = trackRef.current;
    if (!svg || !track) return;

    measureRef.current = svg.querySelector<SVGPathElement>("#pp-measure");
    trailRef.current = svg.querySelector<SVGPathElement>("#pp-trail");
    glowRef.current = svg.querySelector<SVGPathElement>("#pp-glow");
    planeGRef.current =
      planeRef.current?.querySelector<SVGGElement>("#pp-g") ?? null;

    const pathD = buildCatmullRom(getWaypoints());
    measureRef.current?.setAttribute("d", pathD);
    trailRef.current?.setAttribute("d", pathD);
    glowRef.current?.setAttribute("d", pathD);

    requestAnimationFrame(() => {
      const measureEl = measureRef.current;
      const trailEl = trailRef.current;
      const glowEl = glowRef.current;
      if (!measureEl || !trailEl || !glowEl || !track || !svg) return;

      svg.style.width = `${track.scrollWidth}px`;

      const total = measureEl.getTotalLength();
      totalLenRef.current = total;

      trailEl.style.strokeDasharray = String(total);
      trailEl.style.strokeDashoffset = String(total);
      glowEl.style.strokeDasharray = String(total);
      glowEl.style.strokeDashoffset = String(total);

      update(0.001);
      onReady(update);
    });

    // ✅ Rebuild path saat resize
    const handleResize = () => {
      const pathD = buildCatmullRom(getWaypoints());
      measureRef.current?.setAttribute("d", pathD);
      trailRef.current?.setAttribute("d", pathD);
      glowRef.current?.setAttribute("d", pathD);

      if (svg && track) {
        svg.style.width = `${track.scrollWidth}px`;
      }

      const total = measureRef.current?.getTotalLength() ?? 0;
      totalLenRef.current = total;

      if (trailRef.current && glowRef.current) {
        trailRef.current.style.strokeDasharray = String(total);
        glowRef.current.style.strokeDasharray = String(total);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [update, onReady, trackRef]);

  return (
    <>
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 10,
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path id="pp-measure" fill="none" stroke="none" />
        <path
          id="pp-glow"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          id="pp-trail"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.18"
          strokeDasharray="1 1.8"
          strokeLinecap="round"
        />
      </svg>

      <div
        ref={planeRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 150,
          height: 150,
          transform: "translate(-50%, -50%)",
          willChange: "left, top",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          width={150}
          height={150}
        >
          <g id="pp-g" style={{ transformOrigin: "50% 50%" }}>
            <polygon points="0,50 100,22 75,50" fill="white" />
            <polygon points="0,50 100,78 75,50" fill="white" />
            <line
              x1="0"
              y1="50"
              x2="75"
              y2="50"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.5"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
