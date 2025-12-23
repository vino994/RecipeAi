import { pauseVoice, resumeVoice, stopVoice } from "../utils/speak";

export default function VoiceControls() {
  return (
 <div className="flex flex-wrap justify-center gap-3 mb-4">
  <button onClick={() => speakText(recipe, language, selectedVoice)} className="btn-secondary">
    🔊 Read
  </button>
  <button onClick={() => speakSteps(recipe, language, selectedVoice)} className="btn-secondary">
    🪜 Steps
  </button>
  <button onClick={pauseVoice} className="btn-secondary">⏸</button>
  <button onClick={resumeVoice} className="btn-secondary">▶</button>
  <button onClick={stopVoice} className="btn-danger">⏹</button>
</div>
  );
}
