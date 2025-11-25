import { useAudio } from "../context/AudioContext";
import "./AudioControl.css";
import volumeMuteIcon from "../assets/volume_mute.png";
import volumeYesIcon from "../assets/volume_yes.png";

function AudioControl() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      className="audio-control-button"
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      title={isMuted ? "Unmute background music" : "Mute background music"}
    >
      <img
        src={isMuted ? volumeMuteIcon : volumeYesIcon}
        alt={isMuted ? "Muted" : "Playing"}
        className="audio-control-icon"
      />
    </button>
  );
}

export default AudioControl;
