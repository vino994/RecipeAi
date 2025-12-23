export function cleanText(text, lang) {
  if (lang === "ta") {
    return text.replace(/[A-Za-z]/g, "");
  }
  return text;
}
