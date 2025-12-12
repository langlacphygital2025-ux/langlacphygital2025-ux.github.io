import React, { useEffect, useState } from "react";
import "./modals.css";
import successIcon from "../../assets/success_icon_circle.png";

export default function SuccessModal({
  isOpen,
  onClose,
  teamName,
  addedPoints = 1,
  totalPoints = 0,
  isHopeHat = false,
}) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // start fade-out shortly before finishing so we can animate
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
        className={`gameplay-sheet success-sheet ${closing ? "closing" : ""}`}
      >
        <div className="success-circle" aria-hidden>
          <img src={successIcon} alt="success" className="success-check" />
        </div>

        <div className="success-title">Đúng rùi đó</div>

        <div className="success-sub">
          {isHopeHat
            ? "Thêm 1 token"
            : `+${addedPoints} cho ${teamName || "ĐỘI 1"}`}
        </div>

        {!isHopeHat && (
          <>
            <div className="success-total-label">Tổng</div>
            <div className="success-total">
              {String(totalPoints).padStart(2, "0")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
