import React, { useState } from "react";
import "./GamePlayModal.css";
import leafHat from "../assets/leaf-hat.png";

// Valid question range
const MIN_QUESTION = 1;
const MAX_QUESTION = 34;

function GamePlayModal({
  isOpen,
  onClose,
  currentTeamName,
  onSubmit,
  onSkip,
  onHopeSquare,
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  // Validate if the input is a valid question number
  const getValidNumber = () => {
    const normalized = (value || "").toString().trim();
    const digitsMatch = normalized.match(/\d+/);
    if (!digitsMatch) return null;
    const num = parseInt(digitsMatch[0], 10);
    if (num >= MIN_QUESTION && num <= MAX_QUESTION) {
      return num;
    }
    return null;
  };

  const isValidInput = getValidNumber() !== null;

  const handleAccept = () => {
    const validNum = getValidNumber();
    if (validNum !== null && onSubmit) {
      onSubmit(validNum.toString());
    }
  };

  const handleSkip = () => {
    setValue("");
    if (onSkip) {
      onSkip();
    } else if (onClose) {
      onClose();
    }
  };

  const handleHopeSquare = () => {
    if (onHopeSquare) {
      onHopeSquare();
    }
  };

  return (
    <div className={`gameplay-overlay ${isOpen ? "open" : ""}`}>
      <div className="gameplay-sheet">
        <h2 className="gameplay-title">Nhập số trên mảnh ghép</h2>

        <div className={`gameplay-input-pill ${focused ? "focused" : ""}`}>
          <input
            className="gameplay-number-input"
            type="text"
            aria-label="Nhập số"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>

        <button
          className={`gameplay-accept ${!isValidInput ? "disabled" : ""}`}
          onClick={handleAccept}
          disabled={!isValidInput}
        >
          Nhận thử thách
        </button>
        <button className="gameplay-leaf-button" onClick={handleHopeSquare}>
          <img src={leafHat} className="gameplay-leaf" alt="leaf hat" />
          <span>Nón lá hi vọng</span>
        </button>
        <button className="gameplay-skip" onClick={handleSkip}>
          Bỏ qua
        </button>
      </div>
    </div>
  );
}

export default GamePlayModal;
