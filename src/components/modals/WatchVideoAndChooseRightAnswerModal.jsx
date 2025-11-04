import React, { useEffect, useRef, useState } from "react";
import "./WatchVideoAndChooseRightAnswerModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function WatchVideoAndChooseRightAnswerModal({
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

  const {
    title,
    prompt,
    question,
    video,
    choices = [],
    correctIndex,
  } = questionData;

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
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return 0;
        return Math.min(choices.length - 1, s + 1);
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return choices.length - 1;
        return Math.max(0, s - 1);
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
      className="gameplay-overlay open watch-video-choose-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo at top */}
        {challengeLogo && (
          <div className="watch-video-choose-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="watch-video-choose-logo"
            />
          </div>
        )}

        {/* Video display area */}
        {video && (
          <div className="watch-video-choose-wrapper">
            <video
              ref={videoRef}
              src={video}
              className="watch-video-choose-video"
              autoPlay
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnd}
              controlsList="nofullscreen"
            />
          </div>
        )}

        {/* Title */}
        {/* {title && <h2 className="watch-video-choose-title">{title}</h2>} */}

        {/* Question text */}
        {question && (
          <p
            className="watch-video-choose-question"
            dangerouslySetInnerHTML={{
              __html: question
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Choice buttons */}
        <div
          role="list"
          aria-label="answer choices"
          className="watch-video-choose-choices"
        >
          {choices.map((choiceText, i) => {
            const isSelected = selected === i;
            const isCorrect = submitted && i === correctIndex;
            const isWrong =
              submitted && isSelected && selected !== correctIndex;

            const classNames = ["watch-video-choose-choice"];
            if (isSelected && !submitted) classNames.push("selected");
            if (isCorrect) classNames.push("correct");
            if (isWrong) classNames.push("wrong");
            if (!videoEnded && !submitted) classNames.push("video-playing");

            return (
              <button
                key={i}
                role="listitem"
                aria-pressed={isSelected}
                aria-label={`Choice ${i + 1}: ${choiceText}`}
                onClick={() => videoEnded && !submitted && setSelected(i)}
                className={classNames.join(" ")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.stopPropagation();
                }}
                disabled={!videoEnded || submitted}
              >
                {choiceText}
              </button>
            );
          })}
        </div>

        {/* Confirm button */}
        <div className="watch-video-choose-controls">
          <button
            onClick={handleConfirm}
            disabled={selected === null || submitted || !videoEnded}
            className={`watch-video-choose-confirm ${
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
