const MAP = {
  tomato: "தக்காளி",
  onion: "வெங்காயம்",
  potato: "உருளைக்கிழங்கு",
  egg: "முட்டை",
  chicken: "கோழி",
  oil: "எண்ணெய்",
  salt: "உப்பு",
  rice: "அரிசி",
  water: "தண்ணீர்",
  curry: "கறி",
  fry: "வறுக்கவும்",
  boil: "காய்ச்சவும்"
};

export function englishToTamilPhonetic(text) {
  let out = text.toLowerCase();
  Object.keys(MAP).forEach(k => {
    out = out.replaceAll(k, MAP[k]);
  });
  return out;
}
