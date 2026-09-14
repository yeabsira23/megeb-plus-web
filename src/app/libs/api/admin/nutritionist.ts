import apiClient from "../client";

export type NutritionistStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

export interface NutritionistApplication {
  id: number;
  fullName: string;
  name?: string;
  email: string;
  phone: string;

  currentRole: string;

  specialty?: string;
  specialization: string;

  yearsOfExperience: string | number;

  licenseNumber: string;
  licenseState: string;
  licenseExpiration?: string;

  credentialType: string;
  credentialNumber: string;

  degree?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: string | number;

  submitted?: string;
  appliedDate?: string;

  status: NutritionistStatus;

  rejectionReason?: string | null;

  documents?: unknown[];

  aiStatus?: string;
  aiScore?: string;
}

export async function getNutritionists(): Promise<
  NutritionistApplication[]
> {
  const response = await apiClient.get<NutritionistApplication[]>(
    "/api/auth/admin/nutritionists"
  );

  return response.data;
}
export async function updateNutritionistStatus(
  id: number,
  status: NutritionistStatus
): Promise<NutritionistApplication> {
  const response = await apiClient.patch<NutritionistApplication>(
    `/api/auth/admin/nutritionists/${id}`,
    {
      status: status,
    }
  );

  return response.data;
}