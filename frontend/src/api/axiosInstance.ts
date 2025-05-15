import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
export const flaskInstance = axios.create({
  baseURL: 'http://localhost:5001',
});

