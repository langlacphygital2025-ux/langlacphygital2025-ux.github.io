import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import themeSong from "../assets/theme_song.mp3";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canStartAudio, setCanStartAudio] = useState(false);
  const audioRef = useRef(null);
  const hasAttemptedAutoplay = useRef(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(themeSong);
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.4;
    }

    const audio = audioRef.current;

    const handleCanPlay = () => {
      if (!hasAttemptedAutoplay.current && canStartAudio) {
        hasAttemptedAutoplay.current = true;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log(
              "Autoplay prevented. User interaction required:",
              error
            );
            setIsPlaying(false);
          });
      }
    };

    const attemptPlay = () => {
      if (!isPlaying && !isMuted && canStartAudio) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {});
      }
    };

    audio.addEventListener("canplaythrough", handleCanPlay);

    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, attemptPlay, { once: true });
    });

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      events.forEach((event) => {
        document.removeEventListener(event, attemptPlay);
      });
    };
  }, [isPlaying, isMuted, canStartAudio]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        isPlaying,
        toggleMute,
        canStartAudio,
        setCanStartAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
