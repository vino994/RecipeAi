import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* FIX MARKER ICON */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function MapView({ center, places }) {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (!center || !places.length) return;

    const newRoutes = places.slice(0, 5).map((p) => ({
      from: [center.lat, center.lng],
      to: [p.lat, p.lng]
    }));

    setRoutes(newRoutes);
  }, [center, places]);

  return (
    <div className="mt-8 rounded-2xl overflow-hidden shadow-xl border border-white/30">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: "420px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* USER */}
        <Marker position={[center.lat, center.lng]}>
          <Popup>📍 Starting Point</Popup>
        </Marker>

        {/* PLACES */}
        {places.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.address}
            </Popup>
          </Marker>
        ))}

        {/* ROUTES */}
        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={[r.from, r.to]}
            pathOptions={{
              color: "#3b82f6",
              weight: 4,
              dashArray: "10,10"
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
