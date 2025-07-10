// src/games/RedLightGreenLight/index.js
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import mascotX from "../../assets/images/mascot-x.png";
import mascotO from "../../assets/images/mascot-o.png";

const music = new Audio("/sounds/mugunghwa.mp3");
music.loop = true;

function RedLightGreenLight({ onWin, mascot }) {
  const [light, setLight] = useState("off"); // "off", "green", "red"
  const [position, setPosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isStarted, setIsStarted] = useState(false);
  const [countdown, setCountdown] = useState(null); // 3 → 2 → 1 → null
  const gunshot = useRef(new Audio("/sounds/gunshot.mp3"));
  const dollRef = useRef(null);
  const mascotImage = mascot === "x" ? mascotX : mascotO;

  useEffect(() => {
    if (!isStarted || gameOver || countdown !== null) return;

    let timeout;

    const toggleLight = () => {
      setLight((prev) => {
        const next = prev === "green" ? "red" : "green";

        if (dollRef.current) {
          dollRef.current.classList.remove("turn", "look");
          dollRef.current.classList.add(next === "red" ? "look" : "turn");
        }

        if (next === "green") {
          if (music.paused) music.play();
        } else {
          music.pause();
          music.currentTime = 0;
        }

        return next;
      });

      timeout = setTimeout(toggleLight, Math.random() * 2000 + 3000);
    };

    // Bắt đầu đèn xanh và bật nhạc sau countdown
    setLight("green");
    if (dollRef.current) {
      dollRef.current.classList.remove("turn", "look");
      dollRef.current.classList.add("turn");
    }
    music.play();

    timeout = setTimeout(toggleLight, Math.random() * 2000 + 3000);

    return () => clearTimeout(timeout);
  }, [isStarted, gameOver, countdown]);

  useEffect(() => {
    if (!isStarted || gameOver || timeLeft <= 0 || countdown !== null) return;

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver, isStarted, countdown]);

  useEffect(() => {
    if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      try {
        gunshot.current.currentTime = 0;
        gunshot.current.play().catch(console.warn);
      } catch (e) {
        console.error("Audio play failed:", e);
      }

      setTimeout(() => alert("⏱️ Time's up! 💀 GAME OVER"), 400);
      music.pause();
      music.currentTime = 0;
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (gameOver) {
      setLight("off");
      music.pause();
      music.currentTime = 0;
    }
  }, [gameOver]);

  const handleRun = () => {
    if (gameOver || !isStarted) return;

    if (light === "red") {
      try {
        gunshot.current.currentTime = 0;
        gunshot.current.play().catch(console.warn);
        setTimeout(() => {
          gunshot.current.pause();
          gunshot.current.currentTime = 0;
        }, 1000);
      } catch (e) {
        console.error("Audio play failed:", e);
      }

      setGameOver(true);
      setTimeout(() => alert("💀 GAME OVER"), 600);
    } else {
      const step = 5;
      const newPos = position + step;
      setPosition(newPos);

      if (newPos >= 330) {
        music.pause();
        onWin();
      }
    }
  };

  const handleReset = () => {
    setPosition(0);
    setGameOver(false);
    setLight("off");
    setTimeLeft(30);
    setIsStarted(false);
    setCountdown(3);

    music.pause();
    music.currentTime = 0;

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsStarted(true);
      }
    }, 1000);
  };

  return (
    <div className="game-container">
      <h3>Red Light – Green Light</h3>

      <div className="light-box">
        <div className={`circle ${light}`}></div>
      </div>

      {countdown !== null && <div className="countdown">⏳ {countdown}</div>}

      <div className="track vertical">
        {/* ✅ Vạch đích nằm riêng */}
        <div className="finish-line"></div>

        <img
          src={mascotImage}
          className="mascot"
          style={{ bottom: `${position}px` }}
          alt="Player"
        />

        {/* ✅ Búp bê và lính */}
        <div className="finish-line-vertical">
          <img
            src={require("../../assets/images/doll.png")}
            alt="Doll"
            className="doll"
            ref={dollRef}
          />
          <img
            src={require("../../assets/images/guard.png")}
            alt="Guard Left"
            className="guard left"
          />
          <img
            src={require("../../assets/images/guard.png")}
            alt="Guard Right"
            className="guard right"
          />
        </div>
      </div>

      <p>⏳ Time left: {timeLeft}s</p>
      <div className="buttons">
        <button onClick={handleRun} disabled={gameOver}>
          RUN
        </button>
        <button onClick={handleReset}>READY</button>
      </div>
    </div>
  );
}

export default RedLightGreenLight;
