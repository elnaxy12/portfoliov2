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
import Section4 from "../components/Section4";
import CodeBox from "../components/CodeBox";
import ShapeCluster from "../components/ShapeCluster";
import ValuePropositon from "../components/ValueProposition";
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
          "Hello everyone, my name is Gilang Arya. I am a Full Stack Developer
          who is passionate about building modern web applications. I have
          experience working with technologies such as JavaScript, React,
          Next.js, and backend development, allowing me to develop both frontend
          interfaces and backend systems. I enjoy creating interactive user
          experiences and building scalable web systems. One of the projects
          I've worked on is an online shop website with product filtering,
          category systems, and shopping cart features. I'm always excited to
          learn new technologies and improve my skills in full stack
          development."
        </h1>
      </div>

      {/* Section 2: Horizontal scroll + paper plane */}
      <div className="section-panel relative bg-[#9B8EC7]">
        <LowerSvg />
      </div>

      <div
        ref={hScrollRef}
        className="section-panel"
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
        <ScrollTextOverlay
          scrollXRef={scrollXRef}
          trackRef={trackRef}
          headlineText={
            <>
              Start <br />
              Your Journey{" "}
              <span className="inline-flex items-center justify-center text-[#22c55e] bg-white ml-2 rounded-full">
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
          overflow: "hidden",
        }}
      >
        {/* 🔹 Ball */}
        <div
          className="md:left-[calc(50%+80px)] left-[calc(50%+75px)]"
          ref={ballRef}
          style={{
            position: "absolute",
            top: "50%",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ffffff",
            transform: "translateY(-50%)", // biar vertikal center juga
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        <div className="absolute md:left-[calc(50%+51px)] md:-translate-y-15 -translate-y-15 left-[calc(50%+47px)] top-1/2 flex flex-col items-center gap-1 z-2">
          <span className="text-sm tracking-widest uppercase">Scroll</span>
          <div className="animate-bounce text-lg">↓</div>
        </div>

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
            maxHeight: "100vh",
            overflowY: "auto",
            alignSelf: "flex-center",
            paddingTop: "1.5rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Section4 />
        </div>
      </div>
    </div>
  );
}
