import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sparkles, HelpCircle, Code2, Award, Mail } from "lucide-react";

export default function Navbar() {
  const [timeStr, setTimeStr] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tick clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Fail silently
    }
  };

  const handleNavClick = () => {
    playSynthTone(580, 0.03, "sine");
    setTimeout(() => playSynthTone(780, 0.04, "sine"), 35);
  };

  const handleNavHover = () => {
    playSynthTone(1000, 0.01, "sine");
  };

  const navItems = [
    { label: "Home", path: "/home", icon: Sparkles, activeClass: "nav-home" },
    { label: "About", path: "/about", icon: HelpCircle, activeClass: "nav-about" },
    { label: "Projects", path: "/projects", icon: Code2, activeClass: "nav-projects" },
    { label: "Certificates", path: "/certificates", icon: Award, activeClass: "nav-certificates" },
    { label: "Contact", path: "/contact", icon: Mail, activeClass: "nav-contact" },
  ];

  return (
    <header className={`navbar-container ${scrolled ? "scrolled" : ""}`}>
      {/* HUD corner brackets */}
      <svg className="corner-bracket tl" width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 1.5H1.5V8" />
      </svg>
      <svg className="corner-bracket tr" width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0 1.5H6.5V8" />
      </svg>
      <svg className="corner-bracket bl" width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 6.5H1.5V0" />
      </svg>
      <svg className="corner-bracket br" width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0 6.5H6.5V0" />
      </svg>

      {/* Left section: Sleek Logo */}
      <div className="navbar-logo">
        <span className="logo-text">YASHVARDHAN</span>
        <span className="logo-dot">■</span>
      </div>

      {/* Center section: Pill Links */}
      <nav className="navbar-links">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              onMouseEnter={handleNavHover}
              className={({ isActive }) =>
                `navbar-link ${isActive ? `active ${item.activeClass}` : ""}`
              }
            >
              <Icon className="nav-icon" size={13} />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Right section: Minimalist Status Box */}
      <div className="navbar-status-box">
        <span className="status-dot"></span>

        {/* Animated SVG Sparkline */}
        <div className="status-sparkline">
          <svg width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="#22c55e" strokeWidth="1.5">
            <path className="sparkline-path" d="M0 7 L4 7 L8 3 L12 11 L16 5 L20 9 L24 7 L28 7" />
          </svg>
        </div>

        <span className="status-clock">{timeStr}</span>
      </div>
    </header>
  );
}
