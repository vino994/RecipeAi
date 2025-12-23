export default function RecipeOutput({ recipe, language }) {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(recipe);
    utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <pre>{recipe}</pre>
      {recipe && <button onClick={speak}>🔊 Listen</button>}
    </div>
  );
}
