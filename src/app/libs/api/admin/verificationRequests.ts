import apiClient from "../client";

export type VerificationRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

export interface VerificationDocument {
  label: string;
  fileName: string;
  fileType?: string;
  fileUrl?: string;
  uploadedDate?: string;
}

export interface VerificationRequest {
  // List fields returned by verification-requests API
  id: number;
  name: string;
  specialty: string;
  submitted: string;

  // Status is added by frontend because the list API
  // currently does not return it
  status: VerificationRequestStatus;

  // Detailed fields - loaded/available when detail data exists
  fullName?: string;
  email?: string;
  phone?: string;
  currentRole?: string;
  specialization?: string;
  yearsOfExperience?: string | number;

  licenseNumber?: string;
  licenseState?: string;
  licenseExpiration?: string;

  credentialType?: string;
  credentialNumber?: string;

  insuranceProvider?: string;
  policyNumber?: string;
  insuranceExpiration?: string;
  coverageLimit?: string;

  degree?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: string | number;

  appliedDate?: string;
  rejectionReason?: string | null;

  documents?: VerificationDocument[];

  aiStatus?: string;
  aiScore?: string;
}

export async function getVerificationRequests(): Promise<
  VerificationRequest[]
> {
  const response = await apiClient.get<
    Array<{
      id: number;
      name: string;
      specialty: string;
      submitted: string;
    }>
  >("/api/auth/admin/verification-requests");

  return response.data.map((request) => ({
    ...request,
    status: "Pending" as VerificationRequestStatus,
  }));
}

export async function getVerificationRequestCount(): Promise<number> {
  const response = await apiClient.get<{ count: number }>(
    "/api/auth/admin/verification-requests/count"
  );

  return response.data.count;
}