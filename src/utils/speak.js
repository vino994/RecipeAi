let utterance = null;
let stepIndex = 0;
let steps = [];

const LANG_MAP = {
  ta: "ta-IN",
  ml: "ml-IN",
  hi: "hi-IN",
  en: "en-US"
};

/* ---------------- CLEAN TEXT ---------------- */

function prepareText(text, lang) {
  if (lang === "ta" || lang === "ml" || lang === "hi") {
  return text.replace(/\s+/g, " ").trim();
  }
  return text;
}

/* ---------------- SPEAK FULL ---------------- */

export function speakText(text, lang, voice) {
  stopVoice();

  const utterance = new SpeechSynthesisUtterance(text);

  const langMap = {
    ta: "ta-IN",
    hi: "hi-IN",
    ml: "ml-IN",
    en: "en-US"
  };

  utterance.lang = langMap[lang] || "en-US";
  utterance.rate = lang === "en" ? 1 : 0.85;
  utterance.pitch = 1;

  // ✅ ONLY assign voice if available
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}


/* ---------------- STEP VOICE ---------------- */

export function speakSteps(text, lang, voice) {
  stopVoice();

  steps = text
    .split(/\n|\d+\./)
    .map(s => s.trim())
    .filter(Boolean);

  stepIndex = 0;
  speakNextStep(lang, voice);
}

function speakNextStep(lang, voice) {
  if (stepIndex >= steps.length) return;

  const prefixes = {
    ta: "படி",
    ml: "ഘട്ടം",
    hi: "चरण",
    en: "Step"
  };

  const line = `${prefixes[lang] || "Step"} ${stepIndex + 1}. ${
    prepareText(steps[stepIndex], lang)
  }`;

  utterance = new SpeechSynthesisUtterance(line);
  utterance.lang = LANG_MAP[lang] || "en-US";
  utterance.rate = lang === "en" ? 1 : 0.85;

  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    stepIndex++;
    speakNextStep(lang, voice);
  };

  window.speechSynthesis.speak(utterance);
}

/* ---------------- CONTROLS ---------------- */

export function pauseVoice() {
  window.speechSynthesis.pause();
}

export function resumeVoice() {
  window.speechSynthesis.resume();
}

export function stopVoice() {
  window.speechSynthesis.cancel();
}

/* ---------------- VOICES ---------------- */

export function getVoices(lang) {
  const voices = window.speechSynthesis.getVoices();

  const langMap = {
    ta: ["ta-IN"],
    hi: ["hi-IN"],
    ml: ["ml-IN"],
    en: ["en-US", "en-GB"]
  };

  // 1️⃣ Try exact language voices
  const exact = voices.filter(v =>
    langMap[lang]?.some(code => v.lang.startsWith(code))
  );

  if (exact.length > 0) return exact;

  // 2️⃣ Fallback to ANY Indian English voice
  const indianEnglish = voices.filter(v =>
    v.lang.startsWith("en-IN")
  );

  if (indianEnglish.length > 0) return indianEnglish;

  // 3️⃣ Final fallback: ANY English voice
  return voices.filter(v => v.lang.startsWith("en"));
}

