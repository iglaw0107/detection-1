import api from "./axios";

export const getCrimes = (params) => api.get("/crimes", { params });
export const getCrimeStats = () => api.get("/crimes/stats");
export const getCrimeById = (id) => api.get(`/crimes/${id}`);
export const detectCrime = (formData) => api.post("/crimes/detect", formData);
export const createManualCrime = (data) => api.post("/crimes/manual", data);
export const saveCrime = (id, data) => api.patch(`/crimes/${id}/save`, data);
export const deleteCrime = (id) => api.delete(`/crimes/${id}`);
export const getCrimeHotspots = (params) => api.get("/crimes/hotspots", { params });
export const getCrimeTrends = (params) => api.get("/crimes/trends", { params });
export const getCrimeAreaRisk = (params) => api.get("/crimes/area-risk", { params });
export const predictCrimeRisk = (data) => api.post("/crimes/predict", data);