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

let authExpiredDispatched = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const sessionUser = localStorage.getItem("user");
  if (sessionUser) config.headers["X-Session-User"] = encodeURIComponent(sessionUser);
  return config;
});

api.interceptors.response.use(
  (response) => {
    authExpiredDispatched = false;
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isAuthRequest = ["/auth/login", "/auth/register", "/auth/forgot-password"].some((path) => requestUrl.includes(path));

    if (status === 401 && !isAuthRequest && !authExpiredDispatched) {
      authExpiredDispatched = true;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }

    return Promise.reject(error);
  }
);

export default api;
