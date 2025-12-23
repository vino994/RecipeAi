const KEY = "recipe_history";

export function saveRecipe(recipe) {
  const old = JSON.parse(localStorage.getItem(KEY)) || [];
  const updated = [recipe, ...old].slice(0, 10); // keep last 10
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function loadRecipes() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}
