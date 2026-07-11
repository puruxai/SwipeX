import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://swipex.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('swipex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
    if (error.response?.status !== 401 || originalRequest?._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('swipex_refresh_token');
    if (!refreshToken) return Promise.reject(error);

    try {
      refreshPromise ??= API.post('/auth/refresh', { refresh_token: refreshToken });
      const { data } = await refreshPromise;
      localStorage.setItem('swipex_token', data.access_token);
      localStorage.setItem('swipex_refresh_token', data.refresh_token);
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return API(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('swipex_token');
      localStorage.removeItem('swipex_refresh_token');
      localStorage.removeItem('swipex_user');
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export default API;
