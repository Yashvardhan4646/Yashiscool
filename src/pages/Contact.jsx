import { useState, useEffect } from "react";
import { Mail, Send, CheckCircle2, ShieldAlert, Copy, Clock, Terminal } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function Contact() {
  const { email, github, linkedin, instagram } = portfolioData.personalInfo.socials;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState("");

  // Live ticking IST clock for Yashvardhan's local time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      setLocalTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (text, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setLogs(prev => [...prev, text]);
        resolve();
      }, delay);
    });
  };

  const handleCopyEmail = () => {
    const plainEmail = email.replace("mailto:", "");
    navigator.clipboard.writeText(plainEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    setLogs([]);

    await addLog("Initializing secure buffer transfer sequence...", 250);
    await addLog("Resolving route gateway to Yashvardhan's portal...", 300);
    await addLog(`Packing payload: [Name: ${form.name.slice(0, 16)}] [Priority: ${priority.toUpperCase()}]`, 350);
    await addLog("Converting text stream variables to compressed binary arrays...", 400);
    await addLog("Initiating SSL handshake with smtp.yashvardhan.dev...", 350);
    await addLog(`Transmitting packet data (${form.message.length * 2} bytes)...`, 400);
    await addLog("Waiting for remote node acknowledgement...", 450);
    await addLog("Transmission successful! Status: 250 OK (Queued for Delivery)", 500);

    setStatus("success");
  };

  return (
    <div className="page-fade-in contact-page">
      <div className="section-title-container">
        <Mail className="section-title-icon" size={28} strokeWidth={2.5} />
        <h1 className="section-title">Contact Hub</h1>
      </div>

      <p className="section-intro" style={{ marginBottom: '1rem' }}>
        Initialize a secure packet transmission to my terminal or use any of the direct node channels listed below to start a conversation.
      </p>

      <div className="grid-2-col">
        {/* Left Column: Interactive Command Terminal / Form */}
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
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem" }}>PACKET DISPATCHED</h3>
                <p style={{ maxWidth: "400px", fontSize: "0.95rem" }}>
                  Your message has been converted to a packet and pushed to the queue. Yashvardhan will receive this payload shortly.
                </p>
                <button
                  className="btn btn-secondary neo-btn"
                  onClick={() => {
                    setStatus("idle");
                    setForm({ name: "", email: "", message: "" });
                    setLogs([]);
                  }}
                  style={{ marginTop: "12px" }}
                >
                  Create New Packet
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="priority-selector-container">
                  <span className="priority-label">SELECT PACKET PRIORITY</span>
                  <div className="priority-grid">
                    <button
                      type="button"
                      className={`priority-btn priority-low ${priority === "low" ? "active" : ""}`}
                      onClick={() => setPriority("low")}
                    >
                      🟢 LOW
                    </button>
                    <button
                      type="button"
                      className={`priority-btn priority-medium ${priority === "medium" ? "active" : ""}`}
                      onClick={() => setPriority("medium")}
                    >
                      🟡 MEDIUM
                    </button>
                    <button
                      type="button"
                      className={`priority-btn priority-high ${priority === "high" ? "active" : ""}`}
                      onClick={() => setPriority("high")}
                    >
                      🔴 CRITICAL
                    </button>
                  </div>
                </div>

                <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="name" className="priority-label">SENDER IDENTIFICATION (NAME)</label>
                  <input
                    id="name"
                    type="text"
                    className="form-input neo-input input-focus-rose"
                    placeholder="e.g. Yashvardhan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={status === "sending"}
                    required
                  />
                </div>

                <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="email" className="priority-label">RETURN PROTOCOL ADDRESS (EMAIL)</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input neo-input input-focus-blue"
                    placeholder="e.g. yash@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={status === "sending"}
                    required
                  />
                </div>

                <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label htmlFor="message" className="priority-label">MESSAGE PAYLOAD DATA STREAM</label>
                  <textarea
                    id="message"
                    className="form-input neo-input input-focus-green text-area"
                    rows="5"
                    placeholder="Type your message payload..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    disabled={status === "sending"}
                    required
                    style={{ resize: "vertical" }}
                  ></textarea>
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
                  <span>Transmit Packet</span>
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Status Board, Postcard and Social Cartridges */}
        <div className="contact-telemetry-panel" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {status === "sending" || logs.length > 0 ? (
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
              <div className="log-console-body neo-log-body">
                {logs.map((log, index) => (
                  <div key={index} className="log-line">
                    <span className="log-symbol">&gt;</span> {log}
                  </div>
                ))}
                {status === "sending" && <div className="log-line blinking-cursor">_</div>}
              </div>
            </div>
          ) : (
            <>
              {/* Status Board Card */}
              <div className="status-board-widget neo-card card-mint">
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

              {/* Dotted Postcard Card */}
              <div className="tactile-postcard">
                <div className="postcard-divider-line"></div>
                <div className="postcard-stamp-wrapper" onClick={handleCopyEmail}>
                  <div className="postage-stamp" title="Copy Email Address">
                    <div className="postage-stamp-wavy">
                      <Mail size={22} className="accent-color-rose" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="postcard-content">
                  <p className="priority-label" style={{ fontSize: "0.68rem", marginBottom: "2px" }}>FROM</p>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--text-primary)", fontSize: "1.1rem" }}>Yashvardhan</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    Web Developer & Creative Coder. Designing standard-based modern interactive workspaces.
                  </p>
                </div>

                <div className="postcard-address">
                  <div className="postcard-line">TO: PRIMARY MAIL NODE</div>
                  <div className="coord-value-row neo-coord-row">
                    <a href={email} className="coord-link" title={email.replace("mailto:", "")}>
                      {email.replace("mailto:", "")}
                    </a>
                    <button
                      className="copy-btn"
                      onClick={handleCopyEmail}
                      title="Copy Email"
                      aria-label="Copy email"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Game Cartridges Social List */}
              <div className="cartridges-container neo-card card-sky">
                <div className="section-header-small" style={{ marginBottom: "14px" }}>
                  <Send size={14} strokeWidth={2.5} />
                  <span>Interactive Node Channels</span>
                </div>

                <div className="cartridges-grid">
                  <a href={github} target="_blank" rel="noopener noreferrer" className="social-cartridge-link">
                    <div className="social-cartridge">
                      <div className="cartridge-label-box">
                        <div className="cartridge-icon-wrapper" style={{ color: "var(--text-primary)" }}>
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                          </svg>
                        </div>
                        <span className="cartridge-title">GITHUB</span>
                      </div>
                      <div className="cartridge-details">
                        <span className="cartridge-serial">CODE_REPO_V1</span>
                        <span className="cartridge-status glow-rose">
                          <span className="status-dot-small rose"></span>
                          ONLINE
                        </span>
                      </div>
                    </div>
                  </a>

                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-cartridge-link">
                    <div className="social-cartridge">
                      <div className="cartridge-label-box">
                        <div className="cartridge-icon-wrapper" style={{ color: "var(--accent-blue)" }}>
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </div>
                        <span className="cartridge-title">LINKEDIN</span>
                      </div>
                      <div className="cartridge-details">
                        <span className="cartridge-serial">SECURE_LINK</span>
                        <span className="cartridge-status glow-blue">
                          <span className="status-dot-small blue"></span>
                          ONLINE
                        </span>
                      </div>
                    </div>
                  </a>

                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="social-cartridge-link">
                    <div className="social-cartridge">
                      <div className="cartridge-label-box">
                        <div className="cartridge-icon-wrapper" style={{ color: "var(--accent-green)" }}>
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                        </div>
                        <span className="cartridge-title">INSTAGRAM</span>
                      </div>
                      <div className="cartridge-details">
                        <span className="cartridge-serial">LIV_FEED_44</span>
                        <span className="cartridge-status glow-green">
                          <span className="status-dot-small green"></span>
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
