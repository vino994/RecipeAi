import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getRecipe = (text) =>
  api.post("/recipe", { text });

export const translateRecipe = (text, lang) =>
  api.post("/recipe/translate", { text, lang });
