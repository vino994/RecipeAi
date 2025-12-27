import { Clock, Users, Star, Play } from "lucide-react";

export default function RecipeCard({ recipe, index, onView }) {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl glass-effect hover:scale-[1.02] transition-all duration-500"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* GLOW EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* BADGES */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="glass-button px-3 py-1 rounded-full text-xs font-medium">
            ⏱️ {recipe.cookTimeMinutes || 30} min
          </span>
          {recipe.difficulty && (
            <span className="glass-button px-3 py-1 rounded-full text-xs font-medium">
              {recipe.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {recipe.name}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {recipe.ingredients?.slice(0, 3).join(', ')}
          {recipe.ingredients?.length > 3 && '...'}
        </p>

        {/* META INFO */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{recipe.servings || 2}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">{recipe.rating || 4.5}</span>
            </div>
          </div>
        </div>

        {/* VIEW BUTTON */}
        <button
          onClick={onView}
          className="w-full glass-button-primary py-3 rounded-xl flex items-center justify-center gap-2 group-hover:gap-3 transition-all"
        >
          <Play className="w-4 h-4" />
          <span className="font-medium">View Recipe</span>
        </button>
      </div>
    </div>
  );
}