import React, { useEffect, useState } from "react";
import "./modals.css";
import failureIcon from "../../assets/failure_circle_icon.png";

export default function FailedModal({
  isOpen,
  onClose,
  teamName,
  totalPoints = 0,
  isHopeHat = false,
}) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fadeStart = setTimeout(() => setClosing(true), 4700);
    const finish = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);

    return () => {
      clearTimeout(fadeStart);
      clearTimeout(finish);
      setClosing(false);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`gameplay-overlay ${isOpen ? "open" : ""}`}>
      <div
        className={`gameplay-sheet failed-sheet ${closing ? "closing" : ""}`}
      >
        <div className="failed-circle" aria-hidden>
          <img src={failureIcon} alt="failed" className="failed-x" />
        </div>

        <div className="failed-title">Sai rồi</div>

        <div className="failed-sub">
          {isHopeHat
            ? "Chúc bạn may mắn lần sau"
            : `Không cộng điểm cho ${teamName || "ĐỘI 1"}`}
        </div>

        {!isHopeHat && (
          <>
            <div className="failed-total-label">Tổng</div>
            <div className="failed-total">
              {String(totalPoints).padStart(2, "0")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
