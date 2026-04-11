import { TrendingUp } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, trend, trendUp }) {
  return (
    <div className="p-5 bg-[#111118] border border-white/5 rounded-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>

          {trend && (
            <div
              className={`flex items-center gap-1 text-xs mt-1 ${
                trendUp ? "text-green-400" : "text-red-400"
              }`}
            >
              <TrendingUp className={`w-3 h-3 ${!trendUp && "rotate-180"}`} />
              {trend}
            </div>
          )}
        </div>

        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Icon className="text-purple-400 w-5 h-5" />
        </div>
      </div>
    </div>
  );
}