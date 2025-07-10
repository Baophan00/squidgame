import React, { useEffect, useState } from "react";
import "./style.css";

function TugOfWar({ onWin }) {
  const [position, setPosition] = useState(0); // 0 là giữa, -100 là player thắng, 100 là AI thắng
  const [message, setMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(30); // countdown 30s

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setPosition((prev) => Math.min(prev + 10, 100)); // AI kéo
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver]);

  useEffect(() => {
    if (position <= -100) {
      setMessage("🎉 You win!");
      setIsGameOver(true);
      onWin();
    } else if (position >= 100) {
      setMessage("💀 You lost!");
      setIsGameOver(true);
    }
  }, [position, onWin]);

  useEffect(() => {
    if (timer === 0 && !isGameOver) {
      setMessage("⏰ Time's up! You lost!");
      setIsGameOver(true);
    }

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, isGameOver]);

  const handlePull = () => {
    if (isGameOver) return;
    setPosition((prev) => Math.max(prev - 15, -100)); // người chơi kéo
  };

  const handleReset = () => {
    setPosition(0);
    setMessage("");
    setIsGameOver(false);
    setTimer(30);
  };

  return (
    <div className="tug-container">
      <h2>🤼 TUG OF WAR</h2>
      <div className="progress-bar">
        <div className="player" style={{ left: `${50 + position / 2}%` }}></div>
      </div>
      <p>⏳ Time left: {timer}s</p>
      <p>📍 Rope position: {position}</p>
      <div className="buttons">
        <button onClick={handlePull} disabled={isGameOver}>
          PULL
        </button>
        <button onClick={handleReset}>RESET</button>
      </div>
      <p className="result">{message}</p>
    </div>
  );
}

export default TugOfWar;
