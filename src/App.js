import React, { useState } from "react";
import CharacterSelect from "./components/CharacterSelect";
import RedLightGreenLight from "./games/RedLightGreenLight/RedLightGreenLight";
import TugOfWar from "./games/TugOfWar";
import GlassBridge from "./games/GlassBridge";
import Marbles from "./games/Marbles";
import FinalGame from "./games/FinalGame";

function App() {
  const [level, setLevel] = useState(1);
  const [character, setCharacter] = useState(null); // 🧍‍♂️ Chọn nhân vật

  const nextLevel = () => setLevel((prev) => prev + 1);

  const handleExit = () => {
    setCharacter(null); // Trở về màn chọn nhân vật
    setLevel(1); // Reset level về 1
  };

  // Nếu chưa chọn nhân vật thì hiển thị màn chọn
  if (!character) {
    return <CharacterSelect onSelect={setCharacter} />;
  }

  return (
    <div>
      <h2>🕹 SQUID GAME – Level {level}</h2>

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
