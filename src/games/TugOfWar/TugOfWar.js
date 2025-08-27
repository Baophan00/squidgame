import React, { useState, useEffect, useRef } from "react";
import styles from "./TugOfWar.module.css";
import playerImg from "../../assets/images/mascot-o.png";
import aiImg from "../../assets/images/sentientbot.png";
import logo from "../../assets/images/logo.jpg"; // ✅ Import logo

const KEY_POOL = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "S",
  "E",
  "N",
  "T",
  "I",
  "E",
  "N",
  "T",
];
const MAX_PULL = 10;
const PULL_UNIT = 10; // px per move
const DESKTOP_WIDTH = 700; // width battlefield desktop (theo CSS thiết kế)

function getRandomSequence(length = 4) {
  return Array.from(
    { length },
    () => KEY_POOL[Math.floor(Math.random() * KEY_POOL.length)]
  );
}

function getScaledOffset(position) {
  const screenWidth = window.innerWidth;
  const scale = screenWidth < DESKTOP_WIDTH ? screenWidth / DESKTOP_WIDTH : 1;
  return position * PULL_UNIT * scale;
}

export default function TugOfWar({ onWin, onExit }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [input, setInput] = useState([]);
  const [position, setPosition] = useState(0);
  const [scaledOffset, setScaledOffset] = useState(0);
  const [result, setResult] = useState(null);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [nearFall, setNearFall] = useState(false);
  const [fallAnimation, setFallAnimation] = useState(null);

  const winAudio = useRef(null);
  const lostAudio = useRef(null);
  const screamAudio = useRef(null);

  useEffect(() => {
    winAudio.current = new Audio("/sounds/win.mp3");
    lostAudio.current = new Audio("/sounds/lost.mp3");
    screamAudio.current = new Audio("/sounds/scream.mp3");
  }, []);

  // Update scaledOffset khi position hoặc kích thước màn thay đổi
  useEffect(() => {
    function updateOffset() {
      setScaledOffset(getScaledOffset(position));
    }
    updateOffset();

    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [position]);

  function startGame() {
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setGameStarted(true);
        setSequence(getRandomSequence(4));
        setCountdown(0);
      } else {
        setCountdown(count);
      }
    }, 1000);
  }

  useEffect(() => {
    if (gameStarted && result === null) {
      const aiInterval = setInterval(() => {
        if (Math.random() < 0.6) {
          setPosition((prev) => {
            const newPos = Math.min(MAX_PULL, prev + 1);
            if (newPos >= 9) setNearFall(true);
            else setNearFall(false);
            if (newPos >= MAX_PULL) {
              endGame("lose");
            }
            return newPos;
          });
        }
      }, 1500);
      return () => clearInterval(aiInterval);
    }
  }, [gameStarted, result]);

  function handleKeyPress(key) {
    if (!gameStarted || result !== null) return;

    const expected = sequence[input.length]?.toUpperCase();
    const pressed = key.toUpperCase();

    if (pressed === expected) {
      const newInput = [...input, pressed];
      setInput(newInput);
      setFeedback("correct");

      if (newInput.length === sequence.length) {
        setPosition((prev) => {
          const newPos = Math.max(-MAX_PULL, prev - 1);
          if (newPos <= -9) setNearFall(true);
          else setNearFall(false);
          if (newPos <= -MAX_PULL) {
            endGame("win");
          }
          return newPos;
        });
        setSequence(getRandomSequence(4));
        setInput([]);
      }
    } else {
      setInput([]);
      setFeedback("wrong");
      setSequence(getRandomSequence(4));
    }

    setTimeout(() => setFeedback(null), 400);
  }

  function handleKeyDown(e) {
    handleKeyPress(e.key);
  }

  function endGame(resultType) {
    setResult(resultType);
    setGameStarted(false);
    setNearFall(false);

    if (resultType === "win") {
      setFallAnimation("aiFallLeft");
      winAudio.current?.play();
      setTimeout(() => {
        setShowWinPopup(true);
      }, 1200);
    } else {
      setFallAnimation("playerFallRight");

      // Phát tiếng hét rồi mới phát tiếng thua
      screamAudio.current?.play();
      setTimeout(() => {
        lostAudio.current?.play();
      }, 400);

      setTimeout(() => {
        setShowGameOverPopup(true);
      }, 1200);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.gameTitle}>Tug Of War</h1>

      {countdown > 0 && <div className={styles.countdown}>{countdown}</div>}

      <div className={styles.nearFallContainer}>
        <div
          className={`${styles.nearFallWarning} ${
            nearFall ? styles.visible : styles.hidden
          }`}
        >
          ⚠️ Watch out!
        </div>
      </div>

      <div className={styles.battlefield}>
        {/* ✅ Logo in battlefield */}
        <img src={logo} alt="Project Logo" className={styles.gameLogo} />

        <div className={styles.bridge}>
          <div className={styles.bridgeSide}>SENTIENT</div>
          <div className={styles.bridgeSide}>SENTIENT</div>
        </div>

        <div
          className={styles.characters}
          style={{
            left: "50%",
            top: "45%",
            transform: `translate(calc(-50% + ${scaledOffset}px), -50%)`,
          }}
        >
          <img
            src={playerImg}
            alt="player"
            className={`${styles.mascotLeft} ${
              fallAnimation === "playerFallRight" ? styles.fallRight : ""
            }`}
          />
          <div className={styles.ropeLine}>🪢</div>
          <img
            src={aiImg}
            alt="ai"
            className={`${styles.mascotRight} ${
              fallAnimation === "aiFallLeft" ? styles.fallLeft : ""
            }`}
          />
        </div>
      </div>

      <div className={styles.sequence}>
        {sequence.map((key, i) => (
          <span
            key={i}
            className={`${styles.key} ${
              feedback === "correct" && i < input.length
                ? styles.correct
                : feedback === "wrong" && i === 0
                ? styles.wrong
                : ""
            }`}
          >
            {key.replace("Arrow", "")}
          </span>
        ))}
      </div>

      {gameStarted && (
        <div className={styles.virtualKeypad}>
          {KEY_POOL.map((k) => (
            <button
              key={k}
              className={styles.virtualKey}
              onClick={() => handleKeyPress(k)}
            >
              {k.replace("Arrow", "")}
            </button>
          ))}
        </div>
      )}

      {!gameStarted && result === null && countdown === 0 && (
        <button className={styles.readyButton} onClick={startGame}>
          Ready
        </button>
      )}

      {showWinPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>🎉 You Won!</h2>
            <p>Do you want to continue?</p>
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
