"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UpperSvg from "../components/svg/UpperSvg";
import LowerSvg from "../components/svg/LowerSvg";
import ParallaxHero from "../components/ParallaxHero";
import PaperPlaneScene from "../components/Paperplanescene";
import HorizontalScroll from "../components/Horizontalscroll";
import Offerings from "../components/Offerings";
import CodeBox from "../components/CodeBox";
import ShapeCluster from "../components/ShapeCluster";
import ValuePropositon from "../components/ValueProposition";
import WindLines from "../components/Windlines";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import { ScrollTextOverlay } from "../components/ScrollTextOverlay";

import { useBallAnimation } from "../hooks/useBallAnimation";
import { useLenis } from "../hooks/useLenis";
import { useSectionAnimations } from "../hooks/useSectionAnimations";
import { useSection1 } from "../hooks/useSection1";
import { useBallSection } from "../hooks/useBallSection";
import { useHorizontalScrollParticle } from "../hooks/useHorizontalScrollParticle";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const scrollXRef = useRef<number>(0);
  const [scrollX, setScrollX] = useState(0);
  const [windProgress, setWindProgress] = useState(0);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const section1Ref = useRef<HTMLDivElement>(null);
  const ballSectionRef = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const planeUpdateRef = useRef<((progress: number) => void) | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { ballRef } = useBallAnimation();

  const handleReady = useCallback((update: (progress: number) => void) => {
    planeUpdateRef.current = update;
  }, []);

  useEffect(() => {
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });
    ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      lockAxis: true,
    });

    return () => {
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);

  const lenisRef = useLenis((x) => setScrollX(x));
  useSectionAnimations(lenisRef, currentIndex, isAnimating);
  useSection1(section1Ref, waveRef, currentIndex);
  useHorizontalScrollParticle(
    hScrollRef,
    trackRef,
    canvasRef,
    svgRef,
    planeUpdateRef,
    currentIndex,
    scrollXRef,
    setWindProgress,
  );
  useBallSection(ballSectionRef, ballRef, section4Ref, currentIndex);

  return (
    <div>
      {/* Section 0: Hero */}
      <div className="section-panel h-screen bg-black relative">
        <ParallaxHero />
        <Sidebar />
        <Navbar />
        <UpperSvg ref={waveRef} />
      </div>

      {/* Section 1: scroll → hitam ke putih */}
      <div
        ref={section1Ref}
        className="section-panel h-screen flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <h1
          className="sesi-title text-base md:text-base text-justify px-10 md:px-50 leading-loose"
          style={{ color: "#ffffff" }}
        >
          I’m a full stack developer who enjoys turning ideas into real,
          functional products. As a fresh graduate, I’ve built a strong
          foundation in both frontend and backend development, along with
          valuable experience from organizational work that shaped my discipline
          and teamwork. I focus on creating engaging user interfaces with React
          while also handling backend logic, APIs, and databases to ensure
          everything runs smoothly behind the scenes. I love solving problems,
          improving performance, and building things that are not just visually
          appealing, but also efficient and impactful. For me, development is
          not just about code — it’s about crafting experiences.
        </h1>
      </div>

      {/* Section 2: Horizontal scroll + paper plane */}
      <div className="section-panel relative bg-[#9B8EC7]">
        <LowerSvg />
      </div>

      {/* Section HorizontallScroll */}
      <div
        ref={hScrollRef}
        className="section-panel bg-[#9B8EC7]"
        style={{ position: "relative" }}
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
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <WindLines
          scrollProgress={windProgress}
          style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
        />
        <ScrollTextOverlay
          scrollXRef={scrollXRef}
          trackRef={trackRef}
          headlineText={
            <>
              Start <br />
              Your Journey{" "}
              <span className="text-amber-400 ml-2 rotate-20">
                ✦
              </span>
            </>
          }
        />
        <HorizontalScroll trackRef={trackRef}>
          <PaperPlaneScene
            trackRef={trackRef}
            onReady={handleReady}
            scrollXRef={scrollXRef}
          />
          <div
            className="flex"
            style={{
              minWidth: "300vw",
              height: "100vh",
              paddingBottom: "120px",
            }}
          />
        </HorizontalScroll>
      </div>

      {/* Section 3+4: Ball membesar → Section4 muncul */}
      <div
        ref={ballSectionRef}
        className="section-panel h-screen flex items-start md:items-center justify-center bg-[#BDA6CE]"
        style={{
          position: "relative",
          overflow: "clip",
        }}
      >
        {/* 🔹 Ball */}
        <div
          className="left-1/2 md:translate-x-20 translate-x-19"
          ref={ballRef}
          style={{
            position: "absolute",
            top: "50%",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ffffff",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        <ShapeCluster />
        <CodeBox top="5rem" />
        <ValuePropositon text="Crafted interfaces, seamless interactions, optimized performance, and thoughtfully engineered experiences. I handle the complexity behind the scenes so you can focus on what truly matters." />

        {/* 🔹 Section4 */}
        <div
          ref={section4Ref}
          style={{
            position: "relative",
            zIndex: 3,
            opacity: 0,
            width: "100%",
            padding: "0 2rem",
            alignSelf: "flex-center",
            paddingTop: "1.5rem",
          }}
        >
          <Offerings />
        </div>
      </div>

      <div
        className="bg-white w-full flex items-center justify-center"
        style={{ padding: "0 2rem" }}
      >
        <TechStack />
      </div>

      {/* Projects — section normal */}
      <div
        className="bg-white w-full flex items-center justify-center"
        style={{ padding: "0 2rem" }}
      >
        <Projects />
      </div>
    </div>
  );
}
