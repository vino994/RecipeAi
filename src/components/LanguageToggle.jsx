export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div>
      <button onClick={() => setLanguage("ta")}>Tamil</button>
      <button onClick={() => setLanguage("en")}>English</button>
    </div>
  );
}
