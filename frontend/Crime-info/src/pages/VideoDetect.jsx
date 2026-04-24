import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISummaryBox from "../components/ui/AISummaryBox";
import { detectCrime } from "../api/crimes";

export default function VideoDetect() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a video first");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("video", file);
      formData.append("cameraId", "CAM_001"); // ✅ MUST
      formData.append("location", "Delhi");   // ✅ OPTIONAL but recommended

      const res = await detectCrime(formData);

      // adjust based on your backend response
      setResult(res.data);

    } catch (err) {
      console.error("Detect error:", err);
      setError("Failed to analyze video");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout title="Detect Video">

      {/* Upload UI */}
      <div className="bg-[#111118] p-6 rounded-xl border border-white/10">
        <input
          type="file"
          accept="video/*"
          onChange={handleUpload}
          className="text-white mb-4"
        />

        <button
          onClick={handleAnalyze}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          Analyze Video
        </button>

        {error && (
          <p className="text-red-400 mt-3">{error}</p>
        )}
      </div>

      {/* Loading */}
      {processing && (
        <div className="mt-6">
          <AISummaryBox
            title="AI Processing"
            content="Analyzing video frames for threats..."
            loading
          />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 bg-[#111118] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl text-white mb-3">Detection Result</h2>

          <p className="text-gray-300">
            Crime Type: <span className="text-white">{result.crimeType || "Unknown"}</span>
          </p>

          <p className="text-gray-300">
            Severity: <span className="text-white">{result.severity || "N/A"}</span>
          </p>

          <p className="text-gray-300">
            Confidence:{" "}
            <span className="text-white">
              {result.confidenceScore
                ? (result.confidenceScore * 100).toFixed(1) + "%"
                : "N/A"}
            </span>
          </p>

          {result.aiSummary && (
            <div className="mt-4">
              <AISummaryBox
                title="AI Summary"
                content={result.aiSummary}
              />
            </div>
          )}
        </div>
      )}

    </DashboardLayout>
  );
}