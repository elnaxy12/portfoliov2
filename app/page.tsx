"use client";
import { useState, useRef, useCallback } from "react";
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

import { useBallAnimation } from "../hooks/useBallAnimation";
import { useLenis } from "../hooks/useLenis";
import { useSectionAnimations } from "../hooks/useSectionAnimations";
import { useSection1 } from "../hooks/useSection1";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import { useBallSection } from "../hooks/useballsection";

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

  const { ballRef } = useBallAnimation();

  const handleReady = useCallback((update: (progress: number) => void) => {
    planeUpdateRef.current = update;
  }, []);

  const lenisRef = useLenis((x) => setScrollX(x));
  useSectionAnimations(lenisRef, currentIndex, isAnimating);
  useSection1(section1Ref, waveRef, currentIndex);
  useHorizontalScroll(
    hScrollRef,
    trackRef,
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

      <div ref={hScrollRef} className="section-panel">
        <HorizontalScroll trackRef={trackRef} scrollXRef={scrollXRef}>
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
        <div
          ref={ballRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ffffff",
            transform: "translate(-50%, -50%) scale(1)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

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
          }}
        >
          <Section4 />
        </div>
      </div>
    </div>
  );
}
