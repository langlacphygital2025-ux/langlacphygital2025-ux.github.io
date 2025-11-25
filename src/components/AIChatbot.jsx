import React, { useEffect, useState, useRef } from "react";
import { useChatbot } from "../context/ChatbotContext";
import { useVideoTutorial } from "../context/VideoTutorialContext";
import treoLyAi from "../assets/tro_ly_ai.png";
import chatbotSound from "../assets/chatbot_message_sound.mp3";
import "./AIChatbot.css";

function AIChatbot() {
  const { message, isVisible, cornerIndex } = useChatbot();
  const { videoFinished } = useVideoTutorial();
  const [hasEntered, setHasEntered] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [wordBatches, setWordBatches] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const audioRef = useRef(new Audio(chatbotSound));

  useEffect(() => {
    setTimeout(() => setHasEntered(true), 100);
  }, []);

  // Handle visibility with smooth transitions
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

  // Split message into batches of 5 words each
  useEffect(() => {
    if (message && videoFinished) {
      const words = message.split(" ");
      const batches = [];
      for (let i = 0; i < words.length; i += 5) {
        batches.push(words.slice(i, i + 5).join(" "));
      }
      setWordBatches(batches);
      setCurrentBatchIndex(0);
      setDisplayedText(batches[0] || "");
    }
  }, [message, videoFinished]);

  // Play sound when message appears
  useEffect(() => {
    if (isVisible && message && videoFinished) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  }, [isVisible, message, videoFinished]);

  // Cycle through word batches with 6-second delay between each message
  useEffect(() => {
    if (!isVisible || wordBatches.length <= 1 || !videoFinished) return;

    const timer = setInterval(() => {
      setCurrentBatchIndex((prev) => {
        const nextIndex = (prev + 1) % wordBatches.length;
        setDisplayedText(wordBatches[nextIndex]);
        // Play sound for each message transition
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((err) => console.log("Audio play failed:", err));
        return nextIndex;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isVisible, wordBatches, videoFinished]);

  // Always on right side since staying in bottom-right corner
  const isLeftSide = false;

  return (
    <div
      className={`chatbot-container corner-${cornerIndex} ${
        hasEntered ? "entered" : ""
      }`}
    >
      <img src={treoLyAi} alt="Gạo" className="chatbot-icon" />

      {shouldShow && (
        <div
          className={`speech-bubble ${
            isLeftSide ? "left-side" : "right-side"
          } ${isExiting ? "exiting" : "entering"}`}
        >
          <p className="bubble-text">{displayedText}</p>
        </div>
      )}
    </div>
  );
}

export default AIChatbot;
