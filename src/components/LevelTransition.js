// src/components/LevelTransition.js
import React, { useEffect } from "react";
import "./LevelTransition.css";

function LevelTransition({ message = "🎉 You Win!", duration = 2000, onDone }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDone?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onDone]);

  return (
    <div className="level-transition-overlay">
      <div className="level-transition-message">{message}</div>
    </div>
  );
}

export default LevelTransition;
