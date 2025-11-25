import { messages } from "./chatbotMessages";

export const CHATBOT_STATES = {
  IDLE: "IDLE",
  INTRO: "INTRO",
  TURN_START: "TURN_START",
  AWAITING_INPUT: "AWAITING_INPUT",
  CHALLENGE_SHOWN: "CHALLENGE_SHOWN",
  AWAITING_ANSWER: "AWAITING_ANSWER",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  BETWEEN_TURNS: "BETWEEN_TURNS",
};

class ChatbotStateManager {
  constructor() {
    this.currentState = CHATBOT_STATES.IDLE;
    this.previousState = null;
    this.messageCounters = {};
    this.initializeCounters();
  }

  initializeCounters() {
    Object.keys(messages).forEach((category) => {
      this.messageCounters[category] = 0;
    });
  }

  getMessageForCategory(category) {
    if (!messages[category] || messages[category].length === 0) {
      return null;
    }

    const categoryMessages = messages[category];
    const currentIndex = this.messageCounters[category];
    const message = categoryMessages[currentIndex];

    this.messageCounters[category] =
      (currentIndex + 1) % categoryMessages.length;

    return message;
  }

  transitionToState(newState) {
    if (newState === this.currentState) {
      return null;
    }

    this.previousState = this.currentState;
    this.currentState = newState;

    const stateMessageMap = {
      [CHATBOT_STATES.INTRO]: "intro",
      [CHATBOT_STATES.TURN_START]: "turnStart",
      [CHATBOT_STATES.CHALLENGE_SHOWN]: "challengeShown",
      [CHATBOT_STATES.SUCCESS]: "success",
      [CHATBOT_STATES.FAILURE]: "failure",
    };

    const messageCategory = stateMessageMap[newState];
    if (messageCategory) {
      return this.getMessageForCategory(messageCategory);
    }

    return null;
  }

  getIdleMessage() {
    return this.getMessageForCategory("idle");
  }

  canShowIdle() {
    return this.currentState === CHATBOT_STATES.AWAITING_INPUT;
  }

  reset() {
    this.currentState = CHATBOT_STATES.IDLE;
    this.previousState = null;
    this.initializeCounters();
  }

  getState() {
    return this.currentState;
  }

  getPreviousState() {
    return this.previousState;
  }
}

export default ChatbotStateManager;
