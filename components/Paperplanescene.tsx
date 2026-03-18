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

const SKILL_STOPS = [
  { progress: 0.12, label: "React", sub: "UI Library", offsetY: -75 },
  { progress: 0.25, label: "Next.js", sub: "Full Stack Framework", offsetY: 0 },
  { progress: 0.38, label: "TypeScript", sub: "Type Safety", offsetY: -75 },
  { progress: 0.52, label: "Node.js", sub: "Backend Runtime", offsetY: 0 },
  { progress: 0.65, label: "Tailwind CSS", sub: "Styling", offsetY: -75 },
  { progress: 0.78, label: "PostgreSQL", sub: "Database", offsetY: 0 },
  { progress: 0.9, label: "Docker", sub: "DevOps", offsetY: -75 },
];

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
  const skillRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());

  const measureRef = useRef<SVGPathElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const glowRef = useRef<SVGPathElement | null>(null);
  const totalLenRef = useRef<number>(0);

  const positionSkillLabels = useCallback(() => {
    const measureEl = measureRef.current;
    const track = trackRef.current;
    if (!measureEl || !track) return;

    const totalLen = totalLenRef.current;
    if (totalLen === 0) return;

    const trackW = track.scrollWidth;
    const trackH = track.clientHeight;

    SKILL_STOPS.forEach((stop, i) => {
      const len = Math.min(totalLen * stop.progress, totalLen * 0.9998);
      const pt = measureEl.getPointAtLength(len);

      const xPx = (pt.x / 100) * trackW;
      const yPx = (pt.y / 100) * trackH;

      const el = skillRefsMap.current.get(i);
      if (!el) return;

      el.style.left = `${xPx}px`;
      el.style.top = `${yPx + stop.offsetY}px`;
      el.style.opacity = "0";
      el.style.transform = "translate(-50%, 0px)";
    });
  }, [trackRef]);

  const update = useCallback(
    (progress: number) => {
      const plane = planeRef.current;
      const track = trackRef.current;
      const measureEl = measureRef.current;
      const trailEl = trailRef.current;
      const glowEl = glowRef.current;

      // ✅ Tidak ada planeG di sini
      if (!plane || !track || !measureEl || !trailEl || !glowEl) return;

      const totalLen = totalLenRef.current;
      if (totalLen === 0) return;

      const len = Math.min(totalLen * progress, totalLen * 0.9998);
      const pt = measureEl.getPointAtLength(len);
      const pt2 = measureEl.getPointAtLength(
        Math.min(len + 0.3, totalLen * 0.9998),
      );

      const trackW = track.scrollWidth;
      const trackH = track.clientHeight;

      const scaleX = trackW / 100;
      const scaleY = trackH / 100;
      const dx = (pt2.x - pt.x) * scaleX;
      const dy = (pt2.y - pt.y) * scaleY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;

      // ✅ Rotasi langsung ke div wrapper
      plane.style.left = `${(pt.x / 100) * trackW}px`;
      plane.style.top = `${(pt.y / 100) * trackH}px`;
      plane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

      const offset = totalLen * (1 - progress);
      trailEl.style.strokeDashoffset = String(offset);
      glowEl.style.strokeDashoffset = String(offset);

      SKILL_STOPS.forEach((stop, i) => {
        const el = skillRefsMap.current.get(i);
        if (!el) return;

        const arrived = progress >= stop.progress - 0.01;
        const passed = progress >= stop.progress + 0.15;

        if (arrived && !passed) {
          el.style.opacity = "1";
          el.style.transform = "translate(-50%, 0px)";
        } else if (!arrived) {
          el.style.opacity = "0";
          el.style.transform = "translate(-50%, 10px)";
        } else {
          el.style.opacity = "0";
          el.style.transform = "translate(-50%, -10px)";
        }
      });
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

      positionSkillLabels();
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

      positionSkillLabels();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [update, onReady, trackRef, positionSkillLabels]);

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

      {SKILL_STOPS.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) skillRefsMap.current.set(i, el);
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: 0,
            transform: "translate(-50%, 0px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            pointerEvents: "none",
            zIndex: 15,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "20px",
              background: "rgba(255,255,255,0.3)",
              margin: "0 auto",
              display: i % 2 === 0 ? "none" : "block",
            }}
          />
          <div
            style={{
              padding: "6px 14px",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(0.7rem, 1.2vw, 0.95rem)",
                fontWeight: 600,
                color: "white",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {SKILL_STOPS[i].label}
            </div>
            <div
              style={{
                fontSize: "clamp(0.55rem, 0.9vw, 0.65rem)",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.12em",
                marginTop: "2px",
              }}
            >
              {SKILL_STOPS[i].sub}
            </div>
          </div>
          <div
            style={{
              width: "1px",
              height: "20px",
              background: "rgba(255,255,255,0.3)",
              margin: "0 auto",
              display: i % 2 === 0 ? "block" : "none",
            }}
          />
        </div>
      ))}

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
    </>
  );
}
