import apiClient from "../client";
import type { SubmittedDocument } from "@/app/components/admin/DocumentPreviewModal";

export type FoodVendorStatus = "Pending" | "Approved" | "Rejected";

export interface FoodVendorApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessLicenseNumber: string;
  foodSafetyCertNumber: string;
  address: string;
  status: FoodVendorStatus;
  appliedDate: string;
  documents: SubmittedDocument[];
  ai_status?: string;
  ai_score?: string;
  rejection_reason?: string | null;
}

export interface FoodVendorCountResponse {
  count: number;
}

export async function getFoodVendors(
  status?: "pending" | "approved" | "rejected"
): Promise<FoodVendorApplication[]> {
  const response = await apiClient.get<FoodVendorApplication[]>(
    "/api/auth/admin/food-vendors",
    status
      ? {
          params: { status },
        }
      : undefined
  );

  return response.data.map((vendor) => ({
    ...vendor,
    id: String(vendor.id),
  }));
}

export async function getFoodVendorCount(
  status?: "pending" | "approved" | "rejected"
): Promise<number> {
  const response = await apiClient.get<FoodVendorCountResponse>(
    "/api/auth/admin/food-vendors/count",
    status
      ? {
          params: { status },
        }
      : undefined
  );

  return response.data.count;
}

export async function updateFoodVendorStatus(
  applicationId: string,
  status: FoodVendorStatus
): Promise<FoodVendorApplication> {
  const response = await apiClient.patch<FoodVendorApplication>(
    `/api/auth/admin/food-vendors/${applicationId}`,
    {
      status,
    }
  );

  return {
    ...response.data,
    id: String(response.data.id),
  };
}