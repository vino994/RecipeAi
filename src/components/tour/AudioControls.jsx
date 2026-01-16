// src/components/tour/AudioControls.jsx
import { Play, Pause, Volume2, VolumeX, Square } from "lucide-react";
import { useState, useRef } from "react";

export default function AudioControls() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/assets/ambient.mp3" 
        preload="auto" 
        onLoadedData={() => {
          if (audioRef.current) {
            audioRef.current.volume = 0.25;
            audioRef.current.loop = true;
          }
        }}
      />
      
      <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-6">
        <button
          onClick={togglePlay}
          className="p-2 md:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          title={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 md:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          title={muted ? "Unmute audio" : "Mute audio"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          onClick={stopSpeech}
          className="p-2 md:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          title="Stop speech"
        >
          <Square size={18} />
        </button>
      </div>
    </>
  );
}