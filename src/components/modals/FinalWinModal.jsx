import React, { useEffect, useRef } from "react";
import "./FinalWinModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";
import confettiImage from "../../assets/confetti-decoration.svg";

export default function FinalWinModal({
  isOpen,
  onClose,
  onReplay,
  winnerTeam,
  loserTeam,
  winnerScore,
  loserScore,
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (isOpen && rootRef.current) {
      rootRef.current.focus();
    }
  }, [isOpen]);

  const handleReplay = () => {
    if (onReplay) {
      onReplay();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleReplay();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="gameplay-overlay open"
      ref={rootRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="gameplay-sheet final-win-sheet">
        <div className="final-win-container">
          {/* Background card with confetti decoration */}
          <div className="final-background-card">
            <img
              src={confettiImage}
              alt="confetti"
              className="final-confetti-decoration"
            />
          </div>

          {/* Main content wrapper */}
          <div className="final-content-wrapper">
            {/* Winner section */}
            <div className="final-winner-section">
              {/* Congratulations heading with logo */}
              <div className="final-win-header">
                <div className="final-logo-container">
                  <img
                    src={challengeLogo}
                    alt="challenge"
                    className="final-logo"
                  />
                </div>
                <h1 className="final-congratulations">CHÚC MỪNG</h1>
              </div>

              {/* Winner team info */}
              <h2 className="final-winner-team">{winnerTeam}</h2>

              <div className="final-score-display">
                <span className="final-score-number">{winnerScore}</span>
              </div>
            </div>

            {/* Loser section */}
            <div className="final-loser-section">
              <h3 className="final-loser-team">{loserTeam}</h3>
              <p className="final-loser-message">Cố gắng lần sau nhé!</p>
            </div>

            {/* Replay button */}
            <div className="final-button-wrapper">
              <button
                className="final-replay-btn"
                onClick={handleReplay}
                type="button"
              >
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
