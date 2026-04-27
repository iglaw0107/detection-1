import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AISummaryBox from "../components/ui/AISummaryBox";
import { detectCrime } from "../api/crime.api";

export default function VideoDetect() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // 🔥 HANDLE FILE UPLOAD
  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    const type = selected.type;

    if (type.startsWith("video")) {
      setFileType("video");
      setPreview(URL.createObjectURL(selected));
    } else if (type.startsWith("image")) {
      setFileType("image");
      setPreview(URL.createObjectURL(selected));
    } else if (type.includes("pdf")) {
      setFileType("document");
      setPreview(null);
    } else {
      setError("Unsupported file type");
    }
  };

  // 🔥 ANALYZE
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a file");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setResults([]);

      const formData = new FormData();

      // 🔥 DYNAMIC FIELD
      if (fileType === "video") {
        formData.append("video", file);
      } else if (fileType === "image") {
        formData.append("image", file);
      } else {
        formData.append("document", file);
      }

      formData.append("cameraId", "CAM_001");
      formData.append("location", "Delhi");

      const res = await detectCrime(formData);

      const data = res?.data?.data || res?.data;

      if (Array.isArray(data)) {
        setResults(data);
      } else if (data) {
        setResults([data]);
      }

    } catch (err) {
      console.error(err);
      setError("Detection failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout title="AI Detection System">

      <div className="grid lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="bg-[#111118] p-6 rounded-xl border border-white/10 space-y-4">

          <input
            type="file"
            accept="video/*,image/*,.pdf"
            onChange={handleUpload}
            className="text-white"
          />

          {/* 🔥 PREVIEW */}
          {preview && fileType === "video" && (
            <video src={preview} controls className="w-full rounded-lg" />
          )}

          {preview && fileType === "image" && (
            <img src={preview} alt="preview" className="w-full rounded-lg" />
          )}

          {fileType === "document" && file && (
            <div className="text-gray-400 text-sm">
              📄 Document uploaded: {file.name}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={processing}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full"
          >
            {processing ? "Analyzing..." : "Analyze"}
          </button>

          {error && <p className="text-red-400">{error}</p>}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">

          {processing && (
            <div className="bg-[#111118] p-6 rounded-xl border border-white/10">
              <AISummaryBox
                title="AI Processing"
                content="Analyzing uploaded content..."
                loading
              />
            </div>
          )}

          {results.length > 0 && !processing && (
            <div className="space-y-4">
              <h2 className="text-white text-lg">Detection Results</h2>

              {results.map((r, i) => (
                <div key={i} className="bg-[#111118] p-5 rounded-xl">

                  <div className="flex justify-between mb-2">
                    <p className="text-white capitalize">
                      {r.crimeType || "Unknown"}
                    </p>

                    <span className={`text-xs px-2 py-1 rounded ${
                      r.severity === "high"
                        ? "bg-red-500/20 text-red-400"
                        : r.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {r.severity}
                    </span>
                  </div>

                  {/* CONFIDENCE */}
                  <div className="mb-2">
                    <div className="w-full bg-white/10 h-2 rounded">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(r.confidenceScore || 0) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {((r.confidenceScore || 0) * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* AI SUMMARY */}
                  {r.aiSummary && (
                    <AISummaryBox
                      title="AI Insight"
                      content={r.aiSummary}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}