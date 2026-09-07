import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { getSession } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://megeb-plus-backend.vercel.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach the current Auth.js access token
 * to authenticated API requests.
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
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
 * Retry once when Django returns 401.
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const session = await getSession();

      const newAccessToken = session?.accessToken;

      if (!newAccessToken) {
        throw new Error("No authenticated session found.");
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

/* =========================================================
   TYPES
========================================================= */

export interface NutritionPlanSummary {
  id: number;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface NutritionistClient {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_picture: string | null;
  is_verified: boolean;
  preferences: string[];
  allergies: string[];
  nutrition_plans: NutritionPlanSummary[];
}

export interface ClientHealthProfile {
  age: number;
  gender: string;
  height: string;
  weight: string;
  activity_level: string;
  medical_conditions: string[];
  health_goal: string;
  diet_preference: string;
}

export interface ClientAppointment {
  id: number;
  date: string;
  time: string;
  appointment_type: string;
  mode: string;
  status: string;
}

export interface NutritionistClientDetails
  extends NutritionistClient {
  health_profile: ClientHealthProfile | null;
  appointments: ClientAppointment[];
}

export interface ClientNote {
  id: number;
  nutritionist: number;
  client: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

/* =========================================================
   API FUNCTIONS
========================================================= */

/**
 * Get all clients assigned to the nutritionist.
 *
 * GET /api/nutritionist/clients/
 */
export async function getNutritionistClients(): Promise<
  NutritionistClient[]
> {
  const response =
    await apiClient.get<NutritionistClient[]>(
      "/api/nutritionist/clients/"
    );

  return response.data;
}

/**
 * Get a single client's complete profile.
 *
 * GET /api/nutritionists/clients/:id/
 */
export async function getNutritionistClient(
  clientId: string | number
): Promise<NutritionistClientDetails> {
  const response =
    await apiClient.get<NutritionistClientDetails>(
      `/api/nutritionists/clients/${clientId}/`
    );

  return response.data;
}

/**
 * Get private notes for a client.
 *
 * GET /api/nutritionists/clients/:id/notes/
 */
export async function getClientNotes(
  clientId: string | number
): Promise<ClientNote | null> {
  const response =
    await apiClient.get<ClientNote | null>(
      `/api/nutritionists/clients/${clientId}/notes/`
    );

  return response.data;
}

/**
 * Update private notes for a client.
 *
 * PATCH /api/nutritionists/clients/:id/notes/
 */
export async function updateClientNotes(
  clientId: string | number,
  notes: string
): Promise<ClientNote> {
  const response =
    await apiClient.patch<ClientNote>(
      `/api/nutritionists/clients/${clientId}/notes/`,
      {
        notes,
      }
    );

  return response.data;
}

export default apiClient;