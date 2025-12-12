import { messages } from "./chatbotMessages";

export const CHATBOT_STATES = {
  IDLE: "IDLE",
  INTRO: "INTRO",
  LEGEND: "LEGEND",
  TURN_START: "TURN_START",
  AWAITING_INPUT: "AWAITING_INPUT",
  CHALLENGE_INPUT: "CHALLENGE_INPUT",
  CHALLENGE_SHOWN: "CHALLENGE_SHOWN",
  AWAITING_ANSWER: "AWAITING_ANSWER",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  HOPE_SQUARE: "HOPE_SQUARE",
  BETWEEN_TURNS: "BETWEEN_TURNS",
};

export const STATE_AUDIO_MAP = {
  [CHATBOT_STATES.INTRO]: [1, 2],
  [CHATBOT_STATES.LEGEND]: [3],
  [CHATBOT_STATES.TURN_START]: [4, 5, 6, 7],
  [CHATBOT_STATES.CHALLENGE_INPUT]: [8, 9, 10, 11],
  [CHATBOT_STATES.CHALLENGE_SHOWN]: [12, 13, 14, 15, 16, 17],
  [CHATBOT_STATES.SUCCESS]: [18, 19, 20],
  [CHATBOT_STATES.FAILURE]: [21, 22],
  [CHATBOT_STATES.HOPE_SQUARE]: [23, 24, 25],
  [CHATBOT_STATES.IDLE]: [
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  ],
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

    const audioNumbers = STATE_AUDIO_MAP[newState];

    if (audioNumbers && audioNumbers.length > 0) {
      return {
        audioNumbers: audioNumbers,
        isSequential: this.shouldPlaySequential(newState),
      };
    }

    return null;
  }

  shouldPlaySequential(state) {
    const sequentialStates = [
      CHATBOT_STATES.INTRO,
      CHATBOT_STATES.LEGEND,
      CHATBOT_STATES.SUCCESS,
      CHATBOT_STATES.FAILURE,
      CHATBOT_STATES.HOPE_SQUARE,
    ];

    return sequentialStates.includes(state);
  }

  getIdleMessage() {
    const idleAudioNumbers = STATE_AUDIO_MAP[CHATBOT_STATES.IDLE];

    const randomIndex = Math.floor(Math.random() * idleAudioNumbers.length);
    const audioNumber = idleAudioNumbers[randomIndex];

    return {
      audioNumbers: [audioNumber],
      isSequential: false,
    };
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
