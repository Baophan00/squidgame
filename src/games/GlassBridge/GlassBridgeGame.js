// GlassBridgeGame.js
import React, { useState, useEffect, useRef } from "react";
import styles from "./GlassBridgeGame.module.css";
import mascotX from "../../assets/images/mascot-x.png";
import mascotO from "../../assets/images/mascot-o.png";

const bridgeLength = 5;
const timeLimit = 45;

function GlassBridgeGame({ onWin, onExit, mascot }) {
  const mascotImage = mascot === "x" ? mascotX : mascotO;

  const [bridge, setBridge] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [currentSide, setCurrentSide] = useState("left");
  const [isFalling, setIsFalling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [mascotPos, setMascotPos] = useState({ top: 0, left: "50%" });
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [hasWon, setHasWon] = useState(false); // 🆕 Thêm trạng thái thắng

  const rowRefs = useRef([]);
  const bridgeRef = useRef(null);

  useEffect(() => {
    if (!gameStarted || !bridgeRef.current) return;

    if (currentRow === bridgeLength) {
      const bridgeRect = bridgeRef.current.getBoundingClientRect();
      const lastRow = rowRefs.current[bridgeLength - 1];

      if (lastRow) {
        const rowRect = lastRow.getBoundingClientRect();
        const beyondRowTop = rowRect.bottom - 90 - bridgeRect.top;

        setMascotPos({
          top: beyondRowTop,
          left: currentSide === "left" ? "25%" : "75%",
        });
      }

      setHasWon(true); // 🆕 Đánh dấu đã thắng
      setTimeout(() => {
        setShowWinPopup(true);
      }, 700);
    }
  }, [currentRow, gameStarted, currentSide]);

  useEffect(() => {
    if (!gameStarted || gameOver || showWinPopup) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      setIsFalling(true);
      setTimeout(() => setShowGameOverPopup(true), 700);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, gameOver, showWinPopup]);

  useEffect(() => {
    if (currentRow === null || !gameStarted || !bridgeRef.current) return;

    const row = rowRefs.current[currentRow];
    const bridgeRect = bridgeRef.current.getBoundingClientRect();

    if (row && bridgeRect) {
      const rowRect = row.getBoundingClientRect();
      const rowCenter = rowRect.top + rowRect.height / 2 - bridgeRect.top;

      setMascotPos({
        top: rowCenter,
        left: currentSide === "left" ? "25%" : "75%",
      });
    }
  }, [currentRow, currentSide, gameStarted]);

  const generateBridge = () => {
    return Array(bridgeLength).fill("right");
  };

  const handleStart = () => {
    setBridge(generateBridge());
    setCurrentRow(null);
    setCurrentSide("left");
    setGameStarted(true);
    setGameOver(false);
    setIsFalling(false);
    setTimeLeft(timeLimit);
    setShowWinPopup(false);
    setShowGameOverPopup(false);
    setHasWon(false); // 🆕 Reset trạng thái thắng
  };

  const handleStep = (side) => {
    if (!gameStarted || gameOver || isFalling || showWinPopup || hasWon) return; // 🆕 chặn nếu đã thắng

    const nextRow = currentRow === null ? 0 : currentRow + 1;

    setCurrentSide(side);
    setCurrentRow(nextRow);

    if (nextRow === bridgeLength) return;

    const correct = bridge[nextRow] === side;
    if (!correct) {
      setIsFalling(true);
      setTimeout(() => {
        setGameOver(true);
        setShowGameOverPopup(true);
      }, 1000);
    }
  };

  const handleRestart = () => {
    handleStart();
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Glass Bridge</h3>
      <p className={styles.timer}>⏳ Time left: {timeLeft}s</p>

      <div className={styles.bridgeTrack} ref={bridgeRef}>
        {bridge.map((_, index) => (
          <div
            key={index}
            className={styles.bridgeRow}
            ref={(el) => (rowRefs.current[index] = el)}
          >
            <div className={styles.glassPanel} />
            <div className={styles.glassPanel} />
          </div>
        ))}

        {gameStarted && currentRow !== null && (
          <img
            src={mascotImage}
            alt="Mascot"
            className={`${styles.mascot} ${isFalling ? styles.falling : ""}`}
            style={{
              position: "absolute",
              top: mascotPos.top,
              left: mascotPos.left,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {!gameStarted || currentRow === null ? (
          <div className={styles.startingArea}>
            <img
              src={mascotImage}
              alt="Mascot"
              className={styles.mascotStart}
            />
          </div>
        ) : null}
      </div>

      <div className={styles.buttonPanel}>
        {!showWinPopup && !showGameOverPopup && (
          <div className={styles.directionButtons}>
            <button
              onClick={() => handleStep("left")}
              disabled={!gameStarted || gameOver || hasWon} // 🆕 Khoá nếu đã thắng
              className={styles.actionButton}
            >
              LEFT
            </button>
            <button
              onClick={() => handleStep("right")}
              disabled={!gameStarted || gameOver || hasWon} // 🆕 Khoá nếu đã thắng
              className={styles.actionButton}
            >
              RIGHT
            </button>
          </div>
        )}

        {!gameStarted && (
          <button onClick={handleStart} className={styles.readyButton}>
            READY
          </button>
        )}
      </div>

      {/* Popup khi thắng */}
      {showWinPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>🎉 You Won!</h2>
            <p>Do you want to continue or exit?</p>
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

      {/* Popup khi thua */}
      {showGameOverPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>💀 Game Over</h2>
            <p>You lost! Want to try again?</p>
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

export default GlassBridgeGame;
