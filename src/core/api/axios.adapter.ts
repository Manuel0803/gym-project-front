import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { HttpAdapter } from './http.adapter';
import { useAuthStore } from '@/features/auth/store/auth.store'; 

export class AxiosAdapter implements HttpAdapter {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const { refreshToken, setTokens, setLogout } = useAuthStore.getState();

          if (!refreshToken) {
            this.forceLogout(setLogout);
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          this.isRefreshing = true;

          try {
            const response = await axios.post<{ access_token: string; refresh_token: string }>(
              `${this.axiosInstance.defaults.baseURL}/auth/refresh`,
              { refreshToken }
            );

            const { access_token, refresh_token } = response.data;

            setTokens(access_token, refresh_token);

            this.processQueue(null, access_token);

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.axiosInstance(originalRequest);
            
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.forceLogout(setLogout);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private forceLogout(setLogoutFn: () => void) {
    if (typeof window !== 'undefined') {
      setLogoutFn();
      window.location.href = '/login';
    }
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new AxiosAdapter();
