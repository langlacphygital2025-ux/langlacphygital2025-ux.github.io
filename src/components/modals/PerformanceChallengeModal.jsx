import React, { useEffect, useRef, useState } from "react";
import "./PerformanceChallengeModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function PerformanceChallengeModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [rating, setRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(null);
      setSubmitted(false);
      setTimeout(() => rootRef.current && rootRef.current.focus(), 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const { title, prompt, image, instructions, maxRating = 3 } = questionData;

  function handleConfirm() {
    if (rating === null) return;
    setSubmitted(true);
    setTimeout(() => onResult && onResult("success", { rating }), 300);
  }

  function handleKeyDown(e) {
    if (e.key === "1") {
      e.preventDefault();
      !submitted && setRating(1);
    } else if (e.key === "2") {
      e.preventDefault();
      !submitted && setRating(2);
    } else if (e.key === "3") {
      e.preventDefault();
      !submitted && setRating(3);
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
      className="gameplay-overlay open performance-challenge-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo */}
        {challengeLogo && (
          <div className="performance-challenge-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="performance-challenge-logo"
            />
          </div>
        )}

        {/* Image display */}
        {image && (
          <div className="performance-challenge-image-wrapper">
            <img
              src={image}
              alt="challenge visual"
              className="performance-challenge-image"
            />
          </div>
        )}

        {/* Prompt/Poem text */}
        {prompt && (
          <div className="performance-challenge-prompt">
            {prompt.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {/* Instructions */}
        {instructions && (
          <p className="performance-challenge-instructions">{instructions}</p>
        )}

        {/* Evaluation label */}
        <p className="performance-challenge-evaluation-label">
          Đội giám khảo hãy đánh giá phần thể hiện
        </p>

        {/* Star rating system */}
        <div
          className="performance-challenge-stars"
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
              className={`performance-challenge-star ${
                rating >= starValue ? "filled" : ""
              } ${submitted ? "submitted" : ""}`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Confirm button */}
        <div className="performance-challenge-controls">
          <button
            onClick={handleConfirm}
            disabled={rating === null || submitted}
            className={`performance-challenge-confirm ${
              rating === null || submitted ? "disabled" : ""
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
