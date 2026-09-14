import apiClient from "../client";

export interface FoodItem {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  photoUrl: string | null;
}

export interface CreateFoodItem {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photo?: File | null;
}

export async function getFoodItems(): Promise<FoodItem[]> {
  const response = await apiClient.get<FoodItem[]>(
    "/api/auth/admin/food"
  );

  return response.data;
}

export async function createFoodItem(
  food: CreateFoodItem
): Promise<FoodItem> {
  const formData = new FormData();

  formData.append("name", food.name);
  formData.append("category", food.category);
  formData.append("calories", String(food.calories));
  formData.append("protein", String(food.protein));
  formData.append("carbs", String(food.carbs));
  formData.append("fat", String(food.fat));

  if (food.photo) {
    formData.append("photo", food.photo);
  }

  const response = await apiClient.post<FoodItem>(
    "/api/auth/admin/food",
    formData
  );

  return response.data;
}