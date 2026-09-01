"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Database,
  Menu,
  Plus,
  Search,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner";

type Food = {
  id: string;
  name: string;
  category: string;
  serving: string;
  servingAmount: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
};

type MealIngredient = {
  id: string;
  foodId: string;
  quantity: number;
};

type Meal = {
  id: string;
  name: string;
  type: MealType;
  ingredients: MealIngredient[];
};

const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Lunch",
  "Snack",
  "Dinner",
];

/*
 * TEMPORARY FOOD DATABASE
 *
 * Later this data will come from:
 *
 * PostgreSQL → Django REST API → Next.js
 *
 * These values are only for frontend development.
 */

const FOOD_DATABASE: Food[] = [
  {
    id: "FOOD-001",
    name: "Egg",
    category: "Protein",
    serving: "1 egg",
    servingAmount: 1,
    servingUnit: "egg",
    calories: 70,
    protein: 6,
    carbohydrates: 0.4,
    fat: 5,
    fiber: 0,
  },
  {
    id: "FOOD-002",
    name: "Chicken Breast",
    category: "Protein",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 165,
    protein: 31,
    carbohydrates: 0,
    fat: 3.6,
    fiber: 0,
  },
  {
    id: "FOOD-003",
    name: "Fish",
    category: "Protein",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 130,
    protein: 26,
    carbohydrates: 0,
    fat: 2.5,
    fiber: 0,
  },
  {
    id: "FOOD-004",
    name: "Beef",
    category: "Protein",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 250,
    protein: 26,
    carbohydrates: 0,
    fat: 17,
    fiber: 0,
  },
  {
    id: "FOOD-005",
    name: "Injera",
    category: "Grains",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 170,
    protein: 5,
    carbohydrates: 35,
    fat: 1,
    fiber: 2,
  },
  {
    id: "FOOD-006",
    name: "Brown Rice",
    category: "Grains",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 123,
    protein: 2.7,
    carbohydrates: 25.6,
    fat: 1,
    fiber: 1.6,
  },
  {
    id: "FOOD-007",
    name: "Oatmeal",
    category: "Grains",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 389,
    protein: 16.9,
    carbohydrates: 66.3,
    fat: 6.9,
    fiber: 10.6,
  },
  {
    id: "FOOD-008",
    name: "Whole Wheat Bread",
    category: "Grains",
    serving: "1 slice",
    servingAmount: 1,
    servingUnit: "slice",
    calories: 80,
    protein: 4,
    carbohydrates: 14,
    fat: 1.2,
    fiber: 2.5,
  },
  {
    id: "FOOD-009",
    name: "Avocado",
    category: "Fruits",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 160,
    protein: 2,
    carbohydrates: 8.5,
    fat: 15,
    fiber: 6.7,
  },
  {
    id: "FOOD-010",
    name: "Banana",
    category: "Fruits",
    serving: "1 medium",
    servingAmount: 1,
    servingUnit: "banana",
    calories: 105,
    protein: 1.3,
    carbohydrates: 27,
    fat: 0.4,
    fiber: 3.1,
  },
  {
    id: "FOOD-011",
    name: "Apple",
    category: "Fruits",
    serving: "1 medium",
    servingAmount: 1,
    servingUnit: "apple",
    calories: 95,
    protein: 0.5,
    carbohydrates: 25,
    fat: 0.3,
    fiber: 4.4,
  },
  {
    id: "FOOD-012",
    name: "Orange",
    category: "Fruits",
    serving: "1 medium",
    servingAmount: 1,
    servingUnit: "orange",
    calories: 62,
    protein: 1.2,
    carbohydrates: 15.4,
    fat: 0.2,
    fiber: 3.1,
  },
  {
    id: "FOOD-013",
    name: "Tomato",
    category: "Vegetables",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 18,
    protein: 0.9,
    carbohydrates: 3.9,
    fat: 0.2,
    fiber: 1.2,
  },
  {
    id: "FOOD-014",
    name: "Carrot",
    category: "Vegetables",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 41,
    protein: 0.9,
    carbohydrates: 9.6,
    fat: 0.2,
    fiber: 2.8,
  },
  {
    id: "FOOD-015",
    name: "Spinach",
    category: "Vegetables",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 23,
    protein: 2.9,
    carbohydrates: 3.6,
    fat: 0.4,
    fiber: 2.2,
  },
  {
    id: "FOOD-016",
    name: "Broccoli",
    category: "Vegetables",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 34,
    protein: 2.8,
    carbohydrates: 7,
    fat: 0.4,
    fiber: 2.6,
  },
  {
    id: "FOOD-017",
    name: "Milk",
    category: "Dairy",
    serving: "1 cup",
    servingAmount: 1,
    servingUnit: "cup",
    calories: 122,
    protein: 8.1,
    carbohydrates: 12,
    fat: 4.8,
    fiber: 0,
  },
  {
    id: "FOOD-018",
    name: "Greek Yogurt",
    category: "Dairy",
    serving: "100 g",
    servingAmount: 100,
    servingUnit: "g",
    calories: 59,
    protein: 10,
    carbohydrates: 3.6,
    fat: 0.4,
    fiber: 0,
  },
  {
    id: "FOOD-019",
    name: "Lentils",
    category: "Legumes",
    serving: "100 g cooked",
    servingAmount: 100,
    servingUnit: "g",
    calories: 116,
    protein: 9,
    carbohydrates: 20,
    fat: 0.4,
    fiber: 7.9,
  },
  {
    id: "FOOD-020",
    name: "Chickpeas",
    category: "Legumes",
    serving: "100 g cooked",
    servingAmount: 100,
    servingUnit: "g",
    calories: 164,
    protein: 8.9,
    carbohydrates: 27.4,
    fat: 2.6,
    fiber: 7.6,
  },
  {
    id: "FOOD-021",
    name: "Almonds",
    category: "Nuts & Seeds",
    serving: "30 g",
    servingAmount: 30,
    servingUnit: "g",
    calories: 174,
    protein: 6.4,
    carbohydrates: 6.1,
    fat: 15,
    fiber: 3.2,
  },
  {
    id: "FOOD-022",
    name: "Peanuts",
    category: "Nuts & Seeds",
    serving: "30 g",
    servingAmount: 30,
    servingUnit: "g",
    calories: 170,
    protein: 7.3,
    carbohydrates: 4.8,
    fat: 14.6,
    fiber: 2.4,
  },
];

