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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* BACKDROP WITH BLUR */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* MODAL CONTAINER */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* GLASSMORPHISM MODAL */}
        <div className="glass-effect w-full max-w-2xl rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl">
          
          {/* RECIPE IMAGE SECTION */}
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-48 object-cover"
            />
            
            {/* GLASS OVERLAY ON IMAGE */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                stop();
                onClose();
              }}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full glass-button hover:scale-110 transition-transform"
            >
              <span className="text-white text-xl">✕</span>
            </button>
            
            {/* RECIPE TITLE OVERLAY */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                {recipe.name}
              </h2>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-6">
            {/* LANGUAGE TOGGLE - GLASSMORPHISM */}
            <div className="flex gap-3 mb-6">
              {["en", "ta"].map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 ${
                    language === l 
                      ? "glass-button-active" 
                      : "glass-button"
                  }`}
                >
                  <span className={`font-medium ${
                    language === l ? "text-white" : "text-gray-300"
                  }`}>
                    {l === "en" ? "English" : "தமிழ்"}
                  </span>
                </button>
              ))}
            </div>

            {/* STEPS SECTION */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Steps</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      i === currentStep 
                        ? "glass-effect-active" 
                        : "glass-effect-light"
                    }`}
                  >
                    <p className={`text-sm ${
                      i === currentStep ? "text-white font-medium" : "text-gray-300"
                    }`}>
                      {i + 1}. {s}
                    </p>
                    {i === currentStep && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 2, 1].map((height, idx) => (
                          <div
                            key={idx}
                            className="w-1 bg-cyan-400 rounded-full animate-pulse"
                            style={{ height: `${height * 4}px` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTROLS SECTION */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex gap-3">
              <button
                onClick={start}
                className="flex-1 glass-button-success py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <span className="text-xl">▶</span>
                <span className="font-medium text-white">Play All</span>
              </button>
              
              <button
                onClick={stop}
                className="flex-1 glass-button-danger py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <span className="text-xl">⏹</span>
                <span className="font-medium text-white">Stop</span>
              </button>
            </div>
            
            {/* STATUS INDICATOR */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">
                {language === 'en' ? 'Voice assistant ready' : 'குரல் உதவி தயார்'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}