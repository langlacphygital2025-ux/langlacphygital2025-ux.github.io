import React, { useEffect, useRef, useState } from "react";
import "./ClassifyWordsModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

export default function ClassifyWordsModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [answers, setAnswers] = useState({
    category1: "",
    category2: "",
    category3: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const rootRef = useRef(null);
  const inputRefs = useRef({});

  useEffect(() => {
    if (isOpen) {
      setAnswers({
        category1: "",
        category2: "",
        category3: "",
      });
      setSubmitted(false);
      setFocused(null);
      setTimeout(() => {
        rootRef.current && rootRef.current.focus();
        inputRefs.current.category1 && inputRefs.current.category1.focus();
      }, 0);
    }
  }, [isOpen, questionData]);

  if (!isOpen || !questionData) return null;

  const {
    title,
    prompt,
    question,
    passage,
    categories = [],
    correctAnswers = {},
  } = questionData;

  function handleConfirm() {
    const allFilled =
      answers.category1.trim() &&
      answers.category2.trim() &&
      answers.category3.trim();

    if (!allFilled) return;

    setSubmitted(true);

    // Check if all answers match (case-insensitive, trim whitespace)
    const isCorrect =
      answers.category1.trim().toLowerCase() ===
        correctAnswers.category1?.toLowerCase() &&
      answers.category2.trim().toLowerCase() ===
        correctAnswers.category2?.toLowerCase() &&
      answers.category3.trim().toLowerCase() ===
        correctAnswers.category3?.toLowerCase();

    setTimeout(() => {
      onResult && onResult(isCorrect ? "success" : "failure");
    }, 300);
  }

  function handleInputChange(category, value) {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [category]: value,
    }));
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

  const allFilled =
    answers.category1.trim() &&
    answers.category2.trim() &&
    answers.category3.trim();

  return (
    <div
      className="gameplay-overlay open classify-words-root"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={rootRef}
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo at top */}
        {challengeLogo && (
          <div className="classify-words-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="classify-words-logo"
            />
          </div>
        )}

        {/* Prompt text */}
        {prompt && (
          <p
            className="classify-words-prompt"
            dangerouslySetInnerHTML={{
              __html: prompt
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Passage/Question text */}
        {question && (
          <div
            className="classify-words-question"
            dangerouslySetInnerHTML={{
              __html: question
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Input fields for each category */}
        <div className="classify-words-inputs">
          {categories.map((category, idx) => {
            const categoryKey = `category${idx + 1}`;
            return (
              <div
                key={categoryKey}
                className={`classify-words-input-pill ${
                  focused === categoryKey ? "focused" : ""
                } ${submitted ? "submitted" : ""}`}
              >
                <label className="classify-words-label">{category}:</label>
                <input
                  ref={(el) => (inputRefs.current[categoryKey] = el)}
                  type="text"
                  className="classify-words-input"
                  placeholder=""
                  aria-label={`Nhập số cho ${category}`}
                  value={answers[categoryKey]}
                  onChange={(e) =>
                    handleInputChange(categoryKey, e.target.value)
                  }
                  onFocus={() => setFocused(categoryKey)}
                  onBlur={() => setFocused(null)}
                  disabled={submitted}
                />
              </div>
            );
          })}
        </div>

        {/* Confirm button */}
        <div className="classify-words-controls">
          <button
            onClick={handleConfirm}
            disabled={!allFilled || submitted}
            className={`classify-words-confirm ${
              !allFilled || submitted ? "disabled" : ""
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
