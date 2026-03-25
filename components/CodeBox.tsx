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
gsap.to(track, {
  x: () => -getTotalWidth(),
  scrollTrigger: {
    trigger: hScrollRef.current,
    start: "top top",
    end: () => '+=' + getTotalWidth(),
    scrub: true,
    pin: true,
  }
});
`;

export default function CodeBox({
  code = defaultCode,
  maxWidth = "420px",
}: CodeBoxProps) {
  return (
    <div
      className={`
  absolute top-4 left-1/2 -translate-x-1/2 
  bg-gray-900/85 backdrop-blur-lg 
  rounded-2xl border border-white/8 
  overflow-auto pointer-events-none p-2 px-4 w-[300px]
  md:top-8 md:right-8 md:left-auto md:translate-x-0 
  md:max-w-[400px] md:max-h-[60vh]
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
        className="m-0 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
      />
    </div>
  );
}
