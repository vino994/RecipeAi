// src/components/tour/TourMapView.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";
import { useEffect, useState } from "react";

// Fix leaflet icons - IMPORTANT: Use imports instead of require()
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

// Custom icons URLs
const carIconUrl = "https://cdn-icons-png.flaticon.com/512/744/744465.png";
const userIconUrl = "https://cdn-icons-png.flaticon.com/512/149/149060.png";
const placeIconUrl = "https://cdn-icons-png.flaticon.com/512/684/684908.png";

export default function TourMapView({ 
  center, 
  places = [], 
  route = [], 
  currentLocation, 
  selectedPlace,
  language,
  isLoading 
}) {
  const [moveIndex, setMoveIndex] = useState(0);
  const [map, setMap] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // Create custom icons
  const carIcon = L.icon({
    iconUrl: carIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const userIcon = L.icon({
    iconUrl: userIconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  const placeIcon = L.icon({
    iconUrl: placeIconUrl,
    iconSize: [25, 25],
    iconAnchor: [12.5, 25],
    popupAnchor: [0, -25]
  });

  // Initialize map
  useEffect(() => {
    if (map && center) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center, map]);

  // Car animation
  useEffect(() => {
    if (!route || route.length === 0) return;

    setMoveIndex(0);
    const interval = setInterval(() => {
      setMoveIndex((i) => {
        if (i >= route.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [route]);

  const handleStartNavigation = () => {
    if (window.speechSynthesis && selectedPlace) {
      const utterance = new SpeechSynthesisUtterance(
        language === "ta" 
          ? `${selectedPlace.name}க்கு வழிகாட்டுதல் தொடங்கியது` 
          : `Starting navigation to ${selectedPlace.name}`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle map initialization
  const handleMapReady = (mapInstance) => {
    setMap(mapInstance);
    setMapReady(true);
    
    // Set initial view
    if (center) {
      mapInstance.setView([center.lat, center.lng], 13);
    }
  };

  // If no center, show placeholder
  if (!center) {
    return (
      <div className="lg:sticky lg:top-24 h-[400px] md:h-[500px] lg:h-[600px] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl bg-gray-800 flex items-center justify-center">
        <p className="text-white text-center p-4">
          {language === "ta" 
            ? "இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்" 
            : "Select a location to view map"}
        </p>
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-24 h-[400px] md:h-[500px] lg:h-[600px] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="h-full w-full rounded-xl"
        whenCreated={handleMapReady}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* CURRENT LOCATION */}
        {currentLocation && (
          <Marker 
            position={[currentLocation.lat, currentLocation.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className="font-semibold">
                {language === "ta" ? "உங்கள் இருப்பிடம்" : "Your Location"}
              </div>
              <div className="text-sm text-gray-600">
                Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* MOVING CAR */}
        {route && route.length > 0 && moveIndex < route.length && (
          <Marker position={route[moveIndex]} icon={carIcon}>
            <Popup>
              <div className="font-semibold">
                {language === "ta" ? "வழிகாட்டுதல்" : "Navigation"}
              </div>
              <div className="text-sm text-gray-600">
                {language === "ta" ? "முன்னேறுகிறது" : "In progress"}
              </div>
            </Popup>
          </Marker>
        )}

        {/* ROUTE LINE */}
        {route && route.length > 0 && (
          <Polyline 
            positions={route} 
            color="#3B82F6" 
            weight={3} 
            opacity={0.7} 
          />
        )}

        {/* PLACES */}
        {places.map((place) => (
          <Marker
            key={place.id || place.name}
            position={[place.lat, place.lng]}
            icon={placeIcon}
          >
            <Popup>
              <div className="font-semibold">{place.name}</div>
              <div className="text-sm text-gray-600 capitalize">
                {place.category || place.type || "Tourist Attraction"}
              </div>
              {place.country && (
                <div className="text-xs text-gray-500">{place.country}</div>
              )}
              {selectedPlace && selectedPlace.name === place.name && (
                <div className="mt-1 text-xs text-blue-600 font-medium">
                  {language === "ta" ? "✓ தேர்ந்தெடுக்கப்பட்டது" : "✓ Selected"}
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* MAP CONTROLS */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-[1000]">
        {selectedPlace && (
          <button
            onClick={handleStartNavigation}
            disabled={isLoading}
            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition shadow-lg flex items-center gap-2 disabled:opacity-50 text-sm md:text-base"
          >
            <Navigation size={16} className="md:w-5 md:h-5" />
            <span>
              {language === "ta" ? "வழிகாட்டுதலைத் தொடங்கு" : "Start Navigation"}
            </span>
          </button>
        )}
      </div>

      {/* SELECTED PLACE INFO */}
      {selectedPlace && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/70 backdrop-blur-sm text-white p-2 md:p-4 rounded-xl max-w-[200px] md:max-w-xs z-[1000]">
          <div className="font-bold text-sm md:text-lg mb-1">{selectedPlace.name}</div>
          <div className="text-xs md:text-sm opacity-90 mb-1 md:mb-2">
            {selectedPlace.country || selectedPlace.category || "Tourist Attraction"}
          </div>
          <div className="text-xs opacity-80">
            {language === "ta" ? "தேர்ந்தெடுக்கப்பட்ட இடம்" : "Selected Destination"}
          </div>
        </div>
      )}
    </div>
  );
}