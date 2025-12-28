import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX
} from "lucide-react";
import VoiceLocationInput from "../components/VoiceLocationInput";
import MapView from "../components/MapView";
import "leaflet/dist/leaflet.css";

/* ASSETS */
import bgImage from "../assets/hero.jpg";
import ambientAudio from "../assets/ambient.mp3";

const API = "http://localhost:5000";

export default function GlobalTourAI() {
  /* ================= PARALLAX ================= */
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, -150]);

  /* ================= AMBIENT AUDIO ================= */
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.25;
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {});
  }, []);

  const lowerAmbient = () => {
    if (audioRef.current) audioRef.current.volume = 0.05;
  };

  const raiseAmbient = () => {
    if (audioRef.current) audioRef.current.volume = 0.25;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  /* ================= SPEECH ================= */
  const synth = window.speechSynthesis;

  const speak = (text) => {
    if (!synth) return;
    synth.cancel();
    lowerAmbient();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    u.onend = raiseAmbient;

    synth.speak(u);
  };

  const pauseSpeech = () => synth.pause();
  const resumeSpeech = () => synth.resume();
  const stopSpeech = () => {
    synth.cancel();
    raiseAmbient();
  };

  /* ================= STATE ================= */
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [places, setPlaces] = useState([]);
  const [planDays, setPlanDays] = useState([]);
  const [placeImages, setPlaceImages] = useState({});

  /* ================= SEARCH ================= */
  const searchLocation = async (q) => {
    if (q.length < 3) return;
    const r = await fetch(`${API}/api/tour/places/search?query=${q}`);
    const d = await r.json();
    if (d.success) setSearchResults(d.results);
  };

  const selectPlace = (p) => {
    setLocation(p.name);
    setCoordinates({ lat: p.lat, lng: p.lng });
    setSearchResults([]);
    fetchNearby(p.lat, p.lng);
  };

  const handleVoiceLocation = async (text) => {
    setLocation(text);
    const r = await fetch(`${API}/api/tour/places/search?query=${text}`);
    const d = await r.json();
    if (d.success && d.results.length) selectPlace(d.results[0]);
  };

  const fetchNearby = async (lat, lng) => {
    const r = await fetch(`${API}/api/tour/places/nearby?lat=${lat}&lng=${lng}`);
    const d = await r.json();
    if (d.success) setPlaces(d.places);
  };

  /* ================= PLAN (FIXED) ================= */
  const generatePlan = () => {
    if (!places.length) return;

    const perDay = Math.ceil(places.length / 3);
    const days = [];

    for (let i = 0; i < 3; i++) {
      const slice = places.slice(i * perDay, (i + 1) * perDay);
      if (slice.length) {
        days.push({
          day: i + 1,
          places: slice
        });
      }
    }

    setPlanDays(days);
  };

  /* ================= IMAGE FETCH ================= */
  const fetchPlaceImage = async (name) => {
    if (placeImages[name]) return;

    try {
      const r = await fetch(
        `${API}/api/tour/place-image?name=${encodeURIComponent(name)}`
      );
      const d = await r.json();
      if (d.success && d.imageUrl) {
        setPlaceImages((p) => ({ ...p, [name]: d.imageUrl }));
      }
    } catch {}
  };

  useEffect(() => {
    planDays.forEach((d) =>
      d.places.forEach((p) => fetchPlaceImage(p.name))
    );
  }, [planDays]);

  /* ================= UI ================= */
  return (
<div className="relative min-h-[100svh] w-full overflow-hidden">

      {/* AUDIO */}
      <audio ref={audioRef} src={ambientAudio} />

      {/* BACKGROUND */}
<motion.div
  style={{ y: bgY }}
  className="fixed inset-0 w-screen min-h-[100svh] -z-10"
>
  <img
    src={bgImage}
    className="w-full h-full object-cover"
    alt="background"
  />
  <div className="absolute inset-0 bg-black/50" />
</motion.div>


      {/* MUTE */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 bg-white/20 p-3 rounded-full text-white"
      >
        {muted ? <VolumeX /> : <Volume2 />}
      </button>

      <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-10">
          🌍 Global Tour Planner
        </h1>

        <div className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl">

          <div className="flex gap-3 mb-4">
            <input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                searchLocation(e.target.value);
              }}
              className="flex-1 p-4 rounded-xl bg-white/30 text-white"
              placeholder="Enter city"
            />
            <VoiceLocationInput onLocationDetected={handleVoiceLocation} />
          </div>

          {searchResults.map((r, i) => (
            <div
              key={i}
              onClick={() => selectPlace(r)}
              className="p-3 text-white cursor-pointer hover:bg-white/20 rounded"
            >
              <MapPin className="inline mr-2 w-4 h-4" />
              {r.name}, {r.country}
            </div>
          ))}

          {coordinates && places.length > 0 && (
            <MapView center={coordinates} places={places} />
          )}

          <button
            onClick={generatePlan}
            className="w-full mt-6 py-4 bg-orange-500 text-white rounded"
          >
            ✨ Generate Trip Plan
          </button>

          {planDays.length > 0 && (
            <>
              <button
                onClick={() =>
                  speak(`Welcome to your guided tour of ${location}`)
                }
                className="w-full mt-3 py-3 bg-blue-500 text-white rounded"
              >
                <Play className="inline mr-2" /> Play Tour Voice
              </button>

              <div className="flex gap-3 mt-2">
                <button onClick={pauseSpeech} className="flex-1 bg-yellow-500 p-2 rounded text-white"><Pause /></button>
                <button onClick={resumeSpeech} className="flex-1 bg-green-600 p-2 rounded text-white">Resume</button>
                <button onClick={stopSpeech} className="flex-1 bg-red-600 p-2 rounded text-white"><Square /></button>
              </div>
            </>
          )}
        </div>

        {/* DAY DETAILS */}
        <AnimatePresence>
          {planDays.map((d) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 bg-white/20 p-6 rounded text-white"
            >
              <h2 className="text-2xl font-bold mb-3">📅 Day {d.day}</h2>

              {d.places.map((p) => (
                <div key={p.id} className="mb-4 bg-white/20 p-3 rounded">
                  {placeImages[p.name] && (
                    <img
                      src={placeImages[p.name]}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  )}
                  <div className="font-semibold">🏛 {p.name}</div>
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
