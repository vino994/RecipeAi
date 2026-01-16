import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const searchPlaces = async (query, lang = "en") => {
  try {
    const response = await axios.get(`${API_URL}/tour/places/voice-search`, {
      params: { query, lang }
    });
    return response.data;
  } catch (error) {
    console.error("Search places error:", error);
    throw error;
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`${API_URL}/tour/place/details`, {
      params: { id: placeId }
    });
    return response.data;
  } catch (error) {
    console.error("Get place details error:", error);
    throw error;
  }
};

export const getNearbyPlaces = async (lat, lng, radius = 10000) => {
  try {
    const response = await axios.get(`${API_URL}/tour/places/nearby`, {
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    console.error("Get nearby places error:", error);
    throw error;
  }
};

export const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`${API_URL}/tour/weather`, {
      params: { lat, lng }
    });
    return response.data;
  } catch (error) {
    console.error("Get weather error:", error);
    throw error;
  }
};

export const generateItinerary = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/tour/itinerary`, data);
    return response.data;
  } catch (error) {
    console.error("Generate itinerary error:", error);
    throw error;
  }
};

export const getVoiceGuide = async (place, lang = "en") => {
  try {
    const response = await axios.post(`${API_URL}/tour/voice-guide`, {
      place,
      lang
    });
    return response.data;
  } catch (error) {
    console.error("Get voice guide error:", error);
    throw error;
  }
};

export const translateText = async (text, lang) => {
  try {
    const response = await axios.post(`${API_URL}/tour/translate/place`, {
      text,
      lang
    });
    return response.data;
  } catch (error) {
    console.error("Translate text error:", error);
    throw error;
  }
};