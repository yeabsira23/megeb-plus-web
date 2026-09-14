import apiClient from "../client";

export type PaymentStatus =
  | "successful"
  | "pending"
  | "failed"
  | "cancelled"
  | "expired";

export interface PaymentParty {
  id: number;
  name: string;
}

export interface AdminPayment {
  reference: string;
  appointmentId: number;
  client: PaymentParty;
  nutritionist: PaymentParty;
  amount: number;
  platformFee: number;
  nutritionistAmount: number;
  currency: string;
  status: PaymentStatus;
  starpayOrderId: string;
  createdAt: string;
  paidAt: string | null;
}

interface AdminPaymentsResponse {
  success: boolean;
  summary?: unknown;
  payments: AdminPayment[];
}

export async function getAdminPayments(): Promise<AdminPayment[]> {
  const response = await apiClient.get<AdminPaymentsResponse>(
    "/api/payments/admin/"
  );

  return response.data.payments;
}