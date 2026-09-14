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
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch {
      return Promise.reject(error);
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
   NOTIFICATIONS
========================================================= */

export type NotificationType =
  | "appointment"
  | "message"
  | "plan"
  | string;

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  dateGroup: string;
  read: boolean;
}

export interface MarkAllNotificationsReadResponse {
  message: string;
}

/* =========================================================
   API FUNCTIONS
========================================================= */

/**
 * Get all notifications for the authenticated user.
 *
 * GET /api/notifications/
 */
export async function getNotifications(): Promise<
  Notification[]
> {
  const response =
    await apiClient.get<Notification[]>(
      "/api/notifications/"
    );

  return response.data;
}

/**
 * Mark a single notification as read.
 *
 * PATCH /api/notifications/{id}/read/
 */
export async function markNotificationAsRead(
  notificationId: number
): Promise<Notification> {
  const response =
    await apiClient.patch<Notification>(
      `/api/notifications/${notificationId}/read/`
    );

  return response.data;
}

/**
 * Mark all notifications as read.
 *
 * POST /api/notifications/mark-all-read/
 */
export async function markAllNotificationsAsRead(): Promise<
  MarkAllNotificationsReadResponse
> {
  const response =
    await apiClient.post<MarkAllNotificationsReadResponse>(
      "/api/notifications/mark-all-read/"
    );

  return response.data;
}

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



/* =========================================================
   NUTRITIONIST PROFILE
========================================================= */

export interface NutritionistProfileResponse {
  id: number;
  user: number;
  full_name: string;
  email: string;
  bio: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  license_number: string;
  profile_picture: string | null;
  is_verified: boolean;
  rating: string;
  consultation_fee: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateNutritionistProfileData {
  full_name?: string;
  bio?: string;
  specialization?: string;
  qualification?: string;
  years_of_experience?: number;
  consultation_fee?: string;
}

/**
 * GET /api/nutritionists/profile/
 */
export async function getNutritionistProfile(): Promise<NutritionistProfileResponse> {
  const response =
    await apiClient.get<NutritionistProfileResponse>(
      "/api/nutritionists/profile/"
    );

  return response.data;
}


/* =========================================================
   NUTRITIONIST AVAILABILITY
========================================================= */

export interface NutritionistAvailability {
  id: number;
  nutritionist: number;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAvailabilityData {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface UpdateAvailabilityData {
  start_time?: string;
  end_time?: string;
  is_active?: boolean;
}

/**
 * GET /api/appointments/availability/
 */
export async function getNutritionistAvailability(): Promise<
  NutritionistAvailability[]
> {
  const response =
    await apiClient.get<NutritionistAvailability[]>(
      "/api/appointments/availability/"
    );

  return response.data;
}

/**
 * POST /api/appointments/availability/
 */
export async function createNutritionistAvailability(
  data: CreateAvailabilityData
): Promise<NutritionistAvailability> {
  const response =
    await apiClient.post<NutritionistAvailability>(
      "/api/appointments/availability/",
      data
    );

  return response.data;
}

/**
 * PATCH /api/appointments/availability/{id}/
 */
export async function updateNutritionistAvailability(
  id: number,
  data: UpdateAvailabilityData
): Promise<NutritionistAvailability> {
  const response =
    await apiClient.patch<NutritionistAvailability>(
      `/api/appointments/availability/${id}/`,
      data
    );

  return response.data;
}

/**
 * DELETE /api/appointments/availability/{id}/
 */
export async function deleteNutritionistAvailability(
  id: number
): Promise<void> {
  await apiClient.delete(
    `/api/appointments/availability/${id}/`
  );
}

/**
 * PATCH /api/nutritionists/profile/
 */
export async function updateNutritionistProfile(
  data: UpdateNutritionistProfileData
): Promise<NutritionistProfileResponse> {
  const response =
    await apiClient.patch<NutritionistProfileResponse>(
      "/api/nutritionists/profile/",
      data
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

