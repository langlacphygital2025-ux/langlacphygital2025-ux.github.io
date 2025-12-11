import React, { useEffect, useRef, useState } from "react";
import "./ReciteAudioPerformanceModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";
import CustomAudioPlayer from "../CustomAudioPlayer";

export default function ReciteAudioPerformanceModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [rating, setRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(null);
      setSubmitted(false);
      setAudioEnded(false);
      setTimeout(() => rootRef.current && rootRef.current.focus(), 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const { audio, instructions, lyrics, explanation } = questionData;

  function handleAudioEnd() {
    setAudioEnded(true);
  }

  function handleConfirm() {
    if (rating === null) return;
    setSubmitted(true);
    setTimeout(() => onResult && onResult("success", { rating }), 300);
  }

  function handleKeyDown(e) {
    if (e.key === "1") {
      e.preventDefault();
      !submitted && audioEnded && setRating(1);
    } else if (e.key === "2") {
      e.preventDefault();
      !submitted && audioEnded && setRating(2);
    } else if (e.key === "3") {
      e.preventDefault();
      !submitted && audioEnded && setRating(3);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose && onClose();
    }
  }

  return (
    <div
      className="gameplay-overlay open recite-audio-performance-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo header */}
        {challengeLogo && (
          <div className="recite-audio-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="recite-audio-logo"
            />
          </div>
        )}

        {/* Challenge title */}

        {/* Instructions */}
        {instructions && (
          <p className="recite-audio-instructions">{instructions}</p>
        )}

        {/* Audio player */}
        {audio && (
          <div className="recite-audio-player-wrapper">
            <CustomAudioPlayer src={audio} onEnded={handleAudioEnd} />
          </div>
        )}

        {/* Lyrics display */}
        {lyrics && (
          <div className="recite-audio-lyrics-container">
            <p className="recite-audio-lyrics">{lyrics}</p>
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <p className="recite-audio-explanation">{explanation}</p>
        )}

        {/* Star rating - only after audio ends */}
        {audioEnded && (
          <>
            <p className="recite-audio-evaluation-label">
              Đội giám khảo hãy đánh giá phần thể hiện
            </p>

            <div
              className="recite-audio-stars"
              role="radiogroup"
              aria-label="Performance rating"
            >
              {[1, 2, 3].map((starValue) => (
                <button
                  key={starValue}
                  role="radio"
                  aria-checked={rating === starValue}
                  aria-label={`${starValue} star rating`}
                  onClick={() => !submitted && setRating(starValue)}
                  disabled={submitted}
                  className={`recite-audio-star ${
                    rating >= starValue ? "filled" : ""
                  } ${submitted ? "submitted" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Confirm button */}
            <div className="recite-audio-controls">
              <button
                onClick={handleConfirm}
                disabled={rating === null || submitted}
                className={`recite-audio-confirm ${
                  rating === null || submitted ? "disabled" : ""
                }`}
              >
                Xác nhận
              </button>
            </div>
          </>
        )}

        {/* Wait for audio message */}
        {!audioEnded && (
          <p className="recite-audio-waiting">
            Vui lòng nghe hết khúc ru trước khi đánh giá
          </p>
        )}
      </div>
    </div>
  );
}
