# Chatbot Audio Repetition Fix - Implementation Summary

## Problem Analysis
The chatbot was repeating the same audio message because non-sequential states were randomly selecting a single audio variation each time, instead of rotating through all available variations.

### Root Cause
In `ChatbotContext.jsx` (line 164-165), the code was:
```javascript
const audioNum = audioNumbers[Math.floor(Math.random() * audioNumbers.length)];
```

This meant:
- **Non-sequential states** (TURN_START, CHALLENGE_INPUT, CHALLENGE_SHOWN): Only played ONE random audio from available options
- **Sequential states** (SUCCESS, FAILURE, HOPE_SQUARE): Played ALL audios in sequence ✅

## Solution Implemented

### 1. **ChatbotStateManager.js** - Added Rotation Logic

#### Added state audio counters:
```javascript
this.stateAudioCounters = {};  // Tracks which audio to play next for each state
```

#### Added initialization method:
```javascript
initializeStateAudioCounters() {
  Object.keys(STATE_AUDIO_MAP).forEach((state) => {
    this.stateAudioCounters[state] = 0;
  });
}
```

#### Added rotation method:
```javascript
getNextAudioForState(state) {
  const audioNumbers = STATE_AUDIO_MAP[state];
  if (!audioNumbers || audioNumbers.length === 0) {
    return null;
  }

  // Sequential states play all audios in order
  if (this.shouldPlaySequential(state)) {
    return audioNumbers;
  }

  // Non-sequential states rotate through variations
  const currentIndex = this.stateAudioCounters[state] || 0;
  const nextAudioNumber = audioNumbers[currentIndex];
  
  // Move counter to next audio (wraps around with modulo)
  this.stateAudioCounters[state] = (currentIndex + 1) % audioNumbers.length;
  
  return [nextAudioNumber];
}
```

#### Updated transitionToState:
Now uses `getNextAudioForState()` instead of relying on ChatbotContext's random selection.

#### Updated reset method:
Now resets audio counters when the chatbot resets.

### 2. **ChatbotContext.jsx** - Removed Random Selection

Changed line 164 from:
```javascript
const audioNum = audioNumbers[Math.floor(Math.random() * audioNumbers.length)];
```

To:
```javascript
const audioNum = audioNumbers[0];
```

This trusts the state manager's rotation logic which is already applied by `getNextAudioForState()`.

## Expected Behavior After Fix

### Non-Sequential States (Rotation)
- **TURN_START** (audios 4, 5, 6, 7):
  - 1st call → audio 4: "Chà, đội nào đi trước vậy nhỉ"
  - 2nd call → audio 5: "Đến lượt của đội mình rồi đó!"
  - 3rd call → audio 6: "Xin chào đội Lạc con, các bạn đã sẵn sàng chưa?"
  - 4th call → audio 7: "Nào, xoay vòng quay thôi!..."
  - 5th call → audio 4: (cycles back)

- **CHALLENGE_INPUT** (audios 8, 9, 10, 11): Rotates through 4 variations
- **CHALLENGE_SHOWN** (audios 12-17): Rotates through 6 variations

### Sequential States (Unchanged - Still Play All)
- **SUCCESS** (audios 18, 19, 20): Plays all 3 audios in sequence
- **FAILURE** (audios 21, 22): Plays all 2 audios in sequence
- **HOPE_SQUARE** (audios 23, 24, 25): Plays all 3 audios in sequence

### IDLE Messages (Still Random)
- **IDLE** (audios 26-40): Still uses random selection for variety during waiting periods

## Manual Testing Checklist

### ✅ Test Non-Sequential State Rotation (TURN_START)
- [ ] Start the game multiple times
- [ ] Each turn start should play a different message
- [ ] After 4 turns, verify rotation cycles back to the first message
- [ ] Listen for: "Chà, đội nào...", "Đến lượt...", "Xin chào đội...", "Nào, xoay vòng..."

### ✅ Test CHALLENGE_SHOWN State (6 variations)
- [ ] Show challenges multiple times
- [ ] Verify audio messages rotate through all 6 variations
- [ ] No repeated messages until all 6 have played

### ✅ Test Sequential States (SUCCESS, FAILURE, HOPE_SQUARE)
- [ ] Trigger SUCCESS: Should hear 3 consecutive audios
- [ ] Trigger FAILURE: Should hear 2 consecutive audios
- [ ] Trigger HOPE_SQUARE: Should hear 3 consecutive audios
- [ ] Verify sequential playback still works correctly

### ✅ Test IDLE Messages
- [ ] Wait for 30 seconds without interaction
- [ ] Verify random idle messages appear
- [ ] Different messages should play (random selection is correct for IDLE)

### ✅ Test Reset
- [ ] Complete a full game
- [ ] Start a new game
- [ ] Verify audio rotation counters reset
- [ ] TURN_START should start from audio 4 again

### ✅ Browser Console Check
- [ ] Open DevTools (F12)
- [ ] Check Console tab for any audio loading errors
- [ ] Verify no errors during state transitions

## Implementation Impact

### Files Modified
1. **src/utils/ChatbotStateManager.js**
   - Added `stateAudioCounters` object
   - Added `initializeStateAudioCounters()` method
   - Added `getNextAudioForState()` method
   - Updated `transitionToState()` to use rotation
   - Updated `reset()` to reset audio counters

2. **src/context/ChatbotContext.jsx**
   - Removed random selection logic (line 164)
   - Now uses state manager's rotation directly

### No Breaking Changes
- All 40 audio files are still utilized
- Sequential behavior for SUCCESS, FAILURE, HOPE_SQUARE preserved
- IDLE random selection preserved
- API and context remain unchanged

## Verification Status
- ✅ No compilation errors
- ✅ Code follows existing patterns
- ✅ State manager handles rotation properly
- ✅ Dev server running successfully
- ⏳ Awaiting manual testing confirmation

## Next Steps
1. Open browser and navigate to http://localhost:3000/
2. Play through the game multiple times
3. Test each state transition type
4. Verify audio rotation and sequential playback
5. Check browser console for errors
6. Confirm no repetitive messages
