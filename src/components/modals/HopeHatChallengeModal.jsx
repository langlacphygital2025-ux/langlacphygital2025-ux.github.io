import React, { useEffect, useRef, useState } from "react";
import "./HopeHatChallengeModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function HopeHatChallengeModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setSubmitted(false);
      setTimeout(() => rootRef.current && rootRef.current.focus(), 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const { prompt, question, image } = questionData;

  function handleStarClick(starCount) {
    if (submitted) return;
    setRating(starCount);
  }

  function handleConfirm() {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      onResult &&
        onResult(rating > 0 ? "success" : "failure", { points: rating });
    }, 300);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setRating((r) => Math.min(3, r + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setRating((r) => Math.max(0, r - 1));
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
      className="gameplay-overlay open hope-hat-challenge-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {challengeLogo && (
          <div className="hope-hat-challenge-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="hope-hat-challenge-logo"
            />
          </div>
        )}

        {image && (
          <div className="hope-hat-challenge-image-wrapper">
            <img
              src={image}
              alt="Challenge"
              className="hope-hat-challenge-image"
            />
          </div>
        )}

        {prompt && (
          <p
            className="hope-hat-challenge-prompt"
            dangerouslySetInnerHTML={{
              __html: prompt
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {question && (
          <div
            className="hope-hat-challenge-question"
            dangerouslySetInnerHTML={{
              __html: question
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        <p className="hope-hat-challenge-evaluation-text">
          Đội giám khảo hãy đánh giá phần thể hiện
        </p>

        <div
          className="hope-hat-challenge-stars"
          role="radiogroup"
          aria-label="Performance rating"
        >
          {[1, 2, 3].map((starValue) => (
            <button
              key={starValue}
              role="radio"
              aria-checked={rating === starValue}
              aria-label={`${starValue} star rating`}
              onClick={() => handleStarClick(starValue)}
              disabled={submitted}
              className={`hope-hat-challenge-star ${
                rating >= starValue ? "filled" : ""
              } ${submitted ? "submitted" : ""}`}
            >
              ★
            </button>
          ))}
        </div>

        <div className="hope-hat-challenge-controls">
          <button
            onClick={handleConfirm}
            disabled={rating === 0 || submitted}
            className={`hope-hat-challenge-confirm ${
              rating === 0 || submitted ? "disabled" : ""
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
