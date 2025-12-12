import React, { useEffect, useState } from "react";
import { useChatbot } from "../context/ChatbotContext";
import { useVideoTutorial } from "../context/VideoTutorialContext";
import treoLyAi from "../assets/tro_ly_ai.png";
import "./AIChatbot.css";

function AIChatbot() {
  const { currentChunk, chunkIndex, isVisible, cornerIndex, isAudioPlaying } =
    useChatbot();
  const { videoFinished } = useVideoTutorial();
  const [hasEntered, setHasEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setHasEntered(true), 100);
  }, []);

  useEffect(() => {
    if (isVisible && videoFinished) {
      setShouldShow(true);
      setIsExiting(false);
    } else if (!isVisible && shouldShow) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldShow(false);
        setIsExiting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, videoFinished, shouldShow]);

  const isLeftSide = false;

  return (
    <div
      className={`chatbot-container corner-${cornerIndex} ${
        hasEntered ? "entered" : ""
      }`}
    >
      <div className="chatbot-icon-wrapper">
        <img
          src={treoLyAi}
          alt="Gạo"
          className={`chatbot-icon ${isAudioPlaying ? "playing" : ""}`}
        />

        {isAudioPlaying && (
          <div className="sound-wave">
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
          </div>
        )}
      </div>

      {shouldShow && (
        <div
          className={`speech-bubble ${
            isLeftSide ? "left-side" : "right-side"
          } ${isExiting ? "exiting" : "entering"}`}
        >
          <p className="bubble-text" data-chunk-index={chunkIndex}>
            {currentChunk}
          </p>
        </div>
      )}
    </div>
  );
}

export default AIChatbot;
