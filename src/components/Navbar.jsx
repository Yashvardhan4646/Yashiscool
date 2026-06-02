import { NavLink } from "react-router-dom";
import { Sparkles, HelpCircle, Code2, Award, Mail } from "lucide-react";

export default function Navbar() {
  // Navigation structure mapping paths and custom styling classes
  const navItems = [
    { label: "Home", path: "/home", icon: Sparkles, activeClass: "nav-home" },
    { label: "About", path: "/about", icon: HelpCircle, activeClass: "nav-about" },
    { label: "Projects", path: "/projects", icon: Code2, activeClass: "nav-projects" },
    { label: "Certificates", path: "/certificates", icon: Award, activeClass: "nav-certificates" },
    { label: "Contact", path: "/contact", icon: Mail, activeClass: "nav-contact" },
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

          return (
            <NavLink
              key={item.path}
              to={item.path}
              // Dynamically assigns both global 'active' and your unique color classes
              className={({ isActive }) =>
                `navbar-link ${isActive ? `active ${item.activeClass}` : ""}`
              }
            >
              <Icon className="nav-icon" size={16} />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
