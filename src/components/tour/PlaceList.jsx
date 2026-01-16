// src/components/tour/PlaceList.jsx
import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

export default function PlaceList({ places, onSelectPlace, language }) {
  const getTimeSlot = (i) => {
    if (i % 3 === 0) return "Morning (9 AM – 12 PM)";
    if (i % 3 === 1) return "Afternoon (1 PM – 4 PM)";
    return "Evening (5:30 PM – 8 PM)";
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {places.map((place, i) => (
        <motion.div
          key={place.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelectPlace(place)}
          className="bg-white/10 p-3 md:p-4 rounded-xl cursor-pointer hover:bg-white/20 transition group border border-white/5"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <div className="text-2xl">
                {place.category === "historic" ? "🏛️" : 
                 place.category === "tourism" ? "🏨" : 
                 place.category === "religious" ? "🛐" : "📍"}
              </div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-base md:text-lg mb-1 flex items-center justify-between">
                <span>{place.name}</span>
                <button className="text-blue-300 hover:text-white">
                  <Navigation size={16} />
                </button>
              </div>
              
              <div className="text-xs md:text-sm opacity-90 mb-2">
                {place.description || `${place.name} is a popular tourist destination`}
              </div>
              
              <div className="flex justify-between text-xs opacity-80">
                <span>{getTimeSlot(i)}</span>
                <span className="bg-white/20 px-2 py-1 rounded capitalize">
                  {place.category || "attraction"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}