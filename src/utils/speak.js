let utterance = null;

const LANG_MAP = {
  ta: "ta-IN",
  en: "en-US"
};

/* ---------- NUMBER FIX ---------- */
function tamilizeNumbers(text) {
  const map = {
    0: "பூஜ்யம்",
    1: "ஒன்று",
    2: "இரண்டு",
    3: "மூன்று",
    4: "நான்கு",
    5: "ஐந்து",
    6: "ஆறு",
    7: "ஏழு",
    8: "எட்டு",
    9: "ஒன்பது"
  };

  return text.replace(/\d/g, d => map[d] || d);
}

/* ---------- CLEAN ---------- */
function cleanText(text, lang) {
  let t = text.replace(/\s+/g, " ").trim();
  if (lang === "ta") {
    t = tamilizeNumbers(t);
  }
  return t;
}

/* ---------- SPEAK ---------- */
export function speakText(text, lang, voice) {
  stopVoice();

  utterance = new SpeechSynthesisUtterance(cleanText(text, lang));
  utterance.lang = LANG_MAP[lang] || "en-US";
  utterance.rate = lang === "ta" ? 0.85 : 1;
  utterance.pitch = 1;

  // ✅ USE TAMIL VOICE IF AVAILABLE
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}

/* ---------- CONTROLS ---------- */
export function pauseVoice() {
  window.speechSynthesis.pause();
}

export function resumeVoice() {
  window.speechSynthesis.resume();
}

export function stopVoice() {
  window.speechSynthesis.cancel();
}

/* ---------- 🔥 FIXED VOICE DETECTION ---------- */
export function getVoices(lang) {
  const voices = window.speechSynthesis.getVoices();
  const code = LANG_MAP[lang]; // ta-IN

  // 🔥 VERY IMPORTANT: use startsWith
  const matched = voices.filter(v =>
    v.lang.toLowerCase().startsWith(code.toLowerCase())
  );

  // fallback: allow browser default
  return matched.length ? matched : voices;
}
