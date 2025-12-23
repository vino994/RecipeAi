import { useState, useEffect, useRef } from "react";
import { getRecipe, translateRecipe } from "../services/api";
import {
  speakText,
  speakSteps,
  pauseVoice,
  resumeVoice,
  stopVoice,
  getVoices
} from "../utils/speak";
import { saveRecipe } from "../utils/recipeHistory";
import RecipeHistory from "../components/RecipeHistory";
import VoiceControls from "../components/VoiceControls";
import { LANG } from "../utils/languageMap";

/* ---------------- BUTTON STYLES ---------------- */

const btnPrimary =
  "flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-lg font-medium shadow hover:scale-105 transition";

const btnSecondary =
  "flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-800 text-lg font-medium shadow hover:bg-gray-300 transition";

const btnDanger =
  "flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white text-lg font-medium shadow hover:bg-red-600 transition";

/* ---------------- LOADER ---------------- */

function Loader() {
  return (
    <div className="flex justify-center">
      <div className="h-8 w-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function Home() {
  const [language, setLanguage] = useState("ta");
  const [text, setText] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);

  /* ---------------- LOAD VOICES ---------------- */

  useEffect(() => {
    const v = getVoices(language);
    setVoices(v);
    setSelectedVoice(v[0] || null);
  }, [language]);

  /* ---------------- SPEECH INPUT ---------------- */

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");

    setText("");
    const recog = new SR();

    recog.lang = LANG[language].speech;
    recog.continuous = true;
    recog.interimResults = true;

    recog.onresult = (e) => {
      clearTimeout(silenceTimer.current);
      let finalText = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript + " ";
        }
      }

      if (finalText) setText((p) => p + finalText);
      silenceTimer.current = setTimeout(stopListening, 2500);
    };

    recog.onerror = stopListening;
    recog.start();

    recognitionRef.current = recog;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  /* ---------------- RESET ---------------- */

  const resetAll = () => {
    stopVoice();
    setText("");
    setRecipe("");
    setListening(false);
  };

  /* ---------------- NEXT RECIPE ---------------- */

  const nextRecipe = async () => {
    if (!text.trim()) return;
    await generateRecipe();
  };

  /* ---------------- GENERATE RECIPE ---------------- */

  const generateRecipe = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      stopVoice();

      // Always search in English text
      const res = await getRecipe(text);
      let finalRecipe = res.data.recipe;

      // Translate FULL recipe if not English
      if (language !== "en") {
        const tRes = await translateRecipe(finalRecipe, language);
        finalRecipe = tRes.data.translated;
      }

      setRecipe(finalRecipe);
      saveRecipe(finalRecipe);

      speakText(finalRecipe, language, selectedVoice);
    } catch (err) {
      console.error(err);
      alert("Recipe failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex justify-center px-4 pt-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          🍲 Recipe AI Assistant
        </h2>

        {/* LANGUAGE SELECT */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {Object.entries(LANG).map(([code, l]) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-4 py-2 rounded-full text-lg ${
                language === code
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <VoiceControls />

        {/* INPUT */}
        <textarea
          className="w-full border rounded-xl p-4 text-lg"
          rows={4}
          placeholder="Speak or type ingredients..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">

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
            <button onClick={generateRecipe} className={btnPrimary}>
              🍳 Generate
            </button>
          )}

          {(text || recipe) && (
            <button onClick={resetAll} className={btnSecondary}>
              ❌ Cancel
            </button>
          )}

          {recipe && (
            <button onClick={nextRecipe} className={btnSecondary}>
              🔄 Next Recipe
            </button>
          )}
        </div>

        {/* OUTPUT */}
        {recipe && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">

            {/* VOICE CONTROLS */}
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => speakText(recipe, language, selectedVoice)}>🔊</button>
              <button onClick={() => speakSteps(recipe, language, selectedVoice)}>🪜</button>
              <button onClick={pauseVoice}>⏸</button>
              <button onClick={resumeVoice}>▶</button>
              <button onClick={stopVoice}>⏹</button>
            </div>

            <pre className="whitespace-pre-wrap text-base">{recipe}</pre>
          </div>
        )}

        <RecipeHistory language={language} voice={selectedVoice} />
      </div>
    </div>
  );
}
