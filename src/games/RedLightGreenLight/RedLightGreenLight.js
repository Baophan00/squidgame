import React, { useState, useEffect, useRef } from "react";
import styles from "./RedLightGreenLight.module.css";
import mascotX from "../../assets/images/mascot-x.png";
import mascotO from "../../assets/images/mascot-o.png";
import dollImage from "../../assets/images/doll.png";
import guardImage from "../../assets/images/guard.png";
// import logo từ đây nếu muốn dùng ở ngoài container
// import logo from "../../assets/images/logo.jpg";

const music = new Audio("/sounds/mugunghwa.mp3");
music.loop = true;

function RedLightGreenLight({ onWin, onExit, mascot }) {
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [light, setLight] = useState("off");
  const [position, setPosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isStarted, setIsStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isFalling, setIsFalling] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const dollRef = useRef(null);
  const mascotImage = mascot === "x" ? mascotX : mascotO;

  useEffect(() => {
    if (!isStarted || gameOver || countdown !== null || isWinning) return;

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

    setLight("green");
    if (dollRef.current) {
      dollRef.current.classList.remove("turn", "look");
      dollRef.current.classList.add("turn");
    }
    music.play();

    timeout = setTimeout(toggleLight, Math.random() * 2000 + 3000);
    return () => clearTimeout(timeout);
  }, [isStarted, gameOver, countdown, isWinning]);

  useEffect(() => {
    if (
      !isStarted ||
      gameOver ||
      timeLeft <= 0 ||
      countdown !== null ||
      isWinning
    )
      return;

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver, isStarted, countdown, isWinning]);

  useEffect(() => {
    if (timeLeft === 0 && !gameOver && !isWinning) {
      setGameOver(true);
      const gunshot = new Audio("/sounds/gunshot.mp3");
      gunshot.play().catch(console.warn);

      setTimeout(() => {
        setIsFalling(true);
      }, 600);

      setTimeout(() => {
        setShowGameOverPopup(true);
      }, 1200);

      music.pause();
      music.currentTime = 0;
    }
  }, [timeLeft, gameOver, isWinning]);

  useEffect(() => {
    if (gameOver) {
      setLight("off");
      music.pause();
      music.currentTime = 0;
    }
  }, [gameOver]);

  const handleRun = () => {
    if (gameOver || !isStarted || isWinning) return;

    if (light === "red") {
      setGameOver(true);
      const gunshot = new Audio("/sounds/gunshot.mp3");
      gunshot.play().catch(console.warn);

      setTimeout(() => {
        setIsFalling(true);
      }, 600);

      setTimeout(() => {
        setShowGameOverPopup(true);
      }, 1200);
    } else {
      const step = 5;
      const newPos = position + step;
      setPosition(newPos);

      if (newPos >= 330) {
        music.pause();
        setIsWinning(true);
        const winSound = new Audio("/sounds/win.mp3");
        winSound.play().catch(console.warn);

        setTimeout(() => {
          setShowWinPopup(true);
        }, 1500);
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
    setIsFalling(false);
    setIsWinning(false);
    setShowWinPopup(false);
    setShowGameOverPopup(false);

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
    <div className={styles.gameWrapper}>
      {/* Chữ ngoài container */}
      <h3 style={{ color: "#000", textAlign: "center", marginBottom: "10px" }}>
        Red Light – Green Light
      </h3>

      <div className={styles.gameContainer}>
        <div className={styles.lightBox}>
          <div className={`${styles.circle} ${styles[light]}`}></div>
        </div>

        {countdown !== null && (
          <div className={styles.countdown}>⏳ {countdown}</div>
        )}

        <div className={`${styles.track} ${styles.vertical}`}>
          <div className={styles.finishLine}></div>

          <img
            src={mascotImage}
            className={`${styles.mascot} ${isFalling ? styles.fallen : ""}`}
            style={{ bottom: `${position}px` }}
            alt="Player"
          />

          <div className={styles.finishLineVertical}>
            <img
              src={dollImage}
              alt="Doll"
              className={`${styles.doll} turn`}
              ref={dollRef}
            />
            <img
              src={guardImage}
              alt="Guard Left"
              className={`${styles.guard} ${styles.left}`}
            />
            <img
              src={guardImage}
              alt="Guard Right"
              className={`${styles.guard} ${styles.right}`}
            />
          </div>
        </div>

        <p>⏳ Time left: {timeLeft}s</p>
        <div className={styles.buttons}>
          <button onClick={handleRun} disabled={gameOver || isWinning}>
            RUN
          </button>
          <button
            onClick={handleReset}
            disabled={isStarted || countdown !== null}
          >
            READY
          </button>
        </div>
      </div>

      {showWinPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>🎉 You Won!</h2>
            <p>Do you want to?</p>
            <div className={styles.popupButtons}>
              <button onClick={onWin} className={styles.popupContinue}>
                Continue
              </button>
              <button onClick={onExit} className={styles.popupExit}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {showGameOverPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>💀 Game Over</h2>
            <p>You lost!</p>
            <div className={styles.popupButtons}>
              <button onClick={onExit} className={styles.popupExit}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RedLightGreenLight;
