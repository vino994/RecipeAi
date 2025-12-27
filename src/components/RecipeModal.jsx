import { useEffect, useRef, useState } from "react";
import { translateText } from "../services/api";
import { playTTS, stopTTS } from "../services/tts";

export default function RecipeModal({ recipe, onClose }) {
  const [language, setLanguage] = useState("en");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const autoPlayRef = useRef(false);

  /* ---------- PREPARE STEPS ---------- */
  useEffect(() => {
    let active = true;

    // stop any playing audio when language / recipe changes
    stopTTS();
    autoPlayRef.current = false;
    setCurrentStep(null);

    async function prepare() {
      try {
        if (language === "en") {
          setSteps(recipe.instructions);
          return;
        }

        const joined = recipe.instructions.join("\n");
        const res = await translateText(joined, "ta");

        if (!active) return;

        const split = res.data.text
          .split(/\n|।|\./)
          .map(s => s.trim())
          .filter(Boolean);

        setSteps(split);
      } catch (err) {
        console.error("Translation failed:", err);
        setSteps([]);
      }
    }

    prepare();

    return () => {
      active = false;
      stopTTS();
      autoPlayRef.current = false;
    };
  }, [language, recipe]);

  /* ---------- PLAY ONE STEP ---------- */
  const speakStep = (index) => {
    if (!steps[index]) return;

    setCurrentStep(index);

    playTTS(steps[index], language, () => {
      if (autoPlayRef.current && index < steps.length - 1) {
        speakStep(index + 1);
      }
    });
  };

  /* ---------- CONTROLS ---------- */
  const start = () => {
    if (!steps.length) return;
    autoPlayRef.current = true;
    speakStep(0);
  };

  const stop = () => {
    autoPlayRef.current = false;
    stopTTS();
  };

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl flex flex-col max-h-[85vh]">

        {/* IMAGE + CLOSE */}
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-36 object-cover rounded-t-xl"
          />
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            className="absolute top-2 right-2 bg-white px-2 rounded"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-y-auto flex-1">
          <h2 className="font-bold text-lg">{recipe.name}</h2>

          {/* LANGUAGE TOGGLE */}
          <div className="flex gap-2 mt-2">
            {["en", "ta"].map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1 rounded text-sm ${
                  language === l ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {l === "en" ? "English" : "தமிழ்"}
              </button>
            ))}
          </div>

          {/* STEPS */}
          <h3 className="mt-3 font-semibold">Steps</h3>
          {steps.map((s, i) => (
            <p
              key={i}
              className={`p-2 mt-1 rounded text-sm ${
                i === currentStep ? "bg-yellow-200" : "bg-gray-100"
              }`}
            >
              {s}
            </p>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex gap-2 p-3 border-t bg-white">
          <button
            onClick={start}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            ▶ Play
          </button>
          <button
            onClick={stop}
            className="flex-1 bg-red-500 text-white py-2 rounded"
          >
            ⏹ Stop
          </button>
        </div>

      </div>
    </div>
  );
}
