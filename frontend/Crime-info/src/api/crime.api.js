// import api from "./axios";

// export const getCrimes = (params) => api.get("/crimes", { params });
// export const getCrimeStats = () => api.get("/crimes/stats");
// export const getCrimeById = (id) => api.get(`/crimes/${id}`);
// export const detectCrime = (formData) => api.post("/crimes/detect", formData);
// export const createManualCrime = (data) => api.post("/crimes/manual", data);
// export const saveCrime = (id, data) => api.patch(`/crimes/${id}/save`, data);
// export const deleteCrime = (id) => api.delete(`/crimes/${id}`);
// export const getCrimeHotspots = (params) => api.get("/crimes/hotspots", { params });
// export const getCrimeTrends = (params) => api.get("/crimes/trends", { params });
// export const getCrimeAreaRisk = (params) => api.get("/crimes/area-risk", { params });
// export const predictCrimeRisk = (data) => api.post("/crimes/predict", data);

import api from "./axios";

// 🔥 PUBLIC AI (no login required)
export const publicPredict = (data) =>
  api.post("/public/predict", data);

// 🔥 PRIVATE AI (logged in) ✅ FIXED
export const predictCrime = (data) =>
  api.post("/crimes/predict-direct", data);

// 🔥 VIDEO DETECTION
export const detectCrime = (formData) =>
  api.post("/crimes/upload-video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 🔥 GET CRIMES
export const getCrimes = (params) =>
  api.get("/crimes", { params });

// 🔥 OPTIONAL (GOOD FOR FUTURE)
export const getCrimeHotspots = (params) =>
  api.get("/crimes/hotspots", { params });

export const getCrimeTrends = (params) =>
  api.get("/crimes/trends", { params });