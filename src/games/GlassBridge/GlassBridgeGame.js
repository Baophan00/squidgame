import React, { useState, useEffect, useRef } from "react";
import styles from "./GlassBridgeGame.module.css";
import mascotX from "../../assets/images/mascot-x.png";
import mascotO from "../../assets/images/mascot-o.png";

const bridgeLength = 5;
const timeLimit = 25;

function GlassBridgeGame({ onWin, onExit, mascot }) {
  const mascotImage = mascot === "x" ? mascotX : mascotO;

  const [bridge, setBridge] = useState([]);
  const [glassStatus, setGlassStatus] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [currentSide, setCurrentSide] = useState("left");
  const [isFalling, setIsFalling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [mascotPos, setMascotPos] = useState({ top: "100%", left: "50%" });
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const rowRefs = useRef([]);
  const bridgeRef = useRef(null);
  const stepSoundRef = useRef(null);
  const breakSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const lostSoundRef = useRef(null);

  useEffect(() => {
    stepSoundRef.current = new Audio("/sounds/step_correct.wav");
    breakSoundRef.current = new Audio("/sounds/glass_break.wav");
    winSoundRef.current = new Audio("/sounds/win.mp3");
    lostSoundRef.current = new Audio("/sounds/lost.mp3");
  }, []);

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

      setHasWon(true);
      winSoundRef.current?.play();
      setTimeout(() => setShowWinPopup(true), 700);
    }
  }, [currentRow, gameStarted, currentSide]);

  useEffect(() => {
    if (!gameStarted || gameOver || showWinPopup) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      setIsFalling(true);
      lostSoundRef.current?.play();
      bridgeRef.current?.classList.add(styles.globalBreak);
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

  useEffect(() => {
    if (countdown !== null) {
      const interval = setInterval(() => {
        setCountdown((c) => {
          if (c > 1) return c - 1;
          clearInterval(interval);
          setCountdown(null);
          startGame();
          return null;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  const startGame = () => {
    setBridge(generateBridge());
    setGlassStatus(Array(bridgeLength).fill(null));
    setCurrentRow(null);
    setCurrentSide("left");
    setGameStarted(true);
    setGameOver(false);
    setIsFalling(false);
    setTimeLeft(timeLimit);
    setShowWinPopup(false);
    setShowGameOverPopup(false);
    setHasWon(false);
  };

  const generateBridge = () => {
    return Array(bridgeLength).fill("right");
  };

  const handleReady = () => {
    if (!gameStarted && countdown === null) {
      setCountdown(3);
    }
  };

  const handleStep = (side) => {
    if (!gameStarted || gameOver || isFalling || showWinPopup || hasWon) return;
    const nextRow = currentRow === null ? 0 : currentRow + 1;
    const correct = bridge[nextRow] === side;

    setCurrentSide(side);
    setCurrentRow(nextRow);

    setGlassStatus((prev) => {
      const newStatus = [...prev];
      if (currentRow !== null) newStatus[currentRow] = null;
      newStatus[nextRow] = correct ? side : "wrong-" + side;
      return newStatus;
    });

    if (nextRow === bridgeLength) return;

    if (correct) {
      stepSoundRef.current?.play();
    } else {
      setIsFalling(true);
      breakSoundRef.current?.pause();
      breakSoundRef.current.currentTime = 0;
      breakSoundRef.current.play();

      lostSoundRef.current?.pause();
      lostSoundRef.current.currentTime = 0;
      lostSoundRef.current.play();

      setTimeout(() => {
        setGameOver(true);
        setShowGameOverPopup(true);
      }, 700);
    }
  };

  return (
    <div className={styles.gameFrame}>
      <div className={styles.container}>
        <h3 className={styles.title}>Glass Bridge</h3>
        {/* <div className={styles.logoIrys}>IRYS</div> */}
        <p className={styles.timer}>⏳ Time left: {timeLeft}s</p>

        {countdown !== null && (
          <div className={styles.countdown}>⏳ {countdown}</div>
        )}

        <div className={`${styles.bridgeTrack}`} ref={bridgeRef}>
          <div className={styles.logoIrys}>IRYS</div>
          {bridge.map((_, index) => (
            <div
              key={index}
              className={styles.bridgeRow}
              ref={(el) => (rowRefs.current[index] = el)}
            >
              <div
                className={`${styles.glassPanel} ${
                  glassStatus[index] === "left"
                    ? styles.correct
                    : glassStatus[index] === "wrong-left"
                    ? styles.wrong
                    : ""
                }`}
              />
              <div
                className={`${styles.glassPanel} ${
                  glassStatus[index] === "right"
                    ? styles.correct
                    : glassStatus[index] === "wrong-right"
                    ? styles.wrong
                    : ""
                }`}
              />
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
                transition: isFalling
                  ? "none"
                  : "top 0.3s ease, left 0.3s ease",
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
                disabled={
                  !gameStarted || gameOver || hasWon || countdown !== null
                }
                className={styles.actionButton}
              >
                LEFT
              </button>
              <button
                onClick={() => handleStep("right")}
                disabled={
                  !gameStarted || gameOver || hasWon || countdown !== null
                }
                className={styles.actionButton}
              >
                RIGHT
              </button>
            </div>
          )}

          {!gameStarted && countdown === null && (
            <button onClick={handleReady} className={styles.readyButton}>
              READY
            </button>
          )}
        </div>

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
    </div>
  );
}

export default GlassBridgeGame;
