import axios from "axios";

const PROJECT_API_URL = "https://server-zeta-one-69.vercel.app/api";
const LOCAL_API_URL = "http://localhost:5000/api";

const normalizeApiBaseUrl = (url) => {
  const requested = url || (import.meta.env.PROD ? PROJECT_API_URL : LOCAL_API_URL);
  const base = requested.replace(/\/+$/, "");
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
