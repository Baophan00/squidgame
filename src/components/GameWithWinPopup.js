// import React, { useState } from "react";

// /**
//  * A reusable wrapper component for any game that shows a win popup
//  * and allows the user to continue to a new game or exit.
//  *
//  * @param {React.ComponentType} GameComponent - The actual game component
//  * @param {string} mascot - The character type ("x" or "o")
//  * @param {function} onExitAll - Optional callback when exiting the game
//  */
// function GameWithWinPopup({ GameComponent, mascot = "x", onExitAll }) {
//   const [gameIndex, setGameIndex] = useState(0);
//   const [showWinPopup, setShowWinPopup] = useState(false);
//   const [gameStopped, setGameStopped] = useState(false);

//   const handleWin = () => {
//     setShowWinPopup(true);
//   };

//   const handleContinue = () => {
//     setShowWinPopup(false);
//     setGameIndex((prev) => prev + 1); // Trigger new game by changing key
//   };

//   const handleExit = () => {
//     setShowWinPopup(false);
//     setGameStopped(true);
//     if (onExitAll) onExitAll(); // Optional external handler
//   };

//   if (gameStopped) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "80px" }}>
//         <h2>👋 Thanks for playing!</h2>
//         <button
//           onClick={() => {
//             setGameStopped(false);
//             setGameIndex(0);
//           }}
//         >
//           🔁 Restart
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <GameComponent key={gameIndex} mascot={mascot} onWin={handleWin} />
//       {showWinPopup && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.6)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 999,
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               padding: "30px",
//               borderRadius: "10px",
//               textAlign: "center",
//             }}
//           >
//             <h2>🎉 You Won!</h2>
//             <p>Would you like to continue or exit?</p>
//             <button onClick={handleContinue} style={{ marginRight: "10px" }}>
//               🔁 Continue
//             </button>
//             <button onClick={handleExit}>🚪 Exit</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GameWithWinPopup;
