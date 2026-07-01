import { Mail } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function Footer() {
  const { name, socials } = portfolioData.personalInfo;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-divider"></div>
      <div className="footer-content">
        <p className="footer-copyright">
          © {currentYear} {name} • Built with React & Playful CSS
        </p>
        <div className="footer-socials">
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link github-hover"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link linkedin-hover"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link instagram-hover"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          <a
            href={socials.email}
            className="social-icon-link email-hover"
            aria-label="Email"
          >
            <Mail size={20} strokeWidth={2.5} />
          </a>
        </div>

        {/* vibering webring */}
        <div className="footer-webring">
          <a
            href="https://arshnah.github.io/vibering/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="vibering webring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" viewBox="0 0 88 31" role="img" aria-label="vibering web ring badge">
              <defs>
                <linearGradient id="vg-yash" x1="0" y1="0" x2="88" y2="31" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#7c5cff" />
                  <stop offset="0.5" stopColor="#ff5db1" />
                  <stop offset="1" stopColor="#ff7a5c" />
                </linearGradient>
              </defs>
              <rect width="88" height="31" fill="#cdb8ec" />
              <rect x="1" y="1" width="86" height="29" fill="#fbf3e8" />
              <rect x="1" y="1" width="86" height="1" fill="#ffffff" />
              <rect x="1" y="1" width="27" height="29" fill="#f3e7d5" />
              <rect x="27" y="1" width="1" height="29" fill="#e3d3bf" />
              <g transform="translate(14.5,15.5)">
                <circle r="8" fill="none" stroke="url(#vg-yash)" strokeWidth="2.5" />
                <circle cx="0" cy="-8" r="2.4" fill="#ff5db1" />
              </g>
              <text x="31" y="14" textLength="53" lengthAdjust="spacingAndGlyphs" fontFamily="Verdana,Geneva,sans-serif" fontSize="9" fontWeight="bold" fill="#3d2a63">VIBERING</text>
              <text x="31" y="24" textLength="53" lengthAdjust="spacingAndGlyphs" fontFamily="Verdana,Geneva,sans-serif" fontSize="7" fill="#b1508f">web ring</text>
            </svg>
          </a>
          <p className="footer-webring-nav">
            member of the{" "}
            <a href="https://arshnah.github.io/vibering/" target="_blank" rel="noopener noreferrer">vibering webring</a>:{" "}
            <a href="https://arshnah.github.io/vibering/go.html?from=yash&dir=prev">&laquo; prev</a> |{" "}
            <a href="https://arshnah.github.io/vibering/random/">random</a> |{" "}
            <a href="https://arshnah.github.io/vibering/go.html?from=yash&dir=next">next &raquo;</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
