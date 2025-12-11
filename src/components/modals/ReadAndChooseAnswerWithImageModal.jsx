import React, { useEffect, useRef, useState } from "react";
import "./ReadAndChooseAnswerWithImageModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function ReadAndChooseAnswerWithImageModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setSubmitted(false);
      setTimeout(() => rootRef.current && rootRef.current.focus(), 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const {
    title,
    prompt,
    question,
    image,
    choices = [],
    imageChoices = [],
    choiceLabels = [],
    correctIndex,
  } = questionData;

  function handleConfirm() {
    if (selected === null) return;
    const isCorrect = selected === correctIndex;
    setSubmitted(true);
    setTimeout(
      () => onResult && onResult(isCorrect ? "success" : "failure"),
      300
    );
  }

  function handleKeyDown(e) {
    const totalChoices = imageChoices.length || choices.length;
    if (!totalChoices) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return 0;
        return Math.min(totalChoices - 1, s + 1);
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => {
        if (s === null) return totalChoices - 1;
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
      className="gameplay-overlay open read-choose-image-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo at top */}
        {challengeLogo && (
          <div className="read-choose-image-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="read-choose-image-logo"
            />
          </div>
        )}

        {/* Prompt text - shown above question for image choices */}
        {prompt && imageChoices.length > 0 && (
          <p className="read-choose-image-prompt">{prompt}</p>
        )}

        {/* Question text */}
        {question && (
          <p
            className="read-choose-question"
            dangerouslySetInnerHTML={{
              __html: question
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Image display area - only for single image questions */}
        {image && (
          <div className="read-choose-image-wrapper">
            <img
              src={image}
              alt="question image"
              className="read-choose-image"
            />
          </div>
        )}

        {/* Choice buttons - Text or Image based */}
        <div
          role="list"
          aria-label="answer choices"
          className={`read-choose-choices ${
            imageChoices.length > 0 ? "image-grid-choices" : ""
          }`}
        >
          {imageChoices.length > 0
            ? // Render image choices with separate labels
              imageChoices.map((choiceImage, i) => {
                const label = choiceLabels[i] || String.fromCharCode(65 + i); // A, B, C, D

                return (
                  <div key={i} className="image-choice-container">
                    <button
                      className="image-choice-image-wrapper"
                      onClick={() => !submitted && setSelected(i)}
                      disabled={submitted}
                      aria-label={`Choice ${label}`}
                    >
                      <img
                        src={choiceImage}
                        alt={`Choice ${label}`}
                        className="choice-image"
                      />
                    </button>
                    <button
                      role="listitem"
                      aria-pressed={selected === i}
                      aria-label={`Choice ${label}`}
                      onClick={() => !submitted && setSelected(i)}
                      className={`choice-label-button ${
                        selected === i ? "selected" : ""
                      } ${submitted && i === correctIndex ? "correct" : ""} ${
                        submitted && selected === i && selected !== correctIndex
                          ? "wrong"
                          : ""
                      }`}
                      disabled={submitted}
                    >
                      {label}
                    </button>
                  </div>
                );
              })
            : // Render text choices
              choices.map((choiceText, i) => {
                const isSelected = selected === i;
                const isCorrect = submitted && i === correctIndex;
                const isWrong =
                  submitted && isSelected && selected !== correctIndex;

                const classNames = ["read-choose-choice"];
                if (isSelected && !submitted) classNames.push("selected");
                if (isCorrect) classNames.push("correct");
                if (isWrong) classNames.push("wrong");

                return (
                  <button
                    key={i}
                    role="listitem"
                    aria-pressed={isSelected}
                    aria-label={`Choice ${i + 1}: ${choiceText}`}
                    onClick={() => !submitted && setSelected(i)}
                    className={classNames.join(" ")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.stopPropagation();
                    }}
                    disabled={submitted}
                  >
                    {choiceText}
                  </button>
                );
              })}
        </div>

        {/* Confirm button */}
        <div className="read-choose-controls">
          <button
            onClick={handleConfirm}
            disabled={selected === null || submitted}
            className={`read-choose-confirm ${
              selected === null || submitted ? "disabled" : ""
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