/*
 * TEMPORARY MEALS
 *
 * These demonstrate how the Meal Library will look
 * before the backend is connected.
 */

const INITIAL_MEALS: Meal[] = [
  {
    id: "MEAL-001",
    name: "Injera & Eggs Breakfast",
    type: "Breakfast",
    ingredients: [
      {
        id: "ING-001",
        foodId: "FOOD-005",
        quantity: 150,
      },
      {
        id: "ING-002",
        foodId: "FOOD-001",
        quantity: 2,
      },
      {
        id: "ING-003",
        foodId: "FOOD-009",
        quantity: 50,
      },
    ],
  },
  {
    id: "MEAL-002",
    name: "Chicken Rice Bowl",
    type: "Lunch",
    ingredients: [
      {
        id: "ING-004",
        foodId: "FOOD-002",
        quantity: 150,
      },
      {
        id: "ING-005",
        foodId: "FOOD-006",
        quantity: 150,
      },
      {
        id: "ING-006",
        foodId: "FOOD-013",
        quantity: 100,
      },
      {
        id: "ING-007",
        foodId: "FOOD-015",
        quantity: 50,
      },
    ],
  },
  {
    id: "MEAL-003",
    name: "Greek Yogurt & Banana",
    type: "Snack",
    ingredients: [
      {
        id: "ING-008",
        foodId: "FOOD-018",
        quantity: 150,
      },
      {
        id: "ING-009",
        foodId: "FOOD-010",
        quantity: 1,
      },
    ],
  },
];

type NutritionTotals = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
};

