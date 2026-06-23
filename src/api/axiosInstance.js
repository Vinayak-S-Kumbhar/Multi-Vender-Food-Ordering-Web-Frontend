import axios from "axios";
import toast from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,

  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // if refresh token api itself fails
    if (originalRequest.url === "/Auth/refresh") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      window.location.href = "/login";

      return Promise.reject(error);
    }

    // access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // CALL REFRESH API
        const response = await api.post("/Auth/refresh");

        const newAccessToken = response.data.accessToken;

        // SAVE NEW TOKEN
        localStorage.setItem("accessToken", newAccessToken);

        // UPDATE HEADER
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // RETRY ORIGINAL REQUEST
        return api(originalRequest);
      } catch (refreshError) {
        // REFRESH FAILED
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        toast.error("Session expired");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
