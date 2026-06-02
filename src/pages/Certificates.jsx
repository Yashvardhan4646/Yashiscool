import { useState } from "react";
import { portfolioData } from "../data/portfolioData";

// Inline SVG icons to avoid lucide export issues
const IconAward = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"></circle>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"></path>
  </svg>
);

const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// Per-category accent colors
const CATEGORY_COLORS = {
  "Artificial Intelligence": { bg: "var(--pastel-purple)", accent: "var(--accent-purple)", tag: "#7c3aed" },
  "Databases":               { bg: "var(--pastel-sky)",    accent: "var(--accent-blue)",   tag: "#2563eb" },
  "Software Engineering":    { bg: "var(--pastel-mint)",   accent: "var(--accent-green)",  tag: "#16a34a" },
  "Data Science":            { bg: "var(--pastel-peach)",  accent: "var(--accent-yellow)", tag: "#d97706" },
  "Languages":               { bg: "var(--pastel-rose)",   accent: "var(--accent-rose)",   tag: "#e11d48" },
};

const getCatStyle = (cat) =>
  CATEGORY_COLORS[cat] || { bg: "var(--pastel-yellow)", accent: "var(--accent-yellow)", tag: "#d97706" };

export default function Certificates() {
  const { certificates } = portfolioData;
  const [selectedCert, setSelectedCert] = useState(null);
  const [copied, setCopied]             = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [scanMode, setScanMode]         = useState(false);

  const categories = ["All", ...Array.from(new Set(certificates.map((c) => c.category)))];

  const filtered =
    activeFilter === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeFilter);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openCert = (cert) => {
    setSelectedCert(cert);
    setCopied(false);
  };

  return (
    <div className="page-fade-in cert-page">

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="cert-page-header">
        <div className="cert-header-left">
          <div className="cert-page-icon-wrap">
            <IconShield />
          </div>
          <div>
            <h1 className="section-title" style={{ marginBottom: "4px" }}>Achievement Vault</h1>
            <p className="cert-page-subtitle">
              8 cryptographically verified credentials · Issued by SoloLearn
            </p>
          </div>
        </div>

        {/* Scan Mode Toggle */}
        <button
          className={`cert-scan-toggle ${scanMode ? "active" : ""}`}
          onClick={() => setScanMode(!scanMode)}
          title="Toggle scan mode to preview certificate images"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span>{scanMode ? "SCAN: ON" : "SCAN: OFF"}</span>
        </button>
      </div>

      {/* ── Stats Banner ─────────────────────────────────────── */}
      <div className="cert-stats-banner">
        <div className="cert-stat-pill">
          <span className="cert-stat-num">8</span>
          <span className="cert-stat-label">Total Credentials</span>
        </div>
        <div className="cert-stat-divider">·</div>
        <div className="cert-stat-pill">
          <span className="cert-stat-num">5</span>
          <span className="cert-stat-label">Subject Areas</span>
        </div>
        <div className="cert-stat-divider">·</div>
        <div className="cert-stat-pill">
          <span className="cert-stat-num">2026</span>
          <span className="cert-stat-label">Completion Year</span>
        </div>
        <div className="cert-stat-divider">·</div>
        <div className="cert-stat-pill">
          <span className="cert-stat-num" style={{ color: "#10b981" }}>✔</span>
          <span className="cert-stat-label">All Verified Live</span>
        </div>
      </div>

      {/* ── Category Filter Rail ──────────────────────────────── */}
      <div className="cert-filter-rail">
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          const cs = getCatStyle(cat);
          return (
            <button
              key={cat}
              className={`cert-filter-chip ${isActive ? "active" : ""}`}
              style={isActive ? { backgroundColor: cs.bg, borderColor: cs.tag, color: cs.tag } : {}}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Certificate Cards Grid ───────────────────────────── */}
      <div className="cert-cards-grid">
        {filtered.map((cert, idx) => {
          const cs = getCatStyle(cert.category);
          return (
            <div
              key={cert.id}
              className="cert-trophy-card"
              onClick={() => openCert(cert)}
              style={{ "--cert-accent": cs.accent, "--cert-bg": cs.bg, "--cert-tag": cs.tag }}
            >
              {/* Holographic top-edge strip */}
              <div className="cert-holo-strip"></div>

              {/* Category label */}
              <div className="cert-category-pill" style={{ backgroundColor: cs.bg, color: cs.tag, borderColor: cs.tag }}>
                {cert.category}
              </div>

              {/* Medal icon */}
              <div className="cert-medal-icon" style={{ backgroundColor: cs.bg, color: cs.tag }}>
                <IconAward />
                <span className="cert-medal-number">#{String(idx + 1).padStart(2, "0")}</span>
              </div>

              {/* Scan mode: show image thumbnail */}
              {scanMode && cert.imageUrl && (
                <div className="cert-scan-preview">
                  <img src={cert.imageUrl} alt={cert.title} />
                </div>
              )}

              {/* Title & meta */}
              <h3 className="cert-trophy-title">{cert.title}</h3>
              <p className="cert-trophy-meta">{cert.issuer} · {cert.date}</p>

              {/* Skill tags — up to 3 */}
              <div className="cert-trophy-skills">
                {cert.skillsValidated.slice(0, 3).map((s, i) => (
                  <span key={i} className="cert-skill-tag">{s}</span>
                ))}
                {cert.skillsValidated.length > 3 && (
                  <span className="cert-skill-tag cert-skill-more">+{cert.skillsValidated.length - 3}</span>
                )}
              </div>

              {/* Card footer */}
              <div className="cert-trophy-footer">
                <code className="cert-id-mono">{cert.credentialId}</code>
                <span className="cert-inspect-cta">Inspect ›</span>
              </div>

              {/* Corner glow */}
              <div className="cert-corner-glow" style={{ background: cs.accent }}></div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Modal ─────────────────────────────────────── */}
      {selectedCert && (() => {
        const cs = getCatStyle(selectedCert.category);
        return (
          <div className="cert-modal-overlay" onClick={() => setSelectedCert(null)}>
            <div className="cert-modal-box" onClick={(e) => e.stopPropagation()}>

              {/* Modal header bar */}
              <div className="cert-modal-topbar" style={{ backgroundColor: cs.tag }}>
                <div className="cert-modal-topbar-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="cert-modal-topbar-title">certificate_viewer.exe — {selectedCert.credentialId}</span>
                <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>
                  <IconX />
                </button>
              </div>

              <div className="cert-modal-inner">
                {/* Left: big certificate image */}
                <div className="cert-modal-img-pane" style={{ backgroundColor: cs.bg }}>
                  {selectedCert.imageUrl ? (
                    <img
                      src={selectedCert.imageUrl}
                      alt={selectedCert.title}
                      className="cert-modal-img"
                    />
                  ) : (
                    <div className="cert-modal-img-fallback" style={{ color: cs.tag }}>
                      <IconShield />
                      <span>No Image Available</span>
                    </div>
                  )}

                  {/* Verification seal */}
                  <div className="cert-modal-seal" style={{ borderColor: cs.tag, color: cs.tag }}>
                    <span>✔ VERIFIED</span>
                  </div>
                </div>

                {/* Right: metadata panel */}
                <div className="cert-modal-meta-pane">
                  {/* Category badge */}
                  <span className="cert-modal-cat-badge" style={{ backgroundColor: cs.bg, color: cs.tag, borderColor: cs.tag }}>
                    {selectedCert.category}
                  </span>

                  <h2 className="cert-modal-course-title">{selectedCert.title}</h2>
                  <p className="cert-modal-issuer">Accredited by <strong>{selectedCert.issuer}</strong> · {selectedCert.date}</p>

                  {/* Credential ID block */}
                  <div className="cert-modal-section">
                    <p className="cert-modal-section-label">CREDENTIAL ID</p>
                    <div className="cert-modal-id-row">
                      <code className="cert-modal-id-code">{selectedCert.credentialId}</code>
                      <button
                        className="cert-modal-copy-btn"
                        onClick={() => handleCopy(selectedCert.credentialId)}
                        title="Copy to clipboard"
                      >
                        <IconCopy />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Skills block */}
                  <div className="cert-modal-section">
                    <p className="cert-modal-section-label">VALIDATED SKILLS</p>
                    <div className="cert-modal-skills-wrap">
                      {selectedCert.skillsValidated.map((s, i) => (
                        <span key={i} className="cert-modal-skill-chip" style={{ backgroundColor: cs.bg, borderColor: cs.tag, color: cs.tag }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA button */}
                  <a
                    href={selectedCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-modal-verify-btn"
                    style={{ backgroundColor: cs.tag }}
                  >
                    <span>Verify Live Credential</span>
                    <IconExternalLink />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
