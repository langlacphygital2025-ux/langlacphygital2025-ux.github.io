import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import ChatbotStateManager, {
  CHATBOT_STATES,
} from "../utils/ChatbotStateManager";
import audioManager from "../utils/AudioManager";
import { getMessageByAudioNumber } from "../utils/chatbotMessages";
import { splitIntoChunks, calculateChunkTimings } from "../utils/textChunker";

const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const [message, setMessage] = useState("");
  const [currentChunk, setCurrentChunk] = useState("");
  const [chunks, setChunks] = useState([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cornerIndex, setCornerIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudioNumber, setCurrentAudioNumber] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const stateManagerRef = useRef(new ChatbotStateManager());
  const timeoutRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const isProcessingRef = useRef(false);
  const chunkTimeoutsRef = useRef([]);

  useEffect(() => {
    audioManager.onPlaying((audioNum) => {
      setIsAudioPlaying(true);
      setCurrentAudioNumber(audioNum);
    });

    audioManager.onEnded((audioNum) => {
      setIsAudioPlaying(false);
      setCurrentAudioNumber(null);
    });

    return () => {
      audioManager.cleanup();
    };
  }, []);

  const clearChunkTimeouts = useCallback(() => {
    chunkTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    chunkTimeoutsRef.current = [];
  }, []);

  const displayChunkSequence = useCallback(
    (textChunks, totalDuration, skipFirst = false) => {
      if (!textChunks || textChunks.length === 0) return;

      // Clear any existing chunk timeouts
      clearChunkTimeouts();

      if (skipFirst) {
        // First chunk already displayed, only schedule remaining chunks
        if (textChunks.length <= 1) return; // No more chunks to display

        // Calculate timing for remaining chunks
        const timePerChunk = totalDuration / textChunks.length;

        // Schedule remaining chunks (starting from index 1)
        for (let i = 1; i < textChunks.length; i++) {
          const timeout = setTimeout(() => {
            setCurrentChunk(textChunks[i]);
            setChunkIndex(i);
          }, i * timePerChunk);
          chunkTimeoutsRef.current.push(timeout);
        }
      } else {
        // Original behavior - display all chunks with timing
        const timings = calculateChunkTimings(totalDuration, textChunks.length);

        // Display first chunk immediately
        setCurrentChunk(textChunks[0]);
        setChunkIndex(0);

        // Schedule remaining chunks
        textChunks.forEach((chunk, index) => {
          if (index === 0) return; // Skip first chunk (already displayed)

          const timeout = setTimeout(() => {
            setCurrentChunk(chunk);
            setChunkIndex(index);
          }, timings[index]);

          chunkTimeoutsRef.current.push(timeout);
        });
      }
    },
    [clearChunkTimeouts]
  );

  const displayMessage = useCallback(
    async (stateInfo) => {
      if (!stateInfo || !stateInfo.audioNumbers) return;

      isProcessingRef.current = true;
      setIsVisible(true);

      const { audioNumbers, isSequential } = stateInfo;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearChunkTimeouts();

      if (isSequential && audioNumbers.length > 1) {
        let totalDuration = 0;
        // Process each audio in sequence
        for (const audioNum of audioNumbers) {
          const messageText = getMessageByAudioNumber(audioNum);
          setMessage(messageText);
          const textChunks = splitIntoChunks(messageText, 5);
          setChunks(textChunks);
          // Set first chunk immediately
          if (textChunks.length > 0) {
            setCurrentChunk(textChunks[0]);
            setChunkIndex(0);
          }
          // Wait for browser paint
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                resolve();
              });
            });
          });
          // Play audio
          const duration = await audioManager.play(audioNum);
          // Display remaining chunks
          if (duration > 0 && textChunks.length > 1) {
            displayChunkSequence(textChunks, duration, true);
          } else if (textChunks.length > 1) {
            displayChunkSequence(textChunks, 3000, true);
          }
          // Wait for audio to complete
          await new Promise((resolve) => {
            const audio = audioManager.audioElements[audioNum];
            if (audio) {
              const handleEnd = () => {
                audio.removeEventListener("ended", handleEnd);
                resolve();
              };
              audio.addEventListener("ended", handleEnd);
            } else {
              setTimeout(resolve, duration || 3000);
            }
          });
          totalDuration += duration || 3000;
        }
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          isProcessingRef.current = false;
          clearChunkTimeouts();
        }, 500);
      } else {
        const audioNum = audioNumbers[0];
        const messageText = getMessageByAudioNumber(audioNum);
        setMessage(messageText);
        // Split message into 5-word chunks
        const textChunks = splitIntoChunks(messageText, 5);
        setChunks(textChunks);
        // Set first chunk immediately
        if (textChunks.length > 0) {
          setCurrentChunk(textChunks[0]);
          setChunkIndex(0);
        }
        // Wait for browser to paint the UI updates before starting audio
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve();
            });
          });
        });
        try {
          const duration = await audioManager.play(audioNum);
          // Display remaining chunks synchronized with audio duration
          if (duration > 0 && textChunks.length > 1) {
            displayChunkSequence(textChunks, duration, true); // skipFirst = true
          } else if (textChunks.length > 1) {
            // Fallback: no audio, use estimated timing (3 seconds)
            displayChunkSequence(textChunks, 3000, true);
          }
          timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            isProcessingRef.current = false;
            clearChunkTimeouts();
          }, duration + 500);
        } catch (error) {
          console.error("Audio playback error:", error);
          // Fallback timing on error
          if (textChunks.length > 1) {
            displayChunkSequence(textChunks, 3000, true);
          }
          timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            isProcessingRef.current = false;
            clearChunkTimeouts();
          }, 5000);
        }
      }
    },
    [displayChunkSequence, clearChunkTimeouts]
  );

  const transitionToChatbotState = useCallback(
    (state) => {
      const stateInfo = stateManagerRef.current.transitionToState(state);
      if (stateInfo) {
        displayMessage(stateInfo);
      }
    },
    [displayMessage]
  );

  const showIdleMessage = useCallback(() => {
    if (stateManagerRef.current.canShowIdle() && !isProcessingRef.current) {
      const idleInfo = stateManagerRef.current.getIdleMessage();
      displayMessage(idleInfo);
    }
  }, [displayMessage]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      showIdleMessage();
      resetIdleTimer();
    }, 30000);
  }, [showIdleMessage]);

  const startAwaitingInput = useCallback(() => {
    stateManagerRef.current.transitionToState(CHATBOT_STATES.AWAITING_INPUT);
    resetIdleTimer();
  }, [resetIdleTimer]);

  const hideMessage = useCallback(() => {
    setIsVisible(false);
    isProcessingRef.current = false;
    audioManager.stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    clearChunkTimeouts();
  }, [clearChunkTimeouts]);

  const resetChatbot = useCallback(() => {
    stateManagerRef.current.reset();
    hideMessage();
  }, [hideMessage]);

  const toggleMute = useCallback(() => {
    audioManager.toggleMute();
    setIsMuted(audioManager.isMuted);
  }, []);

  const setVolume = useCallback((level) => {
    audioManager.setVolume(level);
  }, []);

  const updateCornerPosition = useCallback(() => {
    setCornerIndex((prev) => (prev + 1) % 4);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearChunkTimeouts();
    };
  }, [clearChunkTimeouts]);

  return (
    <ChatbotContext.Provider
      value={{
        message,
        currentChunk,
        chunks,
        chunkIndex,
        isVisible,
        cornerIndex,
        isAudioPlaying,
        currentAudioNumber,
        isMuted,
        transitionToChatbotState,
        resetIdleTimer,
        hideMessage,
        resetChatbot,
        startAwaitingInput,
        updateCornerPosition,
        toggleMute,
        setVolume,
        CHATBOT_STATES,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbot must be used within ChatbotProvider");
  return ctx;
}
