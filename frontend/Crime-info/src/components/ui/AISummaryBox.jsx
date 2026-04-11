import { Brain } from "lucide-react";

export default function AISummaryBox({ title, content, loading }) {
  return (
    <div className="p-5 bg-[#111118] border border-white/5 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="text-purple-400 w-4 h-4" />
        <h4 className="text-sm font-semibold text-purple-300">{title}</h4>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-white/10 rounded" />
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      ) : (
        <p className="text-sm text-gray-300">{content}</p>
      )}
    </div>
  );
}