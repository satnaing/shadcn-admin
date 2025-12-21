import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: Number(API_CONFIG.TIMEOUT),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // Enable HTTP-only cookies
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
