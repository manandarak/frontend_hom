import axios from "axios";

// Base URL Configuration
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/v1"
    : "");

const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor (Attach JWT Token)
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Global Auth Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn(
          "🔒 Session expired or invalid token. Clearing auth state..."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
