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
      // Normalize hash reading to handle both "#/about" and "#about" safely
      const rawHash = window.location.hash;
      const page = rawHash.replace(/^#\/?/, "");

      const validPages = ["home", "about", "projects", "certificates", "contact"];

      if (validPages.includes(page)) {
        setCurrentTab(page);
      } else {
        setCurrentTab("home");
        window.location.hash = "/home";
      }

      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Handles the initial page load/refresh safely

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderActivePage = () => {
    switch (currentTab) {
      case "home": return <Home />;
      case "about": return <About />;
      case "projects": return <Projects />;
      case "certificates": return <Certificates />;
      case "contact": return <Contact />;
      default: return <Home />;
    }
  };

  return (
    <>
      <CanvasBg />
      <div className="pixel-scanlines" aria-hidden="true" />
      <div className="pixel-vignette" aria-hidden="true" />

      <div className="app-container">
        <Navbar currentTab={currentTab} />
        <main className="main-content">
          {renderActivePage()}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
