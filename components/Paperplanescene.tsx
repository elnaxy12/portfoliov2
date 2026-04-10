"use client";

import { useEffect, useRef, useCallback, useState } from "react";

function getWaypoints() {
  const aspect = window.innerWidth / window.innerHeight;
  const amp = Math.min(aspect / 1.78, 1);
  const isMobile = window.innerWidth < 768;

  const base = isMobile
    ? [
        { x: -10, y: 50 },
        { x: 8, y: 45 },
        { x: 18, y: 55 },
        { x: 28, y: 42 },
        { x: 38, y: 52 },
        { x: 50, y: 40 },
        { x: 62, y: 50 },
        { x: 72, y: 22 },
        { x: 82, y: 100 },
        { x: 72, y: 150 },
        { x: 95, y: 200 },
      ]
    : [
        { x: -3, y: 55 },
        { x: 8, y: 45 },
        { x: 18, y: 62 },
        { x: 28, y: 30 },
        { x: 38, y: 58 },
        { x: 50, y: 25 },
        { x: 62, y: 50 },
        { x: 72, y: 22 },
        { x: 90, y: 55 },
        { x: 80, y: 73 },
        { x: 95, y: 82 },
      ];

  const centerY = 42;
  return base.map((pt) => ({ x: pt.x, y: centerY + (pt.y - centerY) * amp }));
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
  scrollXRef: React.MutableRefObject<number>;
}


export default function PaperPlaneScene({
  trackRef,
  onReady,
  scrollXRef,
}: PaperPlaneSceneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<SVGPathElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const glowRef = useRef<SVGPathElement | null>(null);
  const totalLenRef = useRef<number>(0);

  const update = useCallback(
    (progress: number) => {
      const plane = planeRef.current;
      const track = trackRef.current;
      const svg = svgRef.current;
      const measureEl = measureRef.current;
      const trailEl = trailRef.current;
      const glowEl = glowRef.current;
      if (!plane || !track || !svg || !measureEl || !trailEl || !glowEl) return;
      const totalLen = totalLenRef.current;
      if (totalLen === 0) return;

      const scrollX = scrollXRef.current;
      const trackW = track.scrollWidth; // ← pindah ke sini
      const trackH = track.clientHeight; // ← pindah ke sini

      const clampedLen = Math.min(totalLen * progress, totalLen * 0.9998);
      const lookAhead = 0.3;
      const isNearEnd = clampedLen + lookAhead >= totalLen * 0.9998;

      const pt = measureEl.getPointAtLength(clampedLen);
      const pt2 = isNearEnd
        ? measureEl.getPointAtLength(clampedLen - lookAhead)
        : measureEl.getPointAtLength(clampedLen + lookAhead);

      const dx = isNearEnd
        ? (pt.x - pt2.x) * (trackW / 100)
        : (pt2.x - pt.x) * (trackW / 100);
      const dy = isNearEnd
        ? (pt.y - pt2.y) * (trackH / 100)
        : (pt2.y - pt.y) * (trackH / 100);

      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;

      plane.style.left = `${(pt.x / 100) * trackW - scrollX}px`;
      plane.style.top = `${(pt.y / 100) * trackH}px`;
      plane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

      svg.style.transform = `translateX(${-scrollX}px)`;

      trailEl.style.strokeDashoffset = String(totalLen * (1 - progress));
      glowEl.style.strokeDashoffset = String(totalLen * (1 - progress));
    },
    [trackRef, scrollXRef],
  );

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const svg = svgRef.current;
    const track = trackRef.current;
    if (!svg || !track) return;

    measureRef.current = svg.querySelector<SVGPathElement>("#pp-measure");
    trailRef.current = svg.querySelector<SVGPathElement>("#pp-trail");
    glowRef.current = svg.querySelector<SVGPathElement>("#pp-glow");

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
      svg.style.transform = `translateX(${-scrollXRef.current}px)`;
      const total = measureEl.getTotalLength();
      totalLenRef.current = total;
      trailEl.style.strokeDasharray = String(total);
      trailEl.style.strokeDashoffset = String(total);
      glowEl.style.strokeDasharray = String(total);
      glowEl.style.strokeDashoffset = String(total);

      update(0.001);
      onReady(update);
    });

    const handleResize = () => {
      const pathD = buildCatmullRom(getWaypoints());
      measureRef.current?.setAttribute("d", pathD);
      trailRef.current?.setAttribute("d", pathD);
      glowRef.current?.setAttribute("d", pathD);
      if (svg && track) svg.style.width = `${track.scrollWidth}px`;
      const total = measureRef.current?.getTotalLength() ?? 0;
      totalLenRef.current = total;
      if (trailRef.current && glowRef.current) {
        trailRef.current.style.strokeDasharray = String(total);
        glowRef.current.style.strokeDasharray = String(total);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [update, onReady, trackRef, scrollXRef]);

  return (
    <div style={{ position: "fixed", width: "100%", height: "100vh" }}>
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 1,
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path id="pp-measure" fill="none" stroke="none" />
        <path
          id="pp-glow"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={isMobile ? "2" : "1.9"}
          strokeLinecap="round"
        />
        <path
          id="pp-trail"
          fill="none"
          stroke="rgba(255,255,255,1)"
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
          width: "clamp(80px, 12vw, 160px)",
          height: "clamp(80px, 12vw, 160px)",
          transform: "translate(-50%, -50%)",
          willChange: "left, top, transform",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <img
          className="rotate-[-130deg]"
          src="/images/paper-plane.png"
          alt=""
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
