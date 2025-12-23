import { pauseVoice, resumeVoice, stopVoice } from "../utils/speak";

export default function VoiceControls() {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button onClick={pauseVoice}>⏸</button>
      <button onClick={resumeVoice}>▶</button>
      <button onClick={stopVoice}>⏹</button>
    </div>
  );
}
