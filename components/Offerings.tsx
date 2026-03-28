import { useRef } from "react";
import { useSectionReveal } from "../hooks/useSectionReveal";

const offerings = [
  {
    num: "01",
    title: "End-to-End Web Development",
    text: "Delivering complete web solutions from frontend UI to backend logic and database architecture, ensuring consistency and quality across the full stack.",
  },
  {
    num: "02",
    title: "Clean & Maintainable Code",
    text: "Writing structured, well-documented code following industry best practices to ensure long-term maintainability and ease of collaboration within development teams.",
  },
  {
    num: "03",
    title: "Effective Communication",
    text: "Translating technical concepts into clear, understandable language for both technical and non-technical stakeholders, ensuring alignment across teams.",
  },
  {
    num: "04",
    title: "Collaborative Team Player",
    text: "Experienced working within cross-functional teams, respecting deadlines, providing constructive feedback, and contributing to a positive and productive work environment.",
  },
  {
    num: "05",
    title: "Problem-Solving Mindset",
    text: "Approaching challenges analytically and systematically, identifying root causes and delivering efficient, scalable solutions under real-world constraints.",
  },
  {
    num: "06",
    title: "Continuous Learning",
    text: "Committed to staying up-to-date with evolving technologies and best practices, proactively improving offerings to deliver higher value in every project.",
  },
];

export default function Offerings() {
    const sectionRef = useRef<HTMLElement>(null);
    useSectionReveal(sectionRef, {
      selector: ".tech-card",
      start: "top bottom",
    });
  return (
    <section ref={sectionRef}
      style={{
        padding: "2rem 1rem 1rem",
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .offering-card {
          position: relative;
          overflow: hidden;
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 1.1rem 1rem 1rem;
          background: rgba(0,0,0,0.04);
          cursor: default;
          transition: border-color 0.4s ease;
        }
        .offering-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #111111;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          z-index: 0;
        }
        .offering-card:hover::after {
          transform: translateY(0%);
        }
        .offering-card:hover {
          border-color: transparent;
        }
        .card-content {
          position: relative;
          z-index: 1;
        }
        .offering-card .card-num {
          font-size: 11px;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
          font-weight: 500;
          color: rgba(0,0,0,0.35);
          transition: color 0.4s ease;
        }
        .offering-card:hover .card-num {
          color: rgba(255,255,255,0.35);
        }
        .offering-card .card-title {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 6px;
          font-family: monospace;
          color: #000000;
          transition: color 0.4s ease;
        }
        .offering-card:hover .card-title {
          color: #ffffff;
        }
        .offering-card .card-text {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(0,0,0,0.55);
          transition: color 0.4s ease;
        }
        .offering-card:hover .card-text {
          color: rgba(255,255,255,0.55);
        }

        .offerings-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          gap: 12px;
        }
        .offerings-header h2 {
          font-size: 32px;
          font-weight: 500;
          line-height: 1.1;
          margin: 0;
          color: #000000;
        }
        .offerings-header .count {
          font-size: 12px;
          letter-spacing: 0.1em;
          padding-bottom: 4px;
          flex-shrink: 0;
          color: rgba(0,0,0,0.35);
        }
        .offerings-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 768px) {
          .offerings-header h2 {
            font-size: 22px;
          }
          .offerings-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .offerings-header h2 {
            font-size: 20px;
          }
          .offerings-header .count {
            font-size: 11px;
          }
          .offerings-grid {
            grid-template-columns: 1fr;
          }
          .offering-card {
            padding: 1rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="offerings-header">
        <h2>
          Gilang Arya Leksana
          <br />
          <em
            style={{
              fontStyle: "italic",
              color: "rgba(0,0,0,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            Full-Stack Developer
          </em>
        </h2>
        <div className="count">Offerings</div>
      </div>

      {/* Grid */}
      <div className="offerings-grid">
        {offerings.map((offering) => (
          <div key={offering.num} className="offering-card">
            <div className="card-content">
              <div className="card-num">{offering.num}</div>
              <div className="card-title">{offering.title}</div>
              <div className="card-text">{offering.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
