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
import Offerings, { OfferingsHandle } from "../components/Offerings";
import CodeBox from "../components/CodeBox";
import ShapeCluster from "../components/ShapeCluster";
import ValuePropositon from "../components/ValueProposition";
import WindLines from "../components/Windlines";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import TextReveal, { TextRevealHandle } from "../components/TextReveal";
import { CloudCluster } from "../components/CloudCluster";
import { CloudClusterDoor } from "../components/CloudClusterDoor";
import { ScrollTextOverlay } from "../components/ScrollTextOverlay";
import { useBallAnimation } from "../hooks/useBallAnimation";
import { useLenis } from "../hooks/useLenis";
import { useSectionAnimations } from "../hooks/useSectionAnimations";
import { useSection1 } from "../hooks/useSection1";
import { useBallSection } from "../hooks/useBallSection";
import { useHorizontalScrollParticle } from "../hooks/useHorizontalScrollParticle";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const textRevealRef = useRef<OfferingsHandle | null>(null);
  const scrollXRef = useRef<number>(0);
  const [scrollX, setScrollX] = useState(0);
  const [windProgress, setWindProgress] = useState(0);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const section1Ref = useRef<HTMLDivElement>(null);
  const ballSectionRef = useRef<HTMLDivElement>(null);
  const offeringTriggerRef = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const offeringsPlaceholderRef = useRef<HTMLDivElement>(null);
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

    return () => {};
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
  useBallSection(
    ballSectionRef,
    ballRef,
    section4Ref,
    currentIndex,
    textRevealRef,
  );

  return (
    <div>
      {/* <div className="section-panel h-screen bg-black relative">
        <ParallaxHero />
        <Sidebar />
        <Navbar />
        <UpperSvg ref={waveRef} />
      </div>

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

      <div className="section-panel relative bg-[#9B8EC7]">
        <LowerSvg />
      </div> 

      <div
        ref={hScrollRef}
        className="section-panel bg-[#9B8EC7]"
        style={{ position: "relative" }}
      >
        <CloudCluster />

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
            zIndex: 1,
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
              Start <br className="hidden md:inline" />
              Your Journey{" "}
              <span className="animate-pulse delay-[0.8s] rotate-20 md:scale-[0.8]">
                <span className="text-amber-400">✦</span>
              </span>
            </>
          }
        />
        <PaperPlaneScene
          trackRef={trackRef}
          onReady={handleReady}
          scrollXRef={scrollXRef}
        />
        <HorizontalScroll trackRef={trackRef}>
          <div
            className="flex md:min-w-[200vw] min-w-[280vw]"
            style={{
              height: "100vh",
              paddingBottom: "120px",
            }}
          />
        </HorizontalScroll>
      </div> */}

      <div
        ref={ballSectionRef}
        className="section-panel h-screen flex items-start md:items-center justify-center"
        style={{
          position: "relative",
          overflow: "clip",
          background:
            "radial-gradient(circle at bottom center, rgba(255, 255, 255, 255) 0%, rgba(189, 166, 206, 1) 25%)",
        }}
      >
        <CloudClusterDoor />
        <ShapeCluster />
        <CodeBox top="5rem" />
        <ValuePropositon text="Crafted interfaces, seamless interactions, optimized performance, and thoughtfully engineered experiences. I handle the complexity behind the scenes so you can focus on what truly matters." />

        {/* Offerings sebagai layer di atas */}
        <div
          ref={section4Ref}
          className="bg-white w-full h-full flex items-center justify-center"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            opacity: 0,
            transform: "translateY(40px) scale(0.95)",
            pointerEvents: "none",
          }}
        >
          <Offerings ref={textRevealRef} />
        </div>
      </div>

      <div
        className="bg-white w-full flex items-center justify-center"
        style={{ padding: "0 2rem" }}
      >
        <TechStack />
      </div>

      <div
        className="bg-white w-full flex items-center justify-center"
        style={{ padding: "0 2rem" }}
      >
        <Projects />
      </div>
    </div>
  );
}
