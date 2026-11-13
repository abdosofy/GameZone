import { useEffect, useState } from "react";
import { FaGamepad, FaBolt, FaCrown } from "react-icons/fa";
import "./Intro.css";

function Intro({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 6200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`intro intro-new ${isExiting ? "intro-new-exit" : ""}`}>

      <div className="intro-bg" />
      <div className="intro-grid" />
      <div className="intro-vignette" />

      <div className="intro-glow intro-glow-one" />
      <div className="intro-glow intro-glow-two" />

      {/* Floating particles */}
      <div className="new-particles">
        {Array.from({ length: 35 }).map((_, i) => (
          <span
            key={i}
            style={{
              "--left": `${(i * 37) % 100}%`,
              "--delay": `${(i % 9) * -0.5}s`,
              "--duration": `${3 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* Top information */}
      <div className="new-top">
        <span>GZ <b>/</b> SYSTEM</span>
        <span>GAMING REDEFINED</span>
      </div>

      {/* Main logo */}
      <div className="new-intro-content">

        <div className="logo-emblem">

          <div className="emblem-orbit orbit-a" />
          <div className="emblem-orbit orbit-b" />
          <div className="emblem-orbit orbit-c" />

          <div className="emblem-hexagon">
            <div className="emblem-inner">
              <FaGamepad className="main-gamepad" />
              <FaBolt className="gamepad-bolt" />
            </div>
          </div>

          <div className="emblem-crown">
            <FaCrown />
          </div>

          <div className="emblem-light light-one" />
          <div className="emblem-light light-two" />
        </div>

        <div className="new-brand-label">
          <span />
          THE ULTIMATE GAMING STORE
          <span />
        </div>

        <h1 className="new-brand-title">
          <span className="new-game">GAME</span>
          <span className="new-zone">ZONE</span>
        </h1>

        <div className="new-title-line" />

        <p className="new-subtitle">
          <span>YOUR</span> WORLD. <span>YOUR</span> GAME.
        </p>

        <div className="new-loading">
          <div className="new-loading-track">
            <div className="new-loading-fill" />
          </div>

          <div className="new-loading-info">
            <span>PREPARING YOUR EXPERIENCE</span>
            <span>100%</span>
          </div>
        </div>

      </div>

      {/* Bottom information */}
      <div className="new-bottom">
        <span>POWER UP YOUR WORLD</span>
        <span>WELCOME TO GAME ZONE</span>
      </div>

      {/* Corner decorations */}
      <div className="new-corner corner-one" />
      <div className="new-corner corner-two" />
      <div className="new-corner corner-three" />
      <div className="new-corner corner-four" />

      <div className="new-flash" />
    </div>
  );
}

export default Intro;