import React, { useEffect, useRef, useState } from "react";
import "./EnterTextAsAnswerModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function EnterTextAsAnswerModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setAnswer("");
      setSubmitted(false);
      setFocused(false);
      setTimeout(() => {
        rootRef.current && rootRef.current.focus();
        inputRef.current && inputRef.current.focus();
      }, 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const { title, prompt, question, correctAnswer = "" } = questionData;

  function handleConfirm() {
    if (!answer.trim()) return;
    setSubmitted(true);

    const userAnswer = answer.trim().toLowerCase();
    const correct = correctAnswer.toLowerCase();
    const isCorrect = userAnswer === correct;

    setTimeout(() => {
      onResult && onResult(isCorrect ? "success" : "failure");
    }, 300);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !submitted) {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose && onClose();
    }
  }

  return (
    <div
      className="gameplay-overlay open enter-text-answer-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo at top */}
        {challengeLogo && (
          <div className="enter-text-answer-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="enter-text-answer-logo"
            />
          </div>
        )}

        {/* Title */}
        {/* {title && <h2 className="enter-text-answer-title">{title}</h2>} */}

        {/* Prompt text */}
        {prompt && (
          <p
            className="enter-text-answer-prompt"
            dangerouslySetInnerHTML={{
              __html: prompt
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Question text */}
        {question && (
          <div
            className="enter-text-answer-question"
            dangerouslySetInnerHTML={{
              __html: question
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Text input */}
        <div
          className={`enter-text-answer-input-pill ${
            focused ? "focused" : ""
          } ${submitted ? "submitted" : ""}`}
        >
          <input
            ref={inputRef}
            className="enter-text-answer-input"
            type="text"
            placeholder="Nhập câu trả lời..."
            aria-label="Nhập câu trả lời"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={submitted}
          />
        </div>

        {/* Confirm button */}
        <div className="enter-text-answer-controls">
          <button
            onClick={handleConfirm}
            disabled={!answer.trim() || submitted}
            className={`enter-text-answer-confirm ${
              !answer.trim() || submitted ? "disabled" : ""
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
