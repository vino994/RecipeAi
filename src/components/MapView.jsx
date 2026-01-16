import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const placeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
  iconAnchor: [12.5, 25],
  popupAnchor: [0, -25]
});

export default function MapView({ 
  center, 
  places = [], 
  route = [], 
  currentLocation, 
  selectedPlace 
}) {
  const [moveIndex, setMoveIndex] = useState(0);
  const [map, setMap] = useState(null);

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

  if (!center) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-800 rounded-xl">
        <p className="text-white">Select a location to view map</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      className="h-full w-full rounded-xl"
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* CURRENT LOCATION */}
      {currentLocation && (
        <Marker position={[currentLocation.lat, currentLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="font-semibold">Your Location</div>
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
            <div className="font-semibold">Navigating...</div>
            <div className="text-sm text-gray-600">
              Progress: {Math.round((moveIndex / route.length) * 100)}%
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
          key={place.id}
          position={[place.lat, place.lng]}
          icon={placeIcon}
        >
          <Popup>
            <div className="font-semibold">{place.name}</div>
            <div className="text-sm text-gray-600 capitalize">
              {place.category || "Tourist Attraction"}
            </div>
            {selectedPlace && selectedPlace.id === place.id && (
              <div className="mt-2 text-xs text-blue-600 font-medium">
                ✓ Selected Destination
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}