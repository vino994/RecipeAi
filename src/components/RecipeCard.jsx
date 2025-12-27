export default function RecipeCard({ recipe, onView }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">
          {recipe.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {recipe.ingredients.join(", ")}
        </p>

        <button
          onClick={onView}
          className="mt-3 text-sm font-semibold text-black underline"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
