import React, { useEffect } from "react";
import { useVideoTutorial } from "../context/VideoTutorialContext";
import { useAudio } from "../context/AudioContext";

function AudioDelayWrapper() {
  const { videoFinished, showVideo } = useVideoTutorial();
  const { setCanStartAudio } = useAudio();

  useEffect(() => {
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      );

    if (isMobile) {
      if (!showVideo && videoFinished) {
        setCanStartAudio(true);
      } else {
        setCanStartAudio(false);
      }
    } else {
      setCanStartAudio(true);
    }
  }, [videoFinished, showVideo, setCanStartAudio]);

  return null;
}

export default AudioDelayWrapper;
