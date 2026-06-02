import { useState, useEffect } from "react";
import CanvasBg from "./components/CanvasBg";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import Contact from "./pages/Contact";

function App() {
  const [currentTab, setCurrentTab] = useState("home");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/home";
      
      // Extract page name: e.g. #/about -> about
      const page = hash.replace("#/", "");
      
      const validPages = ["home", "about", "projects", "certificates", "contact"];
      if (validPages.includes(page)) {
        setCurrentTab(page);
      } else {
        // Fallback to home
        setCurrentTab("home");
        window.location.hash = "#/home";
      }

      // Scroll to top on page navigation
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on initial load

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderActivePage = () => {
    switch (currentTab) {
      case "home":
        return <Home />;
      case "about":
        return <About />;
      case "projects":
        return <Projects />;
      case "certificates":
        return <Certificates />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      {/* Dynamic particles interactive background */}
      <CanvasBg />

      {/* ── PIXEL GAME EFFECT OVERLAYS ── */}
      {/* CRT scanlines: thin horizontal stripes over everything */}
      <div className="pixel-scanlines" aria-hidden="true" />
      {/* Vignette: soft dark edges for that CRT monitor feel */}
      <div className="pixel-vignette" aria-hidden="true" />

      {/* Main site shell layout */}
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          {renderActivePage()}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
