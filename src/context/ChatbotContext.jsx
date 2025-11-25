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

const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [cornerIndex, setCornerIndex] = useState(0);
  const stateManagerRef = useRef(new ChatbotStateManager());
  const timeoutRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const isProcessingRef = useRef(false);

  const displayMessage = useCallback((text) => {
    if (!text) return;

    isProcessingRef.current = true;
    setMessage(text);
    setIsVisible(true);

    // Calculate duration based on word batches (5 words per batch, 6 seconds per batch)
    const words = text.split(" ");
    const numBatches = Math.ceil(words.length / 5);
    const duration = numBatches * 6000; // 6 seconds per batch

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      isProcessingRef.current = false;
    }, duration);
  }, []);

  const transitionToChatbotState = useCallback(
    (state) => {
      const message = stateManagerRef.current.transitionToState(state);
      if (message) {
        displayMessage(message);
      }
    },
    [displayMessage]
  );

  const showIdleMessage = useCallback(() => {
    if (stateManagerRef.current.canShowIdle() && !isProcessingRef.current) {
      const idleMessage = stateManagerRef.current.getIdleMessage();
      displayMessage(idleMessage);
    }
  }, [displayMessage]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      showIdleMessage();
      resetIdleTimer();
    }, 30000); // 30 seconds between idle messages
  }, [showIdleMessage]);

  const startAwaitingInput = useCallback(() => {
    stateManagerRef.current.transitionToState(CHATBOT_STATES.AWAITING_INPUT);
    resetIdleTimer();
  }, [resetIdleTimer]);

  const hideMessage = useCallback(() => {
    setIsVisible(false);
    isProcessingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
  }, []);

  const resetChatbot = useCallback(() => {
    stateManagerRef.current.reset();
    hideMessage();
  }, [hideMessage]);

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updateCornerPosition = useCallback(() => {
    setCornerIndex((prev) => (prev + 1) % 4);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        message,
        isVisible,
        cornerIndex,
        transitionToChatbotState,
        resetIdleTimer,
        hideMessage,
        resetChatbot,
        startAwaitingInput,
        updateCornerPosition,
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
