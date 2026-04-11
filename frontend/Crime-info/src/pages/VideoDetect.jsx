import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISummaryBox from "../components/ui/AISummaryBox";

export default function VideoDetect() {
  const [processing, setProcessing] = useState(false);

  return (
    <DashboardLayout title="Detect Video">
      <div className="bg-[#111118] p-6 rounded-xl border border-white/10">
        <input type="file" className="text-white mb-4" />

        <button
          onClick={() => setProcessing(true)}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          Analyze Video
        </button>
      </div>

      {processing && (
        <div className="mt-6">
          <AISummaryBox
            title="AI Processing"
            content="Analyzing video frames for threats..."
            loading
          />
        </div>
      )}
    </DashboardLayout>
  );
}