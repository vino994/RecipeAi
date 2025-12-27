import axios from "axios";

const API = axios.create({
  baseURL: "https://recipeaibackend-ula0.onrender.com",
});

export const searchRecipes = (payload) =>
  API.post("/api/recipes", payload);

export const translateText = (text, lang) =>
  API.post("/api/translate", { text, lang });
