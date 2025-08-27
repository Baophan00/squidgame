import React, { useState, useEffect } from "react";
import CharacterSelect from "./components/CharacterSelect";
import RedLightGreenLight from "./games/RedLightGreenLight/RedLightGreenLight";
import TugOfWar from "./games/TugOfWar";
import GlassBridge from "./games/GlassBridge";
import Marbles from "./games/Marbles";
import FinalGame from "./games/FinalGame";
import logo from "./assets/images/logo.jpg"; // logo dùng cho toàn app

function App() {
  const [level, setLevel] = useState(3); // Start from level 1
  const [character, setCharacter] = useState(null); // Selected character
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextLevel = () => setLevel((prev) => prev + 1);

  const handleExit = () => {
    setCharacter(null); // Quay lại chọn nhân vật
    setLevel(1); // Reset level
  };

  // Nếu chưa chọn nhân vật, hiển thị màn hình chọn nhân vật
  if (!character) {
    return <CharacterSelect onSelect={setCharacter} />;
  }

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      {/* Header container: Logo + Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          style={{
            width: isMobile ? "40px" : "60px",
            height: "auto",
          }}
        />

        {/* Tiêu đề chính */}
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
      {level === 4 && (
        <Marbles onWin={nextLevel} onExit={handleExit} mascot={character} />
      )}
      {level === 5 && (
        <FinalGame
          onWin={() => alert("🎉 You completed all games!")}
          onExit={handleExit}
          mascot={character}
        />
      )}
    </div>
  );
}

export default App;
