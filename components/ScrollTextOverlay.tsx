"use client";

import { useRef, RefObject } from "react";
import { useScrollTextAnimation } from "../hooks/useScrollTextAnimation";

const GSAP_SNIPPET = `
gsap.to(track, {
  x: () => -getTotalWidth(),
  ease: "none",
  scrollTrigger: {
    trigger: hScrollRef.current,
    start: "top top",
    end: () => \`+=\${getTotalWidth()}\`,
    scrub: 1,
    pin: true,
    anticipatePin: 0,
    invalidateOnRefresh: true,
  }
});
`.trim();

// 🎨 simple syntax highlighting
function highlightCode(code: string) {
  const escapeHTML = (str: string) =>
    str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let result = escapeHTML(code);

  result = result.replace(
    /(["'`].*?["'`])/g,
    '<span class="tok-string">$1</span>',
  );

  result = result.replace(
    /\b(const|let|var|return|if|else|function|import|from|export|new)\b/g,
    '<span class="tok-keyword">$1</span>',
  );

  result = result.replace(
    /\b(true|false|null|undefined)\b/g,
    '<span class="tok-boolean">$1</span>',
  );

  result = result.replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>');

  result = result.replace(
    /\b([a-zA-Z_$][\w$]*)(?=\()/g,
    '<span class="tok-function">$1</span>',
  );

  result = result.replace(
    /(\b[a-zA-Z_$][\w$]*)(?=:)/g,
    '<span class="tok-property">$1</span>',
  );

  return result;
}

interface ScrollTextOverlayProps {
  scrollXRef: RefObject<number>;
  trackRef: RefObject<HTMLDivElement | null>;
  headlineText?: React.ReactNode;
  text1In?: number;
  text1Full?: number;
  text1Out?: number;
  text2In?: number;
  text2Full?: number;
}

export function ScrollTextOverlay({
  scrollXRef,
  trackRef,
  headlineText = "Teks awal kamu",
  text1In,
  text1Full,
  text1Out,
  text2In,
  text2Full,
}: ScrollTextOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useScrollTextAnimation({
    scrollXRef,
    trackRef,
    textRef: overlayRef,
    text1In,
    text1Full,
    text1Out,
    text2In,
    text2Full,
  });

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* 🔹 TEXT 1 */}
      <div
        className="scroll-text-1 text-3xl md:text-6xl flex items-center justify-center"
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          margin: 0,
          opacity: 0,
          fontWeight: 500,
          color: "white",
          transition: "opacity 0.05s, transform 0.05s",
          textShadow: "0 1px 12px rgba(0,0,0,0.4)",
        }}
      >
        {headlineText}
      </div>

      {/* 🔹 CODE BLOCK */}
      <div
        className="scroll-text-2"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          opacity: 0,

          background: "rgba(40, 40, 40, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",

          maxWidth: "420px",
          maxHeight: "60vh",
          overflow: "hidden",

          transition: "opacity 0.05s",
        }}
      >
        {/* 🔴🟡🟢 Header */}
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "10px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff5f56",
            }}
          />
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ffbd2e",
            }}
          />
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#27c93f",
            }}
          />
        </div>

        {/* 📦 Code */}
        <pre
          style={{
            margin: 0,
            padding: "14px 16px",
            fontSize: "0.75rem",
            color: "#d4d4d4",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{
            __html: highlightCode(GSAP_SNIPPET),
          }}
        />
      </div>
    </div>
  );
}
