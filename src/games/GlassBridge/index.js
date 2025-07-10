import React, { useState, useEffect } from "react";
import "./style.css";

function GlassBridge({ onWin }) {
  const TOTAL_STEPS = 5;

  const [currentStep, setCurrentStep] = useState(0);
  const [safePath, setSafePath] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // Tạo đường kính ngẫu nhiên
  useEffect(() => {
    const path = Array.from({ length: TOTAL_STEPS }, () =>
      Math.random() < 0.5 ? "left" : "right"
    );
    setSafePath(path);
  }, []);

  const handleJump = (side) => {
    if (isGameOver) return;

    const correctSide = safePath[currentStep];

    if (side === correctSide) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === TOTAL_STEPS) {
        setIsGameOver(true);
        setMessage("🎉 YOU WIN! You crossed the bridge.");
        onWin();
      }
    } else {
      setIsGameOver(true);
      setMessage("💀 WRONG GLASS! You fell.");
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsGameOver(false);
    setMessage("");
    const newPath = Array.from({ length: TOTAL_STEPS }, () =>
      Math.random() < 0.5 ? "left" : "right"
    );
    setSafePath(newPath);
  };

  return (
    <div className="game-screen">
      <h2>🪟 Glass Bridge</h2>
      <p>
        Step: {currentStep} / {TOTAL_STEPS}
      </p>
      <p>Choose the correct glass panel:</p>

      <div className="bridge">
        <button onClick={() => handleJump("left")} disabled={isGameOver}>
          LEFT
        </button>
        <button onClick={() => handleJump("right")} disabled={isGameOver}>
          RIGHT
        </button>
      </div>

      <p className="message">{message}</p>

      {isGameOver && (
        <button onClick={handleReset} className="reset-btn">
          PLAY AGAIN
        </button>
      )}
    </div>
  );
}

export default GlassBridge;
