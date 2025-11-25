import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./MemorizeInLimitedTimeAndChooseAnswerModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

// Sortable pill component for drag-drop questions
function SortablePill({ id, answer, isSubmitted }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`memorize-limited-pill ${isSubmitted ? "submitted" : ""}`}
    >
      <span className="memorize-limited-answer">{answer}</span>
      {!isSubmitted && <span className="memorize-limited-drag-icon">⋮⋮</span>}
    </div>
  );
}

// Drag overlay component
function PillDragOverlay({ answer }) {
  return (
    <div className="memorize-limited-pill dragging-overlay">
      <span className="memorize-limited-answer">{answer}</span>
      <span className="memorize-limited-drag-icon">⋮⋮</span>
    </div>
  );
}

export default function MemorizeInLimitedTimeAndChooseAnswerModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [stage, setStage] = useState("mystery"); // mystery, memorize, quiz
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const rootRef = useRef(null);
  const timerRef = useRef(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize modal state when opened
  useEffect(() => {
    if (isOpen && questionData) {
      setStage("mystery");
      setTimeLeft(0);
      setSelectedChoice(null);
      setPairs([]);
      setSubmitted(false);
      setActiveId(null);

      // Set up pairs for drag-drop questions
      if (questionData.type === "dragdrop" && questionData.pairs) {
        const shuffledPairs = [...questionData.pairs].sort(
          () => Math.random() - 0.5
        );
        setPairs(shuffledPairs);
      }

      setTimeout(() => {
        rootRef.current && rootRef.current.focus();
      }, 0);
    }
  }, [isOpen, questionData]);

  // Handle timer countdown
  useEffect(() => {
    if (stage === "memorize" && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (stage === "memorize" && timeLeft === 0 && questionData) {
      // Time's up, move to quiz stage
      setStage("quiz");
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [stage, timeLeft, questionData]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!isOpen || !questionData) return null;

  const {
    title,
    prompt,
    question,
    memorizationTime,
    type,
    memorizationContent,
  } = questionData;

  const handleStartChallenge = () => {
    setTimeLeft(memorizationTime);
    setStage("memorize");
  };

  const handleQuizChoice = (choiceIndex) => {
    if (submitted) return;
    setSelectedChoice(choiceIndex);
  };

  const handleQuizConfirm = () => {
    if (selectedChoice === null || submitted) return;

    setSubmitted(true);
    const isCorrect = selectedChoice === questionData.correctIndex;

    setTimeout(() => {
      onResult && onResult(isCorrect ? "success" : "failure");
    }, 300);
  };

  // Drag and drop handlers
  const handleDragStart = (event) => {
    if (submitted) return;
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || submitted) return;

    if (active.id !== over.id) {
      setPairs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragDropConfirm = () => {
    const currentOrder = pairs.map((pair) => pair.answer);
    const { correctOrder = [] } = questionData;
    const isCorrect =
      JSON.stringify(currentOrder) === JSON.stringify(correctOrder) &&
      currentOrder.length === correctOrder.length;

    setSubmitted(true);

    setTimeout(() => {
      onResult && onResult(isCorrect ? "success" : "failure");
    }, 300);
  };

  const activeItem = activeId
    ? pairs.find((pair) => pair.id === activeId)
    : null;

  // Mystery frame stage
  if (stage === "mystery") {
    return (
      <div
        className="gameplay-overlay open memorize-limited-root"
        ref={rootRef}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div className="gameplay-sheet">
          {/* Challenge logo at top - positioned outside/above sheet */}
          {challengeLogo && (
            <div className="memorize-limited-logo-container">
              <img
                src={challengeLogo}
                alt="challenge logo"
                className="memorize-limited-logo"
              />
            </div>
          )}

          {/* Mystery content */}
          <div className="memorize-limited-mystery-content">
            <p className="memorize-limited-prompt">{prompt}</p>

            <div className="memorize-limited-mystery-frame">
              <div className="memorize-limited-question-mark">?</div>
            </div>

            <button
              onClick={handleStartChallenge}
              className="memorize-limited-start-btn"
            >
              Bắt đầu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Memorization stage
  if (stage === "memorize") {
    return (
      <div
        className="gameplay-overlay open memorize-limited-root"
        ref={rootRef}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div className="gameplay-sheet">
          {/* Challenge logo */}
          {challengeLogo && (
            <div className="memorize-limited-logo-container">
              <img
                src={challengeLogo}
                alt="challenge logo"
                className="memorize-limited-logo"
              />
            </div>
          )}

          {/* Timer */}
          <div className="memorize-limited-timer">
            <div className="memorize-limited-timer-circle">
              <span className="memorize-limited-timer-number">{timeLeft}</span>
            </div>
          </div>

          {/* Memorization content */}
          <div className="memorize-limited-content">
            {type === "quiz" ? (
              <div className="memorize-limited-quiz-content">
                <img
                  src={memorizationContent.image}
                  alt="Food items to memorize"
                  className="memorize-limited-content-image"
                />
                <div className="memorize-limited-display-name">
                  {memorizationContent.displayName}
                </div>
              </div>
            ) : (
              <div className="memorize-limited-dragdrop-content">
                {/* Show only the first item as main image */}
                {memorizationContent.items && memorizationContent.items[0] && (
                  <div className="memorize-limited-main-person">
                    <img
                      src={memorizationContent.items[0].image}
                      alt={memorizationContent.items[0].name}
                      className="memorize-limited-main-person-image"
                    />
                    <div className="memorize-limited-main-person-name">
                      {memorizationContent.items[0].name}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz stage
  if (stage === "quiz") {
    if (type === "quiz") {
      return (
        <div
          className="gameplay-overlay open memorize-limited-root"
          ref={rootRef}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div className="gameplay-sheet">
            {/* Challenge logo */}
            {challengeLogo && (
              <div className="memorize-limited-logo-container">
                <img
                  src={challengeLogo}
                  alt="challenge logo"
                  className="memorize-limited-logo"
                />
              </div>
            )}

            {/* Question */}
            <p className="memorize-limited-question">{question}</p>

            {/* Choices */}
            <div className="memorize-limited-choices">
              {questionData.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizChoice(idx)}
                  className={`memorize-limited-choice ${
                    selectedChoice === idx ? "selected" : ""
                  } ${submitted ? "submitted" : ""}`}
                  disabled={submitted}
                >
                  {choice}
                </button>
              ))}
            </div>

            {/* Confirm button */}
            <div className="memorize-limited-controls">
              <button
                onClick={handleQuizConfirm}
                disabled={selectedChoice === null || submitted}
                className={`memorize-limited-confirm ${
                  selectedChoice === null || submitted ? "disabled" : ""
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      // Drag-drop quiz
      return (
        <div
          className="gameplay-overlay open memorize-limited-root"
          ref={rootRef}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div className="gameplay-sheet">
            {/* Challenge logo */}
            {challengeLogo && (
              <div className="memorize-limited-logo-container">
                <img
                  src={challengeLogo}
                  alt="challenge logo"
                  className="memorize-limited-logo"
                />
              </div>
            )}

            {/* Question */}
            <p className="memorize-limited-question">{question}</p>

            {/* Match pairs grid */}
            <div className="memorize-limited-grid-container">
              {/* Left column - Fixed images */}
              <div className="memorize-limited-images-column">
                {questionData.leftItems.map((item, idx) => (
                  <div
                    key={`image-${idx}`}
                    className="memorize-limited-image-item"
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="memorize-limited-image"
                    />
                  </div>
                ))}
              </div>

              {/* Right column - Draggable pills */}
              <div className="memorize-limited-answers-column">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={pairs.map((pair) => pair.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {pairs.map((pair) => (
                      <SortablePill
                        key={pair.id}
                        id={pair.id}
                        answer={pair.answer}
                        isSubmitted={submitted}
                      />
                    ))}
                  </SortableContext>

                  <DragOverlay>
                    {activeItem ? (
                      <PillDragOverlay answer={activeItem.answer} />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </div>

            {/* Confirm button */}
            <div className="memorize-limited-controls">
              <button
                onClick={handleDragDropConfirm}
                disabled={submitted}
                className={`memorize-limited-confirm ${
                  submitted ? "disabled" : ""
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}
