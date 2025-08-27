import React, { useState } from "react";
import CharacterSelect from "./components/CharacterSelect";
import RedLightGreenLight from "./games/RedLightGreenLight/RedLightGreenLight";
import TugOfWar from "./games/TugOfWar";
import GlassBridge from "./games/GlassBridge";
import Marbles from "./games/Marbles";
import FinalGame from "./games/FinalGame";
import logo from "./assets/images/logo.jpg"; // logo dùng cho toàn app

function App() {
  const [level, setLevel] = useState(1); // Start from level 1
  const [character, setCharacter] = useState(null); // Selected character

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
      {/* Logo góc trái */}
      <img
        src={logo}
        alt="logo"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "60px",
          height: "auto",
          zIndex: 10,
        }}
      />

      {/* Tiêu đề chính */}
      <h2
        style={{
          color: "#000",
          backgroundColor: "#f7f7f7",
          display: "inline-block",
          padding: "8px 16px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        SENTIENT GAME – Level {level}
      </h2>

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
