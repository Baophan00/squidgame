import React, { useState, useEffect } from "react";
import "./style.css";

function Marbles({ onWin }) {
  const [marbles, setMarbles] = useState(10);
  const [bet, setBet] = useState(1);
  const [guess, setGuess] = useState("even");
  const [result, setResult] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // ⏱️ 60 giây đếm ngược

  useEffect(() => {
    if (gameOver) return;

    if (timeLeft <= 0) {
      setResult("⏰ Time's up! You lost the game.");
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const playRound = () => {
    if (bet <= 0 || bet > marbles) {
      setResult("❌ Invalid bet.");
      return;
    }

    const number = Math.floor(Math.random() * 10) + 1;
    const isEven = number % 2 === 0;
    const win = (guess === "even" && isEven) || (guess === "odd" && !isEven);

    let newMarbles = marbles + (win ? bet : -bet);
    setMarbles(newMarbles);

    if (win) {
      setResult(`✅ You guessed right! Number was ${number}. +${bet} marbles.`);
    } else {
      setResult(`❌ Wrong guess. Number was ${number}. -${bet} marbles.`);
    }

    if (newMarbles >= 20) {
      setResult("🎉 You won the marbles game!");
      setGameOver(true);
      setTimeout(() => onWin(), 2000);
    } else if (newMarbles <= 0) {
      setResult("💀 You lost all your marbles.");
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setMarbles(10);
    setBet(1);
    setGuess("even");
    setResult("");
    setGameOver(false);
    setTimeLeft(60); // reset đồng hồ
  };

  return (
    <div className="marbles-game">
      <h2>🟠 Marbles Game</h2>
      <p>🎯 Goal: Reach 20 marbles</p>
      <p>
        🧮 Your marbles: <strong>{marbles}</strong>
      </p>
      <p className="timer">⏱ Time Left: {timeLeft}s</p>

      {!gameOver && (
        <>
          <label>
            Bet:
            <input
              type="number"
              value={bet}
              min="1"
              max={marbles}
              onChange={(e) => setBet(Number(e.target.value))}
            />
          </label>

          <div className="guess-buttons">
            <button
              className={guess === "even" ? "active" : ""}
              onClick={() => setGuess("even")}
            >
              Even
            </button>
            <button
              className={guess === "odd" ? "active" : ""}
              onClick={() => setGuess("odd")}
            >
              Odd
            </button>
          </div>

          <button onClick={playRound}>Play Round</button>
        </>
      )}

      <p className="result">{result}</p>

      {gameOver && (
        <button className="reset" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default Marbles;
