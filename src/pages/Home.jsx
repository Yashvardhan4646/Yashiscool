import { useState, useEffect, useRef } from "react";
import { ArrowRight, Award, Compass, Layers, Star, User, Folder, Mail, Terminal, FileCode } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function Home() {
  const { name, title, shortBio } = portfolioData.personalInfo;

  // Real-time ticking Clock State
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // System Metric State (CPU fluctuator)
  const [cpuUsage, setCpuUsage] = useState(12.4);
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((Math.random() * 15 + 5).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // CRT Scanline Filter Toggle State
  const [crtActive, setCrtActive] = useState(false);

  // Active floating system modals: null, "avatar", "synth"
  const [activeModal, setActiveModal] = useState(null);

  // Audio Synth State
  const [synthOscActive, setSynthOscActive] = useState(false);
  const [synthPitch, setSynthPitch] = useState(440); // A4 frequency
  const [synthWaveform, setSynthWaveform] = useState("sine");

  // Telemetry Log Feed State (Live Status Ticker)
  const [liveLogs, setLiveLogs] = useState([
    { time: "12:35:01", tag: "SYS/INIT", desc: "Telemetry channel online", color: "#10b981" },
    { time: "12:35:04", tag: "ENV/PORT", desc: "Connection listening on local port 5173", color: "#06b6d4" },
    { time: "12:35:08", tag: "NET/PING", desc: "Gateway connection verified (12ms)", color: "#10b981" },
    { time: "12:35:12", tag: "RENDER", desc: "Graphics renderer set to 120 FPS", color: "#3b82f6" },
  ]);

  // Periodic Telemetry Log Feed Generator
  useEffect(() => {
    const LOG_TAGS = [
      { tag: "SYS/CPU", desc: "Clock speed synchronized at 3.6GHz", color: "#3b82f6" },
      { tag: "NET/PING", desc: "Remote node github.com acknowledged packet (14ms)", color: "#10b981" },
      { tag: "MEM/SYNC", desc: "Garbage collection released 142MB heap block", color: "#8b5cf6" },
      { tag: "RENDER", desc: "FPS buffer verified - Frame rate stable at 120 FPS", color: "#10b981" },
      { tag: "DEPL/VERCEL", desc: "Production build synchronized successfully", color: "#f59e0b" },
      { tag: "SEC/SSL", desc: "Handshake verified with SMTP gateway node", color: "#ec4899" },
      { tag: "ENV/PORT", desc: "Active connection verified on local port 5173", color: "#06b6d4" },
      { tag: "BIOS/CHECK", desc: "All structural check nodes reporting: OK", color: "#10b981" },
    ];

    const logInterval = setInterval(() => {
      const randomLog = LOG_TAGS[Math.floor(Math.random() * LOG_TAGS.length)];
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", { hour12: false });

      setLiveLogs(prev => {
        const next = [...prev, { time: timeString, ...randomLog }];
        if (next.length > 5) {
          next.shift();
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(logInterval);
  }, []);

  // Web Audio retro click sound synthesis
  const playClickSound = (pitch = 800, duration = 0.05, type = "sine") => {
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
      // Ignore audio restriction blocks
    }
  };

  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    { text: "Yashvardhan OS v1.0.0 Interactive Shell active.", type: "stdout" },
    { text: "Type 'help' or click macros below to interact.", type: "stdout" }
  ]);
  const [gameStage, setGameStage] = useState("idle"); // 'idle' | 'started'

  const terminalOutputRef = useRef(null);

  // Auto-scroll terminal output internally (without scrolling main viewport)
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Execute terminal macro scripts and user-typed commands
  const executeCommand = (cmd) => {
    const normalizedCmd = cmd.trim().toLowerCase();
    if (normalizedCmd === "clear") {
      setTerminalLines([]);
      setGameStage("idle");
      return;
    }

    const commandPrompt = `yashvardhan@root:~$ ${cmd}`;
    let outputLines = [];

    // Parse commands based on game active status
    if (gameStage !== "idle") {
      if (normalizedCmd === "examine door") {
        outputLines = [
          "The iron door has a glowing pixel keypad.",
          "It reads: 'Enter code: Yashvardhan finished high school in year ____'",
          "Options: type 'code 2026' or 'code 2025'"
        ];
      } else if (normalizedCmd === "code 2026") {
        outputLines = [
          "KEYPAD: [2026] VALIDATED.",
          "ACCESS GRANTED! The iron door swings open.",
          "You discovered Yashvardhan's core payload:",
          "  He graduated 12th Grade in Class of 2026 with Verified Credentials!",
          "CONGRATULATIONS! YOU HAVE COMPLETED RETROQUEST.",
          "Type 'game' to play again, or 'clear' to reset terminal."
        ];
        setGameStage("idle");
        // Play success riser
        setTimeout(() => playClickSound(523.25, 0.4, "triangle"), 100);
      } else if (normalizedCmd === "code 2025") {
        outputLines = [
          "KEYPAD: [2025] ACCESS DENIED.",
          "ERROR: Invalid credentials. Keypad locked for 1 second.",
          "Try again: Type 'code 2026'"
        ];
        setTimeout(() => playClickSound(180, 0.2, "sawtooth"), 100);
      } else if (normalizedCmd === "go left") {
        outputLines = [
          "You walked into a pit of recursive syntax errors!",
          "GAME OVER. Yashvardhan OS reboot required.",
          "Type 'game' to restart adventure, or 'clear' to reset terminal."
        ];
        setGameStage("idle");
        setTimeout(() => playClickSound(120, 0.4, "sawtooth"), 100);
      } else {
        outputLines = [
          `Invalid action '${cmd}' during RetroQuest.`,
          "Available options: 'examine door', 'code 2026', 'code 2025', 'go left', or 'clear' to quit."
        ];
      }
    } else {
      if (normalizedCmd === "help") {
        outputLines = [
          "Available commands:",
          "  help          - Display command helper log",
          "  ls            - List file directory items",
          "  cat <file>    - Output contents of a target file",
          "  ping <ip>     - Ping remote network node",
          "  about         - Display biography ledger details",
          "  skills        - Output developer capability analysis",
          "  game          - Play the interactive text adventure game",
          "  matrix        - Execute matrix binary code synchronization",
          "  clear         - Clear console screen buffer"
        ];
      } else if (normalizedCmd === "game") {
        setGameStage("started");
        outputLines = [
          "--- RETROQUEST V1.0.0 INITIALIZED ---",
          "You are standing inside a dark mainframe vault.",
          "In front of you is a locked iron door. To your left is a deep dark corridor.",
          "Available options: type 'examine door' or 'go left'."
        ];
      } else if (normalizedCmd === "matrix") {
        outputLines = [
          "01010110 01001001 01010100 01000101 (VITE)",
          "01010010 01000101 01000011 01000011 01010100 (REACT)",
          "01010011 01011001 01010011 01010100 01000101 01001101 (SYSTEM)",
          "01001000 01000001 01000011 01001011 01001001 01001110 01000111 (HACKING)",
          "...............................................",
          "SYSTEM OVERRIDE DETECTED... INJECTING FLOW VECTOR...",
          "MATRIX RECONSTRUCTION COMPLETED SUCCESSFULLY."
        ];
        setTimeout(() => playClickSound(880, 0.3, "sine"), 100);
      } else if (normalizedCmd === "ls") {
        outputLines = [
          "Directory: /var/yashvardhan/root",
          "  welcome.txt      (120 bytes)",
          "  system.cfg       (180 bytes)",
          "  skills.md        (320 bytes)",
          "  projects.dir     (directory)"
        ];
      } else if (normalizedCmd === "cat welcome.txt") {
        outputLines = [
          "Welcome to my retro desktop workspace!",
          "Specializing in interactive frontend layouts and responsive UI designs.",
          "Status: Active and available for creative assignments."
        ];
      } else if (normalizedCmd === "cat system.cfg") {
        outputLines = [
          "OS_TARGET=Yashvardhan_RetroOS_v1.0",
          "BUILD_PARADIGM=Vite + React 19 Engine",
          "LAYOUT_DYNAMICS=Vanilla HSL CSS Grids",
          "NETWORK_PORT=Active on Port 5173"
        ];
      } else if (normalizedCmd === "cat skills.md") {
        outputLines = [
          "TECHNICAL SKILLS ANALYSIS:",
          "  - HTML5/CSS3 (Advanced Spacing Layouts)",
          "  - JavaScript ES6+ (Core Algorithms & Interactive APIs)",
          "  - React 19 & React Router (Single Page Component Shells)",
          "  - Vite / NPM Build Tools (Clean Dependency Graphing)"
        ];
      } else if (normalizedCmd.startsWith("cat")) {
        const target = normalizedCmd.substring(3).trim();
        if (!target) {
          outputLines = ["Usage: cat <filename>"];
        } else {
          outputLines = [`cat: ${target}: File not found in directory node.`];
        }
      } else if (normalizedCmd === "about") {
        outputLines = [
          "Biography Registry Lookup:",
          "  Developer Name : Yashvardhan",
          "  Specialization : Creative Frontend Coder",
          "  Academic Status: Completed High School 12th Grade (Class of 2026)",
          "  Certification  : 8 SoloLearn Verified Credentials"
        ];
      } else if (normalizedCmd === "skills") {
        outputLines = [
          "Capability Spectrum Matrix:",
          "  [████████████████░░] HTML/CSS  - 92%",
          "  [██████████████░░░░] JavaScript - 85%",
          "  [██████████████░░░░] React 19   - 82%",
          "  [████████████████░░] UI Design  - 90%"
        ];
      } else if (normalizedCmd === "ping github.com" || normalizedCmd === "ping github") {
        outputLines = [
          "PING github.com (140.82.112.4) 56(84) bytes of data.",
          "64 bytes from github.com: icmp_seq=1 ttl=52 time=14.6 ms",
          "64 bytes from github.com: icmp_seq=2 ttl=52 time=15.2 ms",
          "--- github.com ping statistics ---",
          "2 packets transmitted, 2 received, 0% packet loss, time 1002ms"
        ];
      } else if (normalizedCmd.startsWith("ping")) {
        const target = normalizedCmd.substring(4).trim();
        if (!target) {
          outputLines = ["Usage: ping <domain/ip>"];
        } else {
          outputLines = [
            `PING ${target} (127.0.0.1) 56(84) bytes of data.`,
            `64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.8 ms`,
            `--- ${target} ping statistics ---`,
            "1 packets transmitted, 1 received, 0% packet loss"
          ];
        }
      } else {
        outputLines = [
          `Command '${cmd}' not recognized in shell context.`,
          "Type 'help' for a list of available command nodes."
        ];
      }

      // Add prompt immediately
      setTerminalLines(prev => [...prev, { text: commandPrompt, type: "cmd-input" }]);

      // Simulated typewriter flow for lines
      outputLines.forEach((line, idx) => {
        setTimeout(() => {
          setTerminalLines(prev => [...prev, { text: line, type: "stdout" }]);
        }, (idx + 1) * 120);
      });
    };

    const handleTerminalSubmit = (e) => {
      e.preventDefault();
      if (!terminalInput.trim()) return;
      executeCommand(terminalInput);
      setTerminalInput("");
    };

    // Synthesize custom sound waves using browser Web Audio API
    const playSynthSound = (type) => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        setSynthOscActive(true);
        const baseFreq = Number(synthPitch);

        if (type === "laser") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(baseFreq / 4, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
          setTimeout(() => setSynthOscActive(false), 300);
        } else if (type === "blip") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
          setTimeout(() => setSynthOscActive(false), 100);
        } else if (type === "powerup") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(baseFreq / 2, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.45);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
          setTimeout(() => setSynthOscActive(false), 450);
        } else if (type === "success") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
          osc.frequency.setValueAtTime(baseFreq * 1.25, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
          setTimeout(() => setSynthOscActive(false), 400);
        } else {
          // Trigger based on sliders / waveform settings
          osc.type = synthWaveform;
          osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
          setTimeout(() => setSynthOscActive(false), 300);
        }
      } catch (err) {
        console.warn("Audio Context block or unsupported browser browser action.", err);
        setSynthOscActive(false);
      }
    };

    const coreValues = [
      {
        title: "Playful Aesthetics",
        desc: "Creating high-impact, custom layouts featuring pastel accents and creative interactions.",
        icon: Compass,
        colorClass: "card-rose"
      },
      {
        title: "Clean Standards",
        desc: "Composing semantic HTML5 trees and responsive CSS modules with zero compiler errors.",
        icon: Layers,
        colorClass: "card-sky"
      },
      {
        title: "Robust Quality",
        desc: "Rigorous workspace structures and clean code principles to build robust products.",
        icon: Star,
        colorClass: "card-mint"
      }
    ];

    // Desktop shortcuts data
    const shortcuts = [
      { label: "biography.txt", hash: "/about", icon: User, color: "var(--pastel-peach)", iconColor: "var(--accent-rose)" },
      { label: "projects.dir", hash: "/projects", icon: Folder, color: "var(--pastel-sky)", iconColor: "var(--accent-blue)" },
      { label: "credentials.key", hash: "/certificates", icon: Award, color: "var(--pastel-mint)", iconColor: "var(--accent-green)" },
      { label: "contact.sh", hash: "/contact", icon: Mail, color: "var(--pastel-rose)", iconColor: "var(--accent-rose)" }
    ];

    // Marquee scrolling texts
    const marqueeItems = [
      "Node Status: Online",
      "Education: Graduated 12th Grade (Class of 2026)",
      "Vercel Deployments: Active",
      "Framework: React 19",
      "Language: JavaScript ES6+",
      "Style: Neo-Brutalist + Pastel UI",
      "SoloLearn Credentials: 8 Verified",
      "Speed: 100% Fluid Grid"
    ];

    return (
      <div className={`crt-effect-wrapper ${crtActive ? "crt-active" : ""}`}>
        <div className="page-fade-in home-page">

          {/* Real-time System taskbar widget */}
          <div className="retro-taskbar">
            <div className="taskbar-left">
              <div className="taskbar-widget">
                <span className="led-indicator led-blink"></span>
                <span>SYS_OK: 120 FPS</span>
              </div>
              <div className="taskbar-widget" style={{ opacity: 0.8 }}>
                <span>CPU: {cpuUsage}%</span>
              </div>
              <div className="taskbar-widget" style={{ opacity: 0.8 }}>
                <span>RAM: 14.2 GB / 16.0 GB</span>
              </div>
            </div>

            <div className="taskbar-right">
              <button
                className={`crt-toggle-btn ${crtActive ? "active" : ""}`}
                onClick={() => setCrtActive(!crtActive)}
                title="Toggle CRT Screen Scanlines"
              >
                {/* TV inline SVG */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "3px" }}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
                <span>CRT MODE</span>
              </button>
              <div className="taskbar-widget" style={{ fontWeight: 700 }}>
                <span>{timeStr}</span>
              </div>
            </div>
          </div>

          {/* Scrolling System Ticker Marquee */}
          <div className="system-marquee">
            <div className="marquee-track">
              {/* Duplicate items to ensure seamless loop */}
              {marqueeItems.concat(marqueeItems).map((item, idx) => (
                <div key={idx} className="marquee-item">
                  <span>{item}</span>
                  <span className="marquee-divider">//</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid Shortcuts + Custom interactive launchers */}
          <div className="desktop-grid">
            {shortcuts.map((shortcut, idx) => {
              const Icon = shortcut.icon;
              return (
                <a key={idx} href={shortcut.hash} className="desktop-shortcut-link">
                  <div className="desktop-shortcut">
                    <div className="shortcut-icon-box" style={{ backgroundColor: shortcut.color, color: shortcut.iconColor }}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="shortcut-label">{shortcut.label}</span>
                  </div>
                </a>
              );
            })}

            {/* Interactive Modal Launcher: avatar.png */}
            <div className="desktop-shortcut" onClick={() => setActiveModal("avatar")}>
              <div className="shortcut-icon-box" style={{ backgroundColor: "var(--pastel-purple)", color: "var(--accent-purple)" }}>
                {/* User Avatar outline */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <span className="shortcut-label">avatar.png</span>
            </div>

            {/* Interactive Modal Launcher: synth.exe */}
            <div className="desktop-shortcut" onClick={() => setActiveModal("synth")}>
              <div className="shortcut-icon-box" style={{ backgroundColor: "var(--pastel-yellow)", color: "var(--accent-yellow)" }}>
                {/* Audio/Synth outline */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </div>
              <span className="shortcut-label">synth.exe</span>
            </div>
          </div>

          {/* Hero Section: OS Window Mockup */}
          <section className="os-window-hero">
            <div className="os-window-header">
              <div className="os-window-controls">
                <span className="os-window-btn os-btn-close"></span>
                <span className="os-window-btn os-btn-min"></span>
                <span className="os-window-btn os-btn-max"></span>
              </div>
              <span className="os-window-title">Yashvardhan_OS_v1.0.sh</span>
              <div style={{ width: 48 }}></div>
            </div>

            <div className="os-window-body">
              <div className="os-cmd-prompt">
                <span>yashvardhan@root:~$</span> cat bio.txt
              </div>

              <h1 className="hero-name">{name}</h1>

              <div style={{ marginBottom: "16px" }}>
                <span className="hero-subtitle-badge">{title}</span>
              </div>

              <p className="hero-bio">{shortBio}</p>

              <div className="hero-buttons">
                <a href="#/projects" className="btn btn-primary neo-btn">
                  <span>Execute Projects</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </a>
                <a href="#/certificates" className="btn btn-secondary neo-btn">
                  <span>Verify Credentials</span>
                  <Award size={18} strokeWidth={2.5} />
                </a>
              </div>

              <div className="terminal-shell-window">
                <div ref={terminalOutputRef} className="terminal-shell-output">
                  {terminalLines.map((line, idx) => (
                    <div key={idx} className={`terminal-line ${line.type}`}>
                      {line.text}
                    </div>
                  ))}

                  {/* Interactive command prompt line */}
                  <form onSubmit={handleTerminalSubmit} className="terminal-input-form">
                    <span className="terminal-prompt-symbol">yashvardhan@root:~$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="terminal-interactive-input"
                      placeholder="Type 'help' for available commands..."
                      aria-label="Terminal command input"
                    />
                  </form>
                </div>

                <div className="terminal-macro-buttons">
                  <button className="terminal-macro-btn" onClick={() => executeCommand("cat welcome.txt")}>
                    welcome.txt
                  </button>
                  <button className="terminal-macro-btn" onClick={() => executeCommand("cat system.cfg")}>
                    system.cfg
                  </button>
                  <button className="terminal-macro-btn" onClick={() => executeCommand("ping github.com")}>
                    ping github
                  </button>
                  <button className="terminal-macro-btn" style={{ borderColor: "var(--accent-rose)", color: "var(--accent-rose)" }} onClick={() => executeCommand("clear")}>
                    clear
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Grid: Highlights & Status */}
          <div className="grid-2-col">
            {/* Core Values / Design Methodology */}
            <div className="home-highlights-container">
              <div className="section-header-small">
                <FileCode size={14} style={{ color: "var(--text-muted)", marginRight: "6px" }} />
                <span>Design Methodology</span>
              </div>
              <div className="highlights-vertical-stack">
                {coreValues.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <div key={idx} className={`value-strip neo-card ${value.colorClass}`}>
                      <div className="strip-icon-wrapper">
                        <Icon size={20} strokeWidth={2.5} />
                      </div>
                      <div className="strip-text">
                        <h3>{value.title}</h3>
                        <p>{value.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monospace computer BIOS Boot Screen Checklist */}
            <div className="home-telemetry-container">
              <div className="section-header-small">
                <Terminal size={14} style={{ color: "var(--text-muted)", marginRight: "6px" }} />
                <span>System Bios Check</span>
              </div>

              <div className="bios-panel">
                <div className="bios-header">
                  <span className="bios-title">AMIBIOS (C) 2026 YASHVARDHAN DEV</span>
                  <span className="bios-cursor">_</span>
                </div>

                <div className="bios-row">
                  <span className="bios-label">SYSTEM_ROOT:</span>
                  <span className="bios-val" style={{ color: "var(--accent-rose)" }}>Yashvardhan</span>
                </div>
                <div className="bios-row">
                  <span className="bios-label">ACADEMIC_MILESTONE:</span>
                  <span className="bios-val">Finished High School 12th Grade</span>
                </div>
                <div className="bios-row">
                  <span className="bios-label">CORE_DEV_STACK:</span>
                  <span className="bios-val">React 19, JavaScript ES6+, HTML5, CSS3</span>
                </div>
                <div className="bios-row">
                  <span className="bios-label">UI_DESIGN_PARADIGM:</span>
                  <span className="bios-val" style={{ color: "#38bdf8" }}>Neo-Brutalist + Pastel Grid</span>
                </div>
                <div className="bios-row">
                  <span className="bios-label">SOLOLEARN_STATUS:</span>
                  <span className="bios-val" style={{ color: "#10b981" }}>8 Verified Credentials</span>
                </div>
                <div className="bios-row">
                  <span className="bios-label">HOST_ENVIRONMENT:</span>
                  <span className="bios-val">Active / Fluid Grid Vercel</span>
                </div>

                <div className="bios-footer">
                  <div className="bios-progress-bar">
                    <div className="bios-progress-fill"></div>
                  </div>
                  <p className="bios-status-msg">
                    BIOS checks complete. Standard developer layout rendering successfully at 120 FPS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Overlay / Draggable simulation windows */}
          {activeModal && (
            <div className="floating-window-backdrop" onClick={() => setActiveModal(null)}>
              <div className="floating-window" onClick={(e) => e.stopPropagation()}>
                <div className="floating-window-header">
                  <div className="floating-window-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    <span>{activeModal === "avatar" ? "view_avatar.exe" : "synthesizer.exe"}</span>
                  </div>
                  <button className="floating-window-btn" onClick={() => setActiveModal(null)}>
                    {/* Close inline SVG */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                <div className="floating-window-body">
                  {activeModal === "avatar" && (
                    <div className="rpg-avatar-wrapper">
                      <img
                        src="/avatar.png"
                        alt="Developer retro avatar"
                        className="rpg-avatar-img"
                      />
                      <div className="rpg-stats">
                        <h3>CHARACTER BIO</h3>
                        <div className="rpg-stat-row">
                          <div className="rpg-stat-info">
                            <span>STRENGTH (HTML/CSS)</span>
                            <span>92/100</span>
                          </div>
                          <div className="rpg-progress-bg">
                            <div className="rpg-progress-fill" style={{ width: "92%", backgroundColor: "var(--accent-rose)" }}></div>
                          </div>
                        </div>
                        <div className="rpg-stat-row">
                          <div className="rpg-stat-info">
                            <span>DEXTERITY (JAVASCRIPT)</span>
                            <span>85/100</span>
                          </div>
                          <div className="rpg-progress-bg">
                            <div className="rpg-progress-fill" style={{ width: "85%", backgroundColor: "var(--accent-blue)" }}></div>
                          </div>
                        </div>
                        <div className="rpg-stat-row">
                          <div className="rpg-stat-info">
                            <span>CHARISMA (UI DESIGN)</span>
                            <span>90/100</span>
                          </div>
                          <div className="rpg-progress-bg">
                            <div className="rpg-progress-fill" style={{ width: "90%", backgroundColor: "var(--accent-purple)" }}></div>
                          </div>
                        </div>
                        <div className="rpg-stat-row">
                          <div className="rpg-stat-info">
                            <span>INTELLIGENCE (REACT 19)</span>
                            <span>82/100</span>
                          </div>
                          <div className="rpg-progress-bg">
                            <div className="rpg-progress-fill" style={{ width: "82%", backgroundColor: "var(--accent-green)" }}></div>
                          </div>
                        </div>
                        <div className="rpg-special-trait">
                          SPECIAL CLASS TRAIT: NEO-BRUTALIST ARCHITECT (+25 ATK ON SHARP CORNERS)
                        </div>
                      </div>
                    </div>
                  )}

                  {activeModal === "synth" && (
                    <div className="synth-container">
                      <div className="synth-pads">
                        <button className="synth-pad" style={{ backgroundColor: "var(--pastel-rose)" }} onClick={() => playSynthSound("laser")}>
                          <span>[ LASER ]</span>
                          <span className="synth-wave-type">Sawtooth</span>
                        </button>
                        <button className="synth-pad" style={{ backgroundColor: "var(--pastel-sky)" }} onClick={() => playSynthSound("blip")}>
                          <span>[ BLIP ]</span>
                          <span className="synth-wave-type">Sine</span>
                        </button>
                        <button className="synth-pad" style={{ backgroundColor: "var(--pastel-mint)" }} onClick={() => playSynthSound("powerup")}>
                          <span>[ POWER UP ]</span>
                          <span className="synth-wave-type">Triangle</span>
                        </button>
                        <button className="synth-pad" style={{ backgroundColor: "var(--pastel-yellow)" }} onClick={() => playSynthSound("success")}>
                          <span>[ SUCCESS ]</span>
                          <span className="synth-wave-type">Chord Triad</span>
                        </button>
                      </div>

                      <div className="synth-controls">
                        <div className="synth-slider-group">
                          <label>
                            <span>BASE FREQUENCY</span>
                            <span>{synthPitch} Hz</span>
                          </label>
                          <input
                            type="range"
                            min="150"
                            max="1200"
                            value={synthPitch}
                            onChange={(e) => setSynthPitch(e.target.value)}
                            className="synth-range-input"
                          />
                        </div>

                        <div className="synth-slider-group">
                          <label>
                            <span>WAVEFORM TYPE</span>
                            <span style={{ textTransform: "uppercase" }}>{synthWaveform}</span>
                          </label>
                          <select
                            value={synthWaveform}
                            onChange={(e) => setSynthWaveform(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "6px",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.75rem",
                              border: "var(--border-thin)",
                              borderRadius: "4px",
                              background: "#ffffff"
                            }}
                          >
                            <option value="sine">Sine</option>
                            <option value="square">Square</option>
                            <option value="sawtooth">Sawtooth</option>
                            <option value="triangle">Triangle</option>
                          </select>
                        </div>

                        <button
                          className="btn btn-primary neo-btn"
                          onClick={() => playSynthSound("custom")}
                          style={{ marginTop: "8px", width: "100%", padding: "10px" }}
                        >
                          Play Pitch Freq
                        </button>
                      </div>

                      {/* CSS oscilloscope animation visualizer */}
                      <div className={`synth-oscilloscope ${synthOscActive ? "synth-osc-active" : ""}`}>
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="osc-bar" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }
}
