import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import { getSession } from 'next-auth/react';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://megeb-plus-backend.vercel.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate client for refreshing the access token.
// This prevents the refresh request from triggering
// the same interceptor again.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add access token to every protected request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      // Prefer NextAuth session access token when available,
      // fall back to localStorage for manually-managed tokens.
      const session = await getSession();
      const accessToken = session?.accessToken ?? localStorage.getItem('access');

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * If Django returns 401, get the latest Auth.js
 * session and retry the request once.
 *
 * Auth.js is responsible for refreshing the
 * Django access token through src/auth.ts.
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    /**
     * Only handle authentication failures.
     */
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    /**
     * Axios requests made on the server do not
     * have access to the client-side session.
     */
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Try to get a refreshed access token from NextAuth first.
      const session = await getSession();
      const newAccessToken = session?.accessToken;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }

      // Fallback: try refreshing using the refresh token stored in localStorage
      const refreshToken = localStorage.getItem('refresh');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      const response = await refreshClient.post(
        '/api/token/refresh/',
        {
          refresh: refreshToken,
        }
      );

      const refreshedAccess = response.data.access;

      if (!refreshedAccess) {
        throw new Error('No access token returned from refresh.');
      }

      // Save the new access token
      localStorage.setItem('access', refreshedAccess);

      // Update the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${refreshedAccess}`;

      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh token is invalid/expired.
      // Clear authentication data.
      try {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        localStorage.removeItem('full_name');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
      } catch (e) {
        // ignore localStorage errors
      }

      return Promise.reject(refreshError);
    }

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;