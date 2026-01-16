
// src/components/tour/VoiceLocationInput.jsx
import { useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

export default function VoiceLocationInput({ onLocationDetected, language }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition not supported");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      if (transcript.trim()) {
        onLocationDetected(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'not-allowed') {
        setError("Please allow microphone access");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      setError("Failed to start voice recognition");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={listening ? stopListening : startListening}
        className={`px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 min-w-[120px]
          ${listening ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-blue-600 to-purple-600"}
          text-white hover:opacity-90`}
      >
        {listening ? (
          <>
            <MicOff size={20} />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Mic size={20} />
            <span>Speak</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-500 text-white text-xs p-2 rounded z-50">
          {error}
        </div>
      )}
    </div>
  );
}