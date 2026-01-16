// src/components/tour/ItineraryView.jsx
import { motion } from "framer-motion";
import { Calendar, Navigation } from "lucide-react";

export default function ItineraryView({ planDays, location, language, isGeneratingPlan }) {
  if (isGeneratingPlan) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div>{language === "ta" ? "பயண திட்டம் உருவாக்கப்படுகிறது..." : "Generating travel plan..."}</div>
        </div>
      </div>
    );
  }

  if (planDays.length === 0) {
    return (
      <div className="text-center py-8 md:py-10 text-white/70">
        {language === "ta" 
          ? "பயண திட்டத்தை உருவாக்க பொத்தானை கிளிக் செய்க" 
          : "Click generate button to create your travel plan"}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {planDays.map((day) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/20 backdrop-blur-sm p-4 md:p-5 rounded-2xl text-white border border-white/10"
        >
          <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
            <Calendar size={18} className="md:w-5 md:h-5" />
            <span>📅 {language === "ta" ? "நாள்" : "Day"} {day.day}: {day.title}</span>
          </h2>
          
          <div className="space-y-3 md:space-y-4">
            {day.places.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 p-3 md:p-4 rounded-xl hover:bg-white/20 transition group border border-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="text-xl">
                      {place.type === "sightseeing" ? "👁️" : 
                       place.type === "food" ? "🍽️" : 
                       place.type === "historic" ? "🏛️" : 
                       place.type === "culture" ? "🎭" : "📍"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base mb-1 flex items-center justify-between">
                      <span>{place.name}</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">
                        {place.time || `${9 + i * 3}:00 AM`}
                      </span>
                    </div>
                    
                    {place.description && (
                      <div className="text-xs md:text-sm opacity-90 mb-2">
                        {place.description}
                      </div>
                    )}
                    
                    <div className="flex justify-between text-xs opacity-80">
                      <span>{place.duration || "2-3 hours"}</span>
                      <span className="bg-white/20 px-2 py-1 rounded capitalize">
                        {place.type || "activity"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}