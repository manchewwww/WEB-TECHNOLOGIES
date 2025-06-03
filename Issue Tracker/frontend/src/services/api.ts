import axios from 'axios';
import { getRefreshToken, getAuthToken, setAuthToken } from '../utils/auth';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) config.headers!['Authorization'] = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const { data } = await apiClient.post('/auth/refresh', { refreshToken });
        setAuthToken(data.accessToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  async login(params: { email: string; password: string }) {
    try {
    const { data } = await apiClient.post('/auth/login', params);
    return data;
    } catch (error) {
      console.error("Login failed: (Api.ts)", error);
      throw error;
    }
  },
  async register(params: any) {
    const { data } = await apiClient.post('/auth/register', params);
    return data;
  },
};

export const api = {
  get: <T>(endpoint: string) =>
    apiClient.get<T>(endpoint).then(res => res.data),
  post: <T>(endpoint: string, payload?: any) =>
    apiClient.post<T>(endpoint, payload).then(res => res.data),
  put: <T>(endpoint: string, payload: any) =>
    apiClient.put<T>(endpoint, payload).then(res => res.data),
  delete: <T>(endpoint: string) =>
    apiClient.delete<T>(endpoint).then(res => res.data),
};
