import React, { createContext, useContext, useState } from "react";

const VideoTutorialContext = createContext();

export function VideoTutorialProvider({ children }) {
  const [showVideo, setShowVideo] = useState(true);
  const [videoFinished, setVideoFinished] = useState(false);

  return (
    <VideoTutorialContext.Provider
      value={{ showVideo, setShowVideo, videoFinished, setVideoFinished }}
    >
      {children}
    </VideoTutorialContext.Provider>
  );
}

export function useVideoTutorial() {
  const context = useContext(VideoTutorialContext);
  if (!context) {
    throw new Error(
      "useVideoTutorial must be used within VideoTutorialProvider"
    );
  }
  return context;
}
