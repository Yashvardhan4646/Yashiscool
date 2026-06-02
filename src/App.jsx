import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CanvasBg from "./components/CanvasBg";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import Contact from "./pages/Contact";

// Helper component to handle scrolling to top on every page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />

      {/* Dynamic particles interactive background */}
      <CanvasBg />

      {/* ── PIXEL GAME EFFECT OVERLAYS ── */}
      <div className="pixel-scanlines" aria-hidden="true" />
      <div className="pixel-vignette" aria-hidden="true" />

      {/* Main site shell layout */}
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/contact" element={<Contact />} />

            {/* Directs the root URL or any broken paths back to /home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
