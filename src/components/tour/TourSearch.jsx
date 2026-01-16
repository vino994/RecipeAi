// src/components/tour/TourSearch.jsx
import { useState, useEffect } from "react";
import { MapPin, Calendar, Globe, Map, Navigation } from "lucide-react";
import VoiceLocationInput from "./VoiceLocationInput";
import { 
  searchPlaces, 
  getCountryPlaces, 
  getStatePlaces, 
  getNearbyPlaces,
  getCountriesList,
  getStatesList 
} from "../../services/tourApi";

export default function TourSearch({
  location,
  onLocationChange,
  onSelectPlace,
  language,
  onGeneratePlan,
  isLoading,
  isGeneratingPlan,
  tripDuration,
  onTripDurationChange,
  currentLocation,
  setPlaces // Add this prop to update places
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [showStates, setShowStates] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const data = await getCountriesList();
      if (data.success) {
        setCountries(data.countries || []);
      }
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  };

  // Search for locations with API
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const data = await searchPlaces(query);
      if (data.success) {
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setSelectedState("");
    setShowCountries(false);
    
    // Fetch places for selected country
    setSearchLoading(true);
    try {
      const data = await getCountryPlaces(country);
      if (data.success) {
        setPlaces(data.places || []);
        // If we have places, select the first one as location
        if (data.places && data.places.length > 0) {
          const firstPlace = data.places[0];
          onLocationChange(firstPlace.name);
          onSelectPlace(firstPlace);
        }
      }
    } catch (error) {
      console.error("Error fetching country places:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStateSelect = async (state) => {
    setSelectedState(state);
    setShowStates(false);
    
    // Fetch places for selected state
    setSearchLoading(true);
    try {
      const data = await getStatePlaces(state, selectedCountry);
      if (data.success) {
        setPlaces(data.places || []);
        // If we have places, select the first one as location
        if (data.places && data.places.length > 0) {
          const firstPlace = data.places[0];
          onLocationChange(firstPlace.name);
          onSelectPlace(firstPlace);
        }
      }
    } catch (error) {
      console.error("Error fetching state places:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNearbyClick = async () => {
    if (!currentLocation) {
      alert(language === "ta" 
        ? "தற்போதைய இருப்பிடம் கிடைக்கவில்லை" 
        : "Current location not available"
      );
      return;
    }
    
    setSearchLoading(true);
    try {
      const data = await getNearbyPlaces(currentLocation.lat, currentLocation.lng);
      if (data.success) {
        setPlaces(data.places || []);
        // If we have places, select the first one as location
        if (data.places && data.places.length > 0) {
          const firstPlace = data.places[0];
          onLocationChange(firstPlace.name);
          onSelectPlace(firstPlace);
        }
      }
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleVoiceLocation = async (text) => {
    onLocationChange(text);
    // Search for the voice location
    const data = await searchPlaces(text);
    if (data.success && data.results && data.results.length > 0) {
      const place = data.results[0];
      onSelectPlace(place);
      setPlaces([]); // Clear places initially
    }
  };

  const handleSearchResultClick = async (result) => {
    onSelectPlace(result);
    setSearchResults([]);
    onLocationChange(result.name);
    
    // Fetch nearby places for the selected location
    setSearchLoading(true);
    try {
      const nearbyData = await getNearbyPlaces(result.lat, result.lng);
      if (nearbyData.success) {
        setPlaces(nearbyData.places || []);
      }
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Load states for selected country
  const loadStates = async (country) => {
    try {
      const data = await getStatesList(country);
      if (data.success) {
        setStates(data.states || []);
      }
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry);
    }
  }, [selectedCountry]);

  return (
    <div className="bg-white/20 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <div className="relative">
            <input
              value={location}
              onChange={(e) => {
                const value = e.target.value;
                onLocationChange(value);
                handleSearch(value);
              }}
              className="w-full p-3 md:p-4 rounded-xl bg-white/30 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={language === "ta" ? "நகரத்தை உள்ளிடவும்" : "Enter city or destination"}
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto shadow-xl">
              {searchResults.map((result) => (
                <div
                  key={result.id || `${result.name}-${result.lat}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="p-3 text-gray-800 cursor-pointer hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 text-blue-500" />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm opacity-80">{result.country} • {result.type || "location"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <VoiceLocationInput 
          onLocationDetected={handleVoiceLocation}
          language={language}
        />
      </div>

      {/* VOICE COMMAND HINT */}
      <div className="text-center text-white/70 text-xs md:text-sm mb-3 md:mb-4">
        {language === "ta" 
          ? "குரல் கட்டளையைப் பயன்படுத்தவும்: 'சென்னைக்கு செல்' அல்லது 'பயண திட்டம்'" 
          : "Try voice command: 'Go to Chennai' or 'Plan trip'"}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4">
        <div className="flex flex-wrap gap-2 md:gap-3 relative">
          {/* COUNTRY FILTER */}
          <div className="relative">
            <button
              onClick={() => setShowCountries(!showCountries)}
              className="px-3 py-1.5 md:px-4 md:py-2.5 rounded-full bg-indigo-500 text-white hover:scale-105 transition flex items-center gap-1 md:gap-2 text-sm md:text-base"
            >
              <Globe size={14} className="md:w-4 md:h-4" /> 
              <span>{language === "ta" ? "நாடு" : "Country"}</span>
            </button>
            
            {showCountries && countries.length > 0 && (
              <div className="absolute top-full mt-1 md:mt-2 left-0 bg-white rounded-xl shadow-2xl z-50 min-w-[150px] md:min-w-[200px] max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <div
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className="px-3 py-2 md:px-4 md:py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-800 text-sm md:text-base">{country}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STATE FILTER */}
          <div className="relative">
            <button
              onClick={() => selectedCountry && setShowStates(!showStates)}
              disabled={!selectedCountry}
              className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-full text-white hover:scale-105 transition flex items-center gap-1 md:gap-2 text-sm md:text-base ${!selectedCountry ? "opacity-50 cursor-not-allowed" : "bg-teal-500"}`}
            >
              <Map size={14} className="md:w-4 md:h-4" /> 
              <span>{language === "ta" ? "மாநிலம்" : "State"}</span>
            </button>
            
            {showStates && selectedCountry && states.length > 0 && (
              <div className="absolute top-full mt-1 md:mt-2 left-0 bg-white rounded-xl shadow-2xl z-50 min-w-[150px] md:min-w-[200px] max-h-60 overflow-y-auto">
                {states.map((state) => (
                  <div
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className="px-3 py-2 md:px-4 md:py-3 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-800 text-sm md:text-base">{state}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NEARBY FILTER */}
          <button
            onClick={handleNearbyClick}
            className="px-3 py-1.5 md:px-4 md:py-2.5 rounded-full bg-orange-500 text-white hover:scale-105 transition flex items-center gap-1 md:gap-2 text-sm md:text-base"
          >
            <Navigation size={14} className="md:w-4 md:h-4" /> 
            <span>{language === "ta" ? "அருகிலுள்ள" : "Nearby"}</span>
          </button>
          
          {/* Selected filters display */}
          {(selectedCountry || selectedState) && (
            <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
              <span>{selectedCountry}</span>
              {selectedState && <span>• {selectedState}</span>}
            </div>
          )}
        </div>

        {/* TRIP DURATION */}
        <div className="flex items-center gap-2 md:gap-3">
          <label className="text-white text-sm">
            {language === "ta" ? "நாட்கள்:" : "Days:"}
          </label>
          <select
            value={tripDuration}
            onChange={(e) => onTripDurationChange(e.target.value)}
            className="px-2 py-1.5 md:px-3 md:py-2 rounded-lg bg-white/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            {[1, 2, 3, 5, 7].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* GENERATE BUTTON */}
      <button
        onClick={onGeneratePlan}
        disabled={isGeneratingPlan}
        className="w-full px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGeneratingPlan ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm md:text-base">
              {language === "ta" ? "உருவாக்குகிறது..." : "Generating..."}
            </span>
          </>
        ) : (
          <>
            <Calendar size={16} className="md:w-5 md:h-5" />
            <span className="text-sm md:text-base">
              {language === "ta" ? "பயண திட்டம்" : "Generate Plan"}
            </span>
          </>
        )}
      </button>
    </div>
  );
}