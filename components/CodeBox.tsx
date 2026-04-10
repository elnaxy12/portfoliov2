// File: components/CodeBox.tsx
"use client";

import React from "react";

interface CodeBoxProps {
  code?: string; // default GSAP snippet
  top?: string;
  maxWidth?: string;
}

// Fungsi highlight code
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

// Default GSAP snippet
const defaultCode = `
const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
`;

export default function CodeBox({
  code = defaultCode,
  maxWidth = "420px",
}: CodeBoxProps) {
  return (
    <div
      className={`
  absolute top-2  
  bg-gray-900/85 backdrop-blur-lg 
  rounded-2xl border border-white/8 
  overflow-auto pointer-events-none p-4 mx-4 w-5/6 md:w-auto 
  md:top-8 md:right-8 md:left-auto md:translate-x-0 
  md:max-w-100 md:max-h-[60vh]
`}
    >
      {/* Header dots */}
      <div className="flex gap-1.5 px-3 py-2.5 border-b border-white/8 bg-white/2">
        <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
        <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
        <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
      </div>

      {/* Code content */}
      <pre
        className="m-0 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap wrap-break-words"
        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
      />
    </div>
  );
}
