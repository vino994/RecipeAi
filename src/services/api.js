import axios from "axios";

const API = axios.create({
  baseURL: "https://recipeaibackend-ula0.onrender.com",
  timeout: 30000
});

export const getRecipe = (text, lang) =>
  API.post("/api/recipe", { text, lang });
