# Chatbot Audio Repetition Fix - Code Changes

## Summary
Fixed the chatbot audio repetition issue by implementing a rotation system for non-sequential audio states. The system now cycles through all available audio variations instead of randomly selecting one each time.

---

## File 1: src/utils/ChatbotStateManager.js

### Change 1: Added state audio counter in constructor
**Location:** Constructor method (lines 34-40)

```javascript
// BEFORE:
constructor() {
  this.currentState = CHATBOT_STATES.IDLE;
  this.previousState = null;
  this.messageCounters = {};
  this.initializeCounters();
}

// AFTER:
constructor() {
  this.currentState = CHATBOT_STATES.IDLE;
  this.previousState = null;
  this.messageCounters = {};
  this.stateAudioCounters = {};  // NEW: Track audio rotation
  this.initializeCounters();
  this.initializeStateAudioCounters();  // NEW: Initialize counters
}
```

### Change 2: Added state audio counter initialization method
**Location:** After initializeCounters() method (new method)

```javascript
// NEW METHOD:
initializeStateAudioCounters() {
  Object.keys(STATE_AUDIO_MAP).forEach((state) => {
    this.stateAudioCounters[state] = 0;
  });
}
```

**Purpose:** Initializes all state audio counters to 0, tracking which audio to play next for each state.

### Change 3: Added getNextAudioForState() method
**Location:** Before transitionToState() method (new method)

```javascript
// NEW METHOD:
getNextAudioForState(state) {
  const audioNumbers = STATE_AUDIO_MAP[state];
  if (!audioNumbers || audioNumbers.length === 0) {
    return null;
  }

  // Sequential states (INTRO, LEGEND, SUCCESS, FAILURE, HOPE_SQUARE)
  // play ALL audios in order - no rotation needed
  if (this.shouldPlaySequential(state)) {
    return audioNumbers;
  }

  // Non-sequential states rotate through variations
  // TURN_START, CHALLENGE_INPUT, CHALLENGE_SHOWN
  const currentIndex = this.stateAudioCounters[state] || 0;
  const nextAudioNumber = audioNumbers[currentIndex];

  // Move counter to next audio (wraps with modulo operator)
  this.stateAudioCounters[state] = (currentIndex + 1) % audioNumbers.length;

  return [nextAudioNumber];
}
```

**Purpose:** 
- Returns all audios for sequential states (they need to play together)
- Returns single audio for non-sequential states, rotating through all variations
- Uses modulo operator to cycle back to first audio after reaching the end

### Change 4: Updated transitionToState() method
**Location:** Lines 89-107

```javascript
// BEFORE:
transitionToState(newState) {
  if (newState === this.currentState) {
    return null;
  }

  this.previousState = this.currentState;
  this.currentState = newState;

  const audioNumbers = STATE_AUDIO_MAP[newState];  // REMOVED

  if (audioNumbers && audioNumbers.length > 0) {
    return {
      audioNumbers: audioNumbers,
      isSequential: this.shouldPlaySequential(newState),
    };
  }

  return null;
}

// AFTER:
transitionToState(newState) {
  if (newState === this.currentState) {
    return null;
  }

  this.previousState = this.currentState;
  this.currentState = newState;

  const audioNumbers = this.getNextAudioForState(newState);  // UPDATED

  if (audioNumbers && audioNumbers.length > 0) {
    return {
      audioNumbers: audioNumbers,
      isSequential: this.shouldPlaySequential(newState),
    };
  }

  return null;
}
```

**Change:** Uses new `getNextAudioForState()` method instead of directly accessing STATE_AUDIO_MAP.

### Change 5: Updated reset() method
**Location:** Lines 140-144

```javascript
// BEFORE:
reset() {
  this.currentState = CHATBOT_STATES.IDLE;
  this.previousState = null;
  this.initializeCounters();
}

// AFTER:
reset() {
  this.currentState = CHATBOT_STATES.IDLE;
  this.previousState = null;
  this.initializeCounters();
  this.initializeStateAudioCounters();  // ADDED: Reset audio counters
}
```

