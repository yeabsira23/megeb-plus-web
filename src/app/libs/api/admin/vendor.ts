import apiClient from "../client";

export interface VendorProduct {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface VendorRegistrationData {
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  businessAddress: string;
  businessType: string;
  licenseNumber: string;
  licenseFile: File;
  foodSafetyCertFile: File;
  ownerIdFile: File;
  products: VendorProduct[];
}

export async function registerVendor(
  data: VendorRegistrationData
) {
  const formData = new FormData();

  formData.append("owner_name", data.ownerName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("password", data.password);

  formData.append("business_name", data.businessName);
  formData.append("business_address", data.businessAddress);
  formData.append("business_type", data.businessType);
  formData.append("license_number", data.licenseNumber);

  formData.append("license_document", data.licenseFile);
  formData.append(
    "food_safety_certificate",
    data.foodSafetyCertFile
  );
  formData.append("owner_id_document", data.ownerIdFile);

  formData.append("products", JSON.stringify(data.products));

  const response = await apiClient.post(
    "/api/vendors/register/",
    formData
  );

  return response.data;
}