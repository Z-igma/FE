import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// 공통 인스턴스
export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 토큰 자동 첨부
instance.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 토큰 만료 처리
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (window.location.pathname !== '/home') {
        window.location.href = '/home';
      }
    }

    return Promise.reject(error);
  },
);
