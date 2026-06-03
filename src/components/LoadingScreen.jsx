import { useState, useEffect } from "react";

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Automatically tick progress from 0% to 100%
  useEffect(() => {
    const duration = 1200; // Fast and clean 1.2s loading
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Handle completion zoom-out transition
  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 200); // Tiny pause at 100%

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 900); // 200ms + 700ms zoom animation duration

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  return (
    <div className={`loading-screen-overlay ${isFadingOut ? "loading-zoom-out" : ""}`}>
      {/* Subtle CRT overlays for retro vibe */}
      <div className="pixel-scanlines" aria-hidden="true" />
      <div className="pixel-vignette" aria-hidden="true" />

      <div className="simple-loader-content">
        <h1 className="simple-loader-title">YASHVARDHAN</h1>
        <p className="simple-loader-sub">PORTFOLIO DECK // INITIALIZING</p>
        
        <div className="simple-loader-bar-container">
          <div className="simple-loader-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        
        <span className="simple-loader-percent">{Math.floor(progress)}%</span>
      </div>
    </div>
  );
}
