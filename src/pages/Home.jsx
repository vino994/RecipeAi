import { useState, useRef, useEffect } from "react";
import { searchRecipes } from "../services/api";
import { LANG } from "../utils/languageMap";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import { Search, Mic, MicOff, Filter, ChefHat } from "lucide-react";

const btn =
  "px-5 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2";
const btnPrimary = `${btn} glass-button-primary hover:scale-105`;
const btnSecondary = `${btn} glass-button-secondary hover:scale-105`;

function Loader() {
  return (
    <div className="flex justify-center py-10">
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-lg rounded-full animate-pulse" />
        {/* Spinner */}
        <div className="relative h-12 w-12 border-4 border-gray-300/30 border-t-cyan-400 border-r-purple-400 rounded-full animate-spin" />
      </div>
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
  const [isListening, setIsListening] = useState(false);

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

    setIsListening(true);
    const recog = new SR();
    recognitionRef.current = recog;
    recog.lang = LANG[language].speech;

    recog.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setText(spoken);
      setPage(1);
      loadRecipes(spoken, true);
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
    };

    recog.onerror = () => {
      setIsListening(false);
    };

    recog.start();
  };

  /* ---------- SEARCH ---------- */
  const onSearch = () => {
    setPage(1);
    loadRecipes(text, true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* PARALLAX BACKGROUND */}
      <div 
        className="fixed inset-0 bg-fixed bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=2070&auto=format&fit=crop')`,
          transform: 'translateZ(0)',
          willChange: 'transform',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* GRADIENT OVERLAYS */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 -z-10" />
      
      {/* ANIMATED BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Floating food icons */}
        {['🍅', '🧄', '🌶️', '🍋', '🧅', '🍄', '🥕', '🥦'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 20}s infinite linear`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-10">
          {/* HERO SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 glass-effect px-6 py-3 rounded-2xl mb-6">
              <ChefHat className="w-6 h-6 text-cyan-400" />
              <span className="text-white/80 font-medium">AI Cooking Assistant</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-2">
                Recipes
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Speak in Tamil or English, get instant recipes with voice-guided cooking steps
            </p>
          </motion.div>

          {/* SEARCH SECTION */}
          <div className="glass-effect rounded-2xl p-6 mb-8 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* LANGUAGE TOGGLE */}
              <div className="flex gap-2">
                {['en', 'ta'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      language === lang
                        ? 'glass-button-active'
                        : 'glass-button'
                    }`}
                  >
                    <span className={`font-medium ${
                      language === lang ? 'text-white' : 'text-gray-300'
                    }`}>
                      {lang === 'en' ? '🇺🇸 English' : '🇮🇳 தமிழ்'}
                    </span>
                  </button>
                ))}
              </div>

              {/* SEARCH INPUT */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <textarea
                    className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 resize-none"
                    rows={1}
                    placeholder={language === 'ta' 
                      ? "மூலப்பொருட்களைச் சொல்லுங்கள் அல்லது தட்டச்சு செய்யுங்கள்..." 
                      : "Say ingredients or type recipe name..."
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button 
                  onClick={startListening} 
                  className={`glass-button-primary ${isListening ? 'animate-pulse' : ''}`}
                  disabled={isListening}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Voice Search</span>
                    </>
                  )}
                </button>

                <button onClick={onSearch} className="glass-button-secondary">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* VOICE STATUS */}
            {isListening && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 2, 1].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full animate-pulse"
                      style={{
                        height: `${height * 8}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-cyan-300 font-medium">
                  {language === 'ta' ? 'கேட்கிறது... பேசுங்கள்' : 'Listening... Speak now'}
                </span>
              </div>
            )}
          </div>

          {/* RECIPE COUNT */}
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">
                {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'} Found
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Scroll for more recipes ↓
            </div>
          </div>
        </div>

        {/* RECIPE GRID */}
        <div className="max-w-6xl mx-auto">
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={`${recipe.id}-${index}`}
                  recipe={recipe}
                  index={index}
                  onView={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          ) : !loading ? (
            <div className="text-center py-20">
              <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6">🍽️</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No Recipes Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  {language === 'ta' 
                    ? 'மூலப்பொருட்களைச் சொல்லி அல்லது தட்டச்சு செய்து சமையல் செய்முறைகளைக் கண்டறியவும்'
                    : 'Say or type ingredients to discover delicious recipes'
                  }
                </p>
                <button 
                  onClick={startListening}
                  className="glass-button-primary"
                >
                  <Mic className="w-5 h-5" />
                  <span>{language === 'ta' ? 'குரல் தேடல் தொடங்கவும்' : 'Start Voice Search'}</span>
                </button>
              </div>
            </div>
          ) : null}

          {loading && <Loader />}

          {!hasMore && recipes.length > 0 && (
            <div className="text-center mt-12 mb-8">
              <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === 'ta' ? 'அனைத்து செய்முறைகளையும் கண்டுபிடித்துவிட்டீர்கள்!' : 'You found all recipes!'}
                </h3>
                <p className="text-gray-400">
                  {language === 'ta'
                    ? 'மேலும் மூலப்பொருட்களைத் தேடி புதிய சமையல் செய்முறைகளைக் கண்டறியவும்'
                    : 'Search for more ingredients to discover new recipes'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          language={language}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* FLOATING ACTION BUTTON */}
      {recipes.length > 0 && !loading && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 glass-button p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <span className="text-xl">↑</span>
        </button>
      )}

      {/* Add these styles to your global CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @media (max-width: 768px) {
          .bg-fixed {
            background-attachment: scroll !important;
          }
        }
      `}</style>
    </div>
  );
}

// If you don't have motion from framer-motion, remove motion.div and use regular div
const motion = { div: ({ children, ...props }) => <div {...props}>{children}</div> };