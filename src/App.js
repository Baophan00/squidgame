import React, { useState, useEffect } from "react";
import CharacterSelect from "./components/CharacterSelect";
import RedLightGreenLight from "./games/RedLightGreenLight/RedLightGreenLight";
import TugOfWar from "./games/TugOfWar";
import GlassBridge from "./games/GlassBridge";
import logo from "./assets/images/logo.jpg";

function App() {
  const [level, setLevel] = useState(3);
  const [character, setCharacter] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [twitterName, setTwitterName] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextLevel = () => {
    setLevel((prev) => {
      if (prev === 3) {
        setShowComingSoon(true); // show modal
        return prev;
      }
      return prev + 1;
    });
  };

  const handleExit = () => {
    setCharacter(null);
    setLevel(1);
    setShowComingSoon(false);
    setTwitterName("");
  };

  const handleShareTwitter = () => {
    if (!twitterName.trim()) return;

    const text = `I just conquered Level 3 in SENTIENT GAME! 🎮 It's really impressive, you should try it now! 
Player: ${twitterName} 
Play here: sentient-squidgame.vercel.app
#sentientAGI #sentientgame`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;

    window.open(url, "_blank");
  };

  if (!character) {
    return <CharacterSelect onSelect={setCharacter} />;
  }

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      {/* Header: logo + title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: isMobile ? "40px" : "60px",
            height: "auto",
          }}
        />
        <h2
          style={{
            color: "#000",
            backgroundColor: "#f7f7f7",
            display: "inline-block",
            padding: isMobile ? "4px 8px" : "8px 16px",
            borderRadius: "12px",
            fontSize: isMobile ? "14px" : "18px",
            margin: 0,
          }}
        >
          {isMobile
            ? `SENTIENT GAME – L${level}`
            : `SENTIENT GAME – Level ${level}`}
        </h2>
      </div>

      {/* Game theo level */}
      {level === 1 && (
        <RedLightGreenLight
          onWin={nextLevel}
          onExit={handleExit}
          mascot={character}
        />
      )}
      {level === 2 && (
        <TugOfWar onWin={nextLevel} onExit={handleExit} mascot={character} />
      )}
      {level === 3 && (
        <GlassBridge onWin={nextLevel} onExit={handleExit} mascot={character} />
      )}

      {/* Modal SS2 + nhập Twitter + Share */}
      {showComingSoon && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              width: isMobile ? "80%" : "400px",
            }}
          >
            <h2 style={{ color: "red", marginBottom: "20px" }}>
              🚀 Season 2 is coming soon!
            </h2>
            <input
              type="text"
              placeholder="@username"
              value={twitterName}
              onChange={(e) => setTwitterName(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "80%",
                marginBottom: "15px",
              }}
            />
            <br />
            <button
              onClick={handleShareTwitter}
              disabled={!twitterName.trim()}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1DA1F2",
                color: "#fff",
                cursor: twitterName.trim() ? "pointer" : "not-allowed",
              }}
            >
              📢 Share on X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