**Purpose:** Ensures audio counters reset when chatbot resets, allowing audio rotation to start fresh.

---

## File 2: src/context/ChatbotContext.jsx

### Change: Replaced random selection with rotation-based selection
**Location:** Line 164 in displayMessage callback

```javascript
// BEFORE:
} else {
  const audioNum = audioNumbers[Math.floor(Math.random() * audioNumbers.length)];
  // ... rest of code

// AFTER:
} else {
  const audioNum = audioNumbers[0];
  // ... rest of code
}
```

**Purpose:**
- Removed random selection that caused repetition
- Now trusts the state manager's `getNextAudioForState()` which has already selected the correct audio to use
- For non-sequential states: audioNumbers[0] is the single rotated audio
- For sequential states: audioNumbers array is unchanged (still plays all)

---

## How It Works

### Non-Sequential State Flow (e.g., TURN_START with audios [4, 5, 6, 7])

1. **First Call:**
   - `getNextAudioForState("TURN_START")` is called
   - Counter = 0, so audio 4 is selected
   - Counter advances: 0 → 1
   - Returns `[4]`
   - Message: "Chà, đội nào đi trước vậy nhỉ"

2. **Second Call:**
   - Counter = 1, so audio 5 is selected
   - Counter advances: 1 → 2
   - Returns `[5]`
   - Message: "Đến lượt của đội mình rồi đó!"

3. **Third Call:**
   - Counter = 2, so audio 6 is selected
   - Counter advances: 2 → 3
   - Returns `[6]`
   - Message: "Xin chào đội Lạc con, các bạn đã sẵn sàng chưa?"

4. **Fourth Call:**
   - Counter = 3, so audio 7 is selected
   - Counter advances: 3 → 0 (wraps around: 4 % 4 = 0)
   - Returns `[7]`
   - Message: "Nào, xoay vòng quay thôi!..."

5. **Fifth Call:**
   - Back to Counter = 0, audio 4 plays again
   - Cycle repeats...

### Sequential State Flow (e.g., SUCCESS with audios [18, 19, 20])

1. **Call:**
   - `getNextAudioForState("SUCCESS")` is called
   - Recognized as sequential state
   - Returns ALL audios: `[18, 19, 20]`
   - ChatbotContext plays all 3 audios in sequence

---

## Testing Scenarios

### ✅ Non-Sequential States (Should Rotate)
- TURN_START: audios [4, 5, 6, 7] → rotates through all 4
- CHALLENGE_INPUT: audios [8, 9, 10, 11] → rotates through all 4
- CHALLENGE_SHOWN: audios [12, 13, 14, 15, 16, 17] → rotates through all 6

### ✅ Sequential States (Should Play All Together)
- SUCCESS: audios [18, 19, 20] → plays all 3 in sequence
- FAILURE: audios [21, 22] → plays both in sequence
- HOPE_SQUARE: audios [23, 24, 25] → plays all 3 in sequence

### ✅ IDLE States (Still Random)
- IDLE: audios [26-40] → random selection (as designed)

---

## Benefits

1. **No More Repetition:** Users hear different messages each time the same state occurs
2. **Fair Variation:** All audio variations are used equally
3. **Predictable Pattern:** Rotation is deterministic, making it testable
4. **Preserves Sequential Behavior:** Important states still play full sequences
5. **Maintains Random IDLE:** Waiting messages still feel random and engaging
6. **Backward Compatible:** No API changes, no breaking changes

---

## Verification Checklist

- ✅ No compilation errors
- ✅ Code follows existing patterns and conventions
- ✅ Rotation logic is mathematically correct (modulo operator)
- ✅ Sequential states unaffected
- ✅ IDLE random behavior preserved
- ✅ Reset method properly reinitializes counters
- ✅ All 40 audio files properly utilized
- ✅ Dev server running successfully
