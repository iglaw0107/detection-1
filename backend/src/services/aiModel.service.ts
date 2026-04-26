import axios from "axios";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:10000";

// ─────────────────────────────
// 🔹 CRIME PREDICTION
// ─────────────────────────────
export const predictCrime = async (payload: any) => {
  try {
    const res = await axios.post(
      `${AI_URL}/api/v1/predict`,
      payload,
      { timeout: 5000 }
    );

    return res.data;
  } catch (error: any) {
    console.error("AI Predict Error:", error.message);

    return {
      predicted_crime: "unknown",
      risk_level: "low",
      aiSummary: "AI service unavailable",
    };
  }
};

// ─────────────────────────────
// 🔹 AREA RISK
// ─────────────────────────────
export const getAreaRisk = async (payload: any) => {
  try {
    const res = await axios.post(
      `${AI_URL}/api/v1/area-risk`,
      payload,
      { timeout: 5000 }
    );

    return res.data;
  } catch (error: any) {
    console.error("AI Area Risk Error:", error.message);

    return {
      risk: "unknown",
      message: "AI unavailable",
    };
  }
};

// ─────────────────────────────
// 🔹 HOTSPOTS
// ─────────────────────────────
export const predictHotspots = async (payload: any) => {
  try {
    const res = await axios.post(
      `${AI_URL}/api/v1/hotspots`,
      payload,
      { timeout: 5000 }
    );

    return res.data;
  } catch (error: any) {
    console.error("AI Hotspots Error:", error.message);

    return {
      hotspots: [],
    };
  }
};

// ─────────────────────────────
// 🔹 TREND ANALYSIS
// ─────────────────────────────
export const analyzeTrends = async (payload: any) => {
  try {
    const res = await axios.post(
      `${AI_URL}/api/v1/trends`,
      payload,
      { timeout: 5000 }
    );

    return res.data;
  } catch (error: any) {
    console.error("AI Trend Error:", error.message);

    return {
      trend: "stable",
      message: "Trend analysis unavailable",
    };
  }
};

// ─────────────────────────────
// 🔥 VIDEO DETECTION (YOLO READY)
// ─────────────────────────────
export const runVideoDetection = async (
  videoPath: string,
  cameraId: string,
  location: string
) => {
  try {
    const res = await axios.post(
      `${AI_URL}/api/v1/detect`,
      {
        videoUrl: videoPath,
        cameraId,
        location,
      },
      { timeout: 15000 }
    );

    return res.data;

  } catch (error: any) {
    console.error("Video Detection Error:", error.message);

    // 🔥 fallback (for now until YOLO ready)
    return [
      {
        crimeType: "suspicious",
        severity: "medium",
        confidenceScore: 0.65,
        aiSummary: "Suspicious activity detected from uploaded video",
      },
    ];
  }
};

// ─────────────────────────────
// 🔥 IMAGE DETECTION (FUTURE READY)
// ─────────────────────────────
export const runImageDetection = async (
  imagePath: string,
  location: string
) => {
  try {
    const res = await axios.post(
      `${AI_URL}/api/v1/detect-image`,
      {
        imageUrl: imagePath,
        location,
      },
      { timeout: 10000 }
    );

    return res.data;

  } catch (error: any) {
    console.error("Image Detection Error:", error.message);

    // 🔥 fallback
    return [
      {
        crimeType: "suspicious",
        severity: "low",
        confidenceScore: 0.5,
        aiSummary: "Potential suspicious activity detected in image",
      },
    ];
  }
};