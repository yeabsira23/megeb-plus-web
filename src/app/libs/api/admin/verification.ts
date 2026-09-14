import apiClient from "../client";

export interface VerificationRequest {
  id: number;
  name: string;
  specialty: string;
  submitted: string;
}

export async function getVerificationRequests(): Promise<
  VerificationRequest[]
> {
  const response = await apiClient.get<VerificationRequest[]>(
    "/api/auth/admin/verification-requests"
  );

  return response.data;
}