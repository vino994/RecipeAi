import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Search, Mic, MapPin, Globe, Navigation, 
  Calendar, Volume2, VolumeX, Play, Pause, Download
} from "lucide-react";
import axios from "axios";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Use the CORRECT backend URL - Use the existing route that works
const API_URL = "http://localhost:5000/api";

// Mock itinerary data
const mockItinerary = {
  location: "Chennai",
  duration: "3 days",
  budget: "medium",
  totalEstimatedCost: "₹15,000 - ₹25,000",
  dailyPlans: [
    {
      day: 1,
      title: "Arrival & City Introduction",
      activities: [
        {
          time: "9:00 AM",
          activity: "Check-in & Breakfast",
          description: "Arrive at hotel and have traditional breakfast",
          type: "food",
          duration: "2 hours"
        },
        {
          time: "11:00 AM",
          activity: "Marina Beach Walk",
          description: "Explore the longest beach in India",
          type: "sightseeing",
          duration: "3 hours"
        },
        {
          time: "2:00 PM",
          activity: "Kapaleeshwarar Temple Visit",
          description: "Visit ancient temple in Mylapore",
          type: "culture",
          duration: "2 hours"
        },
        {
          time: "7:00 PM",
          activity: "Local Food Experience",
          description: "Try authentic Tamil cuisine at local restaurant",
          type: "food",
          duration: "2 hours"
        }
      ]
    },
    {
      day: 2,
      title: "Cultural Exploration",
      activities: [
        {
          time: "9:00 AM",
          activity: "Fort St. George",
          description: "Visit the first English fortress in India",
          type: "historic",
          duration: "3 hours"
        },
        {
          time: "1:00 PM",
          activity: "Lunch at Saravana Bhavan",
          description: "Famous South Indian vegetarian restaurant",
          type: "food",
          duration: "1.5 hours"
        },
        {
          time: "3:00 PM",
          activity: "Guindy National Park",
          description: "Explore wildlife in the heart of the city",
          type: "nature",
          duration: "2 hours"
        }
      ]
    }
  ]
};

