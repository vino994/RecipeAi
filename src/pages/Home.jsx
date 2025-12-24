import { useState, useRef, useEffect } from "react";
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
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const autoPlayRef = useRef(false);
  const stepRefs = useRef([]);

  /* ---------- STOP AUDIO ---------- */
  const stopAudio = () => {
    autoPlayRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  /* ---------- SPEAK STEP ---------- */
  const speakStep = async (index) => {
    if (!steps[index]) return;

    setCurrentStep(index);

    const audio = await playTTS(steps[index], language);
    audioRef.current = audio;

    audio.onended = () => {
      if (autoPlayRef.current && index < steps.length - 1) {
        speakStep(index + 1);
      }
    };

    audio.play();
  };

  /* ---------- AUTO START AFTER GENERATE (🔥 FIX) ---------- */
  useEffect(() => {
    if (steps.length > 0 && autoPlayRef.current) {
      speakStep(0);
    }
  }, [steps]);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    stepRefs.current[currentStep]?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, [currentStep]);

  /* ---------- MANUAL CONTROLS ---------- */
  const nextStep = () => {
    stopAudio();
    autoPlayRef.current = true;
    if (currentStep < steps.length - 1) {
      speakStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    stopAudio();
    autoPlayRef.current = true;
    if (currentStep > 0) {
      speakStep(currentStep - 1);
    }
  };

  /* ---------- SPEECH INPUT ---------- */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice input not supported");

    const recog = new SR();
    recognitionRef.current = recog;
    recog.lang = LANG[language].speech;

    recog.onresult = (e) => {
      setText(e.results[0][0].transcript);
      setListening(false);
    };

    recog.onend = () => setListening(false);
    recog.start();
    setListening(true);
  };

  /* ---------- GENERATE ---------- */
  const generateRecipe = async () => {
    if (!text.trim()) return;

    setLoading(true);
    stopAudio();
    setSteps([]);
    setCurrentStep(0);

    try {
      const res = await getRecipe(text, language);
      const recipeText = res?.data?.mainRecipe;
      if (!recipeText) return alert("Say dish name like: தக்காளி குழம்பு");

      const split = recipeText
        .split(/\n|\d+\./)
        .map(s => s.trim())
        .filter(s => s.length > 3);

      autoPlayRef.current = true; // 🔥 enable autoplay
      setSteps(split);

    } catch {
      alert("Recipe failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen flex justify-center px-4 pt-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">🍲 Recipe AI</h2>

        <textarea
          className="w-full border rounded-xl p-4 text-lg"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-4 mt-6">
          <button onClick={startListening} className={btnPrimary}>🎤 Speak</button>
          {loading
            ? <Loader />
            : <button onClick={generateRecipe} className={btnSecondary}>🍳 Generate</button>}
        </div>

        {steps.length > 0 && (
          <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {steps.map((step, i) => (
              <p
                key={i}
                ref={el => (stepRefs.current[i] = el)}
                className={`p-3 rounded ${
                  i === currentStep ? "bg-yellow-300 font-semibold" : "bg-gray-100"
                }`}
              >
                {step}
              </p>
            ))}
          </div>
        )}

        {steps.length > 0 && (
          <div className="flex justify-center gap-3 mt-4">
            <button onClick={prevStep} className={btnSecondary}>⏮ Prev</button>
            <button onClick={nextStep} className={btnSecondary}>⏭ Next</button>
            <button onClick={stopAudio} className={btnDanger}>⏹ Stop</button>
          </div>
        )}

      </div>
    </div>
  );
}
