import apiClient from "../client";

export interface AdminProfile {
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  joinedDate: string;
}

export interface UpdateAdminProfile {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  detail: string;
}

export async function getAdminProfile(): Promise<AdminProfile> {
  const response = await apiClient.get<AdminProfile>(
    "/api/auth/admin/profile"
  );

  return response.data;
}

export async function updateAdminProfile(
  data: UpdateAdminProfile
): Promise<AdminProfile> {
  const response = await apiClient.put<AdminProfile>(
    "/api/auth/admin/profile",
    data
  );

  return response.data;
}

export async function changeAdminPassword(
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  const response = await apiClient.post<ChangePasswordResponse>(
    "/api/auth/admin/profile/password",
    data
  );

  return response.data;
}