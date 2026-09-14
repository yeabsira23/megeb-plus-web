import apiClient from "../client";

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
}

export async function getSettings(): Promise<PlatformSettings> {
  const response = await apiClient.get<PlatformSettings>(
    "/api/auth/admin/settings"
  );

  return response.data;
}

export async function updateSettings(
  settings: PlatformSettings
): Promise<PlatformSettings> {
  const response = await apiClient.put<PlatformSettings>(
    "/api/auth/admin/settings",
    settings
  );

  return response.data;
}