import apiClient from "../client";

export type UserStatus = "Active" | "Suspended";

export interface AdminUser {
  id: number;
  name: string | null;
  email: string | null;
  status: UserStatus;
  joinedDate: string;
}

/**
 * Get all platform users (excluding admins).
 */
export async function getUsers(): Promise<AdminUser[]> {
  const response = await apiClient.get<AdminUser[]>(
    "/api/auth/admin/users"
  );

  return response.data;
}

/**
 * Suspend or reactivate a user.
 */
export async function updateUserStatus(
  userId: number,
  status: UserStatus
): Promise<AdminUser> {
  const response = await apiClient.patch<AdminUser>(
    `/api/auth/admin/users/${userId}`,
    { status }
  );

  return response.data;
}