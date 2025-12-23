import axios from "axios";

const api = axios.create({
  baseURL: "https://recipeaibackend-ula0.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/* 🍳 Get Recipe */
export const getRecipe = (text) =>
  api.post("/recipe", { text });

/* 🌍 Translate FULL Recipe */
export const translateRecipe = (text, lang) =>
  api.post("/recipe/translate", {
    text,
    lang
  });

export default api;
