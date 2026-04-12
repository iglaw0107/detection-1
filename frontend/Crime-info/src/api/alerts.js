import api from "./axios";

export const getAlerts = (params) => api.get("/alerts", { params });
export const getAlertStats = () => api.get("/alerts/stats");
export const getAlertById = (id) => api.get(`/alerts/${id}`);
export const resolveAlert = (id, data) => api.post(`/alerts/${id}/resolve`, data);
export const dismissAlert = (id, data) => api.post(`/alerts/${id}/dismiss`, data);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);