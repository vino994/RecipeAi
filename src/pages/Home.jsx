import { useState, useRef, useEffect } from "react";
import { searchRecipes } from "../services/api";
import { LANG } from "../utils/languageMap";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";

const btn =
  "px-5 py-2 rounded-lg text-sm font-semibold shadow transition";
const btnPrimary = `${btn} bg-black text-white`;
const btnSecondary = `${btn} bg-gray-200 text-gray-800`;

function Loader() {
  return (
    <div className="flex justify-center py-6">
      <div className="h-8 w-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState("ta");
  const [text, setText] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const recognitionRef = useRef(null);

  /* ---------- LOAD RECIPES ---------- */
  const loadRecipes = async (searchText = "", reset = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await searchRecipes({
        text: searchText,
        page: reset ? 1 : page,
        limit: 12,
      });

      const newRecipes = res.data.recipes || [];

      setRecipes(prev =>
        reset ? newRecipes : [...prev, ...newRecipes]
      );

      setHasMore(res.data.hasMore);
      setPage(p => p + 1);

    } catch (err) {
      console.error("Recipe load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    loadRecipes();
  }, []);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        loadRecipes(text);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loading, text]);

  /* ---------- SPEECH INPUT ---------- */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice input not supported");

    const recog = new SR();
    recognitionRef.current = recog;
    recog.lang = LANG[language].speech;

    recog.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setText(spoken);
      setPage(1);
      loadRecipes(spoken, true);
    };

    recog.start();
  };

  /* ---------- SEARCH ---------- */
  const onSearch = () => {
    setPage(1);
    loadRecipes(text, true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">

      {/* HEADER */}
      <div className="max-w-screen-xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          🍲 Recipe AI
        </h1>

        {/* SEARCH BAR */}
        <div className="flex gap-3 items-center">
          <textarea
            className="flex-1 border rounded-lg px-4 py-2 text-sm resize-none"
            rows={1}
            placeholder="Say ingredient or recipe name..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button onClick={startListening} className={btnPrimary}>
            🎤
          </button>

          <button onClick={onSearch} className={btnSecondary}>
            Search
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={`${recipe.id}-${index}`}
            recipe={recipe}
            onView={() => setSelectedRecipe(recipe)}
          />
        ))}
      </div>

      {loading && <Loader />}

      {!hasMore && (
        <p className="text-center text-gray-500 mt-8">
          No more recipes 🍽️
        </p>
      )}

      {/* MODAL */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          language={language}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

    </div>
  );
}
