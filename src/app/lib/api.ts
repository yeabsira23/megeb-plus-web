import axios, { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Shared Axios instance for authenticated requests to the backend.
 * Every admin hook's commented-out fetch call assumes this file exists.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Normalize Axios errors into ApiError so calling code doesn't need to
// know anything about Axios's error shape.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      `Request failed with status ${status}`;
    return Promise.reject(new ApiError(message, status));
  }
);

/**
 * Convenience wrapper so hooks can call apiFetch<T>('/path') the same way
 * they would with fetch(), without dealing with response.data themselves.
 *
 * Example:
 *   const stats = await apiFetch<Stat[]>('/admin/dashboard/stats');
 *   await apiFetch('/admin/users/123', { method: 'PATCH', data: { status: 'Suspended' } });
 */
export async function apiFetch<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.request<T>({ url: path, ...config });
  return response.data;
}

/**
 * Clears the local session. Does NOT call the backend logout endpoint —
 * pair this with a POST to /auth/logout for a full server-side logout.
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  }
}