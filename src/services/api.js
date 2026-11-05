import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL: "https://ecommece-meh-backend.vercel.app/",
});

// ✅ REQUEST INTERCEPTOR (Token attach)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ RESPONSE INTERCEPTOR (Global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token invalid / expired
      localStorage.removeItem("token");

      // optional: redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
