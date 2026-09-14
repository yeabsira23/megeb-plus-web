import apiClient from "../client";

export type ClientStatus = "Active" | "Suspended" | "Inactive";

export interface Client {
  id: string;
  name: string;
  age: number;
  assignedNutritionist: string | null;
  nextAppointment: {
  date: string;
  time: string;
};
  status: ClientStatus;
}

export interface ClientDetails extends Client {
  gender: string;
  phone: string;
  email: string;
  joinedDate: string;

  height: string;
  currentWeight: string;
  targetWeight: string;
  bmi: string;

  goal: string;
  goalDescription: string;

  medicalCondition: string;
  activityLevel: string;
  allergies: string;

  nutritionPlan: string;
  calories: string;
  dietType: string[];

  progress: {
    startingWeight: string;
    currentWeight: string;
    weightLost: string;
  };

  nextAppointmentDetails: {
    date: string;
    time: string;
  };

  appointments: {
    date: string;
    time: string;
    type: string;
    status: "Completed" | "Upcoming" | "Cancelled";
    notes: string;
  }[];

  nutritionistNotes: string;
}

export async function getClients(): Promise<Client[]> {
  const response = await apiClient.get<Client[]>(
    "/api/auth/admin/clients"
  );

  return response.data;
}

export async function getClient(
  clientId: string
): Promise<ClientDetails> {
  const response = await apiClient.get<ClientDetails>(
    `/api/auth/admin/clients/${clientId}`
  );

  return response.data;
}

export async function updateClientStatus(
  clientId: string,
  status: ClientStatus
): Promise<ClientDetails> {
  const response = await apiClient.patch<ClientDetails>(
    `/api/auth/admin/clients/${clientId}`,
    { status }
  );

  return response.data;
}