export default function TourAI() {
  const [language, setLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [tripDuration, setTripDuration] = useState("3");
  const [tripBudget, setTripBudget] = useState("medium");
  const [activeView, setActiveView] = useState("search");
  const [voiceGuide, setVoiceGuide] = useState("");
  const [backendError, setBackendError] = useState(false);

  const speechSynthesis = window.speechSynthesis;
  const recognitionRef = useRef(null);

  const translations = {
    en: {
      title: "🌍 Global Travel AI Guide",
      subtitle: "Plan your perfect trip with AI assistance",
      searchPlaceholder: "Search for a city, landmark, or address...",
      speak: "Speak",
      search: "Search",
      loading: "Loading...",
      generating: "Generating AI itinerary...",
      nearbyPlaces: "Nearby Tourist Places",
      generateItinerary: "Generate Trip Plan",
      duration: "Duration (days)",
      budget: "Budget",
      budgetOptions: {
        budget: "Budget (₹8k-₹15k)",
        medium: "Medium (₹15k-₹25k)",
        luxury: "Luxury (₹40k-₹60k)"
      },
      viewMap: "View on Map",
      getDirections: "Get Directions",
      weather: "Weather",
      voiceGuide: "Voice Guide",
      listenGuide: "Listen Guide",
      stopGuide: "Stop",
      day: "Day",
      activities: "Activities",
      estimatedCost: "Estimated Cost",
      downloadPlan: "Download Plan",
      voiceSearchPrompt: "Say a place name...",
      noResults: "No places found. Try another search.",
      currentLocation: "Current Location",
      backendError: "Backend connection failed. Using demo mode."
    },
    ta: {
      title: "🌍 உலக சுற்றுலா AI வழிகாட்டி",
      subtitle: "AI உதவியுடன் உங்கள் பயணத்தை திட்டமிடுங்கள்",
      searchPlaceholder: "நகரம், முக்கிய இடம் அல்லது முகவரியை தேடுங்கள்...",
      speak: "பேசுங்கள்",
      search: "தேடு",
      loading: "ஏற்றுகிறது...",
      generating: "AI பயண திட்டம் உருவாக்கப்படுகிறது...",
      nearbyPlaces: "அருகிலுள்ள சுற்றுலா இடங்கள்",
      generateItinerary: "பயண திட்டத்தை உருவாக்கு",
      duration: "காலம் (நாட்கள்)",
      budget: "பட்ஜெட்",
      budgetOptions: {
        budget: "சிக்கனம் (₹8k-₹15k)",
        medium: "நடுத்தர (₹15k-₹25k)",
        luxury: "விலையுயர்ந்த (₹40k-₹60k)"
      },
      viewMap: "வரைபடத்தில் காண்க",
      getDirections: "வழிகாட்டுதல்களைப் பெறுங்கள்",
      weather: "வானிலை",
      voiceGuide: "குரல் வழிகாட்டி",
      listenGuide: "வழிகாட்டியை கேளுங்கள்",
      stopGuide: "நிறுத்து",
      day: "நாள்",
      activities: "நடவடிக்கைகள்",
      estimatedCost: "மதிப்பிடப்பட்ட செலவு",
      downloadPlan: "திட்டத்தை பதிவிறக்கு",
      voiceSearchPrompt: "ஒரு இடத்தின் பெயரைச் சொல்லுங்கள்...",
      noResults: "எந்த இடங்களும் கிடைக்கவில்லை. வேறு தேடல் முயற்சிக்கவும்.",
      currentLocation: "தற்போதைய இடம்",
      backendError: "பேக்எண்ட் இணைப்பு தோல்வி. டெமோ பயன்முறை பயன்படுத்தப்படுகிறது."
    }
  };

  const t = translations[language];

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === "ta" ? "ta-IN" : "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation({ lat: 13.0827, lng: 80.2707 });
        }
      );
    } else {
      setCurrentLocation({ lat: 13.0827, lng: 80.2707 });
    }
  }, []);

  // Speech functions
  const speak = (text) => {
    if (!text) return;
    
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsPlayingVoice(true);
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    speechSynthesis.speak(utterance);
  };

  const stopVoice = () => {
    speechSynthesis.cancel();
    setIsPlayingVoice(false);
  };

  // Voice search
  const startVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(language === "ta" ? "மொழி உணர்தல் ஆதரிக்கப்படவில்லை" : "Speech recognition not supported");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Voice search start error:", error);
        alert(language === "ta" ? "மைக்ரோஃபோன் அணுகலை அனுமதிக்கவும்" : "Please allow microphone access");
      }
    }
  };

  // Search places - FIXED: Using the correct endpoint
  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    setBackendError(false);
    
    try {
      // TRY THE CORRECT ENDPOINT: /tour/places/search (NOT /voice-search)
      const response = await axios.get(`${API_URL}/tour/places/search`, {
        params: { query: query.replace(/\.$/, '') } // Remove trailing period if any
      });

      console.log("Backend response:", response.data);

      if (response.data.success && response.data.results && response.data.results.length > 0) {
        setPlaces(response.data.results);
        handleSelectPlace(response.data.results[0]);
      } else {
        // Fallback to mock data if no results
        useMockSearch(query);
      }
    } catch (error) {
      console.log("Backend failed, using mock data:", error.message);
      setBackendError(true);
      useMockSearch(query);
    } finally {
      setLoading(false);
    }
  };

  // Mock search function
  const useMockSearch = (query) => {
    const mockPlaces = [
      {
        id: "1",
        name: query.charAt(0).toUpperCase() + query.slice(1).toLowerCase(),
        country: "India",
        lat: 13.0827 + (Math.random() * 0.1 - 0.05),
        lng: 80.2707 + (Math.random() * 0.1 - 0.05),
        type: "city",
        address: `${query}, India`
      },
      {
        id: "2",
        name: `${query} Beach`,
        country: "India",
        lat: 13.0515 + (Math.random() * 0.05 - 0.025),
        lng: 80.2823 + (Math.random() * 0.05 - 0.025),
        type: "tourist",
        address: `${query} Beach, India`
      },
      {
        id: "3",
        name: `${query} Temple`,
        country: "India",
        lat: 13.0330 + (Math.random() * 0.05 - 0.025),
        lng: 80.2704 + (Math.random() * 0.05 - 0.025),
        type: "temple",
        address: `${query} Temple, India`
      }
    ];
    
    setPlaces(mockPlaces);
    if (mockPlaces.length > 0) {
      handleSelectPlace(mockPlaces[0]);
    }
  };

  // Select a place
  const handleSelectPlace = async (place) => {
    setSelectedPlace(place);
    setActiveView("map");
    
    // Generate mock weather
    setWeather({
      temperature: Math.floor(Math.random() * 15) + 20,
      condition: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
      description: "pleasant weather",
      humidity: Math.floor(Math.random() * 50) + 30,
      windSpeed: (Math.random() * 10 + 5).toFixed(1),
      icon: "01d"
    });

    // Generate voice guide
    const guide = language === "ta" 
      ? `${place.name} ஒரு சிறந்த சுற்றுலா இடம். இது ${place.country} நாட்டில் உள்ளது. மிகவும் அழகான காட்சிகள் உள்ளன. இங்கு வரும் பயணிகளுக்கு மிகவும் ஏற்ற இடம்.`
      : `${place.name} is a great tourist destination. It is located in ${place.country}. There are many beautiful sights to see. Perfect place for travelers.`;
    setVoiceGuide(guide);

    // Generate mock nearby places
    const nearby = Array.from({ length: 5 }, (_, i) => ({
      id: `nearby-${i}`,
      name: [`${place.name} Temple`, `${place.name} Park`, `${place.name} Museum`, `${place.name} Market`, `${place.name} Beach`][i],
      category: ["temple", "park", "museum", "shopping", "beach"][i],
      lat: place.lat + (Math.random() * 0.02 - 0.01),
      lng: place.lng + (Math.random() * 0.02 - 0.01),
      rating: (Math.random() * 1 + 4).toFixed(1),
      description: language === "ta" 
        ? "ஒரு பிரபலமான சுற்றுலா இடம்" 
        : "A popular tourist attraction"
    }));
    setPlaces(nearby);
  };

  // Generate AI itinerary
  const generateItinerary = () => {
    if (!selectedPlace) {
      alert(language === "ta" ? "முதலில் ஒரு இடத்தைத் தேர்ந்தெடுக்கவும்" : "Please select a place first");
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Create custom itinerary with selected place name
      const customItinerary = {
        ...mockItinerary,
        location: selectedPlace.name,
        totalEstimatedCost: tripBudget === "luxury" ? "₹40,000 - ₹60,000" : 
                           tripBudget === "budget" ? "₹8,000 - ₹15,000" : 
                           "₹15,000 - ₹25,000"
      };
      
      // Add more days based on duration
      if (parseInt(tripDuration) > 2) {
        for (let i = 3; i <= parseInt(tripDuration); i++) {
          customItinerary.dailyPlans.push({
            day: i,
            title: language === "ta" ? `நாள் ${i}: சுற்றுலா தொடர்கிறது` : `Day ${i}: Continued Exploration`,
            activities: [
              {
                time: "9:00 AM",
                activity: language === "ta" ? "காலை உணவு" : "Breakfast",
                description: language === "ta" ? "உள்ளூர் உணவு" : "Local cuisine",
                type: "food",
                duration: "1 hour"
              },
              {
                time: "10:00 AM",
                activity: language === "ta" ? "உள்ளூர் அரங்குகள்" : "Local Attractions",
                description: language === "ta" ? "புதிய இடங்களை ஆராயுங்கள்" : "Explore new places",
                type: "sightseeing",
                duration: "4 hours"
              }
            ]
          });
        }
      }
      
      setItinerary(customItinerary);
      setActiveView("itinerary");
      setLoading(false);
      
      speak(
        language === "ta" 
          ? `${selectedPlace.name}க்கான ${tripDuration} நாள் பயண திட்டம் தயாராக உள்ளது` 
          : `${tripDuration} day travel plan for ${selectedPlace.name} is ready`
      );
    }, 1500);
  };

  // Get directions
  const getDirections = () => {
    if (!selectedPlace || !currentLocation) return;

    const path = [
      [currentLocation.lat, currentLocation.lng],
      [selectedPlace.lat, selectedPlace.lng]
    ];
    setRoute(path);
    
    speak(
      language === "ta" 
        ? `${selectedPlace.name}க்கான வழிகாட்டுதல் காட்டப்படுகிறது` 
        : `Directions to ${selectedPlace.name} are shown`
    );
  };

  // Download itinerary
  const downloadItinerary = () => {
    if (!itinerary) return;

    const content = JSON.stringify(itinerary, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPlace?.name || 'tour'}_itinerary.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    speak(
      language === "ta" 
        ? "பயண திட்டம் பதிவிறக்கம் செய்யப்பட்டது" 
        : "Itinerary downloaded successfully"
    );
  };

  // Popular destinations
  const popularDestinations = [
    { name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
    { name: "Delhi", country: "India", lat: 28.7041, lng: 77.1025 },
    { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
    { name: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
    { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t.title}
              </h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                <Globe size={20} />
              </span>
              <button
                onClick={() => setLanguage("ta")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  language === "ta"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  language === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Backend Error Alert */}
        {backendError && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="text-yellow-800">{t.backendError}</span>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <button
              onClick={startVoiceSearch}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isListening
                  ? "bg-red-500 animate-pulse text-white"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              }`}
            >
              <Mic size={20} />
              {t.speak}
            </button>

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={20} />
                  {t.search}
                </>
              )}
            </button>
          </div>

          {isListening && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                <div className="flex gap-1">
                  {[1, 2, 3, 2, 1].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500 rounded-full animate-pulse"
                      style={{ height: `${height * 8}px` }}
                    />
                  ))}
                </div>
                <span className="font-medium">{t.voiceSearchPrompt}</span>
              </div>
            </div>
          )}

          {/* Popular Destinations */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {language === "ta" ? "பிரபலமான இடங்கள்" : "Popular Destinations"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => {
                    setSearchQuery(dest.name);
                    handleSelectPlace(dest);
                  }}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-3 text-center transition"
                >
                  <MapPin className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <span className="font-medium text-gray-800 block">{dest.name}</span>
                  <span className="text-xs text-gray-500">{dest.country}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search Results & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Place Info */}
            {selectedPlace && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedPlace.name}</h3>
                    <p className="text-gray-600">{selectedPlace.country}</p>
                    <p className="text-sm text-gray-500">{selectedPlace.address}</p>
                  </div>
                  <button
                    onClick={() => speak(voiceGuide)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>

                {weather && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-700">{t.weather}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-3xl font-bold text-gray-800">{weather.temperature}°C</span>
                          <span className="text-gray-600 capitalize">{weather.condition}</span>
                        </div>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span>💧 {weather.humidity}%</span>
                          <span>🌬️ {weather.windSpeed} km/h</span>
                        </div>
                      </div>
                      <img
                        src={`https://openweathermap.org/img/wn/01d@2x.png`}
                        alt="Weather icon"
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={tripDuration}
                      onChange={(e) => setTripDuration(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                    >
                      {[1, 2, 3, 5, 7, 10].map((days) => (
                        <option key={days} value={days}>
                          {days} {language === "ta" ? "நாட்கள்" : "days"}
                        </option>
                      ))}
                    </select>

                    <select
                      value={tripBudget}
                      onChange={(e) => setTripBudget(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                    >
                      <option value="budget">{t.budgetOptions.budget}</option>
                      <option value="medium">{t.budgetOptions.medium}</option>
                      <option value="luxury">{t.budgetOptions.luxury}</option>
                    </select>
                  </div>

                  <button
                    onClick={generateItinerary}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t.generating}
                      </>
                    ) : (
                      <>
                        <Calendar size={20} />
                        {t.generateItinerary}
                      </>
                    )}
                  </button>

                  {currentLocation && (
                    <button
                      onClick={getDirections}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition flex items-center justify-center gap-2"
                    >
                      <Navigation size={20} />
                      {t.getDirections}
                    </button>
                  )}

                  {voiceGuide && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">{t.voiceGuide}</h4>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                        {voiceGuide}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => speak(voiceGuide)}
                          className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                        >
                          <Play size={16} />
                          {t.listenGuide}
                        </button>
                        <button
                          onClick={stopVoice}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <Pause size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Places List */}
            {places.length > 0 && activeView !== "itinerary" && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.nearbyPlaces}</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => handleSelectPlace(place)}
                      className={`w-full text-left p-4 rounded-xl border transition ${
                        selectedPlace?.id === place.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{place.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 capitalize">
                            {place.category || "Tourist Attraction"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{place.description}</p>
                          {place.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm text-gray-600">{place.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Map or Itinerary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveView("map")}
                  className={`flex-1 py-4 font-medium ${
                    activeView === "map"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {language === "ta" ? "வரைபடம்" : "Map"}
                </button>
                <button
                  onClick={() => setActiveView("itinerary")}
                  className={`flex-1 py-4 font-medium ${
                    activeView === "itinerary"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {language === "ta" ? "பயண திட்டம்" : "Itinerary"}
                </button>
              </div>

              {/* Content */}
              <div className="h-[600px]">
                {activeView === "map" && selectedPlace ? (
                  <MapContainer
                    center={[selectedPlace.lat, selectedPlace.lng]}
                    zoom={13}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Current Location */}
                    {currentLocation && (
                      <Marker position={[currentLocation.lat, currentLocation.lng]}>
                        <Popup>
                          <div className="font-semibold">{t.currentLocation}</div>
                          <div className="text-sm text-gray-600">
                            {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Selected Place */}
                    <Marker position={[selectedPlace.lat, selectedPlace.lng]}>
                      <Popup>
                        <div className="font-semibold">{selectedPlace.name}</div>
                        <div className="text-sm text-gray-600">{selectedPlace.country}</div>
                        <div className="text-xs text-gray-500">{selectedPlace.address}</div>
                      </Popup>
                    </Marker>

                    {/* Route */}
                    {route && (
                      <Polyline
                        positions={route}
                        color="#3B82F6"
                        weight={3}
                        opacity={0.7}
                      />
                    )}

                    {/* Nearby Places */}
                    {places.map((place) => (
                      <Marker
                        key={place.id}
                        position={[place.lat, place.lng]}
                      >
                        <Popup>
                          <div className="font-semibold">{place.name}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {place.category || "Tourist Attraction"}
                          </div>
                          <div className="text-xs text-gray-500">{place.description}</div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : activeView === "itinerary" && itinerary ? (
                  <div className="h-full overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{itinerary.location}</h3>
                        <p className="text-gray-600">
                          {itinerary.duration} • {itinerary.budget} budget
                        </p>
                      </div>
                      <button
                        onClick={downloadItinerary}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                      >
                        <Download size={20} />
                        {t.downloadPlan}
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-gray-700 mb-2">{t.estimatedCost}</h4>
                      <p className="text-2xl font-bold text-gray-800">{itinerary.totalEstimatedCost}</p>
                    </div>

                    <div className="space-y-6">
                      {itinerary.dailyPlans.map((day) => (
                        <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                            <h4 className="text-xl font-bold text-white">
                              {t.day} {day.day}: {day.title}
                            </h4>
                          </div>
                          <div className="p-4">
                            <div className="space-y-4">
                              {day.activities.map((activity, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                                >
                                  <div className="bg-white p-2 rounded-lg">
                                    <span className="font-semibold text-blue-600">{activity.time}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-800">{activity.activity}</h5>
                                    <p className="text-gray-600 mt-1">{activity.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="text-sm text-gray-500">
                                        ⏱️ {activity.duration}
                                      </span>
                                      <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        {activity.type}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    {loading ? (
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p>{t.loading}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg">
                          {language === "ta" 
                            ? "தொடங்க ஒரு இடத்தைத் தேடுங்கள்" 
                            : "Search for a place to get started"}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          {language === "ta" 
                            ? "பேசு அல்லது தட்டச்சு செய்யவும்" 
                            : "Speak or type to begin"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Voice Controls */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => speak(language === "ta" ? "உதவி கிடைக்கிறது" : "Help is available")}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition"
          >
            <Volume2 size={24} />
          </button>
          {isPlayingVoice && (
            <button
              onClick={stopVoice}
              className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition"
            >
              <VolumeX size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">{t.loading}</p>
          </div>
        </div>
      )}
    </div>
  );
}