import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISummaryBox from "../components/ui/AISummaryBox";

export default function PredictRisk() {
  const [form, setForm] = useState({
    location: "",
    time: "",
    weapon: "",
    domain: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        crime: "Robbery",
        confidence: 86,
        risk: "High",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <DashboardLayout title="Predict Risk">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 bg-[#111118] rounded-xl border border-white/10">
          <input
            placeholder="Location"
            className="w-full mb-3 p-2 bg-black/40 rounded"
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full mb-3 p-2 bg-black/40 rounded"
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <button
            onClick={predict}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            Predict Risk
          </button>
        </div>

        {loading && <AISummaryBox title="Analyzing" loading />}

        {result && (
          <div className="p-6 bg-[#111118] rounded-xl border border-white/10">
            <p className="text-xl text-white">{result.crime}</p>
            <p className="text-gray-400">Risk: {result.risk}</p>
            <p className="text-gray-400">Confidence: {result.confidence}%</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}