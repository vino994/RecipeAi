// src/components/tour/PopularDestinations.jsx
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function PopularDestinations({ 
  destinations, 
  onSelectDestination, 
  language,
  show = true 
}) {
  if (!show) return null;

  return (
    <div className="bg-white/20 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl mb-4 md:mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
        <Globe size={20} className="md:w-6 md:h-6" /> 
        <span>{language === "ta" ? "🎯 பிரபலமான இலக்குகள்" : "🎯 Popular Destinations"}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {destinations.map((destination, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectDestination(destination)}
            className="bg-white/10 rounded-xl overflow-hidden cursor-pointer hover:bg-white/20 transition group"
          >
            <div className="relative h-32 md:h-40 overflow-hidden">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 text-white">
                <div className="font-bold text-base md:text-lg">{destination.name}</div>
                <div className="text-xs md:text-sm opacity-90">{destination.country}</div>
              </div>
            </div>
            <div className="p-2 md:p-3">
              <button className="w-full py-1.5 md:py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-xs md:text-sm">
                {language === "ta" ? "திட்டம் உருவாக்கு" : "Plan Trip"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}