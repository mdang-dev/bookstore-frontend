import axios from 'axios';
import { COOKIE_KEYS } from '@/constant/cookie-keys.constant';
import { getCookie } from './cookie.util';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
});
httpClient.interceptors.request.use(
  (config) => {
    const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - handle logout or refresh', error);
    }
    return Promise.reject(error);
  },
);

export default httpClient;
