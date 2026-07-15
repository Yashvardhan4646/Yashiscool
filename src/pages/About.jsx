import { useState, useEffect, useRef } from "react";
import { User, Calendar, GraduationCap, Award, GitBranch, GitCommit } from "lucide-react";
import { portfolioData } from "../data/portfolioData";
import DossierWidget from "../components/pixelcanvas";

export default function About() {
  const { detailedBio, educationStatus } = portfolioData.personalInfo;
  const { experience } = portfolioData;

  const [skillsList, setSkillsList] = useState(portfolioData.skills);
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedCommits, setExpandedCommits] = useState({});

  const categories = ["All", "Languages", "Frameworks & Libraries", "Tools & Workflows"];

  const filteredSkills = activeCategory === "All"
    ? skillsList
    : skillsList.filter(skill => skill.category === activeCategory);

  // Web Audio synth tone generator for skill faders
  const playSynthTone = (pitch, duration = 0.1, type = "sine") => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore autoplay/audio restrictions
    }
  };

  const handleCategoryChange = (cat) => {
    playSynthTone(600, 0.03, "sine");
    setActiveCategory(cat);
  };

  const handleCommitClick = (idx) => {
    const clicks = [700, 750, 800];
    const pitch = clicks[idx % clicks.length];
    playSynthTone(pitch, 0.025, "sine");

    setExpandedCommits(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSkillLevelChange = (skillName, newLevel) => {
    setSkillsList(prev => prev.map(s => s.name === skillName ? { ...s, level: Number(newLevel) } : s));
  };

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

  const commitDiffs = {
    0: [
      { text: "- legacy_monolithic_structures", type: "minus" },
      { text: "- unoptimized_manual_workflows", type: "minus" },
      { text: "+ designed and compiled responsive client applications using React, flexible grids, and CSS variables.", type: "plus" },
      { text: "+ engineered lightweight automated scripts to facilitate git pushes and environment setup.", type: "plus" },
      { text: "+ integrated public APIs and designed custom client-side cache handlers using LocalStorage.", type: "plus" }
    ],
    1: [
      { text: "- high_school_status = \"IN_PROGRESS\"", type: "minus" },
      { text: "+ high_school_status = \"GRADUATED_CLASS_OF_2026\"", type: "plus" },
      { text: "+ successfully finished standard curriculum focusing on analytical sciences and computer logic.", type: "plus" },
      { text: "+ built standalone web projects as an extracurricular pursuit, mastering frontend design paradigms.", type: "plus" }
    ]
  };

  const renderGitDiff = (idx) => {
    const diffLines = commitDiffs[idx] || [];
    const hash = getCommitHash(idx);
    return (
      <div className="git-diff-container" onClick={(e) => e.stopPropagation()}>
        <div className="git-diff-header">
          <div>diff --git a/experience/{idx === 0 ? "web_labs" : "school_studies"}.log b/experience/{idx === 0 ? "web_labs" : "school_studies"}.log</div>
          <div>index {hash}..100644</div>
          <div>--- a/experience/{idx === 0 ? "web_labs" : "school_studies"}.log</div>
          <div>+++ b/experience/{idx === 0 ? "web_labs" : "school_studies"}.log</div>
        </div>
        <div className="git-diff-lines">
          {diffLines.map((line, lIdx) => (
            <div key={lIdx} className={`git-diff-line diff-${line.type}`}>
              {line.text}
            </div>
          ))}
        </div>
      </div>
    );
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
                loading="lazy"
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
          <div className="section-header-small" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={16} strokeWidth={2.5} />
              <span>Skills Fader Panel</span>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="skills-nav">
            {categories.map(cat => (
              <button
                key={cat}
                className={`skill-tab-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Synthesizer Sliders */}
          <div className="skills-list">
            {filteredSkills.map((skill, index) => {
              return (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>

                  {/* Synthesizer Audio Slider */}
                  <div className="synth-slider-container">
                    <div className="synth-slider-track">
                      <div
                        className={`synth-slider-fill ${getSkillColorClass(skill.category)}`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                      <div
                        className="synth-slider-knob"
                        style={{ left: `${skill.level}%` }}
                      ></div>

                      {/* Invisible native range fader overlaid on top for native drag logic */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => {
                          handleSkillLevelChange(skill.name, e.target.value);
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                          zIndex: 10
                        }}
                        aria-label={`${skill.name} level fader`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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
            const isExpanded = expandedCommits[index];
            return (
              <div key={index} className="git-commit-row">
                {/* Git Node Circle */}
                <div className="git-commit-node"></div>

                {/* Commit Content Box */}
                <div
                  className={`git-commit-card neo-card ${noteColorClass} clickable-commit-card ${isExpanded ? "commit-card-expanded" : ""}`}
                  onClick={() => handleCommitClick(index)}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                >
                  <div className="git-commit-header">
                    <div className="git-commit-hash-wrapper">
                      <span className="git-commit-hash">commit {hash}</span>
                      {index === 0 && <span className="git-commit-branch-tag">HEAD -{"\u003E"} local/main</span>}
                    </div>
                    <span className="git-commit-date-badge">{item.duration}</span>
                  </div>

                  <div className="git-commit-meta-details">
                    <span>Author: <span className="git-commit-author">Yashvardhan &lt;developer@yashvardhan.dev&gt;</span></span>
                    <span>Date: Wed 25 March 1:30:00 2026 +0530</span>
                  </div>

                  <h3 className="git-commit-title">{item.role}</h3>
                  <h4 className="git-commit-company">{item.company}</h4>

                  {isExpanded ? (
                    renderGitDiff(index)
                  ) : (
                    <div className="git-diff-collapsed-indicator" style={{ marginTop: "12px", borderTop: "1.5px dashed rgba(15, 23, 42, 0.1)", paddingTop: "8px" }}>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                        ⚡ click to inspect commit accomplishments (git diff) ...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
