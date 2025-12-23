export default function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="flex gap-2 mt-2">
      <button
        className={`px-3 py-1 rounded ${
          language === "ta" ? "bg-[#E37434] text-white" : "bg-white"
        }`}
        onClick={() => setLanguage("ta")}
      >
        தமிழ்
      </button>
      <button
        className={`px-3 py-1 rounded ${
          language === "en" ? "bg-[#E37434] text-white" : "bg-white"
        }`}
        onClick={() => setLanguage("en")}
      >
        English
      </button>
    </div>
  );
}
