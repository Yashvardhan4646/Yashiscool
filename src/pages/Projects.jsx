import { useState } from "react";
import { Code2, ExternalLink, Filter, Search, LayoutGrid, List, FileCode, X } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ["All", "Frontend", "Backend / Scripts"];

  // Filter projects by both category and search query
  const filteredProjects = portfolioData.projects.filter(project => {
    // 1. Category Filter
    const matchesCategory = filter === "All" ||
      project.category.includes(filter) ||
      (filter === "Backend / Scripts" && project.category.toLowerCase().includes("backend"));

    // 2. Search Query Filter (Title, Description, or Tech Stack)
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = normalizedQuery === "" ||
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery) ||
      project.tech.some(t => t.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesSearch;
  });

  // Dynamically cycle through pastel background colors for projects folder cards
  const getCardColorClass = (idx) => {
    const colors = ["card-rose", "card-sky", "card-mint", "card-yellow", "card-purple"];
    return colors[idx % colors.length];
  };

  return (
    <div className="page-fade-in projects-page">
      <div className="section-title-container">
        <Code2 className="section-title-icon" size={28} strokeWidth={2.5} />
        <h1 className="section-title">Project Explorer</h1>
      </div>



      {/* Explorer HUD Controls */}
      <div className="explorer-controls">
        <div className="explorer-search-wrapper">
          <Search size={16} className="explorer-search-icon" />
          <input
            type="text"
            className="explorer-search-input"
            placeholder="Search files by title, keyword, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-toggle-btns">
          <button
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid View (Folders)"
          >
            <LayoutGrid size={15} />
            <span>Grid</span>
          </button>
          <button
            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List View (Terminal)"
          >
            <List size={15} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Floppy Disk Category Tabs */}
      <div className="projects-filter-bar neo-card card-yellow">
        <div className="filter-title">
          <Filter size={16} strokeWidth={2.5} />
          <span>DISK DIRECTORIES:</span>
        </div>
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn neo-filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              💾 {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Display Area */}
      {filteredProjects.length === 0 ? (
        <div className="neo-card card-rose" style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
          ⚠️ NO DIRECTORY NODES MATCHED THE FILTER PARAMETERS.
        </div>
      ) : viewMode === "grid" ? (
        /* Folder Grid View */
        <div className="projects-grid">
          {filteredProjects.map((project, idx) => {
            const colorClass = getCardColorClass(idx);
            return (
              <div key={project.id} className="folder-card-wrapper">
                {/* Folder Top Cut Tab */}
                <div className={`folder-tab-top ${colorClass}`}>
                  {project.extension || ".jsx"}
                </div>

                {/* Folder Body */}
                <div
                  className={`folder-card neo-card ${colorClass}`}
                  onClick={() => setSelectedProject(project)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="folder-card-header">
                    <div className="folder-dots-wrapper">
                      <div className="folder-dot-hole"></div>
                      <div className="folder-dot-hole"></div>
                    </div>
                    <div className="folder-stripe-pattern"></div>
                  </div>

                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.description}
                  </p>

                  <div className="project-tech-stack" style={{ marginTop: "auto", marginBottom: "14px" }}>
                    {project.tech.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="tech-tag neo-tech-chip">{t}</span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="tech-tag neo-tech-chip" style={{ background: "transparent", borderStyle: "dashed" }}>+{project.tech.length - 3}</span>
                    )}
                  </div>

                  <div className="project-metadata-row" style={{ borderTop: "1.5px dashed rgba(15, 23, 42, 0.15)", paddingTop: "12px", marginBottom: 0 }}>
                    <span>SIZE: <span className="project-size-val">{project.size || "1.2 MB"}</span></span>
                    <span className={`project-status-tag ${project.status || "stable"}`}>
                      {project.status === "stable" ? "🟢" : "🟡"} {project.status ? project.status.toUpperCase() : "STABLE"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Terminal List View */
        <div className="terminal-list-container">
          <table className="terminal-list-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>File Size</th>
                <th>Node Status</th>
                <th>Technology Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="terminal-filename">
                      <FileCode size={14} style={{ color: "rgba(16, 185, 129, 0.6)" }} />
                      <span>{project.id}{project.extension || ".jsx"}</span>
                    </div>
                  </td>
                  <td>
                    <span className="terminal-filesize">{project.size || "1.2 MB"}</span>
                  </td>
                  <td>
                    <span className="terminal-status">
                      <span>{project.status === "stable" ? "🟢" : "🟡"}</span>
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>{project.status || "stable"}</span>
                    </span>
                  </td>
                  <td>
                    <span className="terminal-tech">{project.tech.join(" // ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Properties Modal Dialog */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content neo-card-modal properties-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            {/* Header window header bar */}
            <div className="console-window-header" style={{ margin: "-32px -32px 24px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px" }}>
              <div className="console-dots">
                <span className="console-dot dot-red" onClick={() => setSelectedProject(null)} style={{ cursor: "pointer" }}></span>
                <span className="console-dot dot-yellow"></span>
                <span className="console-dot dot-green"></span>
              </div>
              <span className="console-title">{selectedProject.id}.properties</span>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                style={{
                  position: "static",
                  width: "24px",
                  height: "24px",
                  boxShadow: "none",
                  border: "none",
                  background: "transparent",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Properties Dialog Content */}
            <div className="properties-body" style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
              {/* Header: Large Icon and Title */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ padding: "12px", border: "var(--border-thin)", borderRadius: "6px", boxShadow: "2px 2px 0px #0f172a", backgroundColor: "var(--pastel-yellow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileCode size={36} className="accent-color-rose" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)", margin: 0 }}>{selectedProject.title}</h3>
                  <span className="cert-category-tag" style={{ marginTop: "6px", marginBottom: 0 }}>{selectedProject.category}</span>
                </div>
              </div>

              <div style={{ borderBottom: "1.5px solid #0f172a", margin: "4px 0" }}></div>

              {/* General Info list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr" }}>
                  <span style={{ color: "var(--text-muted)" }}>FILE TYPE:</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{selectedProject.extension.toUpperCase()} Source File</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr" }}>
                  <span style={{ color: "var(--text-muted)" }}>SIZE ON DISK:</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{selectedProject.size}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)" }}>NODE STATUS:</span>
                  <span>
                    <span className={`project-status-tag ${selectedProject.status}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", padding: "1px 6px" }}>
                      {selectedProject.status === "stable" ? "Stable" : "Beta"}
                    </span>
                  </span>
                </div>
              </div>

              <div style={{ borderBottom: "1.5px dashed rgba(15, 23, 42, 0.15)", margin: "4px 0" }}></div>

              {/* Description Box */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>DESCRIPTION:</span>
                <div style={{ padding: "12px", border: "var(--border-thin)", borderRadius: "6px", backgroundColor: "var(--bg-secondary)", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {selectedProject.description}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>REGISTERED LIBRARIES:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selectedProject.tech.map((t, idx) => (
                    <span key={idx} className="tech-tag neo-tech-chip" style={{ fontSize: "0.7rem", margin: 0 }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ borderBottom: "1.5px solid #0f172a", margin: "8px 0 4px" }}></div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary neo-btn"
                  style={{ padding: "10px 18px", fontSize: "0.85rem", textDecoration: "none" }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <span>Codebase</span>
                </a>
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary neo-btn"
                  style={{ padding: "10px 18px", fontSize: "0.85rem", textDecoration: "none" }}
                >
                  <ExternalLink size={16} strokeWidth={2.5} />
                  <span>Launch App</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
