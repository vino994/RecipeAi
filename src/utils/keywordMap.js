export function toEnglishKeywords(text) {
  return text
    .toLowerCase()
    .replace(/தக்காளி/g, "tomato")
    .replace(/முட்டை/g, "egg")
    .replace(/வெங்காயம்/g, "onion")
    .replace(/உருளைக்கிழங்கு/g, "potato")
    .replace(/കോഴി/g, "chicken")
    .replace(/മുട്ട/g, "egg")
    .replace(/प्याज/g, "onion")
    .replace(/अंडा/g, "egg")
    .replace(/आलू/g, "potato");
}
