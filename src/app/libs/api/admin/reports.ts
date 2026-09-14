import apiClient from "../client";

export interface ReportMetric {
  label: string;
  value: string;
  change: string;
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

export interface ReportsOverview {
  metrics: ReportMetric[];
  monthlySignups: MonthlyPoint[];
}

export async function getReportsOverview(): Promise<ReportsOverview> {
  const response = await apiClient.get<ReportsOverview>(
    "/api/auth/admin/reports/overview"
  );

  return response.data;
}