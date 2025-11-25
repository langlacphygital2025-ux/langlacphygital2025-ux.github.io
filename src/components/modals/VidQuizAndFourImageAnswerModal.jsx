import React, { useEffect, useRef, useState } from "react";
import "./VidQuizAndFourImageAnswerModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function VidQuizAndFourImageAnswerModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setSubmitted(false);
      setIsVideoPlaying(true);
      setVideoEnded(false);
      setTimeout(() => rootRef.current && rootRef.current.focus(), 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const { title, question, video, choices = [], correctIndex } = questionData;

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

  function handleConfirm() {
    if (selected === null || !videoEnded) return;
    const isCorrect = selected === correctIndex;
    setSubmitted(true);
    setTimeout(
      () => onResult && onResult(isCorrect ? "success" : "failure"),
      300
    );
  }

  function handleKeyDown(e) {
    if (!choices.length || !videoEnded) return;

    // Arrow navigation in a 2x2 grid:
    // 0 1
    // 2 3
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return 0;
        if (s <= 1) return Math.min(3, s + 2);
        return s;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return 0;
        if (s >= 2) return Math.max(0, s - 2);
        return s;
      });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return 0;
        if (s % 2 === 0) return Math.min(s + 1, 3);
        return s;
      });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return 0;
        if (s % 2 === 1) return s - 1;
        return s;
      });
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
      className="gameplay-overlay open vid-quiz-four-image-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo at top */}
        {challengeLogo && (
          <div className="vid-quiz-four-image-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="vid-quiz-four-image-logo"
            />
          </div>
        )}
        {/* Question text */}
        {question && (
          <p
            className="vid-quiz-four-image-question"
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
          <div className="vid-quiz-four-image-wrapper">
            <video
              ref={videoRef}
              src={video}
              className="vid-quiz-four-image-video"
              autoPlay
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnd}
              controlsList="nofullscreen"
            />
          </div>
        )}

        {/* 2x2 Grid of image choices */}
        <div
          role="list"
          aria-label="answer choices"
          className="vid-quiz-four-image-grid"
        >
          {choices.map((choice, i) => {
            const isSelected = selected === i;
            const isCorrect = submitted && i === correctIndex;
            const isWrong =
              submitted && isSelected && selected !== correctIndex;

            const classNames = ["vid-quiz-four-image-choice"];
            if (isSelected && !submitted) classNames.push("selected");
            if (isCorrect) classNames.push("correct");
            if (isWrong) classNames.push("wrong");
            if (!videoEnded && !submitted) classNames.push("video-playing");

            return (
              <button
                key={i}
                role="listitem"
                aria-pressed={isSelected}
                aria-label={`Choice ${i + 1}: ${choice.text}`}
                onClick={() => videoEnded && !submitted && setSelected(i)}
                className={classNames.join(" ")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.stopPropagation();
                }}
                disabled={!videoEnded || submitted}
              >
                <div className="vid-quiz-four-image-choice-image">
                  {choice.image && (
                    <img
                      src={choice.image}
                      alt={choice.text}
                      className="vid-quiz-four-image-img"
                    />
                  )}
                </div>
                <div className="vid-quiz-four-image-choice-text">
                  {choice.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm button */}
        <div className="vid-quiz-four-image-controls">
          <button
            onClick={handleConfirm}
            disabled={selected === null || submitted || !videoEnded}
            className={`vid-quiz-four-image-confirm ${
              selected === null || submitted || !videoEnded ? "disabled" : ""
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