export default function MealLibraryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | MealType>(
    "All"
  );

  const [showCreateMeal, setShowCreateMeal] = useState(false);

  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<MealType>("Breakfast");

  const [ingredients, setIngredients] = useState<MealIngredient[]>([]);

  const [foodSearch, setFoodSearch] = useState("");

  const filteredMeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return meals.filter((meal) => {
      const matchesSearch =
        query.length === 0 ||
        meal.name.toLowerCase().includes(query) ||
        meal.type.toLowerCase().includes(query);

      const matchesType =
        selectedType === "All" || meal.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [meals, search, selectedType]);

  const filteredFoods = useMemo(() => {
    const query = foodSearch.trim().toLowerCase();

    if (!query) {
      return FOOD_DATABASE;
    }

    return FOOD_DATABASE.filter(
      (food) =>
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query)
    );
  }, [foodSearch]);

  const calculateIngredientNutrition = (
    ingredient: MealIngredient
  ): NutritionTotals => {
    const food = FOOD_DATABASE.find(
      (item) => item.id === ingredient.foodId
    );

    if (!food) {
      return {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
      };
    }

    const multiplier = ingredient.quantity / food.servingAmount;

    return {
      calories: food.calories * multiplier,
      protein: food.protein * multiplier,
      carbohydrates: food.carbohydrates * multiplier,
      fat: food.fat * multiplier,
      fiber: food.fiber * multiplier,
    };
  };

  const calculateMealNutrition = (
    mealIngredients: MealIngredient[]
  ): NutritionTotals => {
    return mealIngredients.reduce(
      (total, ingredient) => {
        const nutrition = calculateIngredientNutrition(ingredient);

        return {
          calories: total.calories + nutrition.calories,
          protein: total.protein + nutrition.protein,
          carbohydrates:
            total.carbohydrates + nutrition.carbohydrates,
          fat: total.fat + nutrition.fat,
          fiber: total.fiber + nutrition.fiber,
        };
      },
      {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
      }
    );
  };

  const currentMealNutrition = calculateMealNutrition(ingredients);

  function addFood(food: Food) {
    const existingIngredient = ingredients.find(
      (ingredient) => ingredient.foodId === food.id
    );

    if (existingIngredient) {
      setIngredients((current) =>
        current.map((ingredient) =>
          ingredient.id === existingIngredient.id
            ? {
                ...ingredient,
                quantity:
                  ingredient.quantity + food.servingAmount,
              }
            : ingredient
        )
      );

      return;
    }

    setIngredients((current) => [
      ...current,
      {
        id: `ING-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        foodId: food.id,
        quantity: food.servingAmount,
      },
    ]);
  }

  function updateIngredientQuantity(
    ingredientId: string,
    quantity: number
  ) {
    const safeQuantity = Number.isFinite(quantity)
      ? Math.max(0, quantity)
      : 0;

    setIngredients((current) =>
      current.map((ingredient) =>
        ingredient.id === ingredientId
          ? {
              ...ingredient,
              quantity: safeQuantity,
            }
          : ingredient
      )
    );
  }

  function removeIngredient(ingredientId: string) {
    setIngredients((current) =>
      current.filter((ingredient) => ingredient.id !== ingredientId)
    );
  }

  function resetCreateMeal() {
    setMealName("");
    setMealType("Breakfast");
    setIngredients([]);
    setFoodSearch("");
  }

  function handleCreateMeal() {
    if (!mealName.trim()) {
      return;
    }

    if (ingredients.length === 0) {
      return;
    }

    const newMeal: Meal = {
      id: `MEAL-${Date.now()}`,
      name: mealName.trim(),
      type: mealType,
      ingredients,
    };

    setMeals((current) => [newMeal, ...current]);

    resetCreateMeal();
    setShowCreateMeal(false);
  }

  function deleteMeal(mealId: string) {
    setMeals((current) =>
      current.filter((meal) => meal.id !== mealId)
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      <MobileHeader setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Back */}
          <Link
            href="/nutritionist/dashboard"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <Utensils size={21} />
              </div>

              <h1 className="font-display text-[30px] text-[#2D312E]">
                Meal Library
              </h1>

              <p className="font-body mt-2 max-w-2xl text-[12px] leading-5 text-[#2D312E]/45">
                Create reusable meals from foods in the database.
                Nutrition values are calculated automatically from
                the selected foods and quantities.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetCreateMeal();
                setShowCreateMeal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[11px] font-bold text-white transition hover:bg-[#2D312E]"
            >
              <Plus size={15} />
              Create Meal
            </button>
          </div>

          {/* Information Card */}
          <div className="mb-6 rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D5A4C] text-white">
                <Database size={16} />
              </div>

              <div>
                <h2 className="font-body text-[11px] font-bold text-[#3D5A4C]">
                  Automatic nutrition calculation
                </h2>

                <p className="font-body mt-1 text-[10px] leading-5 text-[#3D5A4C]/65">
                  Select foods from the Food Database and enter the
                  quantity. Calories, protein, carbohydrates, fat and
                  fiber are calculated automatically. You do not need
                  to manually enter nutritional values.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-4 shadow-sm sm:p-5">
            <div className="relative max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search meals..."
                className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-3 pl-11 pr-10 font-body text-[11px] text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#2D312E]/35 hover:bg-[#E9F0EC] hover:text-[#3D5A4C]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedType("All")}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-body text-[10px] font-semibold transition ${
                  selectedType === "All"
                    ? "bg-[#3D5A4C] text-white"
                    : "bg-[#F3F5F2] text-[#3D5A4C]/65 hover:bg-[#E9F0EC]"
                }`}
              >
                All
              </button>

              {MEAL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 font-body text-[10px] font-semibold transition ${
                    selectedType === type
                      ? "bg-[#3D5A4C] text-white"
                      : "bg-[#F3F5F2] text-[#3D5A4C]/65 hover:bg-[#E9F0EC]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Cards */}
          {filteredMeals.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMeals.map((meal) => {
                const nutrition = calculateMealNutrition(
                  meal.ingredients
                );

                return (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    nutrition={nutrition}
                    onDelete={deleteMeal}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                <Utensils size={20} />
              </div>

              <h2 className="font-display mt-4 text-[19px]">
                No meals found
              </h2>

              <p className="font-body mx-auto mt-2 max-w-sm text-[10px] leading-5 text-[#2D312E]/40">
                Try a different search or create a new meal for the
                meal library.
              </p>

              <button
                type="button"
                onClick={() => {
                  resetCreateMeal();
                  setShowCreateMeal(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-2.5 font-body text-[10px] font-bold text-white hover:bg-[#2D312E]"
              >
                <Plus size={14} />
                Create Meal
              </button>
            </div>
          )}

          {/* Create Meal Section */}
          {showCreateMeal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D312E]/30 p-4 backdrop-blur-[2px] sm:p-6">
              <div className="mx-auto my-4 max-w-6xl overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-xl sm:my-8">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                        <Utensils size={17} />
                      </div>

                      <div>
                        <h2 className="font-display text-[21px]">
                          Create Meal
                        </h2>

                        <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                          Build a meal using foods from the database.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCreateMeal(false)}
                    className="rounded-xl p-2 text-[#2D312E]/40 hover:bg-[#F3F5F2] hover:text-[#3D5A4C]"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid lg:grid-cols-[1fr_340px]">
                  {/* Builder */}
                  <div className="border-b border-[#2D312E]/[0.06] p-5 lg:border-b-0 lg:border-r sm:p-6">
                    {/* Meal Details */}
                    <div className="mb-6 grid gap-5 sm:grid-cols-2">
                      <label className="block sm:col-span-2">
                        <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                          Meal Name
                        </span>

                        <input
                          type="text"
                          value={mealName}
                          onChange={(e) =>
                            setMealName(e.target.value)
                          }
                          placeholder="e.g. Injera & Eggs Breakfast"
                          className="mt-2 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                          Meal Type
                        </span>

                        <div className="relative mt-2">
                          <select
                            value={mealType}
                            onChange={(e) =>
                              setMealType(
                                e.target.value as MealType
                              )
                            }
                            className="w-full appearance-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 pr-10 font-body text-[11px] outline-none focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                          >
                            {MEAL_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3D5A4C]"
                          />
                        </div>
                      </label>
                    </div>

                    {/* Selected Ingredients */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-[18px]">
                            Meal Ingredients
                          </h3>

                          <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                            Select foods and adjust their quantities.
                          </p>
                        </div>

                        <span className="rounded-full bg-[#E9F0EC] px-3 py-1.5 font-body text-[9px] font-bold text-[#3D5A4C]">
                          {ingredients.length}{" "}
                          {ingredients.length === 1
                            ? "food"
                            : "foods"}
                        </span>
                      </div>

                      {ingredients.length > 0 ? (
                        <div className="space-y-3">
                          {ingredients.map((ingredient) => {
                            const food = FOOD_DATABASE.find(
                              (item) =>
                                item.id === ingredient.foodId
                            );

                            if (!food) {
                              return null;
                            }

                            const nutrition =
                              calculateIngredientNutrition(
                                ingredient
                              );

                            return (
                              <div
                                key={ingredient.id}
                                className="rounded-xl border border-[#2D312E]/[0.07] bg-[#FAF9F6] p-4"
                              >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="font-body text-[11px] font-bold">
                                      {food.name}
                                    </p>

                                    <p className="font-body mt-1 text-[9px] text-[#2D312E]/40">
                                      {food.category} · Base serving:{" "}
                                      {food.serving}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeIngredient(
                                        ingredient.id
                                      )
                                    }
                                    className="self-start rounded-lg p-2 text-[#2D312E]/30 transition hover:bg-red-50 hover:text-red-500 sm:self-auto"
                                    aria-label={`Remove ${food.name}`}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr] sm:items-center">
                                  <label>
                                    <span className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                                      Quantity
                                    </span>

                                    <div className="mt-1 flex items-center overflow-hidden rounded-xl border border-[#2D312E]/[0.08] bg-white">
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={
                                          ingredient.quantity
                                        }
                                        onChange={(e) =>
                                          updateIngredientQuantity(
                                            ingredient.id,
                                            Number(
                                              e.target.value
                                            )
                                          )
                                        }
                                        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-body text-[11px] outline-none"
                                      />

                                      <span className="border-l border-[#2D312E]/[0.06] px-3 font-body text-[9px] text-[#2D312E]/40">
                                        {food.servingUnit}
                                      </span>
                                    </div>
                                  </label>

                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    <MiniNutrition
                                      label="Calories"
                                      value={`${formatNumber(
                                        nutrition.calories
                                      )} kcal`}
                                    />

                                    <MiniNutrition
                                      label="Protein"
                                      value={`${formatNumber(
                                        nutrition.protein
                                      )} g`}
                                    />

                                    <MiniNutrition
                                      label="Carbs"
                                      value={`${formatNumber(
                                        nutrition.carbohydrates
                                      )} g`}
                                    />

                                    <MiniNutrition
                                      label="Fat"
                                      value={`${formatNumber(
                                        nutrition.fat
                                      )} g`}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-[#CCD6C4] bg-[#F8F9F7] px-5 py-10 text-center">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                            <Plus size={18} />
                          </div>

                          <p className="font-body mt-3 text-[11px] font-bold">
                            No ingredients added
                          </p>

                          <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                            Select foods from the database on the right.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Food Picker + Nutrition Summary */}
                  <div className="bg-[#F8F9F7] p-5 sm:p-6">
                    <div className="mb-4">
                      <h3 className="font-display text-[18px]">
                        Add Food
                      </h3>

                      <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                        Choose an ingredient from the Food Database.
                      </p>
                    </div>

                    <div className="relative">
                      <Search
                        size={14}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D312E]/35"
                      />

                      <input
                        type="text"
                        value={foodSearch}
                        onChange={(e) =>
                          setFoodSearch(e.target.value)
                        }
                        placeholder="Search foods..."
                        className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-white py-3 pl-10 pr-4 font-body text-[10px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                      />
                    </div>

                    <div className="mt-3 max-h-[310px] space-y-2 overflow-y-auto pr-1">
                      {filteredFoods.map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          onClick={() => addFood(food)}
                          className="w-full rounded-xl border border-[#2D312E]/[0.06] bg-white p-3 text-left transition hover:border-[#4E876E]/30 hover:bg-[#FAF9F6]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-body text-[10px] font-bold">
                                {food.name}
                              </p>

                              <p className="mt-1 font-body text-[8px] text-[#2D312E]/35">
                                {food.category} · {food.serving}
                              </p>
                            </div>

                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#3D5A4C]">
                              <Plus size={13} />
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            <span className="font-body text-[8px] font-semibold text-[#2D312E]/50">
                              {formatNumber(food.calories)} kcal
                            </span>

                            <span className="font-body text-[8px] font-semibold text-[#3D5A4C]">
                              {formatNumber(food.protein)} g protein
                            </span>
                          </div>
                        </button>
                      ))}

                      {filteredFoods.length === 0 && (
                        <div className="rounded-xl bg-white px-4 py-8 text-center">
                          <p className="font-body text-[10px] text-[#2D312E]/40">
                            No foods found.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Total Nutrition */}
                    <div className="mt-5 rounded-2xl bg-[#3D5A4C] p-4 text-white">
                      <p className="font-body text-[9px] font-bold uppercase tracking-wider text-white/55">
                        Meal Nutrition
                      </p>

                      <div className="mt-3">
                        <p className="font-display text-[25px]">
                          {formatNumber(
                            currentMealNutrition.calories
                          )}{" "}
                          <span className="font-body text-[10px] text-white/55">
                            kcal
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <TotalNutrition
                          label="Protein"
                          value={currentMealNutrition.protein}
                        />

                        <TotalNutrition
                          label="Carbs"
                          value={currentMealNutrition.carbohydrates}
                        />

                        <TotalNutrition
                          label="Fat"
                          value={currentMealNutrition.fat}
                        />

                        <TotalNutrition
                          label="Fiber"
                          value={currentMealNutrition.fiber}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#2D312E]/[0.06] p-5 sm:flex-row sm:justify-end sm:p-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateMeal(false)}
                    className="flex items-center justify-center rounded-xl border border-[#CCD6C4] px-6 py-3 font-body text-[11px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateMeal}
                    disabled={
                      !mealName.trim() ||
                      ingredients.length === 0
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 font-body text-[11px] font-bold text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check size={15} />
                    Save Meal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function MealCard({
  meal,
  nutrition,
  onDelete,
}: {
  meal: Meal;
  nutrition: NutritionTotals;
  onDelete: (mealId: string) => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm transition hover:shadow-md">
      <div className="border-b border-[#2D312E]/[0.06] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <Utensils size={17} />
            </div>

            <div className="min-w-0">
              <h2 className="font-display truncate text-[17px]">
                {meal.name}
              </h2>

              <span className="mt-1 inline-flex rounded-full bg-[#F3F5F2] px-2.5 py-1 font-body text-[8px] font-bold text-[#3D5A4C]">
                {meal.type}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDelete(meal.id)}
            className="rounded-lg p-2 text-[#2D312E]/25 transition hover:bg-red-50 hover:text-red-500"
            aria-label={`Delete ${meal.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-[#FAF9F6] p-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-[9px] text-[#2D312E]/40">
              Meal calories
            </span>

            <span className="font-body text-[11px] font-bold text-[#2D312E]">
              {formatNumber(nutrition.calories)} kcal
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <SmallStat
              label="Protein"
              value={nutrition.protein}
            />

            <SmallStat
              label="Carbs"
              value={nutrition.carbohydrates}
            />

            <SmallStat label="Fat" value={nutrition.fat} />
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
          Ingredients
        </p>

        <div className="mt-3 space-y-2">
          {meal.ingredients.map((ingredient) => {
            const food = FOOD_DATABASE.find(
              (item) => item.id === ingredient.foodId
            );

            if (!food) {
              return null;
            }

            return (
              <div
                key={ingredient.id}
                className="flex items-center justify-between gap-3"
              >
                <span className="font-body text-[10px] text-[#2D312E]/65">
                  {food.name}
                </span>

                <span className="font-body text-[9px] font-semibold text-[#2D312E]/35">
                  {formatNumber(ingredient.quantity)}{" "}
                  {food.servingUnit}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#2D312E]/[0.06] pt-4">
          <span className="font-body text-[9px] text-[#2D312E]/35">
            {meal.ingredients.length} ingredients
          </span>

          <span className="font-body text-[9px] font-semibold text-[#4E876E]">
            Ready to use in plans
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniNutrition({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white px-2.5 py-2">
      <p className="font-body text-[7px] font-bold uppercase tracking-wider text-[#2D312E]/30">
        {label}
      </p>

      <p className="mt-1 font-body text-[9px] font-bold text-[#3D5A4C]">
        {value}
      </p>
    </div>
  );
}

function TotalNutrition({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2.5">
      <p className="font-body text-[8px] text-white/50">
        {label}
      </p>

      <p className="mt-0.5 font-body text-[10px] font-bold">
        {formatNumber(value)} g
      </p>
    </div>
  );
}

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="font-body text-[8px] text-[#2D312E]/35">
        {label}
      </p>

      <p className="mt-0.5 font-body text-[10px] font-bold text-[#3D5A4C]">
        {formatNumber(value)} g
      </p>
    </div>
  );
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(1);
}

function MobileHeader({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
      <Link href="/nutritionist/dashboard">
        <div className="flex items-center">
          <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
            +
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="rounded-xl p-2 text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
    </div>
  );
}