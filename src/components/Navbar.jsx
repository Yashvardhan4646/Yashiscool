import { useState, useEffect } from "react";
import { Sparkles, HelpCircle, Code2, Award, Mail } from "lucide-react";

export default function Navbar() {
  const [activeHash, setActiveHash] = useState("#/home");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/home";
      setActiveHash(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Colors mapping for nav active states
  const navItems = [
    { label: "Home", hash: "#/home", icon: Sparkles, activeClass: "nav-home" },
    { label: "About", hash: "#/about", icon: HelpCircle, activeClass: "nav-about" },
    { label: "Projects", hash: "#/projects", icon: Code2, activeClass: "nav-projects" },
    { label: "Certificates", hash: "#/certificates", icon: Award, activeClass: "nav-certificates" },
    { label: "Contact", hash: "#/contact", icon: Mail, activeClass: "nav-contact" },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-logo">
        <span className="logo-text">YASHVARDHAN</span>
        <span className="logo-dot">.</span>
      </div>
      <nav className="navbar-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeHash === item.hash;
          return (
            <a
              key={item.hash}
              href={item.hash}
              className={`navbar-link ${isActive ? `active ${item.activeClass}` : ""}`}
            >
              <Icon className="nav-icon" size={16} />
              <span className="nav-text">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
