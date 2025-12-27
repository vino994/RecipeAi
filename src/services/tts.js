import axios from "axios";

let currentAudio = null;

/**
 * Play Text-to-Speech audio
 * @param {string} text - text to speak
 * @param {string} lang - "en" | "ta"
 * @param {Function} onEnd - callback after audio ends
 */
export async function playTTS(text, lang = "en", onEnd) {
  if (!text || typeof text !== "string") return;

  try {
    // 🔴 Stop any previous audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio = null;
    }

    // ✅ USE RENDER BACKEND (NOT localhost)
    const res = await axios.post(
      "https://recipeaibackend-ula0.onrender.com/api/tts",
      { text, lang },
      { responseType: "blob" }
    );

    const audioUrl = URL.createObjectURL(res.data);
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl); // 🧹 cleanup
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      console.error("Audio playback error");
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };

    await audio.play();
  } catch (err) {
    console.error("TTS play failed:", err.message);
  }
}

/**
 * Stop current TTS playback
 */
export function stopTTS() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
}
