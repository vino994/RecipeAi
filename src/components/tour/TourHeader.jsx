// src/components/tour/TourHeader.jsx
export default function TourHeader({ language, onLanguageChange }) {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-4 md:mb-6">
        🌍 Global Tour Planner
      </h1>

      {/* LANGUAGE SELECTOR */}
      <div className="flex justify-center gap-2 md:gap-3 mb-4">
        <button
          onClick={() => onLanguageChange("en")}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white transition text-sm md:text-base ${language === "en" ? "bg-green-500" : "bg-white/20 hover:bg-white/30"}`}
        >
          English
        </button>
        <button
          onClick={() => onLanguageChange("ta")}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white transition text-sm md:text-base ${language === "ta" ? "bg-green-500" : "bg-white/20 hover:bg-white/30"}`}
        >
          தமிழ்
        </button>
      </div>
    </>
  );
}