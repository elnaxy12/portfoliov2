import { useRef } from "react";
import { useSectionReveal } from "../hooks/useSectionReveal";

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  problem: string;
  solution: string;
  impact: string;
  accent: string;
}

const projects: Project[] = [
  {
    id: "01",
    name: "Voxy Sneaker Store",
    description:
      "Template HTML untuk penjualan sepatu — clean, responsif, dan siap pakai tanpa framework.",
    tech: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://...",
    githubUrl: "https://...",
    problem:
      "Banyak toko sepatu kecil belum punya online presence yang proper karena keterbatasan teknis dan biaya.",
    solution:
      "Template siap pakai berbasis HTML/CSS/JS yang ringan, mudah dikustomisasi tanpa butuh backend.",
    impact:
      "Mempercepat go-online UMKM dengan zero dependency dan setup under 5 menit.",
    accent: "#E8E0D5",
  },
  {
    id: "02",
    name: "Dashboard App",
    description:
      "Template HTML dashboard app dengan layout data-dense yang bersih dan navigasi intuitif.",
    tech: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://...",
    githubUrl: "https://...",
    problem:
      "Banyak template dashboard yang terlalu berat atau over-engineered untuk kebutuhan sederhana.",
    solution:
      "Dashboard template pure HTML/CSS/JS — ringan, fast load, dan bisa dipakai langsung tanpa build step.",
    impact:
      "Fondasi UI yang reusable untuk berbagai project internal maupun client.",
    accent: "#D5DDE8",
  },
];

const ExternalLinkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 10L10 2M10 2H5M10 2V7"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GithubIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.5 1C3.46 1 1 3.46 1 6.5C1 8.91 2.57 10.96 4.76 11.68C5.04 11.73 5.14 11.56 5.14 11.41V10.47C3.67 10.8 3.35 9.77 3.35 9.77C3.09 9.14 2.72 8.97 2.72 8.97C2.21 8.63 2.76 8.64 2.76 8.64C3.32 8.68 3.62 9.22 3.62 9.22C4.12 10.07 4.93 9.82 5.16 9.67C5.21 9.31 5.36 9.06 5.52 8.92C4.36 8.78 3.14 8.33 3.14 6.37C3.14 5.77 3.36 5.28 3.63 4.9C3.58 4.76 3.38 4.2 3.68 3.44C3.68 3.44 4.16 3.29 5.14 4.01C5.55 3.89 5.97 3.83 6.4 3.83C6.83 3.83 7.26 3.89 7.66 4.01C8.64 3.29 9.12 3.44 9.12 3.44C9.42 4.2 9.22 4.76 9.17 4.9C9.44 5.28 9.66 5.77 9.66 6.37C9.66 8.34 8.44 8.78 7.27 8.92C7.47 9.09 7.65 9.42 7.65 9.93V11.41C7.65 11.56 7.75 11.74 8.04 11.68C10.23 10.96 11.8 8.91 11.8 6.5C11.8 3.46 9.34 1 6.5 1Z"
      fill="currentColor"
    />
  </svg>
);

const PreviewIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="10"
      width="40"
      height="28"
      rx="4"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="4"
      y1="18"
      x2="44"
      y2="18"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="9" cy="14" r="1.5" fill="currentColor" />
    <circle cx="13.5" cy="14" r="1.5" fill="currentColor" />
    <circle cx="18" cy="14" r="1.5" fill="currentColor" />
    <rect
      x="10"
      y="22"
      width="28"
      height="3"
      rx="1.5"
      fill="currentColor"
      opacity="0.2"
    />
    <rect
      x="10"
      y="27.5"
      width="20"
      height="3"
      rx="1.5"
      fill="currentColor"
      opacity="0.15"
    />
    <rect
      x="10"
      y="33"
      width="24"
      height="3"
      rx="1.5"
      fill="currentColor"
      opacity="0.1"
    />
  </svg>
);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, {
    selector: ".project-card",
    start: "top bottom",
  });
  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        marginTop: "5rem",
        paddingBottom: "5rem",
        boxSizing: "border-box",
        display:"flex",
        justifyContent:"center",
        flexDirection:"column"
      }}
    >
      <style>{`
        /* ── Header ── */
        .projects-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 12px;
        }
        .projects-header h2 {
          font-size: 32px;
          font-weight: 500;
          line-height: 1.1;
          margin: 0;
          color: #000000;
        }
        .projects-header .count {
          font-size: 12px;
          letter-spacing: 0.1em;
          padding-bottom: 4px;
          flex-shrink: 0;
          color: rgba(0,0,0,0.35);
        }

        /* ── Bento grid ── */
        .projects-bento {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* ── Card base ── */
        .project-card {
          position: relative;
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(0,0,0,0.03);
          cursor: default;
          display: flex;
          flex-direction: column;
        }

        /* ── Preview area ── */
        .project-preview {
          width: 100%;
          aspect-ratio: 16/7;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: background 0.4s ease;
        }
        .project-preview-icon {
          color: rgba(0,0,0,0.15);
          transition: color 0.4s ease, transform 0.4s ease;
        }
        .project-card:hover .project-preview-icon {
          color: rgba(0,0,0,0.25);
          transform: scale(1.08);
        }
        .project-preview-label {
          position: absolute;
          bottom: 10px;
          right: 12px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.2);
          font-family: monospace;
        }

        /* ── Body ── */
        .project-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        /* ── Top row: id + name + links ── */
        .project-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
        }
        .project-id {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: rgba(0,0,0,0.25);
          font-family: monospace;
          flex-shrink: 0;
        }
        .project-name {
          font-size: 15px;
          font-weight: 500;
          font-family: monospace;
          color: #000;
          flex: 1;
        }
        .project-links {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .project-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          text-decoration: none;
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 5px;
          padding: 3px 7px;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .project-link:hover {
          color: #000;
          border-color: rgba(0,0,0,0.3);
          background: rgba(0,0,0,0.04);
        }

        /* ── Description ── */
        .project-desc {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(0,0,0,0.55);
        }

        /* ── Tech stack pills ── */
        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .tech-pill {
          font-size: 10px;
          font-family: monospace;
          letter-spacing: 0.05em;
          color: rgba(0,0,0,0.4);
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 4px;
          padding: 2px 7px;
          background: rgba(0,0,0,0.03);
        }

        /* ── Divider ── */
        .project-divider {
          height: 0.5px;
          background: rgba(0,0,0,0.07);
          margin: 0 -1rem;
          width: calc(100% + 2rem);
        }

        /* ── PSI block ── */
        .project-psi {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .psi-row {
          display: grid;
          grid-template-columns: 68px 1fr;
          gap: 8px;
          align-items: baseline;
        }
        .psi-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.25);
          font-family: monospace;
        }
        .psi-value {
          font-size: 12px;
          line-height: 1.5;
          color: rgba(0,0,0,0.6);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .projects-header h2 { font-size: 22px; }
          .projects-bento { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .projects-header h2 { font-size: 20px; }
          .project-body { padding: 0.85rem; }
          .psi-row { grid-template-columns: 60px 1fr; }
        }
      `}</style>

      {/* Header */}
      <div className="projects-header">
        <h2>
          Selected
          <br />
          <em
            style={{
              fontStyle: "italic",
              color: "rgba(0,0,0,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            Projects
          </em>
        </h2>
        <div className="count">Projects</div>
      </div>

      {/* Bento grid */}
      <div className="projects-bento">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            {/* Preview placeholder */}
            <div
              className="project-preview"
              style={{ background: project.accent }}
            >
              <div className="project-preview-icon">
                <PreviewIcon />
              </div>
              <span className="project-preview-label">No preview</span>
            </div>

            {/* Body */}
            <div className="project-body">
              {/* Top row */}
              <div className="project-top">
                <span className="project-id">{project.id}</span>
                <span className="project-name">{project.name}</span>
                <div className="project-links">
                  <a
                    href={project.liveUrl}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live <ExternalLinkIcon />
                  </a>
                  <a
                    href={project.githubUrl}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon /> GitHub
                  </a>
                </div>
              </div>

              {/* Description */}
              <p className="project-desc">{project.description}</p>

              {/* Tech pills */}
              <div className="project-tech">
                {project.tech.map((t) => (
                  <span key={t} className="tech-pill">
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-divider" />

              {/* Problem / Solution / Impact */}
              <div className="project-psi">
                <div className="psi-row">
                  <span className="psi-label">Problem</span>
                  <span className="psi-value">{project.problem}</span>
                </div>
                <div className="psi-row">
                  <span className="psi-label">Solution</span>
                  <span className="psi-value">{project.solution}</span>
                </div>
                <div className="psi-row">
                  <span className="psi-label">Impact</span>
                  <span className="psi-value">{project.impact}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
