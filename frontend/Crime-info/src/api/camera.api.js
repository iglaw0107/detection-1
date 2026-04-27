import api from "./axios";

export const getCameras = (params) => api.get("/cameras", { params });
export const getCameraStats = () => api.get("/cameras/stats");
export const getCameraById = (id) => api.get(`/cameras/${id}`);
export const addCamera = (data) => api.post("/cameras", data);
export const updateCamera = (id, data) => api.patch(`/cameras/${id}`, data);
export const updateCameraStatus = (id, data) => api.patch(`/cameras/${id}/status`, data);
export const deleteCamera = (id) => api.delete(`/cameras/${id}`);