interface TechCategory {
  category: string;
  items: string[];
}

const techStack: TechCategory[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "REST API", "GraphQL"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MongoDB", "Prisma", "Redis"],
  },
  {
    category: "DevOps",
    items: ["Docker", "GitHub Actions", "Vercel", "AWS"],
  },
  {
    category: "Tools",
    items: ["Git", "Figma", "Postman", "VS Code"],
  },
  {
    category: "Currently Learning",
    items: ["Rust", "Web3", "AI/ML", "Edge Computing"],
  },
];

const FrontendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="3"
      width="16"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="1"
      y1="6.5"
      x2="17"
      y2="6.5"
      stroke="currentColor"
      strokeWidth="1"
    />
    <circle cx="3.5" cy="4.75" r="0.75" fill="currentColor" />
    <circle cx="5.75" cy="4.75" r="0.75" fill="currentColor" />
    <circle cx="8" cy="4.75" r="0.75" fill="currentColor" />
  </svg>
);

const BackendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1.5"
      y="2"
      width="15"
      height="4.5"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1"
    />
    <rect
      x="1.5"
      y="8"
      width="15"
      height="4.5"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1"
    />
    <circle cx="13.5" cy="4.25" r="0.85" fill="currentColor" />
    <circle cx="13.5" cy="10.25" r="0.85" fill="currentColor" />
    <line
      x1="3.5"
      y1="4.25"
      x2="9"
      y2="4.25"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="3.5"
      y1="10.25"
      x2="9"
      y2="10.25"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const DatabaseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="9"
      cy="4.5"
      rx="6"
      ry="2"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="3"
      y1="4.5"
      x2="3"
      y2="13.5"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="15"
      y1="4.5"
      x2="15"
      y2="13.5"
      stroke="currentColor"
      strokeWidth="1"
    />
    <ellipse
      cx="9"
      cy="13.5"
      rx="6"
      ry="2"
      stroke="currentColor"
      strokeWidth="1"
    />
    <ellipse
      cx="9"
      cy="9"
      rx="6"
      ry="2"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

const DevOpsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 3C9 3 13 3 15 6C17 9 15 13 12 14"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M12 14C10.5 14.5 8 14.5 6 13C4 11.5 3 9 4 7C5 5 7 4 9 3"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <polyline
      points="12,11 12,14 15,14"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ToolsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 3.5C9.8 3.2 9 3 8.2 3.1C6 3.4 4.2 5.3 4 7.5C3.9 8.5 4.1 9.4 4.6 10.2L2.5 15L4.5 15.5L6 13.5C6.8 14 7.7 14.2 8.7 14.1C11 13.8 12.8 11.8 13 9.5C13.1 8.4 12.8 7.4 12.2 6.5L14.5 4.5L13 3L10.5 3.5Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LearningIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="9"
      y1="2"
      x2="9"
      y2="16"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="2"
      y1="9"
      x2="16"
      y2="9"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="4.05"
      y1="4.05"
      x2="13.95"
      y2="13.95"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="13.95"
      y1="4.05"
      x2="4.05"
      y2="13.95"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const categoryIcons: Record<string, React.ReactElement> = {
  Frontend: <FrontendIcon />,
  Backend: <BackendIcon />,
  Database: <DatabaseIcon />,
  DevOps: <DevOpsIcon />,
  Tools: <ToolsIcon />,
  "Currently Learning": <LearningIcon />,
};

export default function TechStack() {
  return (
    <section
      style={{
        padding: "5rem 1rem 1rem",
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .tech-card {
          position: relative;
          overflow: hidden;
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 1.1rem 1rem 1rem;
          background: rgba(0,0,0,0.04);
          cursor: default;
          transition: border-color 0.4s ease;
        }
        .tech-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #111111;
          transform: translateY(101%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          z-index: 0;
        }
        .tech-card:hover::after {
          transform: translateY(0%);
        }
        .tech-card:hover {
          border-color: transparent;
        }
        .tech-card-content {
          position: relative;
          z-index: 1;
        }

        .tech-card .card-icon {
          margin-bottom: 10px;
          color: rgba(0,0,0,0.3);
          transition: color 0.4s ease;
          line-height: 1;
          display: block;
        }
        .tech-card:hover .card-icon {
          color: rgba(255,255,255,0.3);
        }

        .tech-card .card-category {
          font-size: 11px;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
          font-weight: 500;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
          transition: color 0.4s ease;
        }
        .tech-card:hover .card-category {
          color: rgba(255,255,255,0.35);
        }

        .tech-items {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .tech-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          font-family: monospace;
          color: #000000;
          padding-bottom: 6px;
          padding-top: 6px;
          transition: color 0.4s ease, border-color 0.4s ease;
        }
        .tech-item:first-child {
          padding-top: 0;
        }
        .tech-item:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }
        .tech-card:hover .tech-item {
          color: #ffffff;
          border-bottom-color: rgba(255,255,255,0.08);
        }
        .tech-card:hover .tech-item:last-child {
          border-bottom: none;
        }
        .tech-item-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          flex-shrink: 0;
          transition: background 0.4s ease;
        }
        .tech-card:hover .tech-item-dot {
          background: rgba(255,255,255,0.2);
        }

        .tech-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 12px;
        }
        .tech-header h2 {
          font-size: 32px;
          font-weight: 500;
          line-height: 1.1;
          margin: 0;
          color: #000000;
        }
        .tech-header .count {
          font-size: 12px;
          letter-spacing: 0.1em;
          padding-bottom: 4px;
          flex-shrink: 0;
          color: rgba(0,0,0,0.35);
        }
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 768px) {
          .tech-header h2 {
            font-size: 22px;
          }
          .tech-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .tech-header h2 {
            font-size: 20px;
          }
          .tech-header .count {
            font-size: 11px;
          }
          .tech-grid {
            grid-template-columns: 1fr;
          }
          .tech-card {
            padding: 1rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="tech-header">
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
            Stack & Tools
          </em>
        </h2>
        <div className="count">Tech Stack</div>
      </div>

      {/* Grid */}
      <div className="tech-grid">
        {techStack.map((stack) => (
          <div key={stack.category} className="tech-card">
            <div className="tech-card-content">
              <span className="card-icon">{categoryIcons[stack.category]}</span>
              <div className="card-category">{stack.category}</div>
              <div className="tech-items">
                {stack.items.map((item) => (
                  <div key={item} className="tech-item">
                    <span className="tech-item-dot" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
