import axios from "axios";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:10000";

// ─────────────────────────────
// PREDICT
// ─────────────────────────────
export const predictCrime = async (payload: any) => {
  const res = await axios.post(`${AI_URL}/api/v1/predict`, payload);
  return res.data;
};

// ─────────────────────────────
// DETECT
// ─────────────────────────────
export const runVideoDetection = async (
  videoPath: string,
  cameraId: string,
  location: string
) => {
  const res = await axios.post(`${AI_URL}/api/v1/detect`, {
    videoPath,
    cameraId,
    location,
  });

  return res.data.detectedEvents || [];
};

// ─────────────────────────────
// HOTSPOTS
// ─────────────────────────────
export const predictHotspots = async (payload: any) => {
  const res = await axios.post(`${AI_URL}/api/v1/hotspots`, payload);
  return res.data;
};

// ─────────────────────────────
// TRENDS
// ─────────────────────────────
export const analyzeTrends = async (payload: any) => {
  const res = await axios.post(`${AI_URL}/api/v1/trends`, payload);
  return res.data;
};

// ─────────────────────────────
// AREA RISK
// ─────────────────────────────
export const getAreaRisk = async (payload: any) => {
  const res = await axios.post(`${AI_URL}/api/v1/area-risk`, payload);
  return res.data;
};

// ─────────────────────────────
// ALERT MESSAGE (LOCAL FALLBACK)
// ─────────────────────────────
export const generateAlertMessage = async (crimeData: {
  crimeType: string;
  severity: string;
  location: string;
  cameraId: string;
}): Promise<string> => {
  // 🔥 NO AI CALL (your AI doesn’t support this route)
  return `${crimeData.severity.toUpperCase()} ${crimeData.crimeType} detected at ${crimeData.location}. Immediate attention required.`;
};