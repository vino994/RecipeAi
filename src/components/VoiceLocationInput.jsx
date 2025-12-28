import { useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceLocationInput({ onLocationDetected, onError }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!SpeechRecognition) {
      onError?.("Speech Recognition not supported");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setListening(false);
      onLocationDetected(text);
    };

    recognition.onerror = (e) => {
      setListening(false);
      console.error("Speech error:", e.error);
      onError?.("Mic permission or speech failed");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`px-4 py-3 rounded-xl font-semibold transition
        ${listening
          ? "bg-red-500 animate-pulse"
          : "bg-blue-600 hover:bg-blue-700"}
        text-white`}
    >
      {listening ? "🎙 Listening..." : "🎤 Speak"}
    </button>
  );
}
