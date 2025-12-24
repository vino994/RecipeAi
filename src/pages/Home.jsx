import { useState, useRef } from "react";
import { getRecipe } from "../services/api";
import { playTTS } from "../services/tts";
import { LANG } from "../utils/languageMap";

/* ---------- BUTTON STYLES ---------- */
const btn =
  "px-6 py-3 rounded-xl text-lg font-semibold shadow transition w-full sm:w-auto";
const btnPrimary = `${btn} bg-black text-white`;
const btnSecondary = `${btn} bg-gray-200 text-gray-800`;
const btnDanger = `${btn} bg-red-500 text-white`;

function Loader() {
  return (
    <div className="flex justify-center">
      <div className="h-8 w-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState("ta");
  const [text, setText] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  /* ---------- SPEECH INPUT ---------- */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input not supported");
      return;
    }

    const recog = new SR();
    recognitionRef.current = recog;
    recog.lang = LANG[language].speech;
    recog.continuous = false;

    recog.onresult = (e) => {
      setText(e.results[0][0].transcript);
      setListening(false);
    };

    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);

    recog.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  /* ---------- GENERATE ---------- */
  const generateRecipe = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setRecipe("");
    audioRef.current?.pause();

    try {
      const res = await getRecipe(text, language);
      const recipeText = res?.data?.mainRecipe;

      if (!recipeText) {
        alert("Please say dish name like: தக்காளி குழம்பு");
        return;
      }

      setRecipe(recipeText);

      // 🔥 GOOGLE TTS AUDIO
      audioRef.current = await playTTS(recipeText, language);

    } catch (err) {
      console.error(err);
      alert("Recipe failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- AUDIO CONTROLS ---------- */
  const pauseAudio = () => audioRef.current?.pause();
  const resumeAudio = () => audioRef.current?.play();
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen flex justify-center px-4 pt-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          🍲 Recipe AI
        </h2>

        {/* LANGUAGE */}
        <div className="flex justify-center gap-3 mb-4">
          {["ta", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-4 py-2 rounded-full ${
                language === l ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {LANG[l].label}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <textarea
          className="w-full border rounded-xl p-4 text-lg"
          rows={3}
          placeholder="Speak or type ingredients..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {!listening ? (
            <button onClick={startListening} className={btnPrimary}>
              🎤 Speak
            </button>
          ) : (
            <button onClick={stopListening} className={btnDanger}>
              ⏹ Stop
            </button>
          )}

          {loading ? (
            <Loader />
          ) : (
            <button onClick={generateRecipe} className={btnSecondary}>
              🍳 Generate
            </button>
          )}
        </div>

        {/* AUDIO CONTROLS */}
        {recipe && (
          <div className="flex gap-3 mt-4">
            <button onClick={pauseAudio} className={btnSecondary}>⏸ Pause</button>
            <button onClick={resumeAudio} className={btnSecondary}>▶ Play</button>
            <button onClick={stopAudio} className={btnDanger}>⏹ Stop</button>
          </div>
        )}

        {/* RECIPE */}
        {recipe && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <pre className="whitespace-pre-wrap">{recipe}</pre>
          </div>
        )}

      </div>
    </div>
  );
}
