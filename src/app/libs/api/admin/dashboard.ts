import apiClient from "../client";

export type DashboardIcon =
  | "users"
  | "doctor"
  | "calendar"
  | "money";

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: DashboardIcon;
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const response = await apiClient.get<DashboardStat[]>(
    "/api/auth/admin/dashboard/stats"
  );

  return response.data;
}