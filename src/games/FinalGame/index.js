import React, { useEffect, useState } from "react";
import "./style.css";

const winSound = new Audio("/sounds/win.mp3");
const lostSound = new Audio("/sounds/lost.mp3");
const attackSound = new Audio("/sounds/attack.wav");
const blockSound = new Audio("/sounds/block.wav");
const hitSound = new Audio("/sounds/hit.wav");

function FinalGame({ onWin }) {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [turn, setTurn] = useState("player");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30); // 30s countdown

  useEffect(() => {
    if (timer === 0) {
      setMessage("⏱ Time's up! You lost!");
      lostSound.play();
    }
    if (timer > 0 && playerHealth > 0 && enemyHealth > 0) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleAttack = () => {
    if (turn !== "player" || playerHealth <= 0 || enemyHealth <= 0) return;
    const damage = Math.floor(Math.random() * 20) + 5;
    attackSound.play();
    setEnemyHealth((prev) => Math.max(prev - damage, 0));
    setMessage(`🗡 You hit the enemy for ${damage} damage!`);
    setTurn("enemy");
  };

  const handleBlock = () => {
    if (turn !== "player") return;
    blockSound.play();
    setMessage("🛡 You are ready to block!");
    setTurn("enemy");
  };

  useEffect(() => {
    if (enemyHealth <= 0) {
      setMessage("🏆 You won the duel!");
      winSound.play();
      setTimeout(() => {
        onWin();
      }, 2000);
    } else if (playerHealth <= 0) {
      setMessage("💀 You lost the duel!");
      lostSound.play();
    } else if (turn === "enemy") {
      const enemyTurn = setTimeout(() => {
        const action = Math.random() > 0.3 ? "attack" : "miss";
        if (action === "attack") {
          const damage = Math.floor(Math.random() * 15) + 5;
          hitSound.play();
          setPlayerHealth((prev) => Math.max(prev - damage, 0));
          setMessage(`😈 Enemy attacks you for ${damage} damage!`);
        } else {
          setMessage("😈 Enemy missed!");
        }
        setTurn("player");
      }, 1000);

      return () => clearTimeout(enemyTurn);
    }
  }, [turn, enemyHealth, playerHealth, onWin]);

  return (
    <div className="final-game">
      <h2>⚔ Final Duel</h2>
      <p>Time left: {timer}s</p>
      <div className="health-bars">
        <p>👤 You: {playerHealth}</p>
        <p>👾 Enemy: {enemyHealth}</p>
      </div>
      <div className="actions">
        <button onClick={handleAttack} disabled={turn !== "player"}>
          Attack
        </button>
        <button onClick={handleBlock} disabled={turn !== "player"}>
          Block
        </button>
      </div>
      <p className="message">{message}</p>
    </div>
  );
}

export default FinalGame;
