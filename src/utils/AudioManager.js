class AudioManager {
  constructor() {
    this.audioElements = {};
    this.currentAudio = null;
    this.currentAudioNumber = null;
    this.isPlaying = false;
    this.volume = 0.4;
    this.isMuted = false;
    this.playQueue = [];
    this.onPlayingCallback = null;
    this.onEndedCallback = null;
    this.onProgressCallback = null;
    this.progressInterval = null;
    this.audioBasePath = "/audio/";

    // Don't load all audio at once - use lazy loading instead
  }

  // Lazy load audio on-demand to avoid browser restrictions
  getOrCreateAudio(audioNumber) {
    if (this.audioElements[audioNumber]) {
      return this.audioElements[audioNumber];
    }

    try {
      const audioPath = `${this.audioBasePath}(${audioNumber}).mp3`;
      const audio = new Audio();

      // Set properties before setting src
      audio.volume = this.volume;
      audio.muted = this.isMuted;
      audio.preload = "metadata"; // Only load metadata, not full audio

      // Set src after properties
      audio.src = audioPath;

      audio.addEventListener("error", (e) => {
        console.error(`Failed to load audio ${audioNumber}:`, audioPath, e);
      });

      audio.addEventListener("loadedmetadata", () => {
        console.log(`Audio ${audioNumber} metadata loaded successfully`);
      });

      this.audioElements[audioNumber] = audio;
      return audio;
    } catch (error) {
      console.error(`Error creating audio ${audioNumber}:`, error);
      return null;
    }
  }

  async play(audioNumber, onEnded = null) {
    this.stop();

    // Lazy load audio element on-demand
    const audio = this.getOrCreateAudio(audioNumber);

    if (!audio) {
      console.warn(
        `Audio ${audioNumber} not found, falling back to text-only mode`
      );
      return 0;
    }

    this.currentAudio = audio;
    this.currentAudioNumber = audioNumber;
    this.isPlaying = true;

    const handleEnded = () => {
      this.isPlaying = false;
      this.currentAudio = null;
      this.currentAudioNumber = null;
      this.stopProgressTracking();

      if (onEnded) onEnded();
      if (this.onEndedCallback) this.onEndedCallback(audioNumber);

      audio.removeEventListener("ended", handleEnded);
    };

    audio.addEventListener("ended", handleEnded);

    if (this.onPlayingCallback) {
      this.onPlayingCallback(audioNumber);
    }

    try {
      // Reset to beginning and attempt playback
      audio.currentTime = 0;
      await audio.play();
      this.startProgressTracking();

      // Return duration in milliseconds, with fallback
      const duration =
        audio.duration && isFinite(audio.duration)
          ? audio.duration * 1000
          : 3000; // Fallback to 3 seconds if duration unknown

      return duration;
    } catch (error) {
      console.error(`Failed to play audio ${audioNumber}:`, error);

      // Check if it's an autoplay policy error
      if (error.name === "NotAllowedError") {
        console.warn(
          "Audio playback blocked by browser autoplay policy. User interaction required."
        );
      }

      this.isPlaying = false;
      return 0;
    }
  }

  async playSequence(audioNumbers, onEachEnded = null) {
    this.playQueue = [...audioNumbers];

    for (const audioNumber of audioNumbers) {
      await this.play(audioNumber);

      await new Promise((resolve) => {
        const audio = this.getOrCreateAudio(audioNumber);
        if (audio) {
          const handleEnd = () => {
            if (onEachEnded) onEachEnded(audioNumber);
            audio.removeEventListener("ended", handleEnd);
            resolve();
          };
          audio.addEventListener("ended", handleEnd);
        } else {
          resolve();
        }
      });
    }

    this.playQueue = [];
  }

  pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.stopProgressTracking();
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
      this.currentAudio = null;
      this.currentAudioNumber = null;
      this.stopProgressTracking();
    }
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));

    Object.values(this.audioElements).forEach((audio) => {
      audio.volume = this.volume;
    });
  }

  mute() {
    this.isMuted = true;
    Object.values(this.audioElements).forEach((audio) => {
      audio.muted = true;
    });
  }

  unmute() {
    this.isMuted = false;
    Object.values(this.audioElements).forEach((audio) => {
      audio.muted = false;
    });
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  getPlayingState() {
    return {
      isPlaying: this.isPlaying,
      currentAudioNumber: this.currentAudioNumber,
      isMuted: this.isMuted,
      volume: this.volume,
    };
  }

  onPlaying(callback) {
    this.onPlayingCallback = callback;
  }

  onEnded(callback) {
    this.onEndedCallback = callback;
  }

  onProgress(callback) {
    this.onProgressCallback = callback;
  }

  startProgressTracking() {
    if (!this.currentAudio || this.progressInterval) return;

    this.progressInterval = setInterval(() => {
      if (this.currentAudio && this.isPlaying) {
        const currentTime = this.currentAudio.currentTime * 1000;
        const duration = this.currentAudio.duration * 1000;
        const progress = duration > 0 ? currentTime / duration : 0;

        if (this.onProgressCallback) {
          this.onProgressCallback({
            currentTime,
            duration,
            progress,
          });
        }
      }
    }, 100);
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  cleanup() {
    this.stop();
    this.stopProgressTracking();

    Object.values(this.audioElements).forEach((audio) => {
      audio.pause();
      audio.src = "";
      audio.load();
    });

    this.audioElements = {};
  }
}

const audioManager = new AudioManager();
export default audioManager;
