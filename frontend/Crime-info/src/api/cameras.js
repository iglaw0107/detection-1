import api from "./axios";

export const getCameras = () => api.get("/cameras");
export const addCamera = (data) => api.post("/cameras", data);
export const deleteCamera = (id) => api.delete(`/cameras/${id}`);