export default function IntentChips({ intents }) {
  if (!intents?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {intents.map(i => (
        <span
          key={i}
          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold"
        >
          {i}
        </span>
      ))}
    </div>
  );
}
