import { useState, useEffect, useRef } from "react";
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

const getRarityInfo = (title) => {
  const lowercaseTitle = title.toLowerCase();
  if (lowercaseTitle.includes("seo with ai") || lowercaseTitle.includes("javascript intermediate")) {
    return { name: "LEGENDARY", color: "#fbbf24", class: "rarity-legendary" };
  }
  if (lowercaseTitle.includes("python developer") || lowercaseTitle.includes("coding for data")) {
    return { name: "EPIC", color: "#a855f7", class: "rarity-epic" };
  }
  if (lowercaseTitle.includes("sql") || lowercaseTitle.includes("python intermediate") || lowercaseTitle.includes("brainstorm")) {
    return { name: "RARE", color: "#3b82f6", class: "rarity-rare" };
  }
  return { name: "UNCOMMON", color: "#10b981", class: "rarity-uncommon" };
};

export default function Certificates() {
  const { certificates } = portfolioData;
  const [selectedCert, setSelectedCert] = useState(null);
  const [copied, setCopied]             = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [scanMode, setScanMode]         = useState(false);

  // Decryption loader animation state in modal
  const [decryptState, setDecryptState] = useState("idle"); // 'idle' | 'decrypting' | 'finished'
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [hexLogs, setHexLogs] = useState([]);

  const categories = ["All", ...Array.from(new Set(certificates.map((c) => c.category)))];

  const filtered =
    activeFilter === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeFilter);

  // Web Audio Synth tone synthesizer
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
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Fail silently
    }
  };

  const handleCardHover = () => {
    playSynthTone(1200, 0.015, "sine");
  };

  const triggerOpenChime = () => {
    playSynthTone(587.33, 0.05, "sine");
    setTimeout(() => playSynthTone(698.46, 0.05, "sine"), 50);
    setTimeout(() => playSynthTone(880.00, 0.12, "sine"), 100);
  };

  const triggerCopyChime = () => {
    playSynthTone(600, 0.05, "square");
    setTimeout(() => playSynthTone(900, 0.05, "square"), 60);
  };

  const triggerScanToggleSound = () => {
    playSynthTone(200, 0.08, "sawtooth");
    setTimeout(() => playSynthTone(100, 0.12, "sawtooth"), 80);
  };

  // 3D Card Hover Perspective Math
  const handleMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    const tiltX = -normY * 16;
    const tiltY = normX * 16;

    cardEl.style.setProperty("--tilt-x", `${tiltX}deg`);
    cardEl.style.setProperty("--tilt-y", `${tiltY}deg`);
    cardEl.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    cardEl.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;
    cardEl.style.setProperty("--tilt-x", "0deg");
    cardEl.style.setProperty("--tilt-y", "0deg");
    cardEl.style.setProperty("--mouse-x", "50%");
    cardEl.style.setProperty("--mouse-y", "50%");
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    triggerCopyChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const openCert = (cert) => {
    setSelectedCert(cert);
    setCopied(false);
    setDecryptState("decrypting");
    triggerOpenChime();
  };

  // Decryption Log ticker sequencer
  useEffect(() => {
    if (selectedCert && decryptState === "decrypting") {
      setDecryptProgress(0);
      setHexLogs(["CONNECTING TO VAULT...", "RETRIEVING ENCRYPTED KEY DATA..."]);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setDecryptProgress(progress);
        
        const randomHex = Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join("");
        setHexLogs(prev => [
          ...prev,
          `DECRYPT_BLOCK_[${randomHex}]: PARSING CERT_HASH_SEGMENT_${progress / 20}... [OK]`
        ]);

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setHexLogs(prev => [...prev, "VERIFICATION: SIGNATURE VERIFIED SUCCESSFULLY.", "OS PROTOCOL ACTIVE: RENDER COMPLETED."]);
            setTimeout(() => {
              setDecryptState("finished");
              playSynthTone(987.77, 0.08, "sine"); // B5
            }, 300);
          }, 200);
        }
      }, 140);

      return () => clearInterval(interval);
    }
  }, [selectedCert, decryptState]);

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
          onClick={() => { triggerScanToggleSound(); setScanMode(!scanMode); }}
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
          const rarity = getRarityInfo(cert.title);
          return (
            <div
              key={cert.id}
              className={`cert-trophy-card ${rarity.class}`}
              onClick={() => openCert(cert)}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e, e.currentTarget)}
              onMouseEnter={handleCardHover}
              style={{
                "--cert-accent": cs.accent,
                "--cert-bg": cs.bg,
                "--cert-tag": cs.tag,
                transform: "perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
                transition: "transform 0.1s ease, box-shadow 0.25s ease"
              }}
            >
              {/* Dynamic Holographic Shine Overlay */}
              <div className="cert-holo-overlay"></div>

              {/* Holographic top-edge strip */}
              <div className="cert-holo-strip"></div>

              {/* Card Badge Header Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Category label */}
                <div className="cert-category-pill" style={{ backgroundColor: cs.bg, color: cs.tag, borderColor: cs.tag }}>
                  {cert.category}
                </div>
                {/* Rarity Tier tag */}
                <div className="cert-rarity-badge" style={{ borderColor: rarity.color, color: rarity.color }}>
                  {rarity.name}
                </div>
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

              {decryptState !== "finished" ? (
                <div className="cert-decrypt-console" style={{ padding: "28px", fontFamily: "var(--font-mono)", color: "#10b981", background: "#090d16", minHeight: "360px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "0 0 8px 8px" }}>
                  <div className="decrypt-console-header" style={{ borderBottom: "1px dashed rgba(16, 185, 129, 0.3)", paddingBottom: "8px", marginBottom: "12px", display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <span>DECRYPTER_VAULT_OS v1.02</span>
                    <span className="console-blink-led" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <span className="led-indicator led-blink" style={{ backgroundColor: "#ef4444", width: "8px", height: "8px" }}></span>
                      ENCRYPTED_VAULT
                    </span>
                  </div>
                  <div className="decrypt-console-logs" style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.72rem", overflowY: "auto", maxHeight: "200px", textAlign: "left" }}>
                    {hexLogs.map((log, lIdx) => (
                      <div key={lIdx} className="decrypt-log-row" style={{ lineBreak: "anywhere" }}>
                        <span style={{ color: "#38bdf8" }}>&gt;&gt;</span> {log}
                      </div>
                    ))}
                  </div>
                  <div className="decrypt-console-footer" style={{ borderTop: "1px dashed rgba(16, 185, 129, 0.3)", paddingTop: "12px", marginTop: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginBottom: "6px" }}>
                      <span>DECRYPTION PROGRESS:</span>
                      <span>{decryptProgress}%</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${decryptProgress}%`, height: "100%", background: "#10b981", transition: "width 0.1s ease" }}></div>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
