export default function Suggestions({ suggestions, onSelect }) {
  if (!suggestions.length) return null;

  return (
    <div className="mt-4 bg-white rounded-xl shadow p-3">
      <h4 className="font-semibold mb-2">🍽 Suggested Recipes</h4>
      {suggestions.map(r => (
        <button
          key={r.id}
          onClick={() => onSelect(r.name)}
          className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          {r.name}
        </button>
      ))}
    </div>
  );
}
