import React from "react";
import mascotO from "../assets/images/mascot-o.png";
import mascotX from "../assets/images/mascot-x.png";
import "./CharacterSelect.css";

function CharacterSelect({ onSelect }) {
  return (
    <div className="select-container">
      <h2>Select Your Character</h2>
      <div className="characters">
        <div className="char-box" onClick={() => onSelect("o")}>
          <img src={mascotO} alt="Mascot O" />
          {/* <p>Đội O</p> */}
        </div>
        <div className="char-box" onClick={() => onSelect("x")}>
          <img src={mascotX} alt="Mascot X" />
          {/* <p>Đội X</p> */}
        </div>
      </div>
    </div>
  );
}

export default CharacterSelect;
