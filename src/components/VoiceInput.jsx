export default function VoiceInput({ setText, language }) {
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-US";
    recognition.onresult = (e) => {
      setText(e.results[0][0].transcript);
    };
    recognition.start();
  };

  return <button onClick={startListening}>🎤 Speak</button>;
}
