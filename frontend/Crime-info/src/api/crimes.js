import api from "./axios";

export const getCrimes = () => api.get("/crimes");
export const addCrime = (data) => api.post("/crimes", data);
export const updateCrime = (id, data) => api.patch(`/crimes/${id}`, data);