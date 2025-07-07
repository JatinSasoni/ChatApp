import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors and avoid retry loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") // TO PREVENT CALLING REFRESH TOKEN ROUTE AS INDEPENDENT API CALL
    ) {
      originalRequest._retry = true; //prevent loop
      try {
        //Attempt to refresh token
        const response = await api.get("/api/v1/auth/refresh-token", {
          withCredentials: true,
        });

        const accessToken = response?.data?.AccessToken;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          api.defaults.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear everything and redirect to login
        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 401
        ) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login"; // Full redirect to reset state
        }

        return Promise.reject(refreshError);
      }
    }
    // For other errors
    return Promise.reject(error);
  }
);
