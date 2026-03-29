import { useRef } from "react";
import { useSectionReveal } from "../hooks/useSectionReveal";

// ── SVG Brand Icons ────────────────────────────────────────────────────────

const Icons: Record<string, React.FC<{ size?: number }>> = {
  React: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="3.2" fill="#61DAFB" />
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="6.5"
        stroke="#61DAFB"
        strokeWidth="1.5"
        fill="none"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="6.5"
        stroke="#61DAFB"
        strokeWidth="1.5"
        fill="none"
        transform="rotate(60 20 20)"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="6.5"
        stroke="#61DAFB"
        strokeWidth="1.5"
        fill="none"
        transform="rotate(120 20 20)"
      />
    </svg>
  ),
  "Next.js": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="17" fill="#111" />
      <path d="M13 28V12l18 21h-3L13 17v11z" fill="white" />
      <path d="M23 12h3v11L23 12z" fill="white" />
    </svg>
  ),
  TypeScript: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="5" fill="#3178C6" />
      <path
        d="M8 22h6M11 22v10"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M20 23.5C20 23.5 20.8 22 23 22C25.2 22 26 23 26 24.5C26 27 20 27 20 30C20 31.5 21 32 23 32C25 32 26 31 26 31"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  "Tailwind CSS": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M10 20c0-5 2.5-7.5 7.5-7.5C22.5 12.5 25 15 25 20c0 5 2.5 7.5 7.5 7.5"
        stroke="#38BDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M2.5 27.5C7.5 27.5 10 25 10 20c0-5 2.5-7.5 7.5-7.5"
        stroke="#38BDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  "Node.js": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 4L35 13V27L20 36L5 27V13L20 4Z" fill="#339933" />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="monospace"
      >
        js
      </text>
    </svg>
  ),
  Express: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="6" fill="#1a1a1a" />
      <text
        x="20"
        y="17"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
        fontFamily="monospace"
      >
        express
      </text>
      <line x1="8" y1="22" x2="32" y2="22" stroke="#444" strokeWidth="1" />
      <text
        x="20"
        y="31"
        textAnchor="middle"
        fill="#666"
        fontSize="7"
        fontFamily="monospace"
      >
        v4.x
      </text>
    </svg>
  ),
  "REST API": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect
        x="4"
        y="11"
        width="14"
        height="9"
        rx="2"
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="1.5"
      />
      <rect
        x="22"
        y="11"
        width="14"
        height="9"
        rx="2"
        fill="none"
        stroke="#4ECDC4"
        strokeWidth="1.5"
      />
      <path
        d="M18 15.5h4M20 13.5v4"
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="5"
        y="33"
        fill="#FF6B6B"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="monospace"
      >
        GET
      </text>
      <text
        x="17"
        y="33"
        fill="#F59E0B"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="monospace"
      >
        POST
      </text>
      <text
        x="29"
        y="33"
        fill="#4ECDC4"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="monospace"
      >
        PUT
      </text>
    </svg>
  ),
  GraphQL: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="6" r="3" fill="#E535AB" />
      <circle cx="33" cy="13.5" r="3" fill="#E535AB" />
      <circle cx="33" cy="26.5" r="3" fill="#E535AB" />
      <circle cx="20" cy="34" r="3" fill="#E535AB" />
      <circle cx="7" cy="26.5" r="3" fill="#E535AB" />
      <circle cx="7" cy="13.5" r="3" fill="#E535AB" />
      <polygon
        points="20,6 33,13.5 33,26.5 20,34 7,26.5 7,13.5"
        stroke="#E535AB"
        strokeWidth="1.3"
        fill="none"
      />
      <line
        x1="20"
        y1="6"
        x2="33"
        y2="26.5"
        stroke="#E535AB"
        strokeWidth="1"
        opacity="0.35"
      />
      <line
        x1="20"
        y1="6"
        x2="7"
        y2="26.5"
        stroke="#E535AB"
        strokeWidth="1"
        opacity="0.35"
      />
      <line
        x1="33"
        y1="13.5"
        x2="7"
        y2="13.5"
        stroke="#E535AB"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  ),
  PostgreSQL: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse
        cx="20"
        cy="11"
        rx="13"
        ry="5"
        fill="none"
        stroke="#336791"
        strokeWidth="1.8"
      />
      <path
        d="M7 11v18c0 2.8 5.8 5 13 5s13-2.2 13-5V11"
        stroke="#336791"
        strokeWidth="1.8"
        fill="none"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="13"
        ry="5"
        fill="none"
        stroke="#336791"
        strokeWidth="1.3"
        strokeDasharray="3 2"
      />
      <path
        d="M29 8c2-1.5 5-1 5 2v6"
        stroke="#336791"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  MongoDB: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 5C20 5 29 12 29 22C29 28.5 25 33 20 35C15 33 11 28.5 11 22C11 12 20 5 20 5Z"
        fill="#47A248"
      />
      <line
        x1="20"
        y1="24"
        x2="20"
        y2="36"
        stroke="#A8D5A2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Prisma: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M6 34L20 5L34 28L6 34Z"
        fill="none"
        stroke="#5A67D8"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 34L20 5"
        stroke="#5A67D8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 34L20 21L34 28"
        stroke="#5A67D8"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  ),
  Redis: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse
        cx="20"
        cy="13"
        rx="14"
        ry="5"
        fill="none"
        stroke="#DC382D"
        strokeWidth="1.8"
      />
      <path
        d="M6 13v5c0 2.8 6.3 5 14 5s14-2.2 14-5v-5"
        stroke="#DC382D"
        strokeWidth="1.8"
      />
      <path
        d="M6 18v5c0 2.8 6.3 5 14 5s14-2.2 14-5v-5"
        stroke="#DC382D"
        strokeWidth="1.8"
      />
    </svg>
  ),
  Docker: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect
        x="5"
        y="16"
        width="5.5"
        height="4.5"
        rx="0.8"
        stroke="#2496ED"
        strokeWidth="1.4"
      />
      <rect
        x="12"
        y="16"
        width="5.5"
        height="4.5"
        rx="0.8"
        stroke="#2496ED"
        strokeWidth="1.4"
      />
      <rect
        x="19"
        y="16"
        width="5.5"
        height="4.5"
        rx="0.8"
        stroke="#2496ED"
        strokeWidth="1.4"
      />
      <rect
        x="19"
        y="10"
        width="5.5"
        height="4.5"
        rx="0.8"
        stroke="#2496ED"
        strokeWidth="1.4"
      />
      <rect
        x="26"
        y="16"
        width="5.5"
        height="4.5"
        rx="0.8"
        stroke="#2496ED"
        strokeWidth="1.4"
      />
      <path
        d="M5 23c0 0 0 5 8 5h14c4 0 9-3 9-7.5c0 0-2 0-3.5-1c0 0 1-4-3-5.5"
        stroke="#2496ED"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="13.5" r="1.5" fill="#2496ED" />
    </svg>
  ),
  "GitHub Actions": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle
        cx="20"
        cy="20"
        r="15"
        fill="none"
        stroke="#2088FF"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="10" r="2.5" fill="#2088FF" />
      <circle cx="20" cy="30" r="2.5" fill="#2088FF" />
      <circle cx="10" cy="20" r="2.5" fill="#2088FF" />
      <circle cx="30" cy="20" r="2.5" fill="#2088FF" />
      <line
        x1="20"
        y1="12.5"
        x2="20"
        y2="17.5"
        stroke="#2088FF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="22.5"
        x2="20"
        y2="27.5"
        stroke="#2088FF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12.5"
        y1="20"
        x2="17.5"
        y2="20"
        stroke="#2088FF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="22.5"
        y1="20"
        x2="27.5"
        y2="20"
        stroke="#2088FF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Vercel: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 7L37 33H3L20 7Z" fill="#111" />
    </svg>
  ),
  AWS: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M8 20C5 19 4 16 6 13C7 11 9.5 10 12 11"
        stroke="#FF9900"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 11C13 8 15.5 6 18.5 6C22.5 6 25 9 25 12"
        stroke="#FF9900"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 12C27 12 30 13 30 16.5C30 19 28 21 25.5 21H8"
        stroke="#FF9900"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 26L12 24M20 27V24M26 26L28 24"
        stroke="#FF9900"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 29h20"
        stroke="#FF9900"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Git: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle
        cx="12"
        cy="10"
        r="3.5"
        fill="none"
        stroke="#F05032"
        strokeWidth="1.5"
      />
      <circle
        cx="28"
        cy="10"
        r="3.5"
        fill="none"
        stroke="#F05032"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="30"
        r="3.5"
        fill="none"
        stroke="#F05032"
        strokeWidth="1.5"
      />
      <line
        x1="12"
        y1="13.5"
        x2="12"
        y2="26.5"
        stroke="#F05032"
        strokeWidth="1.5"
      />
      <path
        d="M15.5 10h5C25 10 28 13 28 16v-2.5"
        stroke="#F05032"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Figma: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="11" y="5" width="9" height="10" rx="4.5" fill="#FF7262" />
      <rect x="20" y="5" width="9" height="10" rx="4.5" fill="#1ABCFE" />
      <rect x="11" y="15" width="9" height="10" rx="4.5" fill="#A259FF" />
      <rect x="11" y="25" width="9" height="10" rx="4.5" fill="#0ACF83" />
      <circle cx="24.5" cy="20" r="4.5" fill="#1ABCFE" />
    </svg>
  ),
  Postman: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="#FF6C37" />
      <path
        d="M14 20C14 16.7 16.7 14 20 14C23.3 14 26 16.7 26 20"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="3" fill="white" />
      <path
        d="M23 17L28 12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="28.5" cy="11.5" r="1.5" fill="white" />
    </svg>
  ),
  "VS Code": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M28 6L10 21L16 26L28 34V6Z" fill="#007ACC" />
      <path d="M28 6L16 17L10 13V9L28 6Z" fill="#1E9DFF" />
      <path d="M28 34L16 23L10 27V31L28 34Z" fill="#1E9DFF" />
    </svg>
  ),
  Rust: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle
        cx="20"
        cy="20"
        r="14"
        fill="none"
        stroke="#CE422B"
        strokeWidth="1.8"
      />
      <circle
        cx="20"
        cy="20"
        r="5"
        fill="none"
        stroke="#CE422B"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="6"
        x2="20"
        y2="14"
        stroke="#CE422B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="26"
        x2="20"
        y2="34"
        stroke="#CE422B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="13"
        x2="14.2"
        y2="17"
        stroke="#CE422B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="25.8"
        y1="23"
        x2="33"
        y2="27"
        stroke="#CE422B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="7"
        y1="27"
        x2="14.2"
        y2="23"
        stroke="#CE422B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="25.8"
        y1="17"
        x2="33"
        y2="13"
        stroke="#CE422B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Web3: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 6L34 14V26L20 34L6 26V14L20 6Z"
        stroke="#627EEA"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M20 6V20L34 14" stroke="#627EEA" strokeWidth="1" opacity="0.5" />
      <path d="M20 20V34L6 26" stroke="#627EEA" strokeWidth="1" opacity="0.5" />
      <path d="M20 20L34 26" stroke="#627EEA" strokeWidth="1" opacity="0.5" />
      <circle cx="20" cy="20" r="3.5" fill="#627EEA" />
    </svg>
  ),
  "AI/ML": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="8" r="2.5" fill="#A78BFA" />
      <circle cx="8" cy="26" r="2.5" fill="#A78BFA" />
      <circle cx="32" cy="26" r="2.5" fill="#A78BFA" />
      <circle cx="20" cy="20" r="3.5" fill="#7C3AED" />
      <line
        x1="20"
        y1="10.5"
        x2="20"
        y2="16.5"
        stroke="#A78BFA"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="24.5"
        x2="16.5"
        y2="21.5"
        stroke="#A78BFA"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="24.5"
        x2="23.5"
        y2="21.5"
        stroke="#A78BFA"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="2" fill="#C4B5FD" opacity="0.7" />
      <circle cx="26" cy="14" r="2" fill="#C4B5FD" opacity="0.7" />
      <line
        x1="15.4"
        y1="15.4"
        x2="18"
        y2="18"
        stroke="#A78BFA"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="24.6"
        y1="15.4"
        x2="22"
        y2="18"
        stroke="#A78BFA"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  ),
  "Edge Computing": ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M10 18C7 17 5 14 7 11C8.5 8 12 7.5 15 9"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 9C16 6.5 18.5 5 21.5 5C25.5 5 28 7.5 28 11"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 11C31 11 35 13 35 17C35 20 33 22 30 22H10"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 22V36"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 29h12M16 33h8"
        stroke="#34D399"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ── Data ──────────────────────────────────────────────────────────────────

