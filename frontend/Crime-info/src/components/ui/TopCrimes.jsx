export default function TopCrimes({ data = [] }) {
  return (
    <div className="bg-[#111118] p-5 rounded-xl border border-white/5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        🔥 Top Crimes
      </h3>

      <div className="space-y-3">
        {data.map((crime, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg"
          >
            <span className="text-gray-300 capitalize">
              {crime._id || "unknown"}
            </span>

            <span className="text-purple-400 font-semibold">
              {crime.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}   