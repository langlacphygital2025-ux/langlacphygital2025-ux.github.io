import React, { useEffect, useRef, useState } from "react";
import "./DoTheChallengeModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function DoTheChallengeModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setSubmitted(false);
      setIsVideoPlaying(true);
      setVideoEnded(false);
      setTimeout(() => rootRef.current && rootRef.current.focus(), 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const { title, prompt, question, video } = questionData;

  function handleVideoPlay() {
    setIsVideoPlaying(true);
  }

  function handleVideoPause() {
    setIsVideoPlaying(false);
  }

  function handleVideoEnd() {
    setIsVideoPlaying(false);
    setVideoEnded(true);
  }

  function handleStarClick(starCount) {
    if (!videoEnded || submitted) return;
    setRating(starCount);
  }

  function handleConfirm() {
    if (rating === 0 || !videoEnded) return;
    setSubmitted(true);
    setTimeout(() => {
      onResult &&
        onResult(rating > 0 ? "success" : "failure", { points: rating });
    }, 300);
  }

  function handleKeyDown(e) {
    if (!videoEnded) return;
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
      className="gameplay-overlay open do-the-challenge-root"
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
        {question && (
          <p
            className="do-the-challenge-question"
            dangerouslySetInnerHTML={{
              __html: question
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Video display area */}
        {video && (
          <div className="do-the-challenge-wrapper">
            <video
              ref={videoRef}
              src={video}
              className="do-the-challenge-video"
              autoPlay
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnd}
              controlsList="nofullscreen"
            />
          </div>
        )}

        {/* Title */}
        {/* {title && <h2 className="do-the-challenge-title">{title}</h2>} */}

        {/* Question text */}

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
              disabled={!videoEnded || submitted}
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
            disabled={rating === 0 || submitted || !videoEnded}
            className={`do-the-challenge-confirm ${
              rating === 0 || submitted || !videoEnded ? "disabled" : ""
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