const techItems = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "REST API", category: "Backend" },
  { name: "GraphQL", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Prisma", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "Docker", category: "DevOps" },
  { name: "GitHub Actions", category: "DevOps" },
  { name: "Vercel", category: "DevOps" },
  { name: "AWS", category: "DevOps" },
  { name: "Git", category: "Tools" },
  { name: "Figma", category: "Tools" },
  { name: "Postman", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Rust", category: "Learning" },
  { name: "Web3", category: "Learning" },
  { name: "AI/ML", category: "Learning" },
  { name: "Edge Computing", category: "Learning" },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { selector: ".ts-item", start: "top bottom" });

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        marginTop: "5rem",
        boxSizing: "border-box",
        display:"flex",
        justifyContent:"center",
        flexDirection:"column"
      }}
    >
      <style>{`
        /* ── Header ── */
        .ts-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 12px;
        }
        .ts-header h2 {
          font-size: 32px;
          font-weight: 500;
          line-height: 1.1;
          margin: 0;
          color: #000000;
        }
        .ts-header .ts-label {
          font-size: 12px;
          letter-spacing: 0.1em;
          padding-bottom: 4px;
          flex-shrink: 0;
          color: rgba(0,0,0,0.35);
        }

        /* ── Grid ── */
        .ts-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }

        /* ── Card ── */
        .ts-item {
          position: relative;
          overflow: hidden;
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 1.4rem 0.75rem 1rem;
          background: rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: default;
          transition: border-color 0.4s ease;
        }

        /* sliding dark fill on hover */
        .ts-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #111111;
          transform: translateY(101%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          z-index: 0;
        }
        .ts-item:hover::after  { transform: translateY(0%); }
        .ts-item:hover         { border-color: transparent; }

        /* ── Icon wrapper ── */
        .ts-icon {
          position: relative;
          z-index: 1;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .ts-item:hover .ts-icon { transform: scale(1.08); }

        /* ── Name ── */
        .ts-name {
          position: relative;
          z-index: 1;
          font-size: 11px;
          font-weight: 500;
          font-family: monospace;
          color: rgba(0,0,0,0.65);
          text-align: center;
          line-height: 1.3;
          transition: color 0.4s ease;
          white-space: nowrap;
        }
        .ts-item:hover .ts-name { color: rgba(255,255,255,0.85); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .ts-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 680px) {
          .ts-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
          .ts-item { padding: 1.1rem 0.5rem 0.8rem; }
        }
        @media (max-width: 420px) {
          .ts-header h2 { font-size: 22px; }
          .ts-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>

      {/* Header */}
      <div className="ts-header">
        <h2>
          Technology
          <br />
          <em
            style={{
              fontStyle: "italic",
              color: "rgba(0,0,0,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            Stack &amp; Tools
          </em>
        </h2>
        <div className="ts-label">Tech Stack</div>
      </div>

      {/* Grid */}
      <div className="ts-grid">
        {techItems.map((item) => {
          const Icon = Icons[item.name];
          return (
            <div key={item.name} className="ts-item">
              <div className="ts-icon">
                {Icon ? (
                  <Icon size={40} />
                ) : (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth="1.5"
                    />
                    <text
                      x="20"
                      y="25"
                      textAnchor="middle"
                      fill="rgba(0,0,0,0.4)"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {item.name.slice(0, 3).toUpperCase()}
                    </text>
                  </svg>
                )}
              </div>
              <span className="ts-name">{item.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
