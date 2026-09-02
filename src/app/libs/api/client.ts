import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

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
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access');

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh expired access tokens
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Only handle 401 responses
    // and don't retry the same request multiple times.
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Don't try to refresh if we're not in the browser
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh');

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await refreshClient.post(
        '/api/token/refresh/',
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;

      if (!newAccessToken) {
        throw new Error('No access token returned from refresh.');
      }

      // Save the new access token
      localStorage.setItem('access', newAccessToken);

      // Update the original request with the new token
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh token is invalid/expired.
      // Clear authentication data.
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('role');
      localStorage.removeItem('full_name');
      localStorage.removeItem('email');
      localStorage.removeItem('phone');

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;