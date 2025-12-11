import React, { useEffect, useRef, useState } from "react";
import "./DoTheChallengeWithImageModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function DoTheChallengeWithImageModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setSubmitted(false);
      setTimeout(() => rootRef.current && rootRef.current.focus(), 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const { title, prompt, question, images } = questionData;

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose && onClose();
    }
  }

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

  return (
    <div
      className="gameplay-overlay open do-the-challenge-with-image-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo at top */}
        {challengeLogo && (
          <div className="do-the-challenge-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="do-the-challenge-logo"
            />
          </div>
        )}

        {/* Challenge title and description section */}
        <div className="do-the-challenge-header">
          {question && (
            <h2
              className="do-the-challenge-with-image-question"
              dangerouslySetInnerHTML={{
                __html: question
                  .replace(/<bold>/g, "<b>")
                  .replace(/<\/bold>/g, "</b>")
                  .replace(/\n/g, "<br>"),
              }}
            />
          )}

          {prompt && (
            <p className="do-the-challenge-with-image-prompt">{prompt}</p>
          )}
        </div>

        {/* Horizontal scrollable carousel - ALL 3 slides visible side by side */}
        <div
          className="do-the-challenge-carousel-container"
          ref={scrollContainerRef}
        >
          <div className="do-the-challenge-carousel">
            {images &&
              images.map((item, index) => (
                <div key={index} className="do-the-challenge-slide">
                  {/* Image with overlay */}
                  <div className="do-the-challenge-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="do-the-challenge-image"
                    />
                    <div className="do-the-challenge-image-overlay" />
                    <div className="do-the-challenge-image-title">
                      {item.title}
                    </div>
                  </div>

                  {/* Slide indicator - OUTSIDE image wrapper */}
                  <div className="do-the-challenge-slide-indicator">
                    {index + 1}/{images.length}
                  </div>

                  {/* Pose instruction button */}
                  <div className="do-the-challenge-action-button">
                    <span>{item.pose}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Rating section - appears after carousel */}
        <div className="do-the-challenge-rating-section">
          {/* Evaluation text */}
          <p className="do-the-challenge-evaluation-text">
            Đội giám khảo hãy đánh giá phần thể hiện
          </p>

          {/* Star rating */}
          <div
            className="do-the-challenge-stars"
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
                className={`do-the-challenge-star ${
                  rating >= starValue ? "filled" : ""
                } ${submitted ? "submitted" : ""}`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Confirm button */}
          <div className="do-the-challenge-controls">
            <button
              onClick={handleConfirm}
              disabled={rating === 0 || submitted}
              className={`do-the-challenge-confirm ${
                rating === 0 || submitted ? "disabled" : ""
              }`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
