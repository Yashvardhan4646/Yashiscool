import { useState } from "react";
import { User, Calendar, GraduationCap, Award, GitBranch, GitCommit } from "lucide-react";
import { portfolioData } from "../data/portfolioData";
import DossierWidget from "../components/pixelcanvas";
export default function About() {
  const { detailedBio, educationStatus } = portfolioData.personalInfo;
  const { skills, experience } = portfolioData;

  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Languages", "Frameworks & Libraries", "Tools & Workflows"];

  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  // Helper to resolve pastel color for skill bars based on category
  const getSkillColorClass = (category) => {
    if (category === "Languages") return "bar-pastel-rose";
    if (category.includes("Frameworks")) return "bar-pastel-mint";
    return "bar-pastel-purple";
  };

  // Helper to generate simulated commit hash based on index
  const getCommitHash = (idx) => {
    const hashes = ["c27a4b8", "f8b19e2", "d39c0f4", "e48d1a3"];
    return hashes[idx % hashes.length];
  };

  return (
    <div className="page-fade-in about-page">
      <div className="section-title-container">
        <User className="section-title-icon" size={28} strokeWidth={2.5} />
        <h1 className="section-title">Biography Ledger</h1>
      </div>

      <div className="grid-2-col">
        {/* Biography Block - Personal ID Card Dossier */}
        <div className="dossier-card neo-card card-peach" style={{ display: "flex", flexDirection: "column" }}>
          {/* Lanyard stripe slot */}
          <div className="dossier-header-stripe">
            <div className="dossier-lanyard-hole"></div>
          </div>

          <div className="dossier-body">
            {/* Retro Pixel Avatar */}
            <div className="dossier-avatar-wrapper">
              <img
                src="/avatar.png"
                alt="Yashvardhan Portrait"
                className="dossier-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://avatars.githubusercontent.com/u/98998671?v=4"; // Fallback to GitHub avatar
                }}
              />
            </div>

            {/* Dossier Meta Details */}
            <div className="dossier-meta">
              <span className="dossier-title-tag">IDENTIFICATION RECORD // SL25351129</span>
              <h2 className="dossier-name">Yashvardhan</h2>

              <div className="dossier-badge-row">
                <span className="project-status-tag stable" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>🟢 ACTIVE_NODE</span>
                <span className="project-status-tag beta" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>🏷️ WEB_DEV</span>
              </div>

              <div className="dossier-info-grid">
                <div className="dossier-row">
                  <span className="dossier-label">ROLE:</span>
                  <span className="dossier-val">Creative Coder</span>
                </div>
                <div className="dossier-row">
                  <span className="dossier-label">SYSTEM:</span>
                  <span className="dossier-val">Windows // x64</span>
                </div>
                <div className="dossier-row">
                  <span className="dossier-label">LOCATION:</span>
                  <span className="dossier-val">Haryana, India</span>
                </div>
              </div>

              <div className="dossier-signature-block">
                yashvardhan
              </div>
            </div>
          </div>

          {/* Retro Pixel Workspace Decoration to fill empty space */}
          <div
            className="dossier-illustration-container"
            style={{
              flexGrow: 1,
              position: "relative",
              overflow: "hidden",
              borderTop: "1.5px dashed rgba(15, 23, 42, 0.15)",
              minHeight: "180px" // Slightly bumped up minHeight for premium player controls spacing
            }}
          >
            {/* Switcher loads internal board and media tools right here */}
            <DossierWidget />
          </div>


          {/* Dossier Bottom Brief and Barcode */}
          <div className="dossier-bottom-bar">
            <div style={{ flex: 1, paddingRight: "16px", textAlign: "left" }}>
              <p className="dossier-title-tag" style={{ marginBottom: "2px" }}>BIOGRAPHICAL BRIEF</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {educationStatus}. Self-driven developer focused on clean markup, performance, and custom UI design systems.
              </p>
            </div>

            {/* Barcode SVG/CSS */}
            <div className="barcode-container">
              <div className="barcode-lines">
                <span className="barcode-line w-thin"></span>
                <span className="barcode-line w-mid"></span>
                <span className="barcode-line w-thick"></span>
                <span className="barcode-line w-thin"></span>
                <span className="barcode-line w-mid"></span>
                <span className="barcode-line w-thick"></span>
                <span className="barcode-line w-thin"></span>
                <span className="barcode-line w-mid"></span>
              </div>
              <span className="barcode-text">*YASH*2026*</span>
            </div>
          </div>
        </div>

        {/* Technical Skills Block - Audio Synthesizer Slider Widgets */}
        <div className="skills-block neo-card card-purple">
          <div className="section-header-small">
            <Award size={16} strokeWidth={2.5} />
            <span>Fader Panel (Skills)</span>
          </div>

          {/* Filter tabs */}
          <div className="skills-nav">
            {categories.map(cat => (
              <button
                key={cat}
                className={`skill-tab-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Synthesizer Sliders */}
          <div className="skills-list">
            {filteredSkills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>

                {/* Synthesizer Audio Slider */}
                <div className="synth-slider-container">
                  <div className="synth-slider-ticks">
                    <span>0</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>100</span>
                  </div>

                  <div className="synth-slider-track">
                    <div
                      className={`synth-slider-fill ${getSkillColorClass(skill.category)}`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                    <div
                      className="synth-slider-knob"
                      style={{ left: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Ledger - Git Commit timeline branch tree */}
      <div className="timeline-section neo-card card-sky">
        <div className="section-header-small" style={{ marginBottom: "14px" }}>
          <GitBranch size={16} strokeWidth={2.5} />
          <span>Timeline Ledger</span>
        </div>

        <div className="git-branch-header">
          <div className="git-branch-dot-green"></div>
          <span>$ git log --graph --oneline --branch yashvardhan/experience</span>
        </div>

        <div className="git-timeline">
          {experience.map((item, index) => {
            const isEven = index % 2 === 0;
            const noteColorClass = isEven ? "card-rose" : "card-mint";
            const hash = getCommitHash(index);
            return (
              <div key={index} className="git-commit-row">
                {/* Git Node Circle */}
                <div className="git-commit-node"></div>

                {/* Commit Content Box */}
                <div className={`git-commit-card neo-card ${noteColorClass}`}>
                  <div className="git-commit-header">
                    <div className="git-commit-hash-wrapper">
                      <span className="git-commit-hash">commit {hash}</span>
                      {index === 0 && <span className="git-commit-branch-tag">HEAD -{"\u003E"} local/main</span>}
                    </div>
                    <span className="git-commit-date-badge">{item.duration}</span>
                  </div>

                  <div className="git-commit-meta-details">
                    <span>Author: <span className="git-commit-author">Yashvardhan &lt;developer@yashvardhan.dev&gt;</span></span>
                    <span>Date: Tue Jun 02 15:15:01 2026 +0530</span>
                  </div>

                  <h3 className="git-commit-title">{item.role}</h3>
                  <h4 className="git-commit-company">{item.company}</h4>

                  <ul className="git-commit-message-list">
                    {item.description.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
