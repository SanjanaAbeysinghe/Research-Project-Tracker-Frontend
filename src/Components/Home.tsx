import React from "react";

import { useNavigate } from "react-router-dom";
import "../App.css";

const features = [
  {
    icon: "🗂️",
    title: "Document Hub",
    desc: "Store, organize, and access all research files instantly.",
  },
  {
    icon: "🎯",
    title: "Milestone Tracker",
    desc: "Set deadlines, track progress, and stay on schedule.",
  },
  {
    icon: "👥",
    title: "Team Roles",
    desc: "Assign PIs, co-investigators, and manage permissions.",
  },
  {
    icon: "📂",
    title: "Project Management",
    desc: "Create, organize, and manage research projects efficiently.",
  },
];

const stats = [
  { value: "1,200+", label: "Projects" },
  { value: "8,400+", label: "Researchers" },
  { value: "97%", label: "Satisfaction" },
];

const projects = [
  {
    dot: "#4f46e5",
    name: "Genome Sequencing Study",
    sub: "3 milestones left · Due Jun 12",
    pill: "On Track",
    pillBg: "#f0fdf4",
    pillColor: "#16a34a",
  },
  {
    dot: "#f59e0b",
    name: "Climate Impact Analysis",
    sub: "1 milestone left · Due May 18",
    pill: "At Risk",
    pillBg: "#fffbeb",
    pillColor: "#d97706",
  },
  {
    dot: "#06b6d4",
    name: "Neural Plasticity Trial",
    sub: "6 milestones left · Due Aug 3",
    pill: "Healthy",
    pillBg: "#f0fdf4",
    pillColor: "#16a34a",
  },
  {
    dot: "#a3a3a3",
    name: "Drug Interaction Study",
    sub: "All milestones complete",
    pill: "Done",
    pillBg: "#f5f5f5",
    pillColor: "#737373",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-brand">
          <div className="dot" />
          ResearchTrack
        </div>
        <div className="nav-right">
          <a className="nav-link" href="projects">Projects</a>
          <a className="nav-link" href="milestone">Milestone</a>
          <a className="nav-link" href="document">Document</a>
          <button className="nav-cta" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div>
          <div className="hero-badge">✦ Built for Research Teams</div>
          <h1>
            Your research,<br />
            <span>organized.</span>
          </h1>
          <p>
            Track milestones, manage documents, and coordinate your team — all
            in one clean, simple platform.
          </p>
          <div className="hero-btns">
            <button className="btn-dark" onClick={() => navigate("/register")}>
              Start for Free
            </button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="hero-card">
          <div className="hc-header">
            <span className="hc-title">Active Projects</span>
            <span className="hc-badge">4 Running</span>
          </div>
          {projects.map((r) => (
            <div className="hc-row" key={r.name}>
              <div className="hc-dot" style={{ background: r.dot }} />
              <div className="hc-info">
                <div className="hc-name">{r.name}</div>
                <div className="hc-sub">{r.sub}</div>
              </div>
              <div
                className="hc-pill"
                style={{ background: r.pillBg, color: r.pillColor }}
              >
                {r.pill}
              </div>
            </div>
          ))}
        </div>
      </section>


      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div className="stat-val">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="features">
        <div className="features-top">
          <h2>
            Everything in<br />one place
          </h2>
          <p>Designed for researchers who need clarity, not complexity.</p>
        </div>
        <div className="grid">
          {features.map((f) => (
            <div className="fcard" key={f.title} onClick={() => {
                if (f.title === "Document Hub") {
                  navigate("/document");
                  
                }
                if (f.title === "Milestone Tracker") {
                  navigate("/milestone");
                  
                }
                if (f.title === "Project Management") {
                  navigate("/projects");
                  
                }if (f.title === "Team Roles") {
                  navigate("/member");
                  
                }
              }
            }
              
    style={{ cursor: "pointer" }}>
              <div className="fcard-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <div>
            <h2>Ready to get organized?</h2>
            <p>Join thousands of researchers using ResearchTrack today.</p>
          </div>
          <button className="btn-white" onClick={() => navigate("/register")}>
            Create Free Account 
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-brand">
          <div className="dot" />
          ResearchTrack
        </div>
        <div className="footer-copy">
          © 2026 ResearchTrack. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
