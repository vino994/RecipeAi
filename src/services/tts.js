import axios from "axios";

export async function playTTS(text, lang) {
  const res = await axios.post(
    "http://localhost:5000/api/tts",
    { text, lang },
    { responseType: "blob" }
  );

  const audioUrl = URL.createObjectURL(res.data);
  const audio = new Audio(audioUrl);
  audio.play();

  return audio;
}
