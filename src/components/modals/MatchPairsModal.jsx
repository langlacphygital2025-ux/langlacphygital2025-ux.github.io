import React, { useEffect, useState } from "react";
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
import "./MatchPairsModal.css";
import challengeLogo from "../../assets/challenge_logo_icon.png";

// Sortable pill component
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
      className={`match-pairs-pill ${isSubmitted ? "submitted" : ""}`}
    >
      <span className="match-pairs-answer">{answer}</span>
      {!isSubmitted && <span className="match-pairs-drag-icon">⋮⋮</span>}
    </div>
  );
}

// Drag overlay component for better visual feedback
function PillDragOverlay({ answer }) {
  return (
    <div className="match-pairs-pill dragging-overlay">
      <span className="match-pairs-answer">{answer}</span>
      <span className="match-pairs-drag-icon">⋮⋮</span>
    </div>
  );
}

export default function MatchPairsModal({
  isOpen,
  onClose,
  onResult,
  questionData,
}) {
  const [pairs, setPairs] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeId, setActiveId] = useState(null);

  // Configure sensors for different input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement to start dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isOpen && questionData) {
      if (!questionData.pairs || !Array.isArray(questionData.pairs)) {
        return;
      }

      const enrichedPairs = questionData.pairs.map((pair, idx) => ({
        id: `pair_${questionData.id}_${idx}`,
        answer: pair.answer,
        originalIndex: idx,
      }));

      const shuffledPairs = [...enrichedPairs].sort(() => Math.random() - 0.5);
      setPairs(shuffledPairs);
      setSubmitted(false);
      setActiveId(null);
    }
  }, [isOpen, questionData]);

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

  const handleConfirm = () => {
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

  if (!isOpen || !questionData || !pairs.length) return null;

  const { prompt, question, leftItems = [] } = questionData;
  const activeItem = activeId
    ? pairs.find((pair) => pair.id === activeId)
    : null;

  return (
    <div
      className="gameplay-overlay open match-pairs-root"
      aria-modal="true"
      role="dialog"
    >
      <div className="gameplay-sheet">
        {/* Challenge logo at top */}
        {challengeLogo && (
          <div className="match-pairs-logo-container">
            <img
              src={challengeLogo}
              alt="challenge logo"
              className="match-pairs-logo"
            />
          </div>
        )}

        {/* Prompt text */}
        {prompt && (
          <p
            className="match-pairs-prompt"
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
            className="match-pairs-question"
            dangerouslySetInnerHTML={{
              __html: question
                .replace(/<bold>/g, "<b>")
                .replace(/<\/bold>/g, "</b>")
                .replace(/\n/g, "<br>"),
            }}
          />
        )}

        {/* Match pairs grid container */}
        <div className="match-pairs-grid-container">
          {/* Left column - Images */}
          <div className="match-pairs-images-column">
            {leftItems.map((item, idx) => (
              <div key={`image-${idx}`} className="match-pairs-image-item">
                <img
                  src={item.image}
                  alt={item.label}
                  className="match-pairs-image"
                />
              </div>
            ))}
          </div>

          {/* Right column - Draggable answers */}
          <div className="match-pairs-answers-column">
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
        <div className="match-pairs-controls">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitted}
            className={`match-pairs-confirm ${submitted ? "disabled" : ""}`}
            aria-label="Xác nhận câu trả lời"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
