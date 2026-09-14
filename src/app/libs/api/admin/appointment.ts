import apiClient from "../client";

export type AppointmentStatus =
  | "Confirmed"
  | "Pending"
  | "Cancelled";

export interface AdminAppointment {
  id: number;
  client: string;
  nutritionist: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export async function getAppointments(): Promise<AdminAppointment[]> {
  const response = await apiClient.get<AdminAppointment[]>(
    "/api/auth/admin/appointments"
  );

  return response.data;
}