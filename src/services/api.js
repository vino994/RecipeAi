import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 30000
});

export const getRecipe = (text, lang) =>
  API.post("/api/recipe", { text, lang });
