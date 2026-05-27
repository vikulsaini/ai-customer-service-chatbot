import axios from "axios";

const normalizeApiBaseUrl = (url) => {
  const base = (url || "http://localhost:5000/api").replace(/\/+$/, "");
  return base;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
