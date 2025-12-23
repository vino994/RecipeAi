import { loadRecipes } from "../utils/recipeHistory";
import { speakText } from "../utils/speak";

export default function RecipeHistory({ language, voice }) {
  const recipes = loadRecipes();

  if (!recipes.length) return null;

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-4">
      <h3 className="font-semibold mb-3">📜 Recipe History</h3>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {recipes.map((r, i) => (
          <button
            key={i}
            onClick={() => speakText(r, language, voice)}
            className="block w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            🔁 {r.split("\n")[0].replace("🍽", "").trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
