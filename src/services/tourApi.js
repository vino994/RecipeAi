const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ---------- SEARCH CITY ---------- */
export async function searchPlaces(query) {
  const res = await fetch(
    `${API_BASE}/api/tour/places/search?query=${encodeURIComponent(query)}`
  );
  return res.json();
}

/* ---------- NEARBY PLACES ---------- */
export async function getNearbyPlaces(lat, lng, radius = 50000) {
  const res = await fetch(
    `${API_BASE}/api/tour/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );
  return res.json();
}

/* ---------- WEATHER ---------- */
export async function getWeather(lat, lng) {
  const res = await fetch(
    `${API_BASE}/api/tour/weather?lat=${lat}&lng=${lng}`
  );
  return res.json();
}

/* ---------- AI ITINERARY ---------- */
export async function generateItinerary(payload) {
  const res = await fetch(`${API_BASE}/api/tour/itinerary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

/* ---------- DIRECTIONS ---------- */
export async function getDirections(from, to) {
  const res = await fetch(
    `${API_BASE}/api/tour/directions?fromLat=${from.lat}&fromLng=${from.lng}&toLat=${to.lat}&toLng=${to.lng}`
  );
  return res.json();
}
