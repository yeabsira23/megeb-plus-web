import apiClient from "./client";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: number;
  nutritionist: number;
  nutritionist_name: string;
  client: number;
  client_name: string;
  appointment_type: string;
  date: string;
  time: string;
  mode: string;
  status: AppointmentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}


export interface AppointmentClient {
  id: number;
  name: string;
}

/**
 * Get unique clients that belong to the nutritionist's appointments
 */
export async function getNutritionistClients(): Promise<AppointmentClient[]> {
  const appointments = await getNutritionistAppointments();

  const clientsMap = new Map<number, AppointmentClient>();

  appointments.forEach((appointment) => {
    if (!clientsMap.has(appointment.client)) {
      clientsMap.set(appointment.client, {
        id: appointment.client,
        name: appointment.client_name,
      });
    }
  });

  return Array.from(clientsMap.values());
}

export interface CreateAppointmentData {
  nutritionist: number;
  client: number;
  appointment_type:
    | "consultation"
    | "follow_up"
    | "nutrition_plan";
  date: string;
  time: string;
  mode: "online";
  notes?: string;
}

/**
 * Create/book an appointment
 */
export async function createAppointment(
  data: CreateAppointmentData
): Promise<Appointment> {
  const response = await apiClient.post<Appointment>(
    "/api/appointments/",
    data
  );

  return response.data;
}

/**
 * Get appointments for the nutritionist
 */
export async function getNutritionistAppointments(): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>(
    "/api/appointments/nutritionist/"
  );

  return response.data;
}

/**
 * Get appointments for the client
 */
export async function getClientAppointments(): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>(
    "/api/appointments/client/"
  );

  return response.data;
}

/**
 * Confirm an appointment
 */
export async function confirmAppointment(
  appointmentId: number
): Promise<Appointment> {
  const response = await apiClient.patch<Appointment>(
    `/api/appointments/${appointmentId}/confirm/`
  );

  return response.data;
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  appointmentId: number
): Promise<Appointment> {
  const response = await apiClient.patch<Appointment>(
    `/api/appointments/${appointmentId}/cancel/`
  );

  return response.data;
}

/**
 * Create a consultation
 */
export async function createConsultation(
  appointmentId: number,
  data: Record<string, unknown>
) {
  const response = await apiClient.post(
    `/api/appointments/${appointmentId}/consultation/`,
    data
  );

  return response.data;
}

/**
 * Start a consultation
 */
export async function startConsultation(
  consultationId: number
) {
  const response = await apiClient.patch(
    `/api/appointments/consultations/${consultationId}/start/`
  );

  return response.data;
}

/**
 * End a consultation
 */
export async function endConsultation(
  consultationId: number
) {
  const response = await apiClient.patch(
    `/api/appointments/consultations/${consultationId}/end/`
  );

  return response.data;
}