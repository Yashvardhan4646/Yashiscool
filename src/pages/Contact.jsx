import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Send, CheckCircle2, ShieldAlert, Clock, Terminal } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

// ─── EmailJS credentials from Vite environment variables ──────────────────────
// Add these to a .env file at the project root:
//   VITE_EMAILJS_SERVICE_ID=your_service_id
//   VITE_EMAILJS_TEMPLATE_ID=your_template_id
//   VITE_EMAILJS_PUBLIC_KEY=your_public_key
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const IS_DEMO_MODE = !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const { email, github, linkedin, instagram } = portfolioData.personalInfo.socials;

  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [priority, setPriority]   = useState("medium");
  const [status, setStatus]       = useState("idle");
  const [logs, setLogs]           = useState([]);
  const [copied, setCopied]       = useState(false);
  const [localTime, setLocalTime] = useState("");

  // Animation states
  const [isStamping, setIsStamping] = useState(false);
  const [postcardState, setPostcardState] = useState("idle"); // idle | stamping | flying | gone
  const [animationStage, setAnimationStage] = useState("idle"); // "idle" | "packing" | "closing" | "stamping" | "flying" | "completed"

  const postcardRef = useRef(null);

  // Live ticking IST clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLocalTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        }).format(now)
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (text, delay) =>
    new Promise((resolve) => setTimeout(() => { setLogs(prev => [...prev, text]); resolve(); }, delay));

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email.replace("mailto:", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playStampSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "stamp") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "whoosh") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // Ignore autoplay block
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setStatus("error"); return; }

    // Start background EmailJS transmission immediately to save time
    setStatus("sending");
    setLogs([]);
    setAnimationStage("packing");

    const emailPromise = (async () => {
      await addLog("Initializing secure buffer transfer sequence...", 200);
      await addLog("Resolving route gateway to Yashvardhan's portal...", 250);
      await addLog(`Packing payload: [Name: ${form.name.slice(0, 16)}] [Priority: ${priority.toUpperCase()}]`, 250);
      await addLog("Converting text stream to compressed binary arrays...", 200);
      await addLog("Initiating SSL handshake with smtp.yashvardhan.dev...", 200);

      if (IS_DEMO_MODE) {
        await addLog("[WARN] EmailJS credentials not configured — running in DEMO MODE", 100);
      }

      await addLog(`Transmitting packet data (${form.message.length * 2} bytes)...`, 250);

      if (!IS_DEMO_MODE) {
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              user_name:  form.name,
              user_email: form.email,
              subject:    form.subject || `[${priority.toUpperCase()}] Message from ${form.name}`,
              message:    form.message,
              reply_to:   form.email,
            },
            EMAILJS_PUBLIC_KEY
          );
        } catch (err) {
          await addLog(`[ERROR] Transmission failed: ${err?.text || "Network error"}`, 200);
          throw err;
        }
      }

      await addLog("Waiting for remote node acknowledgement...", 250);
      await addLog("Transmission successful! Status: 250 OK (Queued for Delivery)", 250);
    })();

    // Animation timeline control
    // Stage 1: Packing (card slides into envelope)
    await new Promise(r => setTimeout(r, 1500));

    // Stage 2: Closing (flap folds down)
    setAnimationStage("closing");
    await new Promise(r => setTimeout(r, 900));

    // Stage 3: Stamping (stamp slams down, screen shakes)
    setAnimationStage("stamping");
    playStampSound("stamp");
    await new Promise(r => setTimeout(r, 1000));

    // Stage 4: Flying (envelope flies away)
    setAnimationStage("flying");
    playStampSound("whoosh");
    await new Promise(r => setTimeout(r, 1300));

    // Wait for the EmailJS request to complete
    try {
      await emailPromise;
      playStampSound("success");
      setStatus("success");
    } catch (err) {
      setStatus("error-send");
    }

    setAnimationStage("completed");
  };

  const handleReset = () => {
    setStatus("idle");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLogs([]);
    setAnimationStage("idle");
  };

  // Postcard class builder
  const postcardClass = [
    "tactile-postcard",
    postcardState === "stamping" ? "postcard-stamping" : "",
    postcardState === "flying"   ? "postcard-flying"   : "",
    postcardState === "gone"     ? "postcard-gone"     : "",
  ].filter(Boolean).join(" ");

  // Postmark seal class
  const sealClass = [
    "postcard-postmark-seal",
    isStamping ? "seal-slamming" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="page-fade-in contact-page">
      <div className="section-title-container">
        <Mail className="section-title-icon" size={28} strokeWidth={2.5} />
        <h1 className="section-title">Contact Hub</h1>
      </div>

      <p className="section-intro" style={{ marginBottom: "1rem" }}>
        Initialize a secure packet transmission to my terminal or use any of the direct node channels listed below to start a conversation.
      </p>

      <div className="grid-2-col">
        {/* ── Left Column: Form ─────────────────────────────────────────── */}
        <div className="neo-card card-rose" style={{ padding: 0, overflow: "hidden" }}>
          <div className="console-window-header">
            <div className="console-dots">
              <span className="console-dot dot-red"></span>
              <span className="console-dot dot-yellow"></span>
              <span className="console-dot dot-green"></span>
            </div>
            <span className="console-title">SECURE_COMMUNICATION_PROTOCOL.SH</span>
            <div style={{ width: 42 }}></div>
          </div>

          <div className="contact-form-panel">
            {status === "success" ? (
              <div className="success-screen">
                <CheckCircle2 size={54} className="success-icon" strokeWidth={2.5} />
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem" }}>
                  PACKET DISPATCHED
                </h3>
                <p style={{ maxWidth: "400px", fontSize: "0.95rem" }}>
                  Your message has been converted to a packet and pushed to the queue.
                  Yashvardhan will receive this payload shortly.
                </p>
                <button className="btn btn-secondary neo-btn" onClick={handleReset} style={{ marginTop: "12px" }}>
                  Create New Packet
                </button>
              </div>
            ) : status === "error-send" ? (
              <div className="success-screen">
                <ShieldAlert size={54} style={{ color: "#ef4444" }} strokeWidth={2.5} />
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem" }}>
                  TRANSMISSION FAILED
                </h3>
                <p style={{ maxWidth: "400px", fontSize: "0.95rem" }}>
                  Could not reach the mail node. Please try again or use the direct email link.
                </p>
                <button className="btn btn-secondary neo-btn" onClick={handleReset} style={{ marginTop: "12px" }}>
                  Try Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {IS_DEMO_MODE && (
                  <div className="demo-mode-banner">
                    <span>⚡ DEMO MODE — Add EmailJS credentials to .env to enable real sending</span>
                  </div>
                )}

                <div className="priority-selector-container">
                  <span className="priority-label">SELECT PACKET PRIORITY</span>
                  <div className="priority-grid">
                    {["low", "medium", "high"].map(p => (
                      <button
                        key={p}
                        type="button"
                        className={`priority-btn priority-${p} ${priority === p ? "active" : ""}`}
                        onClick={() => setPriority(p)}
                      >
                        {p === "low" ? "🟢 LOW" : p === "medium" ? "🟡 MEDIUM" : "🔴 CRITICAL"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="name" className="priority-label">SENDER IDENTIFICATION (NAME)</label>
                  <input
                    id="name" type="text"
                    className="form-input neo-input input-focus-rose"
                    placeholder="e.g. Yashvardhan"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    disabled={status === "sending"} required
                  />
                </div>

                <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="email" className="priority-label">RETURN PROTOCOL ADDRESS (EMAIL)</label>
                  <input
                    id="email" type="email"
                    className="form-input neo-input input-focus-blue"
                    placeholder="e.g. yash@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    disabled={status === "sending"} required
                  />
                </div>

                <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="subject" className="priority-label">OBJECTIVE SUBJECT (OPTIONAL)</label>
                  <input
                    id="subject" type="text"
                    className="form-input neo-input input-focus-rose"
                    placeholder="e.g. Collaboration on a project"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    disabled={status === "sending"}
                  />
                </div>

                <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="message" className="priority-label">MESSAGE PAYLOAD DATA STREAM</label>
                  <textarea
                    id="message"
                    className="form-input neo-input input-focus-green text-area"
                    rows="5" placeholder="Type your message payload..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    disabled={status === "sending"} required
                    style={{ resize: "vertical" }}
                  />
                </div>

                {status === "error" && (
                  <div className="form-error">
                    <ShieldAlert size={16} strokeWidth={2.5} />
                    <span>Error: Complete all parameters before dispatch.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary submit-btn neo-btn"
                  disabled={status === "sending"}
                  style={{ alignSelf: "flex-start", marginTop: "4px" }}
                >
                  <span>{status === "sending" ? "Transmitting..." : "Transmit Packet"}</span>
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Right Column: Telemetry ───────────────────────────────────── */}
        <div className="contact-telemetry-panel" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* ── Logs panel: shown while sending or after logs loaded ─────── */}
          {(status === "sending" || logs.length > 0) && status !== "success" ? (
            <div className="logs-panel neo-card" style={{ padding: 0, overflow: "hidden", backgroundColor: "var(--text-primary)" }}>
              <div className="console-window-header" style={{ borderBottom: "1.5px solid rgba(255,255,255,0.1)" }}>
                <div className="console-dots">
                  <span className="console-dot dot-red"></span>
                  <span className="console-dot dot-yellow"></span>
                  <span className="console-dot dot-green"></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Terminal size={14} className="accent-color-green" />
                  <span className="console-title" style={{ color: "#10b981" }}>TRANSMISSION_TELEMETRY.LOG</span>
                </div>
                <div style={{ width: 42 }}></div>
              </div>
              <div className="logs-dual-pane">
                <div className="log-console-body neo-log-body">
                  {logs.map((log, i) => (
                    <div key={i} className="log-line">
                      <span className="log-symbol">&gt;</span> {log}
                    </div>
                  ))}
                  {status === "sending" && <div className="log-line blinking-cursor">_</div>}
                </div>
                <div className="transmission-circuit-visualizer">
                  <svg viewBox="0 0 200 160" width="100%" height="100%" className="circuit-svg">
                    <defs>
                      <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <rect x="15" y="60" width="34" height="40" fill="#1f2937" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                    <rect x="22" y="65" width="20" height="20" fill="#374151" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="32" y="78" fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TX</text>
                    <circle cx="32" cy="92" r="2.5" fill="#ef4444" className="pulse-slow" />
                    <rect x="151" y="60" width="34" height="40" fill="#1f2937" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                    <rect x="158" y="65" width="20" height="20" fill="#374151" stroke="#10b981" strokeWidth="1.5" />
                    <text x="168" y="78" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RX</text>
                    <circle cx="168" cy="92" r="2.5" fill="#10b981" className="pulse-slow" />
                    <path className="circuit-wire" d="M 49 70 L 80 70 L 100 40 L 120 70 L 151 70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
                    <path className="circuit-wire" d="M 49 90 L 80 90 L 100 120 L 120 90 L 151 90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
                    <path className="circuit-pulse pulse-upper" d="M 49 70 L 80 70 L 100 40 L 120 70 L 151 70" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" filter="url(#circuit-glow)" />
                    <path className="circuit-pulse pulse-lower" d="M 49 90 L 80 90 L 100 120 L 120 90 L 151 90" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" filter="url(#circuit-glow)" />
                    <circle cx="80" cy="70" r="3" fill="#111827" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <circle cx="100" cy="40" r="3" fill="#111827" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <circle cx="120" cy="70" r="3" fill="#111827" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <circle cx="80" cy="90" r="3" fill="#111827" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <circle cx="100" cy="120" r="3" fill="#111827" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <circle cx="120" cy="90" r="3" fill="#111827" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Status Board */}
              <div className="status-board-widget neo-card card-mint">
                <div className="status-board-layout">
                  <div className="status-board-info">
                    <div className="status-board-header">
                      <span className="availability-indicator">
                        <span className="status-pulse-dot"></span>
                        NODE STATUS: ONLINE
                      </span>
                      <span className="availability-indicator" style={{ color: "var(--accent-green)" }}>
                        ACCEPTING PROJECTS
                      </span>
                    </div>
                    <div className="clock-display">
                      <span className="clock-label">
                        <Clock size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                        LOCAL TIME (IST)
                      </span>
                      <span>{localTime || "12:00:00"}</span>
                    </div>
                  </div>
                  <div className="status-board-radar">
                    <svg className="radar-grid-svg" width="80" height="80" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
                      <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
                      <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
                      <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
                      <path className="radar-sweep-tail" d="M50 50 L50 6 A44 44 0 0 0 18.9 18.9 Z" fill="rgba(16,185,129,0.15)" stroke="none" />
                      <line className="radar-sweeper" x1="50" y1="50" x2="50" y2="6" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" />
                      <circle className="radar-target target-1" cx="30" cy="25" r="3.5" fill="var(--accent-green)" />
                      <circle className="radar-target target-2" cx="75" cy="40" r="4" fill="var(--accent-green)" />
                      <circle className="radar-target target-3" cx="60" cy="75" r="3" fill="var(--accent-green)" />
                      <circle cx="50" cy="50" r="4" fill="var(--accent-green)" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ── Animated Postcard ──────────────────────────────────────── */}
              <div className={postcardClass} ref={postcardRef}>
                <div className="postcard-divider-line"></div>
                <div className="postcard-stamp-wrapper" onClick={handleCopyEmail}>
                  <div className="postage-stamp" title="Copy Email Address">
                    <div className="postage-stamp-wavy">
                      <Mail size={22} className="accent-color-rose" strokeWidth={2.5} />
                    </div>
                  </div>
                  {/* Postmark seal — slams down on submit */}
                  <svg className={sealClass} viewBox="0 0 100 100" width="70" height="70">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(225,29,72,0.55)" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(225,29,72,0.4)" strokeWidth="1" />
                    <path d="M5 42 Q 25 35, 50 42 T 95 42" fill="none" stroke="rgba(225,29,72,0.55)" strokeWidth="1.2" />
                    <path d="M5 50 Q 25 43, 50 50 T 95 50" fill="none" stroke="rgba(225,29,72,0.55)" strokeWidth="1.2" />
                    <path d="M5 58 Q 25 51, 50 58 T 95 58" fill="none" stroke="rgba(225,29,72,0.55)" strokeWidth="1.2" />
                    <text x="50" y="27" fill="rgba(225,29,72,0.65)" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="1">DELHI</text>
                    <text x="50" y="80" fill="rgba(225,29,72,0.65)" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="1">IST ZONE</text>
                  </svg>
                </div>

                <div className="postcard-content">
                  <p className="priority-label" style={{ fontSize: "0.68rem", marginBottom: "2px" }}>FROM</p>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--text-primary)", fontSize: "1.1rem" }}>Yashvardhan</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    Web Developer &amp; Creative Coder. Designing standard-based modern interactive workspaces.
                  </p>
                </div>

                <div className="postcard-address">
                  <div className="postcard-line">TO: PRIMARY MAIL NODE</div>
                  <div className="coord-value-row neo-coord-row">
                    <a href={email} className="coord-link" title={email.replace("mailto:", "")}>
                      {email.replace("mailto:", "")}
                    </a>
                    <button className="copy-btn" onClick={handleCopyEmail} title="Copy Email" aria-label="Copy email">
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Postcard flying envelope SVG overlay — appears during flight */}
                {postcardState === "flying" && (
                  <div className="postcard-envelope-fly">
                    <svg viewBox="0 0 120 80" width="120" height="80" className="envelope-svg">
                      <rect x="2" y="2" width="116" height="76" rx="3" fill="#fef3c7" stroke="#0f172a" strokeWidth="2.5" />
                      <polyline points="2,2 60,48 118,2" fill="none" stroke="#0f172a" strokeWidth="2" />
                      <polyline points="2,78 40,44" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                      <polyline points="118,78 80,44" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="88" y="6" width="22" height="16" fill="#fecdd3" stroke="#0f172a" strokeWidth="1.5" />
                      <text x="99" y="17" fill="#be123c" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">✉</text>
                    </svg>
                  </div>
                )}
              </div>

              {/* Social Cartridges */}
              <div className="cartridges-container neo-card card-sky">
                <div className="section-header-small" style={{ marginBottom: "14px" }}>
                  <Send size={14} strokeWidth={2.5} />
                  <span>Interactive Node Channels</span>
                </div>

                <div className="cartridges-grid">
                  {[
                    { href: github,    label: "GITHUB",    serial: "CODE_REPO_V1", statusClass: "glow-rose", dotClass: "rose", statusText: "ONLINE",  iconColor: "var(--text-primary)",
                      icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg> },
                    { href: linkedin,  label: "LINKEDIN",  serial: "SECURE_LINK",  statusClass: "glow-blue", dotClass: "blue", statusText: "ONLINE",  iconColor: "var(--accent-blue)",
                      icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg> },
                    { href: instagram, label: "INSTAGRAM", serial: "LIV_FEED_44",  statusClass: "glow-green",dotClass: "green",statusText: "ACTIVE",  iconColor: "var(--accent-green)",
                      icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg> },
                  ].map(({ href, label, serial, statusClass, dotClass, statusText, iconColor, icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="social-cartridge-link">
                      <div className="social-cartridge">
                        <div className="cartridge-label-box">
                          <div className="cartridge-icon-wrapper" style={{ color: iconColor }}>{icon}</div>
                          <span className="cartridge-title">{label}</span>
                        </div>
                        <div className="cartridge-details">
                          <span className="cartridge-serial">{serial}</span>
                          <span className={`cartridge-status ${statusClass}`}>
                            <span className={`status-dot-small ${dotClass}`}></span>
                            {statusText}
                          </span>
                        </div>
                        <div className="cartridge-connector-pins">
                          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="pin"></div>)}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Postmail Dispatch Animation Modal ───────────────────────── */}
      {animationStage !== "idle" && animationStage !== "completed" && (
        <div className="postmail-modal-backdrop">
          <div className="postmail-modal-content">
            
            <div className="postmail-status-ticker">
              {animationStage === "packing" && "🔒 PACKING SECURE PAYLOAD..."}
              {animationStage === "closing" && "📬 SEALING PACKET..."}
              {animationStage === "stamping" && "✍️ STAMPING CREDENTIALS..."}
              {animationStage === "flying" && "🚀 DISPATCHING BUFFER..."}
            </div>

            <div className={`envelope-wrapper ${animationStage === "stamping" ? "shake-effect" : ""} ${animationStage === "flying" ? "flight-effect" : ""}`}>
              
              {/* Envelope Back/Inside pocket */}
              <div className="envelope-pocket"></div>

              {/* Message card that slides inside */}
              <div className={`envelope-message-card ${animationStage !== "packing" ? "packed" : ""}`}>
                <div className="card-header-label">MESSAGE PAYLOAD // TX</div>
                <div className="card-meta-line"><strong>FROM:</strong> {form.name}</div>
                <div className="card-meta-line"><strong>EMAIL:</strong> {form.email}</div>
                {form.subject && <div className="card-meta-line"><strong>SUBJ:</strong> {form.subject}</div>}
                <div className="card-payload-text">{form.message}</div>
              </div>

              {/* Front flaps overlay */}
              <div className="envelope-front">
                <svg viewBox="0 0 340 220" className="envelope-front-svg">
                  {/* Bottom flap */}
                  <path d="M 0,220 L 170,110 L 340,220 Z" fill="#f5e6c4" stroke="#0f172a" strokeWidth="2.5" />
                  {/* Left flap */}
                  <path d="M 0,0 L 170,110 L 0,220 Z" fill="#faeed1" stroke="#0f172a" strokeWidth="2" />
                  {/* Right flap */}
                  <path d="M 340,0 L 170,110 L 340,220 Z" fill="#faeed1" stroke="#0f172a" strokeWidth="2" />
                </svg>
              </div>

              {/* Top fold-down flap */}
              <div className={`envelope-flap ${animationStage !== "packing" ? "closed" : ""}`}>
                <svg viewBox="0 0 340 110" className="envelope-flap-svg">
                  <polygon points="0,0 170,110 340,0" fill="#f5e6c4" stroke="#0f172a" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Postage Stamp spot */}
              <div className="envelope-stamp-spot">
                <span>✉</span>
              </div>

              {/* Stamped postmark overlay */}
              <div className={`envelope-postmark-mark ${animationStage === "stamping" || animationStage === "flying" ? "stamped" : ""}`}>
                <svg viewBox="0 0 100 100" className="stamp-mark-svg">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(225,29,72,0.75)" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(225,29,72,0.5)" strokeWidth="1" />
                  <path d="M5 42 Q 25 35, 50 42 T 95 42" fill="none" stroke="rgba(225,29,72,0.75)" strokeWidth="1.2" />
                  <path d="M5 50 Q 25 43, 50 50 T 95 50" fill="none" stroke="rgba(225,29,72,0.75)" strokeWidth="1.2" />
                  <path d="M5 58 Q 25 51, 50 58 T 95 58" fill="none" stroke="rgba(225,29,72,0.75)" strokeWidth="1.2" />
                  <text x="50" y="27" fill="rgba(225,29,72,0.8)" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="1">DELHI</text>
                  <text x="50" y="80" fill="rgba(225,29,72,0.8)" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="1">IST ZONE</text>
                </svg>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
