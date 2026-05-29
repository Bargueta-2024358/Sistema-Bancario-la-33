import axios from '../utils/axios.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const attachAuth = (instance, clientName) => {
  instance.interceptors.request.use((config) => {
    config._axiosClient = clientName;
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );
};

export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosBanking = axios.create({
  baseURL: import.meta.env.VITE_BANKING_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosReports = axios.create({
  baseURL: import.meta.env.VITE_REPORTS_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosNotifications = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATIONS_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

attachAuth(axiosAuth, 'auth');
attachAuth(axiosAdmin, 'admin');
attachAuth(axiosBanking, 'banking');
attachAuth(axiosReports, 'reports');
attachAuth(axiosNotifications, 'notifications');

export { axiosAuth as default };
