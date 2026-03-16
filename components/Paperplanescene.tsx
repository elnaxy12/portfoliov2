"use client";

import { useEffect, useRef, useCallback } from "react";

const WAYPOINTS = [
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

  const update = useCallback(
    (progress: number) => {
      const svg = svgRef.current;
      const plane = planeRef.current;
      const track = trackRef.current;
      if (!svg || !plane || !track) return;

      const measureEl = svg.querySelector<SVGPathElement>("#pp-measure");
      const trailEl = svg.querySelector<SVGPathElement>("#pp-trail");
      const glowEl = svg.querySelector<SVGPathElement>("#pp-glow");
      const planeG = plane.querySelector<SVGGElement>("#pp-g");
      if (!measureEl || !trailEl || !glowEl || !planeG) return;

      const totalLen = measureEl.getTotalLength();
      const len = Math.min(totalLen * progress, totalLen * 0.9998);
      const pt = measureEl.getPointAtLength(len);
      const pt2 = measureEl.getPointAtLength(
        Math.min(len + 0.3, totalLen * 0.9998),
      );

      // ✅ Gunakan dimensi track (300vw x 100vh), bukan viewport
      const trackW = track.scrollWidth;
      const trackH = track.clientHeight;

      plane.style.left = `${(pt.x / 100) * trackW}px`;
      plane.style.top = `${(pt.y / 100) * trackH}px`;

      // ✅ Koreksi angle: kompensasi aspect ratio distortion
      const scaleX = trackW / 100;
      const scaleY = trackH / 100;
      const dx = (pt2.x - pt.x) * scaleX;
      const dy = (pt2.y - pt.y) * scaleY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;

      planeG.style.transform = `rotate(${angle}deg)`;
      planeG.style.transformOrigin = "50% 50%";

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

    svg.style.width = `${track.scrollWidth}px`;

    const pathD = buildCatmullRom(WAYPOINTS);
    svg.querySelector("#pp-measure")?.setAttribute("d", pathD);
    svg.querySelector("#pp-trail")?.setAttribute("d", pathD);
    svg.querySelector("#pp-glow")?.setAttribute("d", pathD);

    const measureEl = svg.querySelector<SVGPathElement>("#pp-measure");
    const trailEl = svg.querySelector<SVGPathElement>("#pp-trail");
    const glowEl = svg.querySelector<SVGPathElement>("#pp-glow");
    if (measureEl && trailEl && glowEl) {
      const total = measureEl.getTotalLength();
      trailEl.style.strokeDasharray = String(total);
      trailEl.style.strokeDashoffset = String(total);
      glowEl.style.strokeDasharray = String(total);
      glowEl.style.strokeDashoffset = String(total);
    }

    requestAnimationFrame(() => {
      svg.style.width = `${track.scrollWidth}px`;
      update(0.001);
      onReady(update);
    });
  }, [update, onReady]);

  return (
    <>
      {/* Trail SVG — mengisi viewport (parent sudah 100vw x 100vh) */}
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
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

      {/* Plane — position absolute, left/top di-set via JS */}
      <div
        ref={planeRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 64,
          height: 48,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <svg
          viewBox="0 0 64 48"
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={48}
        >
          <g id="pp-g">
            <polygon points="0,24 64,10 48,24" fill="white" />
            <polygon points="0,24 64,38 48,24" fill="white" />
            <line
              x1="0"
              y1="24"
              x2="48"
              y2="24"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.5"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
