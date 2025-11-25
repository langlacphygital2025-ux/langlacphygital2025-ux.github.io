import React, { useEffect, useRef, useState } from "react";
import { useVideoTutorial } from "../context/VideoTutorialContext";
import videoTutorial from "../assets/VIDEO_HUONG_DAN_CHOI_optimized.mp4";
import "./VideoTutorialModal.css";

function VideoTutorialModal() {
  const { showVideo, setShowVideo, setVideoFinished } = useVideoTutorial();
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState("4g");

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      return mobileRegex.test(userAgent);
    };

    setIsMobile(checkMobile());

    // Check connection speed
    if (navigator.connection) {
      setConnectionSpeed(navigator.connection.effectiveType);
      navigator.connection.addEventListener("change", () => {
        setConnectionSpeed(navigator.connection.effectiveType);
      });
    }
  }, []);

  useEffect(() => {
    if (!showVideo || !isMobile || !videoRef.current) return;

    const videoElement = videoRef.current;

    const handleVideoEnd = () => {
      setShowVideo(false);
      setVideoFinished(true);
    };

    videoElement.addEventListener("ended", handleVideoEnd);
    videoElement.addEventListener("loadeddata", () => setIsLoading(false));
    videoElement.addEventListener("playing", () => setIsLoading(false));

    videoElement.muted = false;
    videoElement.play().catch((err) => {
      console.log("Video autoplay failed, user interaction required:", err);
    });

    return () => {
      videoElement.removeEventListener("ended", handleVideoEnd);
      videoElement.removeEventListener("loadeddata", () => setIsLoading(false));
      videoElement.removeEventListener("playing", () => setIsLoading(false));
    };
  }, [showVideo, isMobile, setShowVideo, setVideoFinished]);

  if (!showVideo || !isMobile) return null;

  return (
    <div className="video-tutorial-overlay">
      {isLoading && (
        <div className="video-loading-shimmer">
          <div className="shimmer-spinner"></div>
          <p>Loading video...</p>
        </div>
      )}
      <button
        className="video-skip-button"
        onClick={() => {
          setShowVideo(false);
          setVideoFinished(true);
        }}
      >
        Skip
      </button>
      <video
        ref={videoRef}
        className="video-tutorial"
        autoPlay
        playsInline
        controls
        preload="metadata"
      >
        <source src={videoTutorial} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoTutorialModal;
