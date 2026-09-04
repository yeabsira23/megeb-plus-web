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

/**
 * Add the current Auth.js access token
 * to authenticated API requests.
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const session = await getSession();

      const accessToken = session?.accessToken;

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
      /**
       * Get the current session.
       *
       * If the Django access token has expired,
       * Auth.js should refresh it through the
       * jwt callback in src/auth.ts.
       */
      const session = await getSession();

      const newAccessToken =
        session?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          'No authenticated session found.'
        );
      }

      /**
       * Retry the original request using
       * the latest Django access token.
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